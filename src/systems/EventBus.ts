import { EventKeys } from '@/config/Constants';
import type { Settings, SaveData, MinigameResult } from '@/types';
import type { ExcavationState, Tool } from '@/minigames/excavation/types';
import type { HiddenObject, SearchState } from '@/minigames/search/types';

export interface BusEvents {
  [EventKeys.SettingsChanged]: (s: Settings) => void;
  [EventKeys.SaveChanged]: (s: SaveData) => void;
  [EventKeys.NarratorSpeak]: (text: string, opts?: { interrupt?: boolean }) => void;
  [EventKeys.NarratorStop]: () => void;
  [EventKeys.MinigameSuccess]: (result: MinigameResult) => void;
  [EventKeys.MinigameFailure]: (result: MinigameResult) => void;
  [EventKeys.MinigameReset]: () => void;
  [EventKeys.ModalOpened]: (id: string) => void;
  [EventKeys.ModalClosed]: (id: string) => void;
  [EventKeys.ExcavationToolSelected]: (tool: Tool) => void;
  [EventKeys.ExcavationStateChanged]: (state: ExcavationState) => void;
  [EventKeys.SearchModelReady]: (state: SearchState) => void;
  [EventKeys.SearchObjectFound]: (object: HiddenObject) => void;
  [EventKeys.SearchHintRequested]: () => void;
}

type AnyListener = (...args: unknown[]) => void;

class TypedEventBus {
  private listeners = new Map<string, Set<AnyListener>>();

  on<K extends keyof BusEvents>(event: K, fn: BusEvents[K]): this {
    let bucket = this.listeners.get(event as string);
    if (!bucket) {
      bucket = new Set();
      this.listeners.set(event as string, bucket);
    }
    bucket.add(fn as AnyListener);
    return this;
  }

  off<K extends keyof BusEvents>(event: K, fn?: BusEvents[K]): this {
    const bucket = this.listeners.get(event as string);
    if (!bucket) return this;
    if (!fn) {
      bucket.clear();
    } else {
      bucket.delete(fn as AnyListener);
    }
    return this;
  }

  emit<K extends keyof BusEvents>(event: K, ...args: Parameters<BusEvents[K]>): boolean {
    const bucket = this.listeners.get(event as string);
    if (!bucket || bucket.size === 0) return false;
    for (const fn of [...bucket]) {
      try {
        fn(...(args as unknown[]));
      } catch (err) {
        console.error(`EventBus: listener for "${String(event)}" threw`, err);
      }
    }
    return true;
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

export const EventBus = new TypedEventBus();
