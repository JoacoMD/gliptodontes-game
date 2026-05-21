/**
 * Only minigames remain as Phaser scenes. Chrome screens are React routes.
 */
export const SceneKeys = {
  MinigameAR: 'ARScene',
  MinigameExcavation: 'ExcavationScene',
  MinigameSearch: 'SearchScene',
  MinigameOrigin: 'OriginScene',
} as const;
export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];

export const RoutePaths = {
  MainMenu: '/',
  Missions: '/misiones',
  Learn: '/aprender',
  LearnTopic: '/aprender/:topicId',
  Settings: '/ajustes',
  MinigameAR: '/minijuego/ar',
  MinigameExcavation: '/minijuego/excavacion',
  MinigameSearch: '/minijuego/busqueda',
  MinigameOrigin: '/minijuego/origen',
} as const;
export type RoutePath = (typeof RoutePaths)[keyof typeof RoutePaths];

export const EventKeys = {
  SettingsChanged: 'settings:change',
  SaveChanged: 'save:change',
  NarratorSpeak: 'narrator:speak',
  NarratorStop: 'narrator:stop',
  MinigameSuccess: 'minigame:success',
  MinigameFailure: 'minigame:failure',
  MinigameReset: 'minigame:reset',
  ModalOpened: 'modal:open',
  ModalClosed: 'modal:close',
} as const;
export type EventKey = (typeof EventKeys)[keyof typeof EventKeys];

export const StorageKeys = {
  Settings: 'gliptodontes:settings:v1',
  Save: 'gliptodontes:save:v1',
} as const;

export const GameSize = {
  width: 720,
  height: 1280,
} as const;
