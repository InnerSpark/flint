# Changelog

Flint tokens follow semver, independent of the consuming apps.

## v1.6.1

- Ownership/licensing: the LICENSE copyright now names the full legal entity, "Inner Spark Media, LLC" (previously "Inner Spark Media"), and `package.json` gains `author` and `repository`. Added a NOTICE. No token, component, or API changes; consumers can re-pin at their next Flint bump.

## v1.6.0

System-level tokens and a wider canonical component set. Additive, no breaking changes.

- The factory now sets `theme.spacing` from the space scale (`space/8`) and `theme.breakpoints` from a new `breakpoint` token group (`xs` 0, `sm` 640, `md` 768, `lg` 900, `xl` 1200), so consumers stop re-deriving them.
- `targetMin` now ships as a `--target-min` CSS variable, and the breakpoints as `--breakpoint-*`, so non-MUI surfaces (the marketing site) stop hardcoding `24px` / ad-hoc widths. The breakpoint scale is in the DTCG export too.
- Added disabled-state tokens beyond placeholder: `action.disabled`, `action.disabledBg`, and `border.disabled` (light and dark), wired into `palette.action` and the control components. Modal overlays use the existing `overlayScrim` token via a canonical `MuiBackdrop`.
- New canonical components, all token-driven and mode-aware: `MuiTableHead` / `MuiTableCell` / `MuiTableBody` (subtle header surface, token cell borders + padding, body-row hover), `MuiSwitch` (track `border.strong`, checked `action.primary`, disabled `action.disabledBg`), `MuiSelect` icon, `MuiAvatar`, `MuiSnackbarContent` (inverse surface), `MuiCheckbox` / `MuiRadio` (action/border tokens), and `MuiLink` (underlined by default for WCAG 1.4.1, leaving the app's selector exceptions local). (ASDS-19)

## v1.5.0

Dark-aware elevation and a broad canonical MUI component set. Additive, no breaking changes.

- Dark-aware shadows: added a `shadowDark` token group (a deeper drop shadow plus a faint 1px light ring) so elevation reads on dark surfaces instead of vanishing. The `--shadow-*` CSS vars now flip under `[data-theme="dark"]` and `prefers-color-scheme`, and the DTCG export carries both (multi-layer shadows as layer arrays). The JS `shadow` export stays light; `shadowDark` is the dark counterpart.
- `createFlintTheme` now sets `theme.shape.borderRadius` from `radius/xs` (4px), so unitless MUI radii map onto the Flint scale (`1`=4, `2`=8, `3`=12, `4`=16) by design instead of by MUI's incidental default.
- Canonical `MuiPaper`: drops MUI's dark elevation overlay and maps the `elevation` prop onto the shadow tokens (mode-aware), which covers `Menu`, `Popover`, `Dialog`, and `Drawer` since they are all Paper-based. Floating surfaces no longer hand-roll shadows. `Menu`/`Popover`/`Dialog` papers also get token radii.
- Canonical `MuiChip` (pill, token-driven success/warning/error/info intents), `MuiAccordion` (off-scale 10px radius replaced with `radius/md`, token border, expanded-only shadow), `MuiInputBase`/`MuiOutlinedInput` sizing wired to `control.md` (40px), `MuiAlert` (mapped to the feedback intents), `MuiToggleButton` (selected uses the `selected.*` tokens), `MuiTooltip` (inverse surface/text), and `MuiLinearProgress` (track `border.default`, bar `action.primary`). (ASDS-17, ASDS-18)

## v1.4.0

Adds a canonical MUI `Card` to the theme factory. Additive, no breaking changes.

- `createFlintTheme` now styles `MuiCard` from the card tokens: `surface.default` background, a 1px `border.default` outline, `radius/md` (12px) corners, and the `shadow.card` elevation, with MUI's own elevation shadow and dark-mode background overlay turned off (`elevation: 0`, `backgroundImage: none`). `MuiCardContent` padding is normalized to `space/16`, dropping MUI's 24px last-child quirk so padding is even on every side. Renders in light and dark. (ASDS-16)

## v1.3.0

Dark-mode neutrals re-toned to a near-neutral ink (GitHub / VS Code style). Additive: no token removed or renamed.

- Added an `ink` primitive ramp (`#f0f6fc` to `#010409`), a near-neutral dark scale that replaces the blue-heavy slate in dark mode.
- Repointed dark `surface` (page `#0d1117`, default `#161b22`, subtle `#21262d`, code `#010409`), the neutral `text` greys (heading/default/muted/placeholder/inverse), and `border` (default/strong) to `ink`. Brand blues (links, primary, focus ring, info) are unchanged.
- Every dark pairing still passes the contrast guard: `border.default` holds 3.77:1 for visible control edges, `text.placeholder` 5.01:1, and `accent.cyan` rises to 10.38:1 on the darker surface.
- `gray/350` and `gray/450` (previously dark muted/placeholder) are no longer referenced but remain as primitives. (ASDS-15)

## v1.2.0

Additive package tokens and delivery options. No breaking changes.

- Added `motion` tokens (durations and easings) and a `zIndex` scale (dropdown, sticky, overlay, modal, popover, toast), emitted to CSS (`--duration-*`, `--ease-*`, `--z-*`) and the JS exports.
- Added `dist/tokens.media.css`, a `prefers-color-scheme` variant for consumers who want automatic dark without toggling `data-theme`. Importable as `@innerspark/flint/tokens.media.css`.
- Added a proprietary `LICENSE` and set the `license` field to `SEE LICENSE IN LICENSE`.
- Added `dist/tokens.dtcg.json`, a W3C Design Tokens (DTCG) export (`$type` / `$value`, semantic split into `light` and `dark`) for Tokens Studio, Style Dictionary, and Figma Make. Importable as `@innerspark/flint/tokens.dtcg.json`.
- Added an adaptive `accent.cyan` token (light sky/800 `#075985`, dark sky/300 `#7dd3fc`), AA as text in both modes (7.56:1 / 8.77:1 on the default surface).
- Added an optional MUI entry, `@innerspark/flint/mui`, exporting `createFlintTheme(mode, overrides?)` (and the pure `flintThemeOptions(mode)`) that wires the Flint palette, type scale, and focus / target-size baseline into a MUI theme for light or dark. `@mui/material` is an optional peer dependency.

## v1.1.0

Adds shadow and typography tokens. Additive, no breaking changes.

- Added a `shadow` token group (card, popover, dialog, raised) as ready-to-use CSS box-shadow strings, emitted to `--shadow-*` and the JS exports. Mirrors the Figma effect styles.
- Added a `typography` token group: the composed text styles (display, displayXl, heading h1-h3, body lg/md/sm, label variants) with family, size, weight, line-height, and letter-spacing, so code builds text identically to the Figma text styles.

## v1.0.2

Text-contrast fixes for text on tinted and elevated surfaces.

- `text.placeholder` now meets 4.5:1 on input surfaces (light to gray/500 `#64748b`, dark stays gray/450 `#8492a6`). Placeholders are text under WCAG 1.4.3, so they are held to AA; they stay distinct from entered values, which use the darker `text.default`.
- `text.muted` darkened so captions pass on tinted/elevated surfaces: light to gray/550 `#5f6f84` (4.68:1 on `surface.subtle`), dark to gray/350 `#9fadc1` (4.55:1 on `surface.subtle`). Previously borderline (4.34 / 4.04).
- Added `gray/350` (`#9fadc1`) and `gray/550` (`#5f6f84`) primitives so muted and placeholder stay ramp aliases. The text grays now form a clean hierarchy: `text.default` > `text.muted` > `text.placeholder`.
- Documented the foreground-versus-fill color rule (see README): colored text and icons use `*.text` / `text.link` / `accent.aaaText`; the saturated `*.solid` tokens are fills only, with white `*.onSolid` on top.
- Contrast guard updated: placeholder is checked at 4.5 on the default and page surfaces, and muted is now verified on the subtle surface in both modes.

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
