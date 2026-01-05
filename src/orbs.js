(() => {
  if (typeof window === "undefined") return;

  // Mobile detection
  const isMobile = window.matchMedia("(max-width: 768px)").matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Reduce orb count significantly on mobile for performance
  const ORB_COUNT = isMobile ? 25 : 120;
  const SIZE_RANGE = [1, 3];
  const FLOAT_DISTANCE = isMobile ? [15, 40] : [30, 80]; // Smaller movements on mobile
  const FLOAT_DURATION = isMobile ? [30, 60] : [20, 45]; // Slower = fewer repaints
  const FADE_DURATION = [8, 18];

  // Mouse repulsion settings (disabled on mobile)
  const REPEL_RADIUS = 80; // How close mouse needs to be to affect orb
  const REPEL_STRENGTH = 25; // Max pixels to push away
  const REPEL_EASE_BACK = 0.8; // Seconds to ease back when mouse leaves

  const createOrb = (container, rect, index, orbsData) => {
    const orb = document.createElement("div");
    orb.className = "floating-orb";

    const size = gsap.utils.random(SIZE_RANGE[0], SIZE_RANGE[1], 0.1, false);
    Object.assign(orb.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: "white",
      filter: "blur(0px)",
      opacity: gsap.utils.random(0.15, 0.4),
      mixBlendMode: "normal",
      transformOrigin: "50% 50%",
    });

    container.appendChild(orb);

    // Distribute orbs throughout the entire height of main-wrapper
    // Use viewport width to ensure orbs don't exceed visible area
    const viewportWidth = Math.min(rect.width, window.innerWidth);
    const verticalPosition = (index / (ORB_COUNT - 1)) * rect.height;
    const horizontalVariation = gsap.utils.random(0.05, 0.95);
    const startX = viewportWidth * horizontalVariation;
    const startY = verticalPosition + gsap.utils.random(-200, 200);

    gsap.set(orb, {
      x: startX - size / 2,
      y: startY - size / 2,
      scale: 1,
    });

    // Store orb data for mouse interaction with cached position
    orbsData.push({ 
      el: orb, 
      x: startX,
      y: startY,
      size: size,
      currentX: 0,
      currentY: 0,
      repelX: 0, 
      repelY: 0 
    });

    // Create random curved movement paths
    const moveX = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveY = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveX2 = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveY2 = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);

    const orbData = orbsData[orbsData.length - 1]; // Get the data we just pushed
    const tl = gsap.timeline({ repeat: -1 });

    const pos1X = startX - size / 2 + gsap.utils.random(-moveX, moveX, 1, false);
    const pos1Y = startY - size / 2 + gsap.utils.random(-moveY, moveY, 1, false);
    const pos2X = pos1X + gsap.utils.random(-moveX2, moveX2, 1, false);
    const pos2Y = pos1Y + gsap.utils.random(-moveY2, moveY2, 1, false);

    tl.to(orb, {
      x: pos1X,
      y: pos1Y,
      duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
      ease: "power1.inOut",
      onUpdate: () => {
        orbData.currentX = gsap.getProperty(orb, "x");
        orbData.currentY = gsap.getProperty(orb, "y");
      }
    })
      .to(orb, {
        x: pos2X,
        y: pos2Y,
        duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
        ease: "power1.inOut",
        onUpdate: () => {
          orbData.currentX = gsap.getProperty(orb, "x");
          orbData.currentY = gsap.getProperty(orb, "y");
        }
      })
      .to(orb, {
        x: startX - size / 2,
        y: startY - size / 2,
        duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
        ease: "power1.inOut",
        onUpdate: () => {
          orbData.currentX = gsap.getProperty(orb, "x");
          orbData.currentY = gsap.getProperty(orb, "y");
        }
      });

    gsap.to(orb, {
      opacity: gsap.utils.random(0.05, 0.35),
      duration: gsap.utils.random(FADE_DURATION[0], FADE_DURATION[1]),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(orb, {
      scale: gsap.utils.random(0.95, 1.05),
      duration: gsap.utils.random(FADE_DURATION[0], FADE_DURATION[1]),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: gsap.utils.random(0, 4),
    });
  };

  const initFloatingOrbs = (wrapper) => {
    if (!wrapper || wrapper.dataset.orbsInitialized) return;
    if (typeof gsap === "undefined") return;

    wrapper.dataset.orbsInitialized = "true";

    const computedPosition = getComputedStyle(wrapper).position;
    if (computedPosition === "static") {
      wrapper.style.position = "relative";
    }

    const container = document.createElement("div");
    container.className = "floating-orbs-layer";
    Object.assign(container.style, {
      position: "absolute",
      inset: "0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "0",
      maxWidth: "100vw",
    });

    wrapper.prepend(container);

    // Track all orbs for mouse interaction
    let orbsData = [];

    const buildOrbs = () => {
      container.innerHTML = "";
      orbsData = [];

      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      for (let i = 0; i < ORB_COUNT; i += 1) {
        createOrb(container, rect, i, orbsData);
      }
    };

    // Mouse repulsion handler
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = null;

    const handleMouseMove = (e) => {
      const wrapperRect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - wrapperRect.left + wrapper.scrollLeft;
      mouseY = e.clientY - wrapperRect.top + wrapper.scrollTop;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const updateRepulsion = () => {
      // Batch all layout calculations to avoid forced reflow
      orbsData.forEach((data) => {
        // Use cached positions instead of getBoundingClientRect
        // Account for current GSAP transform position
        const gsapTransform = gsap.getProperty(data.el, "x");
        const gsapTransformY = gsap.getProperty(data.el, "y");
        
        const orbCenterX = (typeof gsapTransform === 'number' ? gsapTransform : data.currentX) + data.size / 2;
        const orbCenterY = (typeof gsapTransformY === 'number' ? gsapTransformY : data.currentY) + data.size / 2;

        const dx = orbCenterX - mouseX;
        const dy = orbCenterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < REPEL_RADIUS && distance > 0) {
          // Calculate repulsion (stronger when closer)
          const force = (1 - distance / REPEL_RADIUS) * REPEL_STRENGTH;
          const angle = Math.atan2(dy, dx);

          const newRepelX = Math.cos(angle) * force;
          const newRepelY = Math.sin(angle) * force;

          // Only update if there's a meaningful change
          if (Math.abs(newRepelX - data.repelX) > 0.1 || Math.abs(newRepelY - data.repelY) > 0.1) {
            data.repelX = newRepelX;
            data.repelY = newRepelY;

            // Apply repulsion offset
            data.currentX += data.repelX * 0.1;
            data.currentY += data.repelY * 0.1;

            gsap.to(data.el, {
              x: data.currentX,
              y: data.currentY,
              duration: 0.15,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        } else if (data.repelX !== 0 || data.repelY !== 0) {
          // Ease back to original position
          data.repelX = 0;
          data.repelY = 0;
        }
      });

      rafId = requestAnimationFrame(updateRepulsion);
    };

    // Start the repulsion loop (desktop only - too expensive on mobile)
    if (!isMobile) {
      wrapper.addEventListener("mousemove", handleMouseMove);
      wrapper.addEventListener("mouseleave", handleMouseLeave);
      rafId = requestAnimationFrame(updateRepulsion);
    }

    const initialRect = wrapper.getBoundingClientRect();
    let lastWidth = initialRect.width;
    let lastHeight = initialRect.height;
    let resizeTimeout = null;

    buildOrbs();

    const resizeObserver = new ResizeObserver(() => {
      const rect = wrapper.getBoundingClientRect();
      const widthChange = Math.abs(rect.width - lastWidth);
      const heightChange = Math.abs(rect.height - lastHeight);

      // Only rebuild if there's a significant size change (more than 50px)
      if (widthChange > 50 || heightChange > 50) {
        // Debounce the rebuild to avoid multiple rapid rebuilds
        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          lastWidth = rect.width;
          lastHeight = rect.height;
          buildOrbs();
        }, 300);
      }
    });

    resizeObserver.observe(wrapper);

    wrapper.addEventListener(
      "animationcleanup",
      () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        if (rafId) cancelAnimationFrame(rafId);
        if (!isMobile) {
          wrapper.removeEventListener("mousemove", handleMouseMove);
          wrapper.removeEventListener("mouseleave", handleMouseLeave);
        }
        resizeObserver.disconnect();
        container.remove();
        delete wrapper.dataset.orbsInitialized;
      },
      { once: true }
    );
  };

  const init = () => {
    const wrappers = document.querySelectorAll(".main-wrapper");
    wrappers.forEach(initFloatingOrbs);
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(init);
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
})();
