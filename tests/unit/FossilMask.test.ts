import { describe, expect, it } from 'vitest';
import { FossilMask } from '@/minigames/excavation/FossilMask';

/**
 * Genera un canvas 100x100 con un círculo central de radio 20 con alpha 255.
 * Se usa como máscara sintética en los tests.
 */
function makeCircleMask(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(50, 50, 20, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

describe('FossilMask', () => {
  it('isOnFossil is true at the center of the painted area', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      nearBandPx: 10,
    });
    expect(mask.isOnFossil(50, 50)).toBe(true);
    expect(mask.zoneAt(50, 50)).toBe('on');
  });

  it('isFar is true well outside the painted area and the band', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0, y: 0, width: 100, height: 100, nearBandPx: 10,
    });
    expect(mask.isFar(5, 5)).toBe(true);
    expect(mask.zoneAt(5, 5)).toBe('far');
  });

  it('isNearFossil is true within the band around the painted area', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0, y: 0, width: 100, height: 100, nearBandPx: 10,
    });
    // Punto a ~5px del borde del círculo (borde en (75, 50))
    expect(mask.isNearFossil(75, 50)).toBe(true);
    expect(mask.zoneAt(75, 50)).toBe('near');
  });

  it('honors translation via x/y offset', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 100, y: 100, width: 100, height: 100, nearBandPx: 10,
    });
    // Centro original (50,50) ahora vive en (150,150)
    expect(mask.isOnFossil(150, 150)).toBe(true);
    expect(mask.isOnFossil(50, 50)).toBe(false);
  });

  it('honors scaling via width/height', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0, y: 0, width: 200, height: 200, nearBandPx: 10,
    });
    // Centro escalado vive en (100,100); el círculo escalado tiene radio 40
    expect(mask.isOnFossil(100, 100)).toBe(true);
    // Punto claramente fuera del círculo escalado y de la banda (radio 40 + 10 = 50)
    expect(mask.isOnFossil(45, 100)).toBe(false);
  });

  it('zones are mutually exclusive', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0, y: 0, width: 100, height: 100, nearBandPx: 10,
    });
    for (const [x, y] of [[5, 5], [50, 50], [75, 50]]) {
      const zone = mask.zoneAt(x, y);
      const flags = [mask.isFar(x, y), mask.isNearFossil(x, y), mask.isOnFossil(x, y)];
      expect(flags.filter(Boolean).length).toBe(1);
      expect(['far', 'near', 'on']).toContain(zone);
    }
  });

  it('destroy releases the internal canvas', () => {
    const mask = new FossilMask({
      image: makeCircleMask(),
      x: 0, y: 0, width: 100, height: 100, nearBandPx: 10,
    });
    mask.destroy();
    // Después de destroy las consultas devuelven 'far' / false como fallback seguro.
    expect(mask.isOnFossil(50, 50)).toBe(false);
    expect(mask.isFar(50, 50)).toBe(true);
  });

  it('extends the near band OUTSIDE the asset bitmap (edges to edges)', () => {
    // Asset que llena todo su bitmap (alpha 255 en todos los píxeles).
    // Si la implementación no padea internamente, la banda `near` no existe
    // a lo largo de los lados rectos porque no hay píxeles transparentes
    // dentro del bitmap.
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    // Arco gigante centrado en el bitmap: cubre todos los píxeles.
    ctx.beginPath();
    ctx.arc(25, 25, 200, 0, Math.PI * 2);
    ctx.fill();

    const mask = new FossilMask({
      image: canvas,
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      nearBandPx: 10,
    });
    // Centro del fósil: claramente `on`.
    expect(mask.zoneAt(125, 125)).toBe('on');
    // 5 px arriba del borde superior del fósil → `near` (la banda existe fuera del bitmap).
    expect(mask.zoneAt(125, 95)).toBe('near');
    // 5 px a la derecha del borde derecho → `near`.
    expect(mask.zoneAt(155, 125)).toBe('near');
    // 5 px abajo del borde inferior → `near`.
    expect(mask.zoneAt(125, 155)).toBe('near');
    // 5 px a la izquierda del borde izquierdo → `near`.
    expect(mask.zoneAt(95, 125)).toBe('near');
    // 15 px más allá del borde (fuera de la banda) → `far`.
    expect(mask.zoneAt(125, 84)).toBe('far');
  });
});
