import { resolved, source, contrast, leaves, at, kebab, refName } from '../lib/flint';

export default { title: 'Foundations/Tokens' };

const MODES = ['light', 'dark'];

const Swatch = ({ value, reference }) => (
  <span className="wb-swatch">
    <span className="wb-chip" style={{ background: value }} aria-hidden="true" />
    <span>
      <code>{value}</code>
      {reference && <div className="wb-muted"><code>{reference}</code></div>}
    </span>
  </span>
);

const isColor = (v) => typeof v === 'string' && (v.startsWith('#') || v.startsWith('rgb'));

/** Every semantic color, light and dark side by side, with the primitive each one points at. */
export const SemanticColors = () => {
  const rows = leaves(resolved.semantic.light);
  const groups = [...new Set(rows.map(([p]) => p[0]))];
  return (
    <div className="wb">
      <h1>Semantic colors</h1>
      <p className="lead">{rows.length} tokens. Each row shows the value in both modes and the primitive it references, read from tokens.json and the build output. Use these in UI, never the primitives.</p>
      {groups.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <table className="wb-table">
            <thead><tr><th scope="col">Token</th><th scope="col">CSS variable</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
            <tbody>
              {rows.filter(([p]) => p[0] === g).map(([p]) => (
                <tr key={p.join('.')} data-token={`semantic.${p.join('.')}`}>
                  <td><code>{p.join('.')}</code></td>
                  <td><code>--color-{p.map(kebab).join('-')}</code></td>
                  {MODES.map((m) => (
                    <td key={m}><Swatch value={at(resolved.semantic[m], p)} reference={refName(at(source.semantic[m], p))} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
};
SemanticColors.storyName = 'Semantic colors';

const pairColor = (mode, path) =>
  path.startsWith('component.') ? at(resolved.component[mode], path.slice(10).split('.')) : at(resolved.semantic[mode], path.split('.'));

/** Text pairs as text; edges, rings and marks as what they are (a box edge on its surface); disabled text inside a real disabled button. */
const PairSample = ({ mode, pair }) => {
  const fg = pairColor(mode, pair.fg), bg = pairColor(mode, pair.bg);
  const box = { display: 'inline-grid', placeItems: 'center', minWidth: 44, height: 32, padding: '0 var(--space-8)', borderRadius: 'var(--radius-xs)', background: bg, fontWeight: 700 };
  if (pair.kind === 'text') return <span style={{ ...box, color: fg }} aria-hidden="true">Aa</span>;
  if (pair.kind === 'exempt') return <button type="button" disabled style={{ ...box, color: fg, border: 'none' }} aria-label={`Sample of ${pair.label}`}>Aa</button>;
  return <span style={{ ...box, border: `2px solid ${fg}` }} aria-hidden="true" />;
};

/** Every pairing the build checks, with its measured ratio. Same data the contrast guard writes. */
export const Contrast = () => (
  <div className="wb">
    <h1>Contrast guarantees</h1>
    <p className="lead">
      {contrast.pairs.length} checks from <code>dist/contrast.json</code>. Text must clear {contrast.textBar}:1 (Flint's AAA bar), controls and marks {contrast.nonTextBar}:1.
      Decorative borders and disabled text are advisory. Flint's published claim stays WCAG 2.2 AA.
    </p>
    {MODES.map((m) => (
      <section key={m}>
        <h2>{m === 'light' ? 'Light' : 'Dark'}</h2>
        <table className="wb-table">
          <thead><tr><th scope="col">Sample</th><th scope="col">Pairing</th><th scope="col">Foreground on background</th><th scope="col">Ratio</th><th scope="col">Result</th></tr></thead>
          <tbody>
            {contrast.pairs.filter((r) => r.mode === m).map((r) => {
              const advisory = r.kind === 'decorative' || r.kind === 'exempt';
              return (
                <tr key={r.label} data-pair={`${m}:${r.label}`}>
                  <td><PairSample mode={m} pair={r} /></td>
                  <td>{r.label}</td>
                  <td><code>{r.fg}</code> on <code>{r.bg}</code></td>
                  <td><code>{r.ratio.toFixed(2)}</code> <span className="wb-muted">(needs {r.threshold})</span></td>
                  <td className={r.pass ? 'wb-pass' : advisory ? 'wb-adv' : 'wb-fail'}>{r.pass ? 'Pass' : advisory ? 'Advisory' : 'Fail'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    ))}
  </div>
);
Contrast.storyName = 'Contrast';

const readableOn = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.18 ? resolved.color.black : resolved.color.white;
};

/** The raw ladders. Reference only: UI reads semantic tokens, which point here. */
export const Primitives = () => (
  <div className="wb">
    <h1>Primitive ladders</h1>
    <p className="lead">The raw color ramps semantic tokens point at. Never used directly in UI.</p>
    {Object.entries(resolved.color).filter(([, v]) => typeof v === 'object').map(([ramp, steps]) => (
      <section key={ramp}>
        <h2>{ramp}</h2>
        <div className="wb-ramp">
          {Object.entries(steps).map(([step, hex]) => (
            <div key={step} data-token={`color.${ramp}.${step}`} style={{ background: hex, color: readableOn(hex) }}>
              <strong>{step}</strong>
              <code>{hex}</code>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

/** Every type style, rendered at its token values. */
export const Type = () => (
  <div className="wb">
    <h1>Type</h1>
    <p className="lead">{Object.keys(resolved.typography).length} styles, Open Sans. Nothing below 12px.</p>
    <table className="wb-table">
      <thead><tr><th scope="col">Style</th><th scope="col">Sample</th><th scope="col">Size / weight / line height</th></tr></thead>
      <tbody>
        {Object.entries(resolved.typography).map(([name, t]) => (
          <tr key={name} data-token={`typography.${name}`}>
            <td><code>{name}</code></td>
            <td style={{ fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing, color: 'var(--color-text-heading)' }}>Trail ready at dawn</td>
            <td><code>{t.fontSize}px / {t.fontWeight} / {t.lineHeight}</code></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Space, radius, control, icon and target sizes, plus both densities. */
export const SpaceAndSize = () => (
  <div className="wb">
    <h1>Space and size</h1>
    <p className="lead">Every size token. Density changes inset and gap only; control, icon and target sizes never shrink.</p>
    <h2>Space</h2>
    <table className="wb-table">
      <tbody>
        {Object.entries(resolved.space).map(([k, v]) => (
          <tr key={k} data-token={`space.${k}`}><td><code>space.{k}</code></td><td><code>{v}px</code></td><td style={{ width: '70%' }}><div className="wb-bar" style={{ width: v }} /></td></tr>
        ))}
      </tbody>
    </table>
    <h2>Radius</h2>
    <table className="wb-table">
      <tbody>
        {Object.entries(resolved.radius).map(([k, v]) => (
          <tr key={k} data-token={`radius.${k}`}>
            <td><code>radius.{k}</code>{refName(source.radius[k]) && <div className="wb-muted"><code>{refName(source.radius[k])}</code></div>}</td>
            <td><code>{v}px</code></td>
            <td><div style={{ width: 96, height: 48, borderRadius: Math.min(v, 24), border: '2px solid var(--color-border-control)' }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
    <h2>Controls, icons and targets</h2>
    <table className="wb-table">
      <tbody>
        {Object.entries(resolved.control).map(([k, v]) => (
          <tr key={k} data-token={`control.${k}`}><td><code>control.{k}</code></td><td><code>{v}px</code></td><td><div style={{ height: v, width: 160, borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border-control)' }} /></td></tr>
        ))}
        {Object.entries(resolved.iconSize).map(([k, v]) => (
          <tr key={k} data-token={`iconSize.${k}`}><td><code>iconSize.{k}</code></td><td><code>{v}px</code></td><td><div style={{ height: v, width: v, borderRadius: 'var(--radius-xs)', background: 'var(--color-action-primary)' }} /></td></tr>
        ))}
        <tr data-token="targetMin"><td><code>targetMin</code></td><td><code>{resolved.targetMin}px</code></td><td><div style={{ height: resolved.targetMin, width: resolved.targetMin, border: '2px dashed var(--color-border-control)' }} /></td></tr>
      </tbody>
    </table>
    <h2>Density</h2>
    <table className="wb-table">
      <thead><tr><th scope="col">Token</th><th scope="col">Comfortable</th><th scope="col">Compact</th></tr></thead>
      <tbody>
        {leaves(resolved.density.comfortable).map(([p, v]) => (
          <tr key={p.join('.')} data-token={`density.${p.join('.')}`}><td><code>{p.join('.')}</code></td><td><code>{v}px</code></td><td><code>{at(resolved.density.compact, p)}px</code></td></tr>
        ))}
      </tbody>
    </table>
  </div>
);
SpaceAndSize.storyName = 'Space and size';

/** The component tier: what each component token points at, and where it lands in each mode. */
export const ComponentTokens = () => {
  const rows = leaves(source.component);
  return (
    <div className="wb">
      <h1>Component tokens</h1>
      <p className="lead">{rows.length} tokens. MUI, shadcn, plain CSS and SwiftUI all read these, so a button decision is made once.</p>
      <table className="wb-table">
        <thead><tr><th scope="col">Token</th><th scope="col">CSS variable</th><th scope="col">References</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
        <tbody>
          {rows.map(([p, v]) => {
            const l = at(resolved.component.light, p), d = at(resolved.component.dark, p);
            return (
              <tr key={p.join('.')} data-token={`component.${p.join('.')}`}>
                <td><code>{p.join('.')}</code></td>
                <td><code>--{p.map(kebab).join('-')}</code></td>
                <td><code>{refName(v) || String(v)}</code></td>
                <td>{isColor(l) ? <Swatch value={l} /> : <code>{l}px</code>}</td>
                <td>{isColor(d) ? <Swatch value={d} /> : <code>{d}px</code>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
ComponentTokens.storyName = 'Component tokens';
