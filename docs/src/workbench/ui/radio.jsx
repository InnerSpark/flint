// shadcn/ui RadioGroup (Radix), restyled to Flint. Changed from upstream: 24px control
// (Flint's targetMin, upstream is 16px), 2px control-colored edge, Flint focus ring, and the
// dot uses radio.checkedFg so it stays visible on the checked fill in both modes, and
// aria-invalid draws the error edge.
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '../cn';

export function RadioGroup({ className, ...props }) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-[var(--gap-sm)]', className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'peer inline-grid place-content-center size-[var(--radio-size)] shrink-0 cursor-pointer rounded-full border-2 border-[var(--radio-border)] bg-[var(--input-bg)] text-[var(--radio-checked-fg)] hover:border-[var(--radio-border-hover)] aria-[invalid=true]:border-[var(--radio-border-error)] outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] data-[state=checked]:border-[var(--radio-checked-bg)] data-[state=checked]:bg-[var(--radio-checked-bg)] disabled:cursor-not-allowed disabled:border-[var(--radio-disabled)] disabled:bg-[var(--radio-disabled-bg)] disabled:text-[var(--radio-disabled)] disabled:data-[state=checked]:border-[var(--radio-disabled)] disabled:data-[state=checked]:bg-[var(--radio-disabled-bg)]',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="grid place-content-center">
        <span className="block size-[10px] rounded-full bg-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
