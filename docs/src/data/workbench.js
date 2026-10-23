// Workbench pages: which benches each component page shows, in order. Keys match benches.jsx.
export const WORKBENCH = {
  alert: {
    name: 'Alert',
    lead: 'Each intent as MUI, shadcn/ui and plain CSS. All three read one feedback family per alert: surface, border, solid edge and text.',
    benches: [['alert', 'Alert', 'alert/intents']],
    gap: 'MUI Alert sets role="alert" on every alert, so a static info message is announced as urgent; the MUI column passes role="status" to avoid that.',
  },
  badge: {
    name: 'Badge',
    lead: 'Each intent as MUI, shadcn/ui and plain CSS. All three read the badge tokens.',
    benches: [['badge', 'Badge', 'badge/intents']],
    gap: 'MUI has no static text badge; a small Chip stands in. MUI\'s Badge is a dot or count on an icon.',
  },
  chip: {
    name: 'Chip',
    lead: 'Each intent, outlined and removable, as MUI, shadcn/ui and plain CSS. All three read the chip tokens.',
    benches: [['chip', 'Chip', 'chip/intents']],
    gap: 'MUI gives every delete icon the same name, so several removable chips read as identical buttons. shadcn/ui has no chip; the shadcn column is a Badge with a button.',
  },
  button: {
    name: 'Button',
    lead: 'Four variants, every state, as MUI, shadcn/ui and plain CSS. All three read the button component tokens.',
    benches: [['primary', 'Primary', 'button/primary'], ['secondary', 'Secondary', 'button/secondary'], ['danger', 'Danger', 'button/danger'], ['text', 'Text', 'button/text']],
    gap: 'Busy: MUI\'s loading prop hides the label, and the shadcn Button has no busy state, so aria-busy changes nothing you can see. Pressed: MUI adds its ripple.',
  },
  checkbox: {
    name: 'Checkbox',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the checkbox tokens: 24px box, edge, checked fill and mark.',
    benches: [['checkbox', 'Checkbox', 'checkbox/default']],
    gap: 'MUI shows a round halo on hover and focus instead of a square ring, and a disabled box has no fill. Size, edge, error and checked fill now match (ASDS-44).',
  },
  field: {
    name: 'Field',
    lead: 'Label, helper, required and error around an input, as MUI, shadcn/ui and plain CSS. All three read the field tokens.',
    benches: [['field', 'Field', 'field/default']],
    gap: 'MUI TextField marks required with an asterisk only and floats the label inside the input instead of above it.',
  },
  radio: {
    name: 'Radio',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the radio tokens: 24px control, edge, checked fill and dot.',
    benches: [['radio', 'Radio', 'radio/default']],
    gap: 'MUI shows a round halo on hover and focus instead of a ring around the control. Size, edge and error now match (ASDS-44).',
  },
  select: {
    name: 'Select',
    lead: 'Every state as MUI, shadcn/ui and plain CSS, all on the native select. All three read the select tokens: edge, icon, text and placeholder.',
    benches: [['select', 'Native select', 'select/native']],
    gap: 'MUI NativeSelect is underlined by default; pass input={<OutlinedInput />} for the outlined look. shadcn/ui\'s own Select is a Radix listbox, not a native select, so the shadcn column styles a native select with the same tokens and has no arrow of its own.',
  },
  switch: {
    name: 'Switch',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the switch tokens: track, checked track, thumb and checked thumb.',
    benches: [['switch', 'Switch', 'switch/default']],
  },
  dialog: {
    name: 'Dialog',
    lead: 'The panel in place, and a Live row that opens a real modal, as MUI, shadcn/ui and plain CSS. All three read the dialog tokens.',
    benches: [['dialog', 'Dialog', 'dialog/default']],
    gap: 'MUI\'s Dialog has no close button and doesn\'t read dialog.border. The plain CSS dialog is the native <dialog>: the browser traps focus and closes on Esc.',
  },
  tabs: {
    name: 'Tabs',
    lead: 'Live tabs as MUI, shadcn/ui and plain CSS. Use the arrow keys: all three follow the APG tabs pattern.',
    benches: [['tabs', 'Tabs', 'tabs/default']],
    gap: 'MUI renders no panels and sets no aria-controls unless you pass them. Styling now matches: the Flint theme gives MUI tabs the 4px bar, the heavier selected weight and the inset focus ring (ASDS-81).',
  },
  menu: {
    name: 'Menu',
    lead: 'The open menu in place, and a Live menu button, as MUI, shadcn/ui and plain CSS.',
    benches: [['menu', 'Menu', 'menu/default']],
    gap: 'MUI has no danger item style; the MUI column colors Delete with menu.itemFgDanger. The shadcn Open row is static markup with the same classes, since Radix only renders an open menu in a portal.',
  },
  tooltip: {
    name: 'Tooltip',
    lead: 'A tooltip held open, and a Live one, as MUI, shadcn/ui and plain CSS. Each describes its button (aria-describedby).',
    benches: [['tooltip', 'Tooltip', 'tooltip/default']],
    gap: 'MUI uses the tooltip as the button\'s name unless you pass describeChild, as this bench does.',
  },
  toast: {
    name: 'Toast',
    lead: 'A toast in place, with and without an action, and a Live row, as MUI, shadcn/ui and plain CSS. None takes focus.',
    benches: [['toast', 'Toast', 'toast/default']],
    gap: 'MUI\'s Snackbar shows one message at a time and has no title and detail. The shadcn rows in place are static markup with the toast classes.',
  },
  icon: {
    name: 'Icon',
    lead: 'Each size and the muted color as MUI, shadcn/ui and plain CSS. All three read the icon tokens.',
    benches: [['icon', 'Icon', 'icon/sizes']],
  },
  'skip-link': {
    name: 'Skip link',
    lead: 'Hidden and focused, as MUI, shadcn/ui and plain CSS. All three read the skip link tokens. Tab into the Live row to see it appear.',
    benches: [['skip-link', 'Skip link', 'skip-link/default']],
    gap: 'MUI and shadcn/ui have no skip link. The MUI column is MUI Link styled with the tokens through sx; the shadcn column is an anchor with Tailwind classes.',
  },
  link: {
    name: 'Link',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read link.fg, stay underlined, and thicken the underline on hover.',
    benches: [['inline', 'Inline link', 'link/inline']],
  },
  input: {
    name: 'Input',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the input tokens, and error follows aria-invalid in each.',
    benches: [['text-input', 'Text input', 'input/text']],
    gap: 'Read-only: MUI and shadcn look the same as an editable input; only plain CSS tints it (input.bgReadOnly).',
  },
};
