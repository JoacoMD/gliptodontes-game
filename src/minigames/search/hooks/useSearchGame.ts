import { useEffect, useState } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import type { HiddenObject, SearchState } from '../types';

const EMPTY_STATE: SearchState = {
  status: 'idle',
  sceneId: 'lab',
  foundIds: new Set<string>(),
  hintsLeft: 2,
  totalObjects: 0,
  progressPct: 0,
};

/**
 * Bridges React HUD components to the active Phaser scene's SearchModel.
 * The scene publishes its state via EventBus.SearchModelReady on every change.
 */
export function useSearchGame(): {
  state: SearchState;
  lastFound: HiddenObject | null;
  acknowledgeFound: () => void;
} {
  const [state, setState] = useState<SearchState>(EMPTY_STATE);
  const [lastFound, setLastFound] = useState<HiddenObject | null>(null);

  useEffect(() => {
    const onState = (next: SearchState) => setState(next);
    const onFound = (obj: HiddenObject) => setLastFound(obj);
    EventBus.on(EventKeys.SearchModelReady, onState);
    EventBus.on(EventKeys.SearchObjectFound, onFound);
    return () => {
      EventBus.off(EventKeys.SearchModelReady, onState);
      EventBus.off(EventKeys.SearchObjectFound, onFound);
    };
  }, []);

  return {
    state,
    lastFound,
    acknowledgeFound: () => setLastFound(null),
  };
}
