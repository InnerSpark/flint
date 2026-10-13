// Everything the token pages show comes from Flint's own build output. Nothing is typed here.
import resolved from '../../../dist/tokens.json';
import source from '../../../tokens.json';
import contrast from '../../../dist/contrast.json';

export { resolved, source, contrast };

export const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** [[path], value] for every leaf under node. */
export const leaves = (node, path = []) =>
  Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? leaves(v, [...path, k]) : [[[...path, k], v]]));

export const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
export const refName = (v) => (typeof v === 'string' && /^\{.+\}$/.test(v) ? v.slice(1, -1) : null);
