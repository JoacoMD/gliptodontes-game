import { lazy, Suspense } from 'react';
import { createHashRouter, type RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { AppShell } from '@/components/layout/AppShell';
import { MainMenu } from '@/screens/MainMenu';
import { Missions } from '@/screens/Missions';
import { Learn } from '@/screens/Learn';
import { LearnTopic } from '@/screens/LearnTopic';
import { SettingsPage } from '@/screens/Settings';

// Minigame routes are lazy so Phaser is not in the initial chunk.
const ARPage = lazy(() => import('@/screens/minigame/ARPage').then((m) => ({ default: m.ARPage })));
const ExcavationPage = lazy(() =>
  import('@/screens/minigame/ExcavationPage').then((m) => ({ default: m.ExcavationPage })),
);
const SearchPage = lazy(() =>
  import('@/screens/minigame/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const OriginPage = lazy(() =>
  import('@/screens/minigame/OriginPage').then((m) => ({ default: m.OriginPage })),
);

const MinigameFallback = () => (
  <div className="flex h-full w-full items-center justify-center text-text-primary">
    Cargando minijuego…
  </div>
);

const routes: RouteObject[] = [
  {
    path: RoutePaths.MainMenu,
    element: <AppShell />,
    children: [
      { index: true, element: <MainMenu /> },
      { path: 'misiones', element: <Missions /> },
      { path: 'aprender', element: <Learn /> },
      { path: 'aprender/:topicId', element: <LearnTopic /> },
      { path: 'ajustes', element: <SettingsPage /> },
      {
        path: 'minijuego/ar',
        element: (
          <Suspense fallback={<MinigameFallback />}>
            <ARPage />
          </Suspense>
        ),
      },
      {
        path: 'minijuego/excavacion',
        element: (
          <Suspense fallback={<MinigameFallback />}>
            <ExcavationPage />
          </Suspense>
        ),
      },
      {
        path: 'minijuego/busqueda',
        element: (
          <Suspense fallback={<MinigameFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'minijuego/origen',
        element: (
          <Suspense fallback={<MinigameFallback />}>
            <OriginPage />
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createHashRouter(routes);
