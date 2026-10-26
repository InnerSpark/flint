# Changelog

Flint tokens follow semver, independent of the consuming apps.

## Unreleased

- **Figma library synced to v1.16 (ASDS-89).** No package change; the library now matches the repo.
  - Fixed drift: added `color/red/950`, pointed `action/danger-active` at it, and added `text/inverse-muted` and `chart/1` to `chart/5`.
  - New **Brand** collection (Flint, AccessSpark, Inner Spark Media, Studio) and **Platform** collection (Web, iOS). Semantic and Sizing point at them, so brand, platform and light/dark switch independently with no extra modes. A diff against every brand's build returns zero differences.
  - iOS text styles: `ios/nav-title-large`, `ios/nav-title`, `ios/tab-label`.
  - New **iOS components** page: all 15 SwiftUI components with light and dark previews, Solid and Liquid Glass styles for the bars, sheet and floating buttons.
  - New **Illustration** page: the 18 docs illustrations as components, every fill bound to a variable (new `illustration/*` facet variables).
  - New **Link**, **Menu** and **Textarea** components.
  - CSS and Swift code syntax on every Semantic and Sizing variable.
  - `FIGMA_LIBRARY_GUIDELINES.md` and the docs Figma page describe the new collections and pages.

## v1.16.0 (2026-10-25)

- **Liquid Glass (ASDS-88).** On iOS 26 and later, `FlintChrome.apply()` was painting solid backgrounds on the navigation bar, tab bar and toolbar, and `.flintSheet()` a solid sheet. Both replace Liquid Glass with a flat surface, so they no longer do. On 26 and later Flint sets only the title fonts and the selected-tab tint, as Apple's guidance asks, and the system keeps the glass, the scroll edge effect, Reduce Transparency, Increase Contrast and the iOS 27 Clear/Tinted setting. iOS 16 to 25 keep the solid Flint bars.
  - New `.flintGlassButton(prominent:)` for floating controls: Apple's `.glass` / `.glassProminent` tinted with the primary action color on 26 and later (the prominent label keeps the on-primary color for contrast in dark mode), Flint secondary or primary before.
  - Glass stays on the navigation layer. Cards, notices and lists are unchanged.
  - CI builds the Swift package with the newest Xcode 26 on the runner.
  - Docs: the tab bar, navigation bar, toolbar and sheet pages, plus a new Glass button page, show Liquid Glass in light, dark and Reduce Transparency above the iOS 16 to 25 look. The phone app on the iOS page gains Liquid Glass, Reduce Transparency and Increase Contrast switches; glass is on by default.
  - **Check on a device:** glass rendering can't be tested in CI. Confirm the floating tab bar on iOS 26 or 27, solid bars with Reduce Transparency, and solid Flint bars on an iOS 18 simulator.
- **iOS components in the docs (ASDS-87).** A new iOS components group in the side nav: an overview and a page for each SwiftUI component (tab bar, navigation bar, toolbar, list rows, sheet, button, notice, tag, card, toggle row, choice picker, stepper, stat tile, empty state). Each page shows the component on a phone in light, dark and Accessibility 3 text, drawn in HTML from the iOS platform tokens, with when to use it, the SwiftUI code and how it behaves with VoiceOver. The dark and large-text phones are inert copies, so keyboard and screen reader users meet each control once.
- **The iOS page's phone is now a small app.** Two tabs with arrow-key navigation, a navigation bar whose large title shrinks to an inline title as you scroll, a settings list, and a sheet that takes focus, keeps Tab inside it, and returns focus to the plus button on Close or Escape. The VoiceOver captions read tabs ("Trips, tab, 1 of 2, selected"), rows, switches, fields and headings.
- **SwiftUI components (ASDS-38).** Every brand product now includes the same components, drawn from its own tokens:
  - From Bounder: `FlintButtonStyle` (`.buttonStyle(.flint(.primary))`, now with danger and text), `.flintCard()`, `FlintNotice` (adds success, a title and actions), `FlintTag` (one pill for the three hand-built copies), `FlintSectionTitle`, `FlintToggleRow`, `FlintChoicePicker`, `FlintStepper`, `FlintStatTile` and `FlintEmptyState`. Each keeps Bounder's accessibility behavior: spoken values, Dynamic Type layout switches, disabled reasons read aloud.
  - iOS only: `FlintChrome.apply()` styles Apple's own navigation bar, tab bar, toolbar and alert tint with the new platform type styles. It doesn't replace them, so VoiceOver, the large content viewer and iPad sidebars keep working.
  - Screens, lists and sheets: `FlintScreen`, `.flintList()` with `FlintRow`, `FlintRowButton` and `FlintListHeader`, plus `.flintSheet()` and `FlintSheetHeader`.
  - Xcode previews in light, dark and Accessibility 3 text. Source in `swift/Components/`, copied into each product by the build.
  - **Visible change for Bounder when it switches:** cards use `Radius.card` (12) instead of `Radius.lg` (16), and buttons use the button tokens (44pt tall on iOS, 8pt radius).
  - **CI:** Swift compiler errors now show as annotations on the PR.
  - **Docs:** the iOS page lists the components and shows a full app with the native tab bar.
- **Brand and platform layers (ASDS-86).** Flint gets two new layers on top of `tokens.json`, merged before references resolve:
  - **Brands:** `flint`, `accessspark`, `innersparkmedia` and `studio`, in `brands/`. A brand can override any token. Values came from each live site. Anything under Flint's bar moved to the nearest passing step, and each brand file records the original and why. Findings: the Inner Spark Media orange is 4.27:1 on white (the site's comment says 5.0:1), so it's used for the focus ring and accent, never text. The studio's body text misses 7:1 on subtle surfaces, so it moves one step darker.
  - **Platforms:** `web` and `ios`, in `platforms/`. The Swift package now builds from `ios`: `targetMin` and `control.md` are 44, and new `navTitleLarge`, `navTitle` and `tabLabel` type styles cover Apple chrome. Platforms can't touch color.
  - **Outputs:** `dist/` is unchanged for Flint. Other brands build into `dist/brands/<brand>/` (`tokens.css`, `tokens.media.css`, `tokens.json`, `index.js`, `shadcn.css`), exported as `@innerspark/flint/brands/<brand>/...`. The Swift package gains `FlintAccessSpark`, `FlintInnerSparkMedia` and `FlintStudio` products. `@innerspark/flint/brands.css` and `[data-platform="ios"]` exist for previews.
  - **Guards:** `npm run build` builds and checks every brand: contrast and color vision in light and dark. A brand path that isn't in `tokens.json`, or a platform that sets a color, fails the build.
  - **Checkbox and radio size** now point at `iconSize.lg` instead of `targetMin`. Same 24px on the web; on iOS the box stays 24pt while the target grows to 44.
  - **Docs:** a Brands and platforms page under Foundations, with every brand side by side in light and dark. The iOS phone preview reads the iOS platform tokens.
  - **CI:** a macOS job builds every Swift product for macOS and the iOS Simulator.
  - **Visible change for Swift apps:** `Flint.Target.minimum` goes from 24 to 44, and `Flint.Control.md`, `Component.buttonHeight`, `inputHeight` and `selectHeight` go from 40 to 44. `Flint.Target.touch` is unchanged at 44.
- **Web phone preview on the iOS page (ASDS-85).** "Try it" puts a Flint screen on an iPhone drawn in HTML from the same tokens, with 44pt touch targets. Settings beside it switch Light and Dark, step Dynamic Type from Extra small to Accessibility extra large (the screen reflows and scrolls, nothing clips), turn on Reduce Motion, and show a VoiceOver caption bar that reads the focused control the way iOS does ("Lights, switch button, off"). The SwiftUI for the same screen sits underneath, using only `Flint.*` tokens and standard controls. Labeled as a web preview: real SwiftUI can differ slightly.
- **Illustration page and empty states (ASDS-56).** New Foundations page, `/foundations/illustration/`: the rules (decorative only, no words in the art, tokens only, one warm accent, under 4 KB, calm motion), the color roles in light and dark read straight from `illustration.css`, every illustration shown in both modes with its size, and the empty-state pattern (art, heading, one line, one action). Three new empty-state illustrations: no results, error (no red) and success. The docs build fails if an illustration goes over 4 KB or contains text or an image. Illustration art moved to `docs/src/data/illustrations.js`, and the color roles now resolve per `data-theme` panel, so light and dark can sit side by side.

## v1.15.0 (2026-10-23)
- **Docs: concept diagram and spot illustrations (ASDS-56).** A "How one token travels" diagram follows `button.primary.bg` from primitive (light and dark steps) to semantic to component, then out to CSS, Flint React, MUI, shadcn/ui and SwiftUI. It sits on Get started and Token tiers, stacks vertically on phones, and works in both modes. Ten new decorative spot illustrations sit beside the lead on the Get started and Guides pages; they hide under 720px so text comes first.

- **`@innerspark/flint/react` (ASDS-69).** React components that render components.css, with no styles of their own: Button, Link, Field (wires id, label, `aria-describedby`, `aria-invalid` and `required` into its control), Input, Textarea, Select, Checkbox (indeterminate), Radio and RadioGroup, Switch, Badge, Chip (remove button named after the chip), Alert, SkipLink (moves focus, not just the scroll), Icon (decorative or named). Dialog, Tabs, Menu, Tooltip and Toast are Radix underneath: focus trap and return, APG keyboard patterns, a live region, and a toast with an action that never times out. One 12 KB ESM file plus hand-written types, built for React 19.2 and Node 22 to match AccessSpark. React, React DOM and the five Radix packages are optional peer dependencies, so token-only installs never pull them in, and the build tooling lives in `react/package.json` so installing Flint from GitHub stays dependency-free. `react/dist` is committed; a new CI job builds it, checks the committed copy is current, renders every component and type-checks the declarations against a sample app.
- **components.css:** `--floating` modifiers for Dialog, Menu and Tooltip when a library positions them, `.flint-dialog-overlay` for the scrim, inactive tab panels hidden by `data-state`, and the toast region resets list styles (Radix renders it as a list).
- **Docs:** a React page under Get started, a Flint React section on every component's Code tab, and a fourth Flint React column on every workbench bench, covered by axe in light, dark and compact. The MUI page's gap note now lists only what the theme can't change.
- **Dialog, Tabs, Menu, Tooltip and Toast (ASDS-80 to ASDS-84, from ASDS-70).** New component tokens (`dialog`, `tabs`, `menu`, `tooltip`, `toast`, all references) with 28 new contrast pairs. The guard caught the shared focus ring at 1.85:1 on the toast's inverse surface, so toasts get their own `toast.focusRing`. New classes in components.css:
  - `.flint-dialog` on the native `<dialog>`: the browser traps focus and closes on Esc; arrives with `--ease-entrance`.
  - `.flint-tabs__*`: the selected tab shows a 4px bar and an extra-bold label, never color alone; the focus ring sits inside the tab so a scrolling list can't clip it.
  - `.flint-menu` and `.flint-menu__item`: 40px items, a danger item, disabled items that stay reachable, separators.
  - `.flint-tooltip`: shows on hover and keyboard focus, stays while hovered, describes its control.
  - `.flint-toast-region` and `.flint-toast`: a polite live region, arriving with `--ease-emphasis`.
  Dialog title, body and toast text rules use two classes, so a host page's heading and paragraph margins can't leak in.
- **`@innerspark/flint/behaviors.js`.** Small, dependency-free keyboard and focus behavior for stacks without React, following the WAI-ARIA Authoring Practices: `initDialogs` (focus returns to the opener), `initTabs` (arrow keys, Home, End, roving focus), `initMenus` (focus in, arrows, Esc returns focus, Tab and outside clicks close), `initTooltips` (Esc hides without moving focus, WCAG 1.4.13), `showToast` (never takes focus; a toast with an action never times out; the timer pauses on hover and focus), and `initAll`. Typed.
- **Docs:** pages, Style tab states, thumbnails and workbench benches for all five, with Live rows that really open. `verify.mjs` now drives each by keyboard alone: dialog focus in, trapped, Esc, focus back; tab arrows; menu open, arrows (skipping disabled), Esc back to the button; tooltip on focus and Esc; toast without moving focus.
- **MUI theme:** tabs get the 4px bar, 40px height, heavier selected weight and an inset focus ring (MUI's tab scroller clipped the ring); menu items are 40px with the menu hover fill.
- **Workbench:** the docs site's global focus rule moved into the base cascade layer (as the link color did), so MUI and Tailwind set their own focus offsets as they would in an app. The shadcn `TabsContent` mounts every panel by default and hides inactive ones, so each tab's `aria-controls` points at a real panel.
- **Chart palette is safe for color vision deficiency (ASDS-77).** Measured in OKLab under simulated protanopia, deuteranopia and tritanopia, the old palette let amber and red merge in light (0.028) and blue and violet merge in dark (0.003). The new palette drops green, which also retires red against green: chart.1 blue (blue.800 / blue.500), chart.2 amber (amber.600 / amber.400), chart.3 violet (violet.700 / violet.400), chart.4 sky (sky.600 / sky.200), chart.5 red (red.700 / red.400). The closest pair is now 0.112 in light and 0.147 in dark, every color still clears 3:1 on both chart surfaces, and the new `scripts/check-cvd.mjs` fails the build if any pair drops under 0.1. Grayscale is reported, not enforced. **Visible change:** charts using `--color-chart-*` or shadcn's `--chart-*` change color.
- **MUI theme follows the component tokens (ASDS-44).** Buttons are 40px (32px small) and read the primary, secondary, danger, text and disabled tokens. Outlined inputs read the input edge, hover, focus, error (including `aria-invalid`), disabled and placeholder tokens, replacing MUI's 1.6:1 default edge. Checkbox and radio draw a 24px box, show the focus ring on keyboard focus and turn red on `aria-invalid`. The switch is Flint's 48x24 track with a 16px thumb that lands with `--ease-emphasis`, and its disabled, on thumb is gray. SvgIcon small, medium and large map to 16, 20 and 24px. **Visible change for MUI apps:** default icons drop from 24 to 20px, and buttons grow from about 36 to 40px.
- **Workbench fixes.** The MUI checkbox and radio benches passed `aria-invalid` and `aria-label` through `inputProps`, which MUI v7 ignores; they now use `slotProps.input`. The shadcn radio no longer keeps its blue fill when disabled and selected.
- **`--ease-emphasis` (ASDS-79).** A new easing token, `cubic-bezier(0.34, 1.4, 0.64, 1)`: one small overshoot of about 10%, then it settles. No bounce. For small things arriving: toasts, checks, counts, the switch thumb, which now lands with it (plain CSS and shadcn). Generated for CSS, DTCG and Swift (`Flint.Motion.Easing.emphasis`). `check-components` fails if it appears on a dialog, drawer, sheet, modal, menu, popover, overlay, scrim, page or layout, where overshoot is most likely to make people queasy. The Motion page draws the curve, demos a toast and a live switch, and gives do/don't guidance. Off under reduced motion.
- **Foundations specimens and component thumbnails (ASDS-78).** Typography opens with an Open Sans specimen (weights and character set), then every style at real size with its line boxes drawn behind it. Spacing and size shows the scale as blocks at real size, a card with its inset and gap hatched and labelled, each radius role as a shape, control heights against a ruler, the 24px target as a dashed hit area, and a list in comfortable and compact density side by side. Motion draws each easing curve from its token and plays dots across at each easing and duration (they jump under reduced motion, and the page says so). Elevation shows every shadow in light and dark, and the layer order as a stack. The Components overview is a grid of live thumbnails from components.css; each card is one link.
- **In-use previews beyond the Color page (ASDS-76).** Every component's Style tab opens with "States in light and dark": the real components.css component in each state (hover, pressed and focus forced), each mode on its own background, with the tokens that state reads. The Contrast page shows each pairing once, light beside dark, with the two colors together, grouped by kind instead of by mode. The Data visualization page shows the chart colors as reference rows and the five series simulated for protanopia, deuteranopia, tritanopia and grayscale. That simulation found chart.2 and chart.4 look alike under protanopia (ASDS-77).
- **Clearer copy targets.** The copy cursor (an arrow with a plus) is gone. Copy targets use the hand pointer, show a "Copy" tag on hover and keyboard focus, and say "Copied" after a click. The tag stays out of the accessible name; the live region still announces the copy.
- **Color page redesign (ASDS-75).** Every color is shown in use, each mode on its own background, so light and dark never touch as one two-tone swatch. The ten core roles get specimen cards; every semantic color gets a reference row with light and dark side by side, its values, and its contrast with the color it meets in use (text on its surface, a label on its fill, an edge on its background). The previews match the token's job: text, surface, button fill, field edge, focus ring, chart bars, the scrim over a card, a real disabled button. The ramps are paint strips, each band labelled in the ink that reads (white or `color.black`) and tagged AAA text, AA text or UI only; the build fails if no ink reaches 4.5:1. Names, hex values and bands copy their CSS variable or value. Previews read Flint variables under `data-theme`, with no hex in the markup.
- **Fixed: copy buttons never announced.** The script looked up the live region before it existed in the page, so code-block copy worked silently for screen reader users. `verify.mjs` now copies from a color chip and checks the clipboard and the announcement.
- **Skip link (ASDS-73), Icon (ASDS-74) and a small Button, completing the atom list from ASDS-1.** `.flint-skip-link` is hidden with `clip-path` until focused (screen readers still reach it), then shows on the primary fill with the focus ring; the docs page ships the script that moves focus to the main heading, and the docs site now uses the class instead of its own `.skip-link`. `.flint-icon` sizes an svg from `icon.sm`, `icon.md` and `icon.lg`, colors it with `icon.fg` or `--muted`, and the page covers decorative versus named icons. New `button.heightSm` (control.sm, 32px) and `.flint-btn--sm`, which combines with `--icon`; the shadcn Button gains `size="sm"`. Both new atoms have docs pages and workbench benches. Component pages can now name a token group that differs from their URL (`skip-link` reads `skipLink`), and the MUI "Known gap" notice only shows when there is one (the Link page showed an empty one). The MUI theme now holds `size="small"` buttons at `button.heightSm`: they drew 23.6px, under the 24px target minimum. The docs site's base link color moved into the `base` cascade layer, so the MUI and shadcn columns on the workbench can color their own links, as they would in an app.
- **Badge, Chip (ASDS-67) and Alert (ASDS-68).** `.flint-badge` (static status, five intents), `.flint-chip` (filled or `--outlined`, with an optional `.flint-chip__remove` button that is its own 24px target, named after its chip) and `.flint-alert` (icon plus title and body, one feedback family per alert, live-region guidance for alerts added after load). Docs pages and workbench benches for all three; the component page template now handles a component with no token tier of its own (Alert reads the semantic feedback families). The component CSS guard allows px on any side border width, not just `border`. That completes the first ten components from ASDS-22.
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
