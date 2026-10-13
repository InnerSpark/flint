import OutlinedInput from '@mui/material/OutlinedInput';
import { Input as ShadInput } from '../components/ui/input';
import { Matrix, PSEUDO } from '../lib/Matrix';

export default { title: 'Components/Input', parameters: PSEUDO };

const STATES = [
  { label: 'Default', cls: '' },
  { label: 'Hover', cls: 'st-hover' },
  { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
  { label: 'Filled', cls: '', value: 'Turkey Bend' },
  { label: 'Error', cls: '', error: true, value: 'Turky Bend' },
  { label: 'Disabled', disabled: true },
  { label: 'Live', cls: '', note: 'try it' },
];

export const Text = () => (
  <Matrix
    title="Input: text"
    lead="Reads the input component tokens: edge, hover edge, focus edge, error edge, placeholder. Error follows aria-invalid in every implementation."
    states={STATES}
    render={(impl, s) => {
      const common = { placeholder: 'Campsite name', disabled: s.disabled, defaultValue: s.value, 'aria-label': `Campsite name, ${s.label.toLowerCase()} state`, 'aria-invalid': s.error ? 'true' : undefined };
      if (impl === 'MUI') {
        // MUI drives focus styling from its Mui-focused class, so the forced Focus row sets it.
        const { 'aria-label': label, 'aria-invalid': invalid, ...rest } = common;
        return <OutlinedInput {...rest} error={!!s.error} fullWidth className={`${s.cls} ${s.focus ? 'Mui-focused' : ''}`} inputProps={{ 'aria-label': label, 'aria-invalid': invalid, className: s.focus ? 'st-focus' : undefined }} />;
      }
      if (impl === 'shadcn') return <ShadInput {...common} className={s.cls} />;
      return <input type="text" {...common} className={`flint-input ${s.cls}`} />;
    }}
  />
);
