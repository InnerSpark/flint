/**
 * Cross-platform parity (ASDS-41). Adapters only translate names; they never pick values.
 * This proves it: every semantic and component token must reach CSS, MUI, shadcn and Swift
 * with the value tokens.json gives it, in light and dark. One line per mismatch, exit 1 on any.
 * Runs after the build, so it checks the files that actually ship in dist/.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveTokens, refOf, MODES } from './resolve.mjs';
import { cssVarForPath, componentVar, camel } from './names.mjs';
import { SHADCN_MAP } from './shadcn-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8');
const source = JSON.parse(read('tokens.json'));
const tokens = resolveTokens(source);

const fails = [];
let checks = 0;
const norm = (v) => String(v).trim().toLowerCase();
const expect = (platform, token, mode, actual, wanted) => {
  checks++;
  if (actual === undefined || norm(actual) !== norm(wanted)) fails.push(`${platform.padEnd(6)} ${mode.padEnd(5)} ${token}: expected ${wanted}, got ${actual ?? 'missing'}`);
};
const leaves = (node, path = []) => Object.entries(node).flatMap(([k, v]) => (v && typeof v === 'object' ? leaves(v, [...path, k]) : [[[...path, k], v]]));
const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
const asCss = (v) => (typeof v === 'number' ? `${v}px` : v);

// ---------- CSS: parse the blocks, resolve var() chains the way a browser would per mode ----------
const blocks = (css) => {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const vars = {};
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    // a statement at-rule (@custom-variant ...;) can sit before a selector; keep only the selector
    out.push({ selector: m[1].replace(/\/\*[\s\S]*?\*\//g, '').split(';').pop().trim(), vars });
  }
  return out;
};
const cssScope = (files, mode) => {
  const scope = {};
  for (const f of files) {
    for (const b of blocks(read(f))) {
      const s = b.selector;
      const applies = s === ':root' || s === ':root, [data-theme]' || (mode === 'dark' && s === '[data-theme="dark"]');
      if (applies) Object.assign(scope, b.vars);
    }
  }
  const resolve = (v, seen = []) => {
    const m = String(v).match(/^var\((--[\w-]+)\)$/);
    if (!m) return v;
    if (seen.includes(m[1]) || scope[m[1]] === undefined) return undefined;
    return resolve(scope[m[1]], [...seen, m[1]]);
  };
  return { get: (name) => (scope[name] === undefined ? undefined : resolve(scope[name])), raw: (name) => scope[name] };
};

for (const mode of MODES) {
  const css = cssScope(['dist/tokens.css', 'dist/shadcn.css'], mode);
  for (const [path, value] of leaves(tokens.semantic[mode])) {
    expect('css', `semantic.${path.join('.')}`, mode, css.get(cssVarForPath(['semantic', mode, ...path].join('.'))), value);
  }
  for (const [path, value] of leaves(tokens.component[mode])) {
    expect('css', `component.${path.join('.')}`, mode, css.get(componentVar(path)), asCss(value));
  }
  // shadcn: each variable must be a var() to the mapped Flint variable, and land on its value
  for (const [name, path] of Object.entries(SHADCN_MAP)) {
    const raw = css.raw(name);
    checks++;
    if (raw !== `var(${cssVarForPath(path)})`) fails.push(`shadcn ${mode.padEnd(5)} ${name}: must be var(${cssVarForPath(path)}), got ${raw ?? 'missing'}`);
    const wanted = path.startsWith('semantic.') ? at(tokens.semantic[mode], path.split('.').slice(1)) : asCss(at(tokens, path.split('.')));
    expect('shadcn', name, mode, css.get(name), typeof wanted === 'number' ? `${wanted}px` : wanted);
  }
}

// ---------- MUI: the theme options the factory actually builds ----------
const { flintThemeOptions } = await import(pathToFileURL(join(root, 'mui', 'options.mjs')).href);
for (const mode of MODES) {
  const o = flintThemeOptions(mode);
  const c = tokens.semantic[mode], k = tokens.component[mode], p = o.palette, comp = o.components;
  expect('mui', 'palette.primary.main = action.primary', mode, p.primary.main, c.action.primary);
  expect('mui', 'palette.primary.dark = action.primaryHover', mode, p.primary.dark, c.action.primaryHover);
  expect('mui', 'palette.primary.contrastText = action.onPrimary', mode, p.primary.contrastText, c.action.onPrimary);
  expect('mui', 'palette.error.main = feedback.error.solid', mode, p.error.main, c.feedback.error.solid);
  expect('mui', 'palette.background.default = surface.page', mode, p.background.default, c.surface.page);
  expect('mui', 'palette.background.paper = surface.default', mode, p.background.paper, c.surface.default);
  expect('mui', 'palette.text.primary = text.heading', mode, p.text.primary, c.text.heading);
  expect('mui', 'palette.divider = border.default', mode, p.divider, c.border.default);
  expect('mui', 'MuiButton radius = button.radius', mode, comp.MuiButton.styleOverrides.root.borderRadius, k.button.radius);
  expect('mui', 'MuiOutlinedInput radius = input.radius', mode, comp.MuiOutlinedInput.styleOverrides.root.borderRadius, k.input.radius);
  expect('mui', 'MuiOutlinedInput height = input.height', mode, comp.MuiOutlinedInput.styleOverrides.input.height, `${k.input.height}px`);
  const baseline = comp.MuiCssBaseline.styleOverrides;
  const ring = `outline: ${k.focus.ring.width}px solid ${k.focus.ring.color}; outline-offset: ${k.focus.ring.offset}px;`;
  checks++;
  if (!baseline.includes(`*:focus-visible { ${ring} }`)) fails.push(`mui    ${mode.padEnd(5)} focus ring: CssBaseline does not carry "${ring}"`);
}
// Adapters translate, so the factory may not carry its own colors.
const literal = read('mui/options.mjs').split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /#[0-9a-f]{3,8}\b/i.test(l.replace(/\/\/.*$/, '')));
checks++;
for (const [n, l] of literal) fails.push(`mui    any   mui/options.mjs:${n} hardcodes a color; use a token: ${l.trim().slice(0, 90)}`);

// ---------- Swift: the generated file the Swift package ships ----------
const swift = read('dist/swift/Flint.swift');
const swiftEnum = (name) => {
  const m = swift.match(new RegExp(`public enum ${name} \\{([\\s\\S]*?)\\n  \\}`));
  return m ? m[1] : '';
};
const hex = (v) => `0x${String(v).replace('#', '').toLowerCase()}`;
const colorLine = (body, name, fn) => {
  const m = body.match(new RegExp(`static let ${name} = ${fn}\\(light: (0x[0-9a-f]{6})(?:, lightOpacity: [\\d.]+)?, dark: (0x[0-9a-f]{6})`));
  return m ? { light: m[1], dark: m[2] } : {};
};
const numLine = (body, name) => (body.match(new RegExp(`static let ${name}: CGFloat = ([\\d.]+)`)) || [])[1];
const colorsBody = swiftEnum('Colors'), uiBody = swiftEnum('UIColors'), compBody = swiftEnum('Component');
for (const [path, light] of leaves(tokens.semantic.light)) {
  if (!String(light).startsWith('#')) continue; // rgba scrims are checked by value elsewhere
  const name = camel(...path), dark = at(tokens.semantic.dark, path);
  for (const [platform, body, fn] of [['swift', colorsBody, 'dynamic'], ['uikit', uiBody, 'dynamicPlatform']]) {
    const got = colorLine(body, name, fn);
    expect(platform, `Colors.${name}`, 'light', got.light, hex(light));
    expect(platform, `Colors.${name}`, 'dark', got.dark, hex(dark));
  }
}
for (const [path, light] of leaves(tokens.component.light)) {
  const name = camel(...path), dark = at(tokens.component.dark, path);
  if (typeof light === 'number') { expect('swift', `Component.${name}`, 'any', numLine(compBody, name), String(light)); continue; }
  const got = colorLine(compBody, name, 'dynamic');
  expect('swift', `Component.${name}`, 'light', got.light, hex(light));
  expect('swift', `Component.${name}`, 'dark', got.dark, hex(dark));
}
const radiusBody = swiftEnum('Radius'), spaceBody = swiftEnum('Space');
for (const [k, v] of Object.entries(tokens.radius)) expect('swift', `Radius.${camel(k)}`, 'any', numLine(radiusBody, camel(k)), String(v));
for (const [k, v] of Object.entries(tokens.space)) expect('swift', `Space.s${k}`, 'any', numLine(spaceBody, `s${k}`), String(v));

console.log(`\n== parity ==`);
if (fails.length) for (const f of fails) console.log(`FAIL ${f}`);
else console.log(`PASS   ${checks} checks: CSS, shadcn, MUI and Swift match tokens.json in light and dark`);
console.log(`\n${fails.length} parity failure(s).`);
process.exit(fails.length ? 1 : 0);
