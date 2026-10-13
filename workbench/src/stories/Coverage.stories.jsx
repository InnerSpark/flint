export default { title: 'Coverage/Figma library' };

// The component list from FIGMA_LIBRARY_GUIDELINES.md, section 5.
const LIBRARY = [
  ['Actions', ['Button', 'Split button']],
  ['Forms', ['Form field', 'Input', 'Select', 'Checkbox', 'Radio', 'Toggle']],
  ['Status', ['Chip', 'Badge', 'Severity chip', 'Status pill', 'Alert', 'Toast']],
  ['Navigation', ['Tab', 'Pagination', 'Skip link', 'Menu item']],
  ['Containers', ['Dialog', 'Drawer', 'Empty state', 'Tooltip']],
  ['Data', ['Table cell', 'Progress', 'Score card', 'Score donut']],
  ['Product patterns', ['Issue card', 'Comparison card', 'CTA band', 'Step card', 'Conformance row', 'Conformance stat card', 'Verification method', 'Icon tile']],
  ['Chrome', ['Footer']],
];
const IN_WORKBENCH = ['Button', 'Input', 'Checkbox'];
const ACCESSSPARK_ONLY = ['Status pill', 'Severity chip', 'Score card', 'Score donut', 'Issue card', 'Comparison card', 'Conformance row', 'Conformance stat card', 'Verification method'];

const status = (name) =>
  IN_WORKBENCH.includes(name) ? ['wb-pass', 'In the workbench']
  : ACCESSSPARK_ONLY.includes(name) ? ['wb-muted', 'Moves to the AccessSpark library (ASDS-37)']
  : ['wb-adv', 'Not in the workbench yet'];

export const Components = () => {
  const all = LIBRARY.flatMap(([, list]) => list);
  return (
    <div className="wb">
      <h1>Component coverage</h1>
      <p className="lead">{IN_WORKBENCH.length} of {all.length} Figma library components are in the workbench. The rest arrive with the shadcn registry pilot and ASDS-38.</p>
      <table className="wb-table">
        <thead><tr><th scope="col">Group</th><th scope="col">Component</th><th scope="col">Status</th></tr></thead>
        <tbody>
          {LIBRARY.flatMap(([group, list]) => list.map((name) => {
            const [cls, text] = status(name);
            return <tr key={name} data-component={name}><td className="wb-muted">{group}</td><td>{name}</td><td className={cls}>{text}</td></tr>;
          }))}
        </tbody>
      </table>
    </div>
  );
};
