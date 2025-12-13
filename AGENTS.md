# AGENTS.md

**Purpose**: Development environment for GSAP animations that will be deployed to Webflow sites.

## Development Commands

**Serve locally:**
```bash
# Using VSCode Live Server (port 5501) or:
npx live-server --port=5501
```

**No build/test commands** - This is a static HTML/JS project with GSAP animations for Webflow integration.

## Code Style Guidelines

### General
- **Workflow**: PLAN → CODE → TESTS → NOTES (manual verification for UI changes)
- **Quality**: Clear, idiomatic, maintainable code with descriptive names; **strict typing**
- **Functions**: Small, composable functions; avoid over-engineering; focused diffs

### JavaScript/Animation Code
- Use vanilla JavaScript (no frameworks detected)
- GSAP for animations with timeline-based sequencing
- Keep animation configs declarative (see `src/abacus.js` pattern)
- **Always**: Handle errors, null/undefined; validate inputs; clean up resources (timelines, event listeners)

### HTML/CSS
- Inline styles preferred for typography per `.cursor/rules/06-typography.mdc`
- Use CSS variables: `--font-sans` (Raleway) and `--font-heading` (Merriweather Sans)
- SVG-based animations with GSAP
- No Tailwind or external CSS frameworks
- **Webflow compatibility**: Code must work when embedded in Webflow custom code sections

### Testing
- **Manual verification** for UI/animation changes
- **No automated tests** - this is a simple static animation project
- For complex features: add integration tests if framework is introduced

### Search Tools Priority
1. **ast-grep** for code-aware searches (functions, classes, imports)
2. **rg** (ripgrep) for text/config searches
3. **grep** as fallback

## Project Structure
- `src/` - JavaScript animation files (for Webflow deployment)
- `scripts/` - GSAP library files
- `.cursor/rules/` - Comprehensive Cursor rules (workflow, standards, typography)
- Static HTML files in root (local development/testing)

## Webflow Integration
- Animations are developed here then copied to Webflow custom code sections
- Ensure code is self-contained and doesn't conflict with Webflow's environment
- Test animations locally before deploying to Webflow