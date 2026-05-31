import { useCallback, useEffect, useState } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';
import type { ExcavationState, Tool } from '@/minigames/excavation/types';

const initialState = (): ExcavationState => ({
  status: 'idle',
  phase: 1,
  progress: 0,
  lives: 3,
  timeLeft: SettingsStore.getKey('noTimeMode') ? 0 : 120,
  timed: !SettingsStore.getKey('noTimeMode'),
  selectedTool: 'pick',
});

/**
 * Puente React ↔ escena Phaser del minijuego de excavación.
 */
export function useExcavationGame() {
  const [state, setState] = useState<ExcavationState>(initialState);

  useEffect(() => {
    const onState = (next: ExcavationState) => setState(next);
    EventBus.on(EventKeys.ExcavationStateChanged, onState);
    return () => {
      EventBus.off(EventKeys.ExcavationStateChanged, onState);
    };
  }, []);

  const selectTool = useCallback((tool: Tool) => {
    EventBus.emit(EventKeys.ExcavationToolSelected, tool);
  }, []);

  return { state, selectTool };
}
