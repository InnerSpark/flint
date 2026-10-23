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
import { RadioGroup, RadioGroupItem } from './ui/radio';
import MuiRadio from '@mui/material/Radio';
import MuiSwitch from '@mui/material/Switch';
import NativeSelect from '@mui/material/NativeSelect';
import MuiChip from '@mui/material/Chip';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Switch as ShadSwitch } from './ui/switch';
import SvgIcon from '@mui/material/SvgIcon';

export const IMPLEMENTATIONS = ['MUI', 'shadcn', 'Plain CSS'];

const BUTTON_STATES = [
  { label: 'Default', cls: '' },
  { label: 'Hover', cls: 'st-hover' },
  { label: 'Pressed', cls: 'st-active' },
  { label: 'Focus', cls: 'st-focus', note: 'keyboard focus' },
  { label: 'Disabled', disabled: true },
  { label: 'Busy', busy: true, note: 'aria-busy' },
  { label: 'Small', small: true, note: 'button.heightSm' },
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
    if (impl === 'MUI') return <MuiButton {...v.mui} size={s.small ? 'small' : undefined} disableElevation className={s.cls} disabled={s.disabled} loading={s.busy || undefined}>{v.label}</MuiButton>;
    if (impl === 'shadcn') return <ShadButton variant={v.shad} size={s.small ? 'sm' : undefined} className={s.cls} disabled={s.disabled} {...busy}>{v.label}</ShadButton>;
    return <button type="button" className={`flint-btn flint-btn--${v.plain} ${s.small ? 'flint-btn--sm' : ''} ${s.cls || ''}`} disabled={s.disabled} {...busy}>{v.label}</button>;
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
    { label: 'Read-only', readOnly: true, value: 'Turkey Bend' },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const label = `Campsite name, ${impl}, ${s.label.toLowerCase()} state`;
    const invalid = s.error ? 'true' : undefined;
    if (impl === 'MUI') {
      // MUI draws focus from its Mui-focused class, so the forced Focus row sets it.
      return <OutlinedInput placeholder="Campsite name" disabled={s.disabled} defaultValue={s.value} error={!!s.error} fullWidth readOnly={s.readOnly}
        className={`${s.cls || ''} ${s.focus ? 'Mui-focused' : ''}`} inputProps={{ 'aria-label': label, 'aria-invalid': invalid, className: s.focus ? 'st-focus' : undefined }} />;
    }
    const common = { placeholder: 'Campsite name', disabled: s.disabled, readOnly: s.readOnly, defaultValue: s.value, 'aria-label': label, 'aria-invalid': invalid };
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
    { label: 'Indeterminate', mixed: true, note: 'some checked' },
    { label: 'Error', error: true, note: 'aria-invalid' },
    { label: 'Disabled', disabled: true },
    { label: 'Disabled, checked', disabled: true, checked: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const invalid = s.error ? 'true' : undefined;
    const name = `Bring the awning lights, ${impl}, ${s.label.toLowerCase()} state`;
    const text = <span>Bring the awning lights</span>;
    if (impl === 'MUI') {
      // MUI shows keyboard focus with its Mui-focusVisible class on the root.
      return <label className="tb-cell"><MuiCheckbox defaultChecked={s.checked} indeterminate={!!s.mixed} disabled={s.disabled} className={`${s.cls || ''} ${s.focus ? 'Mui-focusVisible' : ''}`}
        inputProps={{ 'aria-label': name, 'aria-invalid': invalid, className: s.focus ? 'st-focus' : undefined }} />{text}</label>;
    }
    if (impl === 'shadcn') return <label className="tb-cell"><ShadCheckbox defaultChecked={s.mixed ? 'indeterminate' : s.checked} disabled={s.disabled} className={s.cls} aria-label={name} aria-invalid={invalid} />{text}</label>;
    return <label className="tb-cell"><input type="checkbox" className={`flint-check ${s.cls || ''}`} defaultChecked={s.checked} disabled={s.disabled} aria-label={name} aria-invalid={invalid}
      ref={(el) => { if (el) el.indeterminate = !!s.mixed; }} />{text}</label>;
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

const radio = {
  states: [
    { label: 'Unselected', cls: '' },
    { label: 'Selected', cls: '', checked: true },
    { label: 'Hover', cls: 'st-hover' },
    { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
    { label: 'Error', error: true, note: 'aria-invalid' },
    { label: 'Disabled', disabled: true },
    { label: 'Disabled, selected', disabled: true, checked: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const key = `${impl}-${s.label}`.replace(/\W+/g, '-').toLowerCase();
    const name = `Just this page, ${impl}, ${s.label.toLowerCase()} state`;
    const invalid = s.error ? 'true' : undefined;
    const text = <span>Just this page</span>;
    if (impl === 'MUI') {
      return <label className="tb-cell"><MuiRadio name={key} value="page" defaultChecked={s.checked} disabled={s.disabled} className={`${s.cls || ''} ${s.focus ? 'Mui-focusVisible' : ''}`}
        inputProps={{ 'aria-label': name, 'aria-invalid': invalid, className: s.focus ? 'st-focus' : undefined }} />{text}</label>;
    }
    if (impl === 'shadcn') {
      return <RadioGroup name={key} defaultValue={s.checked ? 'page' : undefined} aria-label={`Scan scope, ${impl}, ${s.label.toLowerCase()} state`}>
        <label className="tb-cell"><RadioGroupItem value="page" disabled={s.disabled} className={s.cls} aria-label={name} aria-invalid={invalid} />{text}</label>
      </RadioGroup>;
    }
    return <label className="tb-cell"><input type="radio" name={key} className={`flint-radio ${s.cls || ''}`} defaultChecked={s.checked} disabled={s.disabled} aria-label={name} aria-invalid={invalid} />{text}</label>;
  },
};

const toggle = {
  states: [
    { label: 'Off', cls: '' },
    { label: 'On', cls: '', checked: true },
    { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
    { label: 'Disabled', disabled: true },
    { label: 'Disabled, on', disabled: true, checked: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const name = `Email me a weekly summary, ${impl}, ${s.label.toLowerCase()} state`;
    const text = <span>Email me a weekly summary</span>;
    if (impl === 'MUI') {
      return <label className="tb-cell"><MuiSwitch defaultChecked={s.checked} disabled={s.disabled} className={s.cls}
        slotProps={{ input: { role: 'switch', 'aria-label': name, className: s.focus ? 'st-focus' : undefined } }} classes={s.focus ? { switchBase: 'Mui-focusVisible' } : undefined} />{text}</label>;
    }
    if (impl === 'shadcn') return <label className="tb-cell"><ShadSwitch defaultChecked={s.checked} disabled={s.disabled} className={s.cls} aria-label={name} />{text}</label>;
    return <label className="tb-cell"><input type="checkbox" role="switch" className={`flint-switch ${s.cls || ''}`} defaultChecked={s.checked} disabled={s.disabled} aria-label={name} />{text}</label>;
  },
};

const SELECT_SHAD = 'h-[var(--select-height)] w-full text-[length:var(--font-size-md)] appearance-none rounded-[var(--select-radius)] border border-[var(--select-border)] bg-[var(--select-bg)] px-3 text-[var(--select-fg)] hover:border-[var(--select-border-hover)] outline-none focus-visible:border-[var(--select-border-focus)] focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] aria-[invalid=true]:border-[var(--select-border-error)] disabled:cursor-not-allowed disabled:bg-[var(--color-action-disabled-bg)] disabled:text-[var(--color-action-disabled)]';
const select = {
  states: [
    { label: 'Default', cls: '' },
    { label: 'Hover', cls: 'st-hover' },
    { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
    { label: 'Placeholder', cls: '', empty: true },
    { label: 'Error', cls: '', error: true, empty: true },
    { label: 'Disabled', disabled: true },
    { label: 'Live', cls: '', note: 'try it' },
  ],
  render(impl, s) {
    const label = `Standard, ${impl}, ${s.label.toLowerCase()} state`;
    const options = [s.empty ? <option key="e" value="">Choose a standard</option> : null, <option key="a">WCAG 2.2 AA</option>, <option key="b">Section 508</option>];
    const common = { 'aria-label': label, 'aria-invalid': s.error ? 'true' : undefined, disabled: s.disabled, defaultValue: s.empty ? '' : undefined };
    if (impl === 'MUI') {
      return <NativeSelect input={<OutlinedInput />} fullWidth error={!!s.error} disabled={s.disabled} defaultValue={s.empty ? '' : undefined}
        className={`${s.cls || ''} ${s.focus ? 'Mui-focused' : ''}`} inputProps={{ 'aria-label': label, 'aria-invalid': common['aria-invalid'], className: s.focus ? 'st-focus' : undefined }}>{options}</NativeSelect>;
    }
    if (impl === 'shadcn') return <select {...common} className={`${SELECT_SHAD} ${s.cls || ''}`}>{options}</select>;
    return <select {...common} className={`flint-select ${s.cls || ''}`}>{options}</select>;
  },
};

const INTENTS = ['neutral', 'success', 'warning', 'error', 'info'];
const MUI_COLOR = { neutral: 'default', success: 'success', warning: 'warning', error: 'error', info: 'info' };
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const STATUS = { neutral: 'Draft', success: 'Passed', warning: 'Needs review', error: 'Failed', info: 'New' };
// Tailwind only generates classes it can read in full, so every intent's classes are spelled out.
const TW_BADGE = {
  neutral: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]',
  success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]',
  warning: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]',
  error: 'bg-[var(--badge-error-bg)] text-[var(--badge-error-fg)]',
  info: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-fg)]',
};
const TW_CHIP = {
  neutral: ['text-[var(--chip-neutral-fg)]', 'bg-[var(--chip-neutral-bg)]', 'border-[var(--chip-neutral-border)]'],
  success: ['text-[var(--chip-success-fg)]', 'bg-[var(--chip-success-bg)]', 'border-[var(--chip-success-border)]'],
  warning: ['text-[var(--chip-warning-fg)]', 'bg-[var(--chip-warning-bg)]', 'border-[var(--chip-warning-border)]'],
  error: ['text-[var(--chip-error-fg)]', 'bg-[var(--chip-error-bg)]', 'border-[var(--chip-error-border)]'],
  info: ['text-[var(--chip-info-fg)]', 'bg-[var(--chip-info-bg)]', 'border-[var(--chip-info-border)]'],
};
const TW_ALERT = {
  info: 'border-[var(--color-feedback-info-border)] border-l-[var(--color-feedback-info-solid)] bg-[var(--color-feedback-info-surface)] text-[var(--color-feedback-info-text)]',
  success: 'border-[var(--color-feedback-success-border)] border-l-[var(--color-feedback-success-solid)] bg-[var(--color-feedback-success-surface)] text-[var(--color-feedback-success-text)]',
  warning: 'border-[var(--color-feedback-warning-border)] border-l-[var(--color-feedback-warning-solid)] bg-[var(--color-feedback-warning-surface)] text-[var(--color-feedback-warning-text)]',
  error: 'border-[var(--color-feedback-error-border)] border-l-[var(--color-feedback-error-solid)] bg-[var(--color-feedback-error-surface)] text-[var(--color-feedback-error-text)]',
};

const badge = {
  states: INTENTS.map((t) => ({ label: cap(t), intent: t })),
  render(impl, s) {
    const t = s.intent;
    if (impl === 'MUI') return <MuiChip size="small" color={MUI_COLOR[t]} label={STATUS[t]} />;
    if (impl === 'shadcn') return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${TW_BADGE[t]}`}>{STATUS[t]}</span>;
    return <span className={`flint-badge ${t === 'neutral' ? '' : `flint-badge--${t}`}`}>{STATUS[t]}</span>;
  },
};

const X = <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width="16" height="16"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const chip = {
  states: [
    ...INTENTS.map((t) => ({ label: cap(t), intent: t })),
    { label: 'Outlined', intent: 'neutral', outlined: true },
    { label: 'Outlined, error', intent: 'error', outlined: true },
    { label: 'Removable', intent: 'neutral', remove: true },
  ],
  render(impl, s) {
    const t = s.intent;
    const text = s.remove ? 'WCAG 2.2 AA' : STATUS[t];
    const removeLabel = `Remove ${text}, ${impl}`;
    if (impl === 'MUI') return <MuiChip color={MUI_COLOR[t]} variant={s.outlined ? 'outlined' : 'filled'} label={text} onDelete={s.remove ? () => {} : undefined} />;
    if (impl === 'shadcn') {
      return <span className={`inline-flex items-center gap-1 rounded-full min-h-[var(--control-sm)] ${s.remove ? 'pl-3 pr-1' : 'px-3'} text-sm font-semibold border ${TW_CHIP[t][0]} ${s.outlined ? `bg-transparent ${TW_CHIP[t][2]}` : `${TW_CHIP[t][1]} border-transparent`}`}>
        {text}{s.remove && <button type="button" aria-label={removeLabel} className="grid size-6 place-content-center rounded-full hover:bg-black/10 focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)]">{X}</button>}
      </span>;
    }
    return <span className={`flint-chip ${t === 'neutral' ? '' : `flint-chip--${t}`} ${s.outlined ? 'flint-chip--outlined' : ''}`}>
      {text}{s.remove && <button type="button" className="flint-chip__remove" aria-label={removeLabel}>{X}</button>}
    </span>;
  },
};

const ALERT = {
  info: ['Scan scheduled', 'We\'ll email you when the report is ready.'],
  success: ['Report saved', 'Your VPAT draft is in Reports.'],
  warning: ['12 checks need a person', 'Review them before you export.'],
  error: ['We couldn\'t reach the site', 'Check the address and try again.'],
};
const alertIcon = { info: 'M10 9v5', success: 'M6.5 10.5l2.5 2.5 4.5-5', warning: 'M10 8v4', error: 'M7 7l6 6M13 7l-6 6' };
const alert = {
  states: Object.keys(ALERT).map((t) => ({ label: cap(t), intent: t })),
  render(impl, s) {
    const t = s.intent;
    const [title, body] = ALERT[t];
    if (impl === 'MUI') return <MuiAlert severity={t} role="status"><AlertTitle>{title}</AlertTitle>{body}</MuiAlert>;
    const icon = <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width="20" height="20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" /><path d={alertIcon[t]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
    if (impl === 'shadcn') {
      return <div className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[var(--radius-md)] border border-l-4 p-4 text-sm ${TW_ALERT[t]}`}>
        <span className="row-span-2">{icon}</span><p className="m-0 font-bold">{title}</p><p className="m-0">{body}</p></div>;
    }
    return <div className={`flint-alert ${t === 'info' ? '' : `flint-alert--${t}`}`}>{icon}<p className="flint-alert__title">{title}</p><p className="flint-alert__body">{body}</p></div>;
  },
};

// Skip link: hidden until focused. Each cell is a positioned box so the link appears inside it.
const SKIP_SHAD = 'absolute left-4 top-2 z-[var(--z-toast)] inline-flex min-h-[var(--button-height)] items-center rounded-[var(--skip-link-radius)] border border-transparent bg-[var(--skip-link-bg)] px-4 text-sm font-bold text-[var(--skip-link-fg)] underline whitespace-nowrap [clip-path:inset(50%)] focus:[clip-path:none] focus-visible:[clip-path:none] focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]';
const SKIP_MUI = {
  position: 'absolute', left: 'var(--space-16)', top: 'var(--space-8)', zIndex: 'var(--z-toast)',
  display: 'inline-flex', alignItems: 'center', minHeight: 'var(--button-height)', px: 'var(--space-16)',
  border: '1px solid transparent', borderRadius: 'var(--skip-link-radius)',
  bgcolor: 'var(--skip-link-bg)', color: 'var(--skip-link-fg)', fontWeight: 700, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap',
  clipPath: 'inset(50%)',
  '&:focus, &:focus-visible': { clipPath: 'none', outline: 'var(--focus-ring-width) solid var(--focus-ring-color)', outlineOffset: 'var(--focus-ring-offset)' },
};
const skipLink = {
  states: [
    { label: 'Hidden', cls: '', note: 'until focused' },
    { label: 'Focus', cls: 'st-focus', note: 'keyboard focus' },
    { label: 'Live', cls: '', note: 'Tab into it' },
  ],
  render(impl, s) {
    const props = { href: '#skip-link', 'aria-label': `Skip to content, ${impl}, ${s.label.toLowerCase()} state` };
    let el;
    if (impl === 'MUI') el = <MuiLink {...props} className={s.cls} underline="always" sx={SKIP_MUI}>Skip to content</MuiLink>;
    else if (impl === 'shadcn') el = <a {...props} className={`${SKIP_SHAD} ${s.cls || ''}`}>Skip to content</a>;
    else el = <a {...props} className={`flint-skip-link ${s.cls || ''}`}>Skip to content</a>;
    return <span className="tb-skip">{el}</span>;
  },
};

// Icon: the same check-in-a-circle in each size. Each is named, since there is no text beside it.
const ICON_PATHS = <><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M6.5 10.5l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>;
const ICON_SIZE = { sm: 'var(--icon-sm)', md: 'var(--icon-md)', lg: 'var(--icon-lg)' };
const TW_ICON = {
  sm: 'size-[var(--icon-sm)] text-[var(--icon-fg)]',
  md: 'size-[var(--icon-md)] text-[var(--icon-fg)]',
  lg: 'size-[var(--icon-lg)] text-[var(--icon-fg)]',
  muted: 'size-[var(--icon-md)] text-[var(--icon-fg-muted)]',
};
const icon = {
  states: [
    { label: 'Small', size: 'sm', note: 'icon.sm' },
    { label: 'Medium', size: 'md', note: 'icon.md' },
    { label: 'Large', size: 'lg', note: 'icon.lg' },
    { label: 'Muted', size: 'md', muted: true, note: 'icon.fgMuted' },
  ],
  render(impl, s) {
    const name = `Passed, ${impl}, ${s.label.toLowerCase()}`;
    if (impl === 'MUI') {
      return <SvgIcon viewBox="0 0 20 20" titleAccess={name} sx={{ fontSize: ICON_SIZE[s.size], color: s.muted ? 'var(--icon-fg-muted)' : 'var(--icon-fg)' }}>{ICON_PATHS}</SvgIcon>;
    }
    if (impl === 'shadcn') return <svg viewBox="0 0 20 20" role="img" aria-label={name} className={TW_ICON[s.muted ? 'muted' : s.size]}>{ICON_PATHS}</svg>;
    const cls = `flint-icon ${s.size === 'md' ? '' : `flint-icon--${s.size}`} ${s.muted ? 'flint-icon--muted' : ''}`;
    return <svg viewBox="0 0 20 20" role="img" aria-label={name} className={cls}>{ICON_PATHS}</svg>;
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
  'radio/default': radio,
  'switch/default': toggle,
  'select/native': select,
  'badge/intents': badge,
  'chip/intents': chip,
  'alert/intents': alert,
  'field/default': field,
  'skip-link/default': skipLink,
  'icon/sizes': icon,
};
