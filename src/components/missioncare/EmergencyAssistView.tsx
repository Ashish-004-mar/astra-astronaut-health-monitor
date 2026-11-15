import { useState } from "react";
import {
  Siren,
  ShieldAlert,
  Activity,
  Heart,
  Wind,
  UserX,
  AlertTriangle,
  Radio,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  FileText,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  MISSION_ENVIRONMENTS,
  addTimelineEntry,
  type MissionEnvironmentId,
  type EmergencyEquipmentItem,
} from "../../services/missionCareService";

interface EmergencyAssistViewProps {
  environment: MissionEnvironmentId;
  equipment: EmergencyEquipmentItem[];
  onNavigateTab: (tab: string) => void;
  onOpenTimeline: () => void;
}

type ScenarioType = "chest_pain_collapse" | "unresponsiveness" | "breathing_difficulty" | "trauma";
type TriageStep = "triage" | "resuscitation" | "stabilization";

export default function EmergencyAssistView({
  environment,
  equipment,
  onNavigateTab,
  onOpenTimeline,
}: EmergencyAssistViewProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("chest_pain_collapse");
  const [assessmentStep, setAssessmentStep] = useState<TriageStep>("triage");
  const [avpuChoice, setAvpuChoice] = useState<"Alert" | "Verbal" | "Unresponsive" | null>(null);
  const [breathingChoice, setBreathingChoice] = useState<"normal" | "gasping" | "absent" | null>(null);
  const [alertActive, setAlertActive] = useState(false);
  const [alertBroadcastTime, setAlertBroadcastTime] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const envInfo = MISSION_ENVIRONMENTS[environment];

  const handleBroadcastAlert = () => {
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
    setAlertActive(true);
    setAlertBroadcastTime(timeStr);

    addTimelineEntry({
      category: "ALERT",
      title: `EMERGENCY ALERT: ${activeScenario.toUpperCase().replace(/_/g, " ")}`,
      details: `General crew emergency broadcasted in ${envInfo.name}. Environment latency: ${envInfo.commLatencyMinutes} min.`,
      provenance: "MANUAL_ENTRY",
      author: "Crew First-Responder",
      missionDay: 147,
    });
  };

  const handleResetAlert = () => {
    setAlertActive(false);
    setAlertBroadcastTime(null);
    setAssessmentStep("triage");
    setAvpuChoice(null);
    setBreathingChoice(null);
  };

  const toggleChecklist = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Critical equipment check
  const aed = equipment.find((e) => e.name.toLowerCase().includes("defibrillator"));
  const bvm = equipment.find((e) => e.name.toLowerCase().includes("bag valve"));
  const o2 = equipment.find((e) => e.name.toLowerCase().includes("oxygen"));

  const isCardiacArrest =
    avpuChoice === "Unresponsive" ||
    breathingChoice === "absent" ||
    breathingChoice === "gasping";

  return (
    <div className="emergency-assist-console">
      {/* 1. Tactical Emergency Hero Banner */}
      <div className={`tactical-hero-card ${alertActive ? "alarm-active" : ""}`}>
        <div className="hero-status-row">
          <div className="status-indicator-group">
            <span className={`pulse-badge ${alertActive ? "pulse-red" : "pulse-green"}`}>
              {alertActive ? "🚨 ACTIVE CREW ALARM" : "● SYSTEM STANDBY"}
            </span>
            <span className="env-meta-pill">
              <Radio size={12} /> {envInfo.name} · {envInfo.commLatencyMinutes}m 1-Way Latency
            </span>
          </div>

          <div className="hero-btn-group">
            {!alertActive ? (
              <button
                type="button"
                className="tactical-btn alert-trigger-btn"
                onClick={handleBroadcastAlert}
              >
                <Siren size={16} /> BROADCAST CREW ALARM
              </button>
            ) : (
              <div className="alert-live-wrap">
                <span className="alarm-time">BROADCASTED AT {alertBroadcastTime}</span>
                <button
                  type="button"
                  className="tactical-btn stand-down-btn"
                  onClick={handleResetAlert}
                >
                  <RotateCcw size={14} /> Stand Down Alarm
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hero-info-brief">
          <p>
            Autonomous decision support for non-medical crewmates. If crewmate is collapsed and not breathing normally,{" "}
            <strong>start microgravity resuscitation immediately</strong>. Do not wait for Earth communication or routine vital tests.
          </p>
        </div>
      </div>

      {/* 2. Rapid Scenario Picker (4 Clean High-Tech Cards) */}
      <div className="emergency-scenarios-strip">
        <button
          type="button"
          className={`scenario-pill-card ${activeScenario === "chest_pain_collapse" ? "selected" : ""}`}
          onClick={() => {
            setActiveScenario("chest_pain_collapse");
            setAssessmentStep("triage");
          }}
        >
          <div className="scen-icon-wrap rose">
            <Heart size={18} />
          </div>
          <div className="scen-text-wrap">
            <span className="scen-badge critical">NASA PRIMARY CHALLENGE</span>
            <h4>Chest Pain & Sudden Collapse</h4>
          </div>
        </button>

        <button
          type="button"
          className={`scenario-pill-card ${activeScenario === "unresponsiveness" ? "selected" : ""}`}
          onClick={() => {
            setActiveScenario("unresponsiveness");
            setAssessmentStep("triage");
          }}
        >
          <div className="scen-icon-wrap red">
            <UserX size={18} />
          </div>
          <div className="scen-text-wrap">
            <span className="scen-badge critical">CRITICAL</span>
            <h4>Unresponsive Crewmate (Grade U)</h4>
          </div>
        </button>

        <button
          type="button"
          className={`scenario-pill-card ${activeScenario === "breathing_difficulty" ? "selected" : ""}`}
          onClick={() => {
            setActiveScenario("breathing_difficulty");
            setAssessmentStep("triage");
          }}
        >
          <div className="scen-icon-wrap amber">
            <Wind size={18} />
          </div>
          <div className="scen-text-wrap">
            <span className="scen-badge urgent">URGENT</span>
            <h4>Severe Respiratory Distress</h4>
          </div>
        </button>

        <button
          type="button"
          className={`scenario-pill-card ${activeScenario === "trauma" ? "selected" : ""}`}
          onClick={() => {
            setActiveScenario("trauma");
            setAssessmentStep("triage");
          }}
        >
          <div className="scen-icon-wrap cyan">
            <Zap size={18} />
          </div>
          <div className="scen-text-wrap">
            <span className="scen-badge moderate">TRAUMA</span>
            <h4>Cabin Impact / Blunt Trauma</h4>
          </div>
        </button>
      </div>

      {/* 3. Tactical 3-Step Stepper Header */}
      <div className="triage-stepper-bar">
        <button
          type="button"
          className={`stepper-tab ${assessmentStep === "triage" ? "active" : ""}`}
          onClick={() => setAssessmentStep("triage")}
        >
          <span className="step-num">1</span>
          <span>Rapid Triage</span>
        </button>
        <button
          type="button"
          className={`stepper-tab ${assessmentStep === "resuscitation" ? "active" : ""}`}
          onClick={() => setAssessmentStep("resuscitation")}
        >
          <span className="step-num">2</span>
          <span>Microgravity CPR & AED</span>
        </button>
        <button
          type="button"
          className={`stepper-tab ${assessmentStep === "stabilization" ? "active" : ""}`}
          onClick={() => setAssessmentStep("stabilization")}
        >
          <span className="step-num">3</span>
          <span>Stabilize & Comms</span>
        </button>
      </div>

      {/* 4. Active Step Content */}
      <div className="triage-step-container">
        {/* STEP 1: RAPID TRIAGE */}
        {assessmentStep === "triage" && (
          <div className="step-view-card">
            <div className="step-card-header">
              <ShieldAlert size={18} className="accent-rose" />
              <div>
                <h3>Step 1: Rapid Patient Assessment (&lt; 15 Seconds)</h3>
                <p>Verify consciousness and breathing before taking any instruments or cuffs.</p>
              </div>
            </div>

            <div className="triage-questions-grid">
              {/* Question 1: Consciousness */}
              <div className="tactical-question-box">
                <span className="q-tag">CHECK 1: RESPONSIVENESS</span>
                <h4>Tap shoulder firmly and ask loudly: &quot;Can you hear me?&quot;</h4>
                <div className="choice-buttons-stack">
                  <button
                    type="button"
                    className={`choice-btn ${avpuChoice === "Alert" ? "selected-green" : ""}`}
                    onClick={() => setAvpuChoice("Alert")}
                  >
                    <span className="bullet green">●</span>
                    <div className="btn-label-group">
                      <strong>Alert & Oriented</strong>
                      <small>Spontaneously speaks and tracks with eyes</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`choice-btn ${avpuChoice === "Verbal" ? "selected-amber" : ""}`}
                    onClick={() => setAvpuChoice("Verbal")}
                  >
                    <span className="bullet amber">●</span>
                    <div className="btn-label-group">
                      <strong>Verbal Response Only</strong>
                      <small>Opens eyes or groans only when shouted at</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`choice-btn ${avpuChoice === "Unresponsive" ? "selected-rose" : ""}`}
                    onClick={() => setAvpuChoice("Unresponsive")}
                  >
                    <span className="bullet rose">●</span>
                    <div className="btn-label-group">
                      <strong className="accent-rose">Unresponsive (Grade U)</strong>
                      <small>No response to voice or shoulder pinch</small>
                    </div>
                  </button>
                </div>
              </div>

              {/* Question 2: Breathing */}
              <div className="tactical-question-box">
                <span className="q-tag">CHECK 2: BREATHING QUALITY</span>
                <h4>Look at chest wall for 5–10 seconds. Is breathing normal?</h4>
                <div className="choice-buttons-stack">
                  <button
                    type="button"
                    className={`choice-btn ${breathingChoice === "normal" ? "selected-green" : ""}`}
                    onClick={() => setBreathingChoice("normal")}
                  >
                    <span className="bullet green">●</span>
                    <div className="btn-label-group">
                      <strong>Normal Breathing</strong>
                      <small>Regular chest rise and fall (12–20 bpm)</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`choice-btn ${breathingChoice === "gasping" ? "selected-rose" : ""}`}
                    onClick={() => setBreathingChoice("gasping")}
                  >
                    <span className="bullet rose">●</span>
                    <div className="btn-label-group">
                      <strong className="accent-rose">Agonal Gasping</strong>
                      <small>Infrequent, noisy, labored gasps</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`choice-btn ${breathingChoice === "absent" ? "selected-rose" : ""}`}
                    onClick={() => setBreathingChoice("absent")}
                  >
                    <span className="bullet rose">●</span>
                    <div className="btn-label-group">
                      <strong className="accent-rose">No Breathing Detected</strong>
                      <small>No chest expansion, no airflow</small>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Escalation Callout if Arrest Identified */}
            {isCardiacArrest && (
              <div className="emergency-directive-box">
                <div className="directive-header">
                  <AlertTriangle size={24} className="accent-rose" />
                  <div>
                    <h4>CARDIAC ARREST DIRECTIVE DETECTED</h4>
                    <p>Unresponsive patient with gasping/absent breathing requires immediate resuscitation.</p>
                  </div>
                </div>

                <div className="directive-action-row">
                  <div className="directive-chips">
                    <span>1. CMRS Restraint</span>
                    <span>2. Power AED</span>
                    <span>3. 30:2 CPR</span>
                    <span>4. BVM Oxygen</span>
                  </div>

                  <button
                    type="button"
                    className="tactical-btn alert-trigger-btn proceed-btn"
                    onClick={() => setAssessmentStep("resuscitation")}
                  >
                    Launch Resuscitation Protocol <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: APPROVED MICROGRAVITY RESUSCITATION */}
        {assessmentStep === "resuscitation" && (
          <div className="step-view-card">
            <div className="step-card-header">
              <Heart size={20} className="accent-rose" />
              <div>
                <h3>Step 2: Microgravity Resuscitation Protocol (CMRS &amp; AED)</h3>
                <p>NASA Spaceflight Medical Flight Rule B13-102 Resuscitation Workflow.</p>
              </div>
            </div>

            <div className="resuscitation-grid">
              <div
                className={`resus-card ${completedSteps["r1"] ? "done" : ""}`}
                onClick={() => toggleChecklist("r1")}
              >
                <div className="resus-card-top">
                  <span className="resus-num">1</span>
                  <h4>CMRS BERTH TETHER</h4>
                  <CheckCircle2 size={18} className={completedSteps["r1"] ? "accent-green" : "muted"} />
                </div>
                <p>Lock patient onto Crew Medical Restraint System (CMRS) board or firm bulkhead rail to prevent floating during compressions.</p>
                <span className="action-hint">Tap to verify complete</span>
              </div>

              <div
                className={`resus-card ${completedSteps["r2"] ? "done" : ""}`}
                onClick={() => toggleChecklist("r2")}
              >
                <div className="resus-card-top">
                  <span className="resus-num">2</span>
                  <h4>AED POWER &amp; PADS</h4>
                  <CheckCircle2 size={18} className={completedSteps["r2"] ? "accent-green" : "muted"} />
                </div>
                <p>Wipe bare chest dry. Peel and apply pads: Upper Right Sternum &amp; Lower Left Apex. Stand clear during automated rhythm analysis.</p>
                <span className="action-hint">Tap to verify complete</span>
              </div>

              <div
                className={`resus-card ${completedSteps["r3"] ? "done" : ""}`}
                onClick={() => toggleChecklist("r3")}
              >
                <div className="resus-card-top">
                  <span className="resus-num">3</span>
                  <h4>30:2 COMPRESSIONS</h4>
                  <CheckCircle2 size={18} className={completedSteps["r3"] ? "accent-green" : "muted"} />
                </div>
                <p>Push hard and fast (100–120/min, 5 cm depth). Use handstand method or CMRS torso harness for leverage in 0g.</p>
                <span className="action-hint">Tap to verify complete</span>
              </div>

              <div
                className={`resus-card ${completedSteps["r4"] ? "done" : ""}`}
                onClick={() => toggleChecklist("r4")}
              >
                <div className="resus-card-top">
                  <span className="resus-num">4</span>
                  <h4>BVM VENTILATION</h4>
                  <CheckCircle2 size={18} className={completedSteps["r4"] ? "accent-green" : "muted"} />
                </div>
                <p>Deliver 2 gentle breaths using Bag-Valve-Mask with HEPA microbial filter attached to 100% emergency oxygen demand valve.</p>
                <span className="action-hint">Tap to verify complete</span>
              </div>
            </div>

            <div className="step-footer-row">
              <button
                type="button"
                className="tactical-btn ghost-drill-btn"
                onClick={() => setAssessmentStep("triage")}
              >
                Back to Triage
              </button>
              <button
                type="button"
                className="tactical-btn primary-drill-btn"
                onClick={() => setAssessmentStep("stabilization")}
              >
                Proceed to Step 3: Stabilization &amp; Comms <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STABILIZATION & COMMS */}
        {assessmentStep === "stabilization" && (
          <div className="step-view-card">
            <div className="step-card-header">
              <Activity size={20} className="accent-cyan" />
              <div>
                <h3>Step 3: Post-Event Stabilization &amp; Flight Surgeon Telemetry</h3>
                <p>Continuous vitals monitoring, asynchronous ground packets, and crew handover.</p>
              </div>
            </div>

            <div className="stabilization-grid">
              <div className="action-box">
                <h4>1. Continuous Vital Monitoring</h4>
                <p>Keep Pulse Oximeter, Blood Pressure cuff, and 12-lead telemetry leads connected.</p>
                <button
                  type="button"
                  className="tactical-btn small-btn"
                  onClick={() => onNavigateTab("vitals")}
                >
                  Open Vitals Guide <ChevronRight size={13} />
                </button>
              </div>

              <div className="action-box">
                <h4>2. Earth Telemetry Handover Packet</h4>
                <p>Transmit full chronological medical log to Earth Ground Control via delay-tolerant packet.</p>
                <button
                  type="button"
                  className="tactical-btn small-btn"
                  onClick={onOpenTimeline}
                >
                  <FileText size={13} /> View Timeline &amp; Export PDF
                </button>
              </div>
            </div>

            <div className="step-footer-row">
              <button
                type="button"
                className="tactical-btn ghost-drill-btn"
                onClick={() => setAssessmentStep("resuscitation")}
              >
                Back to Resuscitation
              </button>
              <button
                type="button"
                className="tactical-btn primary-drill-btn"
                onClick={handleResetAlert}
              >
                Finish Emergency Drill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Quick Gear Status Strip */}
      <div className="emergency-gear-strip">
        <span className="strip-title">CRITICAL GEAR STATUS:</span>
        <div className="gear-pills-row">
          <span className={`gear-pill ${aed?.status === "AVAILABLE" ? "ready" : "warn"}`}>
            AED: {aed?.status || "READY"}
          </span>
          <span className={`gear-pill ${bvm?.status === "AVAILABLE" ? "ready" : "warn"}`}>
            BVM Resuscitator: {bvm?.status || "READY"}
          </span>
          <span className={`gear-pill ${o2?.status === "AVAILABLE" ? "ready" : "warn"}`}>
            Emergency O₂: {o2?.status || "2000 PSI"}
          </span>
        </div>
        <button
          type="button"
          className="gear-link-btn"
          onClick={() => onNavigateTab("equipment")}
        >
          Manage All Gear <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
