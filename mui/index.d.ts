import type { Theme, ThemeOptions } from '@mui/material/styles';

export type FlintMode = 'light' | 'dark';
export type FlintDensity = 'comfortable' | 'compact';

export interface FlintThemeConfig {
  mode?: FlintMode;
  density?: FlintDensity;
  overrides?: ThemeOptions;
}

/** Pure MUI ThemeOptions built from Flint tokens, no @mui runtime needed. */
export declare function flintThemeOptions(mode?: FlintMode, density?: FlintDensity): ThemeOptions;

/** A ready MUI theme wired to Flint tokens. `overrides` are deep-merged on top. */
export declare function createFlintTheme(mode?: FlintMode, overrides?: ThemeOptions): Theme;
/** Object form, use this to pass a density. */
export declare function createFlintTheme(config?: FlintThemeConfig): Theme;

export default createFlintTheme;
