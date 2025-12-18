// Register the DrawSVG plugin
gsap.registerPlugin(DrawSVGPlugin);

// Wait for DOM to ensure SVG exists, then set initial state
function initLogoAnimation() {
  const logoIcon = document.querySelector(".avenzoar-logo-icon");
  const paths = document.querySelectorAll(".avenzoar-logo-icon path");
  
  if (!logoIcon || paths.length === 0) {
    // Elements not ready yet, try again
    requestAnimationFrame(initLogoAnimation);
    return;
  }

  // Find the logo text wrapper - try multiple possible selectors
  const logoTextWrapper = 
    document.querySelector(".logo-type-wrapper") || 
    logoIcon.nextElementSibling;
  
  // Set initial state for paths
  gsap.set(paths, { 
    opacity: 1,
    drawSVG: "0%", 
    fillOpacity: 0,
    stroke: "currentColor"
  });

  // Create the animation timeline with smoother easing
  const tl = gsap.timeline({ 
    defaults: { ease: "power2.out" },
    delay: 0.3
  });

  // Step 1: Text slides right first with ultra-smooth easing
  // The text movement completes BEFORE the icon finishes fading in
  if (logoTextWrapper) {
    tl.to(logoTextWrapper, {
      x: 0,
      duration: 1.6, // Longer, more luxurious slide
      ease: "power3.out" // Very smooth, gentle deceleration
    }, 0);
  }
  
  // Step 2: Icon fades in and scales up quickly with smooth easing
  tl.to(logoIcon, {
    opacity: 1,
    scale: 1,
    duration: 0.6, // Faster fade in
    ease: "power1.out" // Gentle but quicker easing
  }, 0); // Start immediately with text
  
  // Step 3: Draw the SVG paths with stagger (starts after icon is visible)
  tl.to(paths, {
    drawSVG: "100%",
    duration: 0.7, // Faster drawing
    stagger: {
      amount: 0.5, // Less stagger for tighter timing
      from: "random",
    },
    ease: "power1.inOut"
  }, 0.5) // Start shortly after icon appears, while text is still settling
    // Step 4: Fade in the fills gradually while drawing completes
    .to(
      paths,
      {
        fillOpacity: 1,
        duration: 0.6, // Longer, more gradual fill
        ease: "power1.out", // Smoother easing
      },
      "-=0.5" // Start earlier - overlaps more with drawing
    )
    // Step 5: Fade out the strokes smoothly
    .to(
      paths,
      {
        stroke: "transparent",
        duration: 0.4, // Slightly longer
        ease: "power1.out", // Smoother easing
      },
      "-=0.4" // More overlap with fill
    );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoAnimation);
} else {
  initLogoAnimation();
}
