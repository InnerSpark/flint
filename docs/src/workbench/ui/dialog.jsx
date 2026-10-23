// shadcn/ui Dialog, restyled to Flint. Same parts as upstream (Dialog, DialogTrigger, DialogContent,
// DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose); every value reads a Flint
// dialog token. Radix traps focus, closes on Esc and returns focus to the trigger.
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../cn';

export const DIALOG_PANEL = 'relative grid gap-[var(--space-16)] rounded-[var(--dialog-radius)] border border-[var(--dialog-border)] bg-[var(--dialog-bg)] p-[var(--space-24)] text-[var(--dialog-fg)] shadow-[var(--shadow-dialog)] outline-none';
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, closeLabel = 'Close', ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-[var(--color-overlay-scrim)]" />
      <DialogPrimitive.Content
        className={cn('fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[min(32rem,calc(100vw-var(--space-32)))] max-h-[calc(100dvh-var(--space-48))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto', DIALOG_PANEL, className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close aria-label={closeLabel} className="absolute right-[var(--space-16)] top-[var(--space-16)] grid size-[var(--control-md)] place-content-center rounded-[var(--radius-control)] text-[var(--button-text-fg)] hover:bg-[var(--button-text-bg-hover)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const DialogHeader = ({ className, ...props }) => <div className={cn('grid gap-[var(--space-8)] pr-[var(--space-40)]', className)} {...props} />;
export const DialogFooter = ({ className, ...props }) => <div className={cn('flex flex-wrap justify-end gap-[var(--space-8)]', className)} {...props} />;
export const DialogTitle = ({ className, ...props }) => <DialogPrimitive.Title className={cn('m-0 text-[length:var(--type-heading-h3-size)] font-bold leading-[var(--type-heading-h3-line-height)] text-[var(--dialog-title-fg)]', className)} {...props} />;
export const DialogDescription = ({ className, ...props }) => <DialogPrimitive.Description className={cn('m-0 text-[length:var(--font-size-md)]', className)} {...props} />;
