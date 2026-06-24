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
export const control: Tokens['control'];
export const iconSize: Tokens['iconSize'];
export const targetMin: Tokens['targetMin'];
export const semantic: Tokens['semantic'];
export default tokens;
