import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useId } from 'react';
import { ReactNode } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>): React.JSX.Element {
  const id = useId();
  return (
    <div className="flex flex-col gap-2 py-2">
      <span id={id} className="text-base text-text-primary">
        {label}
      </span>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
        aria-labelledby={id}
        className="flex w-full overflow-hidden rounded-xl border-2 border-panel-border bg-panel"
      >
        {options.map((opt) => (
          <ToggleGroup.Item
            key={opt.value}
            value={opt.value}
            className="flex-1 px-3 py-2 text-sm text-text-primary transition-colors data-[state=on]:bg-accent data-[state=on]:text-white focus-visible:outline-2 focus-visible:outline-focus"
          >
            {opt.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
