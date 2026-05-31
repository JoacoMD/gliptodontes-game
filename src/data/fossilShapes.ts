export interface FossilShape {
  id: string;
  species: string;
  /** Nombre legible en español, encaja en "Has desenterrado un <displayName>". */
  displayName: string;
  /** Clave usada por `this.load.image(key, path)` en Phaser. */
  maskAssetKey: string;
  /** Ruta relativa a /public (ej. 'assets/excavation/masks/foo.png'). */
  maskAssetPath: string;
}

const define = (
  id: string,
  species: string,
  displayName: string,
): FossilShape => ({
  id,
  species,
  displayName,
  maskAssetKey: `excavation-mask-${id}`,
  maskAssetPath: `assets/excavation/masks/${id}.png`,
});

export const FOSSIL_SHAPES: Record<string, FossilShape> = {
  'gliptodonte-caparazon': define(
    'gliptodonte-caparazon',
    'Glyptodon',
    'caparazón de gliptodonte',
  ),
  'tigre-craneo': define(
    'tigre-craneo',
    'Smilodon',
    'cráneo de tigre dientes de sable',
  ),
};

export const DEFAULT_FOSSIL_SHAPE_ID = 'gliptodonte-caparazon';

export function getFossilShape(id: string | undefined): FossilShape {
  if (id && FOSSIL_SHAPES[id]) return FOSSIL_SHAPES[id]!;
  return FOSSIL_SHAPES[DEFAULT_FOSSIL_SHAPE_ID]!;
}
