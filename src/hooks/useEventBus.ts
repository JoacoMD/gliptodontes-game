import { useEffect } from 'react';
import { EventBus, type BusEvents } from '@/systems/EventBus';

export function useEventBus<K extends keyof BusEvents>(event: K, handler: BusEvents[K]): void {
  useEffect(() => {
    EventBus.on(event, handler);
    return () => {
      EventBus.off(event, handler);
    };
  }, [event, handler]);
}
