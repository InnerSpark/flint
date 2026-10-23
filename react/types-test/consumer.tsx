// Compile-only check that react/index.d.ts describes a real app's use. Run: npm run test:react
import { Alert, Badge, Button, Checkbox, Chip, Dialog, DialogContent, DialogTrigger, Field, Icon, Input, Link, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, Radio, RadioGroup, Select, SkipLink, Switch, Tab, TabList, TabPanel, Tabs, Toast, ToastProvider, ToastRegion, Tooltip, TooltipProvider } from '../index';

export function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <SkipLink href="#main" />
        <Button variant="danger" size="sm" busy>Delete</Button>
        <Link href="/trips" standalone>View all trips</Link>
        <Field label="Start URL" error="Start with https://" required><Input type="url" /></Field>
        <Field label="Standard"><Select><option>WCAG 2.2 AA</option></Select></Field>
        <Checkbox label="Bring the lights" indeterminate />
        <RadioGroup legend="Scope"><Radio label="Page" defaultChecked /><Radio label="Site" /></RadioGroup>
        <Switch label="Weekly summary" />
        <Badge intent="success">Passed</Badge>
        <Chip intent="error" onRemove={() => {}}>Failed only</Chip>
        <Alert intent="warning" title="Review">12 checks need a person.</Alert>
        <Icon label="Passed" size="lg"><path d="M0 0" /></Icon>
        <Dialog>
          <DialogTrigger asChild><Button variant="danger">Delete trip</Button></DialogTrigger>
          <DialogContent title="Delete this trip?" footer={<Button variant="danger">Delete trip</Button>}>You can't undo this.</DialogContent>
        </Dialog>
        <Tabs defaultValue="route"><TabList aria-label="Trip"><Tab value="route">Route</Tab></TabList><TabPanel value="route">3 stops</TabPanel></Tabs>
        <Menu><MenuTrigger asChild><Button variant="secondary">Trip actions</Button></MenuTrigger><MenuContent><MenuItem>Rename</MenuItem><MenuSeparator /><MenuItem danger>Delete</MenuItem></MenuContent></Menu>
        <Tooltip content="PDF, about 2 MB"><Button variant="secondary">Export</Button></Tooltip>
        <Toast title="Report saved" action={{ label: 'Undo', onClick: () => {} }} />
        <ToastRegion />
      </ToastProvider>
    </TooltipProvider>
  );
}
