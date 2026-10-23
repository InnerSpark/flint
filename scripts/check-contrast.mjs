/**
 * WCAG contrast guard for Flint semantic tokens. Reads tokens.json and checks every
 * meaningful pairing in both light and dark. Exits non-zero on a required failure so
 * the build fails before a bad token ships.
 *
 * Policy notes:
 *  - text and on-solid pairs: 7:1 (WCAG 1.4.6 AAA). Flint's internal bar since v1.9.0
 *    (ASDS-23). The published conformance claim stays WCAG 2.2 AA; AAA is not a claim.
 *  - placeholder: 7:1 on input surfaces (default, page). Inputs render there, not on
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
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveTokens } from './resolve.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = resolveTokens(JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8')));

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };
// Paths starting with "component." read the component tier; everything else reads semantic.
const get = (mode, path) => path.startsWith('component.')
  ? path.slice(10).split('.').reduce((o, k) => o[k], tokens.component[mode])
  : path.split('.').reduce((o, k) => o[k], tokens.semantic[mode]);

// Text pairs must clear AAA. Non-text (1.4.11) has no AAA tier and stays at 3:1.
const AAA_TEXT = 7;

// [label, fgPath, bgPath, threshold, kind]
const PAIRS = [
  ["heading on page", "text.heading", "surface.page", AAA_TEXT, "text"],
  ["heading on default", "text.heading", "surface.default", AAA_TEXT, "text"],
  ["default on page", "text.default", "surface.page", AAA_TEXT, "text"],
  ["default on default", "text.default", "surface.default", AAA_TEXT, "text"],
  ["default on subtle", "text.default", "surface.subtle", AAA_TEXT, "text"],
  ["muted on page", "text.muted", "surface.page", AAA_TEXT, "text"],
  ["muted on default", "text.muted", "surface.default", AAA_TEXT, "text"],
  ["muted on subtle", "text.muted", "surface.subtle", AAA_TEXT, "text"],
  ["link on page", "text.link", "surface.page", AAA_TEXT, "text"],
  ["link on default", "text.link", "surface.default", AAA_TEXT, "text"],
  ["placeholder on default", "text.placeholder", "surface.default", AAA_TEXT, "text"],
  ["placeholder on page", "text.placeholder", "surface.page", AAA_TEXT, "text"],
  ["success.text on surface", "feedback.success.text", "feedback.success.surface", AAA_TEXT, "text"],
  ["warning.text on surface", "feedback.warning.text", "feedback.warning.surface", AAA_TEXT, "text"],
  ["error.text on surface", "feedback.error.text", "feedback.error.surface", AAA_TEXT, "text"],
  ["info.text on surface", "feedback.info.text", "feedback.info.surface", AAA_TEXT, "text"],
  ["success.onSolid on solid", "feedback.success.onSolid", "feedback.success.solid", AAA_TEXT, "text"],
  ["warning.onSolid on solid", "feedback.warning.onSolid", "feedback.warning.solid", AAA_TEXT, "text"],
  ["error.onSolid on solid", "feedback.error.onSolid", "feedback.error.solid", AAA_TEXT, "text"],
  ["info.onSolid on solid", "feedback.info.onSolid", "feedback.info.solid", AAA_TEXT, "text"],
  ["onPrimary on primary", "action.onPrimary", "action.primary", AAA_TEXT, "text"],
  ["onDanger on danger", "action.onDanger", "action.danger", AAA_TEXT, "text"],
  ["aaaText on aaaSurface", "accent.aaaText", "accent.aaaSurface", AAA_TEXT, "text"],
  ["onAaa on aaaSolid", "accent.onAaa", "accent.aaaSolid", AAA_TEXT, "text"],
  ["cyan accent on default", "accent.cyan", "surface.default", AAA_TEXT, "text"],
  ["cyan accent on page", "accent.cyan", "surface.page", AAA_TEXT, "text"],
  ["selected.text on surface", "selected.text", "selected.surface", AAA_TEXT, "text"],
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
  // chart colors (ASDS-40): marks must stand out from the surface they sit on (1.4.11)
  ...['1', '2', '3', '4', '5'].flatMap((n) => [
    [`chart.${n} on default`, `chart.${n}`, "surface.default", 3.0, "ui"],
    [`chart.${n} on page`, `chart.${n}`, "surface.page", 3.0, "ui"],
  ]),
  // component tier (ASDS-39): every label on its own fill, every control edge on its surface
  ["button primary label", "component.button.primary.fg", "component.button.primary.bg", AAA_TEXT, "text"],
  ["muted text on inverse", "text.inverseMuted", "surface.inverse", AAA_TEXT, "text"],
  ["input text read-only", "component.input.fg", "component.input.bgReadOnly", AAA_TEXT, "text"],
  ["field label on default", "component.field.labelFg", "surface.default", AAA_TEXT, "text"],
  ["field label on page", "component.field.labelFg", "surface.page", AAA_TEXT, "text"],
  ["field helper on default", "component.field.helperFg", "surface.default", AAA_TEXT, "text"],
  ["field helper on page", "component.field.helperFg", "surface.page", AAA_TEXT, "text"],
  ["field error on default", "component.field.errorFg", "surface.default", AAA_TEXT, "text"],
  ["field error on page", "component.field.errorFg", "surface.page", AAA_TEXT, "text"],
  ["link label on page", "component.link.fg", "surface.page", AAA_TEXT, "text"],
  ["link label on default", "component.link.fg", "surface.default", AAA_TEXT, "text"],
  ["link label on subtle", "component.link.fg", "surface.subtle", AAA_TEXT, "text"],
  ["button primary label pressed", "component.button.primary.fg", "component.button.primary.bgPressed", AAA_TEXT, "text"],
  ["button danger label pressed", "component.button.danger.fg", "component.button.danger.bgPressed", AAA_TEXT, "text"],
  ["button primary hover label", "component.button.primary.fg", "component.button.primary.bgHover", AAA_TEXT, "text"],
  ["button secondary label", "component.button.secondary.fg", "component.button.secondary.bg", AAA_TEXT, "text"],
  ["button secondary hover label", "component.button.secondary.fg", "component.button.secondary.bgHover", AAA_TEXT, "text"],
  ["button secondary edge", "component.button.secondary.border", "surface.page", 3.0, "control"],
  ["button danger label", "component.button.danger.fg", "component.button.danger.bg", AAA_TEXT, "text"],
  ["button danger hover label", "component.button.danger.fg", "component.button.danger.bgHover", AAA_TEXT, "text"],
  ["button text label", "component.button.text.fg", "surface.page", AAA_TEXT, "text"],
  ["button text hover label", "component.button.text.fg", "component.button.text.bgHover", AAA_TEXT, "text"],
  ["button disabled label", "component.button.disabled.fg", "component.button.disabled.bg", 4.5, "exempt"],
  ["input text", "component.input.fg", "component.input.bg", AAA_TEXT, "text"],
  ["input placeholder", "component.input.placeholder", "component.input.bg", AAA_TEXT, "text"],
  ["input edge", "component.input.border", "component.input.bg", 3.0, "control"],
  ["input hover edge", "component.input.borderHover", "component.input.bg", 3.0, "control"],
  ["input focus edge", "component.input.borderFocus", "component.input.bg", 3.0, "focus"],
  ["input error edge", "component.input.borderError", "component.input.bg", 3.0, "control"],
  ["checkbox edge", "component.checkbox.border", "surface.default", 3.0, "control"],
  ["checkbox checked fill", "component.checkbox.checkedBg", "surface.default", 3.0, "control"],
  ["checkbox check mark", "component.checkbox.checkedFg", "component.checkbox.checkedBg", 3.0, "ui"],
  ["radio edge", "component.radio.border", "surface.default", 3.0, "control"],
  ["radio hover edge", "component.radio.borderHover", "surface.default", 3.0, "control"],
  ["radio checked fill", "component.radio.checkedBg", "surface.default", 3.0, "control"],
  ["radio mark", "component.radio.checkedFg", "component.radio.checkedBg", 3.0, "ui"],
  ["radio disabled edge", "component.radio.disabled", "component.radio.disabledBg", 3.0, "exempt"],
  // Switch: the thumb is the only thing that shows state, so it needs 3:1 on its own track
  // in both positions. The checked pair is what caught the white-thumb bug (ASDS-45).
  ["switch thumb on track", "component.switch.thumb", "component.switch.track", 3.0, "control"],
  ["switch thumb on checked track", "component.switch.thumbChecked", "component.switch.trackChecked", 3.0, "control"],
  ["switch track on surface", "component.switch.track", "surface.default", 3.0, "control"],
  ["switch checked track on surface", "component.switch.trackChecked", "surface.default", 3.0, "control"],
  ["switch disabled thumb on track", "component.switch.thumb", "component.switch.trackDisabled", 3.0, "exempt"],
  ["select text", "component.select.fg", "component.select.bg", AAA_TEXT, "text"],
  ["select placeholder", "component.select.placeholder", "component.select.bg", AAA_TEXT, "text"],
  ["select icon", "component.select.icon", "component.select.bg", 3.0, "ui"],
  ["select edge", "component.select.border", "component.select.bg", 3.0, "control"],
  ["select hover edge", "component.select.borderHover", "component.select.bg", 3.0, "control"],
  ["select focus edge", "component.select.borderFocus", "component.select.bg", 3.0, "focus"],
  ["select error edge", "component.select.borderError", "component.select.bg", 3.0, "control"],
  ...["neutral", "success", "warning", "error", "info"].flatMap((t) => [
    [`chip ${t} label`, `component.chip.${t}.fg`, `component.chip.${t}.bg`, AAA_TEXT, "text"],
    [`chip ${t} edge`, `component.chip.${t}.border`, "surface.default", 3.0, "control"],
    [`badge ${t} label`, `component.badge.${t}.fg`, `component.badge.${t}.bg`, AAA_TEXT, "text"],
  ]),
  ["skip link label", "component.skipLink.fg", "component.skipLink.bg", AAA_TEXT, "text"],
  ["icon on default", "component.icon.fg", "surface.default", 3.0, "ui"],
  ["icon muted on default", "component.icon.fgMuted", "surface.default", 3.0, "ui"],
  ["focus ring on page", "component.focus.ring.color", "surface.page", 3.0, "focus"],
  ["focus ring on default", "component.focus.ring.color", "surface.default", 3.0, "focus"],
];

let failures = 0;
const results = [];
for (const mode of ["light", "dark"]) {
  console.log(`\n== ${mode} ==`);
  for (const [label, fg, bg, th, kind] of PAIRS) {
    const r = ratio(get(mode, fg), get(mode, bg));
    const advisory = kind === "decorative" || kind === "exempt";
    const ok = r >= th;
    if (!ok && !advisory) failures++;
    const tag = ok ? "PASS" : (advisory ? "ADV " : "FAIL");
    results.push({ mode, label, fg, bg, ratio: +r.toFixed(2), threshold: th, kind, pass: ok });
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

// Density invariant. Compact is allowed to tighten inset and gap, nothing else. Control
// sizes, icon sizes and targetMin must stay constant, so a denser layout can never shrink
// the touch target below WCAG 2.5.8. Pinning the allowed keys here stops a future density
// group from quietly introducing a smaller control or target.
const ALLOWED_DENSITY_KEYS = ['inset', 'gap'];
console.log('\n== density ==');
for (const [name, group] of Object.entries(tokens.density || {})) {
  const extra = Object.keys(group).filter((k) => !ALLOWED_DENSITY_KEYS.includes(k));
  if (extra.length) {
    usageFailures++;
    console.log(`FAIL density.${name} introduces ${extra.join(', ')}. Density may only vary ${ALLOWED_DENSITY_KEYS.join(' and ')}; control/icon/target sizes must stay constant.`);
  } else {
    console.log(`PASS   density.${name} varies only ${ALLOWED_DENSITY_KEYS.join(' + ')}`);
  }
}

// Contrast guarantees as data (ASDS-25): every checked pairing and its measured ratio, so the
// workbench and AI tools can trust a pairing without recomputing it.
writeFileSync(join(root, 'dist', 'contrast.json'), JSON.stringify({ standard: 'WCAG 2.2', textBar: AAA_TEXT, nonTextBar: 3, pairs: results }, null, 2) + '\n');

const total = failures + usageFailures;
console.log(`\n${failures} required contrast failure(s), ${usageFailures} usage failure(s).`);
process.exit(total > 0 ? 1 : 0);
