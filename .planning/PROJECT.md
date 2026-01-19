# Visual updates - branding

Visual and branding updates for the Tuner music streaming application.

## Vision

Apply consistent Tuner branding across the application with a polished, animated loading experience that showcases the brand identity.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [x] Favicon using tuner-icon-32.svg (colorful gradient ring with pause icon)
- [x] Header logo in upper right using Tuner-dark.svg (slides in from left with ease)
- [x] Splash screen on load:
  - Blurred album background from last played channel
  - Dark overlay (70% opacity)
  - Centered Tuner-dark.svg logo
  - 1 second delay
  - Unblur background, fade overlay, fade logo
  - Header logo slides in after splash completes

### Out of Scope

- Brand color system changes
- Typography updates
- Additional icon variants

## Architecture

### Assets

| Asset | Location | Usage |
|-------|----------|-------|
| tuner-icon-32.svg | /public/favicon.svg | Browser tab favicon |
| Tuner-dark.svg | /public/tuner-logo.svg | Header + splash screen |

### Components Modified

- `index.html` - Favicon reference, page title
- `App.tsx` - Splash screen state, header component, animation logic
- `App.css` - Header styles, splash screen styles, animations

## Technical Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SVG favicon | Scalable, supports gradients | Complete |
| CSS-only animations | No additional dependencies, smooth performance | Complete |
| localStorage image for splash | Immediate background without API delay | Complete |

## Constraints

- Must work with existing React + Vite setup
- No additional npm dependencies
- Animations must feel smooth and polished

## Success Metrics

- Favicon displays correctly in browser tab
- Splash screen shows on initial load
- Header logo visible after splash animation
- All animations complete smoothly

---
*Last updated: 2026-01-19 after Phase 1 implementation*
