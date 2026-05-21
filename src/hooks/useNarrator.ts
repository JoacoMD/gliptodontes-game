import { useCallback } from 'react';
import { NarratorService } from '@/systems/NarratorService';

export function useNarrator() {
  const speak = useCallback((text: string, opts?: { interrupt?: boolean }) => {
    NarratorService.speak(text, opts);
  }, []);
  const stop = useCallback(() => NarratorService.stop(), []);
  return { speak, stop };
}
