import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '@/systems/EventBus';
import { EventKeys } from '@/config/Constants';

describe('EventBus', () => {
  it('routes typed events to listeners', () => {
    const listener = vi.fn();
    EventBus.on(EventKeys.ModalOpened, listener);
    EventBus.emit(EventKeys.ModalOpened, 'how-to-play-test');
    expect(listener).toHaveBeenCalledWith('how-to-play-test');
    EventBus.off(EventKeys.ModalOpened, listener);
  });
});
