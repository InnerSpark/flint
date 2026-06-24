# Flint Design System: Tokens

The single source of truth for color, type, spacing, and radius across AccessSpark and its sister brands. Tokens only (no components); framework-agnostic.

`tokens.json` is the source. The build emits CSS custom properties and typed JS exports into `dist/`.

## Install (private, git tag)

```bash
npm install github:InnerSpark/flint#v1.0.0
```

Point it at wherever you host the repo. You can graduate to GitHub Packages later without changing any imports.

## Use

### CSS variables

```js
import '@innerspark/flint/tokens.css';
```

```css
.card { background: var(--color-surface-default); color: var(--color-text-heading); padding: var(--space-16); border-radius: var(--radius-md); }
```

Dark mode: set `data-theme="dark"` on a parent; every `--color-*` flips. Optional metric-matched fallback (no layout shift): `import '@innerspark/flint/fonts.css';` and add `'Open Sans Fallback'` to your stack.

### JS / TS

```ts
import tokens, { color, semantic, space, radius, fontSize, shadow, typography } from '@innerspark/flint';
const heading = semantic.light.text.heading; // "#0d2b45"
const card = shadow.card;                     // "0 2px 8px rgba(0, 0, 0, 0.08)"
const h1 = typography.headingH1;              // { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
```

### Raw JSON (Figma Make, Style Dictionary, Tailwind, etc.)

```ts
import tokens from '@innerspark/flint/tokens.json';
```

## Figma Make

Point Figma Make at **`dist/tokens.css`** (the full `--color` / `--space` / `--radius` / `--font` set in light and dark) or at **`tokens.json`** for the structured values. Either gives Make the whole Flint scale to design against.

## Build

```bash
npm run build   # runs scripts/build.mjs, regenerates dist/ from tokens.json
```

`dist/` is committed so git-tag installs work without a build step; `prepare` also rebuilds on install.

## Versioning

Flint semver, independent of the consuming apps. See CHANGELOG.md for releases. Bump on token changes (major = breaking removal/rename, minor = additive, patch = value fix) and tag the release.

## Color usage

- Colored text, icons, and numbers use the readable tokens: `feedback.{success,warning,error,info}.text`, `text.link` for primary-colored text, `accent.aaaText` for purple. These pass AA on the surfaces they sit on, in both light and dark.
- The saturated `*.solid` tokens, plus `action.primary` and `accent.aaaSolid`, are fills only. Put white `*.onSolid` text on top. Never use a `*.solid` as a foreground color on a page or card: its value does not change between modes, so as text it fails on dark surfaces.
