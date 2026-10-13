/**
 * Workbench verify (ASDS-42). Serves storybook-static, opens every story and docs page in light and dark, and:
 *   - runs axe (WCAG 2.0/2.1/2.2 A and AA) on the story, failing on any violation
 *   - checks every semantic and component token from the build has a row on its page
 * Optional: --shots <dir> writes a full-page PNG per story and mode.
 *
 * Needs a Chromium. Uses CHROME_PATH if set, else Playwright's own (npx playwright install chromium).
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
const staticDir = join(here, '..', 'storybook-static');
const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const tokens = JSON.parse(await readFile(join(here, '..', '..', 'dist', 'tokens.json'), 'utf8'));
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > -1 ? process.argv[shotsAt + 1] : null;
if (!existsSync(staticDir)) { console.error('Run `npm run build` first: storybook-static is missing.'); process.exit(1); }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    const body = await readFile(join(staticDir, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const leaves = (node, path = []) => Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? leaves(v, [...path, k]) : [path.concat(k).join('.')]));
const expectRows = {
  'foundations-tokens--semantic-colors': leaves(tokens.semantic.light).map((p) => `semantic.${p}`),
  'foundations-tokens--component-tokens': leaves(tokens.component.light).map((p) => `component.${p}`),
};

const index = JSON.parse(await readFile(join(staticDir, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story' || e.type === 'docs');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
if (shots) await mkdir(shots, { recursive: true });

const problems = [];
for (const story of stories) {
  for (const theme of ['light', 'dark']) {
    const docs = story.type === 'docs';
    await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=${docs ? 'docs' : 'story'}&globals=theme:${theme}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(docs ? '#storybook-docs .sbdocs-content > *' : '#storybook-root > *');
    await page.evaluate(() => document.fonts.ready);
    const domTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    if (!docs && domTheme !== theme) problems.push(`${story.id} [${theme}]: toolbar theme did not apply (got ${domTheme})`);
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate((scope) => window.axe.run(scope, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }), docs ? '#storybook-docs' : '#storybook-root');
    for (const v of result.violations) {
      for (const n of v.nodes) problems.push(`${story.id} [${theme}]: axe ${v.id} (${v.impact}) at ${n.target.join(' ')}: ${n.failureSummary?.split('\n')[1]?.trim() || v.help}`);
    }
    if (expectRows[story.id]) {
      const rendered = await page.$$eval('[data-token]', (els) => els.map((e) => e.dataset.token));
      for (const t of expectRows[story.id]) if (!rendered.includes(t)) problems.push(`${story.id}: token ${t} has no row`);
    }
    if (shots) await page.screenshot({ path: join(shots, `${story.id}--${theme}.png`), fullPage: true });
  }
}
await browser.close();
server.close();

console.log(`Checked ${stories.length} pages (stories and docs) x 2 themes.`);
for (const p of problems) console.log(`FAIL ${p}`);
console.log(problems.length ? `${problems.length} problem(s).` : 'PASS: no axe violations, every token has a row.');
process.exit(problems.length ? 1 : 0);
