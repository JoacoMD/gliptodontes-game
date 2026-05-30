import { Button } from '@/components/ui/Button';

export interface HintButtonProps {
  hintsLeft: number;
  disabled?: boolean;
  onUse: () => void;
}

export function HintButton({ hintsLeft, disabled, onUse }: HintButtonProps): React.JSX.Element {
  const noHints = hintsLeft <= 0;
  return (
    <div className="flex items-center justify-end">
      <Button
        variant="primary"
        size="lg"
        onClick={onUse}
        disabled={disabled || noHints}
        aria-label={noHints ? 'Sin pistas disponibles' : `Usar pista (quedan ${hintsLeft})`}
        className="relative rounded-full"
      >
        <span aria-hidden="true">🔍</span>
        <span className="ml-2">Pista</span>
        <span
          aria-hidden="true"
          className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/90 px-1 text-xs font-semibold text-accent"
        >
          {hintsLeft}
        </span>
      </Button>
    </div>
  );
}
