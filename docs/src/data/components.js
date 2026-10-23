// Component docs content. Live examples use the plain-CSS classes from the workbench; code tabs read
// the workbench source directly, so the docs show the exact code the workbench tests.
import plainCss from '../../../css/components.css?raw';
import shadButton from '../workbench/ui/button.jsx?raw';
import shadInput from '../workbench/ui/input.jsx?raw';
import shadCheckbox from '../workbench/ui/checkbox.jsx?raw';
import shadRadio from '../workbench/ui/radio.jsx?raw';

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
    example: `<fieldset class="example-fieldset">
  <legend>Which site should we scan?</legend>
  <label class="check-row"><input type="radio" name="scan-scope-__P__" class="flint-radio" checked /> Just this page</label>
  <label class="check-row"><input type="radio" name="scan-scope-__P__" class="flint-radio" /> The whole site</label>
  <label class="check-row"><input type="radio" name="scan-scope-__P__" class="flint-radio" disabled /> Pages behind sign-in (needs saved credentials)</label>
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
      css: { label: 'HTML', code: '<fieldset>\n  <legend>Which site should we scan?</legend>\n  <label><input type="radio" name="scan-scope" class="flint-radio" checked /> Just this page</label>\n  <label><input type="radio" name="scan-scope" class="flint-radio" /> The whole site</label>\n</fieldset>', rules: cssFor('flint-radio') },
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
  checkbox: {
    name: 'Checkbox',
    lead: 'Checkboxes let people pick any number of options from a list, or turn one option on before they submit.',
    example: `<label class="check-row"><input type="checkbox" class="flint-check" checked /> Bring the awning lights</label>
<label class="check-row"><input type="checkbox" class="flint-check" /> Pack the Starlink</label>
<label class="check-row"><input type="checkbox" class="flint-check" disabled /> Fill the propane (done at the shop)</label>`,
    when: [
      'Use checkboxes when people can pick several options, or none.',
      'Use radio buttons when exactly one option must be picked.',
      'Use a toggle when the change takes effect right away, with no submit.',
    ],
    variants: [
      ['Unchecked', 'The option is off.'],
      ['Checked', 'The option is on. The fill and the mark both change, so the state is not color alone.'],
      ['Disabled', 'The option can\'t be changed right now. Say why nearby.'],
    ],
    guidance: [
      ['Make the whole label clickable, not just the box.', 'Leave a 16px box as the only target.'],
      ['Group related checkboxes under a fieldset with a legend that asks the question.', 'Float a list of checkboxes with no group label.'],
      ['Write labels as positive statements: "Bring the awning lights".', 'Use negatives like "Don\'t skip the lights", which make the checked state confusing.'],
    ],
    code: {
      css: { label: 'HTML', code: '<fieldset>\n  <legend>Packing list</legend>\n  <label><input type="checkbox" class="flint-check" checked /> Bring the awning lights</label>\n  <label><input type="checkbox" class="flint-check" /> Pack the Starlink</label>\n</fieldset>', rules: cssFor('flint-check') },
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
</div>`,
    when: [
      'Use an input for short, free text: names, numbers, codes.',
      'Use a select or radio buttons when the answer comes from a short, known list.',
    ],
    variants: [
      ['Default', 'Empty, with a visible label above it.'],
      ['Filled', 'Holds a value.'],
      ['Error', 'The value has a problem. The edge turns red and the message replaces the helper text.'],
      ['Disabled', 'Can\'t be edited right now.'],
    ],
    guidance: [
      ['Keep a visible label above every input.', 'Use placeholder text as the label. It disappears when people start typing.'],
      ['Say what went wrong and how to fix it: "Enter a number from 1 to 14."', 'Write "Invalid input" and leave people to guess.'],
      ['On submit, move focus to the first field with an error.', 'Show errors only at the top of the page, far from the fields.'],
    ],
    code: {
      css: { label: 'HTML', code: '<label for="nights">Nights</label>\n<input id="nights" class="flint-input" type="text"\n  aria-invalid="true" aria-describedby="nights-error" />\n<span id="nights-error">Enter a number from 1 to 14.</span>', rules: cssFor('flint-input') },
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
