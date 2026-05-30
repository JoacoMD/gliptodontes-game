import { describe, expect, it, vi } from 'vitest';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';

const tiny = (overrides = {}) =>
  new ExcavationModel({
    cellsPerLayer: 20,
    cleanThreshold: 0.95, // 19 / 20
    totalLives: 3,
    timeLimitSec: 10,
    ...overrides,
  });

const rangeArr = (start: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) => start + i);

describe('ExcavationModel', () => {
  it('starts idle and becomes playing after start()', () => {
    const m = tiny();
    expect(m.status).toBe('idle');
    m.start();
    expect(m.status).toBe('playing');
    expect(m.layer).toBe(0);
    expect(m.layerPct).toBe(0);
    expect(m.lives).toBe(3);
  });

  it('selectTool changes the selected tool and emits toolChanged', () => {
    const m = tiny();
    const onChange = vi.fn();
    m.on('toolChanged', onChange);
    m.selectTool('chisel');
    expect(m.selectedTool).toBe('chisel');
    expect(onChange).toHaveBeenCalledWith('chisel');
  });

  it('cleanCells dedupes and updates progress', () => {
    const m = tiny();
    m.start();
    m.cleanCells([1, 2, 3]);
    expect(m.layerPct).toBeCloseTo(3 / 20);
    m.cleanCells([3, 4]); // 3 is dup
    expect(m.layerPct).toBeCloseTo(4 / 20);
  });

  it('advances layers after reaching threshold and wins after layer 3', () => {
    const m = tiny();
    const onAdvanced = vi.fn();
    const onSuccess = vi.fn();
    m.on('layerAdvanced', onAdvanced);
    m.on('success', onSuccess);
    m.start();
    // Layer 0 → fill 19 of 20 cells to cross 95%
    m.cleanCells(rangeArr(0, 19));
    expect(m.layer).toBe(1);
    expect(m.layerPct).toBe(0);
    expect(onAdvanced).toHaveBeenCalledWith(1);
    // Layer 1
    m.cleanCells(rangeArr(0, 19));
    expect(m.layer).toBe(2);
    // Layer 2 → wins
    m.cleanCells(rangeArr(0, 19));
    expect(m.status).toBe('success');
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('damageOnce reduces lives and emits failure at 0', () => {
    const m = tiny({ totalLives: 2 });
    const onFail = vi.fn();
    m.on('failure', onFail);
    m.start();
    m.damageOnce();
    expect(m.lives).toBe(1);
    m.damageOnce();
    expect(m.lives).toBe(0);
    expect(m.status).toBe('failure');
    expect(onFail).toHaveBeenCalledOnce();
  });

  it('does not act once already finished', () => {
    const m = tiny();
    m.start();
    // Force a win.
    m.cleanCells(rangeArr(0, 19));
    m.cleanCells(rangeArr(0, 19));
    m.cleanCells(rangeArr(0, 19));
    expect(m.status).toBe('success');
    const onLives = vi.fn();
    m.on('lives', onLives);
    m.damageOnce();
    expect(onLives).not.toHaveBeenCalled();
  });

  it('tick decrements time and fails at 0', () => {
    const m = tiny({ timeLimitSec: 2 });
    m.start();
    m.tick(1.5);
    expect(m.timeLeft).toBeCloseTo(0.5);
    m.tick(1);
    expect(m.timeLeft).toBe(0);
    expect(m.status).toBe('failure');
  });

  it('no-time mode disables the timer', () => {
    const m = tiny({ timeLimitSec: null });
    m.start();
    m.tick(9999);
    expect(m.status).toBe('playing');
    expect(m.timed).toBe(false);
  });

  it('reset returns to a clean initial state', () => {
    const m = tiny();
    m.start();
    m.cleanCells([1, 2, 3]);
    m.damageOnce();
    m.reset();
    expect(m.status).toBe('idle');
    expect(m.layer).toBe(0);
    expect(m.layerPct).toBe(0);
    expect(m.lives).toBe(3);
    expect(m.selectedTool).toBe('pick');
  });

  it('exposes a serializable state snapshot via .state', () => {
    const m = tiny({ totalLives: 5, timeLimitSec: 30 });
    m.start();
    const s = m.state;
    expect(s).toMatchObject({
      status: 'playing',
      layer: 0,
      layerPct: 0,
      lives: 5,
      timeLeft: 30,
      timed: true,
      selectedTool: 'pick',
    });
  });
});
