import { useState } from "react";
import {
  X,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Smile,
  Meh,
  Frown,
  Zap,
  Moon,
  Target,
  Users,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  saveMentalCheckin,
  type MoodState,
  type EnergyLevel,
  type SleepQuality,
  type FocusLevel,
  type CrewConnection,
  type MentalCheckinEntry,
} from "../../services/mindspaceService";

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (entry: MentalCheckinEntry) => void;
  initialEntry?: MentalCheckinEntry;
  missionDay?: number;
}

export default function DailyCheckinModal({
  isOpen,
  onClose,
  onComplete,
  initialEntry,
  missionDay = 147,
}: DailyCheckinModalProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<MoodState>(initialEntry?.mood || "good");
  const [stress, setStress] = useState<number>(initialEntry?.stress ?? 3);
  const [energy, setEnergy] = useState<EnergyLevel>(initialEntry?.energy || "moderate");
  const [sleep, setSleep] = useState<SleepQuality>(initialEntry?.sleep || "restful");
  const [focus, setFocus] = useState<FocusLevel>(initialEntry?.focus || "sharp");
  const [crewConnection, setCrewConnection] = useState<CrewConnection>(
    initialEntry?.crewConnection || "strong",
  );
  const [privateNote, setPrivateNote] = useState<string>(initialEntry?.privateNote || "");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 7;

  const handleSave = () => {
    const saved = saveMentalCheckin({
      missionDay,
      mood,
      stress,
      energy,
      sleep,
      focus,
      crewConnection,
      privateNote: privateNote.trim() || undefined,
      provenance: "SELF-REPORTED",
    });
    setIsSaved(true);
    setTimeout(() => {
      onComplete(saved);
      onClose();
      setIsSaved(false);
      setStep(1);
    }, 1200);
  };

  return (
    <div className="mindspace-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="chk-title">
      <div className="mindspace-modal-card checkin-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag">60-SECOND VOLUNTARY REFLECTION</span>
            <h2 id="chk-title">Daily Mental Wellness Check-in</h2>
            <p className="modal-sub">
              Mission Day {missionDay} · Step {step} of {totalSteps}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close check-in"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="checkin-progress-bar" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
          <div
            className="progress-fill"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Success Confirmation State */}
        {isSaved ? (
          <div className="checkin-success-state">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Check-in Recorded</h3>
            <p>
              Your voluntary responses have been saved securely to local storage on this device.
            </p>
            <div className="privacy-pill">
              <Lock size={12} /> Confidential & Non-Clinical
            </div>
          </div>
        ) : (
          <div className="checkin-step-content">
            {/* Step 1: Overall Mood */}
            {step === 1 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 1 / 7</span>
                <h3>How are you feeling overall today?</h3>
                <p className="step-hint">
                  Select the descriptor that most closely aligns with your current mindset.
                </p>
                <div className="options-grid mood-grid">
                  {(
                    [
                      { id: "great", label: "Great / Energized", desc: "Feeling optimal and ready for duty", icon: Smile },
                      { id: "good", label: "Good / Balanced", desc: "Steady operational state", icon: Smile },
                      { id: "neutral", label: "Neutral / Flat", desc: "Managing normal routine without strong emotion", icon: Meh },
                      { id: "low", label: "Low / Drained", desc: "Feeling down or depleted", icon: Frown },
                      { id: "stressed", label: "Stressed / Overwhelmed", desc: "Elevated pressure or sensory overload", icon: AlertCircle },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`option-card ${mood === item.id ? "selected" : ""}`}
                      onClick={() => setMood(item.id)}
                    >
                      <item.icon size={22} className="opt-icon" />
                      <div className="opt-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Perceived Stress */}
            {step === 2 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 2 / 7</span>
                <h3>How stressed do you feel right now?</h3>
                <p className="step-hint">
                  Rate your subjective perceived stress on a scale from 0 (completely calm) to 10 (extreme stress).
                </p>
                <div className="stress-slider-box">
                  <div className="stress-value-display">
                    <span className="stress-big-number">{stress}</span>
                    <span className="stress-rating-label">
                      {stress <= 2
                        ? "Minimal / Calm"
                        : stress <= 5
                          ? "Mild Operational Stress"
                          : stress <= 7
                            ? "Elevated Stress"
                            : "High Stress / Action Advised"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={stress}
                    onChange={(e) => setStress(Number(e.target.value))}
                    className="slider-input stress-range"
                    aria-label="Stress rating from 0 to 10"
                  />
                  <div className="scale-marks">
                    <span>0 (Relaxed)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Overload)</span>
                  </div>
                  <p className="scientific-disclaimer-note">
                    Note: Self-reported stress does not constitute a clinical measurement or psychiatric screening.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Energy Level */}
            {step === 3 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 3 / 7</span>
                <h3>How is your physical and mental energy level?</h3>
                <p className="step-hint">
                  Reflect on stamina, fatigue, and recovery from previous duty intervals.
                </p>
                <div className="options-grid">
                  {(
                    [
                      { id: "high", label: "High Stamina", desc: "Fully charged for complex cognitive and physical tasks", icon: Zap },
                      { id: "moderate", label: "Moderate / Normal", desc: "Able to carry out mission schedule comfortably", icon: Zap },
                      { id: "low", label: "Low Reserve", desc: "Noticeable lethargy or requiring pacing", icon: Zap },
                      { id: "exhausted", label: "Depleted / Exhausted", desc: "Struggling with fatigue; rest indicated", icon: AlertCircle },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`option-card ${energy === item.id ? "selected" : ""}`}
                      onClick={() => setEnergy(item.id)}
                    >
                      <item.icon size={20} className="opt-icon" />
                      <div className="opt-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Sleep Quality */}
            {step === 4 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 4 / 7</span>
                <h3>How was your sleep during your last sleep block?</h3>
                <p className="step-hint">
                  Spaceflight sleep is frequently affected by circadian disruption and ambient habitat noise.
                </p>
                <div className="options-grid">
                  {(
                    [
                      { id: "restful", label: "Restful & Continuous", desc: "Woke feeling refreshed with solid slow-wave sleep", icon: Moon },
                      { id: "fragmented", label: "Fragmented / Broken", desc: "Woke multiple times; light sleep cycles", icon: Moon },
                      { id: "delayed", label: "Delayed Sleep Onset", desc: "Took a long time to fall asleep in sleep station", icon: Moon },
                      { id: "insufficient", label: "Insufficient Duration", desc: "Cut short by operational alarms or early shift start", icon: AlertCircle },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`option-card ${sleep === item.id ? "selected" : ""}`}
                      onClick={() => setSleep(item.id)}
                    >
                      <item.icon size={20} className="opt-icon" />
                      <div className="opt-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Focus & Task Readiness */}
            {step === 5 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 5 / 7</span>
                <h3>How easy is it to maintain focus today?</h3>
                <p className="step-hint">
                  High workload and prolonged isolation can affect working memory and mental agility.
                </p>
                <div className="options-grid">
                  {(
                    [
                      { id: "sharp", label: "Sharp & Attentive", desc: "High clarity; easily tracking complex checklists", icon: Target },
                      { id: "manageable", label: "Manageable", desc: "Normal attention span for standard operational tasks", icon: Target },
                      { id: "scattered", label: "Scattered / Distracted", desc: "Slight brain fog or difficulty prioritizing", icon: Target },
                      { id: "difficult", label: "Difficult to Concentrate", desc: "Struggling to sustain attention on procedural steps", icon: AlertCircle },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`option-card ${focus === item.id ? "selected" : ""}`}
                      onClick={() => setFocus(item.id)}
                    >
                      <item.icon size={20} className="opt-icon" />
                      <div className="opt-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Social & Crew Connection */}
            {step === 6 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 6 / 7</span>
                <h3>How connected do you feel with your crewmates?</h3>
                <p className="step-hint">
                  NASA research identifies inadequate teamwork and social friction as key deep-space mission risks.
                </p>
                <div className="options-grid">
                  {(
                    [
                      { id: "strong", label: "Strong & Supportive", desc: "Great camaraderie, clear communication, mutual trust", icon: Users },
                      { id: "good", label: "Good / Cohesive", desc: "Healthy operational harmony across all shifts", icon: Users },
                      { id: "isolated", label: "Somewhat Isolated", desc: "Feeling separated or keeping to myself", icon: Users },
                      { id: "tension", label: "Friction / Tension Present", desc: "Interpersonal friction or miscommunication noticed", icon: AlertCircle },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`option-card ${crewConnection === item.id ? "selected" : ""}`}
                      onClick={() => setCrewConnection(item.id)}
                    >
                      <item.icon size={20} className="opt-icon" />
                      <div className="opt-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Private Note */}
            {step === 7 && (
              <div className="step-question-box">
                <span className="step-eyebrow">QUESTION 7 / 7 (OPTIONAL)</span>
                <h3>Would you like to log a private reflection note?</h3>
                <p className="step-hint">
                  This note is stored 100% locally in your browser sandbox. It is never transmitted to mission control or teammates.
                </p>
                <textarea
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Private thoughts, specific challenges, accomplishments, or reminders for your shift..."
                  rows={4}
                  className="checkin-textarea"
                />
                <div className="checkin-summary-preview">
                  <h4>Review Check-in Summary</h4>
                  <div className="summary-chips-row">
                    <span className="summary-chip">Mood: {mood.toUpperCase()}</span>
                    <span className="summary-chip">Stress: {stress}/10</span>
                    <span className="summary-chip">Energy: {energy.toUpperCase()}</span>
                    <span className="summary-chip">Sleep: {sleep.toUpperCase()}</span>
                    <span className="summary-chip">Focus: {focus.toUpperCase()}</span>
                    <span className="summary-chip">Crew: {crewConnection.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation Controls */}
            <div className="checkin-modal-footer">
              <div className="footer-left">
                {step > 1 && (
                  <button
                    type="button"
                    className="button outline small-btn"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
                <button
                  type="button"
                  className="text-button"
                  onClick={onClose}
                >
                  Save Later
                </button>
              </div>

              <div className="footer-right">
                {step < totalSteps ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Next Question <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleSave}
                  >
                    Submit Check-in <CheckCircle2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
