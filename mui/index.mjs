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

export function createFlintTheme(mode = 'light', overrides) {
  return overrides ? createTheme(flintThemeOptions(mode), overrides) : createTheme(flintThemeOptions(mode));
}

export { flintThemeOptions };
export default createFlintTheme;
