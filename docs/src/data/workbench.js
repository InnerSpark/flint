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
    gap: 'The MUI checkbox shows no focus ring on keyboard focus and draws an 18px box instead of 24px (ASDS-44).',
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
    gap: 'The MUI input edge stays at MUI\'s default, about 1.6:1 (under 3:1), and its placeholder is dimmer than Flint\'s (ASDS-44).',
  },
};
