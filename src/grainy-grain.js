/**
 * grainy-grain.js
 * Sets up a static film grain texture using SVG feTurbulence filter.
 * No animation — just a one-time setup for subtle texture.
 */
(() => {
  const turb = document.querySelector("#turb");

  if (!turb) {
    console.warn("[grainy-grain] #turb filter not found; grain disabled.");
    return;
  }

  // Static grain settings — no animation needed
  const baseFrequency = 0.65;
  const seed = 42;

  turb.setAttribute("baseFrequency", baseFrequency.toFixed(2));
  turb.setAttribute("seed", seed);
})();

