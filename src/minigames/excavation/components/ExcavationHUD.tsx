import { ProgressBar } from '@/components/ui/ProgressBar';
import type { ExcavationState } from '@/minigames/excavation/types';

export interface ExcavationHUDProps {
  state: ExcavationState;
  /** Nombre legible del fósil que se está desenterrando. */
  fossilDisplayName: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const PHASE_LABEL: Record<1 | 2, string> = {
  1: 'Fase 1 · Hallar el contorno',
  2: 'Fase 2 · Revelar el fósil',
};

export function ExcavationHUD({
  state,
  fossilDisplayName,
}: ExcavationHUDProps): React.JSX.Element {
  const pct = Math.round(state.progress * 100);
  const phaseLabel = PHASE_LABEL[state.phase];

  return (
    <div className="flex flex-col gap-2 text-text-primary" aria-label="Estado del minijuego">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {fossilDisplayName}
        </span>
        <span className="text-sm text-text-secondary">{pct}%</span>
      </div>

      <ProgressBar value={state.progress} label={phaseLabel} />
      <span className="text-xs text-text-secondary">{phaseLabel}</span>

      <div className="flex items-center justify-between gap-3 text-base">
        <span
          className="text-failure"
          aria-label={`${state.lives} vidas restantes`}
          title={`${state.lives} vidas restantes`}
        >
          {'♥'.repeat(Math.max(0, state.lives))}
          {state.lives < 3 && (
            <span className="text-text-secondary/50">
              {'♥'.repeat(3 - state.lives)}
            </span>
          )}
        </span>
        {state.timed && (
          <span
            className="text-text-secondary tabular-nums"
            aria-label={`Tiempo restante: ${formatTime(state.timeLeft)}`}
          >
            {formatTime(state.timeLeft)}
          </span>
        )}
      </div>
    </div>
  );
}
