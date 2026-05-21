import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { ExcavationGameScene } from '@/minigames/excavation/scenes/ExcavationGameScene';

export function ExcavationPage(): React.JSX.Element {
  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameExcavation}
      scenes={[ExcavationGameScene]}
      missionId="desenterrar-la-historia"
      didYouKnow="Los paleontólogos pueden tardar años en desenterrar un fósil si es un esqueleto grande."
      helpContent={{
        title: '¿Cómo jugar?',
        body: [
          'Desenterra un fósil usando las herramientas correctas.',
          'Tenés 3 vidas. Si usás la herramienta incorrecta perdés una.',
          'Debés completar el minijuego en 2 minutos.',
          'Podés cambiar al modo sin tiempo desde Ajustes.',
        ],
        ctaLabel: 'Jugar',
      }}
    />
  );
}
