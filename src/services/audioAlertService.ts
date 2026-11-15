/**
 * ASTRA - Aerospace Audio Alert & Emergency Siren Service
 * Synthesizes authentic spacecraft caution and warning klaxons,
 * alarms, and emergency sirens completely offline using Web Audio API,
 * paired with synchronized voice caution warnings ("Caution. [Hazard Name]")
 * via Web Speech synthesis.
 */

export type AlertSeverity = "CRITICAL" | "CAUTION" | "INFO";

export interface ActiveAlert {
  id: string;
  source: string; // e.g. "AquaGuard", "CabinEnvironment", "Radiation", "VitalTelemetry"
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

  private voiceTimer: ReturnType<typeof setTimeout> | null = null;
  private pulseInterval: ReturnType<typeof setInterval> | null = null;
  private pulseTimeout: ReturnType<typeof setTimeout> | null = null;
  private isSpeakingAlert: boolean = false;
  private lastSpokenAlertId: string | null = null;

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
   * Registers a new or existing alert.
   * If severity is CRITICAL or CAUTION:
   * 1. Plays audible emergency siren klaxon blast (~1.4s)
   * 2. Pauses siren
   * 3. Speaks: "Caution! [Hazard Name]. [Hazard Reason]"
   * 4. Resumes periodic warning pulse until silenced.
   */
  public triggerAlert(alert: ActiveAlert) {
    this.activeAlerts.set(alert.id, alert);
    if (!this.isMuted && (alert.severity === "CRITICAL" || alert.severity === "CAUTION")) {
      this.playSirenWithVoice(alert, false);
    }
    this.notify();
  }

  /**
   * Clears an alert by its ID. If no critical alerts remain, stops siren and voice.
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
   * Clears all alerts from a specific source (e.g. "AquaGuard", "CabinEnvironment").
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
   * Orchestrates the siren -> pause -> "Caution" voice announcement -> hazard details sequence.
   */
  private playSirenWithVoice(alert: ActiveAlert, isTest = false) {
    this.clearVoiceTimers();

    // 1. Start siren klaxon sound
    this.startSirenSound(alert.severity);

    // 2. After 1.4s of siren sound, pause siren to speak "Caution" + hazard name
    this.voiceTimer = setTimeout(() => {
      // Pause siren volume for clear voice intelligibility
      this.pauseSirenSound();

      // 3. Announce "Caution. [Hazard Name]..."
      this.speakCautionAnnouncement(alert, isTest, () => {
        // 4. After voice announcement completes
        if (!this.isMuted && this.activeAlerts.has(alert.id) && !isTest) {
          // If hazard is still active, resume periodic warning chime pulses
          this.startPulsingSiren(alert.severity);
        } else if (isTest) {
          this.stopSirenSound();
        }
      });
    }, 1400);
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

      // Master gain for volume control
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.24, now + 0.1);
      this.masterGain.connect(this.audioCtx.destination);

      if (severity === "CRITICAL") {
        // Dual-tone frequency-modulated emergency klaxon (750Hz - 1050Hz sweep)
        this.sirenOsc1 = this.audioCtx.createOscillator();
        this.sirenOsc1.type = "sawtooth";
        this.sirenOsc1.frequency.setValueAtTime(750, now);

        this.lfo = this.audioCtx.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.setValueAtTime(2.6, now);

        this.lfoGain = this.audioCtx.createGain();
        this.lfoGain.gain.setValueAtTime(220, now);

        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.sirenOsc1.frequency);

        this.sirenOsc1.connect(this.masterGain);
        this.lfo.start(now);
        this.sirenOsc1.start(now);
      } else {
        // Caution chime: pulsing square & triangle tone
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
   * Pauses siren by ducking gain to 0 during speech announcement.
   */
  private pauseSirenSound() {
    if (this.masterGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch {}
    }
  }

  /**
   * Resumes siren sound smoothly.
   */
  private resumeSirenSound(targetVolume = 0.2) {
    if (this.masterGain && this.audioCtx && this.isSounding) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(0.0001, now);
        this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + 0.08);
      } catch {}
    }
  }

  /**
   * Resumes periodic warning pulse chime (1.2s tone every 3.6s) to maintain awareness.
   */
  private startPulsingSiren(severity: AlertSeverity) {
    this.clearPulseInterval();
    if (!this.isSounding || this.isMuted) return;

    const pulseCycle = () => {
      if (!this.isSounding || this.isMuted) {
        this.clearPulseInterval();
        return;
      }
      this.resumeSirenSound(severity === "CRITICAL" ? 0.2 : 0.14);
      this.pulseTimeout = setTimeout(() => {
        if (!this.isSounding || this.isMuted) return;
        this.pauseSirenSound();
      }, 1200);
    };

    pulseCycle();
    this.pulseInterval = setInterval(pulseCycle, 3600);
  }

  /**
   * Speaks: "Caution. [Hazard Name]. [Hazard Reason]" using SpeechSynthesis.
   */
  private speakCautionAnnouncement(
    alert: ActiveAlert,
    isTest = false,
    onDone?: () => void,
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onDone?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      this.isSpeakingAlert = true;
      this.lastSpokenAlertId = alert.id;

      // Clean acronyms for natural aerospace pronunciation
      let hazardTitle = alert.title
        .replace(/🚨|⚠️|\[.*?\]/g, "")
        .replace(/ECLSS/g, "E-class life support")
        .replace(/TOC/g, "Total Organic Carbon")
        .replace(/PWD/g, "Potable Water Dispenser")
        .replace(/CO2|CO₂/g, "carbon dioxide")
        .replace(/ppb/gi, "parts per billion")
        .replace(/ppm/gi, "parts per million")
        .trim();

      let hazardReason = alert.reason
        .replace(/TOC/g, "Total Organic Carbon")
        .replace(/PWD/g, "Potable Water Dispenser")
        .replace(/CO2|CO₂/g, "carbon dioxide")
        .trim();

      if (isTest) {
        hazardTitle = "Spacecraft audio alert system test";
        hazardReason = "Emergency klaxon and vocal alert subsystem operational.";
      }

      // Exact prompt requested: "Caution" + hazard announcement
      const spokenText = `Caution. ${hazardTitle}. ${hazardReason}`;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Zira") ||
              v.name.includes("Samantha") ||
              v.name.includes("Jenny") ||
              v.name.includes("Google US English") ||
              v.name.includes("David")),
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        this.isSpeakingAlert = false;
        onDone?.();
      };

      utterance.onerror = () => {
        this.isSpeakingAlert = false;
        onDone?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeakingAlert = false;
      onDone?.();
    }
  }

  /**
   * Immediately silences the audible siren sound and stops speech announcement.
   */
  public silenceAlarm() {
    this.clearVoiceTimers();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeakingAlert = false;
    this.stopSirenSound();
    this.isMuted = true;
    this.notify();
  }

  /**
   * Stops the active audio oscillators.
   */
  public stopSirenSound() {
    this.clearVoiceTimers();
    if (typeof window !== "undefined" && "speechSynthesis" in window && this.isSpeakingAlert) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeakingAlert = false;

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
   * Plays a test blast of the emergency siren with vocal "Caution" announcement.
   */
  public testSiren() {
    this.isMuted = false;
    const testAlert: ActiveAlert = {
      id: "audio-system-test",
      source: "System",
      title: "AUDIO ALERT SYSTEM TEST",
      reason: "Emergency siren and speech synthesis operational.",
      severity: "CRITICAL",
      timestamp: new Date().toISOString(),
    };
    this.playSirenWithVoice(testAlert, true);
    this.notify();
  }

  /**
   * Unmutes alerts so subsequent critical events sound the siren.
   */
  public unmute() {
    this.isMuted = false;
    const criticalAlert = Array.from(this.activeAlerts.values()).find(
      (a) => a.severity === "CRITICAL" || a.severity === "CAUTION",
    );
    if (criticalAlert) {
      this.playSirenWithVoice(criticalAlert, false);
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
    listener(Array.from(this.activeAlerts.values()), this.isSounding, this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private clearVoiceTimers() {
    if (this.voiceTimer !== null) {
      clearTimeout(this.voiceTimer);
      this.voiceTimer = null;
    }
    this.clearPulseInterval();
  }

  private clearPulseInterval() {
    if (this.pulseInterval !== null) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
    if (this.pulseTimeout !== null) {
      clearTimeout(this.pulseTimeout);
      this.pulseTimeout = null;
    }
  }
}

export const audioAlertService = new AudioAlertManager();
