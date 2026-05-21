export type ExcavationStatus = 'idle' | 'playing' | 'paused' | 'success' | 'failure';

export interface ExcavationConfig {
  totalLives: number;
  totalCells: number;
  timeLimitSec: number | null;
}

export const DEFAULT_EXCAVATION_CONFIG: ExcavationConfig = {
  totalLives: 3,
  totalCells: 20,
  timeLimitSec: 120,
};

type Listener<T> = (value: T) => void;

export class ExcavationModel {
  readonly config: ExcavationConfig;
  private _status: ExcavationStatus = 'idle';
  private _lives: number;
  private _uncovered = 0;
  private _timeLeft: number;
  private listeners = new Map<string, Set<Listener<unknown>>>();

  constructor(config: Partial<ExcavationConfig> = {}) {
    this.config = { ...DEFAULT_EXCAVATION_CONFIG, ...config };
    this._lives = this.config.totalLives;
    this._timeLeft = this.config.timeLimitSec ?? 0;
  }

  get status(): ExcavationStatus {
    return this._status;
  }
  get lives(): number {
    return this._lives;
  }
  get progress(): number {
    return this._uncovered / this.config.totalCells;
  }
  get timeLeft(): number {
    return this._timeLeft;
  }

  on<T = unknown>(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as Listener<unknown>);
  }

  private emit(event: string, payload?: unknown): void {
    this.listeners.get(event)?.forEach((l) => l(payload));
  }

  start(): void {
    if (this._status !== 'idle' && this._status !== 'paused') {
      this._lives = this.config.totalLives;
      this._uncovered = 0;
      this._timeLeft = this.config.timeLimitSec ?? 0;
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

  /** Player used the correct tool on a cell. */
  uncover(): void {
    if (this._status !== 'playing') return;
    this._uncovered = Math.min(this._uncovered + 1, this.config.totalCells);
    this.emit('progress', this.progress);
    if (this._uncovered >= this.config.totalCells) this.win();
  }

  /** Player used the wrong tool. */
  damageFossil(): void {
    if (this._status !== 'playing') return;
    this._lives -= 1;
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

  win(): void {
    if (this._status === 'success' || this._status === 'failure') return;
    this._status = 'success';
    this.emit('success');
  }

  lose(): void {
    if (this._status === 'success' || this._status === 'failure') return;
    this._status = 'failure';
    this.emit('failure');
  }

  reset(): void {
    this._status = 'idle';
    this._lives = this.config.totalLives;
    this._uncovered = 0;
    this._timeLeft = this.config.timeLimitSec ?? 0;
    this.emit('reset');
  }
}
