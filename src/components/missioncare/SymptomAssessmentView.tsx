import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Info,
  Clock,
  ArrowRight,
  RotateCcw,
  FileText,
} from "lucide-react";
import {
  evaluateSymptomEscalation,
  addTimelineEntry,
  type SymptomAssessmentInput,
  type EscalationResult,
} from "../../services/missionCareService";

export default function SymptomAssessmentView() {
  const [primarySymptom, setPrimarySymptom] = useState("Acute Chest Pressure");
  const [onsetTime, setOnsetTime] = useState("10 minutes ago");
  const [isResponsive, setIsResponsive] = useState(true);
  const [avpuLevel, setAvpuLevel] = useState<"Alert" | "Verbal" | "Pain" | "Unresponsive">("Alert");
  const [isBreathingNormally, setIsBreathingNormally] = useState(true);
  const [breathingQuality, setBreathingQuality] = useState<"normal" | "rapid" | "labored" | "gasping" | "absent">("normal");
  const [hasChestPain, setHasChestPain] = useState(true);
  const [radiationToArm, setRadiationToArm] = useState(true);
  const [hasSevereHeadache, setHasSevereHeadache] = useState(false);
  const [hasCollapse, setHasCollapse] = useState(false);
  const [isGettingWorse, setIsGettingWorse] = useState(true);

  // Optional Vitals Input
  const [hrInput, setHrInput] = useState("96");
  const [spo2Input, setSpo2Input] = useState("97");
  const [bpInput, setBpInput] = useState("135/88");

  // Escalation Evaluation Result State
  const [result, setResult] = useState<EscalationResult | null>(null);

  const handleRunEvaluation = () => {
    const input: SymptomAssessmentInput = {
      primarySymptom,
      onsetTime,
      isResponsive,
      avpuLevel,
      isBreathingNormally,
      breathingQuality,
      hasChestPain,
      chestPainDetails: {
        character: "Crushing retrosternal tightness",
        radiationToArmOrJaw: radiationToArm,
        suddenOnset: true,
      },
      hasSevereHeadache,
      hasFaintingOrCollapse: hasCollapse,
      isGettingWorse,
      reportedVitals: {
        hr: hrInput ? Number(hrInput) : undefined,
        spo2: spo2Input ? Number(spo2Input) : undefined,
        bp: bpInput || undefined,
      },
    };

    const res = evaluateSymptomEscalation(input);
    setResult(res);

    addTimelineEntry({
      category: "ASSESSMENT",
      title: `Symptom Assessment: ${res.tierLabel}`,
      details: `Reported: ${primarySymptom} · AVPU: ${avpuLevel} · Breathing: ${breathingQuality} · Esc: ${res.tier}`,
      provenance: "MANUAL_ENTRY",
      author: "Crew Assessor",
      missionDay: 147,
    });
  };

  const handleReset = () => {
    setResult(null);
    setPrimarySymptom("Acute Chest Pressure");
    setIsResponsive(true);
    setAvpuLevel("Alert");
    setIsBreathingNormally(true);
    setBreathingQuality("normal");
    setHasChestPain(true);
    setRadiationToArm(true);
    setHasSevereHeadache(false);
    setHasCollapse(false);
    setIsGettingWorse(true);
  };

  return (
    <div className="symptom-assessment-root">
      {/* Non-Diagnostic Disclaimer */}
      <div className="assessment-disclaimer-card">
        <ShieldCheck size={18} className="accent-cyan" />
        <div>
          <strong>Non-Diagnostic Decision Support Disclaimer:</strong>
          <p>
            This rule-based escalation engine assists non-medical astronauts in categorizing operational urgency.
            It does <strong>NOT</strong> assert clinical diagnoses, prescribe medication, or replace Flight Surgeon clinical evaluation.
          </p>
        </div>
      </div>

      <div className="assessment-layout-grid">
        {/* Left Column: Interactive Questionnaire */}
        <div className="assessment-form-card">
          <div className="card-top">
            <span className="eyebrow">STRUCTURED INTAKE</span>
            <h3>Symptom Observation Questionnaire</h3>
          </div>

          <div className="form-sections-stack">
            {/* Question 1: Primary Symptom */}
            <div className="form-group">
              <label htmlFor="symptom-select">1. What primary symptom is present?</label>
              <select
                id="symptom-select"
                value={primarySymptom}
                onChange={(e) => setPrimarySymptom(e.target.value)}
                className="styled-select"
              >
                <option value="Acute Chest Pressure">Acute Chest Pressure / Tightness</option>
                <option value="Sudden Collapse / Unresponsiveness">Sudden Collapse / Unresponsiveness</option>
                <option value="Acute Breathing Difficulty / Dyspnea">Acute Breathing Difficulty / Dyspnea</option>
                <option value="Post-Workout Fainting / Syncope">Post-Workout Fainting / Syncope</option>
                <option value="Severe Acute Headache">Severe Acute Headache / Vision Loss</option>
                <option value="Blunt Trauma / Cabin Impact">Blunt Trauma / Bulkhead Impact</option>
                <option value="Heat Strain / Dehydration">Heat Strain / Dehydration Exhaustion</option>
                <option value="Other Mild Discomfort">Other Mild Discomfort</option>
              </select>
            </div>

            {/* Question 2: Responsiveness */}
            <div className="form-group">
              <label>2. Is the astronaut responsive? (AVPU Grade)</label>
              <div className="segmented-options-grid">
                {(["Alert", "Verbal", "Pain", "Unresponsive"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`segmented-btn ${avpuLevel === lvl ? "active" : ""}`}
                    onClick={() => {
                      setAvpuLevel(lvl);
                      setIsResponsive(lvl === "Alert" || lvl === "Verbal");
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Breathing Quality */}
            <div className="form-group">
              <label>3. How is the patient breathing?</label>
              <div className="segmented-options-grid">
                {(
                  [
                    { id: "normal", label: "Normal (Regular)" },
                    { id: "rapid", label: "Rapid (>24/m)" },
                    { id: "labored", label: "Labored / Wheezing" },
                    { id: "gasping", label: "Agonal / Gasping" },
                    { id: "absent", label: "Absent (Apnea)" },
                  ] as const
                ).map((bq) => (
                  <button
                    key={bq.id}
                    type="button"
                    className={`segmented-btn ${breathingQuality === bq.id ? "active" : ""}`}
                    onClick={() => {
                      setBreathingQuality(bq.id);
                      setIsBreathingNormally(bq.id === "normal");
                    }}
                  >
                    {bq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Chest Discomfort Details */}
            <div className="form-group">
              <label>4. Key Clinical Red Flags:</label>
              <div className="checkboxes-stack">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={hasChestPain}
                    onChange={(e) => setHasChestPain(e.target.checked)}
                  />
                  <span>Retrosternal chest discomfort or heaviness</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={radiationToArm}
                    onChange={(e) => setRadiationToArm(e.target.checked)}
                  />
                  <span>Pain radiates to left arm, neck, or jaw</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={hasCollapse}
                    onChange={(e) => setHasCollapse(e.target.checked)}
                  />
                  <span>Sudden loss of postural tone / collapse</span>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={isGettingWorse}
                    onChange={(e) => setIsGettingWorse(e.target.checked)}
                  />
                  <span>Symptoms rapidly worsening over minutes</span>
                </label>
              </div>
            </div>

            {/* Question 5: Available Vitals */}
            <div className="form-group">
              <label>5. Available Vital Measurements (If safely obtained):</label>
              <div className="mini-vitals-inputs-row">
                <div>
                  <small>Heart Rate (BPM):</small>
                  <input
                    type="text"
                    value={hrInput}
                    placeholder="96"
                    onChange={(e) => setHrInput(e.target.value)}
                    className="styled-input"
                  />
                </div>
                <div>
                  <small>SpO₂ (%):</small>
                  <input
                    type="text"
                    value={spo2Input}
                    placeholder="98"
                    onChange={(e) => setSpo2Input(e.target.value)}
                    className="styled-input"
                  />
                </div>
                <div>
                  <small>BP (mmHg):</small>
                  <input
                    type="text"
                    value={bpInput}
                    placeholder="120/80"
                    onChange={(e) => setBpInput(e.target.value)}
                    className="styled-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="button outline small-btn"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleRunEvaluation}
              >
                Evaluate Urgency & Guidance <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Transparent Escalation Guidance Output */}
        <div className="assessment-results-col">
          {result ? (
            <div className="evaluation-result-card">
              <div className="result-header" style={{ borderLeftColor: result.badgeColor }}>
                <span className="result-tier-badge" style={{ backgroundColor: `${result.badgeColor}25`, color: result.badgeColor }}>
                  {result.tierLabel}
                </span>
                <span className="protocol-ref">Protocol Ref: {result.applicableProtocolReference}</span>
              </div>

              {/* 1. What was reported */}
              <div className="res-section">
                <h4>WHAT WAS REPORTED</h4>
                <ul>
                  {result.whatWasReported.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Why it matters */}
              <div className="res-section">
                <h4>WHY IT MATTERS IN DEEP SPACE</h4>
                <ul>
                  {result.whyItMatters.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 3. What should happen next */}
              <div className="res-section action-next-section">
                <h4>WHAT SHOULD HAPPEN NEXT</h4>
                <ol>
                  {result.whatShouldHappenNext.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* 4. Missing Information */}
              <div className="res-section missing-section">
                <h4>WHAT INFORMATION IS CURRENTLY MISSING</h4>
                <ul>
                  {result.whatInformationIsMissing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="result-footer-disclaimer">
                <p>{result.disclaimer}</p>
              </div>
            </div>
          ) : (
            <div className="empty-evaluation-card">
              <HelpCircle size={32} className="accent-cyan" />
              <h4>Ready to Evaluate Symptom Urgency</h4>
              <p>
                Complete the questionnaire and click <strong>“Evaluate Urgency & Guidance”</strong> to run the conservative rule-based escalation engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
