/**
 * shadcn/ui variable -> Flint token path (ASDS-40). The bridge only renames: every shadcn
 * variable becomes var(--<flint variable>), so light/dark and every value stay owned by Flint.
 * action.secondary (sky.400) is deliberately NOT used for shadcn's secondary: white text on it
 * fails contrast (ASDS-23). shadcn's secondary is a quiet surface button, which is surface.subtle.
 */
export const SHADCN_MAP = {
  '--background': 'semantic.surface.page',
  '--foreground': 'semantic.text.default',
  '--card': 'semantic.surface.default',
  '--card-foreground': 'semantic.text.default',
  '--popover': 'semantic.surface.default',
  '--popover-foreground': 'semantic.text.default',
  '--primary': 'semantic.action.primary',
  '--primary-foreground': 'semantic.action.onPrimary',
  '--secondary': 'semantic.surface.subtle',
  '--secondary-foreground': 'semantic.text.heading',
  '--muted': 'semantic.surface.subtle',
  '--muted-foreground': 'semantic.text.muted',
  '--accent': 'semantic.selected.surface',
  '--accent-foreground': 'semantic.selected.text',
  '--destructive': 'semantic.action.danger',
  '--destructive-foreground': 'semantic.action.onDanger',
  '--border': 'semantic.border.default',
  '--input': 'semantic.border.control',
  '--ring': 'semantic.action.focusRing',
  '--radius': 'radius.control',
  '--chart-1': 'semantic.chart.1',
  '--chart-2': 'semantic.chart.2',
  '--chart-3': 'semantic.chart.3',
  '--chart-4': 'semantic.chart.4',
  '--chart-5': 'semantic.chart.5',
  '--sidebar': 'semantic.surface.default',
  '--sidebar-foreground': 'semantic.text.default',
  '--sidebar-primary': 'semantic.action.primary',
  '--sidebar-primary-foreground': 'semantic.action.onPrimary',
  '--sidebar-accent': 'semantic.selected.surface',
  '--sidebar-accent-foreground': 'semantic.selected.text',
  '--sidebar-border': 'semantic.border.default',
  '--sidebar-ring': 'semantic.action.focusRing',
};

/** Tailwind v4 theme names shadcn components use, pointed at the shadcn variables above. */
export const SHADCN_THEME_COLORS = ['background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground', 'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'];
