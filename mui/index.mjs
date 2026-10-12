/**
 * MUI theme factory for Flint. Returns a ready MUI theme wired to the Flint tokens,
 * in light or dark. Optional `overrides` are deep-merged on top (MUI semantics).
 *
 *   import { createFlintTheme } from '@innerspark/flint/mui';
 *   const theme = createFlintTheme('light');
 *
 * @mui/material is a peer dependency (optional); only needed if you import this entry.
 */
import { createTheme } from '@mui/material/styles';
import { flintThemeOptions } from './options.mjs';

/**
 * createFlintTheme('light')
 * createFlintTheme('light', overrides)
 * createFlintTheme({ mode: 'light', density: 'compact', overrides })
 *
 * The positional forms are kept for backward compatibility; the object form is the way
 * to pass a density.
 */
export function createFlintTheme(modeOrOptions = 'light', overrides) {
  const opts = typeof modeOrOptions === 'string' ? { mode: modeOrOptions, overrides } : (modeOrOptions || {});
  const base = flintThemeOptions(opts.mode || 'light', opts.density || 'comfortable');
  return opts.overrides ? createTheme(base, opts.overrides) : createTheme(base);
}

export { flintThemeOptions };
export default createFlintTheme;
