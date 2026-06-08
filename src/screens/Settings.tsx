import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { useSettings } from '@/hooks/useSettings';
import { useNarrator } from '@/hooks/useNarrator';
import { useEffect } from 'react';
import { SettingsStore } from '@/systems/SettingsStore';
import type { FontScale } from '@/types';
import type { ColorBlindMode } from '@/config/Palettes';
import { ReactNode } from 'react';

const FONT_OPTIONS: {
  value: FontScale;
  label: ReactNode;
}[] = [
    {
      value: 'small',
      label: <span className="text-sm">A</span>,
    },
    {
      value: 'medium',
      label: <span className="text-base">A</span>,
    },
    {
      value: 'large',
      label: <span className="text-xl">A</span>,
    },
    {
      value: 'xlarge',
      label: <span className="text-3xl">A</span>,
    },
  ];

const CB_OPTIONS: { value: ColorBlindMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'protanopia', label: 'Prota.' },
  { value: 'deuteranopia', label: 'Deut.' },
  { value: 'tritanopia', label: 'Trita.' },
];

export function SettingsPage(): React.JSX.Element {
  const settings = useSettings();
  const navigate = useNavigate();

  const { speak } = useNarrator();
  useEffect(() => {
    speak('Ajustes. Modifica los sonidos, controles y opciones de tu expedición.', {
      interrupt: true,
    });
  }, [speak]);

  const readSettingsDescriptions = (() => {
    speak(`Ajustes.

  Tamaño de fuente: cambia el tamaño del texto para que sea más cómodo de leer.

  Fuente simplificada: reemplaza la tipografía decorativa por una más clara y legible.

  Filtro de color. Ajusta los colores para distintos tipos de daltonismo.

  Música. Controla el volumen de la música de fondo.

  Efectos. Controla el volumen de los sonidos del juego.

  Narrador. Ajusta el volumen de la voz que describe las pantallas.

  Modo sin tiempo. Elimina los límites de tiempo de los minijuegos.

  Narrador activado. Activa o desactiva las descripciones por voz.

  Mostrar silueta del fósil en excavación. Muestra una guía tenue bajo la tierra para ayudar a encontrar el fósil.

  Cuando termines de configurar tu experiencia, selecciona Volver para regresar al menú principal.`, {
      interrupt: true,
    });
  })

  return (
    <section
      aria-label="Ajustes"
      className="flex h-full w-full flex-col gap-2 overflow-y-auto p-6 bg-background/60"
    >
      <div className="mb-4 flex flex-col items-center gap-2 md:flex-row md:justify-center md:relative">
        <h1 className="text-center font-decorative text-7xl title-text">
          Ajustes
        </h1>

        <button
          type="button"
          onClick={readSettingsDescriptions}
          aria-label="Escuchar descripción de los ajustes"
          className=" transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <img
            src="/assets/ui/gliptodontes-sonido.png"
            alt=""
            aria-hidden="true"
            className="h-16 w-16"
          />
        </button>
      </div>

      <SegmentedControl
        label="Tamaño de fuente"
        value={settings.fontScale}
        options={FONT_OPTIONS}
        onChange={(v) => SettingsStore.set('fontScale', v)}
      />

      <Toggle
        label="Fuente simplificada"
        description="Cambia la tipografía decorativa por una más legible."
        checked={settings.simplifiedFont}
        onChange={(v) => SettingsStore.set('simplifiedFont', v)}
      />

      <SegmentedControl
        label="Filtro de color (daltonismo)"
        value={settings.colorBlindMode}
        options={CB_OPTIONS}
        onChange={(v) => SettingsStore.set('colorBlindMode', v)}
      />

      <Slider
        label="Música"
        value={settings.musicVolume}
        onChange={(v) => SettingsStore.set('musicVolume', v)}
      />
      <Slider
        label="Efectos"
        value={settings.sfxVolume}
        onChange={(v) => SettingsStore.set('sfxVolume', v)}
      />
      <Slider
        label="Narrador"
        value={settings.narratorVolume}
        onChange={(v) => SettingsStore.set('narratorVolume', v)}
      />

      <Toggle
        label="Modo sin tiempo"
        description="Quita los límites de tiempo en los minijuegos."
        checked={settings.noTimeMode}
        onChange={(v) => SettingsStore.set('noTimeMode', v)}
      />
      <Toggle
        label="Narrador activado"
        description="Voz que describe la pantalla con texto a voz."
        checked={settings.narratorEnabled}
        onChange={(v) => SettingsStore.set('narratorEnabled', v)}
      />
      <Toggle
        label="Mostrar silueta del fósil en excavación"
        description="Si el minijuego de excavación se siente muy difícil, muestra una silueta tenue del fósil bajo la tierra."
        checked={settings.excavationAssist}
        onChange={(v) => SettingsStore.set('excavationAssist', v)}
      />

      <Button
        variant="ghost"
        fullWidth
        className="mt-6"
        onClick={() => navigate(RoutePaths.MainMenu)}
      >
        Volver
      </Button>
    </section>
  );
}
