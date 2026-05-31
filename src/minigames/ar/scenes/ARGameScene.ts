import Phaser from 'phaser';
import { GameSize, SceneKeys } from '@/config/Constants';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { Palettes } from '@/config/Palettes';
import { SettingsStore } from '@/systems/SettingsStore';

export class ARGameScene extends MinigameSceneBase {
  constructor() {
    super(SceneKeys.MinigameAR);
  }

  create(): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);
    const cx = GameSize.width / 2;
    this.add
      .text(cx, 220, 'Minijuego AR', {
        fontFamily: 'Darumadrop One, Georgia, serif',
        fontSize: '40px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);
    this.add
      .rectangle(cx, GameSize.height / 2, GameSize.width - 120, 600, palette.panelBorder, 0.2)
      .setStrokeStyle(4, palette.panelBorder);
    this.add
      .text(cx, GameSize.height / 2, '(Cámara — stub)', {
        fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
        fontSize: '22px',
        color: `#${palette.textSecondary.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);

    const rect = this.add
      .rectangle(cx, GameSize.height - 240, 480, 80, palette.accent)
      .setStrokeStyle(4, palette.panelBorder)
      .setInteractive();
    this.add
      .text(cx, GameSize.height - 240, 'Identificar', {
        fontFamily: 'Bubblegum Sans, Atkinson Hyperlegible, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    rect.on(Phaser.Input.Events.POINTER_DOWN, () =>
      this.succeed({
        variant: 'success',
        title: '¡Bien hecho!',
        body: 'Identificaste un gliptodonte correctamente.',
        primaryCta: { label: 'Avanzar', action: 'next' },
        secondaryCta: { label: 'Volver a jugar', action: 'retry' },
      }),
    );
  }
}
