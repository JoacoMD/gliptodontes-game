import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
});

// ---------------------------------------------------------------------------
// Canvas 2D mock for jsdom (no native `canvas` package required).
// Implements a software-rendered RGBA buffer that supports the operations
// needed by FossilMask: arc/fill, drawImage, clearRect, getImageData.
// ---------------------------------------------------------------------------

class MockCanvas2DContext {
  private buf: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  fillStyle: string = 'black';
  private pathCmds: Array<{ type: string; args: number[] }> = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buf = new Uint8ClampedArray(width * height * 4);
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    const x1 = Math.max(0, Math.floor(x));
    const y1 = Math.max(0, Math.floor(y));
    const x2 = Math.min(this.width, Math.ceil(x + w));
    const y2 = Math.min(this.height, Math.ceil(y + h));
    for (let py = y1; py < y2; py++) {
      for (let px = x1; px < x2; px++) {
        const i = (py * this.width + px) * 4;
        this.buf[i] = 0; this.buf[i + 1] = 0; this.buf[i + 2] = 0; this.buf[i + 3] = 0;
      }
    }
  }

  beginPath(): void { this.pathCmds = []; }
  arc(cx: number, cy: number, r: number, _start: number, _end: number): void {
    this.pathCmds.push({ type: 'arc', args: [cx, cy, r] });
  }

  fill(): void {
    const [fr, fg, fb] = parseColor(this.fillStyle);
    for (const cmd of this.pathCmds) {
      if (cmd.type === 'arc') {
        const [cx, cy, r] = cmd.args as [number, number, number];
        const x1 = Math.max(0, Math.floor(cx - r));
        const y1 = Math.max(0, Math.floor(cy - r));
        const x2 = Math.min(this.width, Math.ceil(cx + r) + 1);
        const y2 = Math.min(this.height, Math.ceil(cy + r) + 1);
        for (let py = y1; py < y2; py++) {
          for (let px = x1; px < x2; px++) {
            const dx = px + 0.5 - cx;
            const dy = py + 0.5 - cy;
            if (dx * dx + dy * dy <= r * r) {
              const i = (py * this.width + px) * 4;
              this.buf[i] = fr; this.buf[i + 1] = fg; this.buf[i + 2] = fb; this.buf[i + 3] = 255;
            }
          }
        }
      }
    }
  }

  drawImage(src: HTMLCanvasElement, dx: number, dy: number, dw?: number, dh?: number): void {
    const srcCtx = (src as unknown as { _mockCtx?: MockCanvas2DContext })._mockCtx;
    if (!srcCtx) return;
    const sw = src.width;
    const sh = src.height;
    const destW = dw ?? sw;
    const destH = dh ?? sh;
    for (let destY = 0; destY < destH; destY++) {
      for (let destX = 0; destX < destW; destX++) {
        const srcX = Math.floor((destX / destW) * sw);
        const srcY = Math.floor((destY / destH) * sh);
        const srcI = (srcY * sw + srcX) * 4;
        const destI = ((dy + destY) * this.width + (dx + destX)) * 4;
        if (destX + dx < 0 || destX + dx >= this.width) continue;
        if (destY + dy < 0 || destY + dy >= this.height) continue;
        this.buf[destI] = srcCtx.buf[srcI]!;
        this.buf[destI + 1] = srcCtx.buf[srcI + 1]!;
        this.buf[destI + 2] = srcCtx.buf[srcI + 2]!;
        this.buf[destI + 3] = srcCtx.buf[srcI + 3]!;
      }
    }
  }

  getImageData(_x: number, _y: number, w: number, h: number): { data: Uint8ClampedArray } {
    if (_x === 0 && _y === 0 && w === this.width && h === this.height) {
      return { data: this.buf };
    }
    const out = new Uint8ClampedArray(w * h * 4);
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const si = ((_y + py) * this.width + (_x + px)) * 4;
        const di = (py * w + px) * 4;
        out[di] = this.buf[si]!; out[di + 1] = this.buf[si + 1]!;
        out[di + 2] = this.buf[si + 2]!; out[di + 3] = this.buf[si + 3]!;
      }
    }
    return { data: out };
  }
}

function parseColor(style: string): [number, number, number] {
  if (style === 'white') return [255, 255, 255];
  if (style === 'black') return [0, 0, 0];
  const hex = style.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const v = parseInt(hex[1]!, 16);
    return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
  }
  return [0, 0, 0];
}

if (typeof HTMLCanvasElement !== 'undefined') {
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement & { _mockCtx?: MockCanvas2DContext },
    contextId: string,
    ...args: unknown[]
  ): RenderingContext | null {
    if (contextId === '2d') {
      if (!this._mockCtx) {
        this._mockCtx = new MockCanvas2DContext(this.width || 300, this.height || 150);
      }
      if (this._mockCtx.width !== (this.width || 300) || this._mockCtx.height !== (this.height || 150)) {
        this._mockCtx = new MockCanvas2DContext(this.width || 300, this.height || 150);
      }
      return this._mockCtx as unknown as CanvasRenderingContext2D;
    }
    return origGetContext.call(this, contextId, ...(args as []));
  } as typeof HTMLCanvasElement.prototype.getContext;
}
