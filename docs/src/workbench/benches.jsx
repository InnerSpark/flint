// What each bench shows: the states down the side, and how each implementation renders one cell.
// Forced rows use st-hover / st-focus (see forceStates.js). The Live row is real: use it with mouse and keyboard.
import MuiButton from '@mui/material/Button';
import MuiCheckbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import MuiLink from '@mui/material/Link';
import { Button as ShadButton } from './ui/button';
import { Checkbox as ShadCheckbox } from './ui/checkbox';
import { Input as ShadInput } from './ui/input';

export const IMPLEMENTATIONS = ['MUI', 'shadcn', 'Plain CSS'];

const BUTTON_STATES = [
  { label: 'Default', cls: '' },
  { label: 'Hover', cls: 'st-hover' },
  { label: 'Pressed', cls: 'st-active' },
  { label: 'Focus', cls: 'st-focus', note: 'keyboard focus' },
  { label: 'Disabled', disabled: true },
  { label: 'Busy', busy: true, note: 'aria-busy' },
  { label: 'Live', cls: '', note: 'try it' },
];

const BUTTON = {
  primary: { mui: { variant: 'contained' }, shad: 'default', plain: 'primary', label: 'Save trip' },
  secondary: { mui: { variant: 'outlined' }, shad: 'secondary', plain: 'secondary', label: 'Add stop' },
  danger: { mui: { variant: 'contained', color: 'error' }, shad: 'destructive', plain: 'danger', label: 'Delete trip' },
  text: { mui: { variant: 'text' }, shad: 'ghost', plain: 'text', label: 'Skip for now' },
};

const button = (variant) => ({
  states: BUTTON_STATES,
  render(impl, s) {
    const v = BUTTON[variant];
    const busy = s.busy ? { 'aria-busy': 'true', 'aria-disabled': 'true' } : {};
    if (impl === 'MUI') return <MuiButton {...v.mui} disableElevation className={s.cls} disabled={s.disabled} loading={s.busy || undefined}>{v.label}</MuiButton>;
    if (impl === 'shadcn') return <ShadButton variant={v.shad} className={s.cls} disabled={s.disabled} {...busy}>{v.label}</ShadButton>;
    return <button type="button" className={`flint-btn flint-btn--${v.plain} ${s.cls || ''}`} disabled={s.disabled} {...busy}>{v.label}</button>;
  },
});

const input = {
  states: [
    { label: 'Default', cls: '' },
    { label: 'Hover', cls: 'st-hover' },
    { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
    { label: 'Filled', cls: '', value: 'Turkey Bend' },
    { label: 'Error', cls: '', error: true, value: 'Turky Bend' },
    { label: 'Disabled', disabled: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const label = `Campsite name, ${impl}, ${s.label.toLowerCase()} state`;
    const invalid = s.error ? 'true' : undefined;
    if (impl === 'MUI') {
      // MUI draws focus from its Mui-focused class, so the forced Focus row sets it.
      return <OutlinedInput placeholder="Campsite name" disabled={s.disabled} defaultValue={s.value} error={!!s.error} fullWidth
        className={`${s.cls || ''} ${s.focus ? 'Mui-focused' : ''}`} inputProps={{ 'aria-label': label, 'aria-invalid': invalid, className: s.focus ? 'st-focus' : undefined }} />;
    }
    const common = { placeholder: 'Campsite name', disabled: s.disabled, defaultValue: s.value, 'aria-label': label, 'aria-invalid': invalid };
    if (impl === 'shadcn') return <ShadInput {...common} className={s.cls} />;
    return <input type="text" {...common} className={`flint-input ${s.cls || ''}`} />;
  },
};

const checkbox = {
  states: [
    { label: 'Unchecked', cls: '' },
    { label: 'Checked', cls: '', checked: true },
    { label: 'Hover', cls: 'st-hover' },
    { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
    { label: 'Disabled', disabled: true },
    { label: 'Disabled, checked', disabled: true, checked: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const name = `Bring the awning lights, ${impl}, ${s.label.toLowerCase()} state`;
    const text = <span>Bring the awning lights</span>;
    if (impl === 'MUI') {
      // MUI shows keyboard focus with its Mui-focusVisible class on the root.
      return <label className="tb-cell"><MuiCheckbox defaultChecked={s.checked} disabled={s.disabled} className={`${s.cls || ''} ${s.focus ? 'Mui-focusVisible' : ''}`}
        inputProps={{ 'aria-label': name, className: s.focus ? 'st-focus' : undefined }} />{text}</label>;
    }
    if (impl === 'shadcn') return <label className="tb-cell"><ShadCheckbox defaultChecked={s.checked} disabled={s.disabled} className={s.cls} aria-label={name} />{text}</label>;
    return <label className="tb-cell"><input type="checkbox" className={`flint-check ${s.cls || ''}`} defaultChecked={s.checked} disabled={s.disabled} aria-label={name} />{text}</label>;
  },
};

const LINK_SHAD = 'text-[var(--link-fg)] underline decoration-from-font underline-offset-[0.15em] hover:decoration-[0.125em] rounded-[var(--radius-xs)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]';
const link = {
  states: [
    { label: 'Default', cls: '' },
    { label: 'Hover', cls: 'st-hover' },
    { label: 'Focus', cls: 'st-focus', note: 'keyboard focus' },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const props = { href: '/components/link/', 'aria-label': `Review the route, ${impl}, ${s.label.toLowerCase()} state` };
    if (impl === 'MUI') return <MuiLink {...props} className={s.cls}>Review the route</MuiLink>;
    if (impl === 'shadcn') return <a {...props} className={`${LINK_SHAD} ${s.cls || ''}`}>Review the route</a>;
    return <a {...props} className={`flint-link ${s.cls || ''}`}>Review the route</a>;
  },
};

const field = {
  states: [
    { label: 'With helper', cls: '' },
    { label: 'Required', cls: '', required: true },
    { label: 'Error', cls: '', required: true, error: true, value: 'example' },
    { label: 'Disabled', disabled: true },
  ],
  render(impl, s) {
    const id = `fld-${impl.replace(/\W/g, '')}-${s.label.replace(/\W/g, '').toLowerCase()}`;
    const msg = s.error ? 'Enter a full address that starts with https://' : 'The page the crawl starts from.';
    const msgId = `${id}-msg`;
    if (impl === 'MUI') return <TextField id={id} label="Start URL" size="small" required={s.required} error={!!s.error} disabled={s.disabled} defaultValue={s.value} helperText={msg} fullWidth />;
    const req = s.required ? <span className={impl === 'shadcn' ? 'font-normal text-[var(--field-helper-fg)]' : 'flint-field__required'}> (required)</span> : null;
    const common = { id, type: 'url', required: s.required, disabled: s.disabled, defaultValue: s.value, 'aria-invalid': s.error ? 'true' : undefined, 'aria-describedby': msgId };
    if (impl === 'shadcn') {
      return <div className="grid gap-1"><label htmlFor={id} className="text-sm font-semibold text-[var(--field-label-fg)]">Start URL{req}</label>
        <ShadInput {...common} /><p id={msgId} className={s.error ? 'text-xs font-semibold text-[var(--field-error-fg)]' : 'text-xs text-[var(--field-helper-fg)]'}>{msg}</p></div>;
    }
    return <div className="flint-field"><label className="flint-field__label" htmlFor={id}>Start URL{req}</label>
      <input className="flint-input" {...common} /><span id={msgId} className={s.error ? 'flint-field__error' : 'flint-field__helper'}>{msg}</span></div>;
  },
};

export const BENCHES = {
  'button/primary': button('primary'),
  'button/secondary': button('secondary'),
  'button/danger': button('danger'),
  'button/text': button('text'),
  'input/text': input,
  'checkbox/default': checkbox,
  'link/inline': link,
  'field/default': field,
};
