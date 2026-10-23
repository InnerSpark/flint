// Workbench pages: which benches each component page shows, in order. Keys match benches.jsx.
export const WORKBENCH = {
  button: {
    name: 'Button',
    lead: 'Four variants, every state, as MUI, shadcn/ui and plain CSS. All three read the button component tokens.',
    benches: [['primary', 'Primary', 'button/primary'], ['secondary', 'Secondary', 'button/secondary'], ['danger', 'Danger', 'button/danger'], ['text', 'Text', 'button/text']],
    gap: 'The MUI theme does not apply the secondary and disabled button tokens yet, and its buttons are 36px tall instead of 40px (ASDS-44). Busy: MUI\'s loading prop hides the label, and the shadcn Button has no busy state, so aria-busy changes nothing you can see. Pressed: MUI uses its ripple, not button.*.bgPressed.',
  },
  checkbox: {
    name: 'Checkbox',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the checkbox tokens: 24px box, edge, checked fill and mark.',
    benches: [['checkbox', 'Checkbox', 'checkbox/default']],
    gap: 'The MUI checkbox shows no focus ring on keyboard focus and draws an 18px box instead of 24px (ASDS-44). It also ignores aria-invalid, so the Error row looks like Unchecked.',
  },
  field: {
    name: 'Field',
    lead: 'Label, helper, required and error around an input, as MUI, shadcn/ui and plain CSS. All three read the field tokens.',
    benches: [['field', 'Field', 'field/default']],
    gap: 'MUI TextField marks required with an asterisk only, floats the label inside the input instead of above it, and draws a disabled field with the same edge as an enabled one.',
  },
  radio: {
    name: 'Radio',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the radio tokens: 24px control, edge, checked fill and dot.',
    benches: [['radio', 'Radio', 'radio/default']],
    gap: 'The MUI radio draws a smaller control than Flint\'s 24px, and ignores aria-invalid, so the Error row looks like Unselected.',
  },
  select: {
    name: 'Select',
    lead: 'Every state as MUI, shadcn/ui and plain CSS, all on the native select. All three read the select tokens: edge, icon, text and placeholder.',
    benches: [['select', 'Native select', 'select/native']],
    gap: 'MUI NativeSelect is underlined by default; pass input={<OutlinedInput />} for the outlined look, and a disabled one keeps the enabled edge. shadcn/ui\'s own Select is a Radix listbox, not a native select, so the shadcn column styles a native select with the same tokens and has no arrow of its own.',
  },
  switch: {
    name: 'Switch',
    lead: 'Every state as MUI, shadcn/ui and plain CSS. All three read the switch tokens: track, checked track, thumb and checked thumb.',
    benches: [['switch', 'Switch', 'switch/default']],
    gap: 'The MUI switch is a 34x14 track with a 20px thumb that overhangs it, smaller than Flint\'s 48x24, and its disabled, on thumb stays tinted blue.',
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
    gap: 'The MUI input edge stays at MUI\'s default, about 1.6:1 (under 3:1), and its placeholder is dimmer than Flint\'s (ASDS-44). Read-only: MUI and shadcn look the same as an editable input; only plain CSS tints it (input.bgReadOnly).',
  },
};
