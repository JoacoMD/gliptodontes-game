import { useState } from 'react';
import { useRef } from 'react';

import { HelpButton } from '@/components/ui/HelpButton';
import { Button } from '@/components/ui/Button';

import {
  HowToPlayModal,
  type HowToPlayContent,
} from '@/components/modals/HowToPlayModal';

import { ResultModal } from '@/components/modals/ResultModal';

import { StreetViewPanel } from '@/minigames/ar/StreetViewPanel';

import type { MinigameResult } from '@/types';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';

export function ARPage(): React.JSX.Element {
  const [helpOpen, setHelpOpen] = useState(true);
  const [result, setResult] = useState<MinigameResult | null>(null);

  const identifyFossil = (): void => {
    // Más adelante:
    // - verificar heading
    // - verificar posición
    // - verificar si el fósil está visible

    setResult({
      variant: 'success',
      title: '¡Bien hecho!',
      body: 'Identificaste un gliptodonte correctamente.',
      primaryCta: {
        label: 'Continuar',
        action: 'next',
      },
      secondaryCta: {
        label: 'Volver a jugar',
        action: 'retry',
      },
    });
  };

  const helpContent: HowToPlayContent = {
    body: [
      'Apuntá con la cámara hacia el animal del pasado.',
      'Cuando lo tengas centrado, tocá el botón "Identificar".',
      'Si está bien identificado vas a sumar puntos.',
    ],
    ctaLabel: 'Comenzar',
  };

  const navigate = useNavigate();

  const panoramaRef =
    useRef<google.maps.StreetViewPanorama | null>(null);

  const handleStreetViewReady = (
    panorama: google.maps.StreetViewPanorama,
  ) => {
    panoramaRef.current = panorama;
    panorama.addListener('pov_changed', () => {
      const pov = panorama.getPov();

      console.log(pov.heading);
      console.log(pov.pitch);
    });
  };

  const heading = panoramaRef.current?.getPov().heading;
  const position = panoramaRef.current?.getPosition;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <StreetViewPanel onReady={handleStreetViewReady} />

      {/* Botón salir */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-3 top-3 z-20 bg-panel/90"
        onClick={() => navigate(RoutePaths.Missions)}
      >
        ← Salir
      </Button>

      {/* Ayuda */}
      <HelpButton onClick={() => setHelpOpen(true)} />

      {/* Botón identificar */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <Button size="lg" onClick={identifyFossil}>
          Identificar
        </Button>
      </div>

      <HowToPlayModal
        id="ar-how-to-play"
        open={helpOpen}
        content={helpContent}
        onStart={() => setHelpOpen(false)}
      />

      <ResultModal
        id="ar-result"
        open={result !== null}
        result={result}
        onAction={() => setResult(null)}
      />
    </section>
  );
}
