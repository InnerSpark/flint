# Changelog

Flint tokens follow semver, independent of the consuming apps.

## Unreleased

- **Select (ASDS-66).** `.flint-select` styles the native select to match the input: the arrow is two gradients in `select.icon` (no image, follows light and dark), an empty first option shows in the placeholder color, `aria-invalid` and disabled states, and the native arrow returns in forced-colors mode. Docs page and a workbench bench (MUI NativeSelect, a token-styled native select for shadcn, plain CSS). Workbench notices are titled "Known gaps", since several now cover shadcn as well as MUI. Docs verify's Hover check now covers selects.
- **Switch (ASDS-65).** `.flint-switch` on a native checkbox with `role="switch"`: 48x24 track, the thumb slides so the state is never color alone, motion stops under reduced motion, and forced-colors mode uses system colors. New `switch.thumbDisabled` token: the disabled thumb was white on a near-white track (light) or dark on dark (dark, on), so its position, the only cue left, disappeared. Now 4.34:1 light and 4.40:1 dark; the MUI theme uses it too. Docs page, a shadcn Switch (adds `@radix-ui/react-switch` to the docs), and a workbench bench.
- **Component CSS guard** now checks rules inside `@media` blocks by their own selector. Before, it read the whole block as one rule and could miss problems inside it.
- **Checkbox (ASDS-63) and Radio (ASDS-64).** New `checkbox.borderError` and `radio.borderError` (4.83:1 light, 6.25:1 dark) and `aria-invalid` styles for both. Checkbox gains an indeterminate state (a bar, announced as mixed), and its hover and disabled styles now read the checkbox tokens instead of the input and semantic ones. New `.flint-choice` (a label row, at least 24px tall) and `.flint-fieldset` / `.flint-fieldset__legend` for groups, replacing the docs site's own `.check-row` and `.example-fieldset`. The shadcn checkbox draws the indeterminate bar and the error edge. Radio gets a workbench bench, which adds `@radix-ui/react-radio-group` to the docs dependencies (run `npm ci` in docs/).
- **Docs reading order.** The side nav now follows the page content in the DOM, so keyboard and screen reader users get header, content, then the side nav. CSS grid still draws it on the left. `verify.mjs` checks the DOM order on every page and walks the Tab order (header, main, side nav, footer) on a component page.

## v1.14.0 (2026-10-23)
- **Input (ASDS-62).** New `input.bgReadOnly` token (13.35:1 light, 9.86:1 dark for the text on it) and `.flint-input[readonly]`: tinted, in the tab order, full contrast. `textarea.flint-input` for multi-line (two lines tall, resizes vertically only), and `type="search"` drops the platform's rounded styling. The docs cover `type`, `inputmode` and `autocomplete` (WCAG 1.3.5), and the workbench gains a Read-only row.
- **`text.inverseMuted` (ASDS-72).** Quieter text for navy bands and other inverse surfaces: gray.300 in light, gray.700 in dark, about 9.8:1 on `surface.inverse` in both. The docs footer uses it in place of a `color-mix`.
- **Field (ASDS-61).** New `field.labelFg`, `field.helperFg` and `field.errorFg` component tokens (8.6:1 and up in both modes) and `.flint-field` in components.css: visible label, "(required)" in words, helper text, and an error that replaces the helper. Docs page with the focus-first-error pattern, and a workbench bench. The Input examples now use it, and the docs site's own `.field` styles are gone.
- **Docs footer** lists every link in each column (it stopped at six).
- **Docs restyled after the AccessSpark marketing site (ASDS-54).** Light, translucent sticky header with section nav and a Get started button; uppercase eyebrows and extra-bold, tighter headings; a home page with a tinted hero and a new token-tiers illustration, alternating section bands, card grids, the principles, and a navy call-to-action band; a full-width navy footer with link columns. The navy bands switch to the default surface in dark mode so their text keeps its contrast. The home page drops the side nav on wide screens. Flint's own buttons and links are used throughout. Docs verify passes in both themes.
- **Link (ASDS-60).** New `link.fg` component token and `.flint-link` in components.css: always underlined, thicker underline on hover, standalone variant at the 24px target, a decorative arrow on `target="_blank"`, and a `.flint-sr-only` utility for the "(opens in a new tab)" text. Contrast guarded on page, default and subtle surfaces (7.13:1 and up). Docs page and a workbench bench. The MUI theme now thickens link underlines on hover too.
- **Pressed buttons.** New `action.primaryPressed` and `action.dangerPressed` (blue.900 and red.950 in light, blue.100 and red.100 in dark) and `button.primary.bgPressed` / `button.danger.bgPressed`. Labels stay above 14:1. Adds `color.red.950`. Secondary and text buttons keep their hover look when pressed, because no darker surface holds their label at 7:1 in dark mode. The workbench gains a Pressed row (forced `:active`).
- **Every token has a docs home.** The token explorer lists tokens for components that have no page yet (chip, badge, select, switch, skip link, icon), so docs verify passes clean. Each table moves to its component page when that page ships.
- **Button: busy, icon-only and focusable-disabled states (ASDS-59).** `aria-busy="true"` adds a spinner beside the label (still under reduced motion). `flint-btn--icon` makes a square icon button sized from `icon-size.md`. `aria-disabled="true"` styles like `disabled` but stays in the tab order. Disabled buttons use `GrayText` in forced-colors mode. The workbench gains a Busy row. Docs pages now show `@media` and `@keyframes` blocks with a component's rules instead of dropping their wrappers. Additive.
- **`@innerspark/flint/components.css` (ASDS-58).** The plain CSS components (Button, Input, Checkbox, Radio) move from the docs workbench into the package: source in `css/components.css`, shipped as `dist/components.css`. The docs and workbench import the package file, so there is one copy. New `scripts/check-components.mjs` runs in `npm run build` and fails on a color literal, a variable `tokens.css` does not define, or a px value outside borders and glyph geometry. Additive.
- **Principles page (ASDS-47, ASDS-48, ASDS-49).** New `/principles/`: how Flint looks, behaves and talks. Each principle links to where it is enforced. The page count comes from `docs/src/data/principles.js`, never typed by hand. Usage rules gain the color rules (one action color, red only for danger and error) and a Words section.
- **Token explorer (ASDS-50).** New `/foundations/tokens/`: pick any component, semantic or primitive token to see its chain to the ladder in light and dark, its Figma, CSS, JS and Swift names, and what references it. All computed from the build. "Used by" links move focus to the new result heading.
- **Illustrations (ASDS-56).** First spot illustrations (a hero and the three principle groups), drawn from the brand shard and spark. Colors are Flint variables mapped to facet roles in `docs/src/styles/illustration.css`, so they flip with dark mode. Decorative and `aria-hidden`. The spark twinkle respects reduced motion. Gap: the facet roles should move into `tokens.json`.
- **Docs nav scrollbar.** The side nav still scrolls, but its scrollbar is thin and only appears on hover or keyboard focus.
- **Dark-mode switch fix.** A checked switch in dark mode was a white thumb on a light-blue track, 1.80:1. Since v1.9.0 `action.primary` in dark is a light fill, so the thumb has to be `action.onPrimary` (near-black), not white. Now 10.49:1. Light mode is unchanged, because there `onPrimary` is white already. This is the AS-199 class of bug, and it slipped past the literal-color scan because the thumb read `color.white`, which looks token-driven.
- **Outlined chips get a visible edge.** An outlined chip sets a transparent background, so its border is the only thing that makes it visible, which puts it under 1.4.11. The `feedback.*.border` tokens are built to sit on their matching tinted fill, so standing alone on the page surface they were 1.2 to 2.4:1. Chip borders now read `feedback.*.solid` (and `border.control` for neutral), which is 3.77 to 10.36:1 in both modes. Filled chips are unchanged, and the tint borders keep their real job on Alert, where they do sit on a matching fill.
- **The contrast guard now covers every atom.** It previously checked component-tier pairs for button, input and checkbox only, so chip, badge, switch, radio, select, skip link and icon were unguarded. That is how the dark switch thumb reached 1.80:1 unnoticed. Adds 35 pairs, including the thumb against its own track in both positions, each chip and badge intent label on its own fill, and every select edge. Disabled pairs are advisory, matching how `button disabled label` is already treated.
- **Component tokens for every atom (ASDS-45).** The tier added in v1.13.0 covered `button`, `input`, `checkbox` and `focus`. It now covers the whole atom list: adds `radio`, `switch`, `select`, `chip`, `badge`, `skipLink` and `icon`, and fills in the states `input` and `checkbox` were missing (hover, disabled). 61 new tokens, every one a reference to an existing primitive or semantic token, so nothing new was invented. The MUI factory now reads the tier for Checkbox, Radio, Switch, Select and Chip instead of reaching into semantic directly; emitted output is byte-identical across light, dark, comfortable and compact, verified against a snapshot.
- `names.mjs` learned `fontWeight`, which the component tier needs for chip and badge weights. `check-parity.mjs` no longer appends `px` to unitless component tokens, so `fontWeight` compares against what CSS actually emits.

- **Workbench moves into the docs site.** Storybook is gone: its own interface failed accessibility checks Flint can't fix. `/workbench/` now renders Button, Checkbox and Input live as MUI, shadcn/ui and plain CSS in every state, with a density switch and the site's theme toggle. Forced hover and focus rows reuse each implementation's real CSS. The shadcn components and plain CSS live in `docs/src/workbench/`. `docs` verify now also checks workbench pages at both densities, that forced Hover rows differ from Default, and that every semantic and component token has a row.

## v1.13.0

A component tier, a shadcn bridge, chart colors, a parity test across every platform, a workbench and a docs site (ASDS-39, ASDS-40, ASDS-41, ASDS-42, ASDS-9). Additive: every existing CSS, JS and Swift value is unchanged, and the MUI theme output is identical in light and dark at both densities.

- **Component tokens (ASDS-39).** New `component` group: `button` (radius, height, primary, secondary, danger, text, disabled), `input` (radius, height, bg, fg, placeholder, border, borderHover, borderFocus, borderError), `checkbox` (size, radius, border, checkedBg, checkedFg) and `focus.ring` (color, width, offset). Values are mode-free references like `{semantic.action.primary}`, resolved once per mode. Emitted as CSS vars (`--button-primary-bg: var(--color-action-primary)`) redeclared under `:root, [data-theme]` so a nested dark section resolves its own colors, as `component.light` / `component.dark` in JS, as per-mode aliases in DTCG, and as `Flint.Component.*` in Swift.
- **Radius roles (ASDS-36).** `radius.control`, `radius.card`, `radius.cardLg` reference the ramp, matching the Figma Sizing collection. New CSS vars `--radius-control`, `--radius-card`, `--radius-card-lg`, plus `--control-sm/md` and `--icon-size-sm/md/lg`.
- **MUI factory reads component tokens.** Button radius, OutlinedInput radius and height, and the focus ring now come from the component tier. The Switch thumb uses `color.white` instead of a typed `#ffffff`. Output is byte-identical.
- **shadcn bridge (ASDS-40).** New `dist/shadcn.css` (`@innerspark/flint/shadcn.css`): every shadcn variable is a `var()` into Flint, a `@theme inline` block for Tailwind v4, and a `dark` variant that follows `data-theme="dark"`. `action.secondary` is deliberately not shadcn's secondary.
- **Chart colors (ASDS-40).** `semantic.{light,dark}.chart.1` to `.5` (blue, amber, violet, green, red), each at least 4.6:1 on page and default surfaces. Guarded at 3:1.
- **Contrast guard covers components and charts,** and writes every result to `dist/contrast.json` (`@innerspark/flint/contrast.json`): pairs, ratios, bars, pass or fail.
- **Parity test (ASDS-41).** `scripts/check-parity.mjs` runs in `npm run build`: 672 checks that CSS, shadcn, MUI and Swift land on the values tokens.json gives them, in light and dark, and that the MUI factory hardcodes no colors. A hand edit to any generated file fails the build.
- **Type styles as CSS variables.** Every typography style now has `--type-<style>-size`, `-weight`, `-line-height` and `-tracking` (for example `--type-heading-h1-size`), so plain CSS can use the type scale without retyping values. Covered by the parity test.
- **Nested light sections.** `tokens.css` now also carries the light semantic colors and shadows under `[data-theme="light"]`, so a light section can sit inside a dark page (dark inside light already worked).
- **Workbench (ASDS-42).** `workbench/` is a Storybook with generated token pages and Button, Input and Checkbox as MUI, shadcn and plain CSS in every state. `npm run verify` runs axe on every story in light and dark.
- **Docs site (ASDS-9, ASDS-26).** `docs/` is an Astro site for flint.innersparkmedia.com, styled only with Flint's own variables: get started per platform, foundations, component pages (usage, style, code, accessibility) and guides. Values, ratios and code samples are read from the build and the workbench source. Its verify runs axe on every page in light and dark, checks 375px width, and checks that skip links and hash links land and hold focus on headings. The workbench ships inside it at `/workbench/`. Cloudflare setup is in `docs/README.md`.
- **Found by the workbench, not fixed here:** the MUI adapter ignores the component tier for outlined buttons, input edges, input placeholders and checkbox focus. Fixing it changes how AccessSpark looks, so it is its own ticket.

## v1.12.0

Semantic colors now point at the ladder instead of copying its values, and the contrast guard enforces the AAA bar Flint already meets (ASDS-25, ASDS-35). Every CSS, JS, MUI and Swift output is byte-for-byte unchanged.

- **Semantic colors are references.** All 112 semantic color values in `tokens.json` are now `{color.<ramp>.<step>}` references (`"link": "{color.blue.700}"`) instead of copied hex. A ladder change now flows to every semantic token that uses it, and the data says where each value comes from. The two overlay scrims stay literal `rgba()` values since no ladder step carries alpha. First item of ASDS-25.
- **`scripts/resolve.mjs`** resolves references at build time. Unknown, circular, or group-pointing references throw, so a typo fails the build.
- **DTCG keeps the references.** `tokens.dtcg.json` semantic values are now DTCG aliases, so Tokens Studio and Style Dictionary see the link to the ladder.
- **New `dist/tokens.json`** holds the resolved values. The `@innerspark/flint/tokens.json` export now points at it, so importers keep getting hex. The source is available as `@innerspark/flint/tokens.source.json`. **Consumers that read the root `tokens.json` file by path, not through the package export, now see references** and should switch to the export or `dist/tokens.json`.
- **Contrast guard at 7:1.** All 27 text and on-solid pairs now check at AAA instead of 4.5:1, matching the bar set in v1.9.0. Non-text pairs stay at 3:1. A regression like light `text.link` at 6.18:1 used to pass and now fails (ASDS-35).
- **`Flint.UIColors` (iOS) and `Flint.NSColors` (macOS).** Every semantic color as a dynamic platform color for UIKit and AppKit APIs such as `UINavigationBarAppearance`. `UIColor(Flint.Colors.x)` locks to the current appearance, which forced apps to hand-copy palette values for each mode. Additive (ASDS-38).
- **README:** token layers, a Figma/CSS/JS/Swift naming map, a `semver:^1.12.0` install line in place of the stale `#v1.0.0` pin, and an accurate description (tokens plus MUI and Swift outputs). Part of ASDS-26.

## v1.11.0

Closes the density gap. Comfortable and Compact existed in the Figma Sizing collection but had no code equivalent, so a dimension the design system promised was unavailable to consumers (ASDS-33). Additive, and comfortable output is unchanged.

- Added a `density` token group with `comfortable` and `compact`, each carrying an `inset` scale (sm/md/lg/xl) and a `gap` scale (sm/md/lg), read from the Figma Sizing collection. Compact is one step down the space ramp: inset 8/12/16/24 becomes 4/8/12/16 and gap 8/12/16 becomes 4/8/12. This also introduces the semantic spacing tier on the code side, which previously had only the raw `space` primitive ramp.
- Emits `--inset-*` and `--gap-*` CSS vars at comfortable, with a `[data-density="compact"]` override block in both `tokens.css` and `tokens.media.css`, mirroring how dark mode is delivered. Density is in the DTCG export too.
- `flintThemeOptions(mode, density)` and a new object form for the theme factory: `createFlintTheme({ mode, density, overrides })`. The positional forms `createFlintTheme(mode)` and `createFlintTheme(mode, overrides)` are unchanged, so existing callers need no edit.
- `MuiCardContent` and `MuiTableCell` padding now resolve through the density scale. At comfortable they emit exactly what they did before (16, and 8/12), so adopting this release changes nothing visually until a consumer opts into compact.
- Density deliberately varies spacing only. `theme.spacing` stays on the 8px base so `sx` multipliers keep their meaning, and control sizes, icon sizes, radius and `targetMin` are identical in both densities, so a compact layout can never shrink a touch target below WCAG 2.5.8.
- Guard: added a density invariant that fails the build if a density group introduces anything beyond `inset` and `gap`. The contrast matrix does not grow, since density carries no color.

## v1.10.0

Adds a Swift/SwiftUI token output so native Apple apps consume Flint by git tag instead of hand-copying values (ASDS-27). Additive, no token changes.

- New `dist/swift/Flint.swift`, generated by `npm run build` from `tokens.json`, plus a root `Package.swift` (SwiftPM, iOS 16+ / macOS 13+).
- Semantic colors ship as dynamic colors that follow the system light/dark appearance. Raw ramps ship as `Flint.Palette`.
- Space, radius, control height, and icon size ship as `CGFloat` constants.
- Type styles ship as `Flint.Typography` with a `.flintText(_:)` modifier: Open Sans by PostScript name, scaled with Dynamic Type, line height and tracking included.
- Motion durations and easings ship as `Flint.Motion.animation(...)`, which returns no animation when Reduce Motion is on.
- `Flint.Target.touch` (44pt, Apple HIG) sits beside `Flint.Target.minimum` (`targetMin`, 24). It is a platform rule, so it lives in the Swift emitter, not in `tokens.json`.
- Shadows, z-index, and breakpoints are not in the Swift output yet.

## v1.9.0

Raises every semantic text pairing to WCAG AAA (7:1) in both modes, and fixes two contrast bugs (ASDS-23).

- Every text pairing now meets 7:1 in light and dark. Light went from 17 of 37 pairs at AAA to all of them; dark from 18 of 37.
- Added `text.onCode`. In dark mode, `text.inverse` on `surface.code` measured 1.09:1. Both tokens flip between modes, so the pair inverted into dark text on a near-black code surface. Code surfaces now carry their own foreground token (white in both modes) instead of borrowing the inverse text color.
- Fixed `text.placeholder` on `surface.subtle`, which was 4.34:1 light and 4.40:1 dark, under the 4.5 AA floor. Placeholder text is not exempt from 1.4.3; only genuinely disabled controls are.
- Darkened the light-mode brand solids one ladder step so white labels clear 7:1: `action.primary` blue/600 to blue/700, `action.danger` red/700 to red/800, and all four `feedback.*.solid` values. `text.link` moves to blue/700 and `accent.cyan` to sky/900.
- Inverted the dark-mode filled actions. Pushing those fills dark enough to carry a white label at 7:1 dropped `action.primary` to 2.21:1 against the dark page, failing the 1.4.11 control boundary. Dark mode now uses a light fill with a near-black label (`action.primary` blue/300 with `onPrimary` ink/900, and the same pattern for danger, the feedback solids, and `accent.aaaSolid`), which satisfies both the 7:1 label and the 3:1 edge.
- Neutral text compresses at AAA. Only gray/700 and darker clear 7:1 on `surface.subtle` (gray/600 lands at 6.92), so `text.muted` and `text.placeholder` now share a value. Restoring visual separation between them needs a re-spaced gray ladder, tracked separately.

Non-text contrast (1.4.11) has no AAA tier and stays at 3:1. `border.default`, `border.strong`, and the `feedback.*.border` values remain decorative and must never be the sole boundary of a control.

## v1.8.0

Extends the 1.4.11 control-boundary work to the remaining controls, and adds a guard that can see token *usage*, not just token values.

- Added `border.controlHover` (light gray/600 `#475569`, dark ink/300 `#9aa4af`) for the control hover step. The hover border used `border.strong`, which is 1.48:1 on a white field and fails 1.4.11 the same way the rest border did. Now 7.58:1 light / 6.84:1 dark, and a visible darkening from `border.control` rather than a same-value no-op.
- Repointed checkbox (unchecked), radio (unselected) and the switch off-track from `border.strong` to `border.control` in the MUI factory and the Figma library. For those three, that boundary is the only thing rendering the control, so it falls under 1.4.11 rather than being decorative; it was 1.48:1 in light. `border.strong` is unchanged and remains correct for dividers, card edges and non-control hover accents.
- Contrast guard: added a usage check. The value checks cannot see which token a component binds to, which is how those three shipped failing while every value check passed. The guard now fails the build if any component in the MUI factory references `border.strong`, and names the file and line.
- Contrast guard: `border.controlHover` is checked as required at 3:1 on both the field and page surfaces in both modes.

## v1.7.0

Fixes two contrast problems found while building the Form field component, and teaches the guard to catch them.

- Added `border.control`, a semantic token for form-control boundaries (light gray/500 `#64748b`, dark ink/500 `#6e7681`). The rest border on inputs previously used `border.default`, which is 1.23:1 against a white field in light mode. WCAG 1.4.11 requires 3:1 for the visual boundary that identifies a control, so the light-mode input outline was effectively invisible. `border.control` is 4.76:1 on the field and 4.55:1 on the page; dark mode is 3.77:1 / 4.12:1. `border.default` is unchanged and stays the decorative divider token.
- Raised `action.disabled` for legibility: light gray/400 to gray/500 (2.34:1 to 4.34:1 on the disabled background), dark ink/500 to ink/400 (3.31:1 to 4.40:1). Disabled controls are exempt under WCAG 1.4.3, so this is a readability improvement rather than a conformance fix, and the token stays visibly muted against `text.default`.
- Contrast guard: `border.control` and `border.error` are now checked as required at 3:1 on both the field and page surfaces in both modes, instead of being lumped in with decorative borders. `action.disabled` is reported as advisory under its exemption. Note this also caught that `feedback.error.solid` is only 2.67:1 on the dark field surface, so error borders must use `border.error`, not the solid.

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
