/**
 * Flint token build. Reads tokens.json (single source of truth) and emits:
 *   dist/tokens.css   CSS custom properties (:root + [data-theme="dark"])
 *   dist/fonts.css    metric-matched Open Sans fallback @font-face
 *   dist/index.js     ESM named + default exports of the resolved tokens
 *   dist/index.d.ts   types
 *   dist/swift/Flint.swift  SwiftUI tokens (SwiftPM via Package.swift)
 * No runtime dependencies; Node only.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const dist = join(root, 'dist');
mkdirSync(join(dist, 'swift'), { recursive: true });

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function semanticVars(mode) {
  const s = tokens.semantic[mode];
  const out = [];
  for (const [group, val] of Object.entries(s)) {
    if (typeof val === 'string') {
      out.push([`--color-${kebab(group)}`, val]);
    } else {
      for (const [k, v] of Object.entries(val)) {
        if (typeof v === 'string') out.push([`--color-${kebab(group)}-${kebab(k)}`, v]);
        else for (const [k2, v2] of Object.entries(v)) out.push([`--color-${kebab(group)}-${kebab(k)}-${kebab(k2)}`, v2]);
      }
    }
  }
  return out;
}

const shadowDarkVars = () => Object.entries(tokens.shadowDark || {}).map(([k, v]) => [`--shadow-${k}`, v]);

function staticVars() {
  const out = [];
  for (const [ramp, steps] of Object.entries(tokens.color)) {
    if (typeof steps === 'string') out.push([`--color-${ramp}`, steps]);
    else for (const [step, hex] of Object.entries(steps)) out.push([`--color-${ramp}-${step}`, hex]);
  }
  for (const [k, v] of Object.entries(tokens.space)) out.push([`--space-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.radius)) out.push([`--radius-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.fontSize)) out.push([`--font-size-${k}`, `${v}px`]);
  for (const [k, v] of Object.entries(tokens.fontWeight)) out.push([`--font-weight-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.lineHeight)) out.push([`--line-height-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.shadow || {})) out.push([`--shadow-${k}`, v]);
  if (tokens.motion) {
    for (const [k, v] of Object.entries(tokens.motion.duration || {})) out.push([`--duration-${k}`, v]);
    for (const [k, v] of Object.entries(tokens.motion.easing || {})) out.push([`--ease-${k}`, v]);
  }
  for (const [k, v] of Object.entries(tokens.zIndex || {})) out.push([`--z-${k}`, `${v}`]);
  for (const [k, v] of Object.entries(tokens.breakpoint || {})) out.push([`--breakpoint-${k}`, `${v}px`]);
  out.push(['--target-min', `${tokens.targetMin}px`]);
  out.push(['--font-sans', tokens.fontFamily.sans]);
  out.push(['--font-prose', tokens.fontFamily.prose]);
  out.push(['--font-mono', tokens.fontFamily.mono]);
  return out;
}

const fmt = (pairs) => pairs.map(([n, v]) => `  ${n}: ${v};`).join('\n');

writeFileSync(join(dist, 'tokens.css'), `/* GENERATED from tokens.json. Flint Design System. Do not edit by hand. */
:root {
${fmt(staticVars())}

  /* semantic (light) */
${fmt(semanticVars('light'))}
}

[data-theme="dark"] {
  /* semantic (dark) */
${fmt(semanticVars('dark'))}

  /* elevation (dark) */
${fmt(shadowDarkVars())}
}
`);

writeFileSync(join(dist, 'tokens.media.css'), `/* GENERATED from tokens.json. Auto dark via prefers-color-scheme. Do not edit by hand. */
:root {
${fmt(staticVars())}

  /* semantic (light) */
${fmt(semanticVars('light'))}
}

@media (prefers-color-scheme: dark) {
  :root {
    /* semantic (dark) */
${fmt(semanticVars('dark'))}

    /* elevation (dark) */
${fmt(shadowDarkVars())}
  }
}
`);

writeFileSync(join(dist, 'fonts.css'), `/* Flint: metric-matched Open Sans fallback (no layout shift). Add 'Open Sans Fallback' to the font stack. */
@font-face {
  font-family: 'Open Sans Fallback';
  src: local('Arial');
  size-adjust: 105.15%;
  ascent-override: 101.65%;
  descent-override: 27.86%;
  line-gap-override: 0%;
}
`);

const keys = Object.keys(tokens);
writeFileSync(join(dist, 'index.js'), `// GENERATED from tokens.json. Flint Design System.
const tokens = ${JSON.stringify(tokens, null, 2)};
${keys.map((k) => `export const ${k} = tokens[${JSON.stringify(k)}];`).join('\n')}
export default tokens;
`);

writeFileSync(join(dist, 'index.d.ts'), `// GENERATED. Flint Design System token types.
export type Hex = string;
export type Ramp = Record<string, Hex>;
export interface SemanticScheme {
  surface: Record<string, Hex>;
  text: Record<string, Hex>;
  action: Record<string, Hex>;
  border: Record<string, Hex>;
  feedback: Record<'success' | 'warning' | 'error' | 'info', Record<string, Hex>>;
  accent: Record<string, Hex>;
  selected: Record<string, Hex>;
  overlayScrim: Hex;
}
export interface Tokens {
  color: Record<string, Ramp | Hex>;
  space: Record<string, number>;
  radius: Record<string, number>;
  fontFamily: Record<'sans' | 'prose' | 'mono', string>;
  fontWeight: Record<string, number>;
  fontSize: Record<string, number>;
  lineHeight: Record<string, number>;
  shadow: Record<string, string>;
  shadowDark: Record<string, string>;
  typography: Record<string, { fontFamily: string; fontSize: number; fontWeight: number; lineHeight: number; letterSpacing: string }>;
  motion: { duration: Record<string, string>; easing: Record<string, string> };
  zIndex: Record<string, number>;
  breakpoint: Record<string, number>;
  control: Record<string, number>;
  iconSize: Record<string, number>;
  targetMin: number;
  semantic: { light: SemanticScheme; dark: SemanticScheme };
}
declare const tokens: Tokens;
export const color: Tokens['color'];
export const space: Tokens['space'];
export const radius: Tokens['radius'];
export const fontFamily: Tokens['fontFamily'];
export const fontWeight: Tokens['fontWeight'];
export const fontSize: Tokens['fontSize'];
export const lineHeight: Tokens['lineHeight'];
export const shadow: Tokens['shadow'];
export const shadowDark: Tokens['shadowDark'];
export const typography: Tokens['typography'];
export const motion: Tokens['motion'];
export const zIndex: Tokens['zIndex'];
export const breakpoint: Tokens['breakpoint'];
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
export default tokens;
`);

// W3C DTCG export (tool-agnostic: Tokens Studio, Style Dictionary, Figma Make).
const px = (v) => (/^-?\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v));
const colorGroup = (obj) => {
  const g = {};
  for (const [k, v] of Object.entries(obj)) g[k] = typeof v === 'string' ? { $type: 'color', $value: v } : colorGroup(v);
  return g;
};
const dimGroup = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { $type: 'dimension', $value: px(v) }]));
const numGroup = (obj, $type = 'number') => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { $type, $value: v }]));
const parseShadow = (s) => {
  const cm = s.match(/(rgba?\([^)]*\)|#[0-9a-fA-F]+)\s*$/);
  const color = cm ? cm[1] : '#000000';
  const nums = s.slice(0, cm ? cm.index : s.length).trim().split(/\s+/);
  return { color, offsetX: px(nums[0] || 0), offsetY: px(nums[1] || 0), blur: px(nums[2] || 0), spread: px(nums[3] || 0) };
};
const splitLayers = (s) => { const out = []; let depth = 0, cur = ''; for (const ch of s) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
const shadowVal = (s) => { const layers = splitLayers(s).map(parseShadow); return layers.length === 1 ? layers[0] : layers; };
const bezier = (s) => { const m = s.match(/cubic-bezier\(([^)]+)\)/); return m ? m[1].split(',').map((n) => parseFloat(n)) : [0, 0, 1, 1]; };
const dtcg = {
  color: colorGroup(tokens.color),
  space: dimGroup(tokens.space),
  radius: dimGroup(tokens.radius),
  fontFamily: Object.fromEntries(Object.entries(tokens.fontFamily).map(([k, v]) => [k, { $type: 'fontFamily', $value: v }])),
  fontWeight: numGroup(tokens.fontWeight, 'fontWeight'),
  fontSize: dimGroup(tokens.fontSize),
  lineHeight: numGroup(tokens.lineHeight),
  zIndex: numGroup(tokens.zIndex),
  breakpoint: dimGroup(tokens.breakpoint),
  duration: Object.fromEntries(Object.entries(tokens.motion.duration).map(([k, v]) => [k, { $type: 'duration', $value: v }])),
  easing: Object.fromEntries(Object.entries(tokens.motion.easing).map(([k, v]) => [k, { $type: 'cubicBezier', $value: bezier(v) }])),
  shadow: Object.fromEntries(Object.entries(tokens.shadow).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  shadowDark: Object.fromEntries(Object.entries(tokens.shadowDark).map(([k, v]) => [k, { $type: 'shadow', $value: shadowVal(v) }])),
  typography: Object.fromEntries(Object.entries(tokens.typography).map(([k, t]) => [k, { $type: 'typography', $value: { fontFamily: t.fontFamily, fontSize: px(t.fontSize), fontWeight: t.fontWeight, lineHeight: t.lineHeight, letterSpacing: px(t.letterSpacing) } }])),
  semantic: { light: colorGroup(tokens.semantic.light), dark: colorGroup(tokens.semantic.dark) },
};
writeFileSync(join(dist, 'tokens.dtcg.json'), JSON.stringify(dtcg, null, 2));

// Swift / SwiftUI export (ASDS-27). Writes dist/swift/Flint.swift; Package.swift at the repo root
// points SwiftPM at dist/swift so iOS/macOS apps add Flint by git tag.
const camel = (...parts) => parts.map((p, i) => { const s = String(p); return i === 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1); }).join('');
const swiftColor = (v) => {
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return { hex: `0x${m[1].toLowerCase()}`, a: 1 };
  m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) return { hex: '0x' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join(''), a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`Swift export: unsupported color value "${v}"`);
};
const flatten = (obj, path = []) => Object.entries(obj).flatMap(([k, v]) => (typeof v === 'string' ? [[[...path, k], v]] : flatten(v, [...path, k])));
const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
const num = (n) => (Number.isInteger(n) ? `${n}` : `${+n.toFixed(4)}`);

const semanticLines = flatten(tokens.semantic.light).map(([path, lightVal]) => {
  const darkVal = at(tokens.semantic.dark, path);
  if (typeof darkVal !== 'string') throw new Error(`Swift export: semantic.dark.${path.join('.')} missing`);
  const l = swiftColor(lightVal), d = swiftColor(darkVal);
  const args = [`light: ${l.hex}`, l.a !== 1 ? `lightOpacity: ${l.a}` : null, `dark: ${d.hex}`, d.a !== 1 ? `darkOpacity: ${d.a}` : null].filter(Boolean).join(', ');
  return `    public static let ${camel(...path)} = dynamic(${args})`;
});
const paletteLines = Object.entries(tokens.color).flatMap(([ramp, steps]) =>
  typeof steps === 'string'
    ? [`    public static let ${camel(ramp)} = Color(flintHex: ${swiftColor(steps).hex})`]
    : Object.entries(steps).map(([step, hex]) => `    public static let ${camel(ramp, step)} = Color(flintHex: ${swiftColor(hex).hex})`));
const cgGroup = (obj, prefix = '') => Object.entries(obj).map(([k, v]) => `    public static let ${prefix ? camel(prefix, k) : camel(k)}: CGFloat = ${num(v)}`);

const psFamily = (stack) => (stack.match(/'([^']+)'|"([^"]+)"/) || [])[1]?.replace(/\s+/g, '') || 'OpenSans';
const weightName = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };
const roleMap = { displayXl: 'largeTitle', display: 'largeTitle', headingH1: 'largeTitle', headingH2: 'title2', headingH3: 'title3', bodyLg: 'body', bodyMd: 'body', bodySm: 'subheadline', labelButton: 'subheadline', labelDefault: 'subheadline' };
const relativeTo = (name, size) => roleMap[name] || (size <= 12 ? 'caption' : size <= 14 ? 'subheadline' : 'body');
const typeLines = Object.entries(tokens.typography).map(([name, t]) => {
  if (!weightName[t.fontWeight]) throw new Error(`Swift export: no Open Sans face for weight ${t.fontWeight} (${name})`);
  const font = `${psFamily(t.fontFamily)}-${weightName[t.fontWeight]}`;
  return `    public static let ${camel(name)} = FlintTextStyle(fontName: "${font}", size: ${num(t.fontSize)}, relativeTo: .${relativeTo(name, t.fontSize)}, lineHeight: ${num(t.lineHeight)}, tracking: ${num(parseFloat(t.letterSpacing) || 0)})`;
});

const seconds = (v) => { const m = String(v).match(/^([\d.]+)\s*(ms|s)$/); if (!m) throw new Error(`Swift export: bad duration "${v}"`); return m[2] === 'ms' ? +m[1] / 1000 : +m[1]; };
const durationLines = Object.entries(tokens.motion.duration).map(([k, v]) => `      public static let ${camel(k)}: Double = ${num(seconds(v))}`);
const easingNames = Object.keys(tokens.motion.easing).map((k) => camel(k));
const easingCases = Object.entries(tokens.motion.easing).map(([k, v]) => { const [a, b, c, d] = bezier(v); return `        case .${camel(k)}: return (${a}, ${b}, ${c}, ${d})`; });

// Apple HIG minimum hit target. Platform rule, not a brand token, so it lives here rather than tokens.json.
const APPLE_TOUCH_MIN = 44;

writeFileSync(join(dist, 'swift', 'Flint.swift'), `// GENERATED from tokens.json by scripts/build.mjs. Flint Design System. Do not edit by hand.
// Colors: Flint.Colors (semantic, light/dark aware) and Flint.Palette (raw ramps).
// Layout: Flint.Space, Flint.Radius, Flint.Control, Flint.IconSize, Flint.Target.
// Type:   Flint.Typography + .flintText(_:). Needs the Open Sans static TTFs bundled in the app.
// Motion: Flint.Motion.animation(_:duration:reduceMotion:) returns nil when Reduce Motion is on.
import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public enum Flint {
  /// Semantic colors. Each resolves to its light or dark value from the system appearance.
  public enum Colors {
${semanticLines.join('\n')}
  }

  /// Raw color ramps. Prefer Flint.Colors in UI; these values do not change between modes.
  public enum Palette {
${paletteLines.join('\n')}
  }

  public enum Space {
${cgGroup(tokens.space, 's').join('\n')}
  }

  public enum Radius {
${cgGroup(tokens.radius).join('\n')}
  }

  /// Control heights.
  public enum Control {
${cgGroup(tokens.control).join('\n')}
  }

  public enum IconSize {
${cgGroup(tokens.iconSize).join('\n')}
  }

  public enum Target {
    /// Flint targetMin (WCAG 2.2 AA, 2.5.8).
    public static let minimum: CGFloat = ${num(tokens.targetMin)}
    /// Apple HIG minimum hit target. Use this for touch UI on iOS.
    public static let touch: CGFloat = ${APPLE_TOUCH_MIN}
  }

  public enum Typography {
${typeLines.join('\n')}
  }

  public enum Motion {
    public enum Duration {
${durationLines.join('\n')}
    }

    public enum Easing: Sendable {
      case ${easingNames.join(', ')}

      var controlPoints: (Double, Double, Double, Double) {
        switch self {
${easingCases.join('\n')}
        }
      }
    }

    /// Returns nil when reduceMotion is true, so withAnimation(...) applies the change instantly.
    /// Read reduceMotion from @Environment(\\.accessibilityReduceMotion).
    public static func animation(_ easing: Easing = .standard, duration: Double = Duration.base, reduceMotion: Bool) -> Animation? {
      guard !reduceMotion, duration > 0 else { return nil }
      let p = easing.controlPoints
      return .timingCurve(p.0, p.1, p.2, p.3, duration: duration)
    }
  }
}

public struct FlintTextStyle {
  public let fontName: String
  public let size: CGFloat
  public let relativeTo: Font.TextStyle
  /// Line height as a multiple of size (CSS unitless line-height).
  public let lineHeight: CGFloat
  /// Letter spacing in points.
  public let tracking: CGFloat

  public init(fontName: String, size: CGFloat, relativeTo: Font.TextStyle, lineHeight: CGFloat, tracking: CGFloat) {
    self.fontName = fontName
    self.size = size
    self.relativeTo = relativeTo
    self.lineHeight = lineHeight
    self.tracking = tracking
  }

  /// Scales with Dynamic Type relative to \`relativeTo\`.
  public var font: Font { .custom(fontName, size: size, relativeTo: relativeTo) }
  /// Extra space between lines at the base size. SwiftUI adds lineSpacing on top of the font's own
  /// line height, so this is the target (size x lineHeight) minus what the font already provides.
  public var lineSpacing: CGFloat {
    #if canImport(UIKit)
    let natural = UIFont(name: fontName, size: size)?.lineHeight
    #elseif canImport(AppKit)
    let natural = NSFont(name: fontName, size: size).map { $0.ascender - $0.descender + $0.leading }
    #else
    let natural: CGFloat? = nil
    #endif
    // Open Sans hhea metrics (ascender 2189 + descender 600) / 2048 units per em, if the font is not bundled yet.
    return max(0, size * lineHeight - (natural ?? size * 1.362))
  }
}

private struct FlintTextModifier: ViewModifier {
  let style: FlintTextStyle
  @ScaledMetric private var lineSpacing: CGFloat
  @ScaledMetric private var tracking: CGFloat

  init(style: FlintTextStyle) {
    self.style = style
    _lineSpacing = ScaledMetric(wrappedValue: style.lineSpacing, relativeTo: style.relativeTo)
    _tracking = ScaledMetric(wrappedValue: style.tracking, relativeTo: style.relativeTo)
  }

  func body(content: Content) -> some View {
    content.font(style.font).lineSpacing(lineSpacing).tracking(tracking)
  }
}

public extension View {
  /// Applies a Flint type style: font, line spacing and tracking, all scaled with Dynamic Type.
  func flintText(_ style: FlintTextStyle) -> some View { modifier(FlintTextModifier(style: style)) }
}

extension Color {
  init(flintHex hex: UInt32, opacity: Double = 1) {
    self.init(.sRGB, red: Double((hex >> 16) & 0xff) / 255, green: Double((hex >> 8) & 0xff) / 255, blue: Double(hex & 0xff) / 255, opacity: opacity)
  }
}

private func dynamic(light: UInt32, lightOpacity: Double = 1, dark: UInt32, darkOpacity: Double = 1) -> Color {
  func rgb(_ h: UInt32) -> (CGFloat, CGFloat, CGFloat) { (CGFloat((h >> 16) & 0xff) / 255, CGFloat((h >> 8) & 0xff) / 255, CGFloat(h & 0xff) / 255) }
  let l = rgb(light), d = rgb(dark)
  #if canImport(UIKit)
  return Color(uiColor: UIColor { traits in
    traits.userInterfaceStyle == .dark
      ? UIColor(red: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : UIColor(red: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #elseif canImport(AppKit)
  return Color(nsColor: NSColor(name: nil) { appearance in
    appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
      ? NSColor(srgbRed: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : NSColor(srgbRed: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #else
  return Color(flintHex: light, opacity: lightOpacity)
  #endif
}
`);

console.log('Built dist/: tokens.css, tokens.media.css, fonts.css, index.js, index.d.ts, tokens.dtcg.json, swift/Flint.swift');
