import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { SettingsStore } from '@/systems/SettingsStore';
import { SaveStore } from '@/systems/SaveStore';
import { ThemeBridge } from '@/a11y/ThemeBridge';
import { FontScaler } from '@/a11y/FontScaler';
import { ColorBlindFilter } from '@/a11y/ColorBlindFilter';
import { KeyboardNav } from '@/a11y/KeyboardNav';
import { NarratorService } from '@/systems/NarratorService';
import '@/styles/fonts.css';
import '@/styles/tailwind.css';

// Bootstrap singletons before React renders so the first paint already
// reflects persisted settings (font scale, color-blind palette, etc).
SettingsStore.load();
SaveStore.load();
ThemeBridge.init();
FontScaler.init();
ColorBlindFilter.init();
KeyboardNav.init();
NarratorService.init();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
