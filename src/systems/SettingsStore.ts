import { EventKeys, StorageKeys } from '@/config/Constants';
import type { Settings } from '@/types';
import { EventBus } from './EventBus';

export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  fontScale: 'medium',
  simplifiedFont: false,
  colorBlindMode: 'normal',
  musicVolume: 0.6,
  sfxVolume: 0.8,
  narratorVolume: 1,
  noTimeMode: false,
  narratorEnabled: true,
});

const isBrowser = (): boolean =>
  typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined';

class SettingsStoreClass {
  private state: Settings = { ...DEFAULT_SETTINGS };
  private loaded = false;

  load(): Settings {
    if (this.loaded) return this.state;
    this.loaded = true;
    if (!isBrowser()) return this.state;
    try {
      const raw = globalThis.localStorage.getItem(StorageKeys.Settings);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        this.state = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (err) {
      console.warn('SettingsStore: invalid stored settings, using defaults', err);
    }
    return this.state;
  }

  get(): Settings {
    if (!this.loaded) this.load();
    return this.state;
  }

  getKey<K extends keyof Settings>(key: K): Settings[K] {
    return this.get()[key];
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    if (!this.loaded) this.load();
    if (this.state[key] === value) return;
    this.state = { ...this.state, [key]: value };
    this.persist();
    EventBus.emit(EventKeys.SettingsChanged, this.state);
  }

  patch(patch: Partial<Settings>): void {
    if (!this.loaded) this.load();
    this.state = { ...this.state, ...patch };
    this.persist();
    EventBus.emit(EventKeys.SettingsChanged, this.state);
  }

  reset(): void {
    this.state = { ...DEFAULT_SETTINGS };
    this.persist();
    EventBus.emit(EventKeys.SettingsChanged, this.state);
  }

  private persist(): void {
    if (!isBrowser()) return;
    try {
      globalThis.localStorage.setItem(StorageKeys.Settings, JSON.stringify(this.state));
    } catch (err) {
      console.warn('SettingsStore: failed to persist', err);
    }
  }
}

export const SettingsStore = new SettingsStoreClass();
