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

        // Find the scrollable element - try body first (Webflow sites),
        // then fallback to standard scrollingElement
        function getScrollableElement() {
          const body = document.body;
          if (body.scrollHeight > body.clientHeight) {
            const bodyStyle = getComputedStyle(body);
            if (bodyStyle.overflowY === "auto" || bodyStyle.overflowY === "scroll") {
              return body;
            }
          }
          return document.scrollingElement || document.documentElement || body;
        }

        const scrollingElement = getScrollableElement();
        const currentScroll = scrollingElement.scrollTop || window.pageYOffset || 0;
        const scrollTarget = currentScroll + scrollAmount;

        // Smooth scroll to target
        scrollingElement.scrollTo({
          top: scrollTarget,
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
