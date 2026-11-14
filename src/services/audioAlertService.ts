/**
 * ASTRA - Aerospace Audio Alert & Emergency Siren Service
 * Uses the Web Audio API to synthesize authentic spacecraft caution and warning klaxons,
 * alarms, and emergency sirens completely offline without external audio files.
 */

export type AlertSeverity = "CRITICAL" | "CAUTION" | "INFO";

export interface ActiveAlert {
  id: string;
  source: string; // e.g. "AquaGuard", "Radiation", "CabinEnvironment", "VitalTelemetry"
  title: string;
  reason: string;
  severity: AlertSeverity;
  timestamp: string;
}

type AlertListener = (alerts: ActiveAlert[], isSounding: boolean, isMuted: boolean) => void;

class AudioAlertManager {
  private audioCtx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isSounding: boolean = false;
  private isMuted: boolean = false;
  private activeAlerts: Map<string, ActiveAlert> = new Map();
  private listeners: Set<AlertListener> = new Set();
  private pulseTimer: number | null = null;

  private initAudio() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  private notify() {
    const alerts = Array.from(this.activeAlerts.values());
    this.listeners.forEach((listener) => {
      try {
        listener(alerts, this.isSounding, this.isMuted);
      } catch (e) {
        console.error("Alert listener error:", e);
      }
    });
  }

  /**
   * Registers a new or existing alert. If severity is CRITICAL or CAUTION, triggers the siren.
   */
  public triggerAlert(alert: ActiveAlert) {
    this.activeAlerts.set(alert.id, alert);
    if (!this.isMuted && (alert.severity === "CRITICAL" || alert.severity === "CAUTION")) {
      this.startSirenSound(alert.severity);
    }
    this.notify();
  }

  /**
   * Clears an alert by its ID. If no critical alerts remain, stops the siren.
   */
  public clearAlert(id: string) {
    this.activeAlerts.delete(id);
    const hasRemainingCritical = Array.from(this.activeAlerts.values()).some(
      (a) => a.severity === "CRITICAL" || a.severity === "CAUTION",
    );
    if (!hasRemainingCritical) {
      this.stopSirenSound();
    }
    this.notify();
  }

  /**
   * Clears all alerts from a specific source (e.g. "AquaGuard").
   */
  public clearAlertsBySource(source: string) {
    for (const [id, alert] of this.activeAlerts.entries()) {
      if (alert.source === source) {
        this.activeAlerts.delete(id);
      }
    }
    const hasRemainingCritical = Array.from(this.activeAlerts.values()).some(
      (a) => a.severity === "CRITICAL" || a.severity === "CAUTION",
    );
    if (!hasRemainingCritical) {
      this.stopSirenSound();
    }
    this.notify();
  }

  /**
   * Synthesizes the authentic aerospace siren sound using Web Audio oscillators.
   */
  private startSirenSound(severity: AlertSeverity = "CRITICAL") {
    if (this.isSounding) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;

      // Master gain for smooth volume control
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      // Gentle ramp-up to prevent click
      this.masterGain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      this.masterGain.connect(this.audioCtx.destination);

      if (severity === "CRITICAL") {
        // Dual-tone frequency-modulated emergency klaxon (880Hz / 660Hz alternating)
        this.sirenOsc1 = this.audioCtx.createOscillator();
        this.sirenOsc1.type = "sawtooth";
        this.sirenOsc1.frequency.setValueAtTime(750, now);

        // LFO modulates the frequency between 700Hz and 1050Hz for authentic spacecraft klaxon
        this.lfo = this.audioCtx.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.setValueAtTime(2.5, now); // 2.5 Hz sweep

        this.lfoGain = this.audioCtx.createGain();
        this.lfoGain.gain.setValueAtTime(220, now);

        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.sirenOsc1.frequency);

        this.sirenOsc1.connect(this.masterGain);
        this.lfo.start(now);
        this.sirenOsc1.start(now);
      } else {
        // Caution chime: pulsing square/triangle tone
        this.sirenOsc1 = this.audioCtx.createOscillator();
        this.sirenOsc1.type = "triangle";
        this.sirenOsc1.frequency.setValueAtTime(587.33, now); // D5

        this.sirenOsc2 = this.audioCtx.createOscillator();
        this.sirenOsc2.type = "sine";
        this.sirenOsc2.frequency.setValueAtTime(880, now); // A5

        this.sirenOsc1.connect(this.masterGain);
        this.sirenOsc2.connect(this.masterGain);
        this.sirenOsc1.start(now);
        this.sirenOsc2.start(now);
      }

      this.isSounding = true;
    } catch (e) {
      console.warn("AudioContext playback blocked or failed:", e);
    }
  }

  /**
   * Immediately silences the audible siren sound.
   */
  public silenceAlarm() {
    this.stopSirenSound();
    this.isMuted = true;
    this.notify();
  }

  /**
   * Stops the active audio oscillators.
   */
  public stopSirenSound() {
    if (!this.isSounding) return;
    if (this.masterGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      } catch {}
    }

    setTimeout(() => {
      try {
        this.sirenOsc1?.stop();
        this.sirenOsc1?.disconnect();
        this.sirenOsc2?.stop();
        this.sirenOsc2?.disconnect();
        this.lfo?.stop();
        this.lfo?.disconnect();
        this.lfoGain?.disconnect();
        this.masterGain?.disconnect();
      } catch {}

      this.sirenOsc1 = null;
      this.sirenOsc2 = null;
      this.lfo = null;
      this.lfoGain = null;
      this.masterGain = null;
      this.isSounding = false;
      this.notify();
    }, 100);
  }

  /**
   * Plays a 3-second test blast of the emergency siren.
   */
  public testSiren() {
    this.isMuted = false;
    this.startSirenSound("CRITICAL");
    this.notify();
    setTimeout(() => {
      this.stopSirenSound();
    }, 3200);
  }

  /**
   * Unmutes alerts so subsequent critical events sound the siren.
   */
  public unmute() {
    this.isMuted = false;
    // If there is currently an active critical alert, start sound
    const hasCritical = Array.from(this.activeAlerts.values()).some(
      (a) => a.severity === "CRITICAL",
    );
    if (hasCritical) {
      this.startSirenSound("CRITICAL");
    }
    this.notify();
  }

  public getActiveAlerts(): ActiveAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  public getIsSounding(): boolean {
    return this.isSounding;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(listener: AlertListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener(Array.from(this.activeAlerts.values()), this.isSounding, this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const audioAlertService = new AudioAlertManager();
