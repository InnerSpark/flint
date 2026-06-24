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
  typography: Record<string, { fontFamily: string; fontSize: number; fontWeight: number; lineHeight: number; letterSpacing: string }>;
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
export const typography: Tokens['typography'];
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
export default tokens;
`);

console.log('Built dist/: tokens.css, fonts.css, index.js, index.d.ts');
