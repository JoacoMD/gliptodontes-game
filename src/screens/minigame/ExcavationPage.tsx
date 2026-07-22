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
          'Excavá con cuidado para descubrir el fósil.',
          'Primero usá el pico para encontrar la ubicación aproximada. Después cambiá al cincel para revelar el contorno sin dañar el hallazgo. Por último, utilizá el pincel para retirar la tierra restante y dejar el fósil completamente al descubierto. ¡Elegí la herramienta correcta en cada etapa para completar la excavación!.',
        ],
        ctaLabel: 'Jugar',
      }}
    />
  );
}
