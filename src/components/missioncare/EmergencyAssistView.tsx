import { useState } from "react";
import {
  AlertTriangle,
  Siren,
  ShieldAlert,
  Activity,
  Heart,
  Wind,
  UserX,
  Compass,
  Zap,
  Radio,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Info,
  ShieldCheck,
  FileText,
  Volume2,
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

type EmergencyCategory =
  | "chest_pain_collapse"
  | "unresponsiveness"
  | "breathing_difficulty"
  | "fainting"
  | "serious_injury"
  | "severe_headache"
  | "dehydration_heat";

export default function EmergencyAssistView({
  environment,
  equipment,
  onNavigateTab,
  onOpenTimeline,
}: EmergencyAssistViewProps) {
  const [activeScenario, setActiveScenario] = useState<EmergencyCategory>("chest_pain_collapse");
  const [alertActive, setAlertActive] = useState(false);
  const [alertBroadcastTime, setAlertBroadcastTime] = useState<string | null>(null);

  // Workflow steps inside Chest Pain & Collapse
  const [assessmentStep, setAssessmentStep] = useState<"triage" | "resuscitation" | "stabilization">("triage");
  const [avpuChoice, setAvpuChoice] = useState<"Alert" | "Verbal" | "Pain" | "Unresponsive" | null>(null);
  const [breathingChoice, setBreathingChoice] = useState<"normal" | "abnormal_gasping" | "absent" | null>(null);

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

  // Check critical equipment availability
  const aed = equipment.find((e) => e.name.toLowerCase().includes("defibrillator"));
  const bvm = equipment.find((e) => e.name.toLowerCase().includes("bag valve"));
  const o2 = equipment.find((e) => e.name.toLowerCase().includes("oxygen"));

  const isAedAvailable = aed && aed.status === "AVAILABLE";
  const isBvmAvailable = bvm && bvm.status === "AVAILABLE";
  const isO2Available = o2 && o2.status === "AVAILABLE";

  return (
    <div className="emergency-assist-root">
      {/* Primary Emergency Banner */}
      <div className={`emergency-hero-banner ${alertActive ? "alert-live-pulse" : ""}`}>
        <div className="hero-top-row">
          <div className="emergency-status-badge">
            <span className={`status-pill ${alertActive ? "status-emergency" : "status-standby"}`}>
              {alertActive ? "● ACTIVE CREW EMERGENCY" : "○ EMERGENCY READINESS STANDBY"}
            </span>
            <span className="env-pill">
              {envInfo.name} ({envInfo.gravityLabel})
            </span>
          </div>

          <div className="comm-latency-indicator">
            <Radio size={14} className={envInfo.commLatencyMinutes > 2 ? "accent-orange" : "accent-cyan"} />
            <span>
              Ground Comm Latency: <strong>{envInfo.commLatencyMinutes} min one-way</strong>
            </span>
          </div>
        </div>

        <div className="hero-main-content">
          <div className="hero-text-col">
            <h2>Spaceflight Medical Emergency Decision Support</h2>
            <p>
              Autonomous non-clinical operational guidance for non-medical crewmates. In sudden collapse with abnormal breathing,
              <strong> DO NOT DELAY EMERGENCY RESPONSE</strong> while waiting for wearable readings or telemetry sync.
            </p>
          </div>

          <div className="hero-actions-col">
            {!alertActive ? (
              <button
                type="button"
                className="button primary emergency-trigger-btn"
                onClick={handleBroadcastAlert}
              >
                <Siren size={18} /> BROADCAST CREW ALERT
              </button>
            ) : (
              <div className="alert-active-controls">
                <span className="alert-time-label">
                  ALERT BROADCAST AT {alertBroadcastTime}
                </span>
                <button
                  type="button"
                  className="button outline small-btn"
                  onClick={handleResetAlert}
                >
                  Clear / Stand Down Alert
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Operational Safety Notice */}
        <div className="safety-disclaimer-strip">
          <ShieldAlert size={14} className="accent-rose" />
          <span>
            <strong>Safety Mandate:</strong> ASTRA MissionCare does not replace trained flight surgeons. Follow certified mission checklists. Do not invent physical microgravity CPR maneuvers.
          </span>
        </div>
      </div>

      {/* Emergency Scenario Selector Grid */}
      <div className="scenario-selector-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">SELECT MEDICAL EVENT</span>
            <h3>Prioritized Emergency Scenarios</h3>
          </div>
          <span className="tag">8 PROTOCOLS AVAILABLE</span>
        </div>

        <div className="scenario-cards-grid">
          <button
            type="button"
            className={`scenario-card ${activeScenario === "chest_pain_collapse" ? "active" : ""}`}
            onClick={() => setActiveScenario("chest_pain_collapse")}
          >
            <div className="scen-top">
              <span className="severity-badge critical">TOP CRITICAL</span>
              <Heart size={18} className="accent-rose" />
            </div>
            <h4>Chest Pain & Sudden Collapse</h4>
            <p>Primary NASA Challenge workflow: acute thoracic pain followed by loss of consciousness.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "unresponsiveness" ? "active" : ""}`}
            onClick={() => setActiveScenario("unresponsiveness")}
          >
            <div className="scen-top">
              <span className="severity-badge critical">CRITICAL</span>
              <UserX size={18} className="accent-rose" />
            </div>
            <h4>Unresponsiveness (AVPU Grade U)</h4>
            <p>Incapacitated astronaut unresponsive to verbal and physical stimuli.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "breathing_difficulty" ? "active" : ""}`}
            onClick={() => setActiveScenario("breathing_difficulty")}
          >
            <div className="scen-top">
              <span className="severity-badge urgent">URGENT</span>
              <Wind size={18} className="accent-orange" />
            </div>
            <h4>Acute Breathing Difficulty</h4>
            <p>Progressive dyspnea, suspected atmospheric toxicity, or airway obstruction.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "fainting" ? "active" : ""}`}
            onClick={() => setActiveScenario("fainting")}
          >
            <div className="scen-top">
              <span className="severity-badge moderate">MODERATE</span>
              <Activity size={18} className="accent-yellow" />
            </div>
            <h4>Post-Exercise Syncope / Fainting</h4>
            <p>Orthostatic deconditioning and venous pooling following high-intensity workout.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "serious_injury" ? "active" : ""}`}
            onClick={() => setActiveScenario("serious_injury")}
          >
            <div className="scen-top">
              <span className="severity-badge urgent">URGENT</span>
              <AlertTriangle size={18} className="accent-orange" />
            </div>
            <h4>Cabin Trauma & Serious Injury</h4>
            <p>Blunt impact against module bulkhead, equipment laceration, or burn.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "severe_headache" ? "active" : ""}`}
            onClick={() => setActiveScenario("severe_headache")}
          >
            <div className="scen-top">
              <span className="severity-badge moderate">MODERATE</span>
              <Zap size={18} className="accent-yellow" />
            </div>
            <h4>Severe Neurological Headache</h4>
            <p>Sudden focal headache, visual disturbance, or elevated cabin CO₂ reaction.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === "dehydration_heat" ? "active" : ""}`}
            onClick={() => setActiveScenario("dehydration_heat")}
          >
            <div className="scen-top">
              <span className="severity-badge moderate">MODERATE</span>
              <Compass size={18} className="accent-yellow" />
            </div>
            <h4>Heat Stress / Severe Dehydration</h4>
            <p>Thermal loop malfunction or inadequate fluid intake during EVA / workout.</p>
          </button>
        </div>
      </div>

      {/* Active Emergency Workflow Container */}
      <div className="active-workflow-panel">
        {/* Scenario 1: Chest Pain & Sudden Collapse Main NASA Challenge Workflow */}
        {activeScenario === "chest_pain_collapse" && (
          <div className="workflow-detail-box">
            <div className="workflow-header">
              <div>
                <span className="eyebrow">NASA CHALLENGE DEMONSTRATION WORKFLOW</span>
                <h3>Chest Pain & Collapse Action Protocol</h3>
                <p className="workflow-sub">
                  Target Scenario: Halfway to Mars, crewmate suddenly collapses with acute chest pain.
                </p>
              </div>

              <div className="workflow-nav-steps">
                <button
                  type="button"
                  className={`step-btn ${assessmentStep === "triage" ? "active" : ""}`}
                  onClick={() => setAssessmentStep("triage")}
                >
                  1. Immediate Triage
                </button>
                <button
                  type="button"
                  className={`step-btn ${assessmentStep === "resuscitation" ? "active" : ""}`}
                  onClick={() => setAssessmentStep("resuscitation")}
                >
                  2. Approved Resuscitation
                </button>
                <button
                  type="button"
                  className={`step-btn ${assessmentStep === "stabilization" ? "active" : ""}`}
                  onClick={() => setAssessmentStep("stabilization")}
                >
                  3. Stabilization & Comms
                </button>
              </div>
            </div>

            {/* Step 1: Immediate Triage */}
            {assessmentStep === "triage" && (
              <div className="workflow-step-content">
                <div className="action-callout-card alert-callout">
                  <ShieldAlert size={22} className="accent-rose" />
                  <div>
                    <h4>CRITICAL TIME-SENSITIVE DECISION POINT</h4>
                    <p>
                      Check responsiveness and breathing right now.
                      <strong> Do NOT wait for wearable heart rate graphs or blood pressure cuffs.</strong>
                    </p>
                  </div>
                </div>

                <div className="triage-assessment-grid">
                  <div className="assessment-question-box">
                    <span className="q-badge">QUESTION 1</span>
                    <h4>Is the collapsed astronaut responsive?</h4>
                    <p>Tap shoulder firmly and ask loudly: “Can you hear me?”</p>

                    <div className="options-stack">
                      <button
                        type="button"
                        className={`opt-btn ${avpuChoice === "Alert" ? "selected" : ""}`}
                        onClick={() => setAvpuChoice("Alert")}
                      >
                        <strong>Alert & Speaking:</strong> Eyes open, answering questions.
                      </button>
                      <button
                        type="button"
                        className={`opt-btn ${avpuChoice === "Verbal" ? "selected" : ""}`}
                        onClick={() => setAvpuChoice("Verbal")}
                      >
                        <strong>Verbal Only:</strong> Responds only to loud voice cues.
                      </button>
                      <button
                        type="button"
                        className={`opt-btn ${avpuChoice === "Unresponsive" ? "selected" : ""}`}
                        onClick={() => setAvpuChoice("Unresponsive")}
                      >
                        <strong className="accent-rose">Unresponsive:</strong> No eye opening or purposeful movement.
                      </button>
                    </div>
                  </div>

                  <div className="assessment-question-box">
                    <span className="q-badge">QUESTION 2</span>
                    <h4>Is the patient breathing normally?</h4>
                    <p>Observe chest movement for no more than 10 seconds.</p>

                    <div className="options-stack">
                      <button
                        type="button"
                        className={`opt-btn ${breathingChoice === "normal" ? "selected" : ""}`}
                        onClick={() => setBreathingChoice("normal")}
                      >
                        <strong>Normal Breathing:</strong> Regular chest rise and fall.
                      </button>
                      <button
                        type="button"
                        className={`opt-btn ${breathingChoice === "abnormal_gasping" ? "selected" : ""}`}
                        onClick={() => setBreathingChoice("abnormal_gasping")}
                      >
                        <strong className="accent-rose">Agonal / Gasping:</strong> Infrequent, labored, noisy gasps.
                      </button>
                      <button
                        type="button"
                        className={`opt-btn ${breathingChoice === "absent" ? "selected" : ""}`}
                        onClick={() => setBreathingChoice("absent")}
                      >
                        <strong className="accent-rose">Absent:</strong> No detectable chest movement or air movement.
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dynamic Outcome Directives */}
                {(avpuChoice === "Unresponsive" || breathingChoice === "absent" || breathingChoice === "abnormal_gasping") && (
                  <div className="decision-directive-box urgent-directive">
                    <div className="directive-top">
                      <AlertTriangle size={20} className="accent-rose" />
                      <h4>UNRESPONSIVE WITH ABNORMAL BREATHING — INITIATE RESUSCITATION</h4>
                    </div>
                    <p>
                      Agonal gasping or apnea in an unresponsive crewmate is treated as cardiac arrest. Proceed immediately to Step 2 (Approved Resuscitation).
                    </p>
                    <button
                      type="button"
                      className="button primary"
                      onClick={() => setAssessmentStep("resuscitation")}
                    >
                      Proceed to Resuscitation Protocol <ArrowRight size={15} />
                    </button>
                  </div>
                )}

                {avpuChoice === "Alert" && breathingChoice === "normal" && (
                  <div className="decision-directive-box moderate-directive">
                    <div className="directive-top">
                      <CheckCircle2 size={20} className="accent-yellow" />
                      <h4>ASTRONAUT IS RESPONSIVE — PREVENT CARDIAC DECOMPENSATION</h4>
                    </div>
                    <p>
                      Patient is conscious with severe chest discomfort. Maintain strict physical rest, attach vital signs monitor, and prepare AED without applying pads until indicated.
                    </p>
                    <button
                      type="button"
                      className="button primary"
                      onClick={() => setAssessmentStep("stabilization")}
                    >
                      Proceed to Stabilization & Monitoring <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Approved Resuscitation */}
            {assessmentStep === "resuscitation" && (
              <div className="workflow-step-content">
                <div className="protocol-reference-banner">
                  <FileText size={18} className="accent-cyan" />
                  <div>
                    <strong>Approved Mission Protocol:</strong> NASA / ISS Flight Rule B13-102 & Deep Space Autonomous Resuscitation Standard.
                    <span className="source-note">Terrestrial CPR does not apply in 0g without restraints.</span>
                  </div>
                </div>

                <div className="resuscitation-steps-list">
                  <div className="resus-step-item">
                    <span className="num">1</span>
                    <div className="step-text">
                      <h4>Patient Stabilization & Restraint</h4>
                      <p>
                        In microgravity (0g), chest compressions push the rescuer away. Move patient immediately to the
                        <strong> Crew Medical Restraint System (CMRS)</strong> backboard or secure patient using torso belts.
                        The rescuer must anchor feet into foot loops or apply the reverse handstand bulkhead method.
                      </p>
                    </div>
                  </div>

                  <div className="resus-step-item">
                    <span className="num">2</span>
                    <div className="step-text">
                      <h4>Automated External Defibrillator (AED) Deployment</h4>
                      <p>
                        Power on Defibrillator unit. Status:{" "}
                        <strong className={isAedAvailable ? "accent-mint" : "accent-rose"}>
                          {isAedAvailable ? "AVAILABLE in Medical Rack" : "⚠️ MARKED UNAVAILABLE"}
                        </strong>.
                        Apply pads firmly to bare upper right chest and lower left ribs. Follow voice prompts.
                        <strong> Ensure all crew release patient during analysis and shock delivery.</strong>
                      </p>
                    </div>
                  </div>

                  <div className="resus-step-item">
                    <span className="num">3</span>
                    <div className="step-text">
                      <h4>Airway & Ventilation via Bag Valve Mask (BVM)</h4>
                      <p>
                        Insert oropharyngeal airway if trained. Fit BVM with viral/bacterial filter snugly over mouth and nose using C-E hand grip.
                        Deliver 1 gentle breath every 6 seconds with chest rise.
                      </p>
                    </div>
                  </div>

                  <div className="resus-step-item">
                    <span className="num">4</span>
                    <div className="step-text">
                      <h4>Continuous Cycle & Non-Interruption</h4>
                      <p>
                        Continue cycles of approved compressions and ventilations until patient exhibits signs of life, AED directs a pause, or medical officer assumes command.
                        <strong> Never stop compressions to take blood pressure or routine readings.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="step-footer-row">
                  <button
                    type="button"
                    className="button outline small-btn"
                    onClick={() => setAssessmentStep("triage")}
                  >
                    Back to Triage
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => setAssessmentStep("stabilization")}
                  >
                    Proceed to Stabilization & Handover <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Stabilization & Comms */}
            {assessmentStep === "stabilization" && (
              <div className="workflow-step-content">
                <div className="action-callout-card">
                  <Radio size={20} className="accent-cyan" />
                  <div>
                    <h4>Post-Event Stabilization & Deep Space Handover</h4>
                    <p>
                      Patient pulse restored or stabilized. Maintain 100% rest, attach diagnostic telemetry, and log events.
                    </p>
                  </div>
                </div>

                <div className="stabilization-grid">
                  <div className="stab-card">
                    <h4>1. Diagnostic Vitals</h4>
                    <p>Now is the time to obtain full vital measurements:</p>
                    <div className="btn-stack">
                      <button
                        type="button"
                        className="button outline small-btn"
                        onClick={() => onNavigateTab("vitals")}
                      >
                        Open Vital Measurement Guide <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="stab-card">
                    <h4>2. Crew Coordination</h4>
                    <p>Review assigned roles and outstanding tasks:</p>
                    <div className="btn-stack">
                      <button
                        type="button"
                        className="button outline small-btn"
                        onClick={() => onNavigateTab("crew")}
                      >
                        Open Crew Response Coordinator <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="stab-card">
                    <h4>3. Ground Handover & Timeline</h4>
                    <p>Export complete timestamped event record:</p>
                    <div className="btn-stack">
                      <button
                        type="button"
                        className="button outline small-btn"
                        onClick={onOpenTimeline}
                      >
                        View & Export Emergency Timeline <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other scenarios: clear educational escalation without inventing procedures */}
        {activeScenario !== "chest_pain_collapse" && (
          <div className="workflow-detail-box">
            <div className="workflow-header">
              <div>
                <span className="eyebrow">AEROSPACE EMERGENCY RECOGNITION</span>
                <h3>{activeScenario.toUpperCase().replace(/_/g, " ")}</h3>
                <p className="workflow-sub">
                  Initial non-diagnostic actions and approved escalation pathways.
                </p>
              </div>
            </div>

            <div className="workflow-step-content">
              <div className="action-callout-card">
                <ShieldCheck size={20} className="accent-mint" />
                <div>
                  <h4>Primary Action Directive</h4>
                  <p>
                    1. Ensure immediate scene safety. 2. Place patient in safe resting posture. 3. Notify crewmates. 4. Collect baseline vital signs without administering unapproved medication.
                  </p>
                </div>
              </div>

              <div className="subpage-action-links">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => onNavigateTab("assessment")}
                >
                  Run Detailed Symptom Assessment Engine <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="button outline"
                  onClick={() => onNavigateTab("vitals")}
                >
                  Launch Vital Measurement Guide <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Equipment Readiness Strip */}
      <div className="equipment-readiness-strip">
        <div className="strip-title">
          <span>EMERGENCY EQUIPMENT READINESS ({envInfo.name}):</span>
        </div>
        <div className="equip-badges-row">
          <span className={`equip-badge ${isAedAvailable ? "available" : "unavailable"}`}>
            AED: {isAedAvailable ? "AVAILABLE" : "UNAVAILABLE"}
          </span>
          <span className={`equip-badge ${isBvmAvailable ? "available" : "unavailable"}`}>
            BVM Resuscitator: {isBvmAvailable ? "AVAILABLE" : "UNAVAILABLE"}
          </span>
          <span className={`equip-badge ${isO2Available ? "available" : "unavailable"}`}>
            Emergency O₂: {isO2Available ? "AVAILABLE" : "UNAVAILABLE"}
          </span>
          <button
            type="button"
            className="text-link-btn"
            onClick={() => onNavigateTab("equipment")}
          >
            Configure Inventory →
          </button>
        </div>
      </div>
    </div>
  );
}
