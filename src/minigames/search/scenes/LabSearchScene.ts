import { SceneKeys } from '@/config/Constants';
import { SearchSceneBase } from './SearchSceneBase';
import { LAB_SCENE } from '../data/scenes';

export class LabSearchScene extends SearchSceneBase {
  constructor() {
    super(SceneKeys.MinigameSearchLab, LAB_SCENE);
  }
}
