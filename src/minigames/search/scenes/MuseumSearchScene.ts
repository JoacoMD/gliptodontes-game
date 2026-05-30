import { SceneKeys } from '@/config/Constants';
import { SearchSceneBase } from './SearchSceneBase';
import { MUSEUM_SCENE } from '../data/scenes';

export class MuseumSearchScene extends SearchSceneBase {
  constructor() {
    super(SceneKeys.MinigameSearchMuseum, MUSEUM_SCENE);
  }
}
