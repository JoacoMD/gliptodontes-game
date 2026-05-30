import { useCallback, useEffect, useState } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';
import {
  TOOL_FOR_LAYER,
  type ExcavationState,
  type Tool,
} from '@/minigames/excavation/types';

const initialState = (): ExcavationState => ({
  status: 'idle',
  layer: 0,
  layerPct: 0,
  lives: 3,
  timeLeft: SettingsStore.getKey('noTimeMode') ? 0 : 120,
  timed: !SettingsStore.getKey('noTimeMode'),
  selectedTool: TOOL_FOR_LAYER[0]!,
});

/**
 * React bridge to the excavation Phaser scene.
 *
 * - Subscribes to `ExcavationStateChanged` events emitted by the scene.
 * - Exposes `selectTool(tool)` that emits `ExcavationToolSelected`, which the
 *   scene listens to and forwards into its model.
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
