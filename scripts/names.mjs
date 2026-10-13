/**
 * Token path -> output name rules, shared by the build and the parity test (ASDS-41) so both
 * agree on what every token is called in CSS and Swift.
 */
export const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const camel = (...parts) => parts.map((p, i) => { const s = String(p); return i === 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1); }).join('');

/** CSS variable for a token path, matching what tokens.css emits. */
export const cssVarForPath = (path) => {
  const [head, ...rest] = path.split('.');
  if (head === 'semantic' || head === 'color') {
    const parts = head === 'semantic' && ['light', 'dark'].includes(rest[0]) ? rest.slice(1) : rest;
    return `--color-${parts.map(kebab).join('-')}`;
  }
  if (head === 'targetMin') return '--target-min';
  const prefix = { radius: 'radius', control: 'control', space: 'space', iconSize: 'icon-size', fontSize: 'font-size' }[head];
  if (!prefix) throw new Error(`No CSS variable for token path ${path}`);
  return `--${prefix}-${rest.map(kebab).join('-')}`;
};

/** CSS variable for a component token path, e.g. ['button','primary','bgHover'] -> --button-primary-bg-hover. */
export const componentVar = (pathParts) => `--${pathParts.map(kebab).join('-')}`;
