// shadcn/ui Checkbox (Radix), restyled to Flint. Changed from upstream: 24px box (Flint's
// targetMin, upstream is 16px), 2px control-colored edge, Flint focus ring.
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '../cn';

export function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer inline-grid place-content-center size-[var(--checkbox-size)] shrink-0 cursor-pointer rounded-[var(--checkbox-radius)] border-2 border-[var(--checkbox-border)] bg-[var(--input-bg)] text-[var(--checkbox-checked-fg)] hover:border-[var(--input-border-hover)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] data-[state=checked]:border-[var(--checkbox-checked-bg)] data-[state=checked]:bg-[var(--checkbox-checked-bg)] disabled:cursor-not-allowed disabled:border-[var(--color-border-disabled)] disabled:bg-[var(--color-action-disabled-bg)] disabled:text-[var(--color-action-disabled)] disabled:data-[state=checked]:border-[var(--color-border-disabled)] disabled:data-[state=checked]:bg-[var(--color-action-disabled-bg)]',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
