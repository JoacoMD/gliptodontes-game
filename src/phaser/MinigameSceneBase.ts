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
 *
 * Also reacts to `MinigameReset` (fired by `MinigameLayout` when the player
 * clicks "Retry"): subclasses override `restartGame()` to reset their
 * gameplay state to a fresh starting position. The default implementation
 * delegates to `this.scene.restart()`, which fully re-runs the scene
 * lifecycle and is enough for stateless minigames.
 */
export abstract class MinigameSceneBase extends Phaser.Scene {
  private readonly onResetRequested = () => {
    this.restartGame();
  };

  init(): void {
    EventBus.on(EventKeys.MinigameReset, this.onResetRequested);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off(EventKeys.MinigameReset, this.onResetRequested);
    });
  }

  /**
   * Reset gameplay to the starting position. Default: full scene restart.
   * Scenes with internal state that should NOT trigger a scene shutdown
   * (e.g. Excavation needs to refill its RenderTextures and reset its model
   * without re-creating the game objects) override this method.
   */
  protected restartGame(): void {
    this.scene.restart();
  }

  protected succeed(result: MinigameResult): void {
    EventBus.emit(EventKeys.MinigameSuccess, result);
  }

  protected fail(result: MinigameResult): void {
    EventBus.emit(EventKeys.MinigameFailure, result);
  }
}
