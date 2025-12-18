# Navbar Animation - Quick Reference

## 🎨 Theme Selection

### When to use DARK theme (default)

- ✅ Light hero backgrounds
- ✅ Neutral/white hero sections
- ✅ Homepage with light gradient

**Set:** `data-theme="dark"` or omit attribute

### When to use LIGHT theme

- ✅ Dark hero backgrounds
- ✅ Black/navy hero sections
- ✅ Pages with dark imagery

**Set:** `data-theme="light"`

---

## 📋 Quick Copy-Paste

### Webflow Custom Code (Footer)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="/scripts/DrawSVGPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="/src/logo-draw.js"></script>
<script src="/src/nav-bg.js"></script>
```

### Navbar Attribute

**Dark theme:**

```html
<nav class="navbar16_component w-nav" data-theme="dark"></nav>
```

**Light theme:**

```html
<nav class="navbar16_component w-nav" data-theme="light"></nav>
```

---

## 🎬 Animation Behavior

| Element             | Dark Theme          | Light Theme            |
| ------------------- | ------------------- | ---------------------- |
| **Background**      | Transparent → White | Transparent → White    |
| **Logo Icon**       | Dark (stays)        | White → Dark           |
| **Logo Text**       | Dark visible        | Light → Dark crossfade |
| **Menu Icon Text**  | Dark (stays)        | White → Dark           |
| **Menu Icon Lines** | Dark (stays)        | White → Dark           |
| **Nav Links**       | Dark (stays)        | White → Dark           |
| **Scroll Distance** | 100px               | 100px                  |

---

## 🔧 Customization

Edit `scrollDistance` in `src/nav-bg.js`:

```javascript
const CONFIG = {
  scrollDistance: 100, // Change this value
  // ...
};
```

**Recommended values:**

- Fast transition: `50-75px`
- Default: `100px`
- Slow transition: `150-200px`

---

## ✅ Checklist for New Pages

- [ ] GSAP scripts loaded in footer
- [ ] `data-theme` attribute set on navbar
- [ ] Logo icon SVG included in navbar
- [ ] Both logo text images included (dark + light)
- [ ] Test scroll animation on page
- [ ] Verify logo visibility at top of page
- [ ] Verify logo visibility after scroll

---

## 🐛 Quick Troubleshooting

| Issue                 | Fix                          |
| --------------------- | ---------------------------- |
| Logo not drawing      | Check DrawSVGPlugin loaded   |
| Background not fading | Check ScrollTrigger loaded   |
| Wrong logo color      | Check `data-theme` attribute |
| No animation          | Check GSAP loaded first      |
| Logo disappears       | Check both logo images exist |

---

## 📁 File Locations

- **Main script:** `src/nav-bg.js`
- **Logo animation:** `src/logo-draw.js`
- **Logo SVG:** `dist/the-og-dude.html`
- **Test page:** `nav-bg.html`
- **Full docs:** `NAVBAR-IMPLEMENTATION.md`
