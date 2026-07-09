// FossilModel.tsx

import { useGLTF } from '@react-three/drei';
import { Fossil } from '@/types';
import { useMemo } from 'react';
import { fossilsAR } from '@/data/fossilsAR';

interface Props {
  fossil: Fossil;
}

export function FossilModel({ fossil }: Props) {
  const { scene } = useGLTF(fossil.model);

  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      scale={fossil.scale}
    />
  );
}

fossilsAR.forEach((fossil) => {
  useGLTF.preload(fossil.model);
});
