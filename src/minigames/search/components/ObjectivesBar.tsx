import type { HiddenObject, SearchState } from '../types';

export interface ObjectivesBarProps {
  objects: HiddenObject[];
  state: SearchState;
}

export function ObjectivesBar({ objects, state }: ObjectivesBarProps): React.JSX.Element {
  return (
    <div
      role="list"
      aria-label="Objetos a encontrar"
      className="flex gap-3 overflow-x-auto pb-1"
    >
      {objects.map((obj) => {
        const found = state.foundIds.has(obj.id);
        return (
          <div
            key={obj.id}
            role="listitem"
            aria-label={found ? `Encontrado: ${obj.name}` : `Pendiente: ${obj.name}`}
            aria-live="polite"
            className="flex w-16 shrink-0 flex-col items-center gap-1"
          >
            <div
              className={[
                'relative flex h-14 w-14 items-center justify-center rounded-full border-2',
                found
                  ? 'border-accent/40 bg-panel/60 opacity-50'
                  : 'border-accent bg-panel',
              ].join(' ')}
            >
              <span className="text-lg font-semibold text-text-primary">
                {obj.name.charAt(0)}
              </span>
              {found && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white"
                >
                  ✓
                </span>
              )}
            </div>
            <span
              className={[
                'text-center text-[11px] leading-tight',
                found ? 'text-text-secondary line-through' : 'text-text-primary',
              ].join(' ')}
            >
              {obj.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
