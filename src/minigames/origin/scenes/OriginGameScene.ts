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

  private currentQuestion = 0;
  private correctAnswers = 0;
  private progressText!: Phaser.GameObjects.Text;
  private questionText!: Phaser.GameObjects.Text;
  private animalImage!: Phaser.GameObjects.Image;
  private hintContainer!: Phaser.GameObjects.Container;
  private hintText!: Phaser.GameObjects.Text;
  private norteamericaButtonId = "norteamerica-button";
  private sudamericaButtonId = "sudamerica-button";
  private imageFrameId = "image-frame";
  private infoButtonId = "info-button";

  private showQuestion() {
    const q = ORIGIN_QUIZ[this.currentQuestion];

    this.questionText.setText(q.prompt);
    this.animalImage.setTexture(q.id);
  }
  private updateProgress() {
    this.progressText.setText(
      `${this.correctAnswers}/${ORIGIN_QUIZ.length}`
    );
  }
  private showHint() {
    const q = ORIGIN_QUIZ[this.currentQuestion];

    this.hintText.setText(q.hint);
    this.hintContainer.setVisible(true);
  }

  private answer(isSouthAmerica: boolean) {
    const q = ORIGIN_QUIZ[this.currentQuestion];

    if (q.isSudamerican === isSouthAmerica) {

      this.correctAnswers++;
      this.updateProgress();

      this.currentQuestion++;

      if (this.currentQuestion === ORIGIN_QUIZ.length) {
        this.succeed({
          variant: 'success',
          title: '¡Excelente!',
          body: 'Completaste todas las preguntas.',
          primaryCta: { label: 'Volver a jugar', action: 'retry' },
          secondaryCta: { label: 'Volver a misiones', action: 'menu' },
        });
        this.currentQuestion = 0;
        this.correctAnswers = 0;
      } else {
        this.showQuestion();
      }

    } else {
      this.fail({
        variant: 'failure',
        title: '¡Oops!',
        body: `Esa no era. Realizaste ${this.currentQuestion}${this.currentQuestion == 1 ? ' respuesta correcta' : ' respuestas correctas'}. Probá de nuevo.`,
        primaryCta: { label: 'Intentar de nuevo', action: 'retry' },
        secondaryCta: { label: 'Volver a misiones', action: 'menu' },
      });

      this.currentQuestion = 0;
      this.correctAnswers = 0;
    }
  }

  preload() {
    this.load.image(this.imageFrameId, 'assets/ui/image-frame.png')
    ORIGIN_QUIZ.forEach((q) => {
      this.load.image(q.id, q.imageKey);
    });
    this.load.image(this.sudamericaButtonId, 'assets/ui/button-sudamerica.png');
    this.load.image(this.norteamericaButtonId, 'assets/ui/button-norteamerica.png');
    this.load.image(this.infoButtonId, 'assets/ui/boton_info.png');
  }

  create(): void {
    const palette = Palettes[SettingsStore.getKey('colorBlindMode')];
    this.cameras.main.setBackgroundColor(palette.background);

    const cx = GameSize.width / 2;


    this.progressText = this.add
      .text(cx, 150,
        `${this.correctAnswers}/${ORIGIN_QUIZ.length}`,
        {
          fontFamily: 'Darumadrop One, Georgia, serif',
          fontSize: '48px',
          color: `#${palette.accent.toString(16).padStart(6, '0')}`,
          align: 'center',
        })
      .setOrigin(0.5);

    this.questionText = this.add
      .text(cx, 220, '', {
        fontFamily: 'Darumadrop One, Georgia, serif',
        fontSize: '36px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5);


    this.add.image(cx, 550, this.imageFrameId).setScale(0.85);
    this.animalImage = this.add.image(cx, 550, '').setScale(0.45);

    const hintButton = this.add.image(GameSize.width - 50, 280, this.infoButtonId)
      .setScale(0.1)
      .setInteractive();

    // , {
    //   fontFamily: 'Darumadrop One, Georgia, serif',
    //   fontSize: '42px',
    //   color: `#${palette.accent.toString(16).padStart(6, '0')}`,
    //   align: 'center',
    // })
    // .setInteractive();

    hintButton.on('pointerdown', () => {
      this.showHint();
    });

    hintButton.on('pointerover', () => {
      this.tweens.add({
        targets: hintButton,
        scale: 0.12,
        duration: 100
      });
    });
    hintButton.on('pointerout', () => {
      this.tweens.add({
        targets: hintButton,
        scale: 0.1,
        duration: 100
      });
    });

    const iy = 950
    const norteamericaButton = this.add
      .image(cx, iy, this.norteamericaButtonId)
      .setScale(0.85)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.answer(false)
      });
    norteamericaButton.on('pointerover', () => {
      this.tweens.add({
        targets: norteamericaButton,
        scale: 0.90,
        duration: 100
      });
    });
    norteamericaButton.on('pointerout', () => {
      this.tweens.add({
        targets: norteamericaButton,
        scale: 0.85,
        duration: 100
      });
    });
    norteamericaButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      norteamericaButton.setTint(0xb0b0b0);
    });

    norteamericaButton.on(Phaser.Input.Events.POINTER_UP, () => {
      norteamericaButton.clearTint();
    });

    norteamericaButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      norteamericaButton.clearTint();
    });

    const sudamericaButton = this.add
      .image(cx, iy + 150, this.sudamericaButtonId)
      .setScale(0.85)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.answer(true)
      });
    sudamericaButton.on('pointerover', () => {
      this.tweens.add({
        targets: sudamericaButton,
        scale: 0.90,
        duration: 100
      });
    });
    sudamericaButton.on('pointerout', () => {
      this.tweens.add({
        targets: sudamericaButton,
        scale: 0.85,
        duration: 100
      });
    });
    sudamericaButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      sudamericaButton.setTint(0xb0b0b0);
    });

    sudamericaButton.on(Phaser.Input.Events.POINTER_UP, () => {
      sudamericaButton.clearTint();
    });

    sudamericaButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      sudamericaButton.clearTint();
    });
    // Mostrar la primera pregunta
    this.showQuestion();

    const overlay = this.add
      .rectangle(
        GameSize.width / 2,
        GameSize.height / 2,
        GameSize.width,
        GameSize.height,
        0x000000,
        0.5
      )
      .setInteractive();

    const panel = this.add
      .rectangle(
        GameSize.width / 2,
        GameSize.height / 2,
        700,
        350,
        palette.background
      )
      .setStrokeStyle(4, palette.panelBorder);

    this.hintText = this.add
      .text(GameSize.width / 2, GameSize.height / 2 - 30, '', {
        fontFamily: 'Bubblegum Sans',
        fontSize: '28px',
        color: `#${palette.accent.toString(16).padStart(6, '0')}`,
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    const closeButton = this.add
      .text(GameSize.width / 2, GameSize.height / 2 + 120, 'Cerrar', {
        fontFamily: 'Bubblegum Sans',
        fontSize: '30px',
        color: `#${palette.background.toString(16).padStart(6, '0')}`,
        backgroundColor: '#8B5E3C',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    closeButton.on('pointerdown', () => {
      this.hintContainer.setVisible(false);
    });

    this.hintContainer = this.add.container(0, 0, [
      overlay,
      panel,
      this.hintText,
      closeButton,
    ]);

    this.hintContainer.setVisible(false);
  }
}
