import Phaser from 'phaser';
import { EventKeys, GameSize, SceneKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';
import { FossilMask } from '@/minigames/excavation/FossilMask';
import { SettingsStore } from '@/systems/SettingsStore';
import { Palettes } from '@/config/Palettes';
import type { Tool, Zone } from '@/minigames/excavation/types';
import { getFossilShape, type FossilShape } from '@/data/fossilShapes';

const FOSSIL_RECT = { x: 60, y: 360, w: 600, h: 680 } as const;
const GRID_COLS = 40;
const GRID_ROWS = 60;
const CELL_W = FOSSIL_RECT.w / GRID_COLS;
const CELL_H = FOSSIL_RECT.h / GRID_ROWS;
const NEAR_BAND_PX = 40;
const FOSSIL_MARGIN_PX = 30;
const PHASE1_THRESHOLD = 0.8;
const PHASE2_THRESHOLD = 0.9;
/** Caja máxima dentro de la cual cabe el fósil, preservando su aspect ratio. */
const FOSSIL_MAX_SIZE = { w: 240, h: 320 } as const;
const ASSIST_ALPHA = 0.18;
const WRONG_SOUND_DEBOUNCE_MS = 200;
const WRONG_SOUND_KEY = 'tool-wrong';

const DIRT_ASSET = {
  key: 'excavation-dirt',
  path: 'assets/excavation/dirt.png',
  fallback: 0x5b3a1e,
} as const;

const ERASER_RADIUS: Record<Tool, number> = {
  pick: 44,
  chisel: 30,
  brush: 22,
};

export class ExcavationGameScene extends MinigameSceneBase {
  private model!: ExcavationModel;
  private dirtRt!: Phaser.GameObjects.RenderTexture;
  private fossilImage!: Phaser.GameObjects.Image;
  private assistImage: Phaser.GameObjects.Image | null = null;
  private eraseStamp!: Phaser.GameObjects.Arc;
  private fossilMask!: FossilMask;
  private shape!: FossilShape;
  private fossilW: number = FOSSIL_MAX_SIZE.w;
  private fossilH: number = FOSSIL_MAX_SIZE.h;
  private isPressing = false;
  private wrongToolUsedThisPress = false;
  private lastErasePoint: { x: number; y: number } | null = null;
  private lastWrongSoundAt = 0;

  private readonly onToolSelected = (tool: Tool) => {
    this.model?.selectTool(tool);
  };

  constructor() {
    super(SceneKeys.MinigameExcavation);
  }

  preload(): void {
    this.shape = getFossilShape(
      (this.scene.settings.data as { shapeId?: string } | undefined)?.shapeId,
    );

    this.load.on('loaderror', (file: { key?: string }) => {
      console.warn(`[Excavation] Missing asset: ${file?.key ?? '(unknown)'}`);
    });
    if (!this.textures.exists(DIRT_ASSET.key)) {
      this.load.image(DIRT_ASSET.key, DIRT_ASSET.path);
    }
    if (!this.textures.exists(this.shape.maskAssetKey)) {
      this.load.image(this.shape.maskAssetKey, this.shape.maskAssetPath);
    }
    if (!this.cache.audio.exists(WRONG_SOUND_KEY)) {
      this.load.audio(WRONG_SOUND_KEY, 'assets/excavation/tool-wrong.mp3');
    }
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Palettes.normal.background);

    this.drawHeader();
    this.drawPit();
    this.ensureFossilFallbackTexture();
    this.placeFossil();
    this.createDirtTexture();
    this.createAssistOverlay();
    this.createEraseStamp();

    const { phase1, phase2 } = this.computeCellCounts();

    this.model = new ExcavationModel({
      phase1CellsTotal: phase1,
      phase2CellsTotal: phase2,
      phase1Threshold: PHASE1_THRESHOLD,
      phase2Threshold: PHASE2_THRESHOLD,
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

  protected override restartGame(): void {
    this.isPressing = false;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
    this.fossilMask?.destroy();
    this.placeFossil();
    this.dirtRt.setVisible(true);
    this.paintDirt();
    if (this.assistImage) {
      this.assistImage
        .setPosition(this.fossilImage.x, this.fossilImage.y)
        .setDisplaySize(this.fossilW, this.fossilH)
        .setVisible(SettingsStore.getKey('excavationAssist'));
    }
    const { phase1, phase2 } = this.computeCellCounts();
    this.model = new ExcavationModel({
      phase1CellsTotal: phase1,
      phase2CellsTotal: phase2,
      phase1Threshold: PHASE1_THRESHOLD,
      phase2Threshold: PHASE2_THRESHOLD,
      timeLimitSec: SettingsStore.getKey('noTimeMode') ? null : 120,
    });
    this.attachModelEvents();
    this.model.start();
    this.emitState();
  }

  // -------- Setup --------

  private drawHeader(): void {
    const cx = GameSize.width / 2;
    this.add
      .text(cx, 200, 'Desenterrar la historia', {
        fontFamily: 'Darumadrop One, Georgia, serif',
        fontSize: '42px',
        color: `#${Palettes.normal.accent.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);
  }

  private drawPit(): void {
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

  /**
   * Si el PNG de máscara no se cargó, generamos una textura de respaldo
   * (rect redondeado opaco color hueso) para que el flujo funcione sin assets.
   */
  private ensureFossilFallbackTexture(): void {
    if (this.textures.exists(this.shape.maskAssetKey)) return;
    const w = FOSSIL_MAX_SIZE.w;
    const h = FOSSIL_MAX_SIZE.h;
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(0xf5ecd2, 1);
    g.fillRoundedRect(0, 0, w, h, 60);
    g.generateTexture(this.shape.maskAssetKey, w, h);
    g.destroy();
  }

  /**
   * Calcula el tamaño final del fósil preservando su aspect ratio dentro
   * de FOSSIL_MAX_SIZE (escalado de "contain").
   */
  private fitFossilSize(srcW: number, srcH: number): { w: number; h: number } {
    if (srcW <= 0 || srcH <= 0) return { w: FOSSIL_MAX_SIZE.w, h: FOSSIL_MAX_SIZE.h };
    const scale = Math.min(FOSSIL_MAX_SIZE.w / srcW, FOSSIL_MAX_SIZE.h / srcH);
    return { w: Math.max(1, Math.round(srcW * scale)), h: Math.max(1, Math.round(srcH * scale)) };
  }

  private placeFossil(): void {
    const tex = this.textures.get(this.shape.maskAssetKey);
    const sourceImage = tex.getSourceImage() as unknown as HTMLImageElement | HTMLCanvasElement;
    const srcW = (sourceImage as { width?: number }).width ?? FOSSIL_MAX_SIZE.w;
    const srcH = (sourceImage as { height?: number }).height ?? FOSSIL_MAX_SIZE.h;
    const fitted = this.fitFossilSize(srcW, srcH);
    this.fossilW = fitted.w;
    this.fossilH = fitted.h;

    const minX = FOSSIL_RECT.x + FOSSIL_MARGIN_PX;
    const maxX = FOSSIL_RECT.x + FOSSIL_RECT.w - FOSSIL_MARGIN_PX - this.fossilW;
    const minY = FOSSIL_RECT.y + FOSSIL_MARGIN_PX;
    const maxY = FOSSIL_RECT.y + FOSSIL_RECT.h - FOSSIL_MARGIN_PX - this.fossilH;
    const fx = Phaser.Math.RND.between(minX, Math.max(minX, maxX));
    const fy = Phaser.Math.RND.between(minY, Math.max(minY, maxY));

    if (this.fossilImage) this.fossilImage.destroy();
    this.fossilImage = this.add
      .image(fx, fy, this.shape.maskAssetKey)
      .setOrigin(0, 0)
      .setDisplaySize(this.fossilW, this.fossilH)
      .setDepth(1);

    this.fossilMask?.destroy();
    this.fossilMask = new FossilMask({
      image: sourceImage,
      x: fx - FOSSIL_RECT.x,
      y: fy - FOSSIL_RECT.y,
      width: this.fossilW,
      height: this.fossilH,
      nearBandPx: NEAR_BAND_PX,
    });
  }

  private createDirtTexture(): void {
    this.dirtRt = this.add
      .renderTexture(
        FOSSIL_RECT.x + FOSSIL_RECT.w / 2,
        FOSSIL_RECT.y + FOSSIL_RECT.h / 2,
        FOSSIL_RECT.w,
        FOSSIL_RECT.h,
      )
      .setDepth(50);
    this.paintDirt();
  }

  private paintDirt(): void {
    this.dirtRt.clear();
    if (this.textures.exists(DIRT_ASSET.key)) {
      const src = this.textures.get(DIRT_ASSET.key).getSourceImage() as {
        width: number;
        height: number;
      };
      const sw = src.width || FOSSIL_RECT.w;
      const sh = src.height || FOSSIL_RECT.h;
      this.dirtRt.stamp(DIRT_ASSET.key, undefined, 0, 0, {
        originX: 0,
        originY: 0,
        scaleX: FOSSIL_RECT.w / sw,
        scaleY: FOSSIL_RECT.h / sh,
      });
    } else {
      this.dirtRt.fill(DIRT_ASSET.fallback);
    }
    this.dirtRt.render();
  }

  private createAssistOverlay(): void {
    const enabled = SettingsStore.getKey('excavationAssist');
    this.assistImage = this.add
      .image(this.fossilImage.x, this.fossilImage.y, this.shape.maskAssetKey)
      .setOrigin(0, 0)
      .setDisplaySize(this.fossilW, this.fossilH)
      .setAlpha(ASSIST_ALPHA)
      .setDepth(60)
      .setVisible(enabled);
  }

  private createEraseStamp(): void {
    this.eraseStamp = this.add.circle(0, 0, ERASER_RADIUS.pick, 0xffffff).setVisible(false);
  }

  private computeCellCounts(): { phase1: number; phase2: number } {
    let near = 0;
    let on = 0;
    for (let row = 0; row < GRID_ROWS; row += 1) {
      const cy = row * CELL_H + CELL_H / 2;
      for (let col = 0; col < GRID_COLS; col += 1) {
        const cx = col * CELL_W + CELL_W / 2;
        const zone = this.fossilMask.zoneAt(cx, cy);
        if (zone === 'near') near += 1;
        else if (zone === 'on') on += 1;
      }
    }
    return { phase1: Math.max(1, near), phase2: Math.max(1, on) };
  }

  // -------- Input --------

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
    if (!this.isInsidePit(p.worldX, p.worldY)) return;
    this.isPressing = true;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
    this.applyAt(p.worldX, p.worldY);
  }

  private handlePointerMove(p: Phaser.Input.Pointer): void {
    if (!this.isPressing) return;
    if (this.model.status !== 'playing') return;
    if (!this.isInsidePit(p.worldX, p.worldY)) return;
    this.applyAt(p.worldX, p.worldY);
  }

  private handlePointerUp(): void {
    this.isPressing = false;
    this.wrongToolUsedThisPress = false;
    this.lastErasePoint = null;
  }

  private isInsidePit(x: number, y: number): boolean {
    return (
      x >= FOSSIL_RECT.x &&
      x <= FOSSIL_RECT.x + FOSSIL_RECT.w &&
      y >= FOSSIL_RECT.y &&
      y <= FOSSIL_RECT.y + FOSSIL_RECT.h
    );
  }

  private applyAt(worldX: number, worldY: number): void {
    const tool = this.model.selectedTool;
    const localX = worldX - FOSSIL_RECT.x;
    const localY = worldY - FOSSIL_RECT.y;
    const zone = this.fossilMask.zoneAt(localX, localY);

    if (this.isWrongToolForZone(tool, zone)) {
      this.playWrongFeedback();
      if (tool === 'pick' && zone === 'on' && !this.wrongToolUsedThisPress) {
        this.wrongToolUsedThisPress = true;
        this.model.damageOnce();
        this.emitState();
      }
      this.lastErasePoint = null;
      return;
    }

    this.eraseAt(worldX, worldY, tool);
  }

  /**
   * Combinación válida = pico/cincel en su zona durante fase 1, pincel en
   * `on` durante fase 2. Todo lo demás da feedback. El pico sobre el fósil
   * además resta vida (regla constante a través de fases).
   */
  private isWrongToolForZone(tool: Tool, zone: Zone): boolean {
    const phase = this.model.phase;
    if (phase === 1) {
      if (tool === 'pick') return zone !== 'far';
      if (tool === 'chisel') return zone !== 'near';
      return true; // pincel bloqueado en fase 1
    }
    // Fase 2: sólo pincel sobre fósil. Pico y cincel quedan inhábiles.
    if (tool === 'brush') return zone !== 'on';
    return true;
  }

  private playWrongFeedback(): void {
    const now = this.time.now;
    if (now - this.lastWrongSoundAt < WRONG_SOUND_DEBOUNCE_MS) return;
    this.lastWrongSoundAt = now;
    if (this.sound && this.cache.audio.exists(WRONG_SOUND_KEY)) {
      this.sound.play(WRONG_SOUND_KEY, { volume: SettingsStore.getKey('sfxVolume') });
    }
    this.cameras.main.shake(200, 0.004);
  }

  private eraseAt(worldX: number, worldY: number, tool: Tool): void {
    const radius = ERASER_RADIUS[tool];

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

    this.eraseStamp.setRadius(radius);
    const cellsForModel = new Set<number>();
    const reportZone: 'near' | 'on' | null =
      tool === 'chisel' ? 'near' : tool === 'brush' ? 'on' : null;
    for (const { x, y } of points) {
      const localX = x - FOSSIL_RECT.x;
      const localY = y - FOSSIL_RECT.y;
      this.eraseStamp.setPosition(localX, localY);
      this.dirtRt.erase(this.eraseStamp, 0, 0);
      if (reportZone) {
        this.collectCellsInCircle(x, y, radius, reportZone, cellsForModel);
      }
    }
    this.dirtRt.render();
    if (reportZone && cellsForModel.size > 0) {
      this.model.cleanCells(cellsForModel, reportZone);
    }
  }

  private collectCellsInCircle(
    worldX: number,
    worldY: number,
    radius: number,
    targetZone: 'near' | 'on',
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
        if (dx * dx + dy * dy > r2) continue;
        if (this.fossilMask.zoneAt(cx, cy) !== targetZone) continue;
        out.add(row * GRID_COLS + col);
      }
    }
  }

  // -------- Model integration --------

  private attachModelEvents(): void {
    this.model.on('progress', () => this.emitState());
    this.model.on('lives', () => this.emitState());
    this.model.on('time', () => this.emitState());
    this.model.on('toolChanged', () => this.emitState());
    this.model.on('phaseAdvanced', () => {
      // Al arrancar la fase 2, sugerimos el pincel automáticamente.
      this.model.selectTool('brush');
      this.lastErasePoint = null;
      this.emitState();
    });
    this.model.on('success', () => {
      this.dirtRt.setVisible(false);
      if (this.assistImage) this.assistImage.setVisible(false);
      this.succeed({
        variant: 'success',
        title: '¡Bien hecho!',
        body: `Has desenterrado un ${this.shape.displayName}.`,
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

  // -------- Cleanup --------

  private shutdownScene(): void {
    EventBus.off(EventKeys.ExcavationToolSelected, this.onToolSelected);
    this.input.removeAllListeners();
    this.fossilMask?.destroy();
    this.fossilImage?.destroy();
    this.assistImage?.destroy();
    this.assistImage = null;
    this.dirtRt?.destroy();
  }
}
