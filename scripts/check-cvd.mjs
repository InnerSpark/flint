/**
 * Chart color guard (ASDS-77). The five chart colors must stay tell-apart for people with color vision
 * deficiency, in light and dark. Each pair is simulated for protanopia, deuteranopia and tritanopia
 * (Machado, Oliveira and Fernandes 2009, full severity) and measured in OKLab. The build fails if any
 * pair, in any mode and simulation, comes closer than MIN_DISTANCE. Grayscale is reported, not
 * enforced: five 3:1 colors can't all differ in lightness, which is why charts label series directly.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MIN_DISTANCE = 0.1;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'dist/tokens.json'), 'utf8'));

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (hex) => [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
const SIMS = {
  typical: null,
  protanopia: [[0.152, 1.053, -0.205], [0.115, 0.786, 0.099], [-0.004, -0.048, 1.052]],
  deuteranopia: [[0.367, 0.861, -0.228], [0.280, 0.673, 0.047], [-0.012, 0.043, 0.969]],
  tritanopia: [[1.256, -0.077, -0.179], [-0.078, 0.931, 0.148], [0.005, 0.691, 0.304]],
  grayscale: [[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]],
};
const simulate = (c, m) => (m ? m.map((r) => Math.min(1, Math.max(0, r[0] * c[0] + r[1] * c[1] + r[2] * c[2]))) : c);
const oklab = ([r, g, b]) => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};

let failures = 0;
console.log('\n== chart colors under color vision deficiency ==');
for (const mode of ['light', 'dark']) {
  const chart = Object.entries(tokens.semantic[mode].chart);
  for (const [name, matrix] of Object.entries(SIMS)) {
    const labs = chart.map(([k, hex]) => [k, oklab(simulate(rgb(hex), matrix))]);
    let min = Infinity, pair = '';
    for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) {
      const [a, b] = [labs[i][1], labs[j][1]];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d < min) { min = d; pair = `chart.${labs[i][0]} and chart.${labs[j][0]}`; }
    }
    const enforced = name !== 'grayscale';
    const ok = !enforced || min >= MIN_DISTANCE;
    if (!ok) failures++;
    console.log(`${ok ? (enforced ? 'PASS' : 'INFO') : 'FAIL'}  ${min.toFixed(3)} ${enforced ? `(>=${MIN_DISTANCE})` : '(advisory)'}  ${mode.padEnd(5)} ${name.padEnd(12)} closest: ${pair}`);
  }
}
console.log(`\n${failures} chart color failure(s).`);
process.exit(failures ? 1 : 0);
