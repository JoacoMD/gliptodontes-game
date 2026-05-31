import { describe, expect, it, vi } from 'vitest';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';

const tiny = (overrides = {}) =>
  new ExcavationModel({
    phase1CellsTotal: 10,
    phase2CellsTotal: 20,
    phase1Threshold: 0.8, // 8 / 10
    phase2Threshold: 0.9, // 18 / 20
    totalLives: 3,
    timeLimitSec: 10,
    ...overrides,
  });

const range = (start: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) => start + i);

describe('ExcavationModel', () => {
  it('starts idle in phase 1', () => {
    const m = tiny();
    expect(m.status).toBe('idle');
    m.start();
    expect(m.status).toBe('playing');
    expect(m.phase).toBe(1);
    expect(m.progress).toBe(0);
    expect(m.lives).toBe(3);
  });

  it('phase 1 progresses with near cells; ignores on cells', () => {
    const m = tiny();
    m.start();
    m.cleanCells([1, 2, 3], 'near');
    expect(m.progress).toBeCloseTo(3 / 10);
    m.cleanCells([100, 101], 'on');
    expect(m.progress).toBeCloseTo(3 / 10);
  });

  it('advances to phase 2 when phase1Threshold is reached', () => {
    const m = tiny();
    const onPhase = vi.fn();
    m.on('phaseAdvanced', onPhase);
    m.start();
    m.cleanCells(range(0, 8), 'near'); // 8 / 10 = 0.8
    expect(m.phase).toBe(2);
    expect(onPhase).toHaveBeenCalledWith(2);
    expect(m.progress).toBe(0);
  });

  it('phase 2 progresses with on cells; ignores near cells', () => {
    const m = tiny();
    m.start();
    m.cleanCells(range(0, 8), 'near');
    expect(m.phase).toBe(2);
    m.cleanCells([1, 2, 3], 'on');
    expect(m.progress).toBeCloseTo(3 / 20);
    m.cleanCells([200, 201], 'near');
    expect(m.progress).toBeCloseTo(3 / 20);
  });

  it('emits success when phase2 reaches its threshold', () => {
    const m = tiny();
    const onSuccess = vi.fn();
    m.on('success', onSuccess);
    m.start();
    m.cleanCells(range(0, 8), 'near');
    m.cleanCells(range(0, 18), 'on');
    expect(m.status).toBe('success');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('damageOnce decrements lives and fails at zero', () => {
    const m = tiny();
    const onFailure = vi.fn();
    m.on('failure', onFailure);
    m.start();
    m.damageOnce();
    m.damageOnce();
    expect(m.lives).toBe(1);
    expect(m.status).toBe('playing');
    m.damageOnce();
    expect(m.lives).toBe(0);
    expect(m.status).toBe('failure');
    expect(onFailure).toHaveBeenCalledTimes(1);
  });

  it('tick decrements time and fails at zero', () => {
    const m = tiny({ timeLimitSec: 1 });
    m.start();
    m.tick(0.5);
    expect(m.timeLeft).toBeCloseTo(0.5);
    m.tick(0.6);
    expect(m.timeLeft).toBe(0);
    expect(m.status).toBe('failure');
  });

  it('does not tick when timeLimitSec is null', () => {
    const m = tiny({ timeLimitSec: null });
    m.start();
    m.tick(99);
    expect(m.status).toBe('playing');
    expect(m.timed).toBe(false);
  });

  it('ignores cleanCells and damageOnce when not playing', () => {
    const m = tiny();
    m.cleanCells([1, 2, 3], 'near');
    m.damageOnce();
    expect(m.progress).toBe(0);
    expect(m.lives).toBe(3);
  });

  it('reset returns model to phase 1 idle', () => {
    const m = tiny();
    m.start();
    m.cleanCells(range(0, 8), 'near');
    m.cleanCells([1], 'on');
    m.damageOnce();
    m.reset();
    expect(m.status).toBe('idle');
    expect(m.phase).toBe(1);
    expect(m.progress).toBe(0);
    expect(m.lives).toBe(3);
  });

  it('selectTool emits toolChanged', () => {
    const m = tiny();
    const onChange = vi.fn();
    m.on('toolChanged', onChange);
    m.selectTool('chisel');
    expect(m.selectedTool).toBe('chisel');
    expect(onChange).toHaveBeenCalledWith('chisel');
  });
});
