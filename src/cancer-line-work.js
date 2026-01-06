/**
 * Cancer Line Work - 3D Sphere Visualization
 *
 * Creates a wireframe sphere with radiating spikes for the hero section.
 * Requires THREE.js to be loaded globally before this script runs.
 *
 * Usage: Load THREE.js globally, then load this script (deferred).
 * This script auto-initializes on DOMContentLoaded.
 */
(function () {
  "use strict";

  function initCancerLineWork() {
    const container = document.querySelector(".section_header5");
    if (!container) return;

    // Prevent double-init
    if (container.dataset.cancerLineWorkInit) return;
    container.dataset.cancerLineWorkInit = "true";

    const canvas = document.createElement("canvas");
    canvas.classList.add("cancer-canvas");
    canvas.style.backgroundColor = "transparent";
    container.appendChild(canvas);

    const THEME = {
      line: 0xcdc9d8, // Slightly cooler gray-lavender to match Figma
      core: 0xf2f1f6,
    };

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0.7, -0.2, 12.8);
    camera.lookAt(0, 0, 0);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    // More visible core sphere
    const coreGeom = new THREE.SphereGeometry(4.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: THEME.core, opacity: 0.14, transparent: true });
    const core = new THREE.Mesh(coreGeom, coreMat);

    // Dense wireframe with many more lines - single shell for cohesion
    const wireGeom = new THREE.IcosahedronGeometry(5.2, 5);
    const wireMat = new THREE.LineBasicMaterial({ color: THEME.line, transparent: true, opacity: 0.92 });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeom), wireMat);

    // More visible spikes
    const spikes = new THREE.Group();
    const SPIKE_COUNT = 240;
    for (let i = 0; i < SPIKE_COUNT; i++) {
      const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      const length = 3.6 + Math.random() * 6.4;
      const opacity = 0.62 + Math.random() * 0.18;
      const spikeMat = new THREE.LineBasicMaterial({ color: THEME.line, transparent: true, opacity });
      const inner = dir.clone().multiplyScalar(5.1);
      const outer = dir.clone().multiplyScalar(5.1 + length);
      const geom = new THREE.BufferGeometry().setFromPoints([inner, outer]);
      geom.computeBoundingSphere();
      const line = new THREE.Line(geom, spikeMat);
      line.userData = { baseLength: length, phase: Math.random() * Math.PI * 2 };
      spikes.add(line);
    }

    const group = new THREE.Group();
    group.add(core);
    group.add(wire);
    group.add(spikes);
    group.position.set(1.56, -0.24, 0);
    group.scale.set(1.02, 1.02, 1.02);
    scene.add(group);

    // Fade in canvas after first render
    let isLoaded = false;
    let isVisible = false;
    let animationId = null;

    // Visibility detection - pause animation when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationId) {
            t0 = performance.now(); // Reset time to avoid jumps
            animate();
          }
        });
      },
      { threshold: 0, rootMargin: "50px" } // Start slightly before visible
    );
    observer.observe(canvas);

    // Animation loop - gentle rotation only
    let t0 = performance.now();
    function animate() {
      if (!isVisible) {
        animationId = null;
        return; // Stop loop when not visible
      }

      if (!isLoaded) {
        canvas.classList.add("loaded");
        isLoaded = true;
      }
      const t = performance.now();
      const dt = (t - t0) / 1000;
      t0 = t;
      const time = t * 0.001;

      // Slower, more subtle rotation
      group.rotation.y += dt * 0.05;
      group.rotation.x += dt * 0.02;

      // Very subtle spike pulsing
      spikes.children.forEach((line) => {
        const s = 1 + Math.sin(time * 1.2 + line.userData.phase) * 0.03;
        line.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    // Initial start handled by observer when element becomes visible
  }

  // Initialize when DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(initCancerLineWork);
  } else {
    document.addEventListener("DOMContentLoaded", initCancerLineWork, { once: true });
  }
})();
