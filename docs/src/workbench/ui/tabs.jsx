// shadcn/ui Tabs, restyled to Flint. Radix gives the APG tabs pattern: roving focus, arrow keys,
// automatic activation. The selected tab shows a bar and a heavier weight, not color alone.
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../cn';

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }) => <TabsPrimitive.List className={cn('flex gap-[var(--space-4)] overflow-x-auto border-b border-[var(--tabs-border)]', className)} {...props} />;
export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn('min-h-[var(--control-md)] shrink-0 cursor-pointer whitespace-nowrap rounded-t-[var(--radius-control)] px-[var(--space-16)] text-sm font-semibold text-[var(--tabs-fg)] hover:bg-[var(--tabs-bg-hover)] hover:text-[var(--tabs-fg-hover)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:calc(var(--focus-ring-offset)*-1_-_var(--focus-ring-width))] data-[state=active]:font-extrabold data-[state=active]:text-[var(--tabs-fg-selected)] data-[state=active]:shadow-[inset_0_calc(var(--space-4)*-1)_0_var(--tabs-indicator)]', className)}
    {...props}
  />
);
// forceMount by default: Radix only renders the active panel, which leaves the other tabs' aria-controls
// pointing at nothing. Mounted panels stay hidden (the hidden attribute) until selected.
export const TabsContent = ({ className, forceMount = true, ...props }) => <TabsPrimitive.Content forceMount={forceMount} className={cn('py-[var(--space-16)] data-[state=inactive]:hidden outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)]', className)} {...props} />;
