(() => {
  if (typeof window === "undefined") return;

  const ORB_COUNT = 30;
  const SIZE_RANGE = [3, 8];
  const FLOAT_DISTANCE = [80, 200];
  const FLOAT_DURATION = [15, 35];
  const FADE_DURATION = [5, 12];

  const createOrb = (container, rect, index) => {
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
      opacity: gsap.utils.random(0.4, 0.8),
      mixBlendMode: "normal",
      transformOrigin: "50% 50%",
    });

    container.appendChild(orb);

    // Distribute orbs throughout the entire height of main-wrapper
    const verticalPosition = (index / (ORB_COUNT - 1)) * rect.height;
    const horizontalVariation = gsap.utils.random(0.05, 0.95);
    const startX = rect.width * horizontalVariation;
    const startY = verticalPosition + gsap.utils.random(-200, 200);

    gsap.set(orb, {
      x: startX - size / 2,
      y: startY - size / 2,
      scale: 1,
    });

    // Create random curved movement paths
    const moveX = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveY = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveX2 = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    const moveY2 = gsap.utils.random(FLOAT_DISTANCE[0], FLOAT_DISTANCE[1]);
    
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(orb, {
      x: `+=${gsap.utils.random(-moveX, moveX, 1, false)}`,
      y: `+=${gsap.utils.random(-moveY, moveY, 1, false)}`,
      duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
      ease: "power1.inOut",
    })
    .to(orb, {
      x: `+=${gsap.utils.random(-moveX2, moveX2, 1, false)}`,
      y: `+=${gsap.utils.random(-moveY2, moveY2, 1, false)}`,
      duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
      ease: "power1.inOut",
    })
    .to(orb, {
      x: startX - size / 2,
      y: startY - size / 2,
      duration: gsap.utils.random(FLOAT_DURATION[0], FLOAT_DURATION[1]),
      ease: "power1.inOut",
    });

    gsap.to(orb, {
      opacity: gsap.utils.random(0.1, 0.9),
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
      overflow: "visible",
      pointerEvents: "none",
      zIndex: "0",
    });

    wrapper.prepend(container);

    const buildOrbs = () => {
      container.innerHTML = "";

      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      for (let i = 0; i < ORB_COUNT; i += 1) {
        createOrb(container, rect, i);
      }
    };

    buildOrbs();

    const resizeObserver = new ResizeObserver(() => {
      buildOrbs();
    });

    resizeObserver.observe(wrapper);

    wrapper.addEventListener(
      "animationcleanup",
      () => {
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
