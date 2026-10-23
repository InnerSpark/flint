// The Flint React snippet on each component's Code tab. @innerspark/flint/react renders the same classes
// as the plain CSS above it.
const imp = (names) => `import { ${names} } from '@innerspark/flint/react';\n\n`;
export const REACT_CODE = {
  button: imp('Button') + `<Button>Save trip</Button>
<Button variant="secondary">Add stop</Button>
<Button variant="danger">Delete trip</Button>
<Button variant="text" size="sm">Skip for now</Button>
<Button busy>Saving trip</Button>
<Button variant="secondary" iconOnly aria-label="Add stop"><PlusIcon aria-hidden="true" /></Button>`,
  link: imp('Link') + `<Link href="/trips/42">Review the route</Link>
<Link href="/trips" standalone>View all trips</Link>
<Link href="https://example.com" target="_blank" rel="noopener">Campground rules</Link> {/* says "opens in a new tab" */}`,
  field: imp('Field, Input') + `<Field label="Start URL" helper="The page the crawl starts from." error={error} required>
  <Input type="url" />
</Field>`,
  input: imp('Field, Input, Textarea') + `<Field label="Campsite name" helper="Shown on your trip card."><Input placeholder="Turkey Bend" /></Field>
<Field label="Notes for the campground"><Textarea /></Field>`,
  checkbox: imp('Checkbox') + `<Checkbox label="Bring the awning lights" defaultChecked />
<Checkbox label="All camp gear" indeterminate />`,
  radio: imp('RadioGroup, Radio') + `<RadioGroup legend="Which site should we scan?">
  <Radio label="Just this page" value="page" defaultChecked />
  <Radio label="The whole site" value="site" />
</RadioGroup>`,
  switch: imp('Switch') + `<Switch label="Email me a weekly summary" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} />`,
  select: imp('Field, Select') + `<Field label="Standard">
  <Select><option>WCAG 2.2 AA</option><option>Section 508</option></Select>
</Field>`,
  badge: imp('Badge') + `<Badge intent="success">Passed</Badge>
<Badge intent="error">Failed</Badge>`,
  chip: imp('Chip') + `<Chip intent="error" onRemove={() => removeFilter('failed')}>Failed only</Chip> {/* "Remove Failed only" */}
<Chip outlined>Mobile</Chip>`,
  alert: imp('Alert') + `<Alert title="Scan scheduled">We'll email you when the report is ready.</Alert>
<Alert intent="error" title="We couldn't reach the site" role="alert">Check the address and try again.</Alert>`,
  'skip-link': imp('SkipLink') + `<SkipLink href="#main" />  {/* first in the app shell; moves focus to #main */}`,
  icon: imp('Icon') + `<Icon muted><path d="..." /></Icon>                   {/* decorative */}
<Icon label="Passed" size="lg"><path d="..." /></Icon>  {/* role="img" */}`,
  dialog: imp('Dialog, DialogTrigger, DialogContent, DialogClose, Button') + `<Dialog>
  <DialogTrigger asChild><Button variant="danger">Delete trip</Button></DialogTrigger>
  <DialogContent title="Delete this trip?" footer={<>
    <DialogClose asChild><Button variant="secondary">Keep trip</Button></DialogClose>
    <Button variant="danger" onClick={remove}>Delete trip</Button>
  </>}>
    <p>The route and packing list go with it. You can't undo this.</p>
  </DialogContent>
</Dialog>`,
  tabs: imp('Tabs, TabList, Tab, TabPanel') + `<Tabs defaultValue="route">
  <TabList aria-label="Trip details">
    <Tab value="route">Route</Tab>
    <Tab value="packing">Packing</Tab>
  </TabList>
  <TabPanel value="route">3 stops, 212 miles.</TabPanel>
  <TabPanel value="packing">14 of 20 items packed.</TabPanel>
</Tabs>`,
  menu: imp('Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, Button') + `<Menu>
  <MenuTrigger asChild><Button variant="secondary">Trip actions</Button></MenuTrigger>
  <MenuContent>
    <MenuItem onSelect={rename}>Rename</MenuItem>
    <MenuSeparator />
    <MenuItem danger onSelect={remove}>Delete trip</MenuItem>
  </MenuContent>
</Menu>`,
  tooltip: imp('TooltipProvider, Tooltip, Button') + `<TooltipProvider>
  <Tooltip content="PDF, about 2 MB"><Button variant="secondary">Export report</Button></Tooltip>
</TooltipProvider>`,
  toast: imp('ToastProvider, ToastRegion, Toast') + `<ToastProvider>
  <Toast open={saved} onOpenChange={setSaved} title="Report saved" description="Your VPAT draft is in Reports." />
  <Toast open={archived} onOpenChange={setArchived} title="Trip archived" action={{ label: 'Undo', onClick: restore }} /> {/* stays until dismissed */}
  <ToastRegion />
</ToastProvider>`,
};
