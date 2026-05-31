import type { Zone } from './types';

export interface FossilMaskOptions {
  /** Imagen con alpha. Define el contorno del fósil. */
  image: HTMLImageElement | HTMLCanvasElement;
  /** Top-left del fósil en coords locales del pozo. */
  x: number;
  y: number;
  /** Tamaño renderizado del fósil. */
  width: number;
  height: number;
  /** Ancho de la banda anular "cerca del fósil", en píxeles del pozo. */
  nearBandPx: number;
}

/**
 * Mapea coordenadas locales del pozo a zonas `on | near | far` usando el
 * canal alpha de una máscara.
 *
 * Implementación: al construirse, dibuja la máscara escalada a un canvas
 * interno y lee `imageData` una vez. Precalcula una matriz de distancia
 * binaria — para cada píxel: 0 si pertenece al fósil, ∞ si no, y luego
 * propaga distancias con un pasaje 2-direcciones (chamfer distance) en
 * O(W*H). Las consultas posteriores son O(1).
 *
 * Sólo necesitamos saber si la distancia ≤ `nearBandPx`, así que
 * almacenamos enteros (saturados a `nearBandPx + 1`).
 */
export class FossilMask {
  private readonly opts: FossilMaskOptions;
  private dist: Int16Array | null = null;
  private readonly innerW: number;
  private readonly innerH: number;
  private readonly pad: number;
  private readonly w: number; // bitmap interno = inner + 2*pad
  private readonly h: number;

  constructor(opts: FossilMaskOptions) {
    this.opts = opts;
    this.innerW = Math.max(1, Math.floor(opts.width));
    this.innerH = Math.max(1, Math.floor(opts.height));
    // Padeo igual a nearBandPx para que la banda `near` se extienda fuera
    // del bitmap del asset. Sin esto, fósiles que llenan su PNG entero no
    // generan banda en los lados rectos: sólo en las esquinas redondeadas
    // (donde el alpha es 0 dentro del bitmap).
    this.pad = Math.max(0, Math.floor(opts.nearBandPx));
    this.w = this.innerW + this.pad * 2;
    this.h = this.innerH + this.pad * 2;
    this.dist = this.computeDistanceField();
  }

  isOnFossil(localX: number, localY: number): boolean {
    return this.zoneAt(localX, localY) === 'on';
  }
  isNearFossil(localX: number, localY: number): boolean {
    return this.zoneAt(localX, localY) === 'near';
  }
  isFar(localX: number, localY: number): boolean {
    return this.zoneAt(localX, localY) === 'far';
  }

  zoneAt(localX: number, localY: number): Zone {
    if (!this.dist) return 'far';
    const px = Math.floor(localX - this.opts.x) + this.pad;
    const py = Math.floor(localY - this.opts.y) + this.pad;
    if (px < 0 || py < 0 || px >= this.w || py >= this.h) return 'far';
    const d = this.dist[py * this.w + px]!;
    if (d === 0) return 'on';
    if (d <= this.opts.nearBandPx) return 'near';
    return 'far';
  }

  destroy(): void {
    this.dist = null;
  }

  private computeDistanceField(): Int16Array {
    const canvas = document.createElement('canvas');
    canvas.width = this.w;
    canvas.height = this.h;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.w, this.h);
    // El asset se dibuja en (pad, pad) para dejar el padeo transparente
    // alrededor.
    ctx.drawImage(this.opts.image, this.pad, this.pad, this.innerW, this.innerH);
    const data = ctx.getImageData(0, 0, this.w, this.h).data;

    const N = this.w * this.h;
    const INF = this.opts.nearBandPx + 1;
    const dist = new Int16Array(N);
    for (let i = 0; i < N; i += 1) {
      const alpha = data[i * 4 + 3]!;
      dist[i] = alpha > 16 ? 0 : INF;
    }
    const idx = (x: number, y: number) => y * this.w + x;
    // Pasada hacia adelante (chamfer)
    for (let y = 0; y < this.h; y += 1) {
      for (let x = 0; x < this.w; x += 1) {
        const i = idx(x, y);
        let v = dist[i]!;
        if (v === 0) continue;
        if (x > 0) v = Math.min(v, (dist[idx(x - 1, y)]! + 1));
        if (y > 0) v = Math.min(v, (dist[idx(x, y - 1)]! + 1));
        if (x > 0 && y > 0) v = Math.min(v, (dist[idx(x - 1, y - 1)]! + 1));
        if (x + 1 < this.w && y > 0) v = Math.min(v, (dist[idx(x + 1, y - 1)]! + 1));
        dist[i] = Math.min(v, INF);
      }
    }
    // Pasada hacia atrás
    for (let y = this.h - 1; y >= 0; y -= 1) {
      for (let x = this.w - 1; x >= 0; x -= 1) {
        const i = idx(x, y);
        let v = dist[i]!;
        if (v === 0) continue;
        if (x + 1 < this.w) v = Math.min(v, (dist[idx(x + 1, y)]! + 1));
        if (y + 1 < this.h) v = Math.min(v, (dist[idx(x, y + 1)]! + 1));
        if (x + 1 < this.w && y + 1 < this.h) v = Math.min(v, (dist[idx(x + 1, y + 1)]! + 1));
        if (x > 0 && y + 1 < this.h) v = Math.min(v, (dist[idx(x - 1, y + 1)]! + 1));
        dist[i] = Math.min(v, INF);
      }
    }
    return dist;
  }
}
