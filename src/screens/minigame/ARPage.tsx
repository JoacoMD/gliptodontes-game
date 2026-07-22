import { useState } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';

import { HelpButton } from '@/components/ui/HelpButton';
import { Button } from '@/components/ui/Button';

import {
  HowToPlayModal,
  type HowToPlayContent,
} from '@/components/modals/HowToPlayModal';

import { ResultModal } from '@/components/modals/ResultModal';

import { StreetViewPanel } from '@/minigames/ar/StreetViewPanel';

import { MapSelector } from '@/minigames/ar/MapSelector';

import { FossilOverlay } from '@/minigames/ar/FossilOverlay';

import type { FossilMarker, MinigameResult } from '@/types';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';

import { fossilsAR } from '@/data/fossilsAR';

import { calculateBearing } from '@/minigames/ar/util/calculateBearing';
import { calculateDistance } from '@/minigames/ar/util/calculateDistance';
import { closeEnough } from '@/minigames/ar/util/closeEnough';

export function ARPage(): React.JSX.Element {
  const [helpOpen, setHelpOpen] = useState(true);
  const [result, setResult] = useState<MinigameResult | null>(null);

  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [playerPosition, setPlayerPosition] =
    useState<google.maps.LatLng | null>(null);
  const [startLocation, setStartLocation] = useState<google.maps.LatLngLiteral | null>(null,);

  useEffect(() => {
    console.log('ARPage mounted');

    return () => {
      console.log('ARPage unmounted');
    };
  }, []);

  const fossils: FossilMarker[] = [];
  if (playerPosition != null) {
    for (const f of fossilsAR) {
      let i = 0;
      for (const l of f.locations) {
        fossils.push({
          id: `${f.id + i}`,
          name: f.name,
          model: f.model,
          scale: f.scale,
          funfact: f.funfact,
          image: f.image,
          lat: l.lat,
          lng: l.lng,
          heading: calculateBearing(
            playerPosition.lat(),
            playerPosition.lng(),
            l.lat,
            l.lng,
          ),
          distance: calculateDistance(
            playerPosition.lat(),
            playerPosition.lng(),
            l.lat,
            l.lng,
          )
        })
      }
    }
  }

  const visibleFossils = playerPosition == null ? [] : (() => {
    const playerLat = playerPosition.lat();
    const playerLng = playerPosition.lng();

    return fossils.map((fossil) => ({
      ...fossil,
      heading: calculateBearing(
        playerLat,
        playerLng,
        fossil.lat,
        fossil.lng,
      ),
      distance: calculateDistance(
        playerLat,
        playerLng,
        fossil.lat,
        fossil.lng,
      ),
    }));
  })();

  const fossilsWithRuntimeData = useMemo(() => {
    if (!playerPosition) return [];

    return fossils.map((fossil) => {
      const headingToFossil = calculateBearing(
        playerPosition.lat(),
        playerPosition.lng(),
        fossil.lat,
        fossil.lng,
      );

      const distance = calculateDistance(
        playerPosition.lat(),
        playerPosition.lng(),
        fossil.lat,
        fossil.lng,
      );

      return {
        ...fossil,
        heading: headingToFossil,
        distance,
      };
    });
  }, [playerPosition]);

  const handleResultAction = (
    action: 'retry' | 'next' | 'menu',
  ): void => {
    setResult(null);

    switch (action) {
      case 'menu':
        navigate(RoutePaths.Missions);
        break;

      case 'next':
        navigate(RoutePaths.Missions);
        break;

      case 'retry':
        break;
    }
  };

  const identifyFossil = (): void => {
    if (!playerPosition) return;

    const target = fossilsWithRuntimeData.find((fossil) =>
      closeEnough(
        heading,
        fossil.heading,
        fossil.distance,
        50, // distancia en metros
        6,  // precisión angular
      ),
    );

    if (!target) {
      setResult({
        variant: 'failure',
        title: 'Nada aquí',
        body: 'No estás mirando ningún fósil lo suficientemente cerca.',
        primaryCta: { label: 'Seguir buscando', action: 'retry' },
      });
      return;
    }

    setResult({
      variant: 'success',
      title: '¡Bien hecho!',
      body: `Identificaste el ${target.name}.`,
      didYouKnow: target.funfact,
      image: target.image,
      primaryCta: { label: 'Continuar', action: 'retry' },
      secondaryCta: { label: 'Volver al menú', action: 'menu' },
    });
  };

  const helpContent: HowToPlayContent = {
    body: [
      'Primero elegí un sitio en el mapa para comenzar la exploración.',
      'Luego, buscá el fósil. Cuando quede iluminado, tocá el botón "Identificar" para descubrir de qué animal se trata.',
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

    const update = () => {
      const pov = panorama.getPov();

      setHeading(pov.heading);
      setPitch(pov.pitch);

      setPlayerPosition(
        panorama.getPosition() ?? null,
      );
    };

    update();

    panorama.addListener(
      'pov_changed',
      update,
    );

    panorama.addListener(
      'position_changed',
      update,
    );
  };


  return (
    <section className="relative h-full w-full z-0 overflow-hidden">
      {!startLocation ? (
        <MapSelector onLocationSelected={setStartLocation} />
      ) : (
        <>
          {playerPosition && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <FossilOverlay
                heading={heading}
                pitch={pitch}
                fossils={visibleFossils}
              />
            </div>
          )}
          <StreetViewPanel onReady={handleStreetViewReady} initialPosition={startLocation} />
          <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
            <Button size="lg" onClick={identifyFossil}>
              Identificar
            </Button>
          </div>
          <Button
            variant="secondary"
            size="md"
            className="absolute right-3 top-3 z-20 bg-panel/90"
            onClick={() => setStartLocation(null)}
          >
            Mapa
          </Button>
        </>
      )}
      {/* Botón salir */}
      <Button
        variant="secondary"
        size="md"
        className="absolute left-3 top-3 z-20 bg-panel/90"
        onClick={() => navigate(RoutePaths.Missions)}
      >
        ← Salir
      </Button>

      {/* Ayuda */}
      <HelpButton onClick={() => setHelpOpen(true)} />

      {/* Botón identificar */}

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
        didYouKnow={result?.didYouKnow}
        onAction={handleResultAction}
        image={result?.image}
      />
    </section>
  );
}
