/**
 * Wave Dots Background Animation
 *
 * Creates a dynamic dot-grid background that forms an undulating 3D wave surface.
 * Dots are arranged in a perspective grid with sine-wave displacement creating
 * the rolling wave effect.
 *
 * Usage in HTML:
 * <div class="wave-dots-bg"
 *      data-dot-opacity="0.6"
 *      data-dot-color="#ffffff"
 *      data-wave-speed="0.2"
 *      data-dot-spacing="25"
 *      data-height="100">
 * </div>
 */

(function () {
  "use strict";

  // Mobile detection
  const isMobile = window.matchMedia("(max-width: 768px)").matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Default configuration
  const DEFAULTS = {
    dotOpacity: 0.4, // Subtle
    dotColor: "#050a14", // Very dark navy/black
    waveSpeed: 0.1, // Even slower for smoother flow
    dotSpacing: 35, // Increased density (was 50)
    dotSize: 3.5, // Balanced size (was 4.0)
    waveAmplitude: 60, // Deeper wave
    perspective: 800,
    fov: 600,
    heightPercent: 100,
  };

  if (isMobile) {
    DEFAULTS.dotSpacing = 50;
    DEFAULTS.dotSize = 2;
  }

  class WaveDotsAnimation {
    constructor(container) {
      this.container = container;
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.time = 0;
      this.rafId = null;
      this.resizeObserver = null;

      // Configuration
      this.config = {
        dotOpacity: parseFloat(container.dataset.dotOpacity) || DEFAULTS.dotOpacity,
        dotColor: container.dataset.dotColor || DEFAULTS.dotColor,
        waveSpeed: parseFloat(container.dataset.waveSpeed) || DEFAULTS.waveSpeed,
        dotSpacing: parseFloat(container.dataset.dotSpacing) || DEFAULTS.dotSpacing,
        heightPercent: parseFloat(container.dataset.height) || DEFAULTS.heightPercent,
        dotSize: DEFAULTS.dotSize,
        waveAmplitude: DEFAULTS.waveAmplitude,
        perspective: DEFAULTS.perspective,
        fov: DEFAULTS.fov,
      };

      // Mobile overrides for performance
      if (isMobile) {
        this.config.dotSpacing = Math.max(this.config.dotSpacing, 30);
        this.config.dotSize = Math.max(this.config.dotSize, 1.5);
      }

      this.init();
    }

    init() {
      // Create canvas
      this.canvas = document.createElement("canvas");
      this.canvas.style.position = "absolute";
      this.canvas.style.top = "0";
      this.canvas.style.left = "0";
      this.canvas.style.width = "100%";
      this.canvas.style.height = `${this.config.heightPercent}%`;
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.zIndex = "0";

      this.ctx = this.canvas.getContext("2d");

      if (this.container.firstChild) {
        this.container.insertBefore(this.canvas, this.container.firstChild);
      } else {
        this.container.appendChild(this.canvas);
      }

      // Ensure container positioning
      const computedPosition = getComputedStyle(this.container).position;
      if (computedPosition === "static") {
        this.container.style.position = "relative";
      }

      // Resize observer
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      // Initial setup
      this.handleResize();

      // Start animation
      if (typeof gsap !== "undefined" && gsap.ticker) {
        gsap.ticker.add(this.animate.bind(this));
      } else {
        this.animate();
      }
    }

    handleResize() {
      const rect = this.container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;

      this.ctx.scale(dpr, dpr);

      this.width = rect.width;
      this.height = rect.height;

      this.createParticles();
    }

    createParticles() {
      this.particles = [];
      const spacing = this.config.dotSpacing;

      // Calculate grid dimensions
      // Increase range to ensure we cover the "floor" even with tilt
      // Increased z-depth coverage to bring dots closer to camera (bottom of screen)
      const cols = Math.ceil(this.width / spacing) * 2.5;
      const rows = Math.ceil(this.height / spacing) * 3.0; // Increased rows for more depth

      // Center the grid
      const startX = -(cols * spacing) / 2;
      const startZ = -200; // Start slightly behind

      for (let ix = 0; ix < cols; ix++) {
        for (let iz = 0; iz < rows; iz++) {
          const x = startX + ix * spacing;
          const z = startZ + iz * spacing;

          this.particles.push({
            x: x,
            y: 0,
            z: z,
            baseX: x,
            baseZ: z,
          });
        }
      }
    }

    animate() {
      if (!this.ctx || !this.canvas) return;

      // Clear
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Animation parameters
      this.time += this.config.waveSpeed * 0.01; // Slower, smoother

      const cx = this.width / 2;
      const cy = this.height / 2; // Reverted to center horizon
      const fov = this.config.fov;

      // Update and draw particles
      this.ctx.fillStyle = this.config.dotColor;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // 3D WAVE MATH
        // To match the reference:
        // 1. Large, smooth sweeping curves (low frequency)
        // 2. Lines of dots should appear to curve (X displacement)

        // Base wave - large rolling diagonal
        const wave1 = Math.sin(p.baseX * 0.001 + p.baseZ * 0.001 + this.time);

        // Secondary detail - reduced frequency for smoothness
        const wave2 = Math.cos(p.baseX * 0.002 - this.time * 0.5);

        // Apply height (Y)
        p.y = wave1 * this.config.waveAmplitude * 2 + wave2 * this.config.waveAmplitude * 0.5;

        // Apply lateral displacement (X) to curve the grid lines
        // This is key for the "flow" look in the reference
        const xOffset = Math.sin(p.baseZ * 0.001 + this.time) * 100;
        p.x = p.baseX + xOffset;

        // 3D Transformation
        // Reverted to "Floor" perspective as requested
        const angleX = 1.0;
        const angleY = 0.0;

        // Rotation around X (Tilt)
        let y1 = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
        let z1 = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);

        // Rotation around Y (Spin) - simplified since we want the wave to drive the shape
        let x1 = p.x * Math.cos(angleY) - z1 * Math.sin(angleY);
        let z2 = p.x * Math.sin(angleY) + z1 * Math.cos(angleY);

        // Shift deeper into screen
        z2 += 600;

        // Project to 2D
        if (z2 < 100) continue; // Behind camera

        const scale = fov / z2;
        const x2d = cx + x1 * scale;
        const y2d = cy + y1 * scale;

        // Draw properties
        const dist = z2;
        // Fog/Fade effect - fade out distant dots
        const alpha = Math.max(0, Math.min(1, (2000 - dist) / 800)) * this.config.dotOpacity;
        const size = this.config.dotSize * scale; // Standard perspective scaling

        if (alpha > 0.01 && size > 0.1) {
          // Draw dot
          this.ctx.globalAlpha = alpha;
          this.ctx.beginPath();
          this.ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.globalAlpha = 1;

      // Apply gradient mask to fade out bottom
      this.drawGradientMask();

      if (typeof gsap === "undefined" || !gsap.ticker) {
        this.rafId = requestAnimationFrame(this.animate.bind(this));
      }
    }

    drawGradientMask() {
      // Use destination-out to erase/fade edges
      this.ctx.save();
      this.ctx.globalCompositeOperation = "destination-out";

      // 1. Horizontal Fade (Right side)
      // "Cuts it at the 75% width" -> Start fading at 50%, fully transparent by 85%
      const widthFade = this.ctx.createLinearGradient(this.width * 0.5, 0, this.width * 0.85, 0);
      widthFade.addColorStop(0, "rgba(0,0,0,0)");
      widthFade.addColorStop(1, "rgba(0,0,0,1)");

      this.ctx.fillStyle = widthFade;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Horizon Fade (Top)
      // Essential for the "floor" perspective so dots don't pop in at the horizon
      const horizonFade = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.2);
      horizonFade.addColorStop(0, "rgba(0,0,0,1)");
      horizonFade.addColorStop(1, "rgba(0,0,0,0)");

      this.ctx.fillStyle = horizonFade;
      this.ctx.fillRect(0, 0, this.width, this.height * 0.2);

      // 3. Bottom Fade (Subtle)
      // Ensure dots at very bottom don't get abruptly cut off, but don't erase them
      // "Fully present at bottom" means we shouldn't mask them out strongly.
      // But a very slight soft edge is usually good practice.
      // The user asked for "fully present", so let's removing any bottom masking.
      // Keeping this section comment for clarity on decision.

      this.ctx.restore();
    }

    destroy() {
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (typeof gsap !== "undefined" && gsap.ticker) gsap.ticker.remove(this.animate.bind(this));
      if (this.canvas) this.canvas.remove();
      this.particles = [];
    }
  }

  // Initialization logic
  function initWaveDots() {
    const containers = document.querySelectorAll(".wave-dots-bg");
    containers.forEach((container) => {
      if (container.dataset.waveDotsInitialized) return;
      container.dataset.waveDotsInitialized = "true";
      const animation = new WaveDotsAnimation(container);
      container._waveDotsAnimation = animation;
      container.addEventListener(
        "animationcleanup",
        () => {
          animation.destroy();
          delete container.dataset.waveDotsInitialized;
          delete container._waveDotsAnimation;
        },
        { once: true }
      );
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(initWaveDots);
  } else {
    document.addEventListener("DOMContentLoaded", initWaveDots, { once: true });
  }
})();
