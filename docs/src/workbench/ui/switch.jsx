// shadcn/ui Switch (Radix), restyled to Flint. Changed from upstream: 48x24 track (24px is
// Flint's targetMin), Flint focus ring, and the checked thumb uses switch.thumbChecked so it stays
// visible on a light track in dark mode (ASDS-45). Disabled uses switch.thumbDisabled so the thumb's
// position still shows. Motion stops under prefers-reduced-motion.
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../cn';

export function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative inline-flex h-[var(--target-min)] w-[var(--space-48)] shrink-0 cursor-pointer items-center rounded-full bg-[var(--switch-track)] transition-colors motion-reduce:transition-none outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)] data-[state=checked]:bg-[var(--switch-track-checked)] disabled:cursor-not-allowed disabled:bg-[var(--switch-track-disabled)] disabled:data-[state=checked]:bg-[var(--switch-track-disabled)]',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 translate-x-1 rounded-full bg-[var(--switch-thumb)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-emphasis)] motion-reduce:transition-none data-[state=checked]:translate-x-7 data-[state=checked]:bg-[var(--switch-thumb-checked)] data-[disabled]:bg-[var(--switch-thumb-disabled)] data-[disabled]:data-[state=checked]:bg-[var(--switch-thumb-disabled)]"
      />
    </SwitchPrimitive.Root>
  );
}
