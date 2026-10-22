// What each bench shows: the states down the side, and how each implementation renders one cell.
// Forced rows use st-hover / st-focus (see forceStates.js). The Live row is real: use it with mouse and keyboard.
import MuiButton from '@mui/material/Button';
import MuiCheckbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Button as ShadButton } from './ui/button';
import { Checkbox as ShadCheckbox } from './ui/checkbox';
import { Input as ShadInput } from './ui/input';

export const IMPLEMENTATIONS = ['MUI', 'shadcn', 'Plain CSS'];

const BUTTON_STATES = [
  { label: 'Default', cls: '' },
  { label: 'Hover', cls: 'st-hover' },
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

export const BENCHES = {
  'button/primary': button('primary'),
  'button/secondary': button('secondary'),
  'button/danger': button('danger'),
  'button/text': button('text'),
  'input/text': input,
  'checkbox/default': checkbox,
};
