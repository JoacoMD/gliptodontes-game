import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { ARGameScene } from '@/minigames/ar/scenes/ARGameScene';

export function ARPage(): React.JSX.Element {
  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameAR}
      scenes={[ARGameScene]}
      missionId="dinos-la-plata"
      helpContent={{
        body: [
          'Apuntá con la cámara hacia el animal del pasado.',
          'Cuando lo tengas centrado, tocá el botón "Identificar".',
          'Si está bien identificado vas a sumar puntos. ¡Probá con todos!',
        ],
        ctaLabel: 'Comenzar',
      }}
    />
  );
}
