import { ProgressBar } from '@/components/ui/ProgressBar';
import { TOOL_LABEL } from '@/minigames/excavation/types';
import type { ExcavationState } from '@/minigames/excavation/types';

export interface ExcavationHUDProps {
  state: ExcavationState;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ExcavationHUD({ state }: ExcavationHUDProps): React.JSX.Element {
  const layerHuman = state.layer + 1;
  const pct = Math.round(state.layerPct * 100);
  const required = TOOL_LABEL[
    state.layer === 0 ? 'pick' : state.layer === 1 ? 'chisel' : 'brush'
  ];

  return (
    <div className="flex flex-col gap-2 text-text-primary" aria-label="Estado del minijuego">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Capa {layerHuman} / 3
        </span>
        <span className="text-sm text-text-secondary">Herramienta correcta: {required}</span>
      </div>

      <ProgressBar value={state.layerPct} label={`Avance de la capa ${layerHuman}`} />

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
        <span className="text-text-secondary tabular-nums" aria-live="off">
          {pct}%
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
