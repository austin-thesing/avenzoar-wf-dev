/**
 * grainy-grain.js
 * Animates an SVG feTurbulence filter to create a subtle, shifting grain effect.
 * Requires GSAP to be loaded before this script runs.
 */
(() => {
  const turb = document.querySelector("#turb");

  if (!turb) {
    console.warn("[grainy-grain] #turb filter not found; grain animation disabled.");
    return;
  }

  if (!window.gsap) {
    console.warn("[grainy-grain] GSAP not available; grain animation disabled.");
    return;
  }

  const gsapInstance = window.gsap;
  const baseFrequency = 0.74;
  const jitter = 0.006;
  const seedRange = { min: 0, max: 80 };
  const changeInterval = 90;

  gsapInstance.set(turb, {
    attr: { baseFrequency },
  });

  let frameCount = 0;
  const tickerHandler = () => {
    frameCount += 1;
    if (frameCount % changeInterval === 0) {
      const nextSeed = Math.floor(gsapInstance.utils.random(seedRange.min, seedRange.max));
      const nextFrequency = baseFrequency + gsapInstance.utils.random(-jitter, jitter);

      turb.setAttribute("seed", nextSeed);
      turb.setAttribute("baseFrequency", nextFrequency.toFixed(4));
    }
  };

  gsapInstance.ticker.add(tickerHandler);
})();

