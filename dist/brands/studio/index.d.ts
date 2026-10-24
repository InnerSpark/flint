// GENERATED. Flint Design System token types.
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
  chart: Record<'1' | '2' | '3' | '4' | '5', Hex>;
  overlayScrim: Hex;
}
export interface ComponentScheme {
  button: {
    radius: number; height: number;
    primary: { bg: Hex; bgHover: Hex; fg: Hex };
    secondary: { bg: Hex; bgHover: Hex; fg: Hex; border: Hex };
    danger: { bg: Hex; bgHover: Hex; fg: Hex };
    text: { bgHover: Hex; fg: Hex };
    disabled: { bg: Hex; fg: Hex; border: Hex };
  };
  input: { radius: number; height: number; bg: Hex; fg: Hex; placeholder: Hex; border: Hex; borderHover: Hex; borderFocus: Hex; borderError: Hex };
  checkbox: { size: number; radius: number; border: Hex; checkedBg: Hex; checkedFg: Hex };
  focus: { ring: { color: Hex; width: number; offset: number } };
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
  density: Record<'comfortable' | 'compact', { inset: Record<string, number>; gap: Record<string, number> }>;
  control: Record<string, number>;
  iconSize: Record<string, number>;
  targetMin: number;
  semantic: { light: SemanticScheme; dark: SemanticScheme };
  component: { light: ComponentScheme; dark: ComponentScheme };
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
export const density: Tokens['density'];
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
export const component: Tokens['component'];
export default tokens;
