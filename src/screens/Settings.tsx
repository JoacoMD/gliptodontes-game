import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { useSettings } from '@/hooks/useSettings';
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

  return (
    <section
      aria-label="Ajustes"
      className="flex h-full w-full flex-col gap-2 overflow-y-auto p-6 bg-background/60"
    >
      <h1 className="mb-4 text-center font-decorative text-7xl title-text">Ajustes</h1>

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
