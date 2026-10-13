import { resolved, contrast, leaves } from '../lib/flint';

export default { title: 'Start here' };

export const Overview = () => (
  <div className="wb">
    <h1>Flint workbench</h1>
    <p className="lead">
      Every semantic token and every built component, in one place. Values come straight from Flint's build, so this page cannot show
      a value the build did not produce. Theme and Density in the toolbar switch MUI, shadcn and plain CSS together.
    </p>
    <table className="wb-table">
      <tbody>
        <tr><td className="state">Semantic tokens</td><td>{leaves(resolved.semantic.light).length} per mode</td></tr>
        <tr><td className="state">Component tokens</td><td>{leaves(resolved.component.light).length} per mode</td></tr>
        <tr><td className="state">Contrast checks</td><td>{contrast.pairs.length}, {contrast.pairs.filter((p) => p.pass).length} passing</td></tr>
        <tr><td className="state">Accessibility</td><td>The Accessibility tab runs axe on every story. <code>npm run verify</code> runs it on all of them, light and dark.</td></tr>
      </tbody>
    </table>
    <h2>Walkthrough for every component</h2>
    <ul>
      <li>Every state: default, hover, focus, disabled, error where it applies</li>
      <li>Light and dark (Theme in the toolbar)</li>
      <li>Comfortable and compact (Density in the toolbar)</li>
      <li>The Live row with the keyboard only: Tab, Space, Enter</li>
      <li>Text at 7:1, control edges at 3:1, targets at 24px (see Foundations / Contrast)</li>
      <li>MUI, shadcn and plain CSS look the same. Where they differ, the difference is a finding</li>
    </ul>
  </div>
);
