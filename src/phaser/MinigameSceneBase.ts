import Phaser from 'phaser';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import type { MinigameResult } from '@/types';

/**
 * Common base for the 4 minigame scenes. Trims responsibilities to JUST
 * the gameplay loop — React handles help button, modals and navigation.
 *
 * Emits via the shared EventBus so the `<PhaserGame>` React wrapper can
 * forward results to its `onResult` callback.
 */
export abstract class MinigameSceneBase extends Phaser.Scene {
  protected succeed(result: MinigameResult): void {
    EventBus.emit(EventKeys.MinigameSuccess, result);
  }

  protected fail(result: MinigameResult): void {
    EventBus.emit(EventKeys.MinigameFailure, result);
  }
}
