// Flint React, part 2: the components with hard behavior, on Radix, rendering the components.css
// classes. Radix brings focus trapping, roving focus, Esc, typeahead and the live region; Flint brings
// every visual decision through the classes. Popups use the --floating modifiers, since Radix places them.
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { icons } from './basics.jsx';

const cx = (...parts) => parts.filter(Boolean).join(' ');

// ---------- Dialog ----------
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
/** title is the dialog's name; footer holds the actions, the main one last. */
export function DialogContent({ title, description, footer, closeLabel = 'Close', className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="flint-dialog-overlay" />
      <DialogPrimitive.Content className={cx('flint-dialog', 'flint-dialog--floating', className)} {...(description ? {} : { 'aria-describedby': undefined })} {...props}>
        <div className="flint-dialog__header">
          <DialogPrimitive.Title className="flint-dialog__title">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close className="flint-btn flint-btn--text flint-btn--icon" aria-label={closeLabel}>{icons.close}</DialogPrimitive.Close>
        </div>
        <div className="flint-dialog__body">
          {description && <DialogPrimitive.Description>{description}</DialogPrimitive.Description>}
          {children}
        </div>
        {footer && <div className="flint-dialog__footer">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// ---------- Tabs ----------
export const Tabs = ({ className, ...props }) => <TabsPrimitive.Root className={cx('flint-tabs', className)} {...props} />;
export const TabList = ({ className, ...props }) => <TabsPrimitive.List className={cx('flint-tabs__list', className)} {...props} />;
export const Tab = ({ className, ...props }) => <TabsPrimitive.Trigger className={cx('flint-tabs__tab', className)} {...props} />;
/** Mounted even when inactive, so every tab's aria-controls resolves; components.css hides inactive panels. */
export const TabPanel = ({ className, ...props }) => <TabsPrimitive.Content forceMount className={cx('flint-tabs__panel', className)} {...props} />;

// ---------- Menu ----------
export const Menu = MenuPrimitive.Root;
export const MenuTrigger = MenuPrimitive.Trigger;
export function MenuContent({ className, sideOffset = 4, align = 'start', ...props }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content sideOffset={sideOffset} align={align} className={cx('flint-menu', 'flint-menu--floating', className)} {...props} />
    </MenuPrimitive.Portal>
  );
}
/** danger: red, for actions that destroy something. The label should say what. */
export const MenuItem = ({ danger, className, ...props }) => <MenuPrimitive.Item className={cx('flint-menu__item', danger && 'flint-menu__item--danger', className)} {...props} />;
export const MenuSeparator = ({ className, ...props }) => <MenuPrimitive.Separator className={cx('flint-menu__separator', className)} {...props} />;

// ---------- Tooltip ----------
/** Extra detail for a control that already has a name. Wrap the app (or the area) in TooltipProvider. */
export const TooltipProvider = TooltipPrimitive.Provider;
export function Tooltip({ content, side = 'top', children, ...props }) {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content side={side} sideOffset={8} className="flint-tooltip flint-tooltip--floating">{content}</TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

// ---------- Toast ----------
/** Wrap the app once; ToastRegion renders the polite live region the toasts go into. */
export const ToastProvider = ToastPrimitive.Provider;
export const ToastRegion = ({ className, ...props }) => <ToastPrimitive.Viewport className={cx('flint-toast-region', className)} {...props} />;
/**
 * A toast. Give an action and it stays until dismissed (duration Infinity), since a timer would take
 * the action away. actionAltText says how to do the same thing without the toast (Radix requires it).
 */
export function Toast({ title, description, action, actionAltText, dismissLabel, duration, className, ...props }) {
  return (
    <ToastPrimitive.Root className={cx('flint-toast', className)} duration={action ? Infinity : duration} {...props}>
      <ToastPrimitive.Title className="flint-toast__title">{title}</ToastPrimitive.Title>
      {description && <ToastPrimitive.Description className="flint-toast__body">{description}</ToastPrimitive.Description>}
      {action && (
        <div className="flint-toast__actions">
          <ToastPrimitive.Action className="flint-toast__action" altText={actionAltText || action.label} onClick={action.onClick}>{action.label}</ToastPrimitive.Action>
        </div>
      )}
      <ToastPrimitive.Close className="flint-toast__close" aria-label={dismissLabel || `Dismiss: ${title}`}>{icons.close}</ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
