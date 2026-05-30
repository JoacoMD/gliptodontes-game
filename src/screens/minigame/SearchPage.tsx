import { SceneKeys } from '@/config/Constants';
import { MinigameLayout } from './MinigameLayout';
import { SearchGameScene } from '@/minigames/search/scenes/SearchGameScene';

const SEARCH_SCENES = [SearchGameScene];

export function SearchPage(): React.JSX.Element {
  return (
    <MinigameLayout
      sceneKey={SceneKeys.MinigameSearch}
      scenes={SEARCH_SCENES}
      missionId="mis-herramientas"
      helpContent={{
        body: [
          'Encontrá las 5 herramientas escondidas en la escena.',
          'Tocá cada una cuando la veas.',
          'Si te trabás, podés volver a leer estas instrucciones desde el botón de ayuda.',
        ],
        ctaLabel: 'Buscar',
      }}
    />
  );
}
