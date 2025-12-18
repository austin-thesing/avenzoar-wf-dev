# Navbar Scroll Animation - Implementation Guide

## Overview

This implementation provides a smooth, scroll-triggered navbar that adapts to different page backgrounds (light or dark hero sections) with automatic logo color transitions.

## Features

### Dark Theme (Default)

- **Use case**: Pages with light/neutral hero sections
- **Background**: Transparent → White on scroll
- **Logo icon**: Dark color (stays consistent)
- **Logo text**: Dark version visible
- **Menu icon text**: Dark color (stays consistent)
- **Menu icon lines**: Dark background (stays consistent)
- **Nav links**: Dark color (stays consistent)

### Light Theme

- **Use case**: Pages with dark hero sections
- **Background**: Transparent → Solid white on scroll
- **Logo icon**: White → Dark on scroll (smooth color transition)
- **Logo text**: Light version → Dark version (crossfade on scroll)
- **Menu icon text**: White → Dark on scroll (smooth color transition)
- **Menu icon lines**: White background → Dark on scroll (smooth color transition)
- **Nav links**: White → Dark on scroll (smooth color transition)

## Webflow Implementation

### Step 1: Add Required Scripts

Add to **Site Settings > Custom Code > Footer Code** (or before `</body>`):

```html
<!-- GSAP Core -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

<!-- GSAP DrawSVG Plugin (for logo animation) -->
<script src="/scripts/DrawSVGPlugin.min.js"></script>

<!-- GSAP ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

### Step 2: Add Animation Scripts

Add to **Page Settings > Custom Code > Before `</body>` tag**:

```html
<!-- Logo Draw Animation -->
<script src="/src/logo-draw.js"></script>

<!-- Navbar Background & Scroll Animation -->
<script src="/src/nav-bg.js"></script>
```

Or copy the contents of these files directly into Webflow custom code sections.

### Step 3: Navbar HTML Structure

#### For Dark Theme (Default - Light Hero Sections):

```html
<nav class="navbar16_component w-nav" data-theme="dark">
  <div class="navbar-content">
    <a href="/" class="navbar-logo">
      <!-- Animated logo icon (the OG dude) -->
      <svg class="avenzoar-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 46">
        <!-- SVG paths from dist/the-og-dude.html -->
      </svg>

      <!-- Logo text images -->
      <img loading="lazy" src="https://cdn.prod.website-files.com/.../logo-type.svg" alt="Avenzoar" class="logo-type" />
      <img loading="lazy" src="https://cdn.prod.website-files.com/.../logo-type-light.svg" alt="Avenzoar" class="logo-type light" />
    </a>

    <!-- Desktop navigation links -->
    <nav>
      <a href="/about" class="navbar16_nav-link">About</a>
      <a href="/strategy" class="navbar16_nav-link">Strategy</a>
      <a href="/team" class="navbar16_nav-link">Team</a>
      <a href="/contact" class="navbar16_nav-link">Contact</a>
    </nav>

    <!-- Mobile menu button (Webflow generates this automatically) -->
    <button class="w-nav-button" aria-label="menu">
      <div class="w-icon-nav-menu"></div>
    </button>
  </div>
</nav>
```

#### For Light Theme (Dark Hero Sections):

Same HTML structure, but change the `data-theme` attribute:

```html
<nav class="navbar16_component w-nav" data-theme="light">
  <!-- Same content as above -->
</nav>
```

### Step 4: Required CSS

Add to your site's custom CSS or embed styles:

```css
/* Ensure navbar is fixed/sticky */
.navbar16_component.w-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: transparent !important; /* Start transparent */
  transition: none !important; /* Let GSAP handle transitions */
}

/* Logo icon styles */
.avenzoar-logo-icon {
  height: 40px;
  width: auto;
  display: block;
}

.avenzoar-logo-icon path {
  stroke: transparent;
  stroke-width: 0.1;
  fill: currentColor;
  fill-opacity: 0;
}

/* Logo text styles */
.logo-type {
  height: 32px;
  width: auto;
  display: block;
}

.logo-type.light {
  display: none;
}

/* Nav links - let GSAP control color */
.navbar16_nav-link {
  transition: none; /* Let GSAP handle color transitions */
}

/* Menu button - let GSAP control color */
.w-nav-button {
  transition: none; /* Let GSAP handle color transitions */
}

/* Menu icon elements */
.menu-icon4_text,
.menu-icon4_line-top,
.menu-icon4_line-middle-top,
.menu-icon4_line-middle-base,
.menu-icon4_line-bottom {
  transition: none !important; /* Let GSAP handle color transitions */
}
```

## Configuration

You can customize the scroll distance in `src/nav-bg.js`:

```javascript
const CONFIG = {
  scrollDistance: 100, // Distance in pixels to complete the fade
  darkLogoSelector: ".logo-type:not(.light)",
  lightLogoSelector: ".logo-type.light",
  logoIconSelector: ".avenzoar-logo-icon",
  menuButtonSelector: ".w-nav-button", // Mobile menu button
  navLinksSelector: ".navbar16_nav-link", // Desktop nav links
};
```

## Files Reference

- **`src/nav-bg.js`** - Main navbar scroll animation script
- **`src/logo-draw.js`** - Animated logo draw effect
- **`dist/the-og-dude.html`** - SVG logo icon markup
- **`nav-bg.html`** - Local test file with theme toggle

## Testing Locally

1. Open `nav-bg.html` in a browser
2. Click "Toggle Theme" button to switch between dark/light themes
3. Scroll to see the animations in action

## Troubleshooting

### Logo not animating on page load

- Ensure `logo-draw.js` is loaded before `nav-bg.js`
- Check that DrawSVGPlugin is loaded
- Verify SVG has class `avenzoar-logo-icon`

### Background not fading

- Check that GSAP and ScrollTrigger are loaded
- Verify navbar has class `navbar16_component w-nav`
- Ensure navbar CSS doesn't override GSAP's inline styles

### Logo not switching on scroll (light theme)

- Confirm `data-theme="light"` is set on navbar
- Verify both `.logo-type` and `.logo-type.light` images exist
- Check that logo icon SVG has `currentColor` fill

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses GSAP 3.x (widely supported)
