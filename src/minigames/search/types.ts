export type HiddenObjectCategory = 'tool' | 'fossil' | 'specimen';

export interface HiddenObjectHitbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HiddenObject {
  id: string;
  name: string;
  category: HiddenObjectCategory;
  hitbox: HiddenObjectHitbox;
  iconKey: string;
  spriteKey?: string;
  fact: string;
}

export type SearchSceneId = 'lab' | 'site' | 'museum';

export interface SearchSceneDef {
  id: SearchSceneId;
  title: string;
  intro: string[];
  backgroundKey: string;
  didYouKnow: string;
  objects: HiddenObject[];
}

export type SearchStatus = 'idle' | 'playing' | 'paused' | 'success';

export interface SearchState {
  status: SearchStatus;
  sceneId: SearchSceneId;
  foundIds: ReadonlySet<string>;
  hintsLeft: number;
  totalObjects: number;
  progressPct: number;
}

export type SearchEvent =
  | 'start'
  | 'reset'
  | 'pause'
  | 'resume'
  | 'found'
  | 'missed'
  | 'hintUsed'
  | 'progress'
  | 'success';
