import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { OriginGameScene } from '@/minigames/origin/scenes/OriginGameScene';

const ORIGIN_SCENES = [OriginGameScene];

export function OriginPage(): React.JSX.Element {
  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameOrigin}
      scenes={ORIGIN_SCENES}
      missionId="vienen-o-van"
      helpContent={{
        body: [
          'Para cada animal, elegí de qué continente venía.',
          'Si acertás, ¡bien! En caso de necesitar una pista presiona el boton de informacion al lado de la imagen.',
        ],
        ctaLabel: 'Empezar',
      }}
    />
  );
}
