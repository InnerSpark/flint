// shadcn/ui Input, restyled to Flint input tokens. Error state follows aria-invalid, as upstream.
// Gap: Flint has no input.disabled tokens yet, so disabled reads the semantic disabled colors.
import { cn } from '../../lib/cn';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-[var(--input-height)] w-full min-w-0 rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-base text-[var(--input-fg)] placeholder:text-[var(--input-placeholder)] hover:border-[var(--input-border-hover)] outline-none focus-visible:border-[var(--input-border-focus)] focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] aria-[invalid=true]:border-[var(--input-border-error)] disabled:cursor-not-allowed disabled:border-[var(--color-border-disabled)] disabled:bg-[var(--color-action-disabled-bg)] disabled:text-[var(--color-action-disabled)]',
        className,
      )}
      {...props}
    />
  );
}
