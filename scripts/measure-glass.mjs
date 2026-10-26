/**
 * Liquid Glass contrast report (ASDS-91). Not a gate: glass can't guarantee contrast, so this
 * measures how bad it gets and writes dist/glass.json for the docs.
 *
 * The model is the docs' stand-in for Apple's material: surface/default at 68% (light) or 70% (dark)
 * over whatever scrolls underneath, and the prominent button as action/primary at 88%. Blur is
 * ignored: it averages the content behind, so a flat backdrop is the worst case. Every backdrop on a
 * 16-step grid of sRGB colors is tried, plus white and black. Real glass also adapts its tint to the
 * content, so treat these as a model, not a device measurement.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { currentBrand, distFor } from './layers.mjs';

const BRAND = currentBrand();
const tokens = JSON.parse(readFileSync(join(distFor(BRAND), 'tokens.json'), 'utf8'));

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// Browsers composite alpha in gamma-encoded sRGB, so the docs previews blend the same way.
const over = (top, alpha, under) => top.map((v, i) => v * alpha + under[i] * (1 - alpha));

const steps = [];
for (let v = 0; v <= 255; v += 17) steps.push(v);
const backdrops = [];
for (const r of steps) for (const g of steps) for (const b of steps) backdrops.push([r, g, b]);

const MODES = { light: 0.68, dark: 0.70 };
const PROMINENT = 0.88;
const report = { model: 'surface/default at 68% light, 70% dark; prominent = action/primary at 88%; flat backdrop, 16-step sRGB grid', textBar: 7, labelBar: 4.5, modes: {} };

for (const [mode, alpha] of Object.entries(MODES)) {
  const s = tokens.semantic[mode];
  const glass = rgb(s.surface.default);
  const labels = {
    'text/heading on glass (bar buttons, titles)': [rgb(s.text.heading), (b) => over(glass, alpha, b)],
    'text/default on glass (unselected tabs)': [rgb(s.text.default), (b) => over(glass, alpha, b)],
    'action/primary on glass (selected tab)': [rgb(s.action.primary), (b) => over(glass, alpha, b)],
    'action/on-primary on prominent glass': [rgb(s.action.onPrimary), (b) => over(rgb(s.action.primary), PROMINENT, b)],
  };
  const rows = [];
  for (const [name, [fg, bgFor]] of Object.entries(labels)) {
    let worst = { ratio: Infinity }; let best = 0;
    for (const b of backdrops) { const r = ratio(fg, bgFor(b)); if (r < worst.ratio) worst = { ratio: r, backdrop: hex(b) }; if (r > best) best = r; }
    const solid = name.includes('prominent') ? ratio(fg, rgb(s.action.primary)) : ratio(fg, glass);
    rows.push({ label: name, worst: +worst.ratio.toFixed(2), worstBackdrop: worst.backdrop, best: +best.toFixed(2), reduceTransparency: +solid.toFixed(2) });
  }
  report.modes[mode] = rows;
}

writeFileSync(join(distFor(BRAND), 'glass.json'), JSON.stringify(report, null, 2) + '\n');
for (const [mode, rows] of Object.entries(report.modes)) {
  console.log(`\nGlass (${mode}): worst case over any content, and solid with Reduce Transparency`);
  for (const r of rows) console.log(`  ${r.worst.toFixed(2).padStart(5)}:1 worst (behind ${r.worstBackdrop})  ${r.reduceTransparency.toFixed(2).padStart(5)}:1 solid  ${r.label}`);
}
console.log('\nReport only. Glass can not guarantee contrast; see /principles/ "Legible over any background".');
