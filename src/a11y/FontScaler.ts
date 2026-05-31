import type { FontScale } from '@/types';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';

const SCALE_FACTORS: Record<FontScale, number> = {
  small: 0.85,
  medium: 1,
  large: 1.2,
  xlarge: 1.45,
};

export const FontScaler = {
  init(): void {
    const apply = () => {
      const s = SettingsStore.get();
      const factor = SCALE_FACTORS[s.fontScale];
      document.documentElement.style.setProperty('--font-scale', String(factor));
      document.documentElement.dataset.fontScale = s.fontScale;
      document.documentElement.dataset.simplifiedFont = s.simplifiedFont ? 'true' : 'false';
    };
    apply();
    EventBus.on(EventKeys.SettingsChanged, apply);
  },

  factorFor(scale: FontScale): number {
    return SCALE_FACTORS[scale];
  },

  fontFamily(simplified: boolean): string {
    return simplified
      ? '"Atkinson Hyperlegible", "Inter", system-ui, sans-serif'
      : '"Bubblegum Sans", system-ui, sans-serif';
  },

  titleFontFamily(simplified: boolean): string {
    return simplified
      ? '"Atkinson Hyperlegible", "Inter", system-ui, sans-serif'
      : '"Darumadrop One", "Georgia", serif';
  },
};
