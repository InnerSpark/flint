# Flint Design System

The single source of truth for color, type, spacing, radius, size, motion, and elevation across AccessSpark, Inner Spark Media, and sister brands. Framework-agnostic tokens, plus a MUI theme factory and a Swift package. No component library in code yet (see ASDS-22); components live in the Figma library.

`tokens.json` is the source. The build emits CSS custom properties, typed JS exports, a resolved `tokens.json`, W3C DTCG, and SwiftUI tokens into `dist/`.

## Token layers

1. **Primitives:** the raw ladders in `color.*` (`color.blue.700`), plus `space`, `radius`, `fontSize`, and the other scales. Never use a primitive color directly in UI.
2. **Semantic:** `semantic.light.*` and `semantic.dark.*`, named for intent (`text.link`, `action.primary`). Each color is a reference to a primitive, for example `"link": "{color.blue.700}"`. Change a ladder step and every semantic token that points at it follows.

The build resolves every reference. CSS, JS, MUI, and Swift consumers always get final values. The DTCG export keeps the references so Tokens Studio and Style Dictionary see the link back to the ladder.

### One token, four names

| Figma variable | CSS | JS | Swift |
|---|---|---|---|
| `text/link` | `--color-text-link` | `semantic.light.text.link` | `Flint.Colors.textLink` |
| `text/on-code` | `--color-text-on-code` | `semantic.light.text.onCode` | `Flint.Colors.textOnCode` |
| `feedback/success/text` | `--color-feedback-success-text` | `semantic.light.feedback.success.text` | `Flint.Colors.feedbackSuccessText` |

The rule: Figma uses `/` and kebab-case, CSS uses `-` and kebab-case with a `--color-` prefix, JS keeps the camelCase path, and Swift joins the path in camelCase.

## Install (private, git tag)

```bash
npm install "github:InnerSpark/flint#semver:^1.12.0"
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

### MUI

```ts
import { createFlintTheme } from '@innerspark/flint/mui';
const theme = createFlintTheme('light'); // or 'dark'
```

For a compact layout, use the object form: `createFlintTheme({ mode: 'light', density: 'compact' })`. Density tightens `inset` and `gap` by one step on the space ramp and leaves control, icon and target sizes alone, so it never shrinks a touch target. Non-MUI surfaces get the same thing by setting `data-density="compact"` on a parent, which flips the `--inset-*` and `--gap-*` vars.

`createFlintTheme(mode, overrides?)` maps the Flint palette, type scale, `spacing`, `breakpoints`, `shape.borderRadius`, dark-aware elevation, and a canonical component set (Paper, Card, Table, Menu/Popover/Dialog, Chip, Accordion, inputs, Select, Switch, Checkbox/Radio, Alert, ToggleButton, Tooltip, Snackbar, Avatar, Link, Backdrop, LinearProgress) onto a MUI theme; `flintThemeOptions(mode)` returns the raw options if you build the theme yourself. `@mui/material` is an optional peer dependency, only pulled in if you import this entry.

### Swift / SwiftUI (iOS 16+, macOS 13+)

Add the package in Xcode (File > Add Package Dependencies) with `https://github.com/InnerSpark/flint`, pinned to a version tag. The repo is private, so add your GitHub account under Xcode > Settings > Accounts first.

```swift
import Flint

Text("Awning")
  .flintText(Flint.Typography.headingH2)
  .foregroundStyle(Flint.Colors.textHeading)
  .padding(Flint.Space.s16)
  .frame(minHeight: Flint.Target.touch)
  .background(Flint.Colors.surfaceDefault, in: RoundedRectangle(cornerRadius: Flint.Radius.md))
```

- **Colors:** `Flint.Colors.*` are the semantic tokens, flat camelCase (`--color-feedback-success-text` is `feedback.success.text` is `Flint.Colors.feedbackSuccessText`). Each follows the system light/dark appearance. `Flint.Palette.*` holds the raw ramps (`blue500`) and does not change between modes.
- **Layout:** `Flint.Space.s0` to `s64`, `Flint.Radius`, `Flint.Control`, `Flint.IconSize`. `Flint.Target.minimum` is `targetMin` (24); use `Flint.Target.touch` (44, Apple HIG) for touch UI.
- **Type:** `.flintText(Flint.Typography.bodyMd)` sets font, line height, and tracking, all scaled with Dynamic Type. Bundle the Open Sans static TTFs (Regular, Medium, SemiBold, Bold, ExtraBold) in the app and list them under `UIAppFonts`; the styles use PostScript names like `OpenSans-Bold`.
- **Motion:** `withAnimation(Flint.Motion.animation(.standard, duration: Flint.Motion.Duration.base, reduceMotion: reduceMotion)) { ... }`, with `reduceMotion` from `@Environment(\.accessibilityReduceMotion)`. Returns nil (no animation) when Reduce Motion is on.
- **Not in the Swift output yet:** shadows, z-index, breakpoints.

## Figma Make

Point Figma Make at **`dist/tokens.css`** (the full `--color` / `--space` / `--radius` / `--font` set in light and dark) or at **`dist/tokens.json`** for the structured, resolved values. Either gives Make the whole Flint scale to design against. For a standards-based ingest (Tokens Studio, Style Dictionary), use `@innerspark/flint/tokens.dtcg.json` (W3C DTCG `$type` / `$value`, semantic split into `light` and `dark`).

## Build

```bash
npm run build   # regenerates dist/ (including dist/swift/Flint.swift) from tokens.json, then runs the contrast check
```

`dist/` is committed so git-tag installs work without a build step; `prepare` also rebuilds on install.

## Versioning

Flint semver, independent of the consuming apps. See CHANGELOG.md for releases. Bump on token changes (major = breaking removal/rename, minor = additive, patch = value fix) and tag the release.

## Color usage

- Colored text, icons, and numbers use the readable tokens: `feedback.{success,warning,error,info}.text`, `text.link` for primary-colored text, `accent.aaaText` for purple. These pass AA on the surfaces they sit on, in both light and dark.
- The saturated `*.solid` tokens, plus `action.primary` and `accent.aaaSolid`, are fills only. Put white `*.onSolid` text on top. Never use a `*.solid` as a foreground color on a page or card: its value does not change between modes, so as text it fails on dark surfaces.
