import * as Progress from '@radix-ui/react-progress';

export interface ProgressBarProps {
  value: number; // 0..1
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps): React.JSX.Element {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <Progress.Root
      value={pct}
      aria-label={label}
      className="relative h-3 w-full overflow-hidden rounded-full border-2 border-panel-border bg-panel"
    >
      <Progress.Indicator
        className="h-full bg-accent transition-transform"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </Progress.Root>
  );
}
