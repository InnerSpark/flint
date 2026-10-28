// Component docs content. Live examples use the plain-CSS classes from the workbench; code tabs read
// the workbench source directly, so the docs show the exact code the workbench tests.
import plainCss from '../../../css/components.css?raw';
import shadButton from '../workbench/ui/button.jsx?raw';
import shadInput from '../workbench/ui/input.jsx?raw';
import shadCheckbox from '../workbench/ui/checkbox.jsx?raw';
import shadRadio from '../workbench/ui/radio.jsx?raw';
import shadSwitch from '../workbench/ui/switch.jsx?raw';
import shadDialog from '../workbench/ui/dialog.jsx?raw';
import shadTabs from '../workbench/ui/tabs.jsx?raw';
import shadMenu from '../workbench/ui/dropdown-menu.jsx?raw';
import shadTooltip from '../workbench/ui/tooltip.jsx?raw';
import shadToast from '../workbench/ui/toast.jsx?raw';

/** Top-level blocks of components.css, comments dropped. @media and @keyframes stay whole. */
const blocks = (() => {
  const css = plainCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) { out.push(css.slice(start, i + 1).trim()); start = i + 1; }
  }
  return out;
})();
/** The rules for one component class: its own rules, @media blocks that touch it, and the keyframes they use. */
const cssFor = (cls) => {
  const own = blocks.filter((b) => b.startsWith(`.${cls}`) || (b.startsWith('@media') && b.includes(`.${cls}`)));
  const frames = blocks.filter((b) => b.startsWith('@keyframes') && own.some((o) => o.includes(b.split(/\s+/)[1])));
  return [...own, ...frames].join('\n');
};

const errorIcon = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const svg = (d) => `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">${d}</svg>`;
const infoIcon = svg('<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="6.2" r="1.2" fill="currentColor"/>');
const successIcon = svg('<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 10.5l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
const warningIcon = svg('<path d="M10 2.5l8 14.5H2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14.6" r="1.1" fill="currentColor"/>');
const alertErrorIcon = svg('<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
const closeIcon = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const ico = (cls, attrs, d) => `<svg class="${cls}" viewBox="0 0 20 20" ${attrs}>${d}</svg>`;
const CHECK = '<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 10.5l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
const CLOCK = '<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 6v4l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

export const COMPONENTS = {
  button: {
    name: 'Button',
    lead: 'Buttons start an action. Flint has four: primary, secondary, danger and text.',
    example: `<div class="example-row">
  <button type="button" class="flint-btn flint-btn--primary">Save trip</button>
  <button type="button" class="flint-btn flint-btn--secondary">Add stop</button>
  <button type="button" class="flint-btn flint-btn--text">Skip for now</button>
</div>
<div class="example-row">
  <button type="button" class="flint-btn flint-btn--danger">Delete trip</button>
  <button type="button" class="flint-btn flint-btn--primary" disabled>Save trip</button>
</div>
<div class="example-row">
  <button type="button" class="flint-btn flint-btn--primary" aria-busy="true" aria-disabled="true">Saving trip</button>
  <button type="button" class="flint-btn flint-btn--secondary flint-btn--sm">Edit stop</button>
  <button type="button" class="flint-btn flint-btn--secondary flint-btn--icon" aria-label="Add stop"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
</div>`,
    when: [
      'Use a button to do something: save, delete, open a dialog, start a flow.',
      'Use a link to go somewhere. If it changes the URL, it is a link.',
    ],
    variants: [
      ['Primary', 'The main action in a view. One per view.'],
      ['Secondary', 'Every other action next to a primary one.'],
      ['Danger', 'Actions that destroy something. Always followed by a confirm step.'],
      ['Text', 'Low-emphasis actions in dense areas, like table rows and toolbars.'],
      ['Icon only', 'Any variant plus flint-btn--icon. Square, the button\'s height. Needs an aria-label.'],
      ['Small', 'Any variant plus flint-btn--sm. 32px tall (button.heightSm) for toolbars and table rows. Combines with flint-btn--icon.'],
      ['Pressed', 'Primary and danger darken one more step while pressed (button.*.bgPressed). Secondary and text keep their hover look.'],
      ['Busy', 'aria-busy="true" while the action runs. Keep the label; a spinner shows next to it.'],
      ['Disabled', 'disabled, or aria-disabled="true" to keep it focusable so people can find out why.'],
    ],
    guidance: [
      ['One primary button per view. Everything else is secondary or text.', 'Line up two primary buttons and make people guess which one matters.'],
      ['Label with a verb that says what happens: "Save trip", "Delete trip".', 'Use "OK" or "Submit". People should know the result before they click.'],
      ['When a button is disabled, say why next to it.', 'Disable a button with no explanation and leave people stuck.'],
    ],
    code: {
      css: { label: 'HTML', code: '<button type="button" class="flint-btn flint-btn--primary">Save trip</button>\n<button type="button" class="flint-btn flint-btn--secondary">Add stop</button>\n<button type="button" class="flint-btn flint-btn--danger">Delete trip</button>\n<button type="button" class="flint-btn flint-btn--text">Skip for now</button>\n\n<!-- Small: toolbars and table rows -->\n<button type="button" class="flint-btn flint-btn--secondary flint-btn--sm">Edit stop</button>\n\n<!-- Busy: keep it focusable, block the click in code -->\n<button type="button" class="flint-btn flint-btn--primary" aria-busy="true" aria-disabled="true">Saving trip</button>\n\n<!-- Icon only: name it, hide the icon -->\n<button type="button" class="flint-btn flint-btn--secondary flint-btn--icon" aria-label="Add stop">\n  <svg aria-hidden="true" focusable="false">...</svg>\n</button>', rules: cssFor('flint-btn') },
      mui: `import Button from '@mui/material/Button';

<Button variant="contained">Save trip</Button>
<Button variant="outlined">Add stop</Button>
<Button variant="contained" color="error">Delete trip</Button>
<Button variant="text">Skip for now</Button>`,
      shadcn: shadButton,
      swift: `Button("Save trip", action: save)
  .flintText(Flint.Typography.labelButton)
  .foregroundStyle(Flint.Component.buttonPrimaryFg)
  .padding(.horizontal, Flint.Space.s16)
  .frame(minHeight: Flint.Target.touch)
  .background(Flint.Component.buttonPrimaryBg,
              in: RoundedRectangle(cornerRadius: Flint.Component.buttonRadius))`,
      muiGap: 'MUI adds its ripple on press as well as the pressed color, and its loading prop hides the label instead of keeping it next to a spinner.',
    },
    keyboard: [['Tab', 'Moves focus to the button. A solid 2px ring shows where focus is.'], ['Enter or Space', 'Activates the button.']],
    screenReader: [
      'The visible label is the accessible name. Don\'t override it with a different aria-label.',
      'An icon-only button needs an aria-label, and its icon is aria-hidden.',
      'A toggle button uses aria-pressed. A button that opens a menu uses aria-expanded.',
      'A busy button sets aria-busy="true" and aria-disabled="true". Announce the result (saved, or the error) in a live region when it finishes.',
      'aria-disabled keeps a button in the tab order so people can reach it and read why it is off. Block the click in your handler.',
      'Use a real <button>. A <div> with a click handler is not reachable by keyboard.',
    ],
    target: 'Buttons are 40px tall (control.md), or 32px small (control.sm), both above the 24px minimum. On iOS, at least 44pt.',
  },
  radio: {
    name: 'Radio',
    lead: 'Radio buttons pick exactly one option from a short list. Choosing one clears the others, and there is no way back to nothing chosen.',
    example: `<fieldset class="flint-fieldset">
  <legend class="flint-fieldset__legend">Which site should we scan?</legend>
  <label class="flint-choice"><input type="radio" name="scan-scope-__P__" class="flint-radio" checked /> Just this page</label>
  <label class="flint-choice"><input type="radio" name="scan-scope-__P__" class="flint-radio" /> The whole site</label>
  <label class="flint-choice"><input type="radio" name="scan-scope-__P__" class="flint-radio" disabled /> Pages behind sign-in (needs saved credentials)</label>
</fieldset>`,
    when: [
      'Use radio buttons when exactly one option must be picked and people should see all the choices at once.',
      'Use a select when the list is long, roughly seven options or more, or when the options are familiar enough not to need reading.',
      'Use checkboxes when more than one answer is allowed.',
    ],
    variants: [
      ['Unselected', 'The option is available but not chosen.'],
      ['Selected', 'The chosen option. The fill and the dot both change, so the state is never color alone.'],
      ['Disabled', 'The option can\'t be picked right now. Say why next to it, as the example does.'],
    ],
    guidance: [
      ['Give every group a default. A pre-selected option means a form can\'t be submitted half-answered.', 'Leave every radio empty and let people submit nothing, which radio buttons can\'t undo.'],
      ['Wrap the group in a fieldset with a legend that asks the question.', 'Float radios with no group label, which leaves a screen reader reading options with no question.'],
      ['Keep the list short and the labels parallel, so they can be compared at a glance.', 'Mix lengths and grammar between options so people have to re-read each one.'],
      ['Use one radio group per question.', 'Reuse a name across two questions, which silently links them.'],
    ],
    code: {
      css: { label: 'HTML', code: '<fieldset class="flint-fieldset">\n  <legend class="flint-fieldset__legend">Which site should we scan?</legend>\n  <label class="flint-choice"><input type="radio" name="scan-scope" class="flint-radio" checked /> Just this page</label>\n  <label class="flint-choice"><input type="radio" name="scan-scope" class="flint-radio" /> The whole site</label>\n</fieldset>', rules: [cssFor('flint-radio'), cssFor('flint-choice'), cssFor('flint-fieldset')].join('\n') },
      mui: `import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

<FormControl>
  <FormLabel id="scan-scope">Which site should we scan?</FormLabel>
  <RadioGroup aria-labelledby="scan-scope" name="scan-scope" defaultValue="page">
    <FormControlLabel value="page" control={<Radio />} label="Just this page" />
    <FormControlLabel value="site" control={<Radio />} label="The whole site" />
  </RadioGroup>
</FormControl>`,
      shadcn: shadRadio,
      swift: `Picker("Which site should we scan?", selection: $scope) {
  Text("Just this page").tag(Scope.page)
  Text("The whole site").tag(Scope.site)
}
.pickerStyle(.inline) // A Form section. On iOS this is the native one-of-many control.`,
      muiGap: 'The Flint MUI theme sizes the radio to 24px and reads the radio tokens, including aria-invalid. MUI still shows a round halo on hover and focus instead of the ring around the control. Pass aria-invalid through slotProps.input.',
    },
    keyboard: [
      ['Tab', 'Moves focus into the group, landing on the selected option, or the first one when nothing is selected. A second Tab leaves the group.'],
      ['Arrow keys', 'Moves between options and selects as it goes. This is why a group needs a sensible default.'],
      ['Space', 'Selects the focused option when nothing in the group is selected yet.'],
    ],
    screenReader: [
      'Use native inputs that share a name attribute. That is what makes them one group and gives the "2 of 3" count.',
      'Wrap the group in a fieldset with a legend, or use role="radiogroup" with aria-labelledby, so the question is read before the options.',
      'Tie each label to its input, so the label is the accessible name and clicking it selects the option.',
      'Don\'t put a radio group inside another control. Arrow keys belong to the group and will be swallowed.',
    ],
    target: 'The control is 24px (radio.size, which aliases targetMin), and the label extends the clickable area. On iOS, at least 44pt.',
  },
  link: {
    name: 'Link',
    lead: 'Links take people somewhere: another page, a section, a file. Flint links are always underlined, so they never rely on color alone.',
    example: `<p>Your trip is saved. <a class="flint-link" href="#">Review the route</a> before you leave.</p>
<div class="example-row">
  <a class="flint-link flint-link--standalone" href="#">View all trips</a>
  <a class="flint-link flint-link--standalone" href="https://example.com" target="_blank" rel="noopener">Campground rules<span class="flint-sr-only"> (opens in a new tab)</span></a>
</div>`,
    when: [
      'Use a link to go somewhere. If it changes the URL or jumps to a section, it is a link.',
      'Use a button to do something: save, delete, open a dialog.',
      'Use a standalone link for a call to go elsewhere on its own line, like "View all trips".',
    ],
    variants: [
      ['Inline', 'Inside a sentence. Takes the text size around it.'],
      ['Standalone', 'flint-link--standalone. On its own line, 600 weight, at least 24px tall.'],
      ['New tab', 'target="_blank" adds a decorative arrow. Say "(opens in a new tab)" in text with flint-sr-only.'],
      ['Hover', 'The underline thickens. The color stays the same.'],
    ],
    guidance: [
      ['Write link text that makes sense alone: "Review the route".', 'Use "click here" or "learn more". Screen reader users often list links out of context.'],
      ['Keep the underline on every link, everywhere.', 'Remove the underline and rely on blue. Some people can\'t see the difference.'],
      ['Open new tabs only when leaving would lose work, and say so in the link.', 'Open new tabs by default without warning.'],
    ],
    code: {
      css: { label: 'HTML', code: '<a class="flint-link" href="/trips/42">Review the route</a>\n\n<a class="flint-link flint-link--standalone" href="/trips">View all trips</a>\n\n<a class="flint-link" href="https://example.com" target="_blank" rel="noopener">\n  Campground rules<span class="flint-sr-only"> (opens in a new tab)</span>\n</a>', rules: [cssFor('flint-link'), cssFor('flint-sr-only')].join('\n') },
      mui: `import Link from '@mui/material/Link';

// The Flint theme sets underline="always" and the link color.
<Link href="/trips/42">Review the route</Link>`,
      shadcn: `// shadcn/ui has no Link component: style the anchor (or your router's Link) with the tokens.
<a
  href="/trips/42"
  className="text-[var(--link-fg)] underline decoration-from-font underline-offset-[0.15em] hover:decoration-[0.125em] rounded-[var(--radius-xs)] focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]"
>
  Review the route
</a>`,
      swift: `Link("Review the route", destination: routeURL)
  .foregroundStyle(Flint.Component.linkFg)
  .underline()`,
    },
    keyboard: [['Tab', 'Moves focus to the link. A solid 2px ring shows where focus is.'], ['Enter', 'Follows the link. Space does not: that is a button.']],
    screenReader: [
      'The link text is its name. Make it say where it goes.',
      'A link that opens a new tab says so in text. The arrow is hidden from screen readers.',
      'Use a real <a href>. A <span> with a click handler is not reachable by keyboard and has no link role.',
      'Same-page links move focus to the target heading, not just the scroll position.',
    ],
    target: 'Inline links follow the text size, which WCAG 2.5.8 exempts. Standalone links are at least 24px tall (targetMin).',
  },
  'skip-link': {
    name: 'Skip link',
    tokens: 'skipLink',
    pairs: 'skip link',
    lead: 'A skip link lets keyboard users jump past the header and navigation to the main content. It is the first stop on Tab, and stays hidden until it gets focus.',
    example: `<a class="flint-skip-link" href="#example">Skip to content</a>
<p>Tab into this box and the skip link appears at its top corner. Press Enter and focus moves to the Example heading. On a real page it is the first Tab stop.</p>`,
    when: [
      'Put one skip link first in <body> on every page with a repeated header or navigation.',
      'Point it at the main heading (the h1). A heading has a name, so screen readers announce where people landed.',
      'Add a second one only for a big repeated block, like "Skip to results". Two at most.',
    ],
    variants: [
      ['Hidden', 'Clipped out of view until it gets focus. Screen readers can still reach it.'],
      ['Focused', 'Appears over the top corner on the primary fill (skipLink.bg), with the focus ring.'],
    ],
    guidance: [
      ['Say where it goes: "Skip to content".', 'Write "Skip" alone. People should know where they will land.'],
      ['Move focus to the heading in script, then let the reader stop there.', 'Rely on the browser\'s fragment jump. It can scroll without moving focus, so the next Tab starts back at the top.'],
      ['Hide it only until it has focus.', 'Hide it with display: none or visibility: hidden. Then nobody can reach it.'],
    ],
    code: {
      css: { label: 'HTML', code: `<body>
  <a class="flint-skip-link" href="#page-title">Skip to content</a>
  <header>...</header>
  <main>
    <h1 id="page-title" tabindex="-1">Trips</h1>
    ...
  </main>
  <script>
    // Move focus to the heading, not just the scroll position.
    // The browser's own jump can leave focus on <body>.
    document.querySelector('.flint-skip-link').addEventListener('click', (e) => {
      const target = document.getElementById(e.currentTarget.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      target.focus();
      history.pushState(null, '', e.currentTarget.hash);
    });
  </script>
</body>`, rules: cssFor('flint-skip-link') },
      mui: `// MUI has no skip link. Use the plain CSS class on an anchor, first in the app shell.
<a className="flint-skip-link" href="#page-title" onClick={focusTarget}>Skip to content</a>`,
      muiGap: 'MUI has no skip link component. Load Flint\'s components.css and use the class above.',
      shadcnNote: 'shadcn/ui has no skip link. This is a plain anchor on the skip link tokens; pair it with the focus script from the CSS tab.',
      shadcn: `<a
  href="#page-title"
  className="absolute left-4 top-2 z-[var(--z-toast)] inline-flex min-h-[var(--button-height)] items-center rounded-[var(--skip-link-radius)] border border-transparent bg-[var(--skip-link-bg)] px-4 text-sm font-bold text-[var(--skip-link-fg)] underline whitespace-nowrap [clip-path:inset(50%)] focus:[clip-path:none] focus:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus:[outline-offset:var(--focus-ring-offset)]"
>
  Skip to content
</a>`,
      swift: `// iOS has no skip link. VoiceOver users jump by heading with the rotor,
// so mark each screen's title as a header.
Text("Trips")
  .font(.largeTitle.bold())
  .accessibilityAddTraits(.isHeader)`,
      swiftNote: 'On iOS, headings do the skip link\'s job. On macOS web views, the web skip link applies.',
    },
    keyboard: [
      ['Tab', 'From the top of the page, the first Tab shows the skip link and focuses it.'],
      ['Enter', 'Follows it. Focus moves to the main heading, and the next Tab continues from there.'],
    ],
    screenReader: [
      'Read as "Skip to content, link". The link text is its name.',
      'Focus lands on the heading, so its name is announced. Reading stops there; people decide what to read next.',
      'The target heading needs tabindex="-1" so it can take focus without joining the Tab order.',
    ],
    target: 'Focused, it is 40px tall (button.height), above the 24px minimum.',
  },
  icon: {
    name: 'Icon',
    lead: 'Icons help people scan. Flint draws them at three sizes in the text color, and never lets an icon carry meaning without a name.',
    example: `<div class="example-row">
  ${ico('flint-icon flint-icon--sm', 'role="img" aria-label="Passed, small"', CHECK)}
  ${ico('flint-icon', 'role="img" aria-label="Passed, medium"', CHECK)}
  ${ico('flint-icon flint-icon--lg', 'role="img" aria-label="Passed, large"', CHECK)}
</div>
<p class="example-row">${ico('flint-icon flint-icon--muted', 'aria-hidden="true" focusable="false"', CLOCK)} Last scanned 2 hours ago</p>`,
    when: [
      'Use an icon next to a label to help people scan: a list, a toolbar, a status column.',
      'Use an icon alone only when it is common and named: close, search, menu.',
      'Use words when the meaning is not obvious. An icon nobody recognizes slows everyone down.',
    ],
    variants: [
      ['Small', 'flint-icon--sm, 16px (icon.sm). Next to 12 to 14px text.'],
      ['Medium', '20px (icon.md), the default. Next to 16px text.'],
      ['Large', 'flint-icon--lg, 24px (icon.lg). Headers and empty states.'],
      ['Muted', 'flint-icon--muted (icon.fgMuted). Supporting detail like timestamps. Still above 3:1.'],
    ],
    guidance: [
      ['Pair an icon with a word, or name it with role="img" and aria-label.', 'Leave a lone icon unnamed. A screen reader says nothing, or reads a file name.'],
      ['Draw in currentColor so the icon follows text color, dark mode and forced colors.', 'Bake a color into the svg. It disappears in dark mode or a Windows contrast theme.'],
      ['Name an icon-only button on the button, and hide its icon.', 'Name the svg inside a button and leave the button itself unnamed.'],
    ],
    code: {
      css: { label: 'HTML', code: `<!-- Decorative: the words next to it say the same thing -->
<svg class="flint-icon flint-icon--muted" viewBox="0 0 20 20" aria-hidden="true" focusable="false">...</svg>
Last scanned 2 hours ago

<!-- Means something on its own -->
<svg class="flint-icon" viewBox="0 0 20 20" role="img" aria-label="Passed">...</svg>`, rules: cssFor('flint-icon') },
      mui: `import SvgIcon from '@mui/material/SvgIcon';

// Set size and color from the icon tokens. titleAccess names it (role="img").
<SvgIcon titleAccess="Passed" sx={{ fontSize: 'var(--icon-md)', color: 'var(--icon-fg)' }}>
  <path d="..." />
</SvgIcon>`,
      shadcnNote: 'shadcn/ui draws icons with lucide-react. Size and color them from the icon tokens.',
      shadcn: `import { CircleCheck, Clock } from 'lucide-react';

// Decorative, next to words
<Clock aria-hidden="true" className="size-[var(--icon-md)] text-[var(--icon-fg-muted)]" />

// Means something on its own
<CircleCheck role="img" aria-label="Passed" className="size-[var(--icon-md)] text-[var(--icon-fg)]" />`,
      swift: `Image(systemName: "checkmark.circle")
  .font(.system(size: Flint.Component.iconMd))
  .foregroundStyle(Flint.Component.iconFg)
  .accessibilityLabel("Passed")

// Decorative, next to words: Label hides the image from VoiceOver.
Label("Last scanned 2 hours ago", systemImage: "clock")`,
    },
    keyboard: [['None', 'Icons are not interactive. A clickable icon is a button: use flint-btn--icon.']],
    screenReader: [
      'A decorative icon has aria-hidden="true", so it is skipped.',
      'An icon on its own has role="img" and an aria-label that says what it means ("Passed"), not what it shows ("green check").',
      'In an icon-only button the name goes on the button, and the icon is aria-hidden.',
    ],
    target: 'Not interactive, so no target size. An icon-only button is still 40px, or 32px small (button.height, button.heightSm).',
  },
  dialog: {
    name: 'Dialog',
    lead: 'A dialog stops the page to ask one question or finish one small task. Everything behind it waits until it closes.',
    example: `<button type="button" class="flint-btn flint-btn--danger" data-flint-dialog-open="delete-__P__">Delete trip</button>
<dialog class="flint-dialog" id="delete-__P__" aria-labelledby="delete-title-__P__">
  <div class="flint-dialog__header">
    <h2 class="flint-dialog__title" id="delete-title-__P__">Delete this trip?</h2>
    <button type="button" class="flint-btn flint-btn--text flint-btn--icon" data-flint-dialog-close aria-label="Close">${closeIcon}</button>
  </div>
  <div class="flint-dialog__body"><p>Turkey Bend, 3 stops, leaving Friday. The route and packing list go with it. You can't undo this.</p></div>
  <div class="flint-dialog__footer">
    <button type="button" class="flint-btn flint-btn--secondary" data-flint-dialog-close>Keep trip</button>
    <button type="button" class="flint-btn flint-btn--danger" data-flint-dialog-close>Delete trip</button>
  </div>
</dialog>`,
    when: [
      'Use a dialog to confirm something that can\'t be undone, or for a short task that has to finish before going on.',
      'Use the page itself for anything long, or anything people will want to compare with what is behind it.',
      'Use a toast to say something already happened. A dialog asks; a toast tells.',
    ],
    variants: [
      ['Header', 'flint-dialog__title is the dialog\'s name (aria-labelledby). A close button sits beside it.'],
      ['Body', 'flint-dialog__body scrolls if the content is taller than the window.'],
      ['Footer', 'flint-dialog__footer holds the actions, the main one last.'],
    ],
    guidance: [
      ['Title it with the question: "Delete this trip?". Label buttons with what they do: "Delete trip", "Keep trip".', 'Ask "Are you sure?" with OK and Cancel. People have to read the whole thing to know what OK does.'],
      ['Open it from something the person just did.', 'Open a dialog on page load. It hides the page before anyone knows why.'],
      ['Let Esc and the close button always close it.', 'Trap people in a dialog until they pick an answer.'],
    ],
    code: {
      css: { label: 'HTML', code: `<button type="button" class="flint-btn flint-btn--danger" data-flint-dialog-open="delete-trip">Delete trip</button>

<dialog class="flint-dialog" id="delete-trip" aria-labelledby="delete-trip-title">
  <div class="flint-dialog__header">
    <h2 class="flint-dialog__title" id="delete-trip-title">Delete this trip?</h2>
    <button type="button" class="flint-btn flint-btn--text flint-btn--icon" data-flint-dialog-close aria-label="Close">
      <svg aria-hidden="true" focusable="false">...</svg>
    </button>
  </div>
  <div class="flint-dialog__body"><p>The route and packing list go with it. You can't undo this.</p></div>
  <div class="flint-dialog__footer">
    <button type="button" class="flint-btn flint-btn--secondary" data-flint-dialog-close>Keep trip</button>
    <button type="button" class="flint-btn flint-btn--danger" data-flint-dialog-close>Delete trip</button>
  </div>
</dialog>

<script type="module">
  // showModal() traps focus and closes on Esc; initDialogs also returns focus to the opener.
  import { initDialogs } from '@innerspark/flint/behaviors.js';
  initDialogs();
</script>`, rules: cssFor('flint-dialog') },
      mui: `import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

<Dialog open={open} onClose={close} aria-labelledby="delete-trip-title">
  <DialogTitle id="delete-trip-title">Delete this trip?</DialogTitle>
  <DialogContent>The route and packing list go with it. You can't undo this.</DialogContent>
  <DialogActions>
    <Button variant="outlined" onClick={close}>Keep trip</Button>
    <Button variant="contained" color="error" onClick={remove}>Delete trip</Button>
  </DialogActions>
</Dialog>`,
      muiGap: 'MUI\'s Dialog has no close button of its own; add one in the title. Its paper reads the dialog shadow and radius from the Flint theme, but not dialog.border.',
      shadcn: shadDialog,
      swift: `.alert("Delete this trip?", isPresented: $confirming) {
  Button("Delete trip", role: .destructive, action: deleteTrip)
  Button("Keep trip", role: .cancel) {}
} message: {
  Text("The route and packing list go with it. You can't undo this.")
}`,
      swiftNote: 'On iOS, use the system alert or a sheet: they trap VoiceOver focus and support Escape on a keyboard for free.',
    },
    keyboard: [['Tab and Shift+Tab', 'Move between the controls in the dialog. Focus can\'t leave it.'], ['Esc', 'Closes the dialog. Focus goes back to the button that opened it.'], ['Enter or Space', 'Activates the focused button.']],
    screenReader: [
      'Opening it moves focus into the dialog, and the title is read as its name.',
      'The page behind it is inert: screen readers can\'t wander out of the dialog.',
      'When it closes, focus returns to the button that opened it, so people pick up where they were.',
    ],
    target: 'The close button and actions are buttons, 40px tall.',
  },
  tabs: {
    name: 'Tabs',
    lead: 'Tabs switch between views of the same thing without leaving the page. One panel shows at a time.',
    example: `<div class="flint-tabs">
  <div class="flint-tabs__list" role="tablist" aria-label="Trip details">
    <button type="button" role="tab" class="flint-tabs__tab" id="t-route-__P__" aria-selected="true" aria-controls="p-route-__P__">Route</button>
    <button type="button" role="tab" class="flint-tabs__tab" id="t-pack-__P__" aria-selected="false" aria-controls="p-pack-__P__" tabindex="-1">Packing</button>
    <button type="button" role="tab" class="flint-tabs__tab" id="t-sites-__P__" aria-selected="false" aria-controls="p-sites-__P__" tabindex="-1">Campsites</button>
  </div>
  <div class="flint-tabs__panel" role="tabpanel" id="p-route-__P__" aria-labelledby="t-route-__P__" tabindex="0"><p>3 stops, 212 miles, leaving Friday at 7am.</p></div>
  <div class="flint-tabs__panel" role="tabpanel" id="p-pack-__P__" aria-labelledby="t-pack-__P__" tabindex="0" hidden><p>14 of 20 items packed.</p></div>
  <div class="flint-tabs__panel" role="tabpanel" id="p-sites-__P__" aria-labelledby="t-sites-__P__" tabindex="0" hidden><p>Turkey Bend, Pace Bend, Muleshoe Bend.</p></div>
</div>`,
    when: [
      'Use tabs for two to six views of the same object: a trip\'s route, packing list and campsites.',
      'Use separate pages, or links, when the views are different things or people need to share a link to each.',
      'Don\'t use tabs for steps in a sequence. Use a step-by-step flow instead.',
    ],
    variants: [
      ['Selected', 'aria-selected="true". A 4px bar and an extra-bold label, so it never rests on color alone.'],
      ['Hover', 'The label darkens and a subtle fill appears.'],
      ['Focus', 'The ring sits inside the tab, so the list\'s scroll edge never clips it.'],
    ],
    guidance: [
      ['Keep labels to one or two words, and keep their order fixed.', 'Reorder tabs based on use. People learn where things are.'],
      ['Show what the panel holds, so a person never has to visit every tab to find something.', 'Hide an error inside a tab people haven\'t opened. Flag it on the tab label, in words.'],
    ],
    code: {
      css: { label: 'HTML', code: `<div class="flint-tabs">
  <div class="flint-tabs__list" role="tablist" aria-label="Trip details">
    <button type="button" role="tab" class="flint-tabs__tab" id="tab-route" aria-selected="true" aria-controls="panel-route">Route</button>
    <button type="button" role="tab" class="flint-tabs__tab" id="tab-packing" aria-selected="false" aria-controls="panel-packing" tabindex="-1">Packing</button>
  </div>
  <div class="flint-tabs__panel" role="tabpanel" id="panel-route" aria-labelledby="tab-route" tabindex="0">...</div>
  <div class="flint-tabs__panel" role="tabpanel" id="panel-packing" aria-labelledby="tab-packing" tabindex="0" hidden>...</div>
</div>

<script type="module">
  import { initTabs } from '@innerspark/flint/behaviors.js';
  initTabs(); // arrow keys, Home and End, roving focus
</script>`, rules: cssFor('flint-tabs') },
      mui: `import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

<Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="Trip details">
  <Tab label="Route" id="tab-route" aria-controls="panel-route" />
  <Tab label="Packing" id="tab-packing" aria-controls="panel-packing" />
</Tabs>`,
      muiGap: 'The Flint MUI theme gives tabs the 4px bar, 40px height, heavier selected weight and an inset focus ring. MUI renders no panels: add role="tabpanel" elements and pass id and aria-controls to each Tab yourself.',
      shadcn: shadTabs,
      swift: `Picker("Trip details", selection: $section) {
  Text("Route").tag(Section.route)
  Text("Packing").tag(Section.packing)
}
.pickerStyle(.segmented)`,
      swiftNote: 'On iOS, a segmented control does this job inside a screen; a TabView is for app-level navigation.',
    },
    keyboard: [['Tab', 'Moves into the tab list (to the selected tab), then on into its panel.'], ['Left and Right', 'Move to the previous or next tab and show it. They wrap at the ends.'], ['Home and End', 'Jump to the first or last tab.']],
    screenReader: [
      'Read as "Route, tab, selected, 1 of 3". The list has a name, like "Trip details".',
      'Each panel is named by its tab, so landing in it says where you are.',
      'Only the selected tab is in the Tab order. The arrow keys reach the rest.',
    ],
    target: 'Tabs are 40px tall (control.md).',
  },
  menu: {
    name: 'Menu',
    lead: 'A menu button opens a short list of actions for one thing. Pick one, and the menu closes.',
    example: `<div class="flint-menu-anchor">
  <button type="button" class="flint-btn flint-btn--secondary" id="trip-btn-__P__" aria-haspopup="menu" aria-expanded="false" aria-controls="trip-menu-__P__">Trip actions</button>
  <ul class="flint-menu" role="menu" id="trip-menu-__P__" aria-labelledby="trip-btn-__P__" hidden>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item">Rename</button></li>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item">Duplicate</button></li>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item" aria-disabled="true">Share (needs sign-in)</button></li>
    <li role="separator" class="flint-menu__separator"></li>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item flint-menu__item--danger">Delete trip</button></li>
  </ul>
</div>`,
    when: [
      'Use a menu for three to seven actions on one thing, when they don\'t all fit as buttons.',
      'Use buttons when there are one or two actions, or when the main action should be visible.',
      'Use a select to choose a value for a form. A menu does something; a select picks something.',
    ],
    variants: [
      ['Item', 'A button with role="menuitem". 40px tall.'],
      ['Danger', 'flint-menu__item--danger. Red, and the label says what it destroys.'],
      ['Disabled', 'aria-disabled="true". Still reachable, so people can read why it is off.'],
      ['Separator', 'Groups related items.'],
    ],
    guidance: [
      ['Label the button with what the menu acts on: "Trip actions".', 'Use a bare "..." icon with no name. Screen readers say "button".'],
      ['Put the destructive action last, after a separator.', 'Put Delete first, where a slip of the finger lands.'],
    ],
    code: {
      css: { label: 'HTML', code: `<div class="flint-menu-anchor">
  <button type="button" class="flint-btn flint-btn--secondary" id="trip-actions" aria-haspopup="menu" aria-expanded="false" aria-controls="trip-menu">Trip actions</button>
  <ul class="flint-menu" role="menu" id="trip-menu" aria-labelledby="trip-actions" hidden>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item">Rename</button></li>
    <li role="separator" class="flint-menu__separator"></li>
    <li role="none"><button type="button" role="menuitem" class="flint-menu__item flint-menu__item--danger">Delete trip</button></li>
  </ul>
</div>

<script type="module">
  import { initMenus } from '@innerspark/flint/behaviors.js';
  initMenus(); // focus in, arrow keys, Esc returns focus, Tab and outside clicks close
</script>`, rules: cssFor('flint-menu') },
      mui: `import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

<Button id="trip-actions" aria-haspopup="menu" aria-expanded={open} aria-controls="trip-menu" onClick={(e) => setAnchor(e.currentTarget)}>Trip actions</Button>
<Menu id="trip-menu" anchorEl={anchor} open={open} onClose={close} slotProps={{ list: { 'aria-labelledby': 'trip-actions' } }}>
  <MenuItem onClick={rename}>Rename</MenuItem>
  <MenuItem onClick={remove} sx={{ color: 'var(--menu-item-fg-danger)' }}>Delete trip</MenuItem>
</Menu>`,
      muiGap: 'MUI has no danger item style: color it with menu.itemFgDanger as above. The Flint theme sets the 40px item height and hover fill.',
      shadcn: shadMenu,
      swift: `Menu("Trip actions") {
  Button("Rename", action: rename)
  Button("Duplicate", action: duplicate)
  Divider()
  Button("Delete trip", role: .destructive, action: deleteTrip)
}`,
    },
    keyboard: [['Enter, Space or Down', 'Opens the menu and focuses the first item. Up opens it on the last.'], ['Up and Down', 'Move between items. They wrap.'], ['Home and End', 'Jump to the first or last item.'], ['Esc', 'Closes the menu. Focus returns to the button.'], ['Tab', 'Closes the menu and moves on.']],
    screenReader: [
      'The button is read as "Trip actions, menu button, collapsed", then "expanded" when open.',
      'Items are read as "Rename, menu item, 1 of 4". A disabled item says "dimmed" or "unavailable".',
      'The separator is skipped, but the grouping shows in the count.',
    ],
    target: 'Items are 40px tall (control.md).',
  },
  tooltip: {
    name: 'Tooltip',
    lead: 'A tooltip adds a short hint to a control that already has a name. It shows on hover and on keyboard focus.',
    example: `<div class="example-row tooltip-room">
  <span class="flint-tooltip-anchor">
    <button type="button" class="flint-btn flint-btn--secondary" aria-describedby="tip-export-__P__">Export report</button>
    <span class="flint-tooltip" role="tooltip" id="tip-export-__P__">PDF, about 2 MB</span>
  </span>
</div>`,
    when: [
      'Use a tooltip for a short extra detail: a file size, a keyboard shortcut, why something is off.',
      'Don\'t put anything people need in a tooltip. Touch screens can\'t hover, and many people never find it.',
      'Never make a tooltip the only name of an icon button. Give the button an aria-label.',
    ],
    variants: [['Shown', 'On hover and keyboard focus. It stays while the pointer is over it, and Esc hides it.']],
    guidance: [
      ['Keep it to a few words, with no links or buttons inside.', 'Put a paragraph or a link in a tooltip. Use a popover or the page.'],
      ['Use it on things that already make sense without it.', 'Hide the only explanation of a control in a tooltip.'],
    ],
    code: {
      css: { label: 'HTML', code: `<span class="flint-tooltip-anchor">
  <button type="button" class="flint-btn flint-btn--secondary" aria-describedby="tip-export">Export report</button>
  <span class="flint-tooltip" role="tooltip" id="tip-export">PDF, about 2 MB</span>
</span>

<script type="module">
  import { initTooltips } from '@innerspark/flint/behaviors.js';
  initTooltips(); // Esc hides it without moving focus (WCAG 1.4.13)
</script>`, rules: cssFor('flint-tooltip') },
      mui: `import Tooltip from '@mui/material/Tooltip';

<Tooltip title="PDF, about 2 MB" describeChild>
  <Button variant="outlined">Export report</Button>
</Tooltip>`,
      muiGap: 'Pass describeChild: without it, MUI uses the tooltip as the button\'s name (aria-label) instead of a description.',
      shadcn: shadTooltip,
      swift: `Button("Export report", action: export)
  .help("PDF, about 2 MB")`,
      swiftNote: 'On iOS, .help shows on pointer hover (iPad) and is read by VoiceOver as a hint.',
    },
    keyboard: [['Tab', 'Focusing the control shows the tooltip.'], ['Esc', 'Hides the tooltip. Focus stays where it is.']],
    screenReader: [
      'The tooltip is the control\'s description (aria-describedby): read after its name, like "Export report, button, PDF, about 2 MB".',
      'It is read whether or not it is showing, so the hint isn\'t lost to people who never hover.',
    ],
    target: 'The tooltip itself isn\'t a target. The control it describes keeps its own size.',
  },
  toast: {
    name: 'Toast',
    lead: 'A toast says something just happened, in a corner of the screen, without interrupting. It never takes focus.',
    example: `<div class="example-row">
  <button type="button" class="flint-btn flint-btn--primary" data-toast-demo="toasts-__P__">Save report</button>
  <button type="button" class="flint-btn flint-btn--secondary" data-toast-demo="toasts-__P__" data-toast-undo>Archive trip</button>
</div>
<div class="flint-toast-region" id="toasts-__P__" role="status" aria-live="polite"></div>`,
    when: [
      'Use a toast to confirm something people just did: saved, archived, sent.',
      'Use an alert on the page for anything people must read or act on. Toasts are easy to miss.',
      'Use a dialog when the answer matters before going on.',
    ],
    variants: [
      ['Message', 'A title, and an optional line of detail.'],
      ['With an action', 'One action, like Undo. It stays until dismissed: a timer would take the action away.'],
      ['Arrival', 'Slides up with --ease-emphasis. Under reduced motion it simply appears.'],
    ],
    guidance: [
      ['Say what happened in a few words: "Report saved".', 'Use a toast for errors people need to fix. Put the error next to what caused it.'],
      ['Keep the toast region in the page from the start.', 'Add the live region at the same time as the message. Many screen readers miss it.'],
      ['Let people dismiss it, and pause the timer while they hover or focus it.', 'Make it vanish in two seconds. Slow readers never finish it.'],
    ],
    code: {
      css: { label: 'HTML', code: `<!-- Once, in the page shell: the region exists before any toast -->
<div class="flint-toast-region" id="toasts" role="status" aria-live="polite"></div>

<script type="module">
  import { showToast } from '@innerspark/flint/behaviors.js';
  showToast('#toasts', { title: 'Report saved', body: 'Your VPAT draft is in Reports.' });
  showToast('#toasts', { title: 'Trip archived', action: { label: 'Undo', onClick: restore } }); // stays until dismissed
</script>`, rules: cssFor('flint-toast') },
      mui: `import Snackbar from '@mui/material/Snackbar';

<Snackbar open={open} onClose={close} autoHideDuration={6000} message="Report saved" />`,
      muiGap: 'MUI\'s Snackbar shows one message at a time and times out even with an action; pass autoHideDuration={null} when it has one.',
      shadcn: shadToast,
      swift: `// iOS has no toast. Post an announcement, and show a brief overlay if the change isn't visible.
AccessibilityNotification.Announcement("Report saved").post()`,
      swiftNote: 'On iOS, prefer showing the result in place. Use an announcement so VoiceOver users hear it.',
    },
    keyboard: [['Tab', 'Toasts never take focus. Their buttons join the Tab order where the region sits.'], ['Enter or Space', 'Activates Undo or Dismiss.']],
    screenReader: [
      'The region is a polite live region, so each toast is read once the screen reader finishes what it is saying.',
      'Focus stays where it was. Nothing jumps.',
      'The dismiss button is named with the toast, like "Dismiss: Report saved".',
    ],
    target: 'Undo and Dismiss are at least 24px (targetMin).',
  },
  badge: {
    name: 'Badge',
    lead: 'A badge is a short, static label for a status: Passed, Needs review, Failed. It is not clickable. If people can act on it, use a chip.',
    example: `<div class="example-row">
  <span class="flint-badge">Draft</span>
  <span class="flint-badge flint-badge--success">Passed</span>
  <span class="flint-badge flint-badge--warning">Needs review</span>
  <span class="flint-badge flint-badge--error">Failed</span>
  <span class="flint-badge flint-badge--info">New</span>
</div>`,
    when: [
      'Use a badge to label the status of a row, a card or a check.',
      'Use a chip when people can remove it or filter by it.',
      'Use an alert when the status needs a sentence of explanation.',
    ],
    variants: [
      ['Neutral', 'No judgement: Draft, Archived, a count.'],
      ['Success, warning, error, info', 'The feedback families. Each label stays above 7:1 on its fill.'],
    ],
    guidance: [
      ['Say the status in words: "Failed".', 'Use a red dot with no text. Color alone tells some people nothing.'],
      ['Keep it to one or two words.', 'Put a sentence in a badge. Use an alert.'],
      ['Use red only for something that failed or went wrong.', 'Use the error intent to make something stand out.'],
    ],
    code: {
      css: { label: 'HTML', code: '<span class="flint-badge flint-badge--success">Passed</span>\n<span class="flint-badge flint-badge--error">Failed</span>', rules: cssFor('flint-badge') },
      mui: `import Chip from '@mui/material/Chip';

// MUI has no static badge with text; a small Chip is the closest. MUI's Badge is a dot or count on an icon.
<Chip size="small" color="success" label="Passed" />`,
      shadcn: `// shadcn/ui Badge, on Flint's badge tokens:
<span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]">
  Passed
</span>`,
      swift: `Text("Passed")
  .font(.caption.weight(.semibold))
  .foregroundStyle(Flint.Component.badgeSuccessFg)
  .padding(.horizontal, Flint.Space.s8)
  .padding(.vertical, Flint.Space.s2)
  .background(Flint.Component.badgeSuccessBg, in: Capsule())`,
    },
    keyboard: [['None', 'Badges are not interactive and take no focus.']],
    screenReader: [
      'The badge text is read as part of its row or card. Make sure it reads well there: "Contrast, Failed".',
      'If the badge is only an icon or a number, add visually hidden text that says what it means.',
    ],
    target: 'Not interactive, so no target size. The text is 12px (badge.fontSize), the smallest Flint allows.',
  },
  chip: {
    name: 'Chip',
    lead: 'A chip is a compact label people can act on: an applied filter they can remove, or a tag. Each chip\'s remove button is its own 24px target.',
    example: `<div class="example-row">
  <span class="flint-chip">WCAG 2.2 AA<button type="button" class="flint-chip__remove" aria-label="Remove WCAG 2.2 AA">${closeIcon}</button></span>
  <span class="flint-chip flint-chip--error">Failed only<button type="button" class="flint-chip__remove" aria-label="Remove Failed only">${closeIcon}</button></span>
</div>
<div class="example-row">
  <span class="flint-chip flint-chip--outlined">Mobile</span>
  <span class="flint-chip flint-chip--outlined flint-chip--success">Passing</span>
  <span class="flint-chip flint-chip--info">Beta</span>
</div>`,
    when: [
      'Use chips for filters people have applied and can take off one at a time.',
      'Use a badge for a status that people can\'t change.',
      'Use checkboxes when people pick filters from a list in the first place.',
    ],
    variants: [
      ['Filled', 'The default: a tinted fill from chip.*.bg.'],
      ['Outlined', 'flint-chip--outlined: no fill, so the edge (chip.*.border, 3:1 and up) shows where it is.'],
      ['Removable', 'A flint-chip__remove button at the end, named after the chip: "Remove WCAG 2.2 AA".'],
    ],
    guidance: [
      ['Name each remove button after its chip.', 'Give every remove button the same "Remove" or "x" name. A screen reader user can\'t tell them apart.'],
      ['After a chip is removed, move focus to the next chip, or to the filter control if none are left.', 'Let focus fall back to the top of the page.'],
      ['Keep chip labels short and parallel.', 'Mix sentences and single words in one row.'],
    ],
    code: {
      css: { label: 'HTML', code: '<span class="flint-chip">\n  WCAG 2.2 AA\n  <button type="button" class="flint-chip__remove" aria-label="Remove WCAG 2.2 AA">\n    <svg aria-hidden="true">...</svg>\n  </button>\n</span>\n<span class="flint-chip flint-chip--outlined">Mobile</span>', rules: cssFor('flint-chip') },
      mui: `import Chip from '@mui/material/Chip';

<Chip label="WCAG 2.2 AA" onDelete={remove} />
<Chip label="Mobile" variant="outlined" />`,
      shadcn: `// shadcn/ui has no chip; a Badge with a button, on Flint's chip tokens:
<span className="inline-flex items-center gap-1 rounded-full min-h-[var(--control-sm)] pl-3 pr-1 text-sm font-semibold bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-fg)]">
  WCAG 2.2 AA
  <button type="button" aria-label="Remove WCAG 2.2 AA" className="grid size-6 place-content-center rounded-full">
    <XIcon aria-hidden="true" className="size-4" />
  </button>
</span>`,
      swift: `HStack(spacing: Flint.Space.s4) {
  Text("WCAG 2.2 AA")
  Button { remove() } label: { Image(systemName: "xmark") }
    .accessibilityLabel("Remove WCAG 2.2 AA")
}
.padding(.leading, Flint.Space.s12)
.frame(minHeight: Flint.Target.touch)
.background(Flint.Component.chipNeutralBg, in: Capsule())`,
      muiGap: 'MUI names every delete icon the same way, so a list of chips reads as several identical buttons. Pass a label to each delete icon.',
    },
    keyboard: [['Tab', 'Moves to each remove button.'], ['Enter or Space', 'Removes that chip.']],
    screenReader: [
      'Each remove button is named after its chip: "Remove WCAG 2.2 AA".',
      'When a chip goes away, move focus to the next chip, and announce the change if results update.',
      'A chip without a remove button is just text, and takes no focus.',
    ],
    target: 'Chips are 32px tall (control.sm). The remove button is 24px (targetMin).',
  },
  alert: {
    name: 'Alert',
    lead: 'An alert tells people something about the page or a task they just did: it worked, it needs a look, or it failed. Icon and words, in one feedback color family.',
    example: `<div class="flint-alert">${infoIcon}<p class="flint-alert__title">Scan scheduled</p><p class="flint-alert__body">We'll email you when the report is ready, usually in a few minutes.</p></div>
<div class="flint-alert flint-alert--success">${successIcon}<p class="flint-alert__title">Report saved</p><p class="flint-alert__body">Your VPAT draft is in Reports.</p></div>
<div class="flint-alert flint-alert--warning">${warningIcon}<p class="flint-alert__title">12 checks need a person</p><p class="flint-alert__body">Automated tests can't judge these. <a href="#">Review them</a> before you export.</p></div>
<div class="flint-alert flint-alert--error">${alertErrorIcon}<p class="flint-alert__title">We couldn't reach the site</p><p class="flint-alert__body">Check the address, or allow AccessSpark through your firewall.</p></div>`,
    when: [
      'Use an alert for a message about the whole page or the last thing people did.',
      'Use a field error for a problem with one field.',
      'Use a badge for a one-word status on a row or card.',
    ],
    variants: [
      ['Info', 'Default. Something people should know.'],
      ['Success', 'It worked.'],
      ['Warning', 'It worked, but something needs a look.'],
      ['Error', 'It failed. Say how to fix it.'],
    ],
    guidance: [
      ['Lead with the result, then what to do: "We couldn\'t reach the site. Check the address."', 'Lead with a code: "Error 504".'],
      ['Keep the icon and the words. The icon is aria-hidden; the words carry the meaning.', 'Rely on the color of the box to say success or failure.'],
      ['Put the alert near the thing it is about.', 'Stack alerts at the top of a long page, far from the cause.'],
    ],
    code: {
      css: { label: 'HTML', code: `<div class="flint-alert flint-alert--error">
  <svg aria-hidden="true">...</svg>
  <p class="flint-alert__title">We couldn't reach the site</p>
  <p class="flint-alert__body">Check the address, or allow AccessSpark through your firewall.</p>
</div>

<!-- Added after load? Put it in a live region that is already on the page -->
<div role="status"><!-- success, info, warning go here --></div>
<div role="alert"><!-- errors go here --></div>`, rules: cssFor('flint-alert') },
      mui: `import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

<Alert severity="error">
  <AlertTitle>We couldn't reach the site</AlertTitle>
  Check the address, or allow AccessSpark through your firewall.
</Alert>`,
      shadcn: `// shadcn/ui Alert, on Flint's feedback tokens:
<div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[var(--radius-md)] border border-[var(--color-feedback-error-border)] border-l-4 border-l-[var(--color-feedback-error-solid)] bg-[var(--color-feedback-error-surface)] p-4 text-sm text-[var(--color-feedback-error-text)]">
  <CircleXIcon aria-hidden="true" className="row-span-2 size-5" />
  <p className="font-bold">We couldn't reach the site</p>
  <p>Check the address, or allow AccessSpark through your firewall.</p>
</div>`,
      swift: `Label {
  VStack(alignment: .leading) {
    Text("We couldn't reach the site").bold()
    Text("Check the address, or allow AccessSpark through your firewall.")
  }
} icon: { Image(systemName: "xmark.circle") }
.foregroundStyle(Flint.Colors.feedbackErrorText)
.padding(Flint.Space.s16)
.background(Flint.Colors.feedbackErrorSurface, in: RoundedRectangle(cornerRadius: 12))`,
      muiGap: 'MUI Alert sets role="alert" on every alert, so a static info message is announced as urgent. Pass role="status" (or none) for anything that isn\'t an error.',
    },
    keyboard: [['None', 'Alerts take no focus. Links or buttons inside them are reached with Tab as usual.']],
    screenReader: [
      'Static alerts that are on the page from the start are plain markup. They are read in order with everything else.',
      'An alert added after load goes in a live region that already exists: role="status" for info and success, role="alert" for errors.',
      'Don\'t move focus to an alert unless people have to act on it before anything else.',
    ],
    target: 'Not interactive. Links inside follow the Link rules.',
  },
  select: {
    name: 'Select',
    lead: 'A select picks one answer from a list that is too long for radio buttons. Flint styles the native select, so the list itself is the platform\'s own: it works with every keyboard, screen reader and phone.',
    example: `<div class="flint-field">
  <label class="flint-field__label" for="standard-__P__">Standard</label>
  <select id="standard-__P__" class="flint-select">
    <option>WCAG 2.2 AA</option>
    <option>WCAG 2.1 AA</option>
    <option>Section 508</option>
    <option>EN 301 549</option>
  </select>
</div>
<div class="flint-field">
  <label class="flint-field__label" for="region-__P__">Data region</label>
  <select id="region-__P__" class="flint-select" aria-invalid="true" aria-describedby="region-error-__P__">
    <option value="" selected>Choose a region</option>
    <option>United States</option>
    <option>European Union</option>
  </select>
  <span class="flint-field__error" id="region-error-__P__">${errorIcon}Choose where your reports are stored.</span>
</div>`,
    when: [
      'Use a select for one answer from a list of about seven or more, or a list people already know, like countries.',
      'Use radio buttons for a short list, so every option shows without opening anything.',
      'Use a combobox with search (coming in the React layer) for very long lists.',
    ],
    variants: [
      ['Default', 'Shows the chosen option. The arrow is drawn in select.icon.'],
      ['Placeholder', 'An empty first option ("Choose a region") shows in the placeholder color until something is picked.'],
      ['Error', 'aria-invalid="true" turns the edge red; the message replaces the helper, as in Field.'],
      ['Disabled', 'Can\'t be changed right now. Say why nearby.'],
    ],
    guidance: [
      ['Keep the native select. It works the same everywhere people already use it.', 'Rebuild it from divs. Custom listboxes break keyboards and screen readers unless built with great care.'],
      ['Order options in a way people expect: alphabetical, by size, or most common first.', 'Leave them in database order.'],
      ['Pick a sensible default when there is one.', 'Force an empty "Choose" step when almost everyone picks the same thing.'],
    ],
    code: {
      css: { label: 'HTML', code: '<label class="flint-field__label" for="standard">Standard</label>\n<select id="standard" class="flint-select">\n  <option>WCAG 2.2 AA</option>\n  <option>Section 508</option>\n</select>', rules: cssFor('flint-select') },
      mui: `import TextField from '@mui/material/TextField';

// The native list, like Flint: select + SelectProps={{ native: true }}.
<TextField select label="Standard" SelectProps={{ native: true }}>
  <option>WCAG 2.2 AA</option>
  <option>Section 508</option>
</TextField>`,
      shadcn: `// shadcn/ui's Select is a Radix listbox. For a plain choice, a styled native select is simpler and
// works the same on every platform:
<select className="h-[var(--select-height)] w-full appearance-none rounded-[var(--select-radius)] border border-[var(--select-border)] bg-[var(--select-bg)] px-3 text-[var(--select-fg)]">
  <option>WCAG 2.2 AA</option>
  <option>Section 508</option>
</select>`,
      swift: `Picker("Standard", selection: $standard) {
  ForEach(Standard.allCases) { Text($0.label).tag($0) }
}
.pickerStyle(.menu)
.tint(Flint.Component.selectFg)`,
      muiGap: 'The MUI select draws its own arrow in MUI\'s icon color unless the theme sets it (Flint\'s theme reads select.icon).',
    },
    keyboard: [['Tab', 'Moves focus to the select.'], ['Space, Enter or Alt+Down', 'Opens the list.'], ['Up and Down, or typing', 'Changes the choice.']],
    screenReader: [
      'Tie the label to the select with for and id.',
      'An empty first option works as a placeholder; give it value="" so the select reads as unanswered.',
      'Set aria-invalid="true" and point aria-describedby at the error message.',
    ],
    target: 'Selects are 40px tall (control.md), like inputs.',
  },
  switch: {
    name: 'Switch',
    lead: 'A switch turns one setting on or off, and the change takes effect right away. There is no save button behind it.',
    example: `<div class="flint-fieldset">
  <label class="flint-choice"><input type="checkbox" role="switch" class="flint-switch" checked /> Show passing checks in reports</label>
  <label class="flint-choice"><input type="checkbox" role="switch" class="flint-switch" /> Email me a weekly summary</label>
  <label class="flint-choice"><input type="checkbox" role="switch" class="flint-switch" disabled /> Scan pages behind sign-in (needs saved credentials)</label>
</div>`,
    when: [
      'Use a switch for a setting that applies the moment it changes: a preference, a feature flag, a notification.',
      'Use a checkbox when the choice only counts after people submit a form.',
      'Use radio buttons when there are more than two options, or when "off" needs its own name.',
    ],
    variants: [
      ['Off', 'The thumb sits on the left on the neutral track.'],
      ['On', 'The thumb moves right and the track fills. Position and fill both change, so it is never color alone.'],
      ['Disabled', 'The setting can\'t be changed right now. Say why next to it.'],
    ],
    guidance: [
      ['Label the setting: "Email me a weekly summary".', 'Label the state: "On" or "Enabled". The switch already shows the state.'],
      ['Apply the change right away, and show the result if it takes a moment.', 'Put a switch in a form that needs a Save button. Use a checkbox there.'],
      ['Keep the label the same in both states.', 'Swap the label text when it toggles. People lose track of what they changed.'],
    ],
    code: {
      css: { label: 'HTML', code: '<label class="flint-choice">\n  <input type="checkbox" role="switch" class="flint-switch" checked />\n  Show passing checks in reports\n</label>', rules: cssFor('flint-switch') },
      mui: `import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

<FormControlLabel control={<Switch defaultChecked />} label="Show passing checks in reports" />`,
      shadcn: shadSwitch,
      swift: `Toggle("Show passing checks in reports", isOn: $showPassing)
  .tint(Flint.Component.switchTrackChecked)`,
    },
    keyboard: [['Tab', 'Moves focus to the switch.'], ['Space', 'Turns it on or off.']],
    screenReader: [
      'role="switch" on a native checkbox: screen readers say "switch, on" or "switch, off".',
      'The label names the setting and stays the same in both states.',
      'If the change takes a moment or can fail, announce the result in a live region.',
    ],
    target: 'The track is 48 by 24px (targetMin tall), and the label makes the whole row clickable.',
  },
  checkbox: {
    name: 'Checkbox',
    lead: 'Checkboxes let people pick any number of options from a list, or turn one option on before they submit.',
    example: `<fieldset class="flint-fieldset">
  <legend class="flint-fieldset__legend">Packing list</legend>
  <label class="flint-choice"><input type="checkbox" class="flint-check" data-indeterminate /> All camp gear (some packed)</label>
  <label class="flint-choice"><input type="checkbox" class="flint-check" checked /> Bring the awning lights</label>
  <label class="flint-choice"><input type="checkbox" class="flint-check" /> Pack the Starlink</label>
  <label class="flint-choice"><input type="checkbox" class="flint-check" disabled /> Fill the propane (done at the shop)</label>
</fieldset>
<fieldset class="flint-fieldset" aria-describedby="rules-error-__P__">
  <legend class="flint-fieldset__legend">Campground rules</legend>
  <label class="flint-choice"><input type="checkbox" class="flint-check" aria-invalid="true" /> I read the quiet hours and fire rules</label>
  <span class="flint-field__error" id="rules-error-__P__">${errorIcon}Check this box to book the site.</span>
</fieldset>`,
    when: [
      'Use checkboxes when people can pick several options, or none.',
      'Use radio buttons when exactly one option must be picked.',
      'Use a toggle when the change takes effect right away, with no submit.',
    ],
    variants: [
      ['Unchecked', 'The option is off.'],
      ['Checked', 'The option is on. The fill and the mark both change, so the state is not color alone.'],
      ['Disabled', 'The option can\'t be changed right now. Say why nearby.'],
      ['Indeterminate', 'Some, not all, of the options under it are on. A bar instead of a tick. Set it in script: el.indeterminate = true.'],
      ['Error', 'aria-invalid="true" turns the edge red, and a message under the group says how to fix it.'],
    ],
    guidance: [
      ['Make the whole label clickable, not just the box.', 'Leave a 16px box as the only target.'],
      ['Group related checkboxes under a fieldset with a legend that asks the question.', 'Float a list of checkboxes with no group label.'],
      ['Write labels as positive statements: "Bring the awning lights".', 'Use negatives like "Don\'t skip the lights", which make the checked state confusing.'],
    ],
    code: {
      css: { label: 'HTML', code: '<fieldset class="flint-fieldset">\n  <legend class="flint-fieldset__legend">Packing list</legend>\n  <label class="flint-choice"><input type="checkbox" class="flint-check" id="all-gear" /> All camp gear</label>\n  <label class="flint-choice"><input type="checkbox" class="flint-check" checked /> Bring the awning lights</label>\n  <label class="flint-choice"><input type="checkbox" class="flint-check" /> Pack the Starlink</label>\n</fieldset>\n\n<script>\n  // Some, not all, are checked: show the parent as mixed. There is no HTML attribute for this.\n  document.getElementById(\'all-gear\').indeterminate = true;\n</script>\n\n<!-- Error on a required checkbox: say it in words, tie it to the group -->\n<fieldset class="flint-fieldset" aria-describedby="rules-error">\n  <legend class="flint-fieldset__legend">Campground rules</legend>\n  <label class="flint-choice"><input type="checkbox" class="flint-check" aria-invalid="true" /> I read the quiet hours and fire rules</label>\n  <span class="flint-field__error" id="rules-error">Check this box to book the site.</span>\n</fieldset>', rules: [cssFor('flint-check'), cssFor('flint-choice'), cssFor('flint-fieldset')].join('\n') },
      mui: `import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

<FormControlLabel control={<Checkbox defaultChecked />} label="Bring the awning lights" />`,
      shadcn: shadCheckbox,
      swift: `Toggle("Bring the awning lights", isOn: $bringLights)
  .toggleStyle(.checkbox) // macOS. On iOS, use a list row with a checkmark.`,
      muiGap: 'The Flint MUI theme draws a 24px box and reads aria-invalid. MUI still shows a round halo on hover and focus, and a disabled box has no fill. Pass aria-invalid through slotProps.input; MUI v7 ignores inputProps.',
    },
    keyboard: [['Tab', 'Moves focus to the checkbox.'], ['Space', 'Checks or unchecks it.']],
    screenReader: [
      'Use a native checkbox, or role="checkbox" with aria-checked if you must build one.',
      'Tie the label to the input, so a screen reader reads it and a click on it toggles the box.',
      'Wrap a group in a fieldset with a legend, so the question is read before the options.',
      'An indeterminate checkbox is announced as "mixed". Clicking it should check every option under it.',
      'For a group error, point aria-describedby on the fieldset at the message, so it is read with the question.',
    ],
    target: 'The box is 24px (checkbox.size, the minimum target), and the label extends the clickable area.',
  },
  field: {
    name: 'Field',
    lead: 'A field wraps one control with everything people need to use it: a visible label, optional helper text, and an error message that says how to fix the problem.',
    example: `<div class="flint-field">
  <label class="flint-field__label" for="site-__P__">Site name <span class="flint-field__required">(required)</span></label>
  <input id="site-__P__" class="flint-input" type="text" required aria-describedby="site-help-__P__" />
  <span class="flint-field__helper" id="site-help-__P__">Shown on your report cover.</span>
</div>
<div class="flint-field">
  <label class="flint-field__label" for="url-__P__">Start URL <span class="flint-field__required">(required)</span></label>
  <input id="url-__P__" class="flint-input" type="url" value="example" required aria-invalid="true" aria-describedby="url-error-__P__" />
  <span class="flint-field__error" id="url-error-__P__">${errorIcon}Enter a full address that starts with https://</span>
</div>`,
    when: [
      'Use a field around every input, select and textarea. Checkbox and radio groups use a fieldset and legend instead.',
      'Add helper text when people need a hint before they type: a format, a limit, where the value shows up.',
      'Show the error after people leave the field or submit, not on every keystroke.',
    ],
    variants: [
      ['Default', 'Label and control. The label sits above, always visible.'],
      ['With helper', 'flint-field__helper below the control, wired with aria-describedby.'],
      ['Required', 'flint-field__required says "(required)" in the label, plus the required attribute. If most fields are required, mark the optional ones instead.'],
      ['Error', 'flint-field__error replaces the helper. The control gets aria-invalid="true", and aria-describedby points at the error.'],
    ],
    guidance: [
      ['Say what is wrong and how to fix it: "Enter a full address that starts with https://".', 'Write "Invalid input" or "Error". People have to guess what to change.'],
      ['Replace the helper with the error, so there is one message under the control.', 'Stack the helper and the error, and make people read both.'],
      ['Say "(required)" in words.', 'Mark required fields with a red asterisk alone. Color and symbols get missed.'],
      ['On submit, move focus to the first field with an error.', 'Leave focus on the submit button and show errors somewhere above it.'],
    ],
    code: {
      css: { label: 'HTML', code: `<div class="flint-field">
  <label class="flint-field__label" for="url">Start URL <span class="flint-field__required">(required)</span></label>
  <input id="url" class="flint-input" type="url" required aria-describedby="url-help" />
  <span class="flint-field__helper" id="url-help">The page the crawl starts from.</span>
</div>

<!-- With an error: swap the helper for the error, and point aria-describedby at it -->
<div class="flint-field">
  <label class="flint-field__label" for="url">Start URL <span class="flint-field__required">(required)</span></label>
  <input id="url" class="flint-input" type="url" required aria-invalid="true" aria-describedby="url-error" />
  <span class="flint-field__error" id="url-error"><svg aria-hidden="true">...</svg>Enter a full address that starts with https://</span>
</div>

<script>
  // On submit, focus the first field with an error so screen readers read it right away.
  form.addEventListener('submit', (e) => {
    const bad = form.querySelector('[aria-invalid="true"]');
    if (bad) { e.preventDefault(); bad.focus(); }
  });
</script>`, rules: cssFor('flint-field') },
      mui: `import TextField from '@mui/material/TextField';

<TextField label="Start URL" required error helperText="Enter a full address that starts with https://" />`,
      shadcn: `// shadcn/ui: Label, Input and a message paragraph, tied together with ids.
<div className="grid gap-1">
  <Label htmlFor="url">Start URL <span className="font-normal text-[var(--field-helper-fg)]">(required)</span></Label>
  <Input id="url" type="url" required aria-invalid aria-describedby="url-error" />
  <p id="url-error" className="text-xs font-semibold text-[var(--field-error-fg)]">Enter a full address that starts with https://</p>
</div>`,
      swift: `VStack(alignment: .leading, spacing: Flint.Space.s4) {
  Text("Start URL (required)")
    .flintText(Flint.Typography.labelDefault)
    .foregroundStyle(Flint.Component.fieldLabelFg)
  TextField("", text: $url)
    .accessibilityLabel("Start URL, required")
    .accessibilityHint(error ?? "The page the crawl starts from.")
  Text(error ?? "The page the crawl starts from.")
    .flintText(Flint.Typography.labelHelper)
    .foregroundStyle(error == nil ? Flint.Component.fieldHelperFg : Flint.Component.fieldErrorFg)
}`,
      muiGap: 'MUI TextField marks required with an asterisk only. Add "(required)" to the label text, or set the asterisk aria-hidden and say it in words.',
    },
    keyboard: [['Tab', 'Moves focus to the control. Clicking the label does the same.'], ['Submit with errors', 'Focus moves to the first field with an error.']],
    screenReader: [
      'The label is tied to the control with for and id, so it is read on focus.',
      'aria-describedby points at the helper, or at the error when there is one. Only one message is read.',
      'aria-invalid="true" marks the control as invalid. Remove it when the value is fixed.',
      'The error icon is aria-hidden. The words carry the meaning.',
      'If you show a summary of errors at the top, give it role="alert" and link each item to its field.',
    ],
    target: 'The field follows its control: inputs are 40px tall (control.md). The label is also a click target for the control.',
  },
  input: {
    name: 'Input',
    lead: 'Inputs take a short line of text. In Flint, an input always lives in a form field with a visible label, optional helper text and an error message.',
    example: `<div class="flint-field">
  <label class="flint-field__label" for="campsite-__P__">Campsite name</label>
  <input id="campsite-__P__" class="flint-input" type="text" placeholder="Turkey Bend" aria-describedby="campsite-help-__P__" />
  <span class="flint-field__helper" id="campsite-help-__P__">Shown on your trip card.</span>
</div>
<div class="flint-field">
  <label class="flint-field__label" for="nights-__P__">Nights</label>
  <input id="nights-__P__" class="flint-input" type="text" value="zero" aria-invalid="true" aria-describedby="nights-error-__P__" />
  <span class="flint-field__error" id="nights-error-__P__">${errorIcon}Enter a number from 1 to 14.</span>
</div>
<div class="flint-field">
  <label class="flint-field__label" for="trip-id-__P__">Trip ID</label>
  <input id="trip-id-__P__" class="flint-input" type="text" value="TRP-2042" readonly />
</div>
<div class="flint-field">
  <label class="flint-field__label" for="notes-__P__">Notes for the campground</label>
  <textarea id="notes-__P__" class="flint-input" rows="3"></textarea>
</div>`,
    when: [
      'Use an input for short, free text: names, numbers, codes.',
      'Use the same class on a textarea when the answer may run past one line.',
      'Use a select or radio buttons when the answer comes from a short, known list.',
    ],
    variants: [
      ['Default', 'Empty, with a visible label above it.'],
      ['Filled', 'Holds a value.'],
      ['Error', 'The value has a problem. The edge turns red and the message replaces the helper text.'],
      ['Disabled', 'Can\'t be edited right now.'],
      ['Read-only', 'readonly: the value can be read, selected and copied, but not changed. Stays in the tab order, at full contrast, on a tinted fill (input.bgReadOnly).'],
      ['Multi-line', 'textarea.flint-input: two lines tall to start, people can drag it taller.'],
      ['Types', 'Use the real type (email, url, tel, password, search, number) so phones show the right keyboard and browsers can fill it in.'],
    ],
    guidance: [
      ['Keep a visible label above every input.', 'Use placeholder text as the label. It disappears when people start typing.'],
      ['Say what went wrong and how to fix it: "Enter a number from 1 to 14."', 'Write "Invalid input" and leave people to guess.'],
      ['On submit, move focus to the first field with an error.', 'Show errors only at the top of the page, far from the fields.'],
    ],
    code: {
      css: { label: 'HTML', code: '<label for="nights">Nights</label>\n<input id="nights" class="flint-input" type="text" inputmode="numeric"\n  aria-invalid="true" aria-describedby="nights-error" />\n<span id="nights-error">Enter a number from 1 to 14.</span>\n\n<!-- Let the browser fill it in: the right type and autocomplete -->\n<input id="email" class="flint-input" type="email" autocomplete="email" />\n<input id="pw" class="flint-input" type="password" autocomplete="current-password" />\n\n<!-- Read-only and multi-line -->\n<input id="trip-id" class="flint-input" type="text" value="TRP-2042" readonly />\n<textarea id="notes" class="flint-input" rows="3"></textarea>', rules: cssFor('flint-input') },
      mui: `import TextField from '@mui/material/TextField';

<TextField label="Nights" error helperText="Enter a number from 1 to 14." />`,
      shadcn: shadInput,
      swift: `TextField("Nights", text: $nights)
  .flintText(Flint.Typography.bodyMd)
  .padding(.horizontal, Flint.Space.s12)
  .frame(minHeight: Flint.Target.touch)
  .overlay(RoundedRectangle(cornerRadius: Flint.Component.inputRadius)
    .strokeBorder(hasError ? Flint.Component.inputBorderError : Flint.Component.inputBorder))`,
      muiGap: 'A read-only MUI input looks the same as an editable one. Tint it with input.bgReadOnly if the difference matters.',
    },
    keyboard: [['Tab', 'Moves focus into the input. The edge turns to the focus color and the focus ring shows.'], ['Typing', 'Enters text.']],
    screenReader: [
      'Tie the label to the input with for and id.',
      'Point aria-describedby at the helper text, and at the error message when there is one.',
      'Set aria-invalid="true" on an input with an error.',
      'Set autocomplete on anything about the person (name, email, address, one-time code). WCAG 1.3.5 asks for it, and it saves typing.',
      'Use readonly, not disabled, for a value people need to read or copy. Disabled inputs are skipped by Tab and often too faint to read.',
      'On submit with errors, move focus to the first errored field. Announce a summary with role="alert".',
    ],
    target: 'Inputs are 40px tall (control.md). On iOS, at least 44pt.',
  },
};

// Components on the one-page template (ASDS-94 pilot). Their old tab URLs redirect (public/_redirects),
// and their Workbench and iOS pages fold into the one page.
export const ONE_PAGE = ['button'];

export const TABS = [
  ['usage', 'Usage'],
  ['style', 'Style'],
  ['code', 'Code'],
  ['accessibility', 'Accessibility'],
];
