import { useEffect, useState } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SaveStore } from '@/systems/SaveStore';
import type { SaveData } from '@/types';

export function useSave(): SaveData {
  const [state, setState] = useState<SaveData>(() => SaveStore.get());
  useEffect(() => {
    const fn = (next: SaveData) => setState(next);
    EventBus.on(EventKeys.SaveChanged, fn);
    return () => {
      EventBus.off(EventKeys.SaveChanged, fn);
    };
  }, []);
  return state;
}
