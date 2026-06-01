// FossilModel.tsx

import { useGLTF } from '@react-three/drei';
import { FossilAR } from '@/types';

interface Props {
  fossil: FossilAR;
}

export function FossilModel({ fossil }: Props) {
  const gltf = useGLTF(fossil.model);
  return (
    <primitive
      object={gltf.scene}
      scale={fossil.scale}
    />
  );
}

useGLTF.preload(
  '/assets/models3D/gliptodonte3D.glb',
);
