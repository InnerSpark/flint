// Each component's states, as the real components.css markup. The States section renders every state in a
// light and a dark panel (data-theme), so the component's own tokens show in use. Hover, pressed and
// focus use the workbench's forced-state classes (st-hover, st-active, st-focus). "__P__" keeps ids
// unique per panel. `reads` names the tokens the state changes, so the row ties back to the table below.
const x = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const err = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const icon = (d) => `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const buttons = (extra = '', attrs = '') => ['primary', 'secondary', 'danger', 'text']
  .map((v) => `<button type="button" class="flint-btn flint-btn--${v} ${extra}" ${attrs}>${{ primary: 'Save', secondary: 'Add stop', danger: 'Delete', text: 'Skip' }[v]}</button>`).join('');
const input = (attrs = '', cls = '') => `<input class="flint-input ${cls}" type="text" aria-label="Campsite" ${attrs} />`;
const choice = (type, attrs = '', cls = '', label = 'Bring the lights') =>
  `<label class="flint-choice"><input type="checkbox" class="${type} ${cls}" ${attrs} /> ${label}</label>`;
const radio = (attrs = '', cls = '') => `<label class="flint-choice"><input type="radio" name="r-__P__" class="flint-radio ${cls}" ${attrs} /> Whole site</label>`;
const sw = (attrs = '', cls = '') => `<label class="flint-choice"><input type="checkbox" role="switch" class="flint-switch ${cls}" ${attrs} /> Weekly summary</label>`;
const select = (attrs = '', cls = '') => `<select class="flint-select ${cls}" aria-label="Standard" ${attrs}><option>WCAG 2.2 AA</option></select>`;

const dialogPanel = `<div class="flint-dialog"><div class="flint-dialog__header"><p class="flint-dialog__title">Delete this trip?</p><button type="button" class="flint-btn flint-btn--text flint-btn--icon" aria-label="Close">${x}</button></div><div class="flint-dialog__body"><p>The route and packing list go with it.</p></div><div class="flint-dialog__footer"><button type="button" class="flint-btn flint-btn--secondary flint-btn--sm">Keep trip</button><button type="button" class="flint-btn flint-btn--danger flint-btn--sm">Delete trip</button></div></div>`;
const tabsRow = (hover = -1, focus = -1) => `<div class="flint-tabs__list" role="tablist" aria-label="Trip">${['Route', 'Packing', 'Sites'].map((t, i) => `<button type="button" role="tab" class="flint-tabs__tab ${i === hover ? 'st-hover' : ''} ${i === focus ? 'st-focus' : ''}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>`;
const menuList = (cls = ['', '', '']) => `<ul class="flint-menu" role="menu" aria-label="Trip actions"><li role="none"><button type="button" role="menuitem" class="flint-menu__item ${cls[0]}">Rename</button></li><li role="none"><button type="button" role="menuitem" class="flint-menu__item ${cls[1]}">Duplicate</button></li><li role="separator" class="flint-menu__separator"></li><li role="none"><button type="button" role="menuitem" class="flint-menu__item flint-menu__item--danger ${cls[2]}">Delete trip</button></li></ul>`;
const toast = (action, focus) => `<div class="flint-toast"><p class="flint-toast__title">${action ? 'Trip archived' : 'Report saved'}</p><p class="flint-toast__body">${action ? 'Turkey Bend moved to Archive.' : 'Your VPAT draft is in Reports.'}</p>${action ? `<div class="flint-toast__actions"><button type="button" class="flint-toast__action ${focus ? 'st-focus' : ''}">Undo</button></div>` : ''}<button type="button" class="flint-toast__close" aria-label="Dismiss">${x}</button></div>`;

export const STATES = {
  button: [
    ['Default', 'button.*.bg, fg, border', buttons()],
    ['Hover', 'button.*.bgHover', buttons('st-hover')],
    ['Pressed', 'button.primary.bgPressed, danger.bgPressed', buttons('st-active')],
    ['Focus', 'focus.ring.*', buttons('st-focus')],
    ['Disabled', 'button.disabled.*', buttons('', 'disabled')],
  ],
  link: [
    ['Default', 'link.fg', '<p>Trip saved. <a class="flint-link" href="#">Review the route</a></p>'],
    ['Hover', 'link.fg, thicker underline', '<p>Trip saved. <a class="flint-link st-hover" href="#">Review the route</a></p>'],
    ['Focus', 'focus.ring.*', '<p>Trip saved. <a class="flint-link st-focus" href="#">Review the route</a></p>'],
  ],
  field: [
    ['Default', 'field.labelFg, helperFg', `<div class="flint-field"><label class="flint-field__label" for="f1-__P__">Site name <span class="flint-field__required">(required)</span></label>${input('id="f1-__P__"').replace(' aria-label="Campsite"', '')}<span class="flint-field__helper">Shown on your report cover.</span></div>`],
    ['Error', 'field.errorFg, input.borderError', `<div class="flint-field"><label class="flint-field__label" for="f2-__P__">Start URL</label>${input('id="f2-__P__" value="example" aria-invalid="true"').replace(' aria-label="Campsite"', '')}<span class="flint-field__error">${err}Start with https://</span></div>`],
  ],
  input: [
    ['Default', 'input.bg, border, fg, placeholder', input('placeholder="Turkey Bend"')],
    ['Hover', 'input.borderHover', input('placeholder="Turkey Bend"', 'st-hover')],
    ['Focus', 'input.borderFocus, focus.ring.*', input('value="Turkey Bend"', 'st-focus')],
    ['Error', 'input.borderError', input('value="zero" aria-invalid="true"')],
    ['Read-only', 'input.bgReadOnly', input('value="TRP-2042" readonly')],
    ['Disabled', 'action.disabled, disabledBg', input('value="Turkey Bend" disabled')],
  ],
  checkbox: [
    ['Unchecked', 'checkbox.border', choice('flint-check')],
    ['Checked', 'checkbox.checkedBg, checkedFg', choice('flint-check', 'checked')],
    ['Indeterminate', 'checkbox.checkedBg, checkedFg', choice('flint-check', 'data-indeterminate', '', 'All camp gear')],
    ['Hover', 'checkbox.borderHover', choice('flint-check', '', 'st-hover')],
    ['Focus', 'focus.ring.*', choice('flint-check', 'checked', 'st-focus')],
    ['Error', 'checkbox.borderError', choice('flint-check', 'aria-invalid="true"')],
    ['Disabled', 'checkbox.disabled, disabledBg', choice('flint-check', 'disabled') + choice('flint-check', 'disabled checked')],
  ],
  radio: [
    ['Unselected', 'radio.border', radio()],
    ['Selected', 'radio.checkedBg, checkedFg', radio('checked')],
    ['Hover', 'radio.borderHover', radio('', 'st-hover')],
    ['Focus', 'focus.ring.*', radio('checked', 'st-focus')],
    ['Error', 'radio.borderError', radio('aria-invalid="true"')],
    ['Disabled', 'radio.disabled, disabledBg', radio('disabled')],
  ],
  switch: [
    ['Off', 'switch.track, thumb', sw()],
    ['On', 'switch.trackChecked, thumbChecked', sw('checked')],
    ['Focus', 'focus.ring.*', sw('checked', 'st-focus')],
    ['Disabled', 'switch.trackDisabled, thumbDisabled', sw('disabled') + sw('disabled checked')],
  ],
  select: [
    ['Default', 'select.bg, border, fg, icon', select()],
    ['Hover', 'select.borderHover', select('', 'st-hover')],
    ['Focus', 'select.borderFocus, focus.ring.*', select('', 'st-focus')],
    ['Error', 'select.borderError', select('aria-invalid="true"')],
    ['Disabled', 'action.disabled, disabledBg', select('disabled')],
  ],
  badge: [
    ['Intents', 'badge.*.bg, fg', ['', 'success', 'warning', 'error', 'info'].map((t, i) => `<span class="flint-badge ${t ? `flint-badge--${t}` : ''}">${['Draft', 'Passed', 'Review', 'Failed', 'New'][i]}</span>`).join('')],
  ],
  chip: [
    ['Filled', 'chip.*.bg, fg', ['', 'success', 'error', 'info'].map((t) => `<span class="flint-chip ${t ? `flint-chip--${t}` : ''}">${t || 'Mobile'}</span>`).join('')],
    ['Outlined', 'chip.*.border, fg', ['', 'success', 'error'].map((t) => `<span class="flint-chip flint-chip--outlined ${t ? `flint-chip--${t}` : ''}">${t || 'Mobile'}</span>`).join('')],
    ['Removable', 'chip.*, focus.ring.*', `<span class="flint-chip">WCAG 2.2<button type="button" class="flint-chip__remove" aria-label="Remove WCAG 2.2">${x}</button></span><span class="flint-chip">Focused<button type="button" class="flint-chip__remove st-focus" aria-label="Remove Focused">${x}</button></span>`],
  ],
  alert: [
    ['Info', 'feedback.info.*', `<div class="flint-alert">${icon('M10 9v5')}<p class="flint-alert__title">Scan scheduled</p><p class="flint-alert__body">We'll email you.</p></div>`],
    ['Success', 'feedback.success.*', `<div class="flint-alert flint-alert--success">${icon('M6.5 10.5l2.5 2.5 4.5-5')}<p class="flint-alert__title">Report saved</p><p class="flint-alert__body">It's in Reports.</p></div>`],
    ['Warning', 'feedback.warning.*', `<div class="flint-alert flint-alert--warning">${icon('M10 8v4')}<p class="flint-alert__title">12 checks need a person</p><p class="flint-alert__body">Review before export.</p></div>`],
    ['Error', 'feedback.error.*', `<div class="flint-alert flint-alert--error">${icon('M7 7l6 6M13 7l-6 6')}<p class="flint-alert__title">Couldn't reach the site</p><p class="flint-alert__body">Check the address.</p></div>`],
  ],
  dialog: [
    ['Open', 'dialog.bg, border, titleFg, fg, radius', dialogPanel],
  ],
  tabs: [
    ['Default', 'tabs.fg, fgSelected, indicator, border', tabsRow()],
    ['Hover', 'tabs.fgHover, bgHover', tabsRow(1)],
    ['Focus', 'focus.ring.*', tabsRow(-1, 0)],
  ],
  menu: [
    ['Open', 'menu.bg, fg, border, itemFgDanger', menuList()],
    ['Item hover', 'menu.itemBgHover', menuList(['', 'st-hover', ''])],
    ['Item focus', 'menu.itemBgHover, focus.ring.*', menuList(['', '', 'st-focus'])],
  ],
  tooltip: [
    ['Shown', 'tooltip.bg, fg, radius', '<span class="flint-tooltip-anchor"><button type="button" class="flint-btn flint-btn--secondary flint-btn--sm" aria-describedby="tip-__P__">Export</button><span class="flint-tooltip" role="tooltip" id="tip-__P__">PDF, about 2 MB</span></span>'],
  ],
  toast: [
    ['Message', 'toast.bg, fg, fgMuted, radius', toast(false)],
    ['With an action', 'toast.fg, focusRing', toast(true, true)],
  ],
  'skip-link': [
    ['Focused', 'skipLink.bg, fg, focus.ring.*', '<a class="flint-skip-link st-focus" href="#tokens">Skip to content</a>'],
  ],
  icon: [
    ['Sizes', 'icon.sm, md, lg, fg', ['flint-icon--sm', '', 'flint-icon--lg'].map((c) => `<svg class="flint-icon ${c}" viewBox="0 0 20 20" aria-hidden="true" focusable="false">${icon('M6.5 10.5l2.5 2.5 4.5-5').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`).join('')],
    ['Muted', 'icon.fgMuted', `<span class="flint-choice"><svg class="flint-icon flint-icon--muted" viewBox="0 0 20 20" aria-hidden="true" focusable="false">${icon('M10 6v4l3 2').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg> 2 hours ago</span>`],
  ],
};
