import { useEffect } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';
import type { HiddenObject } from '../types';

export interface FactCardProps {
  object: HiddenObject | null;
  onDismiss: () => void;
  /** ms before auto-dismiss. Default 2500. */
  durationMs?: number;
}

export function FactCard({
  object,
  onDismiss,
  durationMs = 2500,
}: FactCardProps): React.JSX.Element | null {
  useEffect(() => {
    if (!object) return;
    if (SettingsStore.getKey('narratorEnabled')) {
      EventBus.emit(EventKeys.NarratorSpeak, `${object.name}. ${object.fact}`, {
        interrupt: true,
      });
    }
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [object, durationMs, onDismiss]);

  if (!object) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto absolute inset-x-4 bottom-28 z-30 rounded-xl border-2 border-panel-border bg-panel/95 p-4 shadow-lg"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Cerrar dato sobre ${object.name}`}
        className="w-full text-left"
      >
        <p className="text-lg font-semibold text-text-primary">{object.name}</p>
        <p className="text-sm leading-snug text-text-secondary">{object.fact}</p>
      </button>
    </div>
  );
}
