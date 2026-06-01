import { Canvas } from '@react-three/fiber';
import { signedAngleDifference } from './util/signedAngleDifference';
import { FossilAR } from '@/types';
import { FossilModel } from './FossilModel';
import { useEffect } from 'react'

interface FossilMarker extends FossilAR {
  heading: number;
  distance: number;
}

interface Props {
  heading: number; // dirección del jugador en Street View
  pitch: number;   // mirar arriba/abajo
  fossils: FossilMarker[];
}

export function FossilOverlay({
  heading,
  pitch,
  fossils,
}: Props) {

  useEffect(() => {
    console.log('FossilOverlay mounted');

    return () => {
      console.log('FossilOverlay unmounted');
    };
  }, []);

  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      camera={{
        position: [0, 0, 5],
        fov: 75,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {fossils.map((fossil) => {
        const dx = signedAngleDifference(
          heading,
          fossil.heading,
        );

        const visible = Math.abs(dx) < 60;
        const close = fossil.distance < 80;
        if (!(visible && close)) { return null };

        // eje X = izquierda/derecha según heading
        const x = dx / 15;

        // eje Y = pitch (arriba/abajo)
        const y = -pitch / 15;

        const scale = Math.max(
          0.2,
          Math.min(3, 100 / fossil.distance),
        );

        return (
          <group
            key={fossil.id}
            position={[x, y, 0]}
            scale={scale}
          >
            <FossilModel fossil={fossil} />
          </group>
        );
      })}
    </Canvas>
  );
}
