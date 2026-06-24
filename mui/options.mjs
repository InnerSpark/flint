/**
 * Pure MUI ThemeOptions built from Flint tokens. No dependency on @mui itself, so
 * it can be tested standalone. `createFlintTheme` (index.mjs) wraps this with MUI's
 * `createTheme`. Parameterized by mode, so the same source drives light and dark.
 */
import { semantic, fontFamily, fontWeight, fontSize, lineHeight, radius, targetMin } from '../dist/index.js';

const t = (size, weight, lh, ls = '0') => ({
  fontFamily: fontFamily.sans,
  fontSize: `${size}px`,
  fontWeight: weight,
  lineHeight: lh,
  letterSpacing: ls,
});

export function flintThemeOptions(mode = 'light') {
  const c = semantic[mode];
  return {
    palette: {
      mode,
      primary: { main: c.action.primary, dark: c.action.primaryHover, contrastText: c.action.onPrimary },
      secondary: { main: c.action.secondary },
      success: { main: c.feedback.success.solid },
      warning: { main: c.feedback.warning.solid },
      error: { main: c.feedback.error.solid },
      info: { main: c.feedback.info.solid },
      background: { default: c.surface.page, paper: c.surface.default },
      text: { primary: c.text.heading, secondary: c.text.default, disabled: c.text.placeholder },
      divider: c.border.default,
    },
    typography: {
      fontFamily: fontFamily.sans,
      h1: t(fontSize['4xl'], fontWeight.extrabold, lineHeight.tight, '-1px'),
      h2: t(fontSize['3xl'], fontWeight.bold, lineHeight.tight, '-0.5px'),
      h3: t(fontSize['2xl'], fontWeight.bold, 1.25, '-0.3px'),
      h4: t(fontSize.xl, fontWeight.bold, 1.3, '-0.2px'),
      h5: t(fontSize.lg, fontWeight.bold, 1.4),
      h6: t(fontSize.md, fontWeight.semibold, 1.4),
      subtitle1: t(fontSize.md, fontWeight.semibold, lineHeight.normal),
      subtitle2: t(fontSize.sm, fontWeight.semibold, lineHeight.normal),
      body1: t(fontSize.md, fontWeight.regular, lineHeight.normal),
      body2: t(fontSize.sm, fontWeight.regular, lineHeight.normal),
      button: { ...t(fontSize.sm, fontWeight.bold, 1.2), textTransform: 'none' },
      caption: { ...t(fontSize.xs, fontWeight.semibold, lineHeight.snug), color: c.text.default },
      overline: { ...t(fontSize.xs, fontWeight.bold, 1.2, '1.5px'), textTransform: 'uppercase' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { font-family: ${fontFamily.sans}; overflow-x: clip; max-width: 100vw; }
          #root { height: 100vh; overflow-x: clip; }
          *:focus-visible { outline: 2px solid ${c.action.focusRing}; outline-offset: 2px; }
          button:focus-visible, [role="button"]:focus-visible, a:focus-visible { outline: 2px solid ${c.action.focusRing}; outline-offset: 2px; }
          /* WCAG 2.5.8: minimum target size for interactive elements */
          button, [role="button"], a, input, select, textarea { min-height: ${targetMin}px; }
          /* WCAG 2.4.11: focused elements not obscured by sticky headers */
          :focus { scroll-margin-top: 56px; scroll-margin-bottom: 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .btn-spinner {
            display: inline-block; width: 14px; height: 14px;
            border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
            border-radius: 50%; animation: spin 0.6s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .btn-spinner { animation: none; }
            *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
          }
        `,
      },
      MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: radius.sm } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: radius.sm } } },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: fontWeight.medium, fontFamily: fontFamily.sans } } },
    },
  };
}
