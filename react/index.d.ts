// Types for @innerspark/flint/react. Each component takes its listed props plus every prop of the
// element it renders.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FieldsetHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, SVGAttributes, TextareaHTMLAttributes } from 'react';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as TabsPrimitive from '@radix-ui/react-tabs';
import type * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as ToastPrimitive from '@radix-ui/react-toast';

export type Intent = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'text';
  size?: 'md' | 'sm';
  /** Square, the button's height. Give it an aria-label and an aria-hidden icon. */
  iconOnly?: boolean;
  /** Shows a spinner, sets aria-busy, keeps focus, blocks the click. */
  busy?: boolean;
  /** Looks disabled but stays focusable, so people can find out why. Blocks the click. */
  disabledFocusable?: boolean;
}
export function Button(props: ButtonProps): ReactElement;

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  standalone?: boolean;
}
/** target="_blank" adds "(opens in a new tab)" for screen readers. */
export function Link(props: LinkProps): ReactElement;

export interface FieldProps {
  label: ReactNode;
  helper?: ReactNode;
  /** Shown with an icon; sets aria-invalid on the control. */
  error?: ReactNode;
  required?: boolean;
  id?: string;
  className?: string;
  /** Exactly one control: Input, Textarea or Select. */
  children: ReactElement;
}
export function Field(props: FieldProps): ReactElement;
export function Input(props: InputHTMLAttributes<HTMLInputElement>): ReactElement;
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>): ReactElement;
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>): ReactElement;

export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}
export function Checkbox(props: ChoiceProps & { indeterminate?: boolean }): ReactElement;
export function Radio(props: ChoiceProps): ReactElement;
export function RadioGroup(props: FieldsetHTMLAttributes<HTMLFieldSetElement> & { legend: ReactNode; name?: string }): ReactElement;
export function Switch(props: ChoiceProps): ReactElement;

export function Badge(props: HTMLAttributes<HTMLSpanElement> & { intent?: Intent }): ReactElement;
export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: Intent;
  outlined?: boolean;
  /** Adds a remove button, named "Remove <text>" unless removeLabel is given. */
  onRemove?: () => void;
  removeLabel?: string;
}
export function Chip(props: ChipProps): ReactElement;
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  intent?: Exclude<Intent, 'neutral'>;
  title?: ReactNode;
  /** Replace the intent icon, or pass null for none. */
  icon?: ReactNode;
}
export function Alert(props: AlertProps): ReactElement;
export function SkipLink(props: AnchorHTMLAttributes<HTMLAnchorElement>): ReactElement;
export interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
  /** Makes the icon meaningful (role="img"). Without it the icon is decorative (aria-hidden). */
  label?: string;
}
export function Icon(props: IconProps): ReactElement;

export const Dialog: typeof DialogPrimitive.Root;
export const DialogTrigger: typeof DialogPrimitive.Trigger;
export const DialogClose: typeof DialogPrimitive.Close;
export interface DialogContentProps extends Omit<DialogPrimitive.DialogContentProps, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
}
export function DialogContent(props: DialogContentProps): ReactElement;

export function Tabs(props: TabsPrimitive.TabsProps): ReactElement;
export function TabList(props: TabsPrimitive.TabsListProps): ReactElement;
export function Tab(props: TabsPrimitive.TabsTriggerProps): ReactElement;
export function TabPanel(props: TabsPrimitive.TabsContentProps): ReactElement;

export const Menu: typeof MenuPrimitive.Root;
export const MenuTrigger: typeof MenuPrimitive.Trigger;
export function MenuContent(props: MenuPrimitive.DropdownMenuContentProps): ReactElement;
export function MenuItem(props: MenuPrimitive.DropdownMenuItemProps & { danger?: boolean }): ReactElement;
export function MenuSeparator(props: MenuPrimitive.DropdownMenuSeparatorProps): ReactElement;

export const TooltipProvider: typeof TooltipPrimitive.Provider;
export interface TooltipProps extends TooltipPrimitive.TooltipProps {
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** The control it describes. It must already have a name. */
  children: ReactElement;
}
export function Tooltip(props: TooltipProps): ReactElement;

export const ToastProvider: typeof ToastPrimitive.Provider;
export function ToastRegion(props: ToastPrimitive.ToastViewportProps): ReactElement;
export interface ToastProps extends Omit<ToastPrimitive.ToastProps, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** A toast with an action never times out. */
  action?: { label: string; onClick?: () => void };
  actionAltText?: string;
  dismissLabel?: string;
}
export function Toast(props: ToastProps): ReactElement;
