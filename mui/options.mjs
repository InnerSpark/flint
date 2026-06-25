/**
 * Pure MUI ThemeOptions built from Flint tokens. No dependency on @mui itself, so
 * it can be tested standalone. `createFlintTheme` (index.mjs) wraps this with MUI's
 * `createTheme`. Parameterized by mode, so the same source drives light and dark.
 */
import { semantic, fontFamily, fontWeight, fontSize, lineHeight, radius, shadow, shadowDark, space, control, breakpoint, targetMin } from '../dist/index.js';

const t = (size, weight, lh, ls = '0') => ({
  fontFamily: fontFamily.sans,
  fontSize: `${size}px`,
  fontWeight: weight,
  lineHeight: lh,
  letterSpacing: ls,
});

export function flintThemeOptions(mode = 'light') {
  const c = semantic[mode];
  const S = mode === 'dark' ? shadowDark : shadow;
  const intent = (name) => ({ success: c.feedback.success, warning: c.feedback.warning, error: c.feedback.error, info: c.feedback.info }[name]);
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
      text: { primary: c.text.heading, secondary: c.text.default, disabled: c.action.disabled },
      divider: c.border.default,
      action: { disabled: c.action.disabled, disabledBackground: c.action.disabledBg },
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
    spacing: space[8],
    breakpoints: { values: breakpoint },
    shape: { borderRadius: radius.xs },
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
      // Canonical Paper: kills MUI's dark elevation overlay and maps the elevation
      // prop onto the shadow tokens (mode-aware). Covers Menu/Popover/Dialog/Drawer,
      // which are all Paper-based, so floating surfaces stop hand-rolling shadows.
      MuiPaper: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const e = ownerState.elevation ?? 0;
            const sh = e === 0 ? null : e <= 1 ? S.card : e <= 4 ? S.popover : e <= 8 ? S.raised : S.dialog;
            return { backgroundImage: 'none', ...(sh ? { boxShadow: sh } : {}) };
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: c.surface.default,
            backgroundImage: 'none',
            border: `1px solid ${c.border.default}`,
            borderRadius: radius.md,
            boxShadow: S.card,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: { padding: space[16], '&:last-child': { paddingBottom: space[16] } },
        },
      },
      MuiMenu: { styleOverrides: { paper: { borderRadius: radius.sm, boxShadow: S.popover } } },
      MuiPopover: { styleOverrides: { paper: { borderRadius: radius.sm, boxShadow: S.popover } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: radius.lg, boxShadow: S.dialog } } },
      // Token-driven Chip: pill radius; intent (success/warning/error/info) maps to the
      // feedback surface/border/text; default uses the subtle surface.
      MuiChip: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const f = intent(ownerState.color);
            const base = { borderRadius: radius.pill, fontFamily: fontFamily.sans, fontWeight: fontWeight.semibold };
            if (f) {
              return ownerState.variant === 'outlined'
                ? { ...base, color: f.text, borderColor: f.border, backgroundColor: 'transparent' }
                : { ...base, color: f.text, backgroundColor: f.surface };
            }
            return ownerState.variant === 'outlined'
              ? { ...base, color: c.text.default, borderColor: c.border.default }
              : { ...base, color: c.text.default, backgroundColor: c.surface.subtle };
          },
        },
      },
      // Accordion: replaces the app's off-scale 10px radius with radius/md and a
      // token border; shadow only when expanded.
      MuiAccordion: {
        defaultProps: { disableGutters: true, elevation: 0, square: false },
        styleOverrides: {
          root: {
            backgroundColor: c.surface.default,
            backgroundImage: 'none',
            border: `1px solid ${c.border.default}`,
            borderRadius: radius.md,
            boxShadow: 'none',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { boxShadow: S.card },
          },
        },
      },
      // Inputs wired to control.md (40px) so the app stops hand-setting 42px heights.
      MuiInputBase: { styleOverrides: { root: { fontFamily: fontFamily.sans, fontSize: fontSize.md } } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: radius.sm },
          input: { height: `${control.md}px`, paddingTop: 0, paddingBottom: 0, boxSizing: 'border-box' },
        },
      },
      // Alert mapped to the feedback intents (standard / filled / outlined).
      MuiAlert: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const f = intent(ownerState.severity) || c.feedback.info;
            const base = { borderRadius: radius.md, fontFamily: fontFamily.sans };
            if (ownerState.variant === 'filled') return { ...base, backgroundColor: f.solid, color: f.onSolid };
            if (ownerState.variant === 'outlined') return { ...base, color: f.text, border: `1px solid ${f.border}`, backgroundColor: 'transparent' };
            return { ...base, backgroundColor: f.surface, color: f.text, border: `1px solid ${f.border}` };
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontFamily: fontFamily.sans,
            color: c.text.default,
            borderColor: c.border.default,
            '&.Mui-selected': {
              backgroundColor: c.selected.surface,
              color: c.selected.text,
              '&:hover': { backgroundColor: c.selected.surface },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: c.surface.inverse,
            color: c.text.inverse,
            fontFamily: fontFamily.sans,
            fontSize: `${fontSize.xs}px`,
            borderRadius: radius.sm,
            padding: `${space[4]}px ${space[8]}px`,
          },
          arrow: { color: c.surface.inverse },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: c.border.default, borderRadius: radius.pill, height: space[8] },
          bar: { backgroundColor: c.action.primary, borderRadius: radius.pill },
        },
      },
      // Tables: DS owns header surface, cell border + padding, and body row hover.
      MuiTableHead: { styleOverrides: { root: { backgroundColor: c.surface.subtle } } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${c.border.default}`, padding: `${space[8]}px ${space[12]}px`, fontFamily: fontFamily.sans, fontSize: `${fontSize.sm}px`, color: c.text.default },
          head: { color: c.text.heading, fontWeight: fontWeight.semibold, backgroundColor: c.surface.subtle },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            '& .MuiTableRow-root:hover': { backgroundColor: c.surface.subtle },
            '& .MuiTableRow-root:last-child .MuiTableCell-root': { borderBottom: 'none' },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: '#ffffff',
            '&.Mui-checked': { color: '#ffffff', '& + .MuiSwitch-track': { backgroundColor: c.action.primary, opacity: 1 } },
            '&.Mui-disabled + .MuiSwitch-track': { backgroundColor: c.action.disabledBg, opacity: 1 },
          },
          track: { backgroundColor: c.border.strong, opacity: 1 },
        },
      },
      MuiSelect: { styleOverrides: { icon: { color: c.text.muted } } },
      MuiAvatar: { styleOverrides: { root: { backgroundColor: c.surface.subtle, color: c.text.default, fontFamily: fontFamily.sans, fontWeight: fontWeight.semibold } } },
      MuiSnackbarContent: { styleOverrides: { root: { backgroundColor: c.surface.inverse, color: c.text.inverse, borderRadius: radius.sm, fontFamily: fontFamily.sans } } },
      MuiCheckbox: { styleOverrides: { root: { color: c.border.strong, '&.Mui-checked': { color: c.action.primary }, '&.Mui-disabled': { color: c.action.disabled } } } },
      MuiRadio: { styleOverrides: { root: { color: c.border.strong, '&.Mui-checked': { color: c.action.primary }, '&.Mui-disabled': { color: c.action.disabled } } } },
      // Link underlined by default (WCAG 1.4.1); app keeps only its selector exceptions local.
      MuiLink: { defaultProps: { underline: 'always' }, styleOverrides: { root: { color: c.text.link, textDecorationColor: 'currentColor', textUnderlineOffset: '0.15em' } } },
      MuiBackdrop: { styleOverrides: { root: { backgroundColor: c.overlayScrim } } },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: fontWeight.medium, fontFamily: fontFamily.sans } } },
    },
  };
}
