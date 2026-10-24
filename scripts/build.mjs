/**
 * Flint token build. Reads tokens.json (single source of truth) and emits:
 *   dist/tokens.json  tokens.json with every {reference} resolved to its value
 *   dist/tokens.css   CSS custom properties (:root + [data-theme="dark"])
 *   dist/fonts.css    metric-matched Open Sans fallback @font-face
 *   dist/index.js     ESM named + default exports of the resolved tokens
 *   dist/index.d.ts   types
 *   dist/swift/Flint.swift  SwiftUI tokens (SwiftPM via Package.swift)
 *   dist/shadcn.css   shadcn/ui + Tailwind v4 bridge onto the Flint CSS variables (ASDS-40)
 *   dist/components.css  plain CSS component classes, copied from css/components.css (ASDS-58)
 * No runtime dependencies; Node only.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveTokens, refOf } from './resolve.mjs';
import { loadSource, currentBrand, distFor, DEFAULT_BRAND } from './layers.mjs';
import { SHADCN_MAP, SHADCN_THEME_COLORS } from './shadcn-map.mjs';
import { kebab, camel, cssVarForPath, componentVar } from './names.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// source keeps semantic tokens as {color.*} references (DTCG output preserves them);
// tokens is the resolved copy every other output is built from.
// Brand and platform layers (ASDS-86): FLINT_BRAND picks the brand. Web outputs read the web
// platform; the Swift package reads the ios platform (44pt targets and controls, Apple chrome type).
const BRAND = currentBrand();
const source = loadSource({ brand: BRAND });
const tokens = resolveTokens(source);
const appleSource = loadSource({ brand: BRAND, platform: 'ios' });
const apple = resolveTokens(appleSource);
const dist = distFor(BRAND);
const swiftDir = BRAND === DEFAULT_BRAND ? join(dist, 'swift') : join(root, 'dist', 'swift-brands', BRAND);
mkdirSync(dist, { recursive: true });
mkdirSync(swiftDir, { recursive: true });


function semanticVars(mode, t = tokens) {
  const s = t.semantic[mode];
  const out = [];
  for (const [group, val] of Object.entries(s)) {
    if (typeof val === 'string') {
      out.push([`--color-${kebab(group)}`, val]);
    } else {
      for (const [k, v] of Object.entries(val)) {
        if (typeof v === 'string') out.push([`--color-${kebab(group)}-${kebab(k)}`, v]);
        else for (const [k2, v2] of Object.entries(v)) out.push([`--color-${kebab(group)}-${kebab(k)}-${kebab(k2)}`, v2]);
      }
    }
  }
  return out;
}

const shadowDarkVars = () => Object.entries(tokens.shadowDark || {}).map(([k, v]) => [`--shadow-${k}`, v]);

// Density varies spacing only: inset and gap each drop one step down the space ramp in
// compact. Control sizes, icon sizes, radius and targetMin are identical in both, so a
// compact layout never shrinks the touch target (WCAG 2.5.8).
const densityVars = (d, t = tokens) => {
  const g = (t.density || {})[d] || {};
  return [
    ...Object.entries(g.inset || {}).map(([k, v]) => [`--inset-${k}`, `${v}px`]),
    ...Object.entries(g.gap || {}).map(([k, v]) => [`--gap-${k}`, `${v}px`]),
  ];
};

function staticVars(tokens) {
  const out = [];
  for (const [ramp, steps] of Object.entries(tokens.color)) {
    if (typeof steps === 'string') out.push([`--color-${ramp}`, steps]);
    else for (const [step, hex] of Object.entries(steps)) out.push([`--color-${ramp}-${step}`, hex]);
  }
  for (const [k, v] of Object.entries(tokens.space)) out.push([`--space-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.radius)) out.push([`--radius-${kebab(k)}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.control)) out.push([`--control-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.iconSize)) out.push([`--icon-size-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.fontSize)) out.push([`--font-size-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.fontWeight)) out.push([`--font-weight-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.lineHeight)) out.push([`--line-height-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.shadow || {})) out.push([`--shadow-${k}`, v]);
  if (tokens.motion) {
    for (const [k, v] of Object.entries(tokens.motion.duration || {})) out.push([`--duration-${k}`, v]);
    for (const [k, v] of Object.entries(tokens.motion.easing || {})) out.push([`--ease-${k}`, v]);
  }
  for (const [k, v] of Object.entries(tokens.zIndex || {})) out.push([`--z-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.breakpoint || {})) out.push([`--breakpoint-${k}`, `${v}px`]);
  out.push(['--target-min', `${tokens.targetMin}px`]);
  // Type styles as variables (size, weight, line height, tracking), so plain CSS can use them too.
  for (const [name, t] of Object.entries(tokens.typography || {})) {
    const k = kebab(name);
    out.push([`--type-${k}-size`, `${t.fontSize}px`], [`--type-${k}-weight`, `${t.fontWeight}`], [`--type-${k}-line-height`, `${t.lineHeight}`], [`--type-${k}-tracking`, t.letterSpacing]);
  }
  out.push(...densityVars('comfortable', tokens));
  out.push(['--font-sans', tokens.fontFamily.sans]);
  out.push(['--font-prose', tokens.fontFamily.prose]);
  out.push(['--font-mono', tokens.fontFamily.mono]);
  return out;
}

// Component tier (ASDS-39): one var per component token, written as a var() reference to
// the token it points at. Mode-free, so dark mode needs no extra block.
// iOS platform preview (ASDS-86): only the variables whose iOS value differs from the web, so the
// docs can show a Flint screen at iOS sizes. Apps on the web never set data-platform.
function platformVars() {
  const web = new Map(staticVars(tokens));
  return staticVars(apple).filter(([n, v]) => web.get(n) !== v);
}

function componentVars() {
  const out = [];
  const walk = (node, path) => {
    for (const [k, v] of Object.entries(node)) {
      const p = [...path, k];
      if (v && typeof v === 'object') { walk(v, p); continue; }
      const name = componentVar(p);
      const ref = refOf(v);
      out.push([name, ref ? `var(${cssVarForPath(ref)})` : typeof v === 'number' ? `${v}px` : v]);
    }
  };
  walk(source.component || {}, []);
  return out;
}

const fmt = (pairs) => pairs.map(([n, v]) => `  ${n}: ${v};`).join('\n');

writeFileSync(join(dist, 'tokens.css'), `/* GENERATED from tokens.json. Flint Design System. Do not edit by hand. */
:root {
${fmt(staticVars(tokens))}

  /* semantic (light) */
${fmt(semanticVars('light'))}
}

[data-theme="dark"] {
  /* semantic (dark) */
${fmt(semanticVars('dark'))}

  /* elevation (dark) */
${fmt(shadowDarkVars())}
}

[data-theme="light"] {
  /* semantic (light) again, so a light section can sit inside a dark page */
${fmt(semanticVars('light'))}

  /* elevation (light) */
${fmt(Object.entries(tokens.shadow || {}).map(([k, v]) => [`--shadow-${k}`, v]))}
}

[data-density="compact"] {
  /* density (compact): inset/gap only, control + target sizes are unchanged */
${fmt(densityVars('compact'))}
}

/* component tier: re-declared wherever a theme is set, so a nested data-theme="dark" section
   resolves these against its own colors instead of inheriting the page's */
[data-platform="ios"] {
  /* platform (ios): 44pt targets and controls, Apple chrome type */
${fmt(platformVars())}
}

:root, [data-theme], [data-platform] {
${fmt(componentVars())}
}
`);

writeFileSync(join(dist, 'tokens.media.css'), `/* GENERATED from tokens.json. Auto dark via prefers-color-scheme. Do not edit by hand. */
:root {
${fmt(staticVars(tokens))}

  /* semantic (light) */
${fmt(semanticVars('light'))}
}

@media (prefers-color-scheme: dark) {
  :root {
    /* semantic (dark) */
${fmt(semanticVars('dark'))}

    /* elevation (dark) */
${fmt(shadowDarkVars())}
  }
}

[data-density="compact"] {
  /* density (compact): inset/gap only, control + target sizes are unchanged */
${fmt(densityVars('compact'))}
}

/* component tier: re-declared wherever a theme is set, so a nested data-theme="dark" section
   resolves these against its own colors instead of inheriting the page's */
[data-platform="ios"] {
  /* platform (ios): 44pt targets and controls, Apple chrome type */
${fmt(platformVars())}
}

:root, [data-theme], [data-platform] {
${fmt(componentVars())}
}
`);

writeFileSync(join(dist, 'fonts.css'), `/* Flint: metric-matched Open Sans fallback (no layout shift). Add 'Open Sans Fallback' to the font stack. */
@font-face {
  font-family: 'Open Sans Fallback';
  src: local('Arial');
  size-adjust: 105.15%;
  ascent-override: 101.65%;
  descent-override: 27.86%;
  line-gap-override: 0%;
}
`);

writeFileSync(join(dist, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');

// shadcn/ui + Tailwind v4 bridge (ASDS-40). Import it from your Tailwind entry CSS after
// tokens.css. Names only: every value is a var() into Flint, so dark mode and values stay Flint's.
writeFileSync(join(dist, 'shadcn.css'), `/* GENERATED from tokens.json. Flint -> shadcn/ui bridge. Do not edit by hand.
   Use from your Tailwind v4 entry CSS:
     @import "tailwindcss";
     @import "@innerspark/flint/tokens.css";
     @import "@innerspark/flint/shadcn.css";
   Dark mode is Flint's: set data-theme="dark" on <html>. No .dark block is needed. */

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root, [data-theme] {
${fmt(Object.entries(SHADCN_MAP).map(([name, path]) => [name, `var(${cssVarForPath(path)})`]))}
}

@theme inline {
${SHADCN_THEME_COLORS.map((n) => `  --color-${n}: var(--${n});`).join('\n')}
}
`);

const keys = Object.keys(tokens);
writeFileSync(join(dist, 'index.js'), `// GENERATED from tokens.json. Flint Design System.
const tokens = ${JSON.stringify(tokens, null, 2)};
${keys.map((k) => `export const ${k} = tokens[${JSON.stringify(k)}];`).join('\n')}
export default tokens;
`);

writeFileSync(join(dist, 'index.d.ts'), `// GENERATED. Flint Design System token types.
export type Hex = string;
export type Ramp = Record<string, Hex>;
export interface SemanticScheme {
  surface: Record<string, Hex>;
  text: Record<string, Hex>;
  action: Record<string, Hex>;
  border: Record<string, Hex>;
  feedback: Record<'success' | 'warning' | 'error' | 'info', Record<string, Hex>>;
  accent: Record<string, Hex>;
  selected: Record<string, Hex>;
  chart: Record<'1' | '2' | '3' | '4' | '5', Hex>;
  overlayScrim: Hex;
}
export interface ComponentScheme {
  button: {
    radius: number; height: number;
    primary: { bg: Hex; bgHover: Hex; fg: Hex };
    secondary: { bg: Hex; bgHover: Hex; fg: Hex; border: Hex };
    danger: { bg: Hex; bgHover: Hex; fg: Hex };
    text: { bgHover: Hex; fg: Hex };
    disabled: { bg: Hex; fg: Hex; border: Hex };
  };
  input: { radius: number; height: number; bg: Hex; fg: Hex; placeholder: Hex; border: Hex; borderHover: Hex; borderFocus: Hex; borderError: Hex };
  checkbox: { size: number; radius: number; border: Hex; checkedBg: Hex; checkedFg: Hex };
  focus: { ring: { color: Hex; width: number; offset: number } };
}
export interface Tokens {
  color: Record<string, Ramp | Hex>;
  space: Record<string, number>;
  radius: Record<string, number>;
  fontFamily: Record<'sans' | 'prose' | 'mono', string>;
  fontWeight: Record<string, number>;
  fontSize: Record<string, number>;
  lineHeight: Record<string, number>;
  shadow: Record<string, string>;
  shadowDark: Record<string, string>;
  typography: Record<string, { fontFamily: string; fontSize: number; fontWeight: number; lineHeight: number; letterSpacing: string }>;
  motion: { duration: Record<string, string>; easing: Record<string, string> };
  zIndex: Record<string, number>;
  breakpoint: Record<string, number>;
  density: Record<'comfortable' | 'compact', { inset: Record<string, number>; gap: Record<string, number> }>;
  control: Record<string, number>;
  iconSize: Record<string, number>;
  targetMin: number;
  semantic: { light: SemanticScheme; dark: SemanticScheme };
  component: { light: ComponentScheme; dark: ComponentScheme };
}
declare const tokens: Tokens;
export const color: Tokens['color'];
export const space: Tokens['space'];
export const radius: Tokens['radius'];
export const fontFamily: Tokens['fontFamily'];
export const fontWeight: Tokens['fontWeight'];
export const fontSize: Tokens['fontSize'];
export const lineHeight: Tokens['lineHeight'];
export const shadow: Tokens['shadow'];
export const shadowDark: Tokens['shadowDark'];
export const typography: Tokens['typography'];
export const motion: Tokens['motion'];
export const zIndex: Tokens['zIndex'];
export const breakpoint: Tokens['breakpoint'];
export const density: Tokens['density'];
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
export const component: Tokens['component'];
export default tokens;
`);

// W3C DTCG export (tool-agnostic: Tokens Studio, Style Dictionary, Figma Make).
const px = (v) => (/^-?\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v));
const colorGroup = (obj) => {
  const g = {};
  for (const [k, v] of Object.entries(obj)) g[k] = typeof v === 'string' ? { $type: 'color', $value: v } : colorGroup(v);
  return g;
};
const dimGroup = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { $type: 'dimension', $value: px(v) }]));
const numGroup = (obj, $type = 'number') => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { $type, $value: v }]));
const parseShadow = (s) => {
  const cm = s.match(/(rgba?\([^)]*\)|#[0-9a-fA-F]+)\s*$/);
  const color = cm ? cm[1] : '#000000';
  const nums = s.slice(0, cm ? cm.index : s.length).trim().split(/\s+/);
  return { color, offsetX: px(nums[0] || 0), offsetY: px(nums[1] || 0), blur: px(nums[2] || 0), spread: px(nums[3] || 0) };
};
const splitLayers = (s) => { const out = []; let depth = 0, cur = ''; for (const ch of s) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
const shadowVal = (s) => { const layers = splitLayers(s).map(parseShadow); return layers.length === 1 ? layers[0] : layers; };
const bezier = (s) => { const m = s.match(/cubic-bezier\(([^)]+)\)/); return m ? m[1].split(',').map((n) => parseFloat(n)) : [0, 0, 1, 1]; };
// Component tier in DTCG: per mode, colors stay aliases into that mode's semantic group,
// sizes become dimensions. resolveTokens() has already proven every reference exists.
function dtcgComponent(node, mode) {
  return Object.fromEntries(Object.entries(node).map(([k, v]) => {
    if (v && typeof v === 'object') return [k, dtcgComponent(v, mode)];
    const ref = refOf(v);
    if (ref && ref.startsWith('semantic.')) return [k, { $type: 'color', $value: `{${['semantic', mode, ...ref.split('.').slice(1)].join('.')}}` }];
    return [k, { $type: 'dimension', $value: ref ? `{${ref}}` : px(v) }];
  }));
}
const dtcg = {
  color: colorGroup(tokens.color),
  space: dimGroup(tokens.space),
  radius: dimGroup(tokens.radius),
  fontFamily: Object.fromEntries(Object.entries(tokens.fontFamily).map(([k, v]) => [k, { $type: 'fontFamily', $value: v }])),
  fontWeight: numGroup(tokens.fontWeight, 'fontWeight'),
  fontSize: dimGroup(tokens.fontSize),
  lineHeight: numGroup(tokens.lineHeight),
  zIndex: numGroup(tokens.zIndex),
  breakpoint: dimGroup(tokens.breakpoint),
  density: Object.fromEntries(Object.entries(tokens.density).map(([d, g]) => [d, { inset: dimGroup(g.inset), gap: dimGroup(g.gap) }])),
  duration: Object.fromEntries(Object.entries(tokens.motion.duration).map(([k, v]) => [k, { $type: 'duration', $value: v }])),
  easing: Object.fromEntries(Object.entries(tokens.motion.easing).map(([k, v]) => [k, { $type: 'cubicBezier', $value: bezier(v) }])),
  shadow: Object.fromEntries(Object.entries(tokens.shadow).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  shadowDark: Object.fromEntries(Object.entries(tokens.shadowDark).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  typography: Object.fromEntries(Object.entries(tokens.typography).map(([k, t]) => [k, { $type: 'typography', $value: { fontFamily: t.fontFamily, fontSize: px(t.fontSize), fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: px(t.letterSpacing) } }])),
  // Semantic values stay as {color.*} aliases so DTCG tools (Tokens Studio, Style Dictionary) keep the link to the ladder.
  semantic: { light: colorGroup(source.semantic.light), dark: colorGroup(source.semantic.dark) },
  component: Object.fromEntries(['light', 'dark'].map((m) => [m, dtcgComponent(source.component || {}, m)])),
};
writeFileSync(join(dist, 'tokens.dtcg.json'), JSON.stringify(dtcg, null, 2));

// Swift / SwiftUI export (ASDS-27). Writes dist/swift/Flint.swift; Package.swift at the repo root
// points SwiftPM at dist/swift so iOS/macOS apps add Flint by git tag.
const swiftColor = (v) => {
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return { hex: `0x${m[1].toLowerCase()}`, a: 1 };
  m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) return { hex: '0x' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join(''), a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`Swift export: unsupported color value "${v}"`);
};
const flatten = (obj, path = []) => Object.entries(obj).flatMap(([k, v]) => (typeof v === 'string' ? [[[...path, k], v]] : flatten(v, [...path, k])));
const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
const num = (n) => (Number.isInteger(n) ? `${n}` : `${+n.toFixed(4)}`);

const semanticArgs = flatten(apple.semantic.light).map(([path, lightVal]) => {
  const darkVal = at(apple.semantic.dark, path);
  if (typeof darkVal !== 'string') throw new Error(`Swift export: semantic.dark.${path.join('.')} missing`);
  const l = swiftColor(lightVal), d = swiftColor(darkVal);
  const args = [`light: ${l.hex}`, l.a !== 1 ? `lightOpacity: ${l.a}` : null, `dark: ${d.hex}`, d.a !== 1 ? `darkOpacity: ${d.a}` : null].filter(Boolean).join(', ');
  return [camel(...path), args];
});
const semanticLines = semanticArgs.map(([name, args]) => `    public static let ${name} = dynamic(${args})`);
// Same semantic tokens as UIColor / NSColor (ASDS-38). UIColor(Flint.Colors.x) resolves once and
// locks to the current appearance, so UIKit APIs like UINavigationBarAppearance need these instead.
const componentSwiftLines = (() => {
  const walk = (node, path) => Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? walk(v, [...path, k]) : [[[...path, k], v]]));
  return walk(appleSource.component || {}, []).map(([path]) => {
    const lv = at(apple.component.light, path), dv = at(apple.component.dark, path);
    if (typeof lv === 'number') return `    public static let ${camel(...path)}: CGFloat = ${num(lv)}`;
    const l = swiftColor(lv), d = swiftColor(dv);
    const args = [`light: ${l.hex}`, l.a !== 1 ? `lightOpacity: ${l.a}` : null, `dark: ${d.hex}`, d.a !== 1 ? `darkOpacity: ${d.a}` : null].filter(Boolean).join(', ');
    return `    public static let ${camel(...path)} = dynamic(${args})`;
  });
})();
const platformLines = semanticArgs.map(([name, args]) => `    public static let ${name} = dynamicPlatform(${args})`);
const paletteLines = Object.entries(apple.color).flatMap(([ramp, steps]) =>
  typeof steps === 'string'
    ? [`    public static let ${camel(ramp)} = Color(flintHex: ${swiftColor(steps).hex})`]
    : Object.entries(steps).map(([step, hex]) => `    public static let ${camel(ramp, step)} = Color(flintHex: ${swiftColor(hex).hex})`));
const cgGroup = (obj, prefix = '') => Object.entries(obj).map(([k, v]) => `    public static let ${prefix ? camel(prefix, k) : camel(k)}: CGFloat = ${num(v)}`);

const psFamily = (stack) => (stack.match(/'([^']+)'|"([^"]+)"/) || [])[1]?.replace(/\s+/g, '') || 'OpenSans';
const weightName = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };
const roleMap = { navTitleLarge: 'largeTitle', navTitle: 'headline', tabLabel: 'caption2', displayXl: 'largeTitle', display: 'largeTitle', headingH1: 'largeTitle', headingH2: 'title2', headingH3: 'title3', bodyLg: 'body', bodyMd: 'body', bodySm: 'subheadline', labelButton: 'subheadline', labelDefault: 'subheadline' };
const relativeTo = (name, size) => roleMap[name] || (size <= 12 ? 'caption' : size <= 14 ? 'subheadline' : 'body');
const typeLines = Object.entries(apple.typography).map(([name, t]) => {
  if (!weightName[t.fontWeight]) throw new Error(`Swift export: no Open Sans face for weight ${t.fontWeight} (${name})`);
  const font = `${psFamily(t.fontFamily)}-${weightName[t.fontWeight]}`;
  return `    public static let ${camel(name)} = FlintTextStyle(fontName: "${font}", size: ${num(t.fontSize)}, relativeTo: .${relativeTo(name, t.fontSize)}, lineHeight: ${num(t.lineHeight)}, tracking: ${num(parseFloat(t.letterSpacing) || 0)})`;
});

const seconds = (v) => { const m = String(v).match(/^([\d.]+)\s*(ms|s)$/); if (!m) throw new Error(`Swift export: bad duration "${v}"`); return m[2] === 'ms' ? +m[1] / 1000 : +m[1]; };
const durationLines = Object.entries(apple.motion.duration).map(([k, v]) => `      public static let ${camel(k)}: Double = ${num(seconds(v))}`);
const easingNames = Object.keys(apple.motion.easing).map((k) => camel(k));
const easingCases = Object.entries(apple.motion.easing).map(([k, v]) => { const [a, b, c, d] = bezier(v); return `        case .${camel(k)}: return (${a}, ${b}, ${c}, ${d})`; });

writeFileSync(join(swiftDir, 'Flint.swift'), `// GENERATED from tokens.json (brand ${BRAND}, platform ios) by scripts/build.mjs. Flint Design System. Do not edit by hand.
// Colors: Flint.Colors (semantic, light/dark aware) and Flint.Palette (raw ramps).
// Layout: Flint.Space, Flint.Radius, Flint.Control, Flint.IconSize, Flint.Target.
// Type:   Flint.Typography + .flintText(_:). Needs the Open Sans static TTFs bundled in the app.
// Motion: Flint.Motion.animation(_:duration:reduceMotion:) returns nil when Reduce Motion is on.
import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public enum Flint {
  /// Semantic colors. Each resolves to its light or dark value from the system appearance.
  public enum Colors {
${semanticLines.join('\n')}
  }

  #if canImport(UIKit)
  /// Semantic colors as dynamic UIColors, for UIKit APIs (UINavigationBarAppearance, attributed strings).
  /// Each resolves to its light or dark value at draw time. In SwiftUI, use Flint.Colors.
  public enum UIColors {
${platformLines.join('\n')}
  }
  #elseif canImport(AppKit)
  /// Semantic colors as dynamic NSColors, for AppKit APIs. In SwiftUI, use Flint.Colors.
  public enum NSColors {
${platformLines.join('\n')}
  }
  #endif

  /// Raw color ramps. Prefer Flint.Colors in UI; these values do not change between modes.
  public enum Palette {
${paletteLines.join('\n')}
  }

  /// Component tokens (ASDS-39): the decisions buttons, inputs, checkboxes and focus rings share
  /// across MUI, shadcn and SwiftUI. Colors follow the system appearance like Flint.Colors.
  public enum Component {
${componentSwiftLines.join('\n')}
  }

  public enum Space {
${cgGroup(apple.space, 's').join('\n')}
  }

  public enum Radius {
${cgGroup(apple.radius).join('\n')}
  }

  /// Control heights.
  public enum Control {
${cgGroup(apple.control).join('\n')}
  }

  public enum IconSize {
${cgGroup(apple.iconSize).join('\n')}
  }

  public enum Target {
    /// Smallest hit target on this platform: targetMin from platforms/ios.json (Apple HIG, 44pt).
    public static let minimum: CGFloat = ${num(apple.targetMin)}
    /// Same as minimum. Kept so apps written against Flint 1.15 and earlier still build.
    public static let touch: CGFloat = ${num(apple.targetMin)}
  }

  public enum Typography {
${typeLines.join('\n')}
  }

  public enum Motion {
    public enum Duration {
${durationLines.join('\n')}
    }

    public enum Easing: Sendable {
      case ${easingNames.join(', ')}

      var controlPoints: (Double, Double, Double, Double) {
        switch self {
${easingCases.join('\n')}
        }
      }
    }

    /// Returns nil when reduceMotion is true, so withAnimation(...) applies the change instantly.
    /// Read reduceMotion from @Environment(\\.accessibilityReduceMotion).
    public static func animation(_ easing: Easing = .standard, duration: Double = Duration.base, reduceMotion: Bool) -> Animation? {
      guard !reduceMotion, duration > 0 else { return nil }
      let p = easing.controlPoints
      return .timingCurve(p.0, p.1, p.2, p.3, duration: duration)
    }
  }
}

public struct FlintTextStyle {
  public let fontName: String
  public let size: CGFloat
  public let relativeTo: Font.TextStyle
  /// Line height as a multiple of size (CSS unitless line-height).
  public let lineHeight: CGFloat
  /// Letter spacing in points.
  public let tracking: CGFloat

  public init(fontName: String, size: CGFloat, relativeTo: Font.TextStyle, lineHeight: CGFloat, tracking: CGFloat) {
    self.fontName = fontName
    self.size = size
    self.relativeTo = relativeTo
    self.lineHeight = lineHeight
    self.tracking = tracking
  }

  /// Scales with Dynamic Type relative to \`relativeTo\`.
  public var font: Font { .custom(fontName, size: size, relativeTo: relativeTo) }
  /// Extra space between lines at the base size. SwiftUI adds lineSpacing on top of the font's own
  /// line height, so this is the target (size x lineHeight) minus what the font already provides.
  public var lineSpacing: CGFloat {
    #if canImport(UIKit)
    let natural = UIFont(name: fontName, size: size)?.lineHeight
    #elseif canImport(AppKit)
    let natural = NSFont(name: fontName, size: size).map { $0.ascender - $0.descender + $0.leading }
    #else
    let natural: CGFloat? = nil
    #endif
    // Open Sans hhea metrics (ascender 2189 + descender 600) / 2048 units per em, if the font is not bundled yet.
    return max(0, size * lineHeight - (natural ?? size * 1.362))
  }
}

private struct FlintTextModifier: ViewModifier {
  let style: FlintTextStyle
  @ScaledMetric private var lineSpacing: CGFloat
  @ScaledMetric private var tracking: CGFloat

  init(style: FlintTextStyle) {
    self.style = style
    _lineSpacing = ScaledMetric(wrappedValue: style.lineSpacing, relativeTo: style.relativeTo)
    _tracking = ScaledMetric(wrappedValue: style.tracking, relativeTo: style.relativeTo)
  }

  func body(content: Content) -> some View {
    content.font(style.font).lineSpacing(lineSpacing).tracking(tracking)
  }
}

public extension View {
  /// Applies a Flint type style: font, line spacing and tracking, all scaled with Dynamic Type.
  func flintText(_ style: FlintTextStyle) -> some View { modifier(FlintTextModifier(style: style)) }
}

extension Color {
  init(flintHex hex: UInt32, opacity: Double = 1) {
    self.init(.sRGB, red: Double((hex >> 16) & 0xff) / 255, green: Double((hex >> 8) & 0xff) / 255, blue: Double(hex & 0xff) / 255, opacity: opacity)
  }
}

#if canImport(UIKit)
private func dynamicPlatform(light: UInt32, lightOpacity: Double = 1, dark: UInt32, darkOpacity: Double = 1) -> UIColor {
  func rgb(_ h: UInt32) -> (CGFloat, CGFloat, CGFloat) { (CGFloat((h >> 16) & 0xff) / 255, CGFloat((h >> 8) & 0xff) / 255, CGFloat(h & 0xff) / 255) }
  let l = rgb(light), d = rgb(dark)
  return UIColor { traits in
    traits.userInterfaceStyle == .dark
      ? UIColor(red: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : UIColor(red: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  }
}
#elseif canImport(AppKit)
private func dynamicPlatform(light: UInt32, lightOpacity: Double = 1, dark: UInt32, darkOpacity: Double = 1) -> NSColor {
  func rgb(_ h: UInt32) -> (CGFloat, CGFloat, CGFloat) { (CGFloat((h >> 16) & 0xff) / 255, CGFloat((h >> 8) & 0xff) / 255, CGFloat(h & 0xff) / 255) }
  let l = rgb(light), d = rgb(dark)
  return NSColor(name: nil) { appearance in
    appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
      ? NSColor(srgbRed: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : NSColor(srgbRed: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  }
}
#endif

private func dynamic(light: UInt32, lightOpacity: Double = 1, dark: UInt32, darkOpacity: Double = 1) -> Color {
  func rgb(_ h: UInt32) -> (CGFloat, CGFloat, CGFloat) { (CGFloat((h >> 16) & 0xff) / 255, CGFloat((h >> 8) & 0xff) / 255, CGFloat(h & 0xff) / 255) }
  let l = rgb(light), d = rgb(dark)
  #if canImport(UIKit)
  return Color(uiColor: UIColor { traits in
    traits.userInterfaceStyle == .dark
      ? UIColor(red: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : UIColor(red: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #elseif canImport(AppKit)
  return Color(nsColor: NSColor(name: nil) { appearance in
    appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
      ? NSColor(srgbRed: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : NSColor(srgbRed: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #else
  return Color(flintHex: light, opacity: lightOpacity)
  #endif
}
`);

// Component classes (ASDS-58). Hand-written in css/components.css, shipped from dist/ like every other
// output. scripts/check-components.mjs guards it after the build.
writeFileSync(join(dist, 'components.css'), `/* GENERATED copy of css/components.css. Flint Design System. Edit the source, not this file. */
${readFileSync(join(root, 'css', 'components.css'), 'utf8')}`);

console.log(`Built ${BRAND} into ${dist.replace(root + '/', '')}/ (Swift: ${swiftDir.replace(root + '/', '')}):`, 'tokens.json, tokens.css, tokens.media.css, fonts.css, shadcn.css, components.css, index.js, index.d.ts, tokens.dtcg.json, swift/Flint.swift');
