import Phaser from 'phaser';
import { GameSize, SceneKeys } from '@/config/Constants';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { Palettes } from '@/config/Palettes';
import { SettingsStore } from '@/systems/SettingsStore';
import { ORIGIN_QUIZ } from '@/data/quizzes';

export class OriginGameScene extends MinigameSceneBase {
  constructor() {
    super(SceneKeys.MinigameOrigin);
  }

  create(): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);
    const cx = GameSize.width / 2;
    const q = ORIGIN_QUIZ[0]!;
    this.add
      .text(cx, 220, q.prompt, {
        fontFamily: 'Berkshire Swash, Georgia, serif',
        fontSize: '32px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
        align: 'center',
        wordWrap: { width: GameSize.width - 120, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    q.options.forEach((opt, i) => {
      const y = 500 + i * 160;
      const rect = this.add
        .rectangle(cx, y, 460, 96, palette.accent)
        .setStrokeStyle(4, palette.panelBorder)
        .setInteractive();
      this.add
        .text(cx, y, opt.label, {
          fontFamily: 'Atkinson Hyperlegible, Inter, sans-serif',
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
      rect.on(Phaser.Input.Events.POINTER_DOWN, () => {
        if (opt.correct) {
          this.succeed({
            variant: 'success',
            title: '¡Bien hecho!',
            body: '¡Acertaste el origen!',
            primaryCta: { label: 'Avanzar', action: 'next' },
            secondaryCta: { label: 'Volver a jugar', action: 'retry' },
          });
        } else {
          this.fail({
            variant: 'failure',
            title: '¡Oops!',
            body: 'Esa no era. Probá de nuevo.',
            primaryCta: { label: 'Intentar de nuevo', action: 'retry' },
            secondaryCta: { label: 'Volver a misiones', action: 'menu' },
          });
        }
      });
    });
  }
}
