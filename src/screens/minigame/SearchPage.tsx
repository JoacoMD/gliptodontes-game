import { useCallback, useMemo, useState } from 'react';
import type Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import { EventKeys, RoutePaths, SceneKeys, type SceneKey } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { MinigameLayout } from './MinigameLayout';
import { LabSearchScene } from '@/minigames/search/scenes/LabSearchScene';
import { SiteSearchScene } from '@/minigames/search/scenes/SiteSearchScene';
import { MuseumSearchScene } from '@/minigames/search/scenes/MuseumSearchScene';
import { LAB_SCENE, SITE_SCENE, MUSEUM_SCENE } from '@/minigames/search/data/scenes';
import { ObjectivesBar } from '@/minigames/search/components/ObjectivesBar';
import { HintButton } from '@/minigames/search/components/HintButton';
import { FactCard } from '@/minigames/search/components/FactCard';
import { useSearchGame } from '@/minigames/search/hooks/useSearchGame';
import type { SearchSceneDef } from '@/minigames/search/types';

interface SceneSlot {
  key: SceneKey;
  def: SearchSceneDef;
  sceneClass: new (...args: never[]) => Phaser.Scene;
}

const SCENE_ORDER: SceneSlot[] = [
  { key: SceneKeys.MinigameSearchLab, def: LAB_SCENE, sceneClass: LabSearchScene },
  { key: SceneKeys.MinigameSearchSite, def: SITE_SCENE, sceneClass: SiteSearchScene },
  { key: SceneKeys.MinigameSearchMuseum, def: MUSEUM_SCENE, sceneClass: MuseumSearchScene },
];

export function SearchPage(): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { state, lastFound, acknowledgeFound } = useSearchGame();

  const slot = SCENE_ORDER[index]!;
  const isLast = index === SCENE_ORDER.length - 1;

  const onNext = useCallback(() => {
    if (isLast) {
      navigate(RoutePaths.Missions);
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast, navigate]);

  const onUseHint = useCallback(() => {
    EventBus.emit(EventKeys.SearchHintRequested);
  }, []);

  const help = useMemo(
    () => ({
      title: slot.def.title,
      body: slot.def.intro,
      ctaLabel: 'Buscar',
    }),
    [slot],
  );

  return (
    <>
      <MinigameLayout
        key={slot.key}
        sceneKey={slot.key}
        scenes={[slot.sceneClass]}
        missionId={isLast ? 'busqueda-paleontologa' : undefined}
        helpContent={help}
        didYouKnow={slot.def.didYouKnow}
        hud={<ObjectivesBar objects={slot.def.objects} state={state} />}
        footer={<HintButton hintsLeft={state.hintsLeft} onUse={onUseHint} />}
        onNext={onNext}
      />
      <FactCard object={lastFound} onDismiss={acknowledgeFound} />
    </>
  );
}
