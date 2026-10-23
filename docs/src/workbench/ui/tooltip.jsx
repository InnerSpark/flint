// shadcn/ui Tooltip, restyled to Flint. Radix shows it on hover and keyboard focus, keeps it while the
// pointer is over it, and Esc dismisses it. It describes the trigger (aria-describedby); it is never the
// trigger's only name.
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../cn';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({ className, sideOffset = 8, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content sideOffset={sideOffset} className={cn('z-[var(--z-popover)] max-w-[16rem] rounded-[var(--tooltip-radius)] border border-transparent bg-[var(--tooltip-bg)] px-[var(--space-8)] py-[var(--space-4)] text-center text-xs font-semibold text-[var(--tooltip-fg)]', className)} {...props}>
        {children}
        <TooltipPrimitive.Arrow className="fill-[var(--tooltip-bg)]" width={10} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
