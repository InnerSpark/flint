/**
 * Component CSS guard (ASDS-58). Reads css/components.css and fails the build on:
 *   - a color literal (hex, rgb(), hsl()): components take color from tokens only
 *   - a var(--x) that tokens.css does not define: a typo or a token that was renamed
 *   - a px value outside border widths, pseudo-element glyph geometry (check marks, radio dots) and the
 *     .flint-sr-only utility (its 1px box is the standard visually-hidden pattern)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'css/components.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const defined = new Set([...readFileSync(join(root, 'dist/tokens.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

// Split into rules, stepping into @media blocks so nested rules are checked by their own selector.
function rules(text) {
  const out = [];
  let depth = 0, start = 0, head = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') { if (depth === 0) { head = text.slice(start, i).trim(); start = i + 1; } depth++; }
    else if (text[i] === '}' && --depth === 0) {
      const body = text.slice(start, i);
      if (head.startsWith('@media')) out.push(...rules(body));
      else if (!head.startsWith('@keyframes')) out.push([head, body]);
      start = i + 1;
    }
  }
  return out;
}

const problems = [];
for (const [selector, body] of rules(css)) {
  const sel = selector.trim();
  const glyph = /::(after|before)/.test(sel) || sel === '.flint-sr-only';
  for (const decl of body.split(';').map((d) => d.trim()).filter(Boolean)) {
    const prop = decl.split(':')[0].trim();
    if (/#[0-9a-f]{3,8}\b|\b(rgb|hsl)a?\(/i.test(decl)) problems.push(`${sel}: color literal in "${decl}"`);
    for (const [, v] of decl.matchAll(/var\((--[a-z0-9-]+)/g)) if (!defined.has(v)) problems.push(`${sel}: ${v} is not defined in tokens.css`);
    if (/\b\d+(\.\d+)?px\b/.test(decl) && !glyph && !/^border(-width)?$/.test(prop)) problems.push(`${sel}: px literal in "${decl}" (use a token)`);
  }
}
if (problems.length) {
  console.error(`components.css: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('components.css: no color literals, every variable defined, px only in borders and glyphs.');
