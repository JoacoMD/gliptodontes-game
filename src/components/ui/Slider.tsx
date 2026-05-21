import * as RSlider from '@radix-ui/react-slider';
import { useId } from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  formatValue?: (v: number) => string;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.05,
  onChange,
  formatValue,
}: SliderProps): React.JSX.Element {
  const id = useId();
  const display = formatValue ? formatValue(value) : `${Math.round(value * 100)}%`;
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-base text-text-primary">
          {label}
        </label>
        <span className="text-sm text-text-secondary" aria-hidden>
          {display}
        </span>
      </div>
      <RSlider.Root
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? min)}
        aria-label={label}
        aria-valuetext={display}
        className="relative flex h-8 w-full touch-none select-none items-center"
      >
        <RSlider.Track className="relative h-2 grow rounded-full border border-panel-border bg-panel">
          <RSlider.Range className="absolute h-full rounded-full bg-accent" />
        </RSlider.Track>
        <RSlider.Thumb className="block h-6 w-6 rounded-full border-2 border-panel-border bg-accent shadow focus-visible:outline-2 focus-visible:outline-focus" />
      </RSlider.Root>
    </div>
  );
}
