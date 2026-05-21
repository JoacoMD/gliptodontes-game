import Phaser from 'phaser';
import { GameSize } from '@/config/Constants';
import { Palettes } from '@/config/Palettes';
import { SettingsStore } from '@/systems/SettingsStore';

export interface CreateMinigameGameOptions {
  parent: HTMLElement;
  /** Scene classes to register (only the ones for this single minigame). */
  scenes: Array<new (...args: never[]) => Phaser.Scene>;
  /** Key of the scene that should start. */
  startScene: string;
  /** Optional data forwarded to the starting scene. */
  startData?: object;
}

export function createMinigameGame(opts: CreateMinigameGameOptions): Phaser.Game {
  const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: opts.parent,
    width: GameSize.width,
    height: GameSize.height,
    backgroundColor: palette.background,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GameSize.width,
      height: GameSize.height,
    },
    render: {
      antialias: true,
    },
    input: {
      activePointers: 3,
      touch: true,
      keyboard: true,
    },
    fps: {
      target: 60,
      min: 30,
    },
    scene: opts.scenes,
    callbacks: {
      postBoot: (game) => {
        // Start the explicit scene with payload (no boot/preload chain needed).
        game.scene.start(opts.startScene, opts.startData ?? {});
      },
    },
  });
}
