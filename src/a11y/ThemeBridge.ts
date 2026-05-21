import { Palettes, toCssHex } from '@/config/Palettes';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';

/**
 * Pushes the active color palette into the :root CSS variables
 * (`--c-*`) so Tailwind's `@theme` mappings resolve to the
 * correct colors for the current colorBlindMode setting.
 */
export const ThemeBridge = {
  init(): void {
    const apply = () => {
      const mode = SettingsStore.getKey('colorBlindMode');
      const p = Palettes[mode];
      const root = document.documentElement.style;
      root.setProperty('--c-background', toCssHex(p.background));
      root.setProperty('--c-panel', toCssHex(p.panel));
      root.setProperty('--c-panel-border', toCssHex(p.panelBorder));
      root.setProperty('--c-text-primary', toCssHex(p.textPrimary));
      root.setProperty('--c-text-secondary', toCssHex(p.textSecondary));
      root.setProperty('--c-accent', toCssHex(p.accent));
      root.setProperty('--c-accent-alt', toCssHex(p.accentAlt));
      root.setProperty('--c-success', toCssHex(p.success));
      root.setProperty('--c-failure', toCssHex(p.failure));
      root.setProperty('--c-warning', toCssHex(p.warning));
      root.setProperty('--c-focus-ring', toCssHex(p.focusRing));
    };
    apply();
    EventBus.on(EventKeys.SettingsChanged, apply);
  },
};
