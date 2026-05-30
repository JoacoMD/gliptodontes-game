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

  // Keep the latest props in refs so they can be read inside the long-lived
  // mount effect without becoming dependencies (which would re-create the game
  // and trigger an infinite mount loop every time the HUD re-renders).
  const scenesRef = useRef(scenes);
  const sceneDataRef = useRef(sceneData);
  const onResultRef = useRef(onResult);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    scenesRef.current = scenes;
    sceneDataRef.current = sceneData;
    onResultRef.current = onResult;
    onReadyRef.current = onReady;
  });

  // Mount / unmount lifecycle. ONLY sceneKey identifies the game.
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    const game = createMinigameGame({
      parent,
      scenes: scenesRef.current,
      startScene: sceneKey,
      startData: sceneDataRef.current,
    });
    gameRef.current = game;
    AudioManager.attach(game);
    game.events.once('ready', () => onReadyRef.current?.());

    const handleSuccess = (result: MinigameResult) => onResultRef.current?.(result);
    const handleFailure = (result: MinigameResult) => onResultRef.current?.(result);
    EventBus.on(EventKeys.MinigameSuccess, handleSuccess);
    EventBus.on(EventKeys.MinigameFailure, handleFailure);

    return () => {
      EventBus.off(EventKeys.MinigameSuccess, handleSuccess);
      EventBus.off(EventKeys.MinigameFailure, handleFailure);
      AudioManager.stopMusic();
      game.destroy(true);
      gameRef.current = null;
    };
  }, [sceneKey]);

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
