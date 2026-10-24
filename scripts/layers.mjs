/**
 * Brand and platform layers (ASDS-86). tokens.json is the base: the flint brand on the web.
 * A brand file (brands/<name>.json) and a platform file (platforms/<name>.json) are deep-merged
 * on top, in that order, before references resolve. So a brand that repoints
 * semantic.light.action.focusRing, or a platform that sets control.md, flows through every
 * component token that references them.
 *
 * Rules, checked here so a bad layer fails the build:
 *   - Every overridden path must already exist in the base. Typos fail instead of adding a
 *     dead token. Brands may add whole new color ramps and type styles; platforms may add type styles.
 *   - Platforms change sizes, targets and type only. No color, semantic, shadow or component
 *     values, so contrast stays a per-brand check.
 *   - Keys starting with "$" ($description, $source) are notes and are dropped.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const BRANDS = ['flint', 'accessspark', 'innersparkmedia', 'studio'];
export const PLATFORMS = ['web', 'ios'];
export const DEFAULT_BRAND = 'flint';

// Where a layer may add keys the base doesn't have.
const MAY_ADD = { brand: ['color', 'typography'], platform: ['typography'] };
const PLATFORM_BLOCKED = ['color', 'semantic', 'shadow', 'shadowDark', 'component'];

const isGroup = (v) => v && typeof v === 'object' && !Array.isArray(v);
const strip = (node) => (isGroup(node)
  ? Object.fromEntries(Object.entries(node).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, strip(v)]))
  : node);

function merge(base, layer, kind, name, path = []) {
  const out = { ...base };
  for (const [k, v] of Object.entries(layer)) {
    const p = [...path, k];
    const where = `${kind} "${name}": ${p.join('.')}`;
    if (kind === 'platform' && path.length === 0 && PLATFORM_BLOCKED.includes(k)) {
      throw new Error(`${where}: platforms change sizes, targets and type, not ${k}`);
    }
    if (!(k in base)) {
      if (path.length === 1 && MAY_ADD[kind].includes(path[0])) { out[k] = v; continue; }
      throw new Error(`${where} is not in tokens.json. Fix the path, or add the token to the base first`);
    }
    if (isGroup(base[k]) !== isGroup(v)) throw new Error(`${where}: a group can only replace a group, and a value a value`);
    out[k] = isGroup(v) ? merge(base[k], v, kind, name, p) : v;
  }
  return out;
}

const readLayer = (dir, name) => {
  const file = join(root, dir, `${name}.json`);
  if (!existsSync(file)) throw new Error(`No ${dir}/${name}.json`);
  return strip(JSON.parse(readFileSync(file, 'utf8')));
};

/** tokens.json with the brand, then the platform, merged on top. References are still unresolved. */
export function loadSource({ brand = DEFAULT_BRAND, platform = 'web' } = {}) {
  if (!BRANDS.includes(brand)) throw new Error(`Unknown brand "${brand}". Brands: ${BRANDS.join(', ')}`);
  if (!PLATFORMS.includes(platform)) throw new Error(`Unknown platform "${platform}". Platforms: ${PLATFORMS.join(', ')}`);
  let source = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
  source = merge(source, readLayer('brands', brand), 'brand', brand);
  source = merge(source, readLayer('platforms', platform), 'platform', platform);
  return source;
}

/** The brand this process builds or checks: FLINT_BRAND, or flint. */
export const currentBrand = () => process.env.FLINT_BRAND || DEFAULT_BRAND;

/** dist/ for flint; dist/brands/<brand>/ for the others. */
export const distFor = (brand) => (brand === DEFAULT_BRAND ? join(root, 'dist') : join(root, 'dist', 'brands', brand));
