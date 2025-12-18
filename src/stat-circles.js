// Stat Circles GSAP ScrollTrigger Animation
// Animates circular SVG stroke elements on scroll with stagger

(() => {
  if (typeof window === "undefined") return;
  if (typeof gsap === "undefined") {
    console.error("GSAP is required for stat-circles animation");
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("ScrollTrigger plugin is required for stat-circles animation");
    return;
  }

  /**
   * Parse a number from text content, handling suffixes like k, K, M, +, %, th, etc.
   * @param {string} text - The text to parse
   * @returns {object} - { value: number, suffix: string, prefix: string }
   */
  const parseStatNumber = (text) => {
    if (!text) return { value: 0, suffix: "", prefix: "" };

    const trimmed = text.trim();

    // Match patterns like: 495k, 12th, 95%, 200+, etc.
    const match = trimmed.match(/^(\d+(?:\.\d+)?)(.*?)$/);

    if (!match) return { value: 0, suffix: trimmed, prefix: "" };

    return {
      value: parseFloat(match[1]),
      suffix: match[2],
      prefix: "",
    };
  };

  /**
   * Create a counter animation object for timeline
   * @param {HTMLElement} element - The element containing the number
   * @param {number} endValue - The target number
   * @param {string} suffix - Any suffix to append (%, +, K, etc.)
   * @returns {object} - Animation configuration for timeline
   */
  const createCounterAnimation = (element, endValue, suffix) => {
    const counter = { value: 0 };

    return {
      target: counter,
      props: {
        value: endValue,
        ease: "power2.out",
        onUpdate: () => {
          const displayValue = Math.round(counter.value);
          element.textContent = displayValue + suffix;
        },
      },
    };
  };

  /**
   * Initialize animation for stat circles
   * Supports two modes:
   * 1. Container with data-attr="stat-circles" (wraps multiple .stat-circle-wrap elements)
   * 2. Auto-detect all .stat-circle-wrap elements on the page
   *
   * Also animates .stat-title elements (excluding .stat-title.after) with count-up
   * Staggers animations within each .stat-row
   */
  const initStatCircles = () => {
    // Check if already initialized
    if (document.body.dataset.statCirclesInitialized) return;
    document.body.dataset.statCirclesInitialized = "true";

    // Try to find a container with data-attr="stat-circles" first
    let container = document.querySelector('[data-attr="stat-circles"]');
    let config = {};

    if (container) {
      // Mode 1: Use container's config
      config = {
        staggerAmount: parseFloat(container.dataset.staggerAmount) || 0.15,
        duration: parseFloat(container.dataset.duration) || 0.8,
        startTrigger: container.dataset.startTrigger || "top 80%",
        ease: container.dataset.ease || "power2.out",
      };
    } else {
      // Mode 2: Auto-detect - use body as container
      container = document.body;
      config = {
        staggerAmount: 0.15,
        duration: 0.8,
        startTrigger: "top 80%",
        ease: "power2.out",
      };
    }

    // Find all .stat-row elements (or fall back to container if no rows)
    const statRows = Array.from(document.querySelectorAll(".stat-row"));
    const hasRows = statRows.length > 0;

    if (!hasRows) {
      // Fallback: treat entire container as one row
      statRows.push(container);
    }

    // Process each row independently for staggered animations
    statRows.forEach((row) => {
      // Find circles - support both .stat-circle-embed and .stat-circles-container
      const circles = Array.from(row.querySelectorAll(".stat-circle-wrap svg rect[rx], .stat-circles-container svg rect[rx]"));

      // Find stat titles (excluding .after class)
      const statTitles = Array.from(row.querySelectorAll(".stat-title:not(.after)"));

      // Find all stat-row-col elements for proper staggering
      const statCols = Array.from(row.querySelectorAll(".stat-row-col"));

      if (circles.length === 0 && statTitles.length === 0) {
        return; // Skip empty rows
      }

      // Set initial state for circles - hidden and scaled down
      if (circles.length > 0) {
        gsap.set(circles, {
          opacity: 0,
          scale: 0.8,
          transformOrigin: "center center",
        });
      }

      // Set initial state for stat titles
      if (statTitles.length > 0) {
        gsap.set(statTitles, {
          opacity: 0,
        });
      }

      // Create timeline for this row
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: config.startTrigger,
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Animate circles with stagger
      if (circles.length > 0) {
        timeline.to(
          circles,
          {
            opacity: 1,
            scale: 1,
            duration: config.duration,
            ease: config.ease,
            stagger: {
              amount: config.staggerAmount,
              from: "start",
            },
          },
          0
        );
      }

      // Animate stat titles with stagger and count-up
      if (statTitles.length > 0) {
        // Prepare counter animations
        const counterAnimations = [];

        statTitles.forEach((title) => {
          // Check if there's a .stat-number span (old structure) or use title directly (Webflow structure)
          const statNumber = title.querySelector(".stat-number");
          const targetElement = statNumber || title;
          const originalText = targetElement.textContent;
          const { value, suffix } = parseStatNumber(originalText);

          if (value > 0) {
            // Set initial value to 0
            targetElement.textContent = "0" + suffix;

            // Create counter animation
            const counterAnim = createCounterAnimation(targetElement, value, suffix);
            counterAnimations.push(counterAnim);
          }
        });

        // Fade in stat titles with stagger
        timeline.to(
          statTitles,
          {
            opacity: 1,
            duration: config.duration * 0.5,
            stagger: {
              amount: config.staggerAmount,
              from: "start",
            },
          },
          0
        );

        // Add count-up animations to the same timeline with stagger
        counterAnimations.forEach((anim, index) => {
          timeline.to(
            anim.target,
            {
              ...anim.props,
              duration: config.duration,
            },
            index * (config.staggerAmount / counterAnimations.length)
          );
        });
      }
    });

    if (statRows.length === 0) {
      console.warn("No .stat-row or .stat-circle-wrap elements found");
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(initStatCircles);
  } else {
    document.addEventListener("DOMContentLoaded", initStatCircles, { once: true });
  }
})();
