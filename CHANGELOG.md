# Changelog

Flint tokens follow semver, independent of the consuming apps.

## v1.0.1

Accessibility and tooling fixes. No breaking changes; safe to bump from v1.0.0.

### Dark mode contrast (WCAG AA)

- `action/primary`: blue/600 to blue/500 in dark mode. Primary on the dark page went from 2.76:1 to 3.31:1; white text on the filled button stays at 5.39:1. `action/primary-hover` moved to blue/600 so the hover stays adjacent.
- `border/default` to gray/500 and `border/strong` to gray/400 in dark mode, so control boundaries are visible (1.41:1 to 3.07:1, and 1.93:1 to 5.71:1).
- `text/placeholder` now meets contrast in both modes (light went 2.69:1 to 3.16:1, dark is 4.63:1), pointed at the new gray/450 step.

### Tokens

- Added the `gray/450` primitive (`#8492a6`), used by `text/placeholder` in both modes. This is additive; under strict semver it would be a minor, but it ships here as part of the contrast fix.

### Tooling

- Added a build-time contrast guard (`scripts/check-contrast.mjs`, run by `build` and `prepare`) that checks every semantic pairing in light and dark against WCAG and fails the build on a regression.

### Brand

- Added the Flint logo, icon, inverse and mono marks, favicon, and brand guidelines under `brand/`.

## v1.0.0

Initial Flint tokens release: color ramps, semantic tokens (light and dark), spacing, radius, type, and the Open Sans family. Generated to `tokens.css` and typed JS exports from `tokens.json`.
