/**
 * Smoke test for @innerspark/flint/react: render each component on the server and check it puts out the
 * components.css classes and the ARIA the docs promise. The browser checks (axe, keyboard) run in the
 * docs workbench, which has a Flint React column.
 */
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as F from './dist/index.js';

let failures = 0;
const check = (name, el, ...expect) => {
  const html = renderToStaticMarkup(el);
  const missing = expect.filter((e) => !html.includes(e));
  console.log(`${missing.length ? 'FAIL' : 'PASS'}  ${name}${missing.length ? `: missing ${missing.join(', ')}\n      ${html}` : ''}`);
  failures += missing.length ? 1 : 0;
};

check('Button', h(F.Button, { variant: 'secondary' }, 'Add stop'), 'class="flint-btn flint-btn--secondary"', 'type="button"');
check('Button busy', h(F.Button, { busy: true }, 'Saving'), 'aria-busy="true"', 'aria-disabled="true"');
check('Button small icon', h(F.Button, { size: 'sm', iconOnly: true, 'aria-label': 'Add' }), 'flint-btn--sm', 'flint-btn--icon');
check('Link new tab', h(F.Link, { href: '/x', target: '_blank' }, 'Rules'), 'class="flint-link"', '(opens in a new tab)');
check('Field with error', h(F.Field, { label: 'Start URL', helper: 'Full address', error: 'Start with https://', required: true }, h(F.Input, { type: 'url' })),
  'class="flint-field"', '(required)', 'aria-invalid="true"', 'required=""', '-error', 'aria-describedby=', 'class="flint-field__error"');
check('Textarea', h(F.Textarea), 'class="flint-input"', 'rows="3"');
check('Select', h(F.Select, { 'aria-label': 'Standard' }, h('option', null, 'AA')), 'class="flint-select"');
check('Checkbox', h(F.Checkbox, { label: 'Lights' }), 'class="flint-choice"', 'class="flint-check"', 'Lights');
check('RadioGroup', h(F.RadioGroup, { legend: 'Scope' }, h(F.Radio, { label: 'Page' }), h(F.Radio, { label: 'Site' })), '<fieldset class="flint-fieldset">', 'flint-fieldset__legend', 'class="flint-radio" name="flint-radio-');
check('Switch', h(F.Switch, { label: 'Weekly summary' }), 'role="switch"', 'class="flint-switch"');
check('Badge', h(F.Badge, { intent: 'success' }, 'Passed'), 'class="flint-badge flint-badge--success"');
check('Chip removable', h(F.Chip, { intent: 'error', onRemove: () => {} }, 'Failed only'), 'flint-chip--error', 'aria-label="Remove Failed only"');
check('Alert', h(F.Alert, { intent: 'warning', title: 'Review' }, 'Check these'), 'flint-alert--warning', 'flint-alert__title', 'aria-hidden="true"');
check('SkipLink', h(F.SkipLink, { href: '#main' }), 'class="flint-skip-link"', 'href="#main"', 'Skip to content');
check('Icon decorative', h(F.Icon, null, h('path', { d: 'M0 0' })), 'class="flint-icon"', 'aria-hidden="true"');
check('Icon meaningful', h(F.Icon, { label: 'Passed', size: 'lg' }), 'role="img"', 'aria-label="Passed"', 'flint-icon--lg');
check('Tabs', h(F.Tabs, { defaultValue: 'a' }, h(F.TabList, { 'aria-label': 'Trip' }, h(F.Tab, { value: 'a' }, 'Route'), h(F.Tab, { value: 'b' }, 'Packing')), h(F.TabPanel, { value: 'a' }, 'A'), h(F.TabPanel, { value: 'b' }, 'B')),
  'class="flint-tabs"', 'role="tablist"', 'class="flint-tabs__tab"', 'aria-selected="true"', 'class="flint-tabs__panel"', 'data-state="inactive"');
check('Toast', h(F.ToastProvider, null, h(F.Toast, { open: true, title: 'Report saved', action: { label: 'Undo' } }), h(F.ToastRegion)), 'flint-toast-region');

console.log(`\n${failures} React failure(s).`);
process.exit(failures ? 1 : 0);
