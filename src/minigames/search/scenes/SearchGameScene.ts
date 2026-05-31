import Phaser from 'phaser';
import { GameSize, SceneKeys } from '@/config/Constants';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { Palettes } from '@/config/Palettes';
import { SettingsStore } from '@/systems/SettingsStore';

const TOTAL = 5;

export class SearchGameScene extends MinigameSceneBase {
  private found = 0;
  private counter!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.MinigameSearch);
  }

  create(): void {
    this.found = 0;
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);
    const cx = GameSize.width / 2;
    this.add
      .text(cx, 200, 'Minijuego búsqueda', {
        fontFamily: 'Darumadrop One, Georgia, serif',
        fontSize: '40px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);
    this.counter = this.add
      .text(cx, 300, `${this.found} / ${TOTAL}`, {
        fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
        fontSize: '36px',
        color: `#${palette.textPrimary.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);

    const rect = this.add
      .rectangle(cx, GameSize.height - 240, 520, 80, palette.accent)
      .setStrokeStyle(4, palette.panelBorder)
      .setInteractive();
    this.add
      .text(cx, GameSize.height - 240, '[DEMO] Encontrar una herramienta', {
        fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    rect.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.found = Math.min(TOTAL, this.found + 1);
      this.counter.setText(`${this.found} / ${TOTAL}`);
      if (this.found >= TOTAL) {
        this.succeed({
          variant: 'success',
          title: '¡Bien hecho!',
          body: 'Encontraste las 5 herramientas.',
          primaryCta: { label: 'Avanzar', action: 'next' },
        });
      }
    });
  }
}
