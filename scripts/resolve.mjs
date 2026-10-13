/**
 * Token references (ASDS-25). Semantic tokens in tokens.json point at the primitive ladder
 * with DTCG-style references, e.g. "text.link": "{color.blue.700}", so a ladder change flows
 * to every semantic token that uses it and the data says where each value comes from.
 * resolveTokens() returns a deep copy with every reference replaced by its final value.
 * Unknown or circular references throw, so a bad reference fails the build.
 */
const REF = /^\{([^{}]+)\}$/;

export function resolveTokens(source) {
  const lookup = (path, seen) => {
    if (seen.includes(path)) throw new Error(`Circular token reference: ${[...seen, path].join(' -> ')}`);
    const value = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), source);
    if (value === undefined) throw new Error(`Unknown token reference {${path}}`);
    if (typeof value !== 'string') throw new Error(`Token reference {${path}} points at a group, not a value`);
    const m = value.match(REF);
    return m ? lookup(m[1], [...seen, path]) : value;
  };
  const walk = (node) => {
    if (typeof node === 'string') { const m = node.match(REF); return m ? lookup(m[1], []) : node; }
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
    return node;
  };
  return walk(source);
}
