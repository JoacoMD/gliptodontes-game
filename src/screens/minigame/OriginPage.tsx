import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { OriginGameScene } from '@/minigames/origin/scenes/OriginGameScene';

export function OriginPage(): React.JSX.Element {
  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameOrigin}
      scenes={[OriginGameScene]}
      missionId="vienen-o-van"
      helpContent={{
        body: [
          'Para cada animal, elegí de qué continente venía.',
          'Si acertás, ¡bien! Si no, te decimos la respuesta correcta.',
        ],
        ctaLabel: 'Empezar',
      }}
    />
  );
}
