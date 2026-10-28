# Flint Design System

**Source-available, not open source.** The repository is public so our own apps, CI and Xcode can install it without managing access, and so the design decisions are open to read. It is not licensed for reuse: you may read it, you may not build with it. See [LICENSE](LICENSE). To ask about a license, mike@innersparkmedia.com.

**Docs:** [flint.innersparkmedia.com](https://flint.innersparkmedia.com) (built from `docs/`). Each component has one page (`/components/<name>/`) with a Web / iOS switch where there is a SwiftUI twin, and a live side-by-side of MUI, shadcn/ui, plain CSS and Flint React under Code.

The single source of truth for color, type, spacing, radius, size, motion, and elevation across AccessSpark, Inner Spark Media, and sister brands. Framework-agnostic tokens, plus a MUI theme factory, a shadcn/ui bridge and a Swift package. Components ship as plain CSS classes in `@innerspark/flint/components.css` (ASDS-57), with a React layer on Radix to follow. Each component page shows it as MUI, shadcn and plain CSS side by side.

`tokens.json` is the source. The build emits CSS custom properties, typed JS exports, a resolved `tokens.json`, W3C DTCG, and SwiftUI tokens into `dist/`.

## Token layers

1. **Primitives:** the raw ladders in `color.*` (`color.blue.700`), plus `space`, `radius`, `fontSize`, and the other scales. Never use a primitive color directly in UI.
2. **Semantic:** `semantic.light.*` and `semantic.dark.*`, named for intent (`text.link`, `action.primary`). Each color is a reference to a primitive, for example `"link": "{color.blue.700}"`. Change a ladder step and every semantic token that points at it follows.
3. **Component:** `component.*`, the decisions a component makes (`button.primary.bg`, `input.border`, `focus.ring.width`). Each points at a semantic token without naming a mode (`"bg": "{semantic.action.primary}"`), so it follows light and dark. CSS: `--button-primary-bg`. JS: `component.light.button.primary.bg`. Swift: `Flint.Component.buttonPrimaryBg`.

The build resolves every reference. CSS, JS, MUI, and Swift consumers always get final values. The DTCG export keeps the references so Tokens Studio and Style Dictionary see the link back to the ladder.

## Brands and platforms

Two more layers sit on top of `tokens.json` and merge in before references resolve (ASDS-86):

- **Brand:** `brands/<brand>.json` can override any token. Brands: `flint` (the base, empty), `accessspark` (same as Flint today), `innersparkmedia` (orange accent and focus ring, 8px cards, lighter shadows) and `studio` (softer body text). Values came from each live site; anything under Flint's 7:1 text or 3:1 UI bar uses the nearest passing step, and the file's `$source` records the original and why.
- **Platform:** `platforms/ios.json` overrides sizes, targets and type for the Swift package: `targetMin` and `control.md` are 44, plus `navTitleLarge`, `navTitle` and `tabLabel` type styles. Platforms can't touch color.

Every brand gets the contrast and color-vision checks in light and dark. A brand path that isn't in `tokens.json`, or a platform that sets a color, fails the build.

| Brand | CSS | JS | Swift product |
|---|---|---|---|
| flint | `@innerspark/flint/tokens.css` | `@innerspark/flint` | `Flint` |
| accessspark | `@innerspark/flint/brands/accessspark/tokens.css` | `@innerspark/flint/brands/accessspark` | `FlintAccessSpark` |
| innersparkmedia | `@innerspark/flint/brands/innersparkmedia/tokens.css` | `@innerspark/flint/brands/innersparkmedia` | `FlintInnerSparkMedia` |
| studio | `@innerspark/flint/brands/studio/tokens.css` | `@innerspark/flint/brands/studio` | `FlintStudio` |

Each brand folder also has `tokens.media.css`, `tokens.json` and `shadcn.css`. `components.css` is shared. `@innerspark/flint/brands.css` puts every brand under `[data-brand="<brand>"]` for side-by-side previews, and `tokens.css` has a `[data-platform="ios"]` block for iOS-size previews; apps don't need either. Not per brand yet: the MUI theme (only AccessSpark uses it, and it matches Flint).

### One token, four names

| Figma variable | CSS | JS | Swift |
|---|---|---|---|
| `text/link` | `--color-text-link` | `semantic.light.text.link` | `Flint.Colors.textLink` |
| `text/on-code` | `--color-text-on-code` | `semantic.light.text.onCode` | `Flint.Colors.textOnCode` |
| `feedback/success/text` | `--color-feedback-success-text` | `semantic.light.feedback.success.text` | `Flint.Colors.feedbackSuccessText` |

The rule: Figma uses `/` and kebab-case, CSS uses `-` and kebab-case with a `--color-` prefix, JS keeps the camelCase path, and Swift joins the path in camelCase.

## Install (git tag)

```bash
npm install "github:InnerSpark/flint#semver:^1.13.0"
```

The `semver:` range picks up new minor and patch releases on `npm update` and never jumps a major. You can graduate to GitHub Packages later without changing any imports.

## Use

### CSS variables

```js
import '@innerspark/flint/tokens.css';
```

```css
.card { background: var(--color-surface-default); color: var(--color-text-heading); padding: var(--space-16); border-radius: var(--radius-md); }
```

Dark mode: set `data-theme="dark"` on a parent; every `--color-*` flips. For automatic dark with no toggle, import `@innerspark/flint/tokens.media.css` instead, which flips via `prefers-color-scheme`. Optional metric-matched fallback (no layout shift): `import '@innerspark/flint/fonts.css';` and add `'Open Sans Fallback'` to your stack.

Motion and layering ship as tokens too: `var(--duration-base)` / `var(--ease-standard)` for transitions, `var(--z-modal)` etc. for stacking (also on the `motion` and `zIndex` JS exports). Respect `prefers-reduced-motion`: gate non-essential transitions on it.

### Components (plain CSS)

```js
import '@innerspark/flint/tokens.css';
import '@innerspark/flint/components.css';
```

```html
<button class="flint-btn flint-btn--primary">Save changes</button>
<label class="flint-choice"><input type="checkbox" class="flint-check" /> Email me updates</label>
```

Classes are `.flint-<component>` with `--<variant>` modifiers (`flint-btn--secondary`, `--danger`, `--text`). States come from native attributes (`:disabled`, `:checked`, `aria-invalid="true"`), never extra classes. Every value is a component token, so dark mode and density follow. Source: `css/components.css`.

Twenty components: Alert, Badge, Button, Checkbox, Chip, Dialog, Field, Icon, Input, Link, Menu, Radio, Select, Skip link, Switch, Tabs, Toast, Tooltip, plus the fieldset and choice helpers. Dialog uses the native `<dialog>`. Tabs, Menu, Tooltip and Toast need a little keyboard and focus behavior; on a stack without React, load it from `behaviors.js` (no dependencies, WAI-ARIA Authoring Practices patterns):

```js
import { initAll, showToast } from '@innerspark/flint/behaviors.js';
initAll(); // dialogs return focus, tabs and menus get arrow keys and Esc, tooltips close on Esc
showToast('#toasts', { title: 'Report saved' }); // into a role="status" region already in the page
```

### React

```jsx
import { Button, Field, Input, Dialog, DialogTrigger, DialogContent } from '@innerspark/flint/react';

<Field label="Campsite name" error={error} required><Input /></Field>
<Button busy={saving}>Save trip</Button>
```

`@innerspark/flint/react` renders the same classes, with Radix underneath Dialog, Tabs, Menu, Tooltip and Toast. React 19.2+, React DOM and the five `@radix-ui/react-*` packages are optional peer dependencies, so token-only installs never pull them in. `react/dist` is committed like `dist/`; its tooling lives in `react/package.json` (`npm run test:react` builds, renders every component and type-checks the declarations).

### JS / TS

```ts
import tokens, { color, semantic, space, radius, fontSize, shadow, typography } from '@innerspark/flint';
const heading = semantic.light.text.heading; // "#0d2b45"
const card = shadow.card;                     // "0 2px 8px rgba(0, 0, 0, 0.08)"
const h1 = typography.headingH1;              // { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
```

### Raw JSON (Figma Make, Style Dictionary, Tailwind, etc.)

```ts
import tokens from '@innerspark/flint/tokens.json';        // resolved values (dist/tokens.json)
import source from '@innerspark/flint/tokens.source.json'; // source, semantic colors as {references}
```

Read the package export, not the file at the repo root. The root `tokens.json` is the source and holds references, not hex values.

### shadcn/ui (Tailwind v4)

```css
@import "tailwindcss";
@import "@innerspark/flint/tokens.css";
@import "@innerspark/flint/shadcn.css";
```

Every shadcn variable becomes a `var()` into Flint; `dark:` follows `data-theme="dark"`. Restyle components onto the component tokens (see Code on the Button, Input and Checkbox pages).

### MUI

```ts
import { createFlintTheme } from '@innerspark/flint/mui';
const theme = createFlintTheme('light'); // or 'dark'
```

For a compact layout, use the object form: `createFlintTheme({ mode: 'light', density: 'compact' })`. Density tightens `inset` and `gap` by one step on the space ramp and leaves control, icon and target sizes alone, so it never shrinks a touch target. Non-MUI surfaces get the same thing by setting `data-density="compact"` on a parent, which flips the `--inset-*` and `--gap-*` vars.

`createFlintTheme(mode, overrides?)` maps the Flint palette, type scale, `spacing`, `breakpoints`, `shape.borderRadius`, dark-aware elevation, and a canonical component set (Paper, Card, Table, Menu/Popover/Dialog, Chip, Accordion, inputs, Select, Switch, Checkbox/Radio, Alert, ToggleButton, Tooltip, Snackbar, Avatar, Link, Backdrop, LinearProgress) onto a MUI theme; `flintThemeOptions(mode)` returns the raw options if you build the theme yourself. `@mui/material` is an optional peer dependency, only pulled in if you import this entry.

### Swift / SwiftUI (iOS 16+, macOS 13+)

Add the package in Xcode (File > Add Package Dependencies) with `https://github.com/InnerSpark/flint`, pinned to a version tag. Add one product, the one for your brand (`Flint`, `FlintAccessSpark`, `FlintInnerSparkMedia` or `FlintStudio`); each exposes the same `Flint` API. The Swift output uses the iOS platform values.

```swift
import Flint

Text("Awning")
  .flintText(Flint.Typography.headingH2)
  .foregroundStyle(Flint.Colors.textHeading)
  .padding(Flint.Space.s16)
  .frame(minHeight: Flint.Target.touch)
  .background(Flint.Colors.surfaceDefault, in: RoundedRectangle(cornerRadius: Flint.Radius.md))
```

- **UIKit / AppKit colors:** `Flint.UIColors.*` (iOS) and `Flint.NSColors.*` (macOS) are the same semantic tokens as dynamic platform colors. Use them for `UINavigationBarAppearance` and other UIKit APIs; `UIColor(Flint.Colors.x)` locks to light mode.
- **Colors:** `Flint.Colors.*` are the semantic tokens, flat camelCase (`--color-feedback-success-text` is `feedback.success.text` is `Flint.Colors.feedbackSuccessText`). Each follows the system light/dark appearance. `Flint.Palette.*` holds the raw ramps (`blue500`) and does not change between modes.
- **Layout:** `Flint.Space.s0` to `s64`, `Flint.Radius`, `Flint.Control`, `Flint.IconSize`. `Flint.Target.minimum` is the iOS `targetMin`, 44 (Apple HIG); `Flint.Target.touch` is the same value, kept for older code. `Flint.Control.md` and the button, input and select heights are 44 too.
- **Type:** `.flintText(Flint.Typography.bodyMd)` sets font, line height, and tracking, all scaled with Dynamic Type. Apple chrome styles: `navTitleLarge` (34), `navTitle` (17), `tabLabel` (12). Bundle the Open Sans static TTFs (Regular, Medium, SemiBold, Bold, ExtraBold) in the app and list them under `UIAppFonts`; the styles use PostScript names like `OpenSans-Bold`.
- **Motion:** `withAnimation(Flint.Motion.animation(.standard, duration: Flint.Motion.Duration.base, reduceMotion: reduceMotion)) { ... }`, with `reduceMotion` from `@Environment(\.accessibilityReduceMotion)`. Returns nil (no animation) when Reduce Motion is on.
- **Not in the Swift output yet:** shadows, z-index, breakpoints.

**Components (ASDS-38).** Every brand product includes the same SwiftUI components, drawn from that brand's tokens. The source is `swift/Components/`; the build copies it into each product, so edit the source, not `dist/`.

- Buttons and content: `.buttonStyle(.flint(.primary))` (primary, secondary, danger, text), `.flintCard()`, `FlintNotice`, `FlintTag`, `FlintSectionTitle`, `FlintEmptyState`, `FlintStatTile`.
- Controls: `FlintToggleRow`, `FlintChoicePicker` (segmented, rows at large text), `FlintStepper` (one adjustable VoiceOver element).
- Screens and lists: `FlintScreen`, `.flintList()`, `FlintRow`, `FlintRowButton`, `FlintListHeader`.
- Sheets: `.flintSheet()` and `FlintSheetHeader` (heading plus a Close button).
- Native bars: call `FlintChrome.apply()` once at launch (iOS). It styles the real navigation bar, tab bar, toolbar and alert tint, so they keep Apple's accessibility behavior.
- Liquid Glass (iOS 26 and later): `FlintChrome.apply()` sets only fonts and the selected-tab tint, and `.flintSheet()` leaves the sheet background to the system, so bars and sheets stay glass and follow Reduce Transparency, Increase Contrast and the Clear and Tinted setting (iOS 26.1 and later). iOS 16 to 25 get solid Flint bars. Glass can't guarantee contrast, so Flint keeps it to the navigation layer; `scripts/measure-glass.mjs` (run by the build) writes the worst-case label contrast on glass to `dist/glass.json`, and the iOS docs page shows it. `.flintGlassButton(prominent:)` gives floating controls Apple's glass button styles on 26+ and Flint buttons before. CI builds with Xcode 26.

CI builds every product for macOS and the iOS Simulator on each push.

## Figma library

The [Flint Design System library](https://www.figma.com/design/SPVtGNr2eMf2LrwV4F3VVo/Flint-Design-System) mirrors this repo. Its variables have five collections: Primitives, Semantic (Light, Dark), Sizing (Comfortable, Compact), Brand (one mode per brand) and Platform (Web, iOS), matching `tokens.json`, `brands/` and `platforms/`. It has the web components, an iOS components page with Solid and Liquid Glass styles, and the illustrations. Rules for designing with it are in [`FIGMA_LIBRARY_GUIDELINES.md`](FIGMA_LIBRARY_GUIDELINES.md). If the library and the repo disagree, the repo wins.

## Figma Make

Point Figma Make at **`dist/tokens.css`** (the full `--color` / `--space` / `--radius` / `--font` set in light and dark) or at **`dist/tokens.json`** for the structured, resolved values. Either gives Make the whole Flint scale to design against. For a standards-based ingest (Tokens Studio, Style Dictionary), use `@innerspark/flint/tokens.dtcg.json` (W3C DTCG `$type` / `$value`, semantic split into `light` and `dark`).

## Build

```bash
npm run build       # builds every brand (dist/ and dist/brands/), then runs the contrast and chart color checks per brand, plus parity and component CSS
npm run check       # the same checks against the committed dist/, without rebuilding
npm run test:react  # builds react/dist, renders every React component, type-checks react/index.d.ts (needs npm ci --prefix react)
```

`dist/` is committed so git-tag installs work without a build step; `prepare` also rebuilds on install.

## Versioning

Flint semver, independent of the consuming apps. See CHANGELOG.md for releases. Bump on token changes (major = breaking removal/rename, minor = additive, patch = value fix) and tag the release.

## Color usage

- Colored text, icons, and numbers use the readable tokens: `feedback.{success,warning,error,info}.text`, `text.link` for primary-colored text, `accent.aaaText` for purple. These pass AA on the surfaces they sit on, in both light and dark.
- The saturated `*.solid` tokens, plus `action.primary` and `accent.aaaSolid`, are fills only. Put white `*.onSolid` text on top. Never use a `*.solid` as a foreground color on a page or card: its value does not change between modes, so as text it fails on dark surfaces.

## License

Source-available, not open source. You can read this repo; you can't use, copy, or adapt it without written permission from Inner Spark Media, LLC. Third-party parts (shadcn/ui code, Open Sans) keep their own licenses. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
