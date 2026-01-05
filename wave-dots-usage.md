# Wave Dots Background - Usage Guide

## Overview

A dynamic dot-grid background animation that creates an undulating 3D wave surface effect, perfect for hero sections. Built with Canvas 2D and GSAP for smooth 60fps performance.

## Quick Start

### 1. Add the script to your page

In Webflow, add a custom code embed before the closing `</body>` tag:

```html
<script src="https://your-cdn.com/dist/wave-dots.js"></script>
```

Or use the local version:

```html
<script src="dist/wave-dots.js"></script>
```

### 2. Add the container element

Add a div with the class `wave-dots-bg` inside your hero section:

```html
<section class="hero-section" style="position: relative; height: 100vh;">
  <!-- Wave dots background -->
  <div class="wave-dots-bg" 
       data-dot-opacity="0.6"
       data-dot-color="#000000"
       data-wave-speed="0.3"
       data-dot-spacing="18">
  </div>
  
  <!-- Your hero content -->
  <div class="hero-content" style="position: relative; z-index: 1;">
    <h1>Your Heading</h1>
    <p>Your content here</p>
  </div>
</section>
```

### 3. Ensure proper positioning

The parent container must have `position: relative` or `position: absolute` for the wave dots to display correctly.

## Configuration Options

Control the animation via data attributes on the `.wave-dots-bg` element:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-dot-opacity` | Number (0-1) | `0.6` | Opacity of the dots |
| `data-dot-color` | Hex color | `#000000` | Color of the dots (black) |
| `data-wave-speed` | Number | `0.3` | Speed of wave animation (higher = faster) |
| `data-dot-spacing` | Number | `18` | Spacing between dots in pixels |

## Examples

### Subtle light background
```html
<div class="wave-dots-bg" 
     data-dot-opacity="0.3"
     data-dot-color="#000000"
     data-wave-speed="0.2"
     data-dot-spacing="20">
</div>
```

### Bold dark pattern
```html
<div class="wave-dots-bg" 
     data-dot-opacity="0.8"
     data-dot-color="#000000"
     data-wave-speed="0.5"
     data-dot-spacing="15">
</div>
```

### Purple brand color
```html
<div class="wave-dots-bg" 
     data-dot-opacity="0.6"
     data-dot-color="#5b3399"
     data-wave-speed="0.3"
     data-dot-spacing="18">
</div>
```

### Slow, spacious waves
```html
<div class="wave-dots-bg" 
     data-dot-opacity="0.5"
     data-dot-color="#000000"
     data-wave-speed="0.15"
     data-dot-spacing="25">
</div>
```

## CSS Styling

The wave dots background is absolutely positioned and fills its parent container. Make sure your hero content has a higher z-index:

```css
.hero-section {
  position: relative;
  overflow: hidden; /* Optional: prevents dots from extending outside */
}

.wave-dots-bg {
  /* Automatically styled by the script */
  /* position: absolute; */
  /* top: 0; left: 0; */
  /* width: 100%; height: 100%; */
}

.hero-content {
  position: relative;
  z-index: 1; /* Ensures content appears above the dots */
}
```

## Performance

- **Canvas 2D rendering** for efficient dot drawing (1000+ dots at 60fps)
- **Mobile optimizations** automatically reduce dot count and spacing on smaller screens
- **GSAP ticker integration** for smooth animation timing
- **ResizeObserver** handles responsive canvas sizing automatically

## Browser Support

Works in all modern browsers that support:
- Canvas 2D API
- ResizeObserver
- GSAP (included in your project)

## Troubleshooting

### Dots not appearing?
- Check that the parent container has `position: relative` or `position: absolute`
- Verify GSAP is loaded before the wave-dots script
- Check browser console for errors

### Animation too fast/slow?
- Adjust the `data-wave-speed` attribute (try values between 0.1 and 1.0)

### Dots too dense/sparse?
- Adjust the `data-dot-spacing` attribute (try values between 12 and 30)

### Performance issues on mobile?
- The script automatically optimizes for mobile, but you can increase `data-dot-spacing` to further reduce dot count

## Files

- **Source:** `src/wave-dots.js`
- **Built:** `dist/wave-dots.js` (minified)
- **Test page:** `wave-dots.html`
