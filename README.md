# Caminando sobre Gliptodontes

Aplicación educativa móvil sobre paleontología sudamericana (gliptodontes, tigres dientes de sable y otros). Construida con **React 19 + Tailwind CSS 4 + Radix UI + React Router 7** para todas las pantallas chrome (menú, misiones, aprender, ajustes, modales) y **Phaser 4** sólo dentro de cada minijuego. Empaquetable como **PWA**.

> Diseño accesible desde el primer commit: daltonismo, escalado de fuente, fuente simplificada, narrador (TTS), modo sin tiempo, navegación por teclado y lector de pantalla. La UI accesible viene de fábrica gracias a Radix Primitives.

---

## Scripts

```bash
npm install         # instalar dependencias
npm run dev         # servidor de desarrollo (http://localhost:5173)
npm run build       # typecheck + build de producción a /dist
npm run preview     # servir el build para probar la PWA
npm run test        # vitest (unitarios + componentes RTL)
npm run lint        # eslint (flat config)
npm run typecheck   # tsc --noEmit
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│  React (chrome de la app)                           │
│  · MainMenu · Misiones · Aprender · Ajustes ·       │
│  · Modales (Radix Dialog) · HUD · HelpButton ·      │
│                                                     │
│   En las rutas /minijuego/*:                        │
│     <MinigameLayout>                                │
│       <PhaserGame /> ← canvas Phaser                │
│       <HowToPlayModal /> <ResultModal />            │
│     </MinigameLayout>                               │
└──────────────────────▲──────────────────────────────┘
                       │ EventBus (TS puro)
                       ▼
┌─────────────────────────────────────────────────────┐
│  Phaser 4 (sólo dentro de cada minijuego)           │
│  ExcavationGameScene · ARGameScene · ...            │
│  Cada uno extiende MinigameSceneBase y emite        │
│  EventKeys.MinigameSuccess / Failure al EventBus.   │
└──────────────────────▲──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Lógica de minijuego (src/minigames/<id>/Model.ts)  │
│  TS puro · sin React · sin Phaser · testeable       │
└─────────────────────────────────────────────────────┘
```

### Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| **Render React** | `src/screens/`, `src/components/`, `src/app/` | Navegación, formularios, modales, layout responsive. |
| **Render Phaser** | `src/minigames/<id>/scenes/`, `src/phaser/` | Loop de juego, sprites, input táctil del minijuego. |
| **Lógica** | `src/minigames/<id>/*.ts` (no scenes) | Modelos TypeScript puros. Testeables sin DOM ni canvas. |
| **Sistemas** | `src/systems/` | `SettingsStore`, `SaveStore`, `EventBus`, `NarratorService`, `AudioManager`. |
| **Accesibilidad** | `src/a11y/` | `ThemeBridge`, `FontScaler`, `ColorBlindFilter`, `KeyboardNav`. |
| **Datos** | `src/data/` | Misiones, temas, quizzes, especies (datos puros). |

### Stack

| Paquete | Versión |
|---|---|
| `react` / `react-dom` | 19.2 |
| `react-router-dom` | 7.15 (data router, `createHashRouter`) |
| `@radix-ui/react-*` | dialog 1.1, switch 1.2, slider 1.3, toggle-group 1.1, progress 1.1 |
| `tailwindcss` + `@tailwindcss/vite` | 4.3 (CSS-first config — sin `tailwind.config.ts`, sin PostCSS) |
| `phaser` | 4.1 |
| `vite` + `@vitejs/plugin-react` | 7.3 + 5.2 |
| `vitest` | 3.2 (sigue sobre Vite; Vitest 4 usa Rolldown y rompe instalación en Node 22.11) |
| `typescript` | 6.0 |
| `eslint` (flat) + `typescript-eslint` | 9.39 + 8.59 |
| `jsdom` | 26.1 (versiones más nuevas requieren Node 22.12+ por `@exodus/bytes` ESM) |

### Tailwind 4 CSS-first

Toda la configuración vive en `src/styles/tailwind.css`:

```css
@import 'tailwindcss';

@theme {
  --color-accent: var(--c-accent);
  /* ... */
}
```

Los colores apuntan a CSS variables (`--c-*`) que `ThemeBridge` rota cuando el usuario cambia el modo de daltonismo. **Cero re-render** — sólo cambian las variables.

### Contrato React ↔ Phaser

`<PhaserGame>` (en `src/components/PhaserGame.tsx`) recibe `sceneKey`, `scenes`, `onResult` y `paused`. Internamente crea un `Phaser.Game` y lo destruye al desmontar. Las escenas se comunican con React vía `EventBus.emit(EventKeys.MinigameSuccess, result)` — el wrapper escucha y llama a `onResult`. Cuando un modal React se abre, se pasa `paused={true}` y Phaser detiene el loop.

### Code splitting

Las rutas `/minijuego/*` son lazy. Cargar `/` o `/ajustes` no descarga Phaser: el chunk de Phaser sólo aparece al entrar al primer minijuego.

---

## Estructura de carpetas

```
src/
├── main.tsx                       # entry: createRoot + init de a11y/stores
├── app/
│   ├── App.tsx                    # RouterProvider
│   └── routes.tsx                 # createHashRouter con rutas lazy
├── screens/
│   ├── MainMenu.tsx               # Frame 1
│   ├── Missions.tsx               # Frame 3
│   ├── Learn.tsx · LearnTopic.tsx # Frame 5 + detalle
│   ├── Settings.tsx               # Ajustes
│   └── minigame/
│       ├── MinigameLayout.tsx     # chrome común
│       ├── ExcavationPage.tsx · ARPage.tsx · SearchPage.tsx · OriginPage.tsx
├── components/
│   ├── PhaserGame.tsx             # wrapper React
│   ├── ui/                        # Button, Toggle, Slider, SegmentedControl, ProgressBar, IconButton, HelpButton
│   ├── modals/                    # Modal, HowToPlayModal, ResultModal, ConfirmModal (todos Radix Dialog)
│   └── layout/                    # AppShell
├── hooks/                         # useSettings, useSave, useNarrator, useEventBus
├── minigames/
│   ├── excavation/ExcavationModel.ts + scenes/ExcavationGameScene.ts
│   ├── ar/scenes/ARGameScene.ts
│   ├── search/scenes/SearchGameScene.ts
│   └── origin/scenes/OriginGameScene.ts
├── phaser/                        # MinigameSceneBase, createMinigameGame
├── systems/                       # SettingsStore, SaveStore, EventBus, AudioManager, NarratorService
├── a11y/                          # ThemeBridge, FontScaler, ColorBlindFilter, KeyboardNav
├── config/                        # Constants, Palettes
├── data/                          # missions, learnTopics, quizzes, species
├── types/                         # tipos compartidos
└── styles/                        # tailwind.css, fonts.css
tests/
├── unit/                          # SettingsStore, EventBus, ExcavationModel
└── components/                    # Modal, Toggle (RTL)
```

---

## Accesibilidad

- **Radix Primitives** proveen focus trap, `Esc`, `aria-modal`, `aria-checked`, roving tabindex de fábrica para Dialog/Switch/Slider/ToggleGroup. No reimplementamos nada de eso.
- **Daltonismo**: 4 modos seleccionables (normal/protanopia/deuteranopia/tritanopia). Cada uno carga una paleta distinta vía CSS vars + un filtro SVG `feColorMatrix` aplicado al `#root` para fotos/canvas.
- **Escalado de fuente**: 4 niveles. Cambia la CSS var `--font-scale` que escala el `font-size: calc(16px * var(--font-scale))` del `<body>`. Tailwind hereda.
- **Fuente simplificada**: alterna entre decorativa (serif) y simplificada (Atkinson Hyperlegible / Inter).
- **Narrador (TTS)**: Web Speech API en español con volumen propio. Persiste si está activado.
- **Modo sin tiempo**: cada modelo de minijuego consulta `SettingsStore.getKey('noTimeMode')` antes de arrancar timers.
- **Foco visible**: clases `using-keyboard` activan outline al usar Tab.
- **Skip link** y regiones `aria-live` en `index.html`.

---

## Tests

- **Unitarios (`tests/unit/`)**: pure TS — `SettingsStore`, `EventBus`, `ExcavationModel`. No tocan React ni Phaser.
- **Componentes (`tests/components/`)**: React Testing Library + jsdom — `Modal`, `Toggle`.
- Convención: nunca importar Phaser en archivos `*.test.{ts,tsx}` (Phaser no se inicializa bien en jsdom).

---

## Próximos pasos

1. Sustituir el stub del minijuego AR por `getUserMedia` real.
2. Implementar la grilla de excavación con sprites reales (la base de modelo + scene ya está).
3. Hotspots reales para el minijuego de búsqueda.
4. Más preguntas en el quiz de origen + selección aleatoria.
5. Iconos PWA finales 192×192 y 512×512 maskable.
6. e2e con Playwright + `@axe-core/react`.
