import Phaser from 'phaser';
import { EventKeys, GameSize } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { Palettes } from '@/config/Palettes';
import { SettingsStore } from '@/systems/SettingsStore';
import { SearchModel } from '../SearchModel';
import type { HiddenObject, SearchSceneDef } from '../types';

/**
 * Common logic for the 3 search scenes. Concrete scenes only declare their
 * SceneKey + the SearchSceneDef they own and call `super(sceneKey, def)`.
 */
export abstract class SearchSceneBase extends MinigameSceneBase {
  protected model!: SearchModel;
  protected sceneDef: SearchSceneDef;
  private placeholders = new Map<string, Phaser.GameObjects.Container>();
  private hintGfx?: Phaser.GameObjects.Arc;

  constructor(sceneKey: string, sceneDef: SearchSceneDef) {
    super(sceneKey);
    this.sceneDef = sceneDef;
  }

  create(): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);

    this.model = new SearchModel(this.sceneDef);

    this.drawBackgroundPlaceholder(palette);
    this.drawObjectPlaceholders(palette);

    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);

    this.model.on<HiddenObject>('found', this.onFound);
    this.model.on('missed', this.onMissed);
    this.model.on<HiddenObject>('hintUsed', this.onHint);
    this.model.on('success', this.onSuccess);

    this.exposeModel();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.teardown, this);

    EventBus.on(EventKeys.SearchHintRequested, this.onHintRequested);

    this.model.start();
    this.exposeModel();
  }

  protected override restartGame(): void {
    this.model.reset();
    this.placeholders.forEach((c) => {
      c.setAlpha(1);
      const tick = c.getByName('tick') as Phaser.GameObjects.Text | null;
      tick?.setVisible(false);
    });
    this.model.start();
    this.exposeModel();
  }

  private onHintRequested = (): void => {
    this.showHint();
  };

  /** Public for HintButton: returns true if a hint was actually shown.
   * The pulse itself runs via the model's `hintUsed` event listener, so we
   * don't call `pulseHint()` here — avoids a double-pulse race. */
  showHint(): boolean {
    const obj = this.model.useHint();
    if (!obj) return false;
    this.exposeModel();
    return true;
  }

  private exposeModel(): void {
    EventBus.emit(EventKeys.SearchModelReady, this.model.state);
  }

  private onPointerDown = (pointer: Phaser.Input.Pointer): void => {
    if (this.model.status !== 'playing') return;
    this.model.tryHit(pointer.worldX, pointer.worldY);
    this.exposeModel();
  };

  private onFound = (obj: HiddenObject): void => {
    const container = this.placeholders.get(obj.id);
    if (container) {
      const tick = container.getByName('tick') as Phaser.GameObjects.Text | null;
      tick?.setVisible(true);
      this.tweens.add({
        targets: container,
        alpha: 0.3,
        duration: 250,
      });
    }
    EventBus.emit(EventKeys.SearchObjectFound, obj);
  };

  private onMissed = (): void => {
    this.cameras.main.shake(120, 0.004);
  };

  private onHint = (obj: HiddenObject): void => {
    this.pulseHint(obj);
  };

  private onSuccess = (): void => {
    this.time.delayedCall(800, () => {
      this.succeed({
        variant: 'success',
        title: '¡Bien hecho!',
        body: `Encontraste todo en el ${this.sceneDef.title.toLowerCase()}.`,
        primaryCta: { label: 'Continuar', action: 'next' },
      });
    });
  };

  private pulseHint(obj: HiddenObject): void {
    const { x, y, w, h } = obj.hitbox;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.max(w, h) / 1.5;

    this.hintGfx?.destroy();
    this.hintGfx = this.add
      .circle(cx, cy, radius, 0xffd166, 0.35)
      .setStrokeStyle(5, 0xff9933)
      .setDepth(50);
    this.tweens.add({
      targets: this.hintGfx,
      alpha: { from: 0.85, to: 0 },
      scale: { from: 1, to: 1.5 },
      duration: 700,
      yoyo: false,
      repeat: 2,
      onComplete: () => {
        this.hintGfx?.destroy();
        this.hintGfx = undefined;
      },
    });
  }

  private drawBackgroundPlaceholder(palette: { panel: number; panelBorder: number; textSecondary: number }): void {
    const bgY = 360;
    this.add
      .rectangle(GameSize.width / 2, (bgY + GameSize.height) / 2, GameSize.width - 24, GameSize.height - bgY - 24, palette.panel)
      .setStrokeStyle(2, palette.panelBorder);
    this.add
      .text(GameSize.width / 2, bgY + 20, `[Placeholder] ${this.sceneDef.title}`, {
        fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
        fontSize: '18px',
        color: `#${palette.textSecondary.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5, 0);
  }

  private drawObjectPlaceholders(palette: { accent: number }): void {
    for (const obj of this.sceneDef.objects) {
      const { x, y, w, h } = obj.hitbox;
      const container = this.add.container(0, 0);
      const rect = this.add
        .rectangle(x + w / 2, y + h / 2, w, h, palette.accent, 0.35)
        .setStrokeStyle(2, palette.accent);
      const label = this.add
        .text(x + w / 2, y + h / 2, obj.name, {
          fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
          fontSize: '14px',
          color: '#ffffff',
          align: 'center',
        })
        .setOrigin(0.5);
      const tick = this.add
        .text(x + w - 12, y + 12, '✓', {
          fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
          fontSize: '24px',
          color: '#22c55e',
        })
        .setOrigin(1, 0)
        .setVisible(false);
      tick.setName('tick');
      container.add([rect, label, tick]);
      this.placeholders.set(obj.id, container);
    }
  }

  private teardown(): void {
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.model.off('found', this.onFound);
    this.model.off('missed', this.onMissed);
    this.model.off('hintUsed', this.onHint);
    this.model.off('success', this.onSuccess);
    EventBus.off(EventKeys.SearchHintRequested, this.onHintRequested);
    this.placeholders.clear();
    this.hintGfx?.destroy();
    this.hintGfx = undefined;
  }
}
