// shadcn/ui Checkbox (Radix), restyled to Flint. Changed from upstream: 24px box (Flint's
// targetMin, upstream is 16px), 2px control-colored edge, Flint focus ring, an indeterminate bar,
// and a red edge on aria-invalid.
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '../cn';

export function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer inline-grid place-content-center size-[var(--checkbox-size)] shrink-0 cursor-pointer rounded-[var(--checkbox-radius)] border-2 border-[var(--checkbox-border)] bg-[var(--input-bg)] text-[var(--checkbox-checked-fg)] hover:border-[var(--checkbox-border-hover)] aria-[invalid=true]:border-[var(--checkbox-border-error)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] data-[state=checked]:border-[var(--checkbox-checked-bg)] data-[state=checked]:bg-[var(--checkbox-checked-bg)] data-[state=indeterminate]:border-[var(--checkbox-checked-bg)] data-[state=indeterminate]:bg-[var(--checkbox-checked-bg)] disabled:cursor-not-allowed disabled:border-[var(--color-border-disabled)] disabled:bg-[var(--checkbox-disabled-bg)] disabled:text-[var(--checkbox-disabled)] disabled:data-[state=checked]:border-[var(--color-border-disabled)] disabled:data-[state=checked]:bg-[var(--checkbox-disabled-bg)]',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="group grid place-content-center">
        {/* Tick when checked, bar when indeterminate (Flint addition). */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="group-data-[state=indeterminate]:hidden">
          <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="hidden group-data-[state=indeterminate]:block">
          <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
