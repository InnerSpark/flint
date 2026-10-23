// One bench: a states-by-implementation table, live. The site's theme toggle and the density
// switch set data-theme / data-density on <html>; CSS variables follow on their own, and this
// island rebuilds the MUI theme to match.
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { flintThemeOptions } from '../../../mui/options.mjs';
import { BENCHES, IMPLEMENTATIONS, REACT } from './benches.jsx';
import { forceStates } from './forceStates.js';
import './workbench.css';

function useHtmlAttr(name, fallback) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setValue(root.getAttribute(name) || fallback);
    read();
    const watch = new MutationObserver(read);
    watch.observe(root, { attributes: true, attributeFilter: [name] });
    return () => watch.disconnect();
  }, [name, fallback]);
  return value;
}

export default function Bench({ bench, labelledBy }) {
  const theme = useHtmlAttr('data-theme', 'light');
  const density = useHtmlAttr('data-density', 'comfortable');
  const muiTheme = useMemo(() => createTheme(flintThemeOptions(theme, density)), [theme, density]);
  const { states, render } = BENCHES[bench];
  useEffect(() => { forceStates(); });

  return (
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider theme={muiTheme}>
        <div className="table-wrap tb-stage" role="region" aria-labelledby={labelledBy} tabIndex={0}>
          <table className="data" aria-labelledby={labelledBy}>
            <thead>
              <tr>
                <th scope="col">State</th>
                {IMPLEMENTATIONS.map((i) => <th key={i} scope="col">{i}</th>)}
              </tr>
            </thead>
            <tbody>
              {states.map((s) => (
                <tr key={s.label}>
                  <td className="tb-state">{s.label}{s.note && <span>{s.note}</span>}</td>
                  {IMPLEMENTATIONS.map((i) => <td key={i}><div className="tb-cell">{i === 'Flint React' ? REACT[bench](s) : render(i, s)}</div></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
