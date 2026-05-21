import { RoutePaths, SceneKeys } from '@/config/Constants';
import type { Mission } from '@/types';

export const MISSIONS: Mission[] = [
  {
    id: 'dinos-la-plata',
    title: 'Dinosaurios de La Plata',
    description: 'Identifica animales del pasado usando la cámara.',
    route: RoutePaths.MinigameAR,
    sceneKey: SceneKeys.MinigameAR,
  },
  {
    id: 'desenterrar-la-historia',
    title: 'Desenterrar la historia',
    description: 'Excava con cuidado y descubre un fósil completo.',
    route: RoutePaths.MinigameExcavation,
    sceneKey: SceneKeys.MinigameExcavation,
  },
  {
    id: 'vienen-o-van',
    title: '¿Vienen o van?',
    description: 'Descubre el origen de las especies que migraron por el continente.',
    route: RoutePaths.MinigameOrigin,
    sceneKey: SceneKeys.MinigameOrigin,
  },
  {
    id: 'mis-herramientas',
    title: 'Mis herramientas',
    description: 'Encuentra las herramientas del paleontólogo escondidas en la escena.',
    route: RoutePaths.MinigameSearch,
    sceneKey: SceneKeys.MinigameSearch,
  },
];
