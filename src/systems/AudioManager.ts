import Phaser from 'phaser';
import { EventKeys } from '@/config/Constants';
import { EventBus } from './EventBus';
import { SettingsStore } from './SettingsStore';
import type { Settings } from '@/types';

export type AudioBus = 'music' | 'sfx' | 'narrator';

class AudioManagerClass {
  private game: Phaser.Game | null = null;
  private music: Phaser.Sound.BaseSound | null = null;

  attach(game: Phaser.Game): void {
    this.game = game;
    const s = SettingsStore.get();
    this.applyVolumes(s);
    EventBus.on(EventKeys.SettingsChanged, (next) => this.applyVolumes(next));
  }

  private applyVolumes(s: Settings): void {
    if (!this.game) return;
    this.game.sound.volume = s.sfxVolume;
    if (this.music && 'setVolume' in this.music) {
      (this.music as Phaser.Sound.WebAudioSound).setVolume(s.musicVolume);
    }
  }

  playMusic(key: string, opts: { loop?: boolean } = {}): void {
    if (!this.game) return;
    if (!this.game.cache.audio.exists(key)) return;
    this.stopMusic();
    this.music = this.game.sound.add(key, {
      loop: opts.loop ?? true,
      volume: SettingsStore.getKey('musicVolume'),
    });
    this.music.play();
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
      this.music = null;
    }
  }

  playSfx(key: string): void {
    if (!this.game || !this.game.cache.audio.exists(key)) return;
    this.game.sound.play(key, { volume: SettingsStore.getKey('sfxVolume') });
  }

  narratorVolume(): number {
    return SettingsStore.getKey('narratorVolume');
  }
}

export const AudioManager = new AudioManagerClass();
