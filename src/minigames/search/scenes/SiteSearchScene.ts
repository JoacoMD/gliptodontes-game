import { SceneKeys } from '@/config/Constants';
import { SearchSceneBase } from './SearchSceneBase';
import { SITE_SCENE } from '../data/scenes';

export class SiteSearchScene extends SearchSceneBase {
  constructor() {
    super(SceneKeys.MinigameSearchSite, SITE_SCENE);
  }
}
