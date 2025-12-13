// Register the DrawSVG plugin
gsap.registerPlugin(DrawSVGPlugin);

// Wait for DOM to ensure SVG exists, then set initial state
function initLogoAnimation() {
  const paths = document.querySelectorAll(".avenzoar-logo-icon path");
  if (paths.length === 0) {
    // SVG not ready yet, try again
    requestAnimationFrame(initLogoAnimation);
    return;
  }

  // Set initial state - hide all paths
  gsap.set(".avenzoar-logo-icon path", { 
    drawSVG: "0%", 
    fillOpacity: 0,
    stroke: "currentColor" // Set stroke color for DrawSVG to work
  });

  // Create the animation timeline
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  // First: Animate stroke drawing with stagger
  tl.to(".avenzoar-logo-icon path", {
    drawSVG: "100%",
    duration: 0.6,
    stagger: {
      amount: 0.75,
      from: "random",
    },
  })
    // Then: Fade in the fills
    .to(
      ".avenzoar-logo-icon path",
      {
        fillOpacity: 1,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.225"
    ) // Start 0.225s before strokes finish
    // Finally: Fade out the strokes
    .to(
      ".avenzoar-logo-icon path",
      {
        stroke: "transparent",
        duration: 0.225,
        ease: "power2.out",
      },
      "-=0.15"
    ); // Start 0.15s before fills finish
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoAnimation);
} else {
  initLogoAnimation();
}
