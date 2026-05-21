import * as Switch from '@radix-ui/react-switch';
import { useId } from 'react';

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}

export function Toggle({ label, description, checked, onChange, id }: ToggleProps): React.JSX.Element {
  const reactId = useId();
  const inputId = id ?? `toggle-${reactId}`;
  const descId = description ? `${inputId}-desc` : undefined;
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex min-w-0 flex-col">
        <label htmlFor={inputId} className="text-base text-text-primary">
          {label}
        </label>
        {description && (
          <span id={descId} className="text-sm text-text-secondary">
            {description}
          </span>
        )}
      </div>
      <Switch.Root
        id={inputId}
        checked={checked}
        onCheckedChange={onChange}
        aria-describedby={descId}
        className="relative h-8 w-14 shrink-0 rounded-full border-2 border-panel-border bg-panel data-[state=checked]:bg-accent"
      >
        <Switch.Thumb className="block h-6 w-6 translate-x-[2px] rounded-full bg-white shadow transition-transform will-change-transform data-[state=checked]:translate-x-[26px]" />
      </Switch.Root>
    </div>
  );
}
