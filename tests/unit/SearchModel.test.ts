// tests/unit/SearchModel.test.ts
import { describe, expect, it, vi } from 'vitest';
import { SearchModel } from '@/minigames/search/SearchModel';
import type { SearchSceneDef } from '@/minigames/search/types';

const fakeScene = (overrides: Partial<SearchSceneDef> = {}): SearchSceneDef => ({
  id: 'lab',
  title: 'Laboratorio',
  intro: ['Encontrá las herramientas.'],
  backgroundKey: 'lab-bg',
  didYouKnow: 'Los paleontólogos usan pinceles finos.',
  objects: [
    {
      id: 'pincel',
      name: 'Pincel',
      category: 'tool',
      hitbox: { x: 100, y: 100, w: 80, h: 80 },
      iconKey: 'pincel-icon',
      fact: 'Para limpiar fósiles sin dañarlos.',
    },
    {
      id: 'martillo',
      name: 'Martillo',
      category: 'tool',
      hitbox: { x: 300, y: 200, w: 80, h: 80 },
      iconKey: 'martillo-icon',
      fact: 'Para fracturar roca.',
    },
  ],
  ...overrides,
});

describe('SearchModel', () => {
  it('starts in idle status with no objects found', () => {
    const m = new SearchModel(fakeScene());
    expect(m.status).toBe('idle');
    expect(m.foundIds.size).toBe(0);
    expect(m.hintsLeft).toBe(2);
    expect(m.totalObjects).toBe(2);
    expect(m.progressPct).toBe(0);
  });

  it('start() transitions to playing and emits start', () => {
    const m = new SearchModel(fakeScene());
    const fn = vi.fn();
    m.on('start', fn);
    m.start();
    expect(m.status).toBe('playing');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('pause() and resume() toggle status and emit events', () => {
    const m = new SearchModel(fakeScene());
    const pauseFn = vi.fn();
    const resumeFn = vi.fn();
    m.on('pause', pauseFn);
    m.on('resume', resumeFn);
    m.start();
    m.pause();
    expect(m.status).toBe('paused');
    expect(pauseFn).toHaveBeenCalledOnce();
    m.resume();
    expect(m.status).toBe('playing');
    expect(resumeFn).toHaveBeenCalledOnce();
  });

  it('reset() clears progress and hints and emits reset', () => {
    const m = new SearchModel(fakeScene());
    const fn = vi.fn();
    m.on('reset', fn);
    m.start();
    m.reset();
    expect(m.status).toBe('idle');
    expect(m.foundIds.size).toBe(0);
    expect(m.hintsLeft).toBe(2);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('tryHit returns the object when tap is inside hitbox and marks it found', () => {
    const m = new SearchModel(fakeScene());
    const onFound = vi.fn();
    const onProgress = vi.fn();
    m.on('found', onFound);
    m.on('progress', onProgress);
    m.start();
    const hit = m.tryHit(120, 130);
    expect(hit?.id).toBe('pincel');
    expect(m.foundIds.has('pincel')).toBe(true);
    expect(onFound).toHaveBeenCalledWith(expect.objectContaining({ id: 'pincel' }));
    expect(onProgress).toHaveBeenCalledWith(0.5);
  });

  it('tryHit returns null and emits missed when tap is outside any hitbox', () => {
    const m = new SearchModel(fakeScene());
    const onMissed = vi.fn();
    m.on('missed', onMissed);
    m.start();
    const hit = m.tryHit(10, 10);
    expect(hit).toBeNull();
    expect(onMissed).toHaveBeenCalledWith({ x: 10, y: 10 });
  });

  it('tryHit on an already-found object returns null and emits nothing', () => {
    const m = new SearchModel(fakeScene());
    const onFound = vi.fn();
    m.start();
    m.tryHit(120, 130);
    m.on('found', onFound);
    const second = m.tryHit(120, 130);
    expect(second).toBeNull();
    expect(onFound).not.toHaveBeenCalled();
  });

  it('tryHit is a no-op when status is not playing', () => {
    const m = new SearchModel(fakeScene());
    expect(m.tryHit(120, 130)).toBeNull();
    expect(m.foundIds.size).toBe(0);
  });

  it('finding the last object emits success and sets status to success', () => {
    const m = new SearchModel(fakeScene());
    const onSuccess = vi.fn();
    m.on('success', onSuccess);
    m.start();
    m.tryHit(120, 130);
    m.tryHit(320, 220);
    expect(m.status).toBe('success');
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('useHint returns the first pending object and decrements hintsLeft', () => {
    const m = new SearchModel(fakeScene());
    const onHint = vi.fn();
    m.on('hintUsed', onHint);
    m.start();
    const hint = m.useHint();
    expect(hint?.id).toBe('pincel');
    expect(m.hintsLeft).toBe(1);
    expect(onHint).toHaveBeenCalledWith(expect.objectContaining({ id: 'pincel' }));
  });

  it('useHint skips already-found objects', () => {
    const m = new SearchModel(fakeScene());
    m.start();
    m.tryHit(120, 130);
    const hint = m.useHint();
    expect(hint?.id).toBe('martillo');
  });

  it('useHint returns null when hintsLeft is 0', () => {
    const m = new SearchModel(fakeScene(), { maxHints: 1 });
    m.start();
    m.useHint();
    const second = m.useHint();
    expect(second).toBeNull();
    expect(m.hintsLeft).toBe(0);
  });

  it('useHint is a no-op when status is not playing', () => {
    const m = new SearchModel(fakeScene());
    expect(m.useHint()).toBeNull();
    expect(m.hintsLeft).toBe(2);
  });
});
