import { EventKeys, SceneKeys, StorageKeys } from '@/config/Constants';
import type { SaveData } from '@/types';
import { EventBus } from './EventBus';

const DEFAULT_SAVE: Readonly<SaveData> = Object.freeze({
  completedMissions: [],
  visitedTopics: [],
  unlockedMinigames: [
    SceneKeys.MinigameAR,
    SceneKeys.MinigameExcavation,
    SceneKeys.MinigameSearch,
    SceneKeys.MinigameOrigin,
  ],
});

const isBrowser = (): boolean =>
  typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined';

class SaveStoreClass {
  private state: SaveData = structuredClone(DEFAULT_SAVE) as SaveData;
  private loaded = false;

  load(): SaveData {
    if (this.loaded) return this.state;
    this.loaded = true;
    if (!isBrowser()) return this.state;
    try {
      const raw = globalThis.localStorage.getItem(StorageKeys.Save);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SaveData>;
        this.state = { ...this.state, ...parsed };
      }
    } catch (err) {
      console.warn('SaveStore: invalid stored save, using defaults', err);
    }
    return this.state;
  }

  get(): SaveData {
    if (!this.loaded) this.load();
    return this.state;
  }

  markMissionComplete(id: string): void {
    if (this.get().completedMissions.includes(id)) return;
    this.state = {
      ...this.state,
      completedMissions: [...this.state.completedMissions, id],
    };
    this.persist();
    EventBus.emit(EventKeys.SaveChanged, this.state);
  }

  markTopicVisited(id: string): void {
    if (this.get().visitedTopics.includes(id)) return;
    this.state = {
      ...this.state,
      visitedTopics: [...this.state.visitedTopics, id],
    };
    this.persist();
    EventBus.emit(EventKeys.SaveChanged, this.state);
  }

  reset(): void {
    this.state = structuredClone(DEFAULT_SAVE) as SaveData;
    this.persist();
    EventBus.emit(EventKeys.SaveChanged, this.state);
  }

  private persist(): void {
    if (!isBrowser()) return;
    try {
      globalThis.localStorage.setItem(StorageKeys.Save, JSON.stringify(this.state));
    } catch (err) {
      console.warn('SaveStore: failed to persist', err);
    }
  }
}

export const SaveStore = new SaveStoreClass();
