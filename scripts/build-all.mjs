/**
 * Builds and checks every brand (ASDS-86). Each brand gets its own build, contrast guard and
 * color-vision guard in light and dark; the flint brand also runs the parity and component
 * guards, which check the MUI, shadcn and components.css adapters against the base.
 * Then writes dist/brands.css, the data-brand preview stylesheet.
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BRANDS, DEFAULT_BRAND } from './layers.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const run = (script, brand) => execFileSync(process.execPath, [join(here, script)], { stdio: 'inherit', env: { ...process.env, FLINT_BRAND: brand } });

// --check: guards only, against what's already in dist/ (npm run check).
const checkOnly = process.argv.includes('--check');
for (const brand of BRANDS) {
  console.log(`\n=== ${brand} ===`);
  if (!checkOnly) run('build.mjs', brand);
  run('check-contrast.mjs', brand);
  run('check-cvd.mjs', brand);
  if (brand === DEFAULT_BRAND) { run('check-parity.mjs', brand); run('check-components.mjs', brand); }
}
if (!checkOnly) run('build-brand-preview.mjs', DEFAULT_BRAND);
console.log(`\nAll ${BRANDS.length} brands ${checkOnly ? 'checked' : 'built and checked'}.`);
