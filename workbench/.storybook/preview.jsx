import { useMemo } from 'react';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans/800.css';
import '../src/styles/workbench.css';
import { create } from '@storybook/theming/create';
import { flintThemeOptions } from '../../mui/options.mjs';
import { semantic, fontFamily } from '../../dist/index.js';

/**
 * One toolbar drives every implementation at once: data-theme / data-density on <html> for the
 * CSS variables (plain CSS and shadcn), and the Flint MUI theme for MUI.
 */
const withFlint = (Story, context) => {
  const { theme = 'light', density = 'comfortable' } = context.globals;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.density = density;
  const muiTheme = useMemo(() => createTheme(flintThemeOptions(theme, density)), [theme, density]);
  return (
    // MUI's styles go in the `mui` cascade layer, ordered below Tailwind's utilities in
    // workbench.css (MUI's documented Tailwind v4 + Vite setup). Without it, MUI's unlayered reset (* { padding: 0 }) beats every Tailwind
    // utility and the shadcn components lose their padding and height.
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default {
  decorators: [withFlint],
  globalTypes: {
    theme: {
      description: 'Flint theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
    density: {
      description: 'Flint density',
      toolbar: { title: 'Density', icon: 'component', items: [{ value: 'comfortable', title: 'Comfortable' }, { value: 'compact', title: 'Compact' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', density: 'comfortable' },
  parameters: {
    layout: 'fullscreen',
    docs: { theme: create({ base: 'light', fontBase: fontFamily.sans, colorPrimary: semantic.light.action.primary, colorSecondary: semantic.light.action.primary }) },
    backgrounds: { disable: true },
    controls: { disable: true },
    actions: { disable: true },
    a11y: { config: { rules: [] } },
    options: { storySort: { order: ['Start here', 'Foundations', 'Components', 'Coverage'] } },
  },
};
