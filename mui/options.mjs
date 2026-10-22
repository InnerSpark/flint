/**
 * Pure MUI ThemeOptions built from Flint tokens. No dependency on @mui itself, so
 * it can be tested standalone. `createFlintTheme` (index.mjs) wraps this with MUI's
 * `createTheme`. Parameterized by mode, so the same source drives light and dark.
 */
import { color, semantic, component, fontFamily, fontWeight, fontSize, lineHeight, radius, shadow, shadowDark, space, breakpoint, density, targetMin } from '../dist/index.js';

const t = (size, weight, lh, ls = '0') => ({
  fontFamily: fontFamily.sans,
  fontSize: `${size}px`,
  fontWeight: weight,
  lineHeight: lh,
  letterSpacing: ls,
});

export function flintThemeOptions(mode = 'light', densityName = 'comfortable') {
  // Density varies inset/gap only. theme.spacing stays on the 8px base so sx multipliers
  // keep their meaning, and control/icon/target sizes are identical in both densities, so
  // compact never shrinks the touch target.
  const D = density[densityName] || density.comfortable;
  const c = semantic[mode];
  // Component tier (ASDS-39): button, input and focus decisions come from tokens, not this file.
  const k = component[mode];
  const ring = `${k.focus.ring.width}px solid ${k.focus.ring.color}`;
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
          *:focus-visible { outline: ${ring}; outline-offset: ${k.focus.ring.offset}px; }
          button:focus-visible, [role="button"]:focus-visible, a:focus-visible { outline: ${ring}; outline-offset: ${k.focus.ring.offset}px; }
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
      MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: k.button.radius } } },
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
          root: { padding: D.inset.lg, '&:last-child': { paddingBottom: D.inset.lg } },
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
            const named = k.chip[ownerState.color];
            const t = named || k.chip.neutral;
            const base = { borderRadius: k.chip.radius, fontFamily: fontFamily.sans, fontWeight: k.chip.fontWeight };
            if (ownerState.variant === 'outlined') {
              return named
                ? { ...base, color: t.fg, borderColor: t.border, backgroundColor: 'transparent' }
                : { ...base, color: t.fg, borderColor: t.border };
            }
            return { ...base, color: t.fg, backgroundColor: t.bg };
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
      // Inputs wired to the input component tokens (40px, control.md) so the app stops hand-setting 42px heights.
      MuiInputBase: { styleOverrides: { root: { fontFamily: fontFamily.sans, fontSize: fontSize.md } } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: k.input.radius },
          input: { height: `${k.input.height}px`, paddingTop: 0, paddingBottom: 0, boxSizing: 'border-box' },
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
          root: { borderBottom: `1px solid ${c.border.default}`, padding: `${D.inset.sm}px ${D.inset.md}px`, fontFamily: fontFamily.sans, fontSize: `${fontSize.sm}px`, color: c.text.default },
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
            color: k.switch.thumb,
            // Checked thumb must be onPrimary, not white: in dark mode action.primary is a
            // light fill, so a white thumb lands at 1.80:1 against its own track (ASDS-45).
            '&.Mui-checked': { color: k.switch.thumbChecked, '& + .MuiSwitch-track': { backgroundColor: k.switch.trackChecked, opacity: 1 } },
            '&.Mui-disabled + .MuiSwitch-track': { backgroundColor: k.switch.trackDisabled, opacity: 1 },
          },
          track: { backgroundColor: k.switch.track, opacity: 1 },
        },
      },
      MuiSelect: { styleOverrides: { icon: { color: k.select.icon } } },
      MuiAvatar: { styleOverrides: { root: { backgroundColor: c.surface.subtle, color: c.text.default, fontFamily: fontFamily.sans, fontWeight: fontWeight.semibold } } },
      MuiSnackbarContent: { styleOverrides: { root: { backgroundColor: c.surface.inverse, color: c.text.inverse, borderRadius: radius.sm, fontFamily: fontFamily.sans } } },
      MuiCheckbox: { styleOverrides: { root: { color: k.checkbox.border, '&.Mui-checked': { color: k.checkbox.checkedBg }, '&.Mui-disabled': { color: k.checkbox.disabled } } } },
      MuiRadio: { styleOverrides: { root: { color: k.radio.border, '&.Mui-checked': { color: k.radio.checkedBg }, '&.Mui-disabled': { color: k.radio.disabled } } } },
      // Link underlined by default (WCAG 1.4.1); app keeps only its selector exceptions local.
      MuiLink: { defaultProps: { underline: 'always' }, styleOverrides: { root: { color: c.text.link, textDecorationColor: 'currentColor', textUnderlineOffset: '0.15em', '&:hover': { textDecorationThickness: '0.125em' } } } },
      MuiBackdrop: { styleOverrides: { root: { backgroundColor: c.overlayScrim } } },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: fontWeight.medium, fontFamily: fontFamily.sans } } },
    },
  };
}
