import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { EventKeys, type SceneKey } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { AudioManager } from '@/systems/AudioManager';
import { createMinigameGame } from '@/phaser/createMinigameGame';
import type { MinigameResult } from '@/types';

export interface PhaserGameProps {
  /** Key of the scene the game should start (must be among `scenes`). */
  sceneKey: SceneKey;
  /** Scene classes to register inside this game instance. */
  scenes: Array<new (...args: never[]) => Phaser.Scene>;
  /** Optional payload for the starting scene. */
  sceneData?: object;
  /** Called when the inner gameplay finishes (success or failure). */
  onResult: (result: MinigameResult) => void;
  /** Pause/resume the active scene (used while a React modal is open). */
  paused?: boolean;
  /** Notified once the Phaser game has booted. */
  onReady?: () => void;
}

export function PhaserGame({
  sceneKey,
  scenes,
  sceneData,
  onResult,
  paused = false,
  onReady,
}: PhaserGameProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  // Mount / unmount lifecycle. Recreates the game if sceneKey changes.
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    const game = createMinigameGame({
      parent,
      scenes,
      startScene: sceneKey,
      startData: sceneData,
    });
    gameRef.current = game;
    AudioManager.attach(game);
    game.events.once('ready', () => onReady?.());

    const handleSuccess = (result: MinigameResult) => onResult(result);
    const handleFailure = (result: MinigameResult) => onResult(result);
    EventBus.on(EventKeys.MinigameSuccess, handleSuccess);
    EventBus.on(EventKeys.MinigameFailure, handleFailure);

    return () => {
      EventBus.off(EventKeys.MinigameSuccess, handleSuccess);
      EventBus.off(EventKeys.MinigameFailure, handleFailure);
      AudioManager.stopMusic();
      game.destroy(true);
      gameRef.current = null;
    };
    // sceneKey / scenes are the identity of the game; sceneData/onResult/onReady
    // are read via closure each mount but we don't want to re-mount on their
    // identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey, scenes]);

  // Pause / resume on modal overlay state.
  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;
    const sm = game.scene;
    if (paused) sm.pause(sceneKey);
    else sm.resume(sceneKey);
  }, [paused, sceneKey]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      aria-label="Área de juego"
      role="presentation"
    />
  );
}
