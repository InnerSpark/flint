// shadcn/ui Button, restyled to Flint. Same API as upstream (variant, asChild); every color,
// size and focus value reads a Flint component token instead of shadcn's defaults.
// Changed from upstream: no opacity-50 disabled state (disabled has its own tokens), and the
// focus ring is Flint's solid 2px ring instead of a 50% transparent ring.
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] min-h-[var(--button-height)] px-4 text-sm font-bold transition-colors cursor-pointer border border-transparent outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] disabled:cursor-not-allowed disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-fg)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-bg-hover)]',
        secondary: 'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-bg-hover)] disabled:border-[var(--button-disabled-border)]',
        destructive: 'bg-[var(--button-danger-bg)] text-[var(--button-danger-fg)] hover:bg-[var(--button-danger-bg-hover)]',
        ghost: 'bg-transparent text-[var(--button-text-fg)] hover:bg-[var(--button-text-bg-hover)] disabled:bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export function Button({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export { buttonVariants };
