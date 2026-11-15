import { useState } from "react";
import {
  Heart,
  Wind,
  Activity,
  Thermometer,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info,
  Save,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  VITAL_GUIDES,
  validateVitalInput,
  saveRecordedVital,
  getRecordedVitals,
  type VitalType,
  type RecordedVital,
} from "../../services/missionCareService";

export default function VitalMeasurementGuideView() {
  const [selectedVital, setSelectedVital] = useState<VitalType>("hr");

  // Form State
  const [inputVal, setInputVal] = useState("");
  const [sourceChoice, setSourceChoice] = useState<"MANUAL_ENTRY" | "SIMULATED_SENSOR" | "WEARABLE">("MANUAL_ENTRY");
  const [notesInput, setNotesInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const guide = VITAL_GUIDES[selectedVital];
  const history = getRecordedVitals();
  const vitalHistory = history.filter((v) => v.type === selectedVital);

  const handleSelectVital = (v: VitalType) => {
    setSelectedVital(v);
    setInputVal("");
    setValidationError(null);
    setSuccessNotice(null);
  };

  const handleSaveVital = () => {
    setValidationError(null);
    setSuccessNotice(null);

    const validation = validateVitalInput(selectedVital, inputVal);
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid entry.");
      return;
    }

    const saved = saveRecordedVital({
      type: selectedVital,
      value: selectedVital === "bp" || selectedVital === "avpu" ? inputVal : Number(inputVal),
      unit: guide.unit,
      missionDay: 147,
      source: sourceChoice,
      notes: notesInput.trim() || undefined,
    });

    setSuccessNotice(`Saved ${guide.label}: ${saved.value} ${saved.unit} (${saved.source}). Logged to emergency timeline.`);
    setInputVal("");
    setNotesInput("");
  };

  return (
    <div className="vitals-guide-root">
      {/* Top Banner Notice */}
      <div className="vitals-warning-banner">
        <ShieldAlert size={18} className="accent-rose" />
        <span>
          <strong>Emergency Priority Rule:</strong> Never interrupt urgent life-saving interventions (such as CPR, AED analysis, or hemorrhage control) to obtain routine vital signs.
        </span>
      </div>

      {/* Horizontal Vital Selector Tabs */}
      <div className="vitals-tabs-bar">
        {(
          [
            { id: "hr", label: "Heart Rate", icon: Heart },
            { id: "spo2", label: "SpO₂ Saturation", icon: Activity },
            { id: "bp", label: "Blood Pressure", icon: Activity },
            { id: "temp", label: "Temperature", icon: Thermometer },
            { id: "rr", label: "Respiratory Rate", icon: Wind },
            { id: "avpu", label: "AVPU Consciousness", icon: Eye },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              className={`vital-tab-pill ${selectedVital === t.id ? "active" : ""}`}
              onClick={() => handleSelectVital(t.id)}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Educational Tutorial (Left) + Data Entry & History (Right) */}
      <div className="vitals-split-layout">
        {/* Left Column: Educational Tutorial Card */}
        <div className="vitals-tutorial-card">
          <div className="tut-header">
            <span className="eyebrow">MEASUREMENT TUTORIAL</span>
            <h2>{guide.label} ({guide.unit})</h2>
            <span className="normal-range-pill">Reference: {guide.normalRangeLabel}</span>
          </div>

          {/* Interactive Visual Gauge / Diagram Box */}
          <div className="vital-visual-stage">
            <div className={`vital-indicator-ring ring-${selectedVital}`}>
              <span className="ring-type-label">{guide.shortLabel}</span>
              <span className="ring-unit-label">{guide.unit}</span>
            </div>
            <div className="stage-meta-info">
              <strong>Concerning Threshold:</strong>
              <p>{guide.concerningCriteria}</p>
            </div>
          </div>

          <div className="tut-section">
            <h4>What It Measures</h4>
            <p>{guide.whatItMeasures}</p>
          </div>

          <div className="tut-section">
            <h4>Why It Matters in Spaceflight</h4>
            <p>{guide.whyItMatters}</p>
          </div>

          <div className="tut-section">
            <h4>Required Onboard Equipment</h4>
            <p>{guide.requiredEquipment}</p>
          </div>

          <div className="tut-section">
            <h4>Step-by-Step Educational Measurement Instructions</h4>
            <ol className="steps-ol">
              {guide.measurementSteps.map((step, idx) => (
                <li key={idx}>
                  <span className="step-circle">{idx + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="tut-section limitations-box">
            <h4>
              <Info size={14} className="accent-cyan" /> Known Spaceflight Limitations
            </h4>
            <ul>
              {guide.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Entry Form & History */}
        <div className="vitals-entry-col">
          {/* Form Card */}
          <div className="vitals-form-card">
            <div className="form-header">
              <span className="eyebrow">RECORD MEASUREMENT</span>
              <h3>Enter {guide.shortLabel} Observation</h3>
            </div>

            <div className="form-body">
              <div className="input-group">
                <label htmlFor="vital-input">
                  Reading Value ({guide.unit}):
                </label>
                {selectedVital === "avpu" ? (
                  <select
                    id="vital-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="styled-select"
                  >
                    <option value="">Select Responsiveness Grade</option>
                    <option value="Alert">Alert (Oriented x 3)</option>
                    <option value="Verbal">Verbal (Awakens to voice)</option>
                    <option value="Pain">Pain (Grimace or withdraws)</option>
                    <option value="Unresponsive">Unresponsive (No reaction)</option>
                  </select>
                ) : (
                  <input
                    id="vital-input"
                    type="text"
                    value={inputVal}
                    placeholder={
                      selectedVital === "bp"
                        ? "e.g. 120/80"
                        : selectedVital === "hr"
                          ? "e.g. 72"
                          : selectedVital === "spo2"
                            ? "e.g. 98"
                            : selectedVital === "temp"
                              ? "e.g. 36.8"
                              : "e.g. 16"
                    }
                    onChange={(e) => setInputVal(e.target.value)}
                    className="styled-input"
                  />
                )}
              </div>

              <div className="input-group">
                <label>Data Provenance / Source:</label>
                <div className="source-toggle-row">
                  {(
                    [
                      { id: "MANUAL_ENTRY", label: "Manual Entry" },
                      { id: "SIMULATED_SENSOR", label: "Simulated Sensor" },
                      { id: "WEARABLE", label: "Wearable Device" },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`source-chip ${sourceChoice === s.id ? "active" : ""}`}
                      onClick={() => setSourceChoice(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="vital-notes">Clinical Context & Notes (Optional):</label>
                <input
                  id="vital-notes"
                  type="text"
                  value={notesInput}
                  placeholder="e.g. Seated in CMRS, at rest, post-alert"
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="styled-input"
                />
              </div>

              {validationError && (
                <div className="validation-error-banner">
                  <AlertCircle size={15} />
                  <span>{validationError}</span>
                </div>
              )}

              {successNotice && (
                <div className="validation-success-banner">
                  <CheckCircle2 size={15} />
                  <span>{successNotice}</span>
                </div>
              )}

              <button
                type="button"
                className="button primary full-width"
                onClick={handleSaveVital}
              >
                <Save size={16} /> Save Reading to Event Log
              </button>
            </div>
          </div>

          {/* History Card */}
          <div className="vitals-history-card">
            <div className="panel-heading">
              <span>RECENT {guide.shortLabel.toUpperCase()} OBSERVATIONS</span>
              <span className="tag">{vitalHistory.length} LOGGED</span>
            </div>

            <div className="history-entries-list">
              {vitalHistory.length > 0 ? (
                vitalHistory.slice(0, 5).map((vh) => (
                  <div key={vh.id} className="history-entry-item">
                    <div className="entry-left">
                      <span className={`entry-val ${vh.isConcerning ? "concerning" : ""}`}>
                        {vh.value} {vh.unit}
                      </span>
                      <span className="entry-source-badge">{vh.source}</span>
                    </div>
                    <div className="entry-right">
                      <span className="entry-time">{vh.formattedTime}</span>
                      {vh.notes && <small className="entry-notes">{vh.notes}</small>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-history-box">
                  <p>No {guide.label.toLowerCase()} entries recorded today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
