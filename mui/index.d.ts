import type { Theme, ThemeOptions } from '@mui/material/styles';

export type FlintMode = 'light' | 'dark';

/** Pure MUI ThemeOptions built from Flint tokens, no @mui runtime needed. */
export declare function flintThemeOptions(mode?: FlintMode): ThemeOptions;

/** A ready MUI theme wired to Flint tokens. `overrides` are deep-merged on top. */
export declare function createFlintTheme(mode?: FlintMode, overrides?: ThemeOptions): Theme;

export default createFlintTheme;
