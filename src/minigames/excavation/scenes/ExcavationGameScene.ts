import Phaser from 'phaser';
import { GameSize, SceneKeys } from '@/config/Constants';
import { MinigameSceneBase } from '@/phaser/MinigameSceneBase';
import { ExcavationModel } from '@/minigames/excavation/ExcavationModel';
import { SettingsStore } from '@/systems/SettingsStore';
import { Palettes } from '@/config/Palettes';

export class ExcavationGameScene extends MinigameSceneBase {
  private model!: ExcavationModel;

  constructor() {
    super(SceneKeys.MinigameExcavation);
  }

  create(): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);

    const cx = GameSize.width / 2;
    this.add
      .text(cx, 220, 'Desenterrar la historia', {
        fontFamily: 'Berkshire Swash, Georgia, serif',
        fontSize: '42px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
        align: 'center',
      })
      .setOrigin(0.5);
    this.add
      .text(cx, 280, 'Excavación (stub)', {
        fontFamily: 'Atkinson Hyperlegible, Inter, sans-serif',
        fontSize: '24px',
        color: `#${palette.textSecondary.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);

    this.model = new ExcavationModel({
      timeLimitSec: SettingsStore.getKey('noTimeMode') ? null : 120,
    });

    // Demo buttons to exercise the result modal flow from React.
    this.makeButton(cx, 700, 'Usar pincel (correcto)', () => this.model.uncover());
    this.makeButton(cx, 800, 'Usar martillo (incorrecto)', () => this.model.damageFossil());
    this.makeButton(cx, 900, '[DEMO] Ganar minijuego', () => this.model.win());

    this.model.on('success', () =>
      this.succeed({
        variant: 'success',
        title: '¡Bien hecho!',
        body: 'Has logrado desenterrar un fósil con éxito.',
        primaryCta: { label: 'Avanzar', action: 'next' },
        secondaryCta: { label: 'Volver a jugar', action: 'retry' },
      }),
    );
    this.model.on('failure', () =>
      this.fail({
        variant: 'failure',
        title: '¡Oops!',
        body: 'Se ha roto el fósil…',
        primaryCta: { label: 'Intentar de nuevo', action: 'retry' },
        secondaryCta: { label: 'Volver a misiones', action: 'menu' },
      }),
    );

    this.model.start();
  }

  override update(_time: number, deltaMs: number): void {
    this.model?.tick(deltaMs / 1000);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    const w = 480;
    const h = 80;
    const rect = this.add
      .rectangle(x, y, w, h, palette.accent)
      .setStrokeStyle(4, palette.panelBorder)
      .setInteractive();
    this.add
      .text(x, y, label, {
        fontFamily: 'Atkinson Hyperlegible, Inter, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    rect.on(Phaser.Input.Events.POINTER_DOWN, onClick);
  }
}
