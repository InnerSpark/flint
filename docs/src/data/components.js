// Component docs content. Live examples use the plain-CSS classes from the workbench; code tabs read
// the workbench source directly, so the docs show the exact code the workbench tests.
import plainCss from '../../../css/components.css?raw';
import shadButton from '../workbench/ui/button.jsx?raw';
import shadInput from '../workbench/ui/input.jsx?raw';
import shadCheckbox from '../workbench/ui/checkbox.jsx?raw';
import shadRadio from '../workbench/ui/radio.jsx?raw';

/** The components.css rules whose selector starts with the given class, comments dropped. */
const cssFor = (cls) => (plainCss.match(/[^{}]+\{[^}]*\}/g) || [])
  .map((block) => block.replace(/\/\*[\s\S]*?\*\//g, '').trim())
  .filter((block) => block.startsWith(`.${cls}`))
  .join('\n');

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
    ],
    guidance: [
      ['One primary button per view. Everything else is secondary or text.', 'Line up two primary buttons and make people guess which one matters.'],
      ['Label with a verb that says what happens: "Save trip", "Delete trip".', 'Use "OK" or "Submit". People should know the result before they click.'],
      ['When a button is disabled, say why next to it.', 'Disable a button with no explanation and leave people stuck.'],
    ],
    code: {
      css: { label: 'HTML', code: '<button type="button" class="flint-btn flint-btn--primary">Save trip</button>\n<button type="button" class="flint-btn flint-btn--secondary">Add stop</button>\n<button type="button" class="flint-btn flint-btn--danger">Delete trip</button>\n<button type="button" class="flint-btn flint-btn--text">Skip for now</button>', rules: cssFor('flint-btn') },
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
  input: {
    name: 'Input',
    lead: 'Inputs take a short line of text. In Flint, an input always lives in a form field with a visible label, optional helper text and an error message.',
    example: `<div class="field">
  <label for="campsite-__P__">Campsite name</label>
  <input id="campsite-__P__" class="flint-input" type="text" placeholder="Turkey Bend" aria-describedby="campsite-help-__P__" />
  <span class="helper" id="campsite-help-__P__">Shown on your trip card.</span>
</div>
<div class="field">
  <label for="nights-__P__">Nights</label>
  <input id="nights-__P__" class="flint-input" type="text" value="zero" aria-invalid="true" aria-describedby="nights-error-__P__" />
  <span class="error" id="nights-error-__P__">${errorIcon}Enter a number from 1 to 14.</span>
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
