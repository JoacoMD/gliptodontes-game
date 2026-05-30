import { TOOL_FOR_LAYER, type ExcavationState, type LayerIndex, type Tool } from './types';

export interface ExcavationConfig {
  /** Number of logical cells per layer used to track progress. */
  cellsPerLayer: number;
  /** Fraction of cells that must be cleaned to advance a layer (0..1). */
  cleanThreshold: number;
  totalLives: number;
  /** Time limit in seconds, or null when noTimeMode is on. */
  timeLimitSec: number | null;
}

export const DEFAULT_EXCAVATION_CONFIG: ExcavationConfig = {
  cellsPerLayer: 2400,
  cleanThreshold: 0.95,
  totalLives: 3,
  timeLimitSec: 120,
};

type EventName =
  | 'progress'
  | 'layerAdvanced'
  | 'lives'
  | 'time'
  | 'toolChanged'
  | 'success'
  | 'failure'
  | 'start'
  | 'pause'
  | 'resume'
  | 'reset';

type Listener<T = unknown> = (value: T) => void;

const TOTAL_LAYERS = 3 as const;

/**
 * Pure TypeScript model for the excavation minigame.
 *
 * - The model is unaware of the canvas or coordinates: the scene decides what
 *   "cell ids" mean and is the only piece that knows whether the tool matches
 *   the layer (the model trusts callers).
 * - `cleanCells(ids)` just counts: dedups via Sets per layer so the same cell
 *   touched twice doesn't inflate progress.
 * - `damageOnce()` is called by the scene at most once per press; the model
 *   does no debouncing itself.
 */
export class ExcavationModel {
  readonly config: ExcavationConfig;

  private _status: ExcavationStatus = 'idle';
  private _layer: LayerIndex = 0;
  private _cleanedByLayer: Set<number>[] = [new Set(), new Set(), new Set()];
  private _lives: number;
  private _timeLeft: number;
  private _selectedTool: Tool = TOOL_FOR_LAYER[0]!;
  private listeners = new Map<EventName, Set<Listener>>();

  constructor(config: Partial<ExcavationConfig> = {}) {
    this.config = { ...DEFAULT_EXCAVATION_CONFIG, ...config };
    this._lives = this.config.totalLives;
    this._timeLeft = this.config.timeLimitSec ?? 0;
  }

  // ---------------- Getters ----------------

  get status(): ExcavationStatus {
    return this._status;
  }
  get layer(): LayerIndex {
    return this._layer;
  }
  get lives(): number {
    return this._lives;
  }
  get timeLeft(): number {
    return this._timeLeft;
  }
  get selectedTool(): Tool {
    return this._selectedTool;
  }
  get requiredTool(): Tool {
    return TOOL_FOR_LAYER[this._layer]!;
  }
  get layerPct(): number {
    return Math.min(1, this._cleanedByLayer[this._layer]!.size / this.config.cellsPerLayer);
  }
  get timed(): boolean {
    return this.config.timeLimitSec !== null;
  }
  get state(): ExcavationState {
    return {
      status: this._status,
      layer: this._layer,
      layerPct: this.layerPct,
      lives: this._lives,
      timeLeft: this._timeLeft,
      timed: this.timed,
      selectedTool: this._selectedTool,
    };
  }

  // ---------------- Pub/sub ----------------

  on<T = unknown>(event: EventName, listener: Listener<T>): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as Listener);
  }
  off<T = unknown>(event: EventName, listener: Listener<T>): void {
    this.listeners.get(event)?.delete(listener as Listener);
  }
  private emit(event: EventName, payload?: unknown): void {
    this.listeners.get(event)?.forEach((l) => l(payload));
  }

  // ---------------- Lifecycle ----------------

  start(): void {
    if (this._status === 'paused') {
      this._status = 'playing';
      this.emit('resume');
      return;
    }
    this.resetState();
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
    this.resetState();
    this.emit('reset');
  }

  // ---------------- Gameplay actions ----------------

  selectTool(tool: Tool): void {
    if (this._selectedTool === tool) return;
    this._selectedTool = tool;
    this.emit('toolChanged', tool);
  }

  /**
   * Marks the given cell ids as cleaned in the current layer.
   * Returns the number of newly cleaned cells (deduped).
   */
  cleanCells(ids: Iterable<number>): number {
    if (this._status !== 'playing') return 0;
    const set = this._cleanedByLayer[this._layer]!;
    let added = 0;
    for (const id of ids) {
      if (!set.has(id)) {
        set.add(id);
        added += 1;
      }
    }
    if (added === 0) return 0;
    this.emit('progress', this.layerPct);
    if (this.layerPct >= this.config.cleanThreshold) this.advanceLayer();
    return added;
  }

  damageOnce(): void {
    if (this._status !== 'playing') return;
    this._lives = Math.max(0, this._lives - 1);
    this.emit('lives', this._lives);
    if (this._lives <= 0) this.lose();
  }

  tick(deltaSec: number): void {
    if (this._status !== 'playing') return;
    if (this.config.timeLimitSec === null) return;
    this._timeLeft = Math.max(0, this._timeLeft - deltaSec);
    this.emit('time', this._timeLeft);
    if (this._timeLeft <= 0) this.lose();
  }

  // ---------------- Internal transitions ----------------

  private advanceLayer(): void {
    if (this._layer < TOTAL_LAYERS - 1) {
      this._layer = (this._layer + 1) as LayerIndex;
      this.emit('layerAdvanced', this._layer);
    } else {
      this.win();
    }
  }

  private win(): void {
    if (this._status === 'success' || this._status === 'failure') return;
    this._status = 'success';
    this.emit('success');
  }

  private lose(): void {
    if (this._status === 'success' || this._status === 'failure') return;
    this._status = 'failure';
    this.emit('failure');
  }

  private resetState(): void {
    this._status = 'idle';
    this._layer = 0;
    this._cleanedByLayer = [new Set(), new Set(), new Set()];
    this._lives = this.config.totalLives;
    this._timeLeft = this.config.timeLimitSec ?? 0;
    this._selectedTool = TOOL_FOR_LAYER[0]!;
  }
}

type ExcavationStatus = ExcavationState['status'];
