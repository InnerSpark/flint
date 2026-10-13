/**
 * States down, implementations across. Forced states use the pseudo-states addon: an element with
 * class st-hover or st-focus renders as if hovered or keyboard-focused, using its real CSS.
 * The Live row is not forced: use the mouse and keyboard on it.
 */
export const PSEUDO = { pseudo: { hover: ['.st-hover'], focusVisible: ['.st-focus'] } };

export const IMPLEMENTATIONS = ['MUI', 'shadcn', 'Plain CSS'];

export function Matrix({ title, lead, states, render }) {
  return (
    <div className="wb">
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      <table className="wb-table">
        <thead>
          <tr>
            <th scope="col">State</th>
            {IMPLEMENTATIONS.map((i) => <th key={i} scope="col">{i}</th>)}
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s.label} data-state={s.label}>
              <td className="state">{s.label}{s.note && <div className="wb-muted" style={{ fontWeight: 400 }}>{s.note}</div>}</td>
              {IMPLEMENTATIONS.map((i) => <td key={i}><div className="wb-cell">{render(i, s)}</div></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
