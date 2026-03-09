const TRACKS = [
  "/Assets/music/Compressed/BackgroundMusic1.ogg",
  "/Assets/music/Compressed/BackgroundMusic2.ogg",
  "/Assets/music/Compressed/BackgroundMusic3.ogg",
];

const VOLUME = 0.35;

class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private playlist: string[] = [];
  private index = 0;
  private enabled = true;

  /** Start playing music. Shuffles the playlist. */
  play(): void {
    if (!this.enabled) return;
    this.playlist = this.shuffle(TRACKS);
    this.index = 0;
    this.playTrack();
  }

  /** Pause playback. */
  pause(): void {
    this.audio?.pause();
  }

  /** Resume playback. */
  resume(): void {
    if (!this.enabled || !this.audio) return;
    this.audio.play().catch(() => {});
  }

  /** Stop and destroy the player. */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.removeEventListener("ended", this.handleEnded);
      this.audio = null;
    }
  }

  /** Toggle music on/off. Returns the new enabled state. */
  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.play();
    } else {
      this.stop();
    }
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // ─── Internals ───

  private playTrack(): void {
    if (this.playlist.length === 0) return;
    this.stop();
    const src = this.playlist[this.index % this.playlist.length]!;
    const audio = new Audio(src);
    audio.volume = VOLUME;
    audio.addEventListener("ended", this.handleEnded);
    this.audio = audio;
    audio.play().catch(() => {});
  }

  private handleEnded = (): void => {
    this.index++;
    if (this.index >= this.playlist.length) {
      this.playlist = this.shuffle(TRACKS);
      this.index = 0;
    }
    this.playTrack();
  };

  private shuffle(arr: string[]): string[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }
}

export const musicManager = new MusicManager();
