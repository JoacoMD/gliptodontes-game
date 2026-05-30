import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { ExcavationGameScene } from '@/minigames/excavation/scenes/ExcavationGameScene';
import { ExcavationHUD } from '@/minigames/excavation/components/ExcavationHUD';
import { ToolDock } from '@/minigames/excavation/components/ToolDock';
import { useExcavationGame } from '@/minigames/excavation/hooks/useExcavationGame';
import { TOOL_FOR_LAYER } from '@/minigames/excavation/types';

// Stable module-level reference: this array MUST NOT be recreated on every
// render, or PhaserGame's mount effect would re-instantiate the game on each
// HUD state update and the model would restart in a loop.
const EXCAVATION_SCENES = [ExcavationGameScene];

export function ExcavationPage(): React.JSX.Element {
  const { state, selectTool } = useExcavationGame();
  const required = TOOL_FOR_LAYER[state.layer];

  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameExcavation}
      scenes={EXCAVATION_SCENES}
      missionId="desenterrar-la-historia"
      didYouKnow="Los paleontólogos pueden tardar años en desenterrar un fósil si es un esqueleto grande."
      hud={<ExcavationHUD state={state} />}
      footer={<ToolDock selected={state.selectedTool} required={required} onSelect={selectTool} />}
      helpContent={{
        title: '¿Cómo jugar?',
        body: [
          'El fósil está oculto bajo tres capas: tierra, roca y arena.',
          'Capa 1 → pico. Capa 2 → cincel. Capa 3 → pincel.',
          'Elegí una herramienta y mantené presionado sobre el fósil para limpiar.',
          'Cuando hayas limpiado el 95 % de una capa, avanzás a la siguiente.',
          'Si usás la herramienta incorrecta perdés una vida. Tenés 3.',
          'Tenés 2 minutos (o activá el modo sin tiempo en Ajustes).',
        ],
        ctaLabel: 'Jugar',
      }}
    />
  );
}
