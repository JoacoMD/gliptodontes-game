import Phaser from 'phaser';
import { EventKeys, GameSize, SceneKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';
import { SettingsStore } from '@/systems/SettingsStore';
import { Palettes } from '@/config/Palettes';
import type { Tool } from '@/minigames/excavation/types';

const FOSSIL_RECT = { x: 60, y: 360, w: 600, h: 680 } as const;
const GRID_COLS = 40;
const GRID_ROWS = 60; // 40 x 60 = 2400 cells (matches default cellsPerLayer)
const CELL_W = FOSSIL_RECT.w / GRID_COLS;
const CELL_H = FOSSIL_RECT.h / GRID_ROWS;

/**
 * Per-layer textures. Drop matching PNG/JPG files at the listed paths in
 * `public/` and they will be picked up automatically. While a file is missing
 * the scene falls back to the corresponding solid color so the game keeps
 * working during development.
 */
const LAYER_ASSETS: readonly { key: string; path: string; fallback: number }[] = [
  {
    key: 'excavation-layer-pick',
    path: 'assets/excavation/layer-dirt.jpg',
    fallback: 0x5b3a1e, // dirt
  },
  {
    key: 'excavation-layer-chisel',
    path: 'assets/excavation/layer-rock.jpg',
    fallback: 0x7d7468, // rock
  },
  {
    key: 'excavation-layer-brush',
    path: 'assets/excavation/layer-sand.jpg',
    fallback: 0xcaa56a, // sand
  },
] as const;

const ERASER_RADIUS: Record<Tool, number> = {
  pick: 44,
  chisel: 30,
  brush: 22,
};

export class ExcavationGameScene extends MinigameSceneBase {
  private model!: ExcavationModel;
  private layerTextures: Phaser.GameObjects.RenderTexture[] = [];
  private eraseStamp!: Phaser.GameObjects.Arc;
  private fossilSilhouette!: Phaser.GameObjects.Container;
  private isPressing = false;
  private wrongToolUsedThisPress = false;
  private lastErasePoint: { x: number; y: number } | null = null;

  // Bound listeners so we can off() them on shutdown.
  private readonly onToolSelected = (tool: Tool) => {
    this.model?.selectTool(tool);
  };

  constructor() {
    super(SceneKeys.MinigameExcavation);
  }

  preload(): void {
    // Load the layer textures. If a file is missing the loader will emit
    // a `loaderror` event and `this.textures.exists(key)` stays false, so
    // `paintLayer()` will pick the solid-color fallback instead.
    this.load.on('loaderror', (file: { key?: string }) => {
      console.warn(`[Excavation] Missing texture asset: ${file?.key ?? '(unknown)'}`);
    });
    LAYER_ASSETS.forEach(({ key, path }) => {
      if (!this.textures.exists(key)) this.load.image(key, path);
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Palettes.normal.background);

    this.drawHeader();
    this.drawPit();
    this.drawFossilSilhouette();
    this.createLayerTextures();
    this.createEraseStamp();

    this.model = new ExcavationModel({
      timeLimitSec: SettingsStore.getKey('noTimeMode') ? null : 120,
    });

    this.attachModelEvents();
    this.attachInputEvents();

    EventBus.on(EventKeys.ExcavationToolSelected, this.onToolSelected);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdownScene());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.shutdownScene());

    this.model.start();
    this.emitState();
  }

  override update(_time: number, deltaMs: number): void {
    this.model?.tick(deltaMs / 1000);
  }

  /**
   * Restart in-place: refill the layer RenderTextures, restore visibility,
   * reset transient input flags, and bring the model back to a fresh
   * "playing" state. Avoids `scene.restart()` so we keep the canvas frozen
   * while React still shows the help modal (paused state preserved by
   * `PhaserGame`).
   */
  protected override restartGame(): void {
    this.isPressing = false;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
    this.layerTextures.forEach((rt, i) => {
      rt.setVisible(true);
      this.paintLayer(rt, i);
    });
    this.model.reset();
    this.model.start();
    this.emitState();
  }

  // ---------------- Setup ----------------

  private drawHeader(): void {
    const cx = GameSize.width / 2;
    this.add
      .text(cx, 200, 'Desenterrar la historia', {
        fontFamily: 'Berkshire Swash, Georgia, serif',
        fontSize: '42px',
        color: `#${Palettes.normal.accent.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);
  }

  private drawPit(): void {
    // Frame around the fossil dig area.
    this.add
      .rectangle(
        FOSSIL_RECT.x + FOSSIL_RECT.w / 2,
        FOSSIL_RECT.y + FOSSIL_RECT.h / 2,
        FOSSIL_RECT.w,
        FOSSIL_RECT.h,
        0xe6cf9b,
      )
      .setStrokeStyle(6, Palettes.normal.panelBorder)
      .setDepth(0);
  }

  private drawFossilSilhouette(): void {
    // Placeholder fossil: simple skeleton-ish silhouette drawn with Graphics so
    // it shows up under the layers without needing image assets.
    const container = this.add.container(
      FOSSIL_RECT.x + FOSSIL_RECT.w / 2,
      FOSSIL_RECT.y + FOSSIL_RECT.h / 2,
    );
    const g = this.add.graphics();
    g.fillStyle(0xf5ecd2, 1);
    // skull
    g.fillCircle(0, -220, 80);
    // spine
    g.fillRoundedRect(-22, -140, 44, 240, 14);
    // ribs
    for (let i = 0; i < 5; i += 1) {
      const y = -100 + i * 38;
      g.fillRoundedRect(-180, y, 160, 18, 9);
      g.fillRoundedRect(20, y, 160, 18, 9);
    }
    // pelvis
    g.fillRoundedRect(-90, 120, 180, 50, 24);
    // tail
    g.fillRoundedRect(-12, 170, 24, 100, 12);
    container.add(g);
    container.setDepth(1);
    this.fossilSilhouette = container;
  }

  private createLayerTextures(): void {
    for (let i = 0; i < 3; i += 1) {
      const rt = this.add
        .renderTexture(
          FOSSIL_RECT.x + FOSSIL_RECT.w / 2,
          FOSSIL_RECT.y + FOSSIL_RECT.h / 2,
          FOSSIL_RECT.w,
          FOSSIL_RECT.h,
        )
        // Outermost on top: layer 0 must have the highest depth.
        .setDepth(50 + (2 - i));
      this.paintLayer(rt, i);
      this.layerTextures.push(rt);
    }
  }

  /**
   * Paint a layer's RenderTexture using its configured image asset (scaled
   * to fit the fossil rect) if loaded, otherwise fall back to a solid fill.
   *
   * Phaser 4 buffers all DynamicTexture drawing operations: we MUST call
   * `render()` to flush them onto the underlying texture, otherwise nothing
   * is visible.
   */
  private paintLayer(rt: Phaser.GameObjects.RenderTexture, idx: number): void {
    const asset = LAYER_ASSETS[idx]!;
    // Clear any previous content (no-op on a freshly created texture).
    rt.clear();
    if (this.textures.exists(asset.key)) {
      const source = this.textures.get(asset.key).getSourceImage() as {
        width: number;
        height: number;
      };
      const sw = source.width || FOSSIL_RECT.w;
      const sh = source.height || FOSSIL_RECT.h;
      // `stamp` paints a texture frame at (x, y) using local coords. Origin
      // top-left + scaling to FOSSIL_RECT makes any source size fit the area.
      rt.stamp(asset.key, undefined, 0, 0, {
        originX: 0,
        originY: 0,
        scaleX: FOSSIL_RECT.w / sw,
        scaleY: FOSSIL_RECT.h / sh,
      });
    } else {
      rt.fill(asset.fallback);
    }
    rt.render();
  }

  private createEraseStamp(): void {
    // Reusable Arc used as a brush stamp for erase().
    this.eraseStamp = this.add.circle(0, 0, ERASER_RADIUS.pick, 0xffffff).setVisible(false);
  }

  // ---------------- Input ----------------

  private attachInputEvents(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) =>
      this.handlePointerDown(p),
    );
    this.input.on(Phaser.Input.Events.POINTER_MOVE, (p: Phaser.Input.Pointer) =>
      this.handlePointerMove(p),
    );
    this.input.on(Phaser.Input.Events.POINTER_UP, () => this.handlePointerUp());
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, () => this.handlePointerUp());
  }

  private handlePointerDown(p: Phaser.Input.Pointer): void {
    if (this.model.status !== 'playing') return;
    if (!this.isInsideFossil(p.worldX, p.worldY)) return;
    this.isPressing = true;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
    if (this.model.selectedTool !== this.model.requiredTool) {
      this.wrongToolUsedThisPress = true;
      this.model.damageOnce();
      this.emitState();
      return;
    }
    this.eraseAt(p.worldX, p.worldY);
  }

  private handlePointerMove(p: Phaser.Input.Pointer): void {
    if (!this.isPressing) return;
    if (this.model.status !== 'playing') return;
    if (this.wrongToolUsedThisPress) return;
    if (!this.isInsideFossil(p.worldX, p.worldY)) return;
    if (this.model.selectedTool !== this.model.requiredTool) return;
    this.eraseAt(p.worldX, p.worldY);
  }

  private handlePointerUp(): void {
    this.isPressing = false;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
  }

  private isInsideFossil(x: number, y: number): boolean {
    return (
      x >= FOSSIL_RECT.x &&
      x <= FOSSIL_RECT.x + FOSSIL_RECT.w &&
      y >= FOSSIL_RECT.y &&
      y <= FOSSIL_RECT.y + FOSSIL_RECT.h
    );
  }

  // ---------------- Erase + grid ----------------

  private eraseAt(worldX: number, worldY: number): void {
    const tool = this.model.selectedTool;
    const radius = ERASER_RADIUS[tool];

    // Interpolate between last point and current to avoid gaps on fast moves.
    const points: { x: number; y: number }[] = [];
    if (this.lastErasePoint) {
      const dx = worldX - this.lastErasePoint.x;
      const dy = worldY - this.lastErasePoint.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / (radius * 0.5)));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        points.push({ x: this.lastErasePoint.x + dx * t, y: this.lastErasePoint.y + dy * t });
      }
    } else {
      points.push({ x: worldX, y: worldY });
    }
    this.lastErasePoint = { x: worldX, y: worldY };

    const topRt = this.layerTextures[this.model.layer]!;
    this.eraseStamp.setRadius(radius);
    const cells = new Set<number>();
    for (const { x, y } of points) {
      // Erase visually. RenderTexture is local-space; convert to texture coords.
      const localX = x - FOSSIL_RECT.x;
      const localY = y - FOSSIL_RECT.y;
      this.eraseStamp.setPosition(localX, localY);
      topRt.erase(this.eraseStamp, 0, 0);
      this.collectCellsInCircle(x, y, radius, cells);
    }
    // Flush the queued erase commands so the holes become visible.
    topRt.render();
    if (cells.size > 0) this.model.cleanCells(cells);
  }

  private collectCellsInCircle(
    worldX: number,
    worldY: number,
    radius: number,
    out: Set<number>,
  ): void {
    const localX = worldX - FOSSIL_RECT.x;
    const localY = worldY - FOSSIL_RECT.y;
    const minCol = Math.max(0, Math.floor((localX - radius) / CELL_W));
    const maxCol = Math.min(GRID_COLS - 1, Math.floor((localX + radius) / CELL_W));
    const minRow = Math.max(0, Math.floor((localY - radius) / CELL_H));
    const maxRow = Math.min(GRID_ROWS - 1, Math.floor((localY + radius) / CELL_H));
    const r2 = radius * radius;
    for (let row = minRow; row <= maxRow; row += 1) {
      const cy = row * CELL_H + CELL_H / 2;
      for (let col = minCol; col <= maxCol; col += 1) {
        const cx = col * CELL_W + CELL_W / 2;
        const dx = cx - localX;
        const dy = cy - localY;
        if (dx * dx + dy * dy <= r2) {
          out.add(row * GRID_COLS + col);
        }
      }
    }
  }

  // ---------------- Model integration ----------------

  private attachModelEvents(): void {
    this.model.on('progress', () => this.emitState());
    this.model.on('lives', () => this.emitState());
    this.model.on('time', () => this.emitState());
    this.model.on('toolChanged', () => this.emitState());
    this.model.on('layerAdvanced', (layer) => {
      // Hide the cleared layer so the next color (or the fossil) shows.
      const idx = (layer as number) - 1;
      if (this.layerTextures[idx]) this.layerTextures[idx]!.setVisible(false);
      this.lastErasePoint = null;
      this.emitState();
    });
    this.model.on('success', () => {
      // Reveal the fossil completely.
      this.layerTextures.forEach((rt) => rt.setVisible(false));
      this.succeed({
        variant: 'success',
        title: '¡Bien hecho!',
        body: 'Has logrado desenterrar un fósil con éxito.',
        primaryCta: { label: 'Avanzar', action: 'next' },
        secondaryCta: { label: 'Volver a jugar', action: 'retry' },
      });
    });
    this.model.on('failure', () => {
      this.fail({
        variant: 'failure',
        title: '¡Oops!',
        body: 'Se ha roto el fósil…',
        primaryCta: { label: 'Intentar de nuevo', action: 'retry' },
        secondaryCta: { label: 'Volver a misiones', action: 'menu' },
      });
    });
  }

  private emitState(): void {
    EventBus.emit(EventKeys.ExcavationStateChanged, this.model.state);
  }

  // ---------------- Cleanup ----------------

  private shutdownScene(): void {
    EventBus.off(EventKeys.ExcavationToolSelected, this.onToolSelected);
    this.input.removeAllListeners();
    this.fossilSilhouette?.destroy();
    this.layerTextures.forEach((rt) => rt.destroy());
    this.layerTextures = [];
  }
}
