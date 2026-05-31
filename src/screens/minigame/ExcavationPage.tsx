import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { ExcavationGameScene } from '@/minigames/excavation/scenes/ExcavationGameScene';
import { ExcavationHUD } from '@/minigames/excavation/components/ExcavationHUD';
import { ToolDock } from '@/minigames/excavation/components/ToolDock';
import { useExcavationGame } from '@/minigames/excavation/hooks/useExcavationGame';
import { MISSIONS } from '@/data/missions';
import { getFossilShape } from '@/data/fossilShapes';

const MISSION_ID = 'desenterrar-la-historia';

// Stable module-level reference: este array NO debe recrearse en cada render,
// o el efecto de PhaserGame reinstanciaría el juego.
const EXCAVATION_SCENES = [ExcavationGameScene];

const MISSION = MISSIONS.find((m) => m.id === MISSION_ID);
const FOSSIL_SHAPE = getFossilShape(MISSION?.fossilShapeId);

export function ExcavationPage(): React.JSX.Element {
  const { state, selectTool } = useExcavationGame();

  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameExcavation}
      scenes={EXCAVATION_SCENES}
      missionId={MISSION_ID}
      didYouKnow="Los paleontólogos pueden tardar años en desenterrar un fósil si es un esqueleto grande."
      hud={<ExcavationHUD state={state} fossilDisplayName={FOSSIL_SHAPE.displayName} />}
      footer={<ToolDock selected={state.selectedTool} onSelect={selectTool} />}
      helpContent={{
        title: '¿Cómo jugar?',
        body: [
          'Tu trabajo se divide en dos fases.',
          'Fase 1 — Hallar el contorno: usá el pico para retirar la tierra lejos del fósil y el cincel para limpiar la tierra cerca, hasta que se note la silueta del hueso. Si golpeás el fósil con el pico, lo rompés y perdés una vida.',
          'Fase 2 — Revelar el fósil: cuando termines el contorno, pasás al pincel para descubrir el hueso sin dañarlo.',
          'Tenés 3 vidas y 2 minutos para las dos fases.',
        ],
        ctaLabel: 'Jugar',
      }}
    />
  );
}
