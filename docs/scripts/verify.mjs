/**
 * Docs verify. Serves dist/ and, for every docs page (the workbench has its own verify):
 *   - axe, WCAG 2.0 to 2.2 A and AA, in light and dark
 *   - no sideways scroll at 375px and 320px wide, and the header stays on one line
 *   - no Content-Security-Policy violations (scripts or styles the CSP did not allow)
 *   - workbench pages: islands hydrate, axe passes at compact density too, and forced Hover rows really differ
 *   - every semantic and component token from the build has a row (data-token) somewhere in the docs
 * Plus focus checks, sampled over 700ms because browsers reset focus late:
 *   - the skip link lands focus on the page heading and it stays there
 *   - loading a URL with a #hash lands focus on that heading
 *   - an "On this page" link moves focus to its heading
 * Optional: --shots <dir> saves a screenshot of every page in both themes.
 * Needs a Chromium: CHROME_PATH, or Playwright's (npx playwright install chromium).
 */
import { createServer } from 'node:http';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, extname, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > -1 ? process.argv[shotsAt + 1] : null;

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(dist, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('not found'); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

async function pagesIn(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) { if (name !== '_astro') out.push(...(await pagesIn(full))); }
    else if (name === 'index.html') out.push('/' + relative(dist, dir).split('\\').join('/') + (dir === dist ? '' : '/'));
  }
  return out.map((p) => p.replace('//', '/'));
}
const pages = (await pagesIn(dist)).sort();

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const problems = [];
if (shots) await mkdir(shots, { recursive: true });

const open = async (theme, width = 1366) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript((t) => { try { localStorage.setItem('flint-theme', t); } catch (e) {} }, theme);
  return { ctx, page: await ctx.newPage() };
};
const sampleFocus = (page, ms = 700) => page.evaluate((ms) => new Promise((done) => {
  const seen = []; const start = performance.now();
  (function tick() { seen.push(document.activeElement && (document.activeElement.id || document.activeElement.tagName)); if (performance.now() - start < ms) requestAnimationFrame(tick); else done(seen); })();
}), ms);

const hydrated = (page) => page.waitForFunction(() => [...document.querySelectorAll('astro-island')].every((i) => !i.hasAttribute('ssr')), null, { timeout: 15000 });
const axeRun = () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
const tokensSeen = new Set();

for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open(theme);
  let current = '';
  // The CSP meta tag blocks anything it didn't hash. A blocked script or style is a broken page.
  page.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) problems.push(`${current} [${theme}]: CSP blocked something: ${m.text().slice(0, 160)}`); });
  for (const path of pages) {
    current = path;
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await hydrated(page);
    for (const tk of await page.$$eval('[data-token]', (els) => els.map((e) => e.dataset.token))) tokensSeen.add(tk);
    const applied = await page.evaluate(() => document.documentElement.dataset.theme);
    if (applied !== theme) problems.push(`${path} [${theme}]: theme did not apply`);
    await page.evaluate(axeSource); // Runtime.evaluate is not subject to the page CSP, so axe loads without weakening it.
    const r = await page.evaluate(axeRun);
    for (const v of r.violations) for (const n of v.nodes) problems.push(`${path} [${theme}]: axe ${v.id} at ${n.target.join(' ')}: ${n.failureSummary?.split('\n')[1]?.trim() || v.help}`);
    if (path.startsWith('/workbench/') && path !== '/workbench/') {
      // Compact density: same page, same bar.
      await page.check('.density-switch input[value="compact"]');
      await page.waitForFunction(() => document.documentElement.dataset.density === 'compact');
      await page.waitForTimeout(150);
      const rc = await page.evaluate(axeRun);
      for (const v of rc.violations) for (const n of v.nodes) problems.push(`${path} [${theme}, compact]: axe ${v.id} at ${n.target.join(' ')}`);
      await page.check('.density-switch input[value="comfortable"]');
      // Forced states are real: in every bench, the Hover row's plain-CSS and shadcn cells must not look like Default.
      const same = await page.evaluate(() => {
        const out = [];
        for (const table of document.querySelectorAll('.tb-stage table')) {
          const rows = [...table.tBodies[0].rows];
          const def = rows[0], hov = rows.find((r) => r.cells[0].textContent.startsWith('Hover'));
          if (!hov) continue;
          for (const col of [2, 3]) {
            const look = (row) => { const el = row.cells[col].querySelector('button, input, a'); const s = getComputedStyle(el); return s.backgroundColor + s.borderColor + s.textDecorationThickness; };
            if (look(def) === look(hov)) out.push(`${table.getAttribute('aria-labelledby')} column ${col}`);
          }
        }
        return out;
      });
      for (const s of same) problems.push(`${path} [${theme}]: forced Hover looks the same as Default (${s})`);
    }
    if (shots) await page.screenshot({ path: join(shots, `${(path.replace(/\//g, '_') || 'home').replace(/^_|_$/g, '') || 'home'}--${theme}.png`), fullPage: true });
  }
  await ctx.close();
}

// Token coverage: every semantic and component token from the build has a row in the docs.
{
  const tokens = JSON.parse(await readFile(join(here, '..', '..', 'dist', 'tokens.json'), 'utf8'));
  const paths = (node, pre) => Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? paths(v, `${pre}.${k}`) : [`${pre}.${k}`]));
  for (const tk of [...paths(tokens.semantic.light, 'semantic'), ...paths(tokens.component.light, 'component')]) {
    if (!tokensSeen.has(tk)) problems.push(`tokens: ${tk} has no row in the docs`);
  }
}

// Phone widths: nothing scrolls sideways, and the header stays on one line.
for (const width of [375, 320]) {
  const { ctx, page } = await open('light', width);
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await hydrated(page);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 0) problems.push(`${path} [${width}px]: scrolls sideways by ${over}px`);
    const wrapped = await page.evaluate(() => [...document.querySelectorAll('.site-header .brand, .site-header .header-button, .site-header .header-links a')]
      .filter((el) => getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 48)
      .map((el) => el.id || el.className));
    if (wrapped.length) problems.push(`${path} [${width}px]: header item wraps to two lines (${wrapped.join(', ')})`);
  }
  await ctx.close();
}

// Focus management.
{
  const { ctx, page } = await open('light');
  const target = pages.find((p) => p.startsWith('/foundations/color')) || pages[1];
  await page.goto(base + target, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement.textContent.trim());
  if (first !== 'Skip to content') problems.push(`focus: first Tab stop is "${first}", not the skip link`);
  await page.keyboard.press('Enter');
  const afterSkip = await sampleFocus(page);
  if (afterSkip.some((id) => id !== 'page-title')) problems.push(`focus: skip link did not hold focus on the heading (saw ${[...new Set(afterSkip)].join(', ')})`);

  const toc = await page.$('.toc a');
  if (toc) {
    const id = (await toc.getAttribute('href')).slice(1);
    await toc.click();
    const afterToc = await sampleFocus(page);
    if (afterToc.some((x) => x !== id)) problems.push(`focus: "On this page" link did not hold focus on #${id} (saw ${[...new Set(afterToc)].join(', ')})`);
    const fresh = await ctx.newPage();
    await fresh.goto(`${base}${target}#${id}`, { waitUntil: 'load' });
    const onLoad = await sampleFocus(fresh, 900);
    if (onLoad.slice(-10).some((x) => x !== id)) problems.push(`focus: loading #${id} did not end with focus on its heading (saw ${[...new Set(onLoad)].join(', ')})`);
  } else problems.push(`focus: ${target} has no "On this page" links to test`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(`Checked ${pages.length} pages: axe in light and dark, 375px width, focus management.`);
for (const p of problems) console.log(`FAIL ${p}`);
console.log(problems.length ? `${problems.length} problem(s).` : 'PASS: no axe violations, no sideways scroll, focus lands and holds on headings.');
process.exit(problems.length ? 1 : 0);
