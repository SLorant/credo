export const handleButtons = () => {
  // Function to sync mobile close button position with mobile button
  const syncMobileCloseButtonPosition = () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const mobileButton =
        card.querySelector<HTMLButtonElement>(".mobilebutton");
      const mobileCloseButton = card.querySelector<HTMLButtonElement>(
        ".mobile-close-button"
      );

      if (mobileButton && mobileCloseButton) {
        const mobileButtonRect = mobileButton.getBoundingClientRect();
        const overlayBox = card.querySelector<HTMLElement>(".overlay-box");

        if (overlayBox) {
          const overlayRect = overlayBox.getBoundingClientRect();

          // Calculate the top position relative to the overlay-box (which is fixed positioned)
          const topPosition = mobileButtonRect.top - overlayRect.top;

          // Apply the same top position to the close button
          mobileCloseButton.style.top = `${topPosition}px`;
        }
      }
    });
  };

  // Initial sync
  syncMobileCloseButtonPosition();

  // Sync on window resize
  window.addEventListener("resize", syncMobileCloseButtonPosition);

  // Handle button clicks to toggle overlay
  const toggleButtons =
    document.querySelectorAll<HTMLButtonElement>(".toggle-button");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = button.closest(".card");
      if (card) {
        const overlayBox = card.querySelector<HTMLElement>(".overlay-box");
        if (overlayBox) {
          overlayBox.classList.toggle("active");

          // Update button text
          if (overlayBox.classList.contains("active")) {
            button.textContent = "Bezárás";
          } else {
            button.textContent = "Bővebben";
          }
        }
      }
    });
  });

  // Handle mobile button clicks
  const mobileButtons =
    document.querySelectorAll<HTMLButtonElement>(".mobilebutton");

  mobileButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = button.closest(".card");
      if (card) {
        const overlayBox = card.querySelector<HTMLElement>(".overlay-box");
        if (overlayBox) {
          overlayBox.classList.add("active", "slide-in");
        }
      }
    });
  });

  // Handle close button clicks
  const closeButtons =
    document.querySelectorAll<HTMLButtonElement>(".close-button");

  closeButtons.forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const overlayBox = closeBtn.closest(".overlay-box");
      const card = closeBtn.closest(".card");

      if (overlayBox && card) {
        overlayBox.classList.add("slide-out");

        // Wait for animation to complete before removing classes
        setTimeout(() => {
          overlayBox.classList.remove("active", "slide-in", "slide-out");
        }, 300);

        // Reset the toggle button text
        const toggleButton =
          card.querySelector<HTMLButtonElement>(".toggle-button");
        if (toggleButton) {
          toggleButton.textContent = "Bővebben";
        }
      }
    });
  });

  // Handle mobile close button clicks
  const mobileCloseButtons = document.querySelectorAll<HTMLButtonElement>(
    ".mobile-close-button"
  );

  mobileCloseButtons.forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const overlayBox = closeBtn.closest(".overlay-box");
      const card = closeBtn.closest(".card");

      if (overlayBox && card) {
        overlayBox.classList.add("slide-out");

        // Wait for animation to complete before removing classes
        setTimeout(() => {
          overlayBox.classList.remove("active", "slide-in", "slide-out");
        }, 300);
      }
    });
  });
};
