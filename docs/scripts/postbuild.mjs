// After astro build:
//   1. CSP: rehash every inline script from the final HTML (Astro hashes some before its last transform, so
//      its hash can miss), and drop the style hashes: any hash makes browsers ignore 'unsafe-inline', and
//      swatches set their color in a style attribute. Scripts stay hash-only, the part that stops XSS.
//   2. Writes dist/sitemap.xml.
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const site = 'https://flint.innersparkmedia.com';
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { if (name !== '_astro') walk(full); }
    else if (name === 'index.html') pages.push('/' + relative(dist, dir).split('\\').join('/'));
  }
})(dist);
for (const p of pages) {
  const file = join(dist, p, 'index.html');
  const html = readFileSync(file, 'utf8');
  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g)]
    .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  const fixed = html
    .replace(/script-src 'self'(?: 'sha256-[^']+')*/, `script-src 'self' ${[...new Set(hashes)].join(' ')}`)
    .replace(/(style-src 'self' 'unsafe-inline')(?: 'sha256-[^']+')+/g, '$1');
  if (!fixed.includes("style-src 'self' 'unsafe-inline';")) throw new Error(`CSP style-src not as expected in ${file}`);
  writeFileSync(file, fixed);
}
const urls = pages.map((p) => (p === '/' ? '/' : `${p}/`)).sort();
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`Wrote sitemap.xml with ${urls.length} pages.`);
