// Flint principles (ASDS-47, with color rules from ASDS-48 and voice rules from ASDS-49).
// The page, its "On this page" list and any count come from this list. Nothing is counted by hand.
// Each principle names where it is enforced, so a rule never floats free of a check or a guide.
export const PRINCIPLE_GROUPS = [
  {
    id: 'looks',
    title: 'How it looks',
    lead: 'Quiet chrome, so the content and the one thing to do next stand out.',
    illustration: 'looks',
    items: [
      {
        id: 'content-leads',
        title: 'The content leads',
        why: 'Surfaces, borders and text stay neutral. The product, the data or the page someone came for carries the color.',
        enforced: ['Color', '/foundations/color/'],
      },
      {
        id: 'one-action-color',
        title: 'One action color, used with purpose',
        why: 'Blue (action.primary) marks what you can do: buttons, links, selection and focus. It is never decoration, so blue always means "this does something".',
        enforced: ['Usage rules', '/guides/usage-rules/#color'],
        do: 'Use action.primary for the main button and text.link for links.',
        dont: 'Tint a card header blue to make it feel on-brand.',
      },
      {
        id: 'red-means-danger',
        title: 'Red means danger or error. Nothing else.',
        why: 'action.danger and feedback.error are the only reds. Keep them rare and they keep their meaning: this can\'t be undone, or this went wrong.',
        enforced: ['Usage rules', '/guides/usage-rules/#color'],
        do: 'Use the danger button for Delete project, with a confirm step.',
        dont: 'Use red for a "Hot" badge or a sale price.',
      },
      {
        id: 'one-source',
        title: 'One source, every platform',
        why: 'CSS, MUI, shadcn/ui and SwiftUI read the same tokens. The parity test fails the build if any platform lands on a different value.',
        enforced: ['Token explorer', '/foundations/tokens/'],
      },
    ],
  },
  {
    id: 'behaves',
    title: 'How it behaves',
    lead: 'Accessibility is part of every primitive, not a pass at the end.',
    illustration: 'behaves',
    items: [
      {
        id: 'accessible-primitives',
        title: 'Accessible in the primitive',
        why: 'Text clears 7:1, control edges and focus rings clear 3:1, and every target is at least 24px. The build checks these, so a component inherits them.',
        enforced: ['Contrast', '/foundations/contrast/'],
      },
      {
        id: 'keyboard-and-reader',
        title: 'Works by keyboard and screen reader alone',
        why: 'Every control is reachable and named. Focus goes where you went: the heading after a skip link, the first error after submit, back to the trigger when a dialog closes.',
        enforced: ['Accessibility', '/guides/accessibility/'],
      },
      {
        id: 'legible-any-background',
        title: 'Legible over any background',
        why: 'Text and controls clear the bar against the worst content that can sit behind them, not the best. Translucent material like Liquid Glass can\'t promise that, so Flint keeps it to the navigation layer and never puts body text on it.',
        enforced: ['Liquid Glass', '/get-started/ios/#liquid-glass'],
        do: 'Keep glass to bars, sheets and floating buttons, and test with Reduce Transparency on.',
        dont: 'Set a paragraph or a form on glass over a photo.',
      },
      {
        id: 'native-before-custom',
        title: 'Native before custom',
        why: 'Style the platform\'s own controls instead of drawing look-alikes. Native bars, sheets and switches keep VoiceOver, Dynamic Type, the large content viewer and the system\'s accessibility settings. A copy loses them, and so does painting over them.',
        enforced: ['iOS and SwiftUI', '/get-started/ios/#chrome'],
        do: 'Call FlintChrome.apply() once and keep Apple\'s tab bar.',
        dont: 'Build a custom tab bar to match a mockup pixel for pixel.',
      },
      {
        id: 'one-main-action',
        title: 'One main action per view',
        why: 'One primary button. Everything else is secondary or text. If two things compete, the page has two jobs.',
        enforced: ['Button', '/components/button/'],
      },
      {
        id: 'forms-one-column',
        title: 'Forms stack in one column',
        why: 'Labels sit above fields and stay visible. Errors replace the helper text and say how to fix the problem.',
        enforced: ['Input', '/components/input/'],
      },
      {
        id: 'motion-steps-aside',
        title: 'Motion helps, then steps aside',
        why: 'Durations and easing come from tokens and stay short. With reduced motion on, things change instantly.',
        enforced: ['Motion', '/foundations/motion/'],
      },
    ],
  },
  {
    id: 'talks',
    title: 'How it talks',
    lead: 'Short, plain words. Say what happens.',
    illustration: 'talks',
    items: [
      {
        id: 'name-the-action',
        title: 'Name the action',
        why: 'A button says what it does. People scan labels, and screen reader users often hear them out of context.',
        enforced: ['Usage rules', '/guides/usage-rules/#words'],
        do: 'Save changes. Delete project. Send invite.',
        dont: 'OK. Submit. Continue.',
      },
      {
        id: 'plain-words',
        title: 'Plain words, no jargon',
        why: 'Write for someone busy. Short sentences, common words, one idea each. Errors say what happened and what to do next.',
        enforced: ['Usage rules', '/guides/usage-rules/#words'],
        do: 'That email is already in use. Sign in instead?',
        dont: 'Error 409: a conflict occurred while processing your request.',
      },
      {
        id: 'no-sparkle',
        title: 'Name what AI does. No sparkle.',
        why: 'A sparkle icon tells nobody anything. Say what the feature does, the same way you would for any other button.',
        enforced: ['Usage rules', '/guides/usage-rules/#words'],
        do: 'Suggest alt text.',
        dont: 'A sparkle icon with no label, or "Magic".',
      },
    ],
  },
];

export const PRINCIPLE_COUNT = PRINCIPLE_GROUPS.reduce((n, g) => n + g.items.length, 0);
