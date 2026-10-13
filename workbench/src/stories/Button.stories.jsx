import MuiButton from '@mui/material/Button';
import { Button as ShadButton } from '../components/ui/button';
import { Matrix, PSEUDO } from '../lib/Matrix';

export default { title: 'Components/Button', parameters: PSEUDO };

const STATES = [
  { label: 'Default', cls: '' },
  { label: 'Hover', cls: 'st-hover' },
  { label: 'Focus', cls: 'st-focus', note: 'keyboard focus' },
  { label: 'Disabled', disabled: true },
  { label: 'Live', cls: '', note: 'try it' },
];

// variant -> how each implementation spells it
const SPELL = {
  primary: { mui: { variant: 'contained' }, shad: 'default', plain: 'primary', label: 'Save trip' },
  secondary: { mui: { variant: 'outlined' }, shad: 'secondary', plain: 'secondary', label: 'Add stop' },
  danger: { mui: { variant: 'contained', color: 'error' }, shad: 'destructive', plain: 'danger', label: 'Delete trip' },
  text: { mui: { variant: 'text' }, shad: 'ghost', plain: 'text', label: 'Skip for now' },
};

const make = (variant) => () => {
  const v = SPELL[variant];
  return (
    <Matrix
      title={`Button: ${variant}`}
      lead={`One component spec, three implementations, all reading the button.${variant} component tokens. Switch Theme and Density in the toolbar.`}
      states={STATES}
      render={(impl, s) => {
        if (impl === 'MUI') return <MuiButton {...v.mui} disableElevation className={s.cls} disabled={s.disabled}>{v.label}</MuiButton>;
        if (impl === 'shadcn') return <ShadButton variant={v.shad} className={s.cls} disabled={s.disabled}>{v.label}</ShadButton>;
        return <button type="button" className={`flint-btn flint-btn--${v.plain} ${s.cls}`} disabled={s.disabled}>{v.label}</button>;
      }}
    />
  );
};

export const Primary = make('primary');
export const Secondary = make('secondary');
export const Danger = make('danger');
export const Text = make('text');
