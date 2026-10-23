// shadcn/ui Toast, restyled to Flint. Radix renders a polite live region and never moves focus to a
// toast; F8 jumps to the region. A toast with an action should not time out: pass duration={Infinity}.
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '../cn';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ({ className, ...props }) => <ToastPrimitive.Viewport className={cn('fixed bottom-[var(--space-16)] right-[var(--space-16)] z-[var(--z-toast)] m-0 flex w-[min(24rem,calc(100vw-var(--space-32)))] list-none flex-col gap-[var(--space-8)] p-0 outline-none', className)} {...props} />;
export const TOAST = 'grid grid-cols-[minmax(0,1fr)_auto] gap-x-[var(--space-12)] rounded-[var(--toast-radius)] border border-transparent bg-[var(--toast-bg)] py-[var(--space-12)] pl-[var(--space-16)] pr-[var(--space-8)] text-sm text-[var(--toast-fg)] shadow-[var(--shadow-popover)] motion-safe:data-[state=open]:animate-[flint-toast-in_var(--duration-slow)_var(--ease-emphasis)]';
export const Toast = ({ className, ...props }) => <ToastPrimitive.Root className={cn(TOAST, className)} {...props} />;
export const ToastTitle = ({ className, ...props }) => <ToastPrimitive.Title className={cn('m-0 pt-[var(--space-2)] font-bold', className)} {...props} />;
export const ToastDescription = ({ className, ...props }) => <ToastPrimitive.Description className={cn('col-start-1 m-0 text-[var(--toast-fg-muted)]', className)} {...props} />;
export const ToastAction = ({ className, ...props }) => <ToastPrimitive.Action className={cn('col-start-1 min-h-[var(--target-min)] cursor-pointer justify-self-start bg-transparent p-0 text-sm font-bold text-[var(--toast-fg)] underline outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--toast-focus-ring)] focus-visible:[outline-offset:var(--focus-ring-offset)]', className)} {...props} />;
export const ToastClose = ({ className, label = 'Dismiss', ...props }) => (
  <ToastPrimitive.Close aria-label={label} className={cn('col-start-2 row-start-1 grid size-[var(--target-min)] cursor-pointer place-content-center rounded-[var(--radius-xs)] bg-transparent text-[var(--toast-fg)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--toast-focus-ring)]', className)} {...props}>
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  </ToastPrimitive.Close>
);
