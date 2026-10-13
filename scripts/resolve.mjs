/**
 * Token references (ASDS-25, ASDS-39). tokens.json points from one tier to the one below
 * with DTCG-style references:
 *   semantic:  "link": "{color.blue.700}"
 *   roles:     "control": "{radius.sm}"
 *   component: "bg": "{semantic.action.primary}"  (mode-free: resolved once for light, once for dark)
 * resolveTokens() returns a deep copy with every reference replaced by its final value, and
 * the component tier split into { light, dark } like the semantic tier.
 * Unknown, circular, or group-pointing references throw, so a bad reference fails the build.
 */
const REF = /^\{([^{}]+)\}$/;
export const MODES = ['light', 'dark'];

export const refOf = (v) => (typeof v === 'string' ? (v.match(REF) || [])[1] : undefined);

/** "semantic.action.primary" + mode -> "semantic.light.action.primary". Other paths unchanged. */
export const modePath = (path, mode) => {
  const [head, next, ...rest] = path.split('.');
  return head === 'semantic' && mode && !MODES.includes(next) ? ['semantic', mode, next, ...rest].join('.') : path;
};

const at = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function resolveTokens(source) {
  const lookup = (path, mode, seen) => {
    const full = modePath(path, mode);
    if (seen.includes(full)) throw new Error(`Circular token reference: ${[...seen, full].join(' -> ')}`);
    if (full.startsWith('semantic.') && !MODES.includes(full.split('.')[1])) {
      throw new Error(`Token reference {${path}} needs a mode; only the component tier may use mode-free semantic references`);
    }
    const value = at(source, full);
    if (value === undefined) throw new Error(`Unknown token reference {${path}}`);
    if (value !== null && typeof value === 'object') throw new Error(`Token reference {${path}} points at a group, not a value`);
    const next = refOf(value);
    return next ? lookup(next, mode, [...seen, full]) : value;
  };
  const walk = (node, mode) => {
    const r = refOf(node);
    if (r) return lookup(r, mode, []);
    if (Array.isArray(node)) return node.map((n) => walk(n, mode));
    if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v, mode)]));
    return node;
  };
  const { component, ...rest } = source;
  const out = walk(rest, undefined);
  if (component) out.component = Object.fromEntries(MODES.map((m) => [m, walk(component, m)]));
  return out;
}
