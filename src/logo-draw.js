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
  
  // Get the icon's natural width for animation
  const iconWidth = logoIcon.offsetWidth || 40;
  const iconMargin = 12;
  const totalShift = iconWidth + iconMargin;
  
  // Set initial state for paths
  gsap.set(paths, { 
    opacity: 1,
    drawSVG: "0%", 
    fillOpacity: 0,
    stroke: "currentColor"
  });
  
  // Set initial state - hide icon and scale down
  gsap.set(logoIcon, { 
    opacity: 0,
    scale: 0.8
  });
  
  // If there's a text wrapper, shift it left initially
  // This works for both absolute and relative positioning
  if (logoTextWrapper) {
    gsap.set(logoTextWrapper, {
      x: -totalShift
    });
  }

  // Create the animation timeline
  const tl = gsap.timeline({ 
    defaults: { ease: "power2.inOut" },
    delay: 0.5 // Optional: delay before animation starts
  });

  // Step 1: Fade in and scale up the icon while pushing text right
  tl.to(logoIcon, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "power2.out"
  });
  
  // Simultaneously push the text to the right
  if (logoTextWrapper) {
    tl.to(logoTextWrapper, {
      x: 0,
      duration: 0.4,
      ease: "power2.out"
    }, 0); // Start at the same time as icon fade in
  }
  
  // Step 2: Draw the SVG paths with stagger (starts slightly before icon fully expands)
  tl.to(paths, {
    drawSVG: "100%",
    duration: 0.6,
    stagger: {
      amount: 0.75,
      from: "random",
    },
  }, "-=0.2")
    // Step 3: Fade in the fills
    .to(
      paths,
      {
        fillOpacity: 1,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.225"
    )
    // Step 4: Fade out the strokes
    .to(
      paths,
      {
        stroke: "transparent",
        duration: 0.225,
        ease: "power2.out",
      },
      "-=0.15"
    );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoAnimation);
} else {
  initLogoAnimation();
}
