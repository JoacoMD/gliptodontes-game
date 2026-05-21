import { useEffect, useState } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';
import type { Settings } from '@/types';

export function useSettings(): Settings {
  const [state, setState] = useState<Settings>(() => SettingsStore.get());
  useEffect(() => {
    const fn = (next: Settings) => setState(next);
    EventBus.on(EventKeys.SettingsChanged, fn);
    return () => {
      EventBus.off(EventKeys.SettingsChanged, fn);
    };
  }, []);
  return state;
}
