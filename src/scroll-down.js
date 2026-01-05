/**
 * Scroll Down Button Handler
 *
 * Scrolls the page down by 75svh (75% of small viewport height) when clicked.
 *
 * Usage in Webflow:
 * Add this script to your page, and ensure the button has id="scroll-down"
 */

(function () {
  "use strict";

  function attachScrollHandler() {
    const scrollDownButton = document.getElementById("scroll-down");

    if (!scrollDownButton) {
      return false;
    }

    // Check if handler is already attached
    if (scrollDownButton.dataset.scrollHandlerAttached === "true") {
      return true;
    }

    scrollDownButton.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Calculate 75svh (75% of small viewport height)
        const scrollAmount = window.innerHeight * 0.75;

        // Determine correct scroll container
        // (Handles case where html { overflow: hidden } and body scrolls)
        function getScrollContainer() {
          const html = document.documentElement;
          const htmlStyle = window.getComputedStyle(html);

          if (
            htmlStyle.overflowY === "hidden" ||
            htmlStyle.overflow === "hidden"
          ) {
            const body = document.body;
            const bodyStyle = window.getComputedStyle(body);
            if (
              bodyStyle.overflowY === "auto" ||
              bodyStyle.overflowY === "scroll"
            ) {
              return body;
            }
          }
          return window;
        }

        const container = getScrollContainer();
        const currentScroll =
          container === window ? window.scrollY : container.scrollTop;
        const target = currentScroll + scrollAmount;

        container.scrollTo({
          top: target,
          behavior: "smooth",
        });
      },
      { capture: true }
    );

    // Mark as attached to prevent duplicate handlers
    scrollDownButton.dataset.scrollHandlerAttached = "true";
    return true;
  }

  function init() {
    // Try to attach immediately
    if (attachScrollHandler()) {
      return;
    }

    // If button not found, wait for it with MutationObserver
    const observer = new MutationObserver(function () {
      if (attachScrollHandler()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Fallback: retry periodically
    let attempts = 0;
    const maxAttempts = 50;
    const retryInterval = setInterval(function () {
      attempts++;
      if (attachScrollHandler() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
        observer.disconnect();
      }
    }, 100);
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 0);
  }
})();
