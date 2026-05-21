import type { ColorBlindMode } from '@/config/Palettes';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { SettingsStore } from '@/systems/SettingsStore';

const CSS_FILTERS: Record<ColorBlindMode, string> = {
  normal: 'none',
  protanopia: 'url(#cb-protanopia)',
  deuteranopia: 'url(#cb-deuteranopia)',
  tritanopia: 'url(#cb-tritanopia)',
};

const SVG_DEFS = `
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden;">
  <defs>
    <filter id="cb-protanopia"><feColorMatrix in="SourceGraphic" type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/></filter>
    <filter id="cb-deuteranopia"><feColorMatrix in="SourceGraphic" type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter>
    <filter id="cb-tritanopia"><feColorMatrix in="SourceGraphic" type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/></filter>
  </defs>
</svg>`;

export const ColorBlindFilter = {
  init(): void {
    if (!document.getElementById('cb-svg-defs')) {
      const wrapper = document.createElement('div');
      wrapper.id = 'cb-svg-defs';
      wrapper.innerHTML = SVG_DEFS;
      document.body.appendChild(wrapper);
    }
    const apply = () => {
      const mode = SettingsStore.getKey('colorBlindMode');
      const app = document.getElementById('app');
      if (app) app.style.filter = CSS_FILTERS[mode];
    };
    apply();
    EventBus.on(EventKeys.SettingsChanged, apply);
  },
};
