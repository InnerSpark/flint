// Everything the docs show about tokens comes from Flint's build. Nothing here is typed by hand.
import resolved from '../../../dist/tokens.json';
import source from '../../../tokens.json';
import contrast from '../../../dist/contrast.json';
import glass from '../../../dist/glass.json';
import pkg from '../../../package.json';
import { kebab, camel, cssVarForPath, componentVar } from '../../../scripts/names.mjs';
import { SHADCN_MAP } from '../../../scripts/shadcn-map.mjs';

export { resolved, source, contrast, glass, pkg, kebab, camel, cssVarForPath, componentVar, SHADCN_MAP };

export const MODES = ['light', 'dark'];

/** [[path...], value] for every leaf. */
export const leaves = (node, path = []) =>
  Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? leaves(v, [...path, k]) : [[[...path, k], v]]));

export const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** "{color.blue.700}" -> "color.blue.700", anything else -> null */
export const refName = (v) => (typeof v === 'string' && /^\{.+\}$/.test(v) ? v.slice(1, -1) : null);

export const isColor = (v) => typeof v === 'string' && /^(#|rgb)/.test(v);

/** Contrast results for one pairing label, keyed by mode. */
export const pairResult = (label) => Object.fromEntries(MODES.map((m) => [m, contrast.pairs.find((p) => p.mode === m && p.label === label)]));

/** WCAG contrast ratio of two opaque hex colors; null for anything with alpha. */
const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const opaque = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
export const ratio = (a, b) => {
  if (!opaque(a) || !opaque(b)) return null;
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
/** Short grade for a ratio: AAA, AA, 3:1, or Under 3:1. */
export const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? '3:1' : 'Under 3:1');
