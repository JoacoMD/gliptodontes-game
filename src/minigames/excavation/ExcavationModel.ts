import type { ExcavationState, ExcavationStatus, Phase, Tool } from './types';

export interface ExcavationConfig {
  /** Total de celdas de la banda `near` (delimitan el contorno del fósil). */
  phase1CellsTotal: number;
  /** Total de celdas que pertenecen al fósil (zona `on`). */
  phase2CellsTotal: number;
  /** Fracción de `near` para terminar la fase 1 (0..1). */
  phase1Threshold: number;
  /** Fracción de `on` para ganar el minijuego (0..1). */
  phase2Threshold: number;
  totalLives: number;
  /** Límite de tiempo total en segundos, o null si noTimeMode. */
  timeLimitSec: number | null;
}

export const DEFAULT_EXCAVATION_CONFIG: ExcavationConfig = {
  phase1CellsTotal: 1,
  phase2CellsTotal: 1,
  phase1Threshold: 0.8,
  phase2Threshold: 0.9,
  totalLives: 3,
  timeLimitSec: 120,
};

type EventName =
  | 'progress'
  | 'lives'
  | 'time'
  | 'toolChanged'
  | 'phaseAdvanced'
  | 'success'
  | 'failure'
  | 'start'
  | 'pause'
  | 'resume'
  | 'reset';

type Listener<T = unknown> = (value: T) => void;

/** Indica qué tipo de celda se está reportando al modelo. */
export type CleanZone = 'near' | 'on';

/**
 * Modelo TS puro del minijuego en dos fases.
 *
 * - Fase 1: el jugador delimita el contorno limpiando la banda `near`.
 * - Fase 2: el jugador revela el fósil cepillando la zona `on`.
 *
 * El modelo es agnóstico de coordenadas: la escena le pasa ids de celdas
 * etiquetados por zona (`near` o `on`) y el modelo dedupea + contabiliza.
 */
export class ExcavationModel {
  readonly config: ExcavationConfig;

  private _status: ExcavationStatus = 'idle';
  private _phase: Phase = 1;
  private _cleanedNear = new Set<number>();
  private _cleanedOn = new Set<number>();
  private _lives: number;
  private _timeLeft: number;
  private _selectedTool: Tool = 'pick';
  private listeners = new Map<EventName, Set<Listener>>();

  constructor(config: Partial<ExcavationConfig> = {}) {
    this.config = { ...DEFAULT_EXCAVATION_CONFIG, ...config };
    this._lives = this.config.totalLives;
    this._timeLeft = this.config.timeLimitSec ?? 0;
  }

  // -------- Getters --------
  get status(): ExcavationStatus { return this._status; }
  get phase(): Phase { return this._phase; }
  get lives(): number { return this._lives; }
  get timeLeft(): number { return this._timeLeft; }
  get selectedTool(): Tool { return this._selectedTool; }
  get timed(): boolean { return this.config.timeLimitSec !== null; }

  /** Progreso de la fase actual (0..1). */
  get progress(): number {
    if (this._phase === 1) {
      if (this.config.phase1CellsTotal <= 0) return 0;
      return Math.min(1, this._cleanedNear.size / this.config.phase1CellsTotal);
    }
    if (this.config.phase2CellsTotal <= 0) return 0;
    return Math.min(1, this._cleanedOn.size / this.config.phase2CellsTotal);
  }

  get state(): ExcavationState {
    return {
      status: this._status,
      phase: this._phase,
      progress: this.progress,
      lives: this._lives,
      timeLeft: this._timeLeft,
      timed: this.timed,
      selectedTool: this._selectedTool,
    };
  }

  // -------- Pub/sub --------
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

  // -------- Lifecycle --------
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

  // -------- Gameplay --------
  selectTool(tool: Tool): void {
    if (this._selectedTool === tool) return;
    this._selectedTool = tool;
    this.emit('toolChanged', tool);
  }

  /**
   * Reporta celdas limpiadas en una zona específica. `near` sólo cuenta en
   * fase 1, `on` sólo en fase 2. Celdas fuera de la fase activa se ignoran.
   */
  cleanCells(ids: Iterable<number>, zone: CleanZone): number {
    if (this._status !== 'playing') return 0;
    if (this._phase === 1 && zone !== 'near') return 0;
    if (this._phase === 2 && zone !== 'on') return 0;

    const set = zone === 'near' ? this._cleanedNear : this._cleanedOn;
    let added = 0;
    for (const id of ids) {
      if (!set.has(id)) {
        set.add(id);
        added += 1;
      }
    }
    if (added === 0) return 0;
    this.emit('progress', this.progress);
    if (this._phase === 1 && this.progress >= this.config.phase1Threshold) {
      this.advanceToPhase2();
    } else if (this._phase === 2 && this.progress >= this.config.phase2Threshold) {
      this.win();
    }
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

  // -------- Internal --------
  private advanceToPhase2(): void {
    if (this._phase !== 1) return;
    this._phase = 2;
    this.emit('phaseAdvanced', this._phase);
    // Reemite el progreso de la fase nueva (vuelve a 0) para que el HUD se sincronice.
    this.emit('progress', this.progress);
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
    this._phase = 1;
    this._cleanedNear = new Set();
    this._cleanedOn = new Set();
    this._lives = this.config.totalLives;
    this._timeLeft = this.config.timeLimitSec ?? 0;
    this._selectedTool = 'pick';
  }
}
