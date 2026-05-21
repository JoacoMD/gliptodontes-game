import { describe, expect, it, vi } from 'vitest';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';

describe('ExcavationModel', () => {
  it('starts in idle and transitions to playing', () => {
    const m = new ExcavationModel({ totalCells: 3, totalLives: 2, timeLimitSec: 10 });
    expect(m.status).toBe('idle');
    m.start();
    expect(m.status).toBe('playing');
  });

  it('uncovers cells and reports progress until success', () => {
    const m = new ExcavationModel({ totalCells: 2, totalLives: 3, timeLimitSec: 10 });
    const onSuccess = vi.fn();
    m.on('success', onSuccess);
    m.start();
    m.uncover();
    expect(m.progress).toBe(0.5);
    m.uncover();
    expect(m.status).toBe('success');
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('loses on running out of lives', () => {
    const m = new ExcavationModel({ totalCells: 5, totalLives: 1, timeLimitSec: 10 });
    const onFail = vi.fn();
    m.on('failure', onFail);
    m.start();
    m.damageFossil();
    expect(m.status).toBe('failure');
    expect(onFail).toHaveBeenCalledOnce();
  });

  it('respects "no time" mode when timeLimitSec is null', () => {
    const m = new ExcavationModel({ totalCells: 5, totalLives: 3, timeLimitSec: null });
    m.start();
    m.tick(9999);
    expect(m.status).toBe('playing');
  });

  it('ticks the timer down and fails on zero', () => {
    const m = new ExcavationModel({ totalCells: 5, totalLives: 3, timeLimitSec: 1 });
    m.start();
    m.tick(2);
    expect(m.status).toBe('failure');
    expect(m.timeLeft).toBe(0);
  });
});
