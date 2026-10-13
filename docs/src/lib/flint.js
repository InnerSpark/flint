// Everything the docs show about tokens comes from Flint's build. Nothing here is typed by hand.
import resolved from '../../../dist/tokens.json';
import source from '../../../tokens.json';
import contrast from '../../../dist/contrast.json';
import pkg from '../../../package.json';
import { kebab, camel, cssVarForPath, componentVar } from '../../../scripts/names.mjs';
import { SHADCN_MAP } from '../../../scripts/shadcn-map.mjs';

export { resolved, source, contrast, pkg, kebab, camel, cssVarForPath, componentVar, SHADCN_MAP };

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
