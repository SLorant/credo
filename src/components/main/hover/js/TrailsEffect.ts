import * as THREE from "three";
import { gsap } from "gsap";
import { EffectShell } from "./EffectShell.ts";
import "./Math.ts";

interface TrailsOptions {
  strength?: number;
  amount?: number;
  duration?: number;
}

interface CurrentItem {
  element: HTMLElement;
  img: HTMLImageElement | null;
  index: number;
  texture?: THREE.Texture;
}

export class TrailsEffect extends EffectShell {
  options: Required<TrailsOptions>;
  position!: THREE.Vector3;
  scale!: THREE.Vector3;
  scaleFactor: number = 0.55;
  geometry!: THREE.PlaneGeometry;
  uniforms!: {
    uTime: { value: number };
    uTexture: { value: THREE.Texture | null };
    uOffset: { value: THREE.Vector2 };
    uAlpha: { value: number };
  };
  material!: THREE.ShaderMaterial;
  plane!: THREE.Mesh;
  trails: THREE.Mesh[] = [];
  currentItem: CurrentItem | null = null;

  constructor(
    container: HTMLElement = document.body,
    itemsWrapper: HTMLElement | null = null,
    options: TrailsOptions = {},
  ) {
    // Initialize options before super call
    const opts = {
      strength: options.strength ?? 0.25,
      amount: options.amount ?? 5,
      duration: options.duration ?? 0.5,
    };

    super(container, itemsWrapper);
    this.options = opts;

    if (!this.container || !this.itemsWrapper) return;

    this.init();
  }

  init(): void {
    this.position = new THREE.Vector3(0, 0, 0);
    this.scale = new THREE.Vector3(1, 1, 1);
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);

    // shared uniforms
    this.uniforms = {
      uTime: {
        value: 0,
      },
      uTexture: {
        value: null,
      },
      uOffset: {
        value: new THREE.Vector2(0.0, 0.0),
      },
      uAlpha: {
        value: 0,
      },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        uniform vec2 uOffset;

        varying vec2 vUv;

        vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
          float M_PI = 3.1415926535897932384626433832795;
          position.x = position.x + (sin(uv.y * M_PI) * offset.x);
          position.y = position.y + (sin(uv.x * M_PI) * offset.y);
          return position;
        }

        void main() {
          vUv = uv;
          vec3 newPosition = position;
          newPosition = deformationCurve(position,uv,uOffset);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uAlpha;
        uniform vec2 uOffset;

        varying vec2 vUv;

        void main() {
          vec3 color = texture2D(uTexture,vUv).rgb;
          gl_FragColor = vec4(color,uAlpha);
        }
      `,
      transparent: true,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.trails = [];
    for (let i = 0; i < this.options.amount; i++) {
      const plane = this.plane.clone();
      this.trails.push(plane);
      this.scene.add(plane);
    }
  }

  onMouseEnter(): void {
    if (!this.currentItem || !this.isMouseOver) {
      this.isMouseOver = true;
      // show plane
      gsap.to(this.uniforms.uAlpha, {
        duration: 0.5,
        value: 1,
        ease: "power4.out",
      });
    }
  }

  onMouseLeave(event: MouseEvent): void {
    gsap.to(this.uniforms.uAlpha, {
      duration: 0.5,
      value: 0,
      ease: "power4.out",
    });
  }

  onMouseMove(event: MouseEvent): void {
    // project mouse position to world coordinates
    const x = this.mouse.x.map(
      -1,
      1,
      -this.viewSize.width / 2,
      this.viewSize.width / 2,
    );
    const y = this.mouse.y.map(
      -1,
      1,
      -this.viewSize.height / 2,
      this.viewSize.height / 2,
    );

    gsap.to(this.position, {
      duration: 1,
      x: x,
      y: y,
      ease: "power4.out",
      onUpdate: () => {
        // compute offset
        const offset = this.position
          .clone()
          .sub(new THREE.Vector3(x, y, 0))
          .multiplyScalar(-this.options.strength);
        this.uniforms.uOffset.value = new THREE.Vector2(offset.x, offset.y);
      },
    });

    this.trails.forEach((trail, index) => {
      const duration =
        this.options.duration * this.options.amount -
        this.options.duration * index;
      gsap.to(trail.position, {
        duration: duration,
        x: x,
        y: y,
        ease: "power4.out",
      });
    });
  }

  onMouseOver(index: number, e?: MouseEvent): void {
    if (!this.isLoaded) return;
    this.onMouseEnter();
    if (this.currentItem && this.currentItem.index === index) return;
    this.onTargetChange(index);
  }

  onTargetChange(index: number): void {
    // item target changed
    this.currentItem = this.items[index] as CurrentItem;
    if (!this.currentItem.texture || !this.currentItem.img) return;

    // compute image ratio
    const imageRatio =
      this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight;

    // Use class property for scale factor
    this.scale = new THREE.Vector3(
      imageRatio * this.scaleFactor,
      1 * this.scaleFactor,
      1,
    );
    this.uniforms.uTexture.value = this.currentItem.texture;

    this.trails.forEach((trail) => {
      trail.scale.copy(this.scale);
    });
  }
}
