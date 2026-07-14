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
  excavationAssist: boolean;
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
  /** Solo aplica a misiones de excavación. Si no se especifica, se usa el shape default. */
  fossilShapeId?: string;
  /** Imagen descriptiva del minijuego, para asociación visual. Opcional. */
  image?: string;
  /** Texto alternativo de `image`. Si falta, la imagen se trata como decorativa (alt=""). */
  imageAlt?: string;
}

export interface LearnCategory {
  id: string;
  title: string;
  summary: string;
}

export interface LearnFact {
  /** Etiqueta del dato, ej. 'Época', 'Tamaño', 'Qué comía'. */
  label: string;
  value: string;
}

export interface LearnTopic {
  id: string;
  /** Referencia a `LearnCategory.id`. */
  categoryId: string;
  title: string;
  summary: string;
  /** Datos clave (opcional): las fichas de animales los usan. */
  facts?: LearnFact[];
  paragraphs: string[];
  /** Bloque destacado "¿Sabías que?" (opcional). */
  didYouKnow?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  imageKey?: string;
  isSudamerican: boolean;
  hint: string;
}

export interface MinigameResult {
  variant: 'success' | 'failure';
  title: string;
  body: string;
  primaryCta: { label: string; action: 'retry' | 'next' | 'menu' };
  secondaryCta?: { label: string; action: 'retry' | 'next' | 'menu' };
  didYouKnow?: string;
}

export interface Fossil {
  id: string;
  name: string;
  funfact: string;
  model: string;
  scale: number;
}

export interface FossilData extends Fossil {
  locations: Coords[];
}

export interface FossilMarker extends Fossil {
  lat: number;
  lng: number;
  heading: number;
  distance: number;
}

export interface Coords {
  lat: number;
  lng: number;
}
