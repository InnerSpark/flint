// shadcn/ui DropdownMenu, restyled to Flint. Radix gives the APG menu button: focus moves in, arrow
// keys and typeahead move, Esc closes and returns focus to the trigger.
import * as Menu from '@radix-ui/react-dropdown-menu';
import { cn } from '../cn';

export const MENU_CONTENT = 'z-[var(--z-dropdown)] min-w-[12rem] rounded-[var(--menu-radius)] border border-[var(--menu-border)] bg-[var(--menu-bg)] p-[var(--space-4)] text-[var(--menu-fg)] shadow-[var(--shadow-popover)]';
export const MENU_ITEM = 'flex min-h-[var(--control-md)] cursor-pointer select-none items-center gap-[var(--space-8)] rounded-[var(--radius-xs)] px-[var(--space-12)] text-sm outline-none data-[highlighted]:bg-[var(--menu-item-bg-hover)] data-[highlighted]:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] data-[highlighted]:[outline-offset:calc(var(--focus-ring-width)*-1)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--color-action-disabled)]';
export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
  return (
    <Menu.Portal>
      <Menu.Content sideOffset={sideOffset} align="start" className={cn(MENU_CONTENT, className)} {...props} />
    </Menu.Portal>
  );
}
export const DropdownMenuItem = ({ className, variant, ...props }) => (
  <Menu.Item
    className={cn(MENU_ITEM, variant === 'destructive' && 'text-[var(--menu-item-fg-danger)]', className)}
    {...props}
  />
);
export const DropdownMenuSeparator = ({ className, ...props }) => <Menu.Separator className={cn('my-[var(--space-4)] border-t border-[var(--menu-border)]', className)} {...props} />;
