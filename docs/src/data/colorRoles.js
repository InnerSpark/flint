// How each semantic color is used, so the Color page can show it in use and measure it against the
// color it actually meets. Derived from the token names; the few that don't follow a pattern are listed.
import { resolved, source, at, refName, cssVarForPath, ratio } from '../lib/flint.js';

const has = (path) => at(resolved.semantic.light, path.split('.')) !== undefined;

/** The ten roles most UI is built from. Shown as large specimen cards above the full reference. */
export const CORE = ['text.heading', 'text.default', 'text.muted', 'text.link', 'surface.default', 'surface.subtle', 'surface.inverse', 'action.primary', 'action.danger', 'border.control'];

/** One line on what each core role is for. */
export const CORE_USE = {
  'text.heading': 'Page and section headings.',
  'text.default': 'Body text and icons.',
  'text.muted': 'Secondary text: captions, help, timestamps.',
  'text.link': 'Links in running text. Always underlined.',
  'surface.default': 'Cards, inputs and the main canvas.',
  'surface.subtle': 'Tinted areas and hover fills.',
  'surface.inverse': 'Navy bands and footers.',
  'action.primary': 'The one main action in a view.',
  'action.danger': 'Destructive actions only.',
  'border.control': 'Edges of inputs and controls.',
};

// Fills carry a label; the label color is what gets measured.
const FILL_LABEL = {
  'action.primary': 'action.onPrimary', 'action.primaryHover': 'action.onPrimary', 'action.primaryPressed': 'action.onPrimary',
  'action.danger': 'action.onDanger', 'action.dangerHover': 'action.onDanger', 'action.dangerPressed': 'action.onDanger',
  'action.disabledBg': 'action.disabled', 'accent.aaaSolid': 'accent.onAaa',
};
const ON_FILL = {
  'action.onPrimary': 'action.primary', 'action.onDanger': 'action.danger', 'action.disabled': 'action.disabledBg', 'accent.onAaa': 'accent.aaaSolid',
  'text.inverse': 'surface.inverse', 'text.inverseMuted': 'surface.inverse', 'text.onCode': 'surface.code', 'accent.aaaText': 'accent.aaaSurface',
};
const SURFACE_TEXT = { 'surface.inverse': 'text.inverse', 'surface.code': 'text.onCode', 'accent.aaaSurface': 'accent.aaaText' };

/**
 * kind: text (a color used for text, shown on what it sits on), surface (a background, shown with its
 * text), fill (a button fill with its label), border (an edge), ring (the focus ring), mark (a chart
 * mark), scrim (the overlay), disabled (a disabled button), accent (decorative shapes). pair: the other token in the measurement. fg/bg: which is which.
 */
export function roleOf(p) {
  const path = p.join('.');
  const k = p.at(-1);
  const sib = (n) => [...p.slice(0, -1), n].join('.');
  if (path === 'overlayScrim') return { kind: 'scrim', pair: 'surface.default' };
  // Disabled colors are shown on a real disabled button: WCAG 1.4.3 exempts inactive controls.
  if (path === 'action.disabled') return { kind: 'disabled', fg: path, bg: 'action.disabledBg', pair: 'action.disabledBg' };
  if (path === 'action.disabledBg') return { kind: 'disabled', fg: 'action.disabled', bg: path, pair: 'action.disabled' };
  // A decorative accent, never text: shown as shapes, measured on the page for the record.
  if (path === 'action.secondary') return { kind: 'accent', fg: path, bg: 'surface.default', pair: 'surface.default' };
  if (path === 'action.focusRing') return { kind: 'ring', fg: path, bg: 'surface.default', pair: 'surface.default' };
  if (p[0] === 'border') return { kind: 'border', fg: path, bg: 'surface.default', pair: 'surface.default' };
  if (p[0] === 'chart') return { kind: 'mark', fg: path, bg: 'surface.default', pair: 'surface.default' };
  if (FILL_LABEL[path]) return { kind: 'fill', fg: FILL_LABEL[path], bg: path, pair: FILL_LABEL[path] };
  if (k === 'solid') return { kind: 'fill', fg: sib('onSolid'), bg: path, pair: sib('onSolid') };
  if (k === 'border') return { kind: 'border', fg: path, bg: sib('surface'), pair: sib('surface') };
  if (SURFACE_TEXT[path]) return { kind: 'surface', fg: SURFACE_TEXT[path], bg: path, pair: SURFACE_TEXT[path] };
  if (k === 'surface' && p.length > 1 && has(sib('text'))) return { kind: 'surface', fg: sib('text'), bg: path, pair: sib('text') };
  if (p[0] === 'surface') return { kind: 'surface', fg: 'text.default', bg: path, pair: 'text.default' };
  if (ON_FILL[path]) return { kind: 'text', fg: path, bg: ON_FILL[path], pair: ON_FILL[path] };
  if (k === 'onSolid') return { kind: 'text', fg: path, bg: sib('solid'), pair: sib('solid') };
  if (has(sib('surface'))) return { kind: 'text', fg: path, bg: sib('surface'), pair: sib('surface') };
  return { kind: 'text', fg: path, bg: 'surface.default', pair: 'surface.default' };
}

export const varOf = (path) => cssVarForPath(`semantic.${path}`);

/** Everything the page shows for one semantic color, in both modes. */
export function specFor(p) {
  const path = p.join('.');
  const role = roleOf(p);
  const val = (mode, q) => at(resolved.semantic[mode], q.split('.'));
  const modes = ['light', 'dark'].map((mode) => ({
    mode,
    hex: val(mode, path),
    ref: (refName(at(source.semantic[mode], p)) || 'literal').replace(/^color\./, ''),
    ratio: role.fg && role.bg ? ratio(val(mode, role.fg), val(mode, role.bg)) : null,
  }));
  const measured = role.kind === 'scrim' ? null
    : role.fg === path ? `on ${role.bg}` : `with ${role.fg} on it`;
  return { path, cssVar: varOf(path), role, modes, measured };
}
