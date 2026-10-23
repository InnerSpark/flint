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
