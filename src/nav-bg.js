/**
 * Navbar Background & Logo Fade on Scroll
 *
 * Handles two navbar themes with smooth scroll-triggered transitions:
 *
 * 1. DARK THEME (default) - for pages with light hero sections:
 *    - Background: transparent → white on scroll
 *    - Logo icon (.avenzoar-logo-icon): purple #5b3399 (stays purple)
 *    - Logo text (.logo-type): dark version visible
 *    - Menu icon text (.menu-icon4_text): dark color (stays dark)
 *    - Menu icon lines (.menu-icon4_line-*): dark background (stays dark)
 *    - Nav links (.navbar16_nav-link): dark color (stays dark)
 *
 * 2. LIGHT THEME - for pages with dark hero sections:
 *    - Background: transparent → solid white on scroll
 *    - Logo icon (.avenzoar-logo-icon): white → purple #5b3399 on scroll
 *    - Logo text (.logo-type): light version → dark version crossfade on scroll
 *    - Menu icon text (.menu-icon4_text): white → dark on scroll
 *    - Menu icon lines (.menu-icon4_line-*): white background → dark on scroll
 *    - Nav links (.navbar16_nav-link): white → dark on scroll
 *
 * 3. MENU OPEN STATE (both themes):
 *    - Background: transparent (regardless of scroll position)
 *    - All text and icons: white (light theme colors)
 *    - Logo icon: visible, white color
 *    - Logo text: light version visible (white)
 *
 * Usage in Webflow:
 *
 * Dark theme (default):
 * <nav class="navbar16_component w-nav" data-theme="dark">
 *   <svg class="avenzoar-logo-icon">...</svg>
 *   <img src="logo-type.svg" class="logo-type">
 *   <img src="logo-type-light.svg" class="logo-type light">
 *   <button class="w-nav-button">...</button>
 *   <a class="navbar16_nav-link">...</a>
 * </nav>
 *
 * Light theme:
 * <nav class="navbar16_component w-nav" data-theme="light">
 *   <svg class="avenzoar-logo-icon">...</svg>
 *   <img src="logo-type.svg" class="logo-type">
 *   <img src="logo-type-light.svg" class="logo-type light">
 *   <button class="w-nav-button">...</button>
 *   <a class="navbar16_nav-link">...</a>
 * </nav>
 *
 * Dependencies:
 * - GSAP core library
 * - GSAP ScrollTrigger plugin
 * - DrawSVGPlugin (for logo animation, bundled below)
 */

// IMPORT: ./logo-draw.js

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    scrollDistance: 200, // Distance in pixels to complete the fade
    darkLogoSelector: ".logo-type.logo-dark",
    lightLogoSelector: ".logo-type.logo-light",
    logoIconSelector: ".avenzoar-logo-icon", // Animated logo mark
    menuButtonSelector: ".w-nav-button", // Mobile menu button
    navLinksSelector: ".navbar16_nav-link", // Desktop nav links
    menuIconTextSelector: ".menu-icon4_text", // Menu icon text
    menuIconLinesSelector: ".menu-icon4_line-top, .menu-icon4_line-middle, .menu-icon4_line-bottom", // Menu icon lines (parent elements)
    menuIconLineWrappersSelector: ".menu-icon4_line-top-wrapper, .menu-icon4_line-middle-wrapper, .menu-icon4_line-bottom-wrapper", // Menu icon line wrappers
    menuIconMiddleBaseSelector: ".menu-icon4_line-middle-base", // Menu icon middle base line
  };

  // Wait for DOM and GSAP to be ready
  function init() {
    // Validate GSAP is loaded
    if (typeof gsap === "undefined") {
      console.error("GSAP is not loaded. Please include GSAP before this script.");
      return;
    }

    // Get the navbar element
    const navbar = document.querySelector(".navbar16_component.w-nav");

    if (!navbar) {
      console.warn("Navbar element (.navbar16_component.w-nav) not found.");
      return;
    }

    // Get logo elements
    const darkLogo = navbar.querySelector(CONFIG.darkLogoSelector);
    const lightLogo = navbar.querySelector(CONFIG.lightLogoSelector);
    const logoIcon = navbar.querySelector(CONFIG.logoIconSelector);
    const menuButton = navbar.querySelector(CONFIG.menuButtonSelector);
    const navLinks = navbar.querySelectorAll(CONFIG.navLinksSelector);
    const menuIconText = navbar.querySelector(CONFIG.menuIconTextSelector);
    const menuIconLines = navbar.querySelectorAll(CONFIG.menuIconLinesSelector);
    const menuIconLineWrappers = navbar.querySelectorAll(CONFIG.menuIconLineWrappersSelector);
    const menuIconMiddleBase = navbar.querySelector(CONFIG.menuIconMiddleBaseSelector);

    // Determine theme from data attribute
    const theme = navbar.getAttribute("data-theme") || "dark";
    const isLightTheme = theme === "light";

    // Validate required logo elements exist
    if (!darkLogo || !lightLogo) {
      console.error("Logo text elements not found. Expected both:", {
        darkLogo: CONFIG.darkLogoSelector,
        lightLogo: CONFIG.lightLogoSelector,
        foundDark: !!darkLogo,
        foundLight: !!lightLogo,
      });
      console.warn("Logo text will not be visible. Please add both logo images to the navbar.");
    }

    // Store original menu text
    const originalMenuText = menuIconText ? menuIconText.textContent : "";

    // Handle menu open/close state
    let isMenuOpen = false;

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        isMenuOpen = !isMenuOpen;

        // Change text to CLOSE when open, MENU when closed
        if (menuIconText) {
          menuIconText.textContent = isMenuOpen ? "CLOSE" : originalMenuText;
        }

        // When menu is open: use light theme colors (white) with transparent background
        // Use a slight delay to avoid conflicting with Webflow's animation
        if (isMenuOpen) {
          // Show logo elements with white color
          if (logoIcon) {
            gsap.set(logoIcon, { opacity: 1, color: "#ffffff" });
          }
          // Show light logo (white version)
          if (lightLogo) gsap.set(lightLogo, { opacity: 1 });
          if (darkLogo) gsap.set(darkLogo, { opacity: 0 });

          // Set background to transparent
          navbar.style.setProperty("background-color", "rgba(255, 255, 255, 0)", "important");

          setTimeout(() => {
            // Use light theme colors (white) when menu is open
            if (menuIconText) {
              gsap.set(menuIconText, { color: "#ffffff" });
            }
            if (menuIconLines.length > 0) {
              gsap.set(menuIconLines, { backgroundColor: "#ffffff" });
            }
            if (menuIconLineWrappers.length > 0) {
              gsap.set(menuIconLineWrappers, { backgroundColor: "transparent" });
            }
            if (menuIconMiddleBase) {
              gsap.set(menuIconMiddleBase, { backgroundColor: "#ffffff" });
            }
            if (navLinks.length > 0) {
              gsap.set(navLinks, { color: "#ffffff" });
            }
          }, 100);
        } else {
          // Restore background and colors based on scroll position and theme
          const scrollY = window.scrollY;
          const progress = Math.min(scrollY / CONFIG.scrollDistance, 1);

          // Show logo elements based on theme AND scroll position
          if (logoIcon) gsap.set(logoIcon, { opacity: 1 });
          if (isLightTheme) {
            // For light theme, show appropriate logo based on scroll position
            if (progress >= 1) {
              // Fully scrolled - show dark logo
              if (darkLogo) gsap.set(darkLogo, { opacity: 1 });
              if (lightLogo) gsap.set(lightLogo, { opacity: 0 });
            } else {
              // Not fully scrolled - show logos based on progress
              if (lightLogo) gsap.set(lightLogo, { opacity: 1 - progress });
              if (darkLogo) gsap.set(darkLogo, { opacity: progress });
            }
          } else {
            // Dark theme always shows dark logo
            if (darkLogo) gsap.set(darkLogo, { opacity: 1 });
            if (lightLogo) gsap.set(lightLogo, { opacity: 0 });
          }

          // Restore background color based on scroll position
          const bgOpacity = progress;
          navbar.style.setProperty("background-color", `rgba(255, 255, 255, ${bgOpacity})`, "important");

          if (isLightTheme && scrollY < CONFIG.scrollDistance) {
            // Calculate color based on scroll position (white to dark for menu/nav, white to purple for logo icon)
            const r = Math.round(255 - (255 - 26) * progress);
            const g = Math.round(255 - (255 - 26) * progress);
            const b = Math.round(255 - (255 - 26) * progress);

            // Restore logo icon color based on scroll position (white to purple #5b3399)
            if (logoIcon) {
              const logoR = Math.round(255 - (255 - 91) * progress); // 255 -> 91 (0x5b)
              const logoG = Math.round(255 - (255 - 51) * progress); // 255 -> 51 (0x33)
              const logoB = Math.round(255 - (255 - 153) * progress); // 255 -> 153 (0x99)
              gsap.set(logoIcon, { color: `rgb(${logoR}, ${logoG}, ${logoB})` });
            }
            if (menuIconText) {
              gsap.set(menuIconText, { color: `rgb(${r}, ${g}, ${b})` });
            }
            if (menuIconLines.length > 0) {
              gsap.set(menuIconLines, { backgroundColor: `rgb(${r}, ${g}, ${b})` });
            }
            if (menuIconLineWrappers.length > 0) {
              gsap.set(menuIconLineWrappers, { backgroundColor: "transparent" });
            }
            if (menuIconMiddleBase) {
              gsap.set(menuIconMiddleBase, { backgroundColor: `rgb(${r}, ${g}, ${b})` });
            }
            if (navLinks.length > 0) {
              gsap.set(navLinks, { color: `rgb(${r}, ${g}, ${b})` });
            }
          } else {
            // Fully scrolled or dark theme - use appropriate colors
            if (logoIcon) {
              // Use purple for both themes when scrolled
              gsap.set(logoIcon, { color: "#5b3399" });
            }
            if (menuIconText) {
              gsap.set(menuIconText, { color: "#1a1a1a" });
            }
            if (menuIconLines.length > 0) {
              gsap.set(menuIconLines, { backgroundColor: "#1a1a1a" });
            }
            if (menuIconLineWrappers.length > 0) {
              gsap.set(menuIconLineWrappers, { backgroundColor: "transparent" });
            }
            if (menuIconMiddleBase) {
              gsap.set(menuIconMiddleBase, { backgroundColor: "#1a1a1a" });
            }
            if (navLinks.length > 0) {
              gsap.set(navLinks, { color: "#1a1a1a" });
            }
          }
        }
      });
    }

    // Set initial states based on theme
    // Both themes start with transparent background - force it with !important via inline style
    gsap.set(navbar, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      clearProps: "backgroundColor", // Clear any existing background
    });

    // Force transparent background immediately
    navbar.style.setProperty("background-color", "rgba(255, 255, 255, 0)", "important");

    if (isLightTheme) {
      // Light theme: white text/icons for dark hero backgrounds
      // Show light logo (higher z-index), hide dark logo
      if (darkLogo) {
        gsap.set(darkLogo, { opacity: 0 });
      }
      if (lightLogo) {
        gsap.set(lightLogo, { opacity: 1, visibility: "visible" });
      }

      // Set logo icon to white color for light theme
      if (logoIcon) gsap.set(logoIcon, { color: "#ffffff" });

      // Set nav links to white for light theme
      if (navLinks.length > 0) {
        gsap.set(navLinks, { color: "#ffffff" });
      }

      // Set menu icon text to white
      if (menuIconText) gsap.set(menuIconText, { color: "#ffffff" });

      // Set menu icon lines to white (background-color for the lines)
      if (menuIconLines.length > 0) {
        gsap.set(menuIconLines, { backgroundColor: "#ffffff" });
      }

      // Set menu icon line wrappers to transparent
      if (menuIconLineWrappers.length > 0) {
        gsap.set(menuIconLineWrappers, { backgroundColor: "transparent" });
      }

      // Set menu icon middle base to white
      if (menuIconMiddleBase) {
        gsap.set(menuIconMiddleBase, { backgroundColor: "#ffffff" });
      }
    } else {
      // Dark theme: dark text/icons for light hero backgrounds
      // Show dark logo (higher z-index), hide light logo
      if (darkLogo) {
        gsap.set(darkLogo, { opacity: 1, visibility: "visible" });
      }
      if (lightLogo) {
        gsap.set(lightLogo, { opacity: 0 });
      }

      // Set logo icon to purple color for dark theme
      if (logoIcon) gsap.set(logoIcon, { color: "#5b3399" });

      // Set nav links to dark for dark theme
      if (navLinks.length > 0) {
        gsap.set(navLinks, { color: "#1a1a1a" });
      }

      // Set menu icon text to dark
      if (menuIconText) gsap.set(menuIconText, { color: "#1a1a1a" });

      // Set menu icon lines to dark
      if (menuIconLines.length > 0) {
        gsap.set(menuIconLines, { backgroundColor: "#1a1a1a" });
      }

      // Set menu icon line wrappers to transparent
      if (menuIconLineWrappers.length > 0) {
        gsap.set(menuIconLineWrappers, { backgroundColor: "transparent" });
      }

      // Set menu icon middle base to dark
      if (menuIconMiddleBase) {
        gsap.set(menuIconMiddleBase, { backgroundColor: "#1a1a1a" });
      }
    }

    // Create scroll-triggered animation for background
    gsap.to(navbar, {
      backgroundColor: "rgba(255, 255, 255, 1)",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: `${CONFIG.scrollDistance}px top`,
        scrub: true,
        // markers: true, // Uncomment for debugging
      },
      ease: "none",
    });

    // If light theme, fade light logo to dark logo on scroll
    if (isLightTheme && darkLogo && lightLogo) {
      // Fade out light logo
      gsap.to(lightLogo, {
        opacity: 0,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });

      // Fade in dark logo
      gsap.to(darkLogo, {
        opacity: 1,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle logo icon color change on scroll for light theme
    if (isLightTheme && logoIcon) {
      gsap.to(logoIcon, {
        color: "#5b3399", // Fade from white to purple
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle nav links color change on scroll for light theme
    if (isLightTheme && navLinks.length > 0) {
      gsap.to(navLinks, {
        color: "#1a1a1a", // Fade from white to dark
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle menu icon text color change on scroll for light theme
    if (isLightTheme && menuIconText) {
      gsap.to(menuIconText, {
        color: "#1a1a1a", // Fade from white to dark
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle menu icon lines color change on scroll for light theme
    if (isLightTheme && menuIconLines.length > 0) {
      gsap.to(menuIconLines, {
        backgroundColor: "#1a1a1a", // Fade from white to dark
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle menu icon line wrappers - keep transparent on scroll for light theme
    if (isLightTheme && menuIconLineWrappers.length > 0) {
      gsap.to(menuIconLineWrappers, {
        backgroundColor: "transparent", // Stay transparent
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    // Handle menu icon middle base color change on scroll for light theme
    if (isLightTheme && menuIconMiddleBase) {
      gsap.to(menuIconMiddleBase, {
        backgroundColor: "#1a1a1a", // Fade from white to dark
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `${CONFIG.scrollDistance}px top`,
          scrub: true,
        },
        ease: "none",
      });
    }

    console.log(`Navbar animation initialized (theme: ${theme})`);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
