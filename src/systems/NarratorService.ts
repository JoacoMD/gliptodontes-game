import { EventKeys } from '@/config/Constants';
import { EventBus } from './EventBus';
import { SettingsStore } from './SettingsStore';

class NarratorServiceClass {
  private supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  init(): void {
    EventBus.on(EventKeys.NarratorSpeak, (text, opts) => this.speak(text, opts));
    EventBus.on(EventKeys.NarratorStop, () => this.stop());
  }

  speak(text: string, opts: { interrupt?: boolean } = {}): void {
    if (!this.supported) return;
    if (!SettingsStore.getKey('narratorEnabled')) return;
    if (opts.interrupt) this.stop();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-AR';
    utter.volume = SettingsStore.getKey('narratorVolume');
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);

    const live = document.getElementById('a11y-live');
    if (live) live.textContent = text;
  }

  stop(): void {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
  }
}

export const NarratorService = new NarratorServiceClass();
