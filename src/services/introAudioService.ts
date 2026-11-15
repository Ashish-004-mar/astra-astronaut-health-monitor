/**
 * ASTRA Intro Voice Announcement Service
 * Plays high-clarity audible speech:
 * "Hi! This is ASTRA, an astronaut health monitoring system."
 * Accompanied by a futuristic harmonic wake chime via Web Audio API.
 * Complies with Chrome/W3C Autoplay Policy to prevent AudioContext console warnings.
 */

class IntroAudioService {
  private hasSpoken = false;
  private audioCtx: AudioContext | null = null;
  private lastSpokenTime = 0;
  private userInteracted = false;
  private greetingQueued = false;

  constructor() {
    if (typeof window !== "undefined") {
      const onUserGesture = () => {
        this.markUserInteracted();
      };
      window.addEventListener("pointerdown", onUserGesture, { capture: true, passive: true });
      window.addEventListener("keydown", onUserGesture, { capture: true, passive: true });
      window.addEventListener("touchstart", onUserGesture, { capture: true, passive: true });
      window.addEventListener("click", onUserGesture, { capture: true, passive: true });
    }
  }

  public markUserInteracted(): void {
    this.userInteracted = true;
    if (this.greetingQueued) {
      this.greetingQueued = false;
      this.playGreeting(true);
    }
  }

  private canPlayAudio(): boolean {
    if (typeof window === "undefined") return false;
    // Check modern standard User Activation API
    if (
      "userActivation" in navigator &&
      (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation
    ) {
      return Boolean(
        (navigator as unknown as { userActivation: { hasBeenActive: boolean } }).userActivation
          .hasBeenActive
      );
    }
    return this.userInteracted;
  }

  private initAudio(): boolean {
    // Strictly prevent instantiating AudioContext before user activation to avoid Chrome autoplay warnings
    if (!this.canPlayAudio()) {
      return false;
    }
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.audioCtx = new AudioCtx();
        } catch {
          return false;
        }
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return Boolean(this.audioCtx);
  }

  private playSciFiChime() {
    try {
      if (!this.initAudio()) return;
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Futuristic dual-tone harmonic chime (C5 -> G5 -> C6)
      const freqs = [523.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch {
      // Audio context safety
    }
  }

  /**
   * Speaks: "Hi! This is ASTRA, an astronaut health monitoring system."
   * Plays with maximum volume (volume = 1.0) and optimal pacing.
   * If force = true, ignores debounce.
   */
  public playGreeting(force = false) {
    if (typeof window === "undefined") return;

    // If browser autoplay policy prevents audio because user hasn't gestured yet,
    // queue greeting to play on the very first user gesture without throwing warnings.
    if (!this.canPlayAudio()) {
      this.greetingQueued = true;
      return;
    }

    const now = Date.now();
    // Prevent overlapping if called multiple times within 3.5 seconds unless forced
    if (!force && now - this.lastSpokenTime < 3500) {
      return;
    }
    this.lastSpokenTime = now;
    this.hasSpoken = true;

    // 1. Play futuristic aerospace chime
    this.playSciFiChime();

    // 2. Play Web Speech Synthesis
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();

      const text = "Hi! This is ASTRA, an astronaut health monitoring system.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0; // 100% Loud
      utterance.rate = 0.95; // Clear, natural, confident pacing
      utterance.pitch = 1.04; // Friendly, intelligent AI assistant pitch
      utterance.lang = "en-US";

      // Select highest quality voice available on the user's OS
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const bestVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Natural") ||
                v.name.includes("Samantha") ||
                v.name.includes("Google") ||
                v.name.includes("Zira") ||
                v.name.includes("Jenny") ||
                v.name.includes("Victoria") ||
                v.name.includes("David")),
          ) || voices.find((v) => v.lang.startsWith("en"));

        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis safety
    }
  }

  public reset() {
    this.hasSpoken = false;
    this.lastSpokenTime = 0;
    this.greetingQueued = false;
  }
}

export const introAudioService = new IntroAudioService();
