import type { RoutePath, SceneKey } from '@/config/Constants';
import type { ColorBlindMode } from '@/config/Palettes';

export type FontScale = 'small' | 'medium' | 'large' | 'xlarge';

export interface Settings {
  fontScale: FontScale;
  simplifiedFont: boolean;
  colorBlindMode: ColorBlindMode;
  musicVolume: number;
  sfxVolume: number;
  narratorVolume: number;
  noTimeMode: boolean;
  narratorEnabled: boolean;
}

export interface SaveData {
  completedMissions: string[];
  visitedTopics: string[];
  unlockedMinigames: SceneKey[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  /** Route path of the minigame this mission opens (e.g. '/minijuego/excavacion'). */
  route: RoutePath;
  /** Phaser scene key that the minigame route mounts. */
  sceneKey: SceneKey;
  iconKey?: string;
}

export interface LearnTopic {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  imageKey?: string;
  options: { id: string; label: string; correct: boolean }[];
}

export interface MinigameResult {
  variant: 'success' | 'failure';
  title: string;
  body: string;
  primaryCta: { label: string; action: 'retry' | 'next' | 'menu' };
  secondaryCta?: { label: string; action: 'retry' | 'next' | 'menu' };
}
