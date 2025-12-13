// Abacus GSAP Animation
// Each bead group moves within its bounded rect, keeping circles fully inside
// Circle radius is 25-26, so we need to keep the circle center within bounds

const beads = [
  // Bead 1: rect y=43, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3, delay: 0 },
  // Bead 2: rect y=135, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3.5, delay: 0.2 },
  // Bead 3: rect y=102.5, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3, delay: 0.4 },
  // Bead 4: rect y=161, limited to stay within bounds
  { minY: 0, maxY: 23, duration: 3.2, delay: 0.1 },
  // Bead 5: rect y=39, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3.6, delay: 0.3 },
  // Bead 6: rect y=84, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3, delay: 0.5 },
  // Bead 7: rect y=55, limited to stay within bounds
  { minY: 0, maxY: 46, duration: 3.4, delay: 0.15 },
  // Bead 8: rect y=155, limited so circle doesn't go past y=276 (301-25 radius)
  { minY: 0, maxY: 22, duration: 3.1, delay: 0.35 },
];

// Get all bead groups
const beadGroups = document.querySelectorAll("g.bead-group");

beadGroups.forEach((group, index) => {
  if (beads[index]) {
    const bead = beads[index];
    gsap.timeline({ repeat: -1, yoyo: true }).to(
      group,
      {
        y: bead.maxY,
        duration: bead.duration,
        ease: "sine.inOut",
      },
      bead.delay
    );
  }
});
