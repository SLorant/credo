export const imageAnimations = () => {
  if (window.innerWidth < 768) return;
  const container = document.getElementById("services-wrapper");
  const cards = document.querySelectorAll<HTMLElement>(".card");

  if (!container || cards.length === 0) return;

  // Adjust movement range based on screen size for better performance
  const getMaxMove = () => {
    if (window.innerWidth >= 1920) return 50; // Full HD and above
    if (window.innerWidth >= 1440) return 35; // Smaller screens
    return 25; // Even smaller screens
  };

  let animationFrameId: number | null = null;
  let lastX = 0;
  let lastY = 0;

  // Throttled animation update using requestAnimationFrame
  const updateImagePositions = (moveX: number, moveY: number) => {
    if (animationFrameId !== null) return;

    animationFrameId = requestAnimationFrame(() => {
      cards.forEach((card) => {
        const cardImgTop = card.querySelector<HTMLElement>(".cardimgtop");
        if (cardImgTop) {
          // Use transform with will-change for better performance
          cardImgTop.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          cardImgTop.style.transition = "transform 0.1s ease-out";
        }
      });
      animationFrameId = null;
    });
  };

  // Mouse movement parallax effect for card images
  container.addEventListener("mousemove", (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate movement as percentage of container size
    const xPercent = (x / rect.width - 0.5) * 2; // Range: -1 to 1
    const yPercent = (y / rect.height - 0.5) * 2; // Range: -1 to 1

    // Apply subtle movement (scaled based on screen size)
    const maxMove = getMaxMove();
    const moveX = xPercent * maxMove;
    const moveY = yPercent * maxMove;

    // Only update if movement is significant (reduces unnecessary updates)
    if (Math.abs(moveX - lastX) > 0.5 || Math.abs(moveY - lastY) > 0.5) {
      lastX = moveX;
      lastY = moveY;
      updateImagePositions(moveX, moveY);
    }
  });

  // Reset position when mouse leaves container
  container.addEventListener("mouseleave", () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    cards.forEach((card) => {
      const cardImgTop = card.querySelector<HTMLElement>(".cardimgtop");
      if (cardImgTop) {
        cardImgTop.style.transform = "translate3d(0, 0, 0)";
        cardImgTop.style.transition = "transform 0.3s ease-out";
      }
    });

    lastX = 0;
    lastY = 0;
  });
};
