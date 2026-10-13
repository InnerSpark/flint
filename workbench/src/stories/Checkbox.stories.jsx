import MuiCheckbox from '@mui/material/Checkbox';
import { Checkbox as ShadCheckbox } from '../components/ui/checkbox';
import { Matrix, PSEUDO } from '../lib/Matrix';

export default { title: 'Components/Checkbox', parameters: PSEUDO };

const STATES = [
  { label: 'Unchecked', cls: '' },
  { label: 'Checked', cls: '', checked: true },
  { label: 'Hover', cls: 'st-hover' },
  { label: 'Focus', cls: 'st-focus', focus: true, note: 'keyboard focus' },
  { label: 'Disabled', disabled: true },
  { label: 'Disabled, checked', disabled: true, checked: true },
  { label: 'Live', cls: '', note: 'try it' },
];

export const Default = () => (
  <Matrix
    title="Checkbox"
    lead="Reads the checkbox component tokens: size (24px, Flint's minimum target), edge, checked fill and mark."
    states={STATES}
    render={(impl, s) => {
      const name = `Bring the awning lights, ${s.label.toLowerCase()} state`;
      const text = <span>Bring the awning lights</span>;
      if (impl === 'MUI') {
        // MUI shows keyboard focus with its Mui-focusVisible class on the root.
        return <label className="wb-cell"><MuiCheckbox defaultChecked={s.checked} disabled={s.disabled} className={`${s.cls} ${s.focus ? 'Mui-focusVisible' : ''}`} inputProps={{ 'aria-label': name, className: s.focus ? 'st-focus' : undefined }} />{text}</label>;
      }
      if (impl === 'shadcn') return <label className="wb-cell"><ShadCheckbox defaultChecked={s.checked} disabled={s.disabled} className={s.cls} aria-label={name} />{text}</label>;
      return <label className="wb-cell"><input type="checkbox" className={`flint-check ${s.cls}`} defaultChecked={s.checked} disabled={s.disabled} aria-label={name} />{text}</label>;
    }}
  />
);
