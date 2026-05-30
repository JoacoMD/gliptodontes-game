import { useCallback, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type Phaser from 'phaser';
import type { SceneKey } from '@/config/Constants';
import { EventKeys, RoutePaths } from '@/config/Constants';
import { HelpButton } from '@/components/ui/HelpButton';
import { Button } from '@/components/ui/Button';
import { HowToPlayModal, type HowToPlayContent } from '@/components/modals/HowToPlayModal';
import { ResultModal } from '@/components/modals/ResultModal';
import { PhaserGame } from '@/components/PhaserGame';
import type { MinigameResult } from '@/types';
import { EventBus } from '@/systems/EventBus';
import { SaveStore } from '@/systems/SaveStore';

export interface MinigameLayoutProps {
  /** Phaser scene key to start (must match one in `scenes`). */
  sceneKey: SceneKey;
  /** Phaser scene classes registered for this minigame's game instance. */
  scenes: Array<new (...args: never[]) => Phaser.Scene>;
  helpContent: HowToPlayContent;
  /** Optional mission id to mark completed on success. */
  missionId?: string;
  /** Optional fun fact appended to ResultModal. */
  didYouKnow?: string;
  /** Optional HUD overlay (lives, progress, timer) rendered above the canvas. */
  hud?: ReactNode;
  /** Optional footer overlay (tool dock, action buttons) rendered at the bottom. */
  footer?: ReactNode;
}

/**
 * Common chrome around any minigame: PhaserGame canvas + auto-open
 * HowToPlay modal + persistent HelpButton + ResultModal.
 */
export function MinigameLayout({
  sceneKey,
  scenes,
  helpContent,
  missionId,
  didYouKnow,
  hud,
  footer,
}: MinigameLayoutProps): React.JSX.Element {
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(true);
  const [result, setResult] = useState<MinigameResult | null>(null);

  const isPaused = helpOpen || result !== null;

  const handleResult = useCallback(
    (r: MinigameResult) => {
      if (r.variant === 'success' && missionId) SaveStore.markMissionComplete(missionId);
      setResult(r);
    },
    [missionId],
  );

  const handleAction = useCallback(
    (action: 'retry' | 'next' | 'menu') => {
      setResult(null);
      if (action === 'retry') {
        // Re-open the help modal so the player sees the rules again,
        // and ask the Phaser scene to reset its gameplay to the starting
        // position. The scene stays paused (paused = helpOpen || result)
        // so the model timer does not tick until the user closes the help.
        setHelpOpen(true);
        EventBus.emit(EventKeys.MinigameReset);
      } else {
        navigate(RoutePaths.Missions);
      }
    },
    [navigate],
  );

  return (
    <section
      aria-label="Minijuego"
      className="relative h-full w-full overflow-hidden bg-background"
    >
      <PhaserGame
        sceneKey={sceneKey}
        scenes={scenes}
        onResult={handleResult}
        paused={isPaused}
      />

      {hud && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 pt-16">
          <div className="pointer-events-auto rounded-xl border-2 border-panel-border bg-panel/90 p-3 shadow">
            {hud}
          </div>
        </div>
      )}

      {footer && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 pr-24">
          <div className="pointer-events-auto rounded-xl border-2 border-panel-border bg-panel/90 p-3 shadow">
            {footer}
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="absolute left-3 top-3 z-30 bg-panel/90"
        onClick={() => navigate(RoutePaths.Missions)}
      >
        ← Salir
      </Button>

      <HelpButton onClick={() => setHelpOpen(true)} />

      <HowToPlayModal
        id={`how-to-play-${sceneKey}`}
        open={helpOpen}
        content={helpContent}
        onStart={() => setHelpOpen(false)}
      />
      <ResultModal
        id={`result-${sceneKey}`}
        open={result !== null}
        result={result}
        didYouKnow={didYouKnow}
        onAction={handleAction}
      />
    </section>
  );
}
