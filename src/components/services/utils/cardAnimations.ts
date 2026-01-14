export const cardAnimations = () => {
  const wrapper = document.getElementById("services-wrapper");
  const container = document.getElementById("uzletagak");
  const cards = document.querySelectorAll<HTMLElement>(".card");
  const totalCards = cards.length;

  let currentCard = 0;
  let scrollProgress = 0;

  // Helper function to get responsive scale
  const getResponsiveScale = (baseScale: number) => {
    if (window.innerWidth <= 1200 && window.innerWidth > 768) {
      return baseScale * 0.7;
    }
    return baseScale;
  };

  function updateCards() {
    if (!wrapper || !container) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = rect.top;
    const wrapperHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // Start animation earlier - when header is just visible (top is at 80% viewport)
    const startThreshold =
      viewportHeight >= 800 ? viewportHeight * 0.6 : viewportHeight * 0.65;

    // Only start when wrapper enters viewport
    if (wrapperTop > startThreshold) {
      // Haven't reached the section yet
      cards.forEach((card, index) => {
        if (index === 0) {
          // First card should be visible and ready to slide in
          card.style.opacity = "0";
          card.style.transform = `translate(-50%, calc(-50% + ${
            window.innerHeight
          }px)) scale(${getResponsiveScale(1)})`;
          card.style.pointerEvents = "none";
        } else {
          // Other cards hidden
          card.style.opacity = "0";
          card.style.transform = `translate(-50%, calc(-50% + ${
            window.innerHeight
          }px)) scale(${getResponsiveScale(1)})`;
          card.style.pointerEvents = "none";
        }
      });
      return;
    }

    // Calculate how far we've scrolled into the wrapper
    // Adjust calculation to account for early start
    const scrolledIntoWrapper = Math.abs(wrapperTop - startThreshold);
    const totalScrollDistance = wrapperHeight - viewportHeight + startThreshold;

    // Calculate progress (0 to 1)
    scrollProgress = Math.max(
      0,
      Math.min(1, scrolledIntoWrapper / totalScrollDistance)
    );

    // Each card gets equal scroll space
    const progressPerCard = 1 / totalCards;

    // Update each card based on scroll progress
    cards.forEach((card, index) => {
      const cardStartProgress = index * progressPerCard;
      const cardEndProgress = (index + 1) * progressPerCard;
      const isLastCard = index === totalCards - 1;
      const isFirstCard = index === 0;

      // Calculate how far through this card's transition we are
      let cardProgress = 0;
      let opacity = 0;
      let scale = 0.85;
      let yOffset = 100;
      let isExiting = false;

      if (scrollProgress < cardStartProgress) {
        // Card hasn't started yet - hidden below with full opacity and scale
        cardProgress = 0;
        opacity = 1;
        scale = 1;
        yOffset = window.innerHeight; // Start from bottom of viewport
      } else if (scrollProgress > cardEndProgress) {
        // Card has finished - fading out while staying in place
        isExiting = true;
        const fadeOutProgress = Math.min(
          1,
          (scrollProgress - cardEndProgress) / (progressPerCard * 0.5)
        );
        opacity = 1 - fadeOutProgress;
        scale = 1 - fadeOutProgress * 0.15; // Shrink slightly while fading
        yOffset = 0; // Stay centered
      } else {
        // Card is active - calculate its phase
        const localProgress =
          (scrollProgress - cardStartProgress) / progressPerCard;

        // Split into phases: slide-in (0-0.6), hold (0.6-0.8), prepare-exit (0.8-1.0)
        if (localProgress < 0.6) {
          // Sliding in from bottom with full opacity and scale (slower - 60% of time)
          const slideInProgress = localProgress / 0.6;
          opacity = 1;
          scale = 1;
          yOffset = window.innerHeight - slideInProgress * window.innerHeight;
        } else if (localProgress < 0.8) {
          // Full visibility - hold steady
          opacity = 1;
          scale = 1;
          yOffset = 0;
        } else {
          // Preparing to exit but still fully visible
          // For the last card, start fading out in this phase
          if (isLastCard) {
            const exitProgress = (localProgress - 0.8) / 0.2;
            opacity = 1 - exitProgress;
            scale = 1 - exitProgress * 0.15;
            yOffset = 0;
          } else {
            opacity = 1;
            scale = 1;
            yOffset = 0;
          }
        }
      }

      // Apply styles
      card.style.opacity = opacity.toString();
      card.style.transform = `translate(-50%, calc(-50% + ${yOffset}px)) scale(${getResponsiveScale(
        scale
      )})`;
      if (index === 0) {
        card.style.transition = "opacity 0.3s ease-out";
      } else {
        card.style.transition =
          "opacity 0.3s ease-out, transform 0.3s ease-out";
      }
      card.style.pointerEvents = opacity > 0.5 && !isExiting ? "auto" : "none";

      // Set z-index - each subsequent card should be higher
      // Base z-index on card index, so newer cards are always on top
      card.style.zIndex = (index * 10).toString();
    });
  }

  // Throttle function to improve performance
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCards();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Initialize
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", updateCards);

  // Initial update
  setTimeout(updateCards, 100);
};
