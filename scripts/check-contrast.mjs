/**
 * WCAG contrast guard for Flint semantic tokens. Reads tokens.json and checks every
 * meaningful pairing in both light and dark. Exits non-zero on a required failure so
 * the build fails before a bad token ships.
 *
 * Policy notes:
 *  - text and on-solid pairs: 4.5:1 (WCAG 1.4.3 normal text).
 *  - placeholder: 4.5:1 on input surfaces (default, page). Inputs render there, not on
 *    the tinted subtle surface, so it is checked on those two only.
 *  - text.muted is checked on every surface including subtle (captions sit on cards).
 *  - focus indicators (border.focus, action.focusRing) and primary-as-accent: 3:1 (1.4.11).
 *  - border.control and border.error are REQUIRED at 3:1 on both the field and page
 *    surfaces. These are the boundaries that identify a form control, which 1.4.11
 *    covers; they are not decorative. (A light-mode input outline at 1.23:1 is how the
 *    field was previously unidentifiable, see ASDS-20.)
 *  - border.default / border.strong are decorative boundaries (dividers, card edges,
 *    WCAG-exempt); reported as advisory ("ADV"), never fail the build.
 *  - action.disabled is exempt under 1.4.3 (inactive controls). Reported as advisory,
 *    but we hold it well above the old value for legibility.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };
const get = (mode, path) => path.split('.').reduce((o, k) => o[k], tokens.semantic[mode]);

// [label, fgPath, bgPath, threshold, kind]
const PAIRS = [
  ["heading on page", "text.heading", "surface.page", 4.5, "text"],
  ["heading on default", "text.heading", "surface.default", 4.5, "text"],
  ["default on page", "text.default", "surface.page", 4.5, "text"],
  ["default on default", "text.default", "surface.default", 4.5, "text"],
  ["default on subtle", "text.default", "surface.subtle", 4.5, "text"],
  ["muted on page", "text.muted", "surface.page", 4.5, "text"],
  ["muted on default", "text.muted", "surface.default", 4.5, "text"],
  ["muted on subtle", "text.muted", "surface.subtle", 4.5, "text"],
  ["link on page", "text.link", "surface.page", 4.5, "text"],
  ["link on default", "text.link", "surface.default", 4.5, "text"],
  ["placeholder on default", "text.placeholder", "surface.default", 4.5, "text"],
  ["placeholder on page", "text.placeholder", "surface.page", 4.5, "text"],
  ["success.text on surface", "feedback.success.text", "feedback.success.surface", 4.5, "text"],
  ["warning.text on surface", "feedback.warning.text", "feedback.warning.surface", 4.5, "text"],
  ["error.text on surface", "feedback.error.text", "feedback.error.surface", 4.5, "text"],
  ["info.text on surface", "feedback.info.text", "feedback.info.surface", 4.5, "text"],
  ["success.onSolid on solid", "feedback.success.onSolid", "feedback.success.solid", 4.5, "text"],
  ["warning.onSolid on solid", "feedback.warning.onSolid", "feedback.warning.solid", 4.5, "text"],
  ["error.onSolid on solid", "feedback.error.onSolid", "feedback.error.solid", 4.5, "text"],
  ["info.onSolid on solid", "feedback.info.onSolid", "feedback.info.solid", 4.5, "text"],
  ["onPrimary on primary", "action.onPrimary", "action.primary", 4.5, "text"],
  ["onDanger on danger", "action.onDanger", "action.danger", 4.5, "text"],
  ["aaaText on aaaSurface", "accent.aaaText", "accent.aaaSurface", 4.5, "text"],
  ["onAaa on aaaSolid", "accent.onAaa", "accent.aaaSolid", 4.5, "text"],
  ["cyan accent on default", "accent.cyan", "surface.default", 4.5, "text"],
  ["cyan accent on page", "accent.cyan", "surface.page", 4.5, "text"],
  ["selected.text on surface", "selected.text", "selected.surface", 4.5, "text"],
  ["control border on default", "border.control", "surface.default", 3.0, "control"],
  ["control hover border on default", "border.controlHover", "surface.default", 3.0, "control"],
  ["control hover border on page", "border.controlHover", "surface.page", 3.0, "control"],
  ["control border on page", "border.control", "surface.page", 3.0, "control"],
  ["error border on default", "border.error", "surface.default", 3.0, "control"],
  ["error border on page", "border.error", "surface.page", 3.0, "control"],
  ["disabled text on disabledBg", "action.disabled", "action.disabledBg", 4.5, "exempt"],
  ["focus border on default", "border.focus", "surface.default", 3.0, "focus"],
  ["focusRing on page", "action.focusRing", "surface.page", 3.0, "focus"],
  ["primary on page (accent)", "action.primary", "surface.page", 3.0, "ui"],
  ["border.default on default", "border.default", "surface.default", 3.0, "decorative"],
  ["border.strong on default", "border.strong", "surface.default", 3.0, "decorative"],
];

let failures = 0;
for (const mode of ["light", "dark"]) {
  console.log(`\n== ${mode} ==`);
  for (const [label, fg, bg, th, kind] of PAIRS) {
    const r = ratio(get(mode, fg), get(mode, bg));
    const advisory = kind === "decorative" || kind === "exempt";
    const ok = r >= th;
    if (!ok && !advisory) failures++;
    const tag = ok ? "PASS" : (advisory ? "ADV " : "FAIL");
    console.log(`${tag} ${r.toFixed(2).padStart(6)} (>=${th}) ${kind.padEnd(11)} ${label}`);
  }
}
// Usage check. The value checks above cannot see which token a component actually
// binds to, and that is exactly how checkbox, radio and the switch track shipped on
// border.strong (1.48:1 in light) while every value check still passed. border.strong
// is decorative-only: dividers, card edges, hover accents on non-controls. Anything
// that is the visible boundary of a control must use border.control / controlHover.
const factory = join(root, 'mui', 'options.mjs');
let usageFailures = 0;
try {
  const src = readFileSync(factory, 'utf8');
  const offenders = src
    .split('\n')
    .map((line, i) => [i + 1, line])
    .filter(([, line]) => /border\.strong/.test(line));
  console.log('\n== usage ==');
  if (offenders.length) {
    usageFailures = offenders.length;
    for (const [n, line] of offenders) {
      console.log(`FAIL mui/options.mjs:${n} uses border.strong on a component. Use border.control (or border.controlHover for hover).`);
      console.log(`     ${line.trim().slice(0, 110)}`);
    }
  } else {
    console.log('PASS   no component in the MUI factory binds border.strong');
  }
} catch {
  console.log('\n== usage ==\nSKIP   mui/options.mjs not found');
}

const total = failures + usageFailures;
console.log(`\n${failures} required contrast failure(s), ${usageFailures} usage failure(s).`);
process.exit(total > 0 ? 1 : 0);
