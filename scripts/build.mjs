/**
 * Flint token build. Reads tokens.json (single source of truth) and emits:
 *   dist/tokens.css   CSS custom properties (:root + [data-theme="dark"])
 *   dist/fonts.css    metric-matched Open Sans fallback @font-face
 *   dist/index.js     ESM named + default exports of the resolved tokens
 *   dist/index.d.ts   types
 * No runtime dependencies; Node only.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function semanticVars(mode) {
  const s = tokens.semantic[mode];
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

function staticVars() {
  const out = [];
  for (const [ramp, steps] of Object.entries(tokens.color)) {
    if (typeof steps === 'string') out.push([`--color-${ramp}`, steps]);
    else for (const [step, hex] of Object.entries(steps)) out.push([`--color-${ramp}-${step}`, hex]);
  }
  for (const [k, v] of Object.entries(tokens.space)) out.push([`--space-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.radius)) out.push([`--radius-${k}`, `${v}px`]);
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
  out.push(['--font-sans', tokens.fontFamily.sans]);
  out.push(['--font-prose', tokens.fontFamily.prose]);
  out.push(['--font-mono', tokens.fontFamily.mono]);
  return out;
}

const fmt = (pairs) => pairs.map(([n, v]) => `  ${n}: ${v};`).join('\n');

writeFileSync(join(dist, 'tokens.css'), `/* GENERATED from tokens.json. Flint Design System. Do not edit by hand. */
:root {
${fmt(staticVars())}

  /* semantic (light) */
${fmt(semanticVars('light'))}
}

[data-theme="dark"] {
  /* semantic (dark) */
${fmt(semanticVars('dark'))}

  /* elevation (dark) */
${fmt(shadowDarkVars())}
}
`);

writeFileSync(join(dist, 'tokens.media.css'), `/* GENERATED from tokens.json. Auto dark via prefers-color-scheme. Do not edit by hand. */
:root {
${fmt(staticVars())}

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
  overlayScrim: Hex;
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
  control: Record<string, number>;
  iconSize: Record<string, number>;
  targetMin: number;
  semantic: { light: SemanticScheme; dark: SemanticScheme };
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
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
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
  duration: Object.fromEntries(Object.entries(tokens.motion.duration).map(([k, v]) => [k, { $type: 'duration', $value: v }])),
  easing: Object.fromEntries(Object.entries(tokens.motion.easing).map(([k, v]) => [k, { $type: 'cubicBezier', $value: bezier(v) }])),
  shadow: Object.fromEntries(Object.entries(tokens.shadow).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  shadowDark: Object.fromEntries(Object.entries(tokens.shadowDark).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  typography: Object.fromEntries(Object.entries(tokens.typography).map(([k, t]) => [k, { $type: 'typography', $value: { fontFamily: t.fontFamily, fontSize: px(t.fontSize), fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: px(t.letterSpacing) } }])),
  semantic: { light: colorGroup(tokens.semantic.light), dark: colorGroup(tokens.semantic.dark) },
};
writeFileSync(join(dist, 'tokens.dtcg.json'), JSON.stringify(dtcg, null, 2));

console.log('Built dist/: tokens.css, tokens.media.css, fonts.css, index.js, index.d.ts, tokens.dtcg.json');
