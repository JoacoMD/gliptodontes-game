import { describe, expect, it } from 'vitest';
import { SettingsStore, DEFAULT_SETTINGS } from '@/systems/SettingsStore';
import { EventBus } from '@/systems/EventBus';
import { EventKeys, StorageKeys } from '@/config/Constants';

describe('SettingsStore', () => {
  it('returns defaults on fresh load', () => {
    SettingsStore.reset();
    expect(SettingsStore.get()).toEqual({ ...DEFAULT_SETTINGS });
  });

  it('persists updates to localStorage', () => {
    SettingsStore.set('fontScale', 'large');
    const raw = localStorage.getItem(StorageKeys.Settings);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).fontScale).toBe('large');
  });

  it('emits settings:change event on change', () => {
    let received: unknown = null;
    EventBus.on(EventKeys.SettingsChanged, (s) => (received = s));
    SettingsStore.set('noTimeMode', true);
    expect(received).toMatchObject({ noTimeMode: true });
  });

  it('no-op when the value is unchanged', () => {
    SettingsStore.reset();
    let calls = 0;
    EventBus.on(EventKeys.SettingsChanged, () => calls++);
    SettingsStore.set('fontScale', DEFAULT_SETTINGS.fontScale);
    expect(calls).toBe(0);
  });
});
