import * as THREE from "three";

interface Item {
  element: HTMLElement;
  img: HTMLImageElement | null;
  index: number;
  texture?: THREE.Texture;
}

interface Viewport {
  width: number;
  height: number;
  aspectRatio: number;
}

interface ViewSize {
  width: number;
  height: number;
  vFov: number;
}

export class EffectShell {
  container: HTMLElement;
  itemsWrapper: HTMLElement | null;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  mouse!: THREE.Vector2;
  timeSpeed: number = 2;
  time: number = 0;
  clock!: THREE.Clock;
  items: Item[] = [];
  isLoaded: boolean = false;
  isMouseOver: boolean = false;
  tempItemIndex: number | null = null;

  constructor(
    container: HTMLElement = document.body,
    itemsWrapper: HTMLElement | null = null,
  ) {
    this.container = container;
    this.itemsWrapper = itemsWrapper;
    if (!this.container || !this.itemsWrapper) return;
    this.setup();
    this.initEffectShell().then(() => {
      /*   console.log("load finished"); */
      this.isLoaded = true;
      if (this.isMouseOver && this.tempItemIndex !== null) {
        this.onMouseOver(this.tempItemIndex);
      }
      this.tempItemIndex = null;
    });
    this.createEventsListeners();
  }

  setup(): void {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 3);

    // mouse
    this.mouse = new THREE.Vector2();

    // time
    this.timeSpeed = 2;
    this.time = 0;
    this.clock = new THREE.Clock();

    // animation loop
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render(): void {
    // called every frame
    this.time += this.clock.getDelta() * this.timeSpeed;
    this.renderer.render(this.scene, this.camera);
  }

  initEffectShell(): Promise<void> {
    const promises: Promise<{
      texture: THREE.Texture | null;
      index: number;
    }>[] = [];

    this.items = this.itemsElements;

    const THREEtextureLoader = new THREE.TextureLoader();
    this.items.forEach((item, index) => {
      // create textures
      promises.push(
        this.loadTexture(
          THREEtextureLoader,
          item.img ? item.img.src : null,
          index,
        ),
      );
    });

    return new Promise((resolve) => {
      // resolve textures promises
      Promise.all(promises).then((promiseResults) => {
        // all textures are loaded
        promiseResults.forEach((promise, index) => {
          // assign texture to item
          if (promise.texture) {
            this.items[index].texture = promise.texture;
          }
        });
        resolve();
      });
    });
  }

  createEventsListeners(): void {
    this.items.forEach((item, index) => {
      item.element.addEventListener(
        "mouseover",
        this._onMouseOver.bind(this, index),
        false,
      );
    });

    this.container.addEventListener(
      "mousemove",
      this._onMouseMove.bind(this),
      false,
    );

    if (this.itemsWrapper) {
      this.itemsWrapper.addEventListener(
        "mouseleave",
        this._onMouseLeave.bind(this),
        false,
      );
    }
  }

  _onMouseLeave(event: MouseEvent): void {
    this.isMouseOver = false;
    this.onMouseLeave(event);
  }

  _onMouseMove(event: MouseEvent): void {
    // get normalized mouse position relative to container
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.viewport.width) * 2 - 1;
    this.mouse.y =
      -((event.clientY - rect.top) / this.viewport.height) * 2 + 0.8;

    this.onMouseMove(event);
  }

  _onMouseOver(index: number, event: MouseEvent): void {
    this.tempItemIndex = index;
    this.onMouseOver(index, event);
  }

  onWindowResize(): void {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  onUpdate(): void {}

  onMouseEnter(event?: MouseEvent): void {}

  onMouseLeave(event: MouseEvent): void {}

  onMouseMove(event: MouseEvent): void {}

  onMouseOver(index: number, event?: MouseEvent): void {}

  get viewport(): Viewport {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  get viewSize(): ViewSize {
    // fit plane to screen
    // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

    const distance = this.camera.position.z;
    const vFov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * this.viewport.aspectRatio;
    return { width, height, vFov };
  }

  get itemsElements(): Item[] {
    if (!this.itemsWrapper) return [];

    // convert NodeList to Array
    const items = [
      ...this.itemsWrapper.querySelectorAll(".effectlink"),
    ] as HTMLElement[];

    // create Array of items including element, image and index
    return items.map((item, index) => ({
      element: item,
      img: item.querySelector(".content__img") as HTMLImageElement | null,
      index: index,
    }));
  }

  loadTexture(
    loader: THREE.TextureLoader,
    url: string | null,
    index: number,
  ): Promise<{ texture: THREE.Texture | null; index: number }> {
    // https://threejs.org/docs/#api/en/loaders/TextureLoader
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve({ texture: null, index });
        return;
      }
      // load a resource
      loader.load(
        // resource URL
        url,

        // onLoad callback
        (texture) => {
          resolve({ texture, index });
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        (error) => {
          console.error("An error happened.", error);
          reject(error);
        },
      );
    });
  }
}
