import { useState, useEffect, useRef } from "react";
import {
  Wind,
  Compass,
  RotateCcw,
  Globe,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  Hand,
  Volume1,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import {
  playSoothingChime,
  saveRecoverySession,
  type RecoveryActivityType,
} from "../../services/mindspaceService";

interface StressRecoveryStudioProps {
  onSessionLogged?: () => void;
}

type StudioTab = "breathing" | "grounding" | "reset" | "earth";

export default function StressRecoveryStudio({ onSessionLogged }: StressRecoveryStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>("breathing");

  // Before/After Stress Ratings
  const [beforeStress, setBeforeStress] = useState<number>(5);
  const [afterStress, setAfterStress] = useState<number | null>(null);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<string | null>(null);

  // ----------------------------------------------------
  // GUIDED BREATHING STATE
  // ----------------------------------------------------
  const [breathingDurationMin, setBreathingDurationMin] = useState<1 | 3 | 5>(3);
  const [breathingPacing, setBreathingPacing] = useState<"relaxing" | "box" | "calming">("relaxing");
  const [breathingState, setBreathingState] = useState<"idle" | "running" | "paused" | "finished">("idle");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const breathingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Configure seconds based on preset
  useEffect(() => {
    if (breathingState === "idle") {
      setSecondsRemaining(breathingDurationMin * 60);
    }
  }, [breathingDurationMin, breathingState]);

  // Breathing Loop Engine
  useEffect(() => {
    if (breathingState !== "running") {
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
      return;
    }

    breathingTimerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Finished!
          clearInterval(breathingTimerRef.current!);
          setBreathingState("finished");
          if (soundEnabled) playSoothingChime(660, 2.0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
    };
  }, [breathingState, soundEnabled]);

  // Breath Phase Cycle Engine
  useEffect(() => {
    if (breathingState !== "running") return;

    let cycleTime = 0;
    const interval = setInterval(() => {
      cycleTime++;

      if (breathingPacing === "relaxing") {
        // 4s Inhale, 4s Exhale (8s cycle)
        const mod = cycleTime % 8;
        if (mod < 4) {
          if (breathPhase !== "Inhale") {
            setBreathPhase("Inhale");
            if (soundEnabled) playSoothingChime(440, 0.8);
          }
          setPhaseSeconds(4 - mod);
        } else {
          if (breathPhase !== "Exhale") {
            setBreathPhase("Exhale");
            if (soundEnabled) playSoothingChime(330, 0.8);
          }
          setPhaseSeconds(8 - mod);
        }
      } else if (breathingPacing === "box") {
        // 4s Inhale, 4s Hold, 4s Exhale, 4s Hold (16s cycle)
        const mod = cycleTime % 16;
        if (mod < 4) {
          if (breathPhase !== "Inhale") {
            setBreathPhase("Inhale");
            if (soundEnabled) playSoothingChime(440, 0.8);
          }
          setPhaseSeconds(4 - mod);
        } else if (mod < 8) {
          setBreathPhase("Hold");
          setPhaseSeconds(8 - mod);
        } else if (mod < 12) {
          if (breathPhase !== "Exhale") {
            setBreathPhase("Exhale");
            if (soundEnabled) playSoothingChime(330, 0.8);
          }
          setPhaseSeconds(12 - mod);
        } else {
          setBreathPhase("Hold");
          setPhaseSeconds(16 - mod);
        }
      } else {
        // Calming: 4s Inhale, 6s Exhale (10s cycle)
        const mod = cycleTime % 10;
        if (mod < 4) {
          if (breathPhase !== "Inhale") {
            setBreathPhase("Inhale");
            if (soundEnabled) playSoothingChime(440, 0.8);
          }
          setPhaseSeconds(4 - mod);
        } else {
          if (breathPhase !== "Exhale") {
            setBreathPhase("Exhale");
            if (soundEnabled) playSoothingChime(330, 0.8);
          }
          setPhaseSeconds(10 - mod);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingState, breathingPacing, breathPhase, soundEnabled]);

  const handleStartBreathing = () => {
    setBreathingState("running");
    if (soundEnabled) playSoothingChime(528, 1.2);
  };

  const handlePauseBreathing = () => {
    setBreathingState("paused");
  };

  const handleStopBreathing = () => {
    setBreathingState("idle");
    setSecondsRemaining(breathingDurationMin * 60);
    setBreathPhase("Inhale");
  };

  const handleFinishAndLog = (activityType: RecoveryActivityType, title: string, durationSec: number) => {
    const delta = afterStress !== null ? afterStress - beforeStress : undefined;
    saveRecoverySession({
      activityType,
      title,
      durationSeconds: durationSec,
      beforeStress,
      afterStress: afterStress ?? undefined,
      stressDelta: delta,
    });
    setSessionCompletedNotice(
      `Session recorded! Before: ${beforeStress}/10 · After: ${afterStress ?? beforeStress}/10${delta !== undefined ? ` (Self-reported change: ${delta > 0 ? `+${delta}` : delta})` : ""}`,
    );
    onSessionLogged?.();
  };

  // ----------------------------------------------------
  // GROUNDING 5-4-3-2-1 STATE (SPACECRAFT ADAPTED)
  // ----------------------------------------------------
  const [groundingStep, setGroundingStep] = useState(1);
  const [groundingChecked, setGroundingChecked] = useState<Record<number, boolean>>({});

  const groundingStages = [
    {
      step: 1,
      count: 5,
      title: "Notice 5 Visible Habitat Objects",
      desc: "Look around your module. Notice 5 distinct items with specific colors or textures.",
      examples: [
        "Status LED indicator on avionics panel",
        "Fabric texture of velcro equipment tether",
        "Reflective surface of habitat hatch handle",
        "Personal mission patch on locker latch",
        "Earth’s horizon curve through viewing port",
      ],
      icon: Eye,
    },
    {
      step: 2,
      count: 4,
      title: "Notice 4 Physical Sensations",
      desc: "Focus on tactile touch and microgravity contact points.",
      examples: [
        "Pressure of foot restraint loop on boots",
        "Cool smooth texture of metallic handrail",
        "Gentle airflow from ventilation duct against skin",
        "Fit of flight suit collar around shoulders",
      ],
      icon: Hand,
    },
    {
      step: 3,
      count: 3,
      title: "Listen for 3 Habitat Sounds",
      desc: "Distinguish 3 continuous background acoustic sounds of the life support environment.",
      examples: [
        "Constant low drone of primary avionics cooling fans",
        "Soft rhythmic hum of water loop recirculation pump",
        "Occasional clicking of air regulator solenoid valve",
      ],
      icon: Volume1,
    },
    {
      step: 4,
      count: 2,
      title: "Notice 2 Ambient Scent Cues",
      desc: "Notice subtle aromas in the closed habitat environment.",
      examples: [
        "Clean, sanitized smell of HEPA-filtered air",
        "Aroma of recently rehydrated meal or herbal tea",
      ],
      icon: Wind,
    },
    {
      step: 5,
      count: 1,
      title: "Anchor 1 Grounding Affirmation",
      desc: "Hold a single steady intention for yourself and your crew.",
      examples: [
        "“I am safe in this moment. I have my training and my crew.”",
      ],
      icon: Sparkles,
    },
  ];

  // ----------------------------------------------------
  // GUIDED MENTAL RESET STATE
  // ----------------------------------------------------
  const [selectedResetIndex, setSelectedResetIndex] = useState(0);

  const resetRoutines = [
    {
      id: "calm-attention",
      title: "Calm Attention Practice (2 Minutes)",
      durationSec: 120,
      goal: "Steady attention and quiet mental chatter",
      steps: [
        "Gently rest your hands on your lap or float them neutrally in microgravity posture.",
        "Allow your gaze to soften on a fixed point in the cabin.",
        "Take a slow breath in for 4 seconds, feeling your chest expand.",
        "Release smoothly for 6 seconds, letting your jaw and neck loosen.",
        "Notice any urgent thoughts, and gently let them drift like orbital debris.",
        "Return your focus simply to the sensation of air moving across your face.",
      ],
    },
    {
      id: "shift-break",
      title: "Shift-Break Muscular Release (3 Minutes)",
      durationSec: 180,
      goal: "Mitigate postural fatigue from microgravity bracing",
      steps: [
        "In zero-g, astronauts continuously tense neck and hip muscles to stay aligned.",
        "Consciously drop your shoulders away from your ears.",
        "Open and close both fists gently three times, releasing forearm grip tension.",
        "Rotate your wrists slowly clockwise, then counter-clockwise.",
        "Take a full, deep breath and gently roll your neck from side to side.",
        "Feel your spine decompress naturally in neutral body posture.",
      ],
    },
    {
      id: "earth-memory",
      title: "Earth Memory & Perspective (4 Minutes)",
      durationSec: 240,
      goal: "Cognitive reframing through familiar Earth grounding",
      steps: [
        "Close your eyes if comfortable, or look out through the viewing window.",
        "Recall a vivid sensory memory of nature on Earth: a forest, an ocean, or rain.",
        "Remember the sound of wind rustling through real leaves.",
        "Feel the imagined warmth of direct sunlight and the smell of moist soil.",
        "Hold this connection: Earth remains right beneath you, home to everyone you love.",
        "Carry this calm perspective forward into your remaining mission duties.",
      ],
    },
  ];

  // ----------------------------------------------------
  // EARTH CONNECTION EXPERIENCE STATE
  // ----------------------------------------------------
  const [earthFullscreen, setEarthFullscreen] = useState(false);
  const [earthAmbientSound, setEarthAmbientSound] = useState(false);
  const earthAudioCtxRef = useRef<AudioContext | null>(null);

  const toggleEarthSound = () => {
    if (!earthAmbientSound) {
      if (typeof window !== "undefined") {
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            // Gentle pink noise / ambient cabin sound
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04;
            }
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(320, ctx.currentTime);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.06, ctx.currentTime);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            whiteNoise.start();

            earthAudioCtxRef.current = ctx;
            setEarthAmbientSound(true);
          }
        } catch {}
      }
    } else {
      if (earthAudioCtxRef.current) {
        earthAudioCtxRef.current.close().catch(() => {});
        earthAudioCtxRef.current = null;
      }
      setEarthAmbientSound(false);
    }
  };

  useEffect(() => {
    return () => {
      if (earthAudioCtxRef.current) {
        earthAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="stress-recovery-studio-container">
      {/* Studio Navigation Tabs */}
      <div className="studio-tabs-bar">
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === "breathing" ? "active" : ""}`}
          onClick={() => setActiveTab("breathing")}
        >
          <Wind size={16} /> Guided Breathing
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === "grounding" ? "active" : ""}`}
          onClick={() => setActiveTab("grounding")}
        >
          <Compass size={16} /> Spacecraft Grounding (5-4-3-2-1)
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === "reset" ? "active" : ""}`}
          onClick={() => setActiveTab("reset")}
        >
          <RotateCcw size={16} /> Guided Mental Reset
        </button>
        <button
          type="button"
          className={`studio-tab-btn ${activeTab === "earth" ? "active" : ""}`}
          onClick={() => setActiveTab("earth")}
        >
          <Globe size={16} /> Earth Connection Focus
        </button>
      </div>

      {/* Before/After Stress Tracker Bar */}
      <div className="before-after-tracker-bar">
        <div className="tracker-row">
          <div className="rating-col">
            <span className="rating-lbl">STRESS BEFORE SESSION:</span>
            <div className="rating-stepper">
              <input
                type="range"
                min="0"
                max="10"
                value={beforeStress}
                onChange={(e) => setBeforeStress(Number(e.target.value))}
                className="slider-input mini-slider"
              />
              <span className="rating-badge">{beforeStress}/10</span>
            </div>
          </div>

          <div className="rating-col">
            <span className="rating-lbl">STRESS AFTER SESSION:</span>
            <div className="rating-stepper">
              <input
                type="range"
                min="0"
                max="10"
                value={afterStress ?? beforeStress}
                onChange={(e) => setAfterStress(Number(e.target.value))}
                className="slider-input mini-slider"
              />
              <span className="rating-badge">
                {afterStress !== null ? `${afterStress}/10` : "Rate after"}
              </span>
            </div>
          </div>

          {afterStress !== null && (
            <div className="rating-diff-box">
              <span className="diff-lbl">SELF-REPORTED CHANGE:</span>
              <strong className={`diff-val ${afterStress < beforeStress ? "improved" : ""}`}>
                {afterStress - beforeStress > 0 ? `+${afterStress - beforeStress}` : afterStress - beforeStress}
              </strong>
            </div>
          )}
        </div>
        <small className="disclaimer-text">
          <Info size={11} /> Self-reported ratings reflect user perception at two moments; they do not establish clinical efficacy.
        </small>
        {sessionCompletedNotice && (
          <div className="session-saved-banner">
            <CheckCircle2 size={13} /> {sessionCompletedNotice}
          </div>
        )}
      </div>

      {/* ========================================================
          TAB 1: GUIDED BREATHING
          ======================================================== */}
      {activeTab === "breathing" && (
        <div className="studio-card breathing-card">
          <div className="breathing-settings-row">
            <div className="setting-group">
              <span className="setting-lbl">DURATION</span>
              <div className="btn-group">
                {[1, 3, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`button ${breathingDurationMin === m ? "primary" : "outline"} small-btn`}
                    disabled={breathingState === "running"}
                    onClick={() => {
                      setBreathingDurationMin(m as 1 | 3 | 5);
                      setSecondsRemaining(m * 60);
                    }}
                  >
                    {m} Min
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <span className="setting-lbl">PACING STYLE</span>
              <div className="btn-group">
                {(
                  [
                    { id: "relaxing", label: "4s / 4s Relaxing" },
                    { id: "box", label: "4-4-4-4 Box" },
                    { id: "calming", label: "4s / 6s Calming" },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`button ${breathingPacing === p.id ? "primary" : "outline"} small-btn`}
                    disabled={breathingState === "running"}
                    onClick={() => setBreathingPacing(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group audio-toggle">
              <button
                type="button"
                className={`icon-btn ${soundEnabled ? "active" : ""}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Sound Chimes Active" : "Sound Muted"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                type="button"
                className={`button outline small-btn ${reducedMotion ? "active" : ""}`}
                onClick={() => setReducedMotion(!reducedMotion)}
              >
                {reducedMotion ? "Motion: Reduced" : "Motion: Fluid"}
              </button>
            </div>
          </div>

          {/* Animated Visual Breathing Sphere */}
          <div className="breathing-stage">
            <div
              className={`breathing-sphere-outer ${reducedMotion ? "reduced-motion-mode" : ""} ${breathingState === "running" ? `phase-${breathPhase.toLowerCase()}` : ""}`}
            >
              <div className="breathing-sphere-inner">
                <span className="breath-instruction">
                  {breathingState === "idle"
                    ? "READY"
                    : breathingState === "finished"
                      ? "COMPLETE"
                      : breathPhase.toUpperCase()}
                </span>
                <span className="breath-countdown">
                  {breathingState === "running" ? `${phaseSeconds}s` : ""}
                </span>
              </div>
            </div>

            <div className="breathing-time-readout">
              <span className="time-remaining">
                {String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:
                {String(secondsRemaining % 60).padStart(2, "0")} REMAINING
              </span>
              <p className="breath-pacing-hint">
                {breathingPacing === "relaxing"
                  ? "Inhale smooth 4s · Exhale smooth 4s"
                  : breathingPacing === "box"
                    ? "Inhale 4s · Pause 4s · Exhale 4s · Pause 4s"
                    : "Inhale 4s · Slow extended Exhale 6s"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="breathing-controls-row">
            {breathingState === "idle" && (
              <button
                type="button"
                className="button primary"
                onClick={handleStartBreathing}
              >
                <Play size={16} /> Start Breathing Session
              </button>
            )}

            {breathingState === "running" && (
              <>
                <button
                  type="button"
                  className="button outline"
                  onClick={handlePauseBreathing}
                >
                  <Pause size={16} /> Pause
                </button>
                <button
                  type="button"
                  className="button outline alert-btn"
                  onClick={handleStopBreathing}
                >
                  <Square size={16} /> Stop Session
                </button>
              </>
            )}

            {breathingState === "paused" && (
              <>
                <button
                  type="button"
                  className="button primary"
                  onClick={handleStartBreathing}
                >
                  <Play size={16} /> Resume
                </button>
                <button
                  type="button"
                  className="button outline"
                  onClick={handleStopBreathing}
                >
                  <Square size={16} /> Reset
                </button>
              </>
            )}

            {breathingState === "finished" && (
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  handleFinishAndLog(
                    "guided_breathing",
                    `Guided Breathing (${breathingDurationMin} Min - ${breathingPacing})`,
                    breathingDurationMin * 60,
                  );
                  handleStopBreathing();
                }}
              >
                <CheckCircle2 size={16} /> Log Completed Session
              </button>
            )}
          </div>

          <p className="safety-disclaimer-note">
            Comfort Protocol: No forced breath-holding required. Stop at any moment if you experience dizziness or discomfort.
          </p>
        </div>
      )}

      {/* ========================================================
          TAB 2: SPACECRAFT GROUNDING (5-4-3-2-1)
          ======================================================== */}
      {activeTab === "grounding" && (
        <div className="studio-card grounding-card">
          <div className="grounding-header">
            <div>
              <span className="eyebrow">AEROSPACE SENSORY GROUNDING</span>
              <h2>Orbital 5-4-3-2-1 Technique</h2>
            </div>
            <span className="grounding-step-tag">
              STEP {groundingStep} OF 5
            </span>
          </div>

          <div className="grounding-stage-content">
            {groundingStages
              .filter((st) => st.step === groundingStep)
              .map((curr) => (
                <div key={curr.step} className="grounding-active-stage">
                  <div className="stage-icon-circle">
                    <curr.icon size={28} className="accent-cyan" />
                  </div>
                  <h3>{curr.title}</h3>
                  <p className="stage-desc">{curr.desc}</p>

                  <div className="habitat-examples-box">
                    <span className="examples-lbl">SUGGESTED SPACECRAFT TARGETS:</span>
                    <ul className="examples-list">
                      {curr.examples.map((ex, idx) => (
                        <li key={idx}>
                          <span className="bullet">✦</span> {ex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <label className="grounding-confirm-check">
                    <input
                      type="checkbox"
                      checked={Boolean(groundingChecked[curr.step])}
                      onChange={(e) =>
                        setGroundingChecked((prev) => ({
                          ...prev,
                          [curr.step]: e.target.checked,
                        }))
                      }
                    />
                    <span>I have noticed and grounded myself in this step</span>
                  </label>
                </div>
              ))}
          </div>

          <div className="grounding-controls-row">
            <button
              type="button"
              className="button outline"
              disabled={groundingStep === 1}
              onClick={() => setGroundingStep((s) => s - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {groundingStep < 5 ? (
              <button
                type="button"
                className="button primary"
                onClick={() => setGroundingStep((s) => s + 1)}
              >
                Next Sensory Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  handleFinishAndLog(
                    "grounding_54321",
                    "Spacecraft 5-4-3-2-1 Sensory Grounding",
                    120,
                  );
                  setGroundingStep(1);
                  setGroundingChecked({});
                }}
              >
                <CheckCircle2 size={16} /> Complete & Log Grounding
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: GUIDED MENTAL RESET
          ======================================================== */}
      {activeTab === "reset" && (
        <div className="studio-card reset-card">
          <div className="reset-selector-row">
            {resetRoutines.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                className={`reset-routine-pill ${selectedResetIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedResetIndex(idx)}
              >
                <strong>{r.title}</strong>
                <span>{r.goal}</span>
              </button>
            ))}
          </div>

          <div className="reset-routine-body">
            <h3>{resetRoutines[selectedResetIndex].title}</h3>
            <p className="reset-goal-tag">
              Target: {resetRoutines[selectedResetIndex].goal}
            </p>

            <ol className="reset-steps-list">
              {resetRoutines[selectedResetIndex].steps.map((st, i) => (
                <li key={i}>
                  <span className="step-num">{i + 1}</span>
                  <p>{st}</p>
                </li>
              ))}
            </ol>

            <div className="reset-action-row">
              <button
                type="button"
                className="button primary"
                onClick={() =>
                  handleFinishAndLog(
                    "mental_reset",
                    resetRoutines[selectedResetIndex].title,
                    resetRoutines[selectedResetIndex].durationSec,
                  )
                }
              >
                <CheckCircle2 size={16} /> Mark Reset Routine Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: EARTH CONNECTION FOCUS
          ======================================================== */}
      {activeTab === "earth" && (
        <div className={`studio-card earth-focus-card ${earthFullscreen ? "fullscreen-focus-mode" : ""}`}>
          <div className="earth-focus-header">
            <div>
              <span className="eyebrow">COGNITIVE PERSPECTIVE</span>
              <h2>Orbital Earth Connection Experience</h2>
            </div>
            <div className="earth-controls-actions">
              <button
                type="button"
                className={`button outline small-btn ${earthAmbientSound ? "active" : ""}`}
                onClick={toggleEarthSound}
              >
                {earthAmbientSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{earthAmbientSound ? "Cabin Sound: Active" : "Cabin Sound: Off"}</span>
              </button>
              <button
                type="button"
                className="button outline small-btn"
                onClick={() => setEarthFullscreen(!earthFullscreen)}
              >
                {earthFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{earthFullscreen ? "Exit Focus" : "Fullscreen"}</span>
              </button>
            </div>
          </div>

          <div className="earth-viewport-container">
            <div className="earth-calm-visual">
              <div className="earth-glow-atmosphere" />
              <div className="earth-orbiting-body" />
            </div>

            <div className="earth-telemetry-hud">
              <div className="hud-metric">
                <span className="hud-lbl">ORBITAL ALTITUDE</span>
                <strong>408 KM</strong>
              </div>
              <div className="hud-metric">
                <span className="hud-lbl">INCLINATION</span>
                <strong>51.6°</strong>
              </div>
              <div className="hud-metric">
                <span className="hud-lbl">VELOCITY</span>
                <strong>27,600 KM/H</strong>
              </div>
            </div>

            <div className="earth-perspective-quote">
              <p>
                “You don’t see any boundaries or lines of trade; you see one whole, fragile planet protected only by a paper-thin atmosphere.”
              </p>
            </div>
          </div>

          <div className="earth-card-footer">
            <button
              type="button"
              className="button primary"
              onClick={() =>
                handleFinishAndLog(
                  "earth_connection",
                  "Orbital Earth Connection Viewing Focus",
                  300,
                )
              }
            >
              <CheckCircle2 size={16} /> Complete & Log 5-Min Perspective Pause
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
