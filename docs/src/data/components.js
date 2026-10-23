// Component docs content. Live examples use the plain-CSS classes from the workbench; code tabs read
// the workbench source directly, so the docs show the exact code the workbench tests.
import plainCss from '../../../css/components.css?raw';
import shadButton from '../workbench/ui/button.jsx?raw';
import shadInput from '../workbench/ui/input.jsx?raw';
import shadCheckbox from '../workbench/ui/checkbox.jsx?raw';
import shadRadio from '../workbench/ui/radio.jsx?raw';
import shadSwitch from '../workbench/ui/switch.jsx?raw';

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
      css: { label: 'HTML', code: '<button type="button" class="flint-btn flint-btn--primary">Save trip</button>\n<button type="button" class="flint-btn flint-btn--secondary">Add stop</button>\n<button type="button" class="flint-btn flint-btn--danger">Delete trip</button>\n<button type="button" class="flint-btn flint-btn--text">Skip for now</button>\n\n<!-- Busy: keep it focusable, block the click in code -->\n<button type="button" class="flint-btn flint-btn--primary" aria-busy="true" aria-disabled="true">Saving trip</button>\n\n<!-- Icon only: name it, hide the icon -->\n<button type="button" class="flint-btn flint-btn--secondary flint-btn--icon" aria-label="Add stop">\n  <svg aria-hidden="true" focusable="false">...</svg>\n</button>', rules: cssFor('flint-btn') },
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
      muiGap: 'The MUI theme does not apply the secondary and disabled button tokens yet, and its buttons are 36px tall instead of 40px (ASDS-44).',
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
    target: 'Buttons are 40px tall (control.md), above the 24px minimum. On iOS, at least 44pt.',
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
      muiGap: 'The MUI radio reads the radio tokens for its edge, checked fill and disabled color, but keeps MUI\'s own 20px control and its ripple, so it is smaller than the 24px the tokens ask for and smaller than the plain-CSS and shadcn versions (ASDS-44).',
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
      muiGap: 'The MUI switch is a 34x14 track with a 20px thumb that overhangs it, smaller than Flint\'s 48x24.',
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
      muiGap: 'The MUI checkbox shows no focus ring on keyboard focus and draws an 18px box instead of 24px (ASDS-44).',
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
      muiGap: 'The MUI theme leaves the outlined input edge at MUI\'s default, about 1.6:1 (under 3:1), and its placeholder is dimmer than Flint\'s (ASDS-44).',
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

export const TABS = [
  ['usage', 'Usage'],
  ['style', 'Style'],
  ['code', 'Code'],
  ['accessibility', 'Accessibility'],
];
