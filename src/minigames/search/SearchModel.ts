// src/minigames/search/SearchModel.ts
import type {
  HiddenObject,
  SearchEvent,
  SearchSceneDef,
  SearchState,
  SearchStatus,
} from './types';

export interface SearchModelConfig {
  maxHints: number;
}

const DEFAULT_CONFIG: SearchModelConfig = { maxHints: 2 };

type Listener<T = unknown> = (value: T) => void;

/**
 * Pure-TS model for the hidden-objects minigame.
 *
 * Scene-agnostic: works in the logical 720x1280 coordinate system that the
 * scene declares in `SearchSceneDef`. Phaser scenes translate pointer events
 * and call `tryHit(x, y)`; React components subscribe via `on/off`.
 */
export class SearchModel {
  readonly sceneDef: SearchSceneDef;
  readonly config: SearchModelConfig;

  private _status: SearchStatus = 'idle';
  private _found = new Set<string>();
  private _hintsLeft: number;
  private listeners = new Map<SearchEvent, Set<Listener>>();

  constructor(sceneDef: SearchSceneDef, config: Partial<SearchModelConfig> = {}) {
    this.sceneDef = sceneDef;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this._hintsLeft = this.config.maxHints;
  }

  get status(): SearchStatus { return this._status; }
  get foundIds(): ReadonlySet<string> { return this._found; }
  get hintsLeft(): number { return this._hintsLeft; }
  get totalObjects(): number { return this.sceneDef.objects.length; }
  get progressPct(): number {
    return this.totalObjects === 0 ? 1 : this._found.size / this.totalObjects;
  }
  get pendingObjects(): HiddenObject[] {
    return this.sceneDef.objects.filter((o) => !this._found.has(o.id));
  }
  get state(): SearchState {
    return {
      status: this._status,
      sceneId: this.sceneDef.id,
      foundIds: this._found,
      hintsLeft: this._hintsLeft,
      totalObjects: this.totalObjects,
      progressPct: this.progressPct,
    };
  }

  on<T = unknown>(event: SearchEvent, fn: Listener<T>): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn as Listener);
  }
  off<T = unknown>(event: SearchEvent, fn: Listener<T>): void {
    this.listeners.get(event)?.delete(fn as Listener);
  }
  private emit(event: SearchEvent, payload?: unknown): void {
    this.listeners.get(event)?.forEach((l) => l(payload));
  }

  start(): void {
    if (this._status === 'paused') {
      this._status = 'playing';
      this.emit('resume');
      return;
    }
    this._status = 'playing';
    this.emit('start');
  }

  pause(): void {
    if (this._status === 'playing') {
      this._status = 'paused';
      this.emit('pause');
    }
  }

  resume(): void {
    if (this._status === 'paused') {
      this._status = 'playing';
      this.emit('resume');
    }
  }

  reset(): void {
    this._status = 'idle';
    this._found = new Set();
    this._hintsLeft = this.config.maxHints;
    this.emit('reset');
  }

  tryHit(x: number, y: number): HiddenObject | null {
    if (this._status !== 'playing') return null;

    const hit = this.sceneDef.objects.find((o) => {
      if (this._found.has(o.id)) return false;
      const { x: hx, y: hy, w, h } = o.hitbox;
      return x >= hx && x <= hx + w && y >= hy && y <= hy + h;
    });

    if (!hit) {
      this.emit('missed', { x, y });
      return null;
    }

    this._found.add(hit.id);
    this.emit('found', hit);
    this.emit('progress', this.progressPct);

    if (this._found.size >= this.sceneDef.objects.length) {
      this._status = 'success';
      this.emit('success');
    }

    return hit;
  }

  useHint(): HiddenObject | null {
    if (this._status !== 'playing') return null;
    if (this._hintsLeft <= 0) return null;
    const next = this.pendingObjects[0];
    if (!next) return null;
    this._hintsLeft -= 1;
    this.emit('hintUsed', next);
    return next;
  }
}
