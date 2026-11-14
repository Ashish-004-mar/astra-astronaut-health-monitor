import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  Gauge,
  PlusCircle,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Info,
  Activity,
  Check,
  FileText,
  AlertOctagon,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  getAquaGuardState,
  setAquaGuardScenario,
  addHydrationLog,
  addWaterSample,
  deleteSample,
  resetAquaGuardToDefaults,
  updateHydrationTarget,
  getWaterQualityHistory,
  getTodayHydrationTotal,
  NASA_WATER_LIMITS,
  type AquaGuardScenario,
  type MicrobialStatus,
  type WaterQualitySample,
} from "../../services/aquaguardService";
import { audioAlertService, type ActiveAlert } from "../../services/audioAlertService";

interface AquaGuardSubpageProps {
  onBack: () => void;
}

export default function AquaGuardSubpage({ onBack }: AquaGuardSubpageProps) {
  const [state, setState] = useState(() => getAquaGuardState());
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>(() =>
    audioAlertService.getActiveAlerts(),
  );
  const [isSirenSounding, setIsSirenSounding] = useState(() => audioAlertService.getIsSounding());
  const [isMuted, setIsMuted] = useState(() => audioAlertService.getIsMuted());

  // Quick hydration input
  const [customMl, setCustomMl] = useState<number>(300);

  // Sample Form State
  const [sampleSource, setSampleSource] = useState<WaterQualitySample["source"]>("Galley PWD");
  const [sampleToc, setSampleToc] = useState<number>(245);
  const [sampleCond, setSampleCond] = useState<number>(1.3);
  const [sampleMicrobial, setSampleMicrobial] = useState<MicrobialStatus>("NEGATIVE");
  const [sampleNotes, setSampleNotes] = useState<string>("");
  const [formFeedback, setFormFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);

  // Active Hotspot on Image
  const [activeHotspot, setActiveHotspot] = useState<string | null>("pwd");

  // Subscribe to Audio Alert Siren events
  useEffect(() => {
    const unsubscribe = audioAlertService.subscribe((alerts, sounding, muted) => {
      setActiveAlerts(alerts);
      setIsSirenSounding(sounding);
      setIsMuted(muted);
    });
    return () => unsubscribe();
  }, []);

  const historyData = getWaterQualityHistory();
  const latestSample = state.samples[0];
  const todayHydration = getTodayHydrationTotal(147);
  const hydrationPct = Math.min(100, Math.round((todayHydration / state.targetHydrationMl) * 100));

  const handleScenarioChange = (scenario: AquaGuardScenario) => {
    const updated = setAquaGuardScenario(scenario);
    setState(updated);
  };

  const handleLogHydration = (amount: number, sourceName = "Galley PWD") => {
    const updated = addHydrationLog(amount, sourceName);
    setState(updated);
  };

  const handleAddSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addWaterSample({
      source: sampleSource,
      tocPpb: Number(sampleToc),
      conductivityUscm: Number(sampleCond),
      microbialStatus: sampleMicrobial,
      notes: sampleNotes,
    });

    if (!res.success) {
      setFormFeedback({ msg: res.error || "Failed to submit test.", isError: true });
      return;
    }

    if (res.state) {
      setState(res.state);
    }
    setFormFeedback({ msg: "Water sample recorded and logged into ECLSS telemetry store." });
    setSampleNotes("");
    setTimeout(() => setFormFeedback(null), 4000);
  };

  const handleDeleteSample = (id: string) => {
    const updated = deleteSample(id);
    setState(updated);
  };

  const handleResetDefaults = () => {
    const updated = resetAquaGuardToDefaults();
    setState(updated);
  };

  const handleToggleSilence = () => {
    if (isSirenSounding || !isMuted) {
      audioAlertService.silenceAlarm();
    } else {
      audioAlertService.unmute();
    }
  };

  const handleTestSiren = () => {
    audioAlertService.testSiren();
  };

  return (
    <div className="subpage-container aquaguard-subpage">
      {/* Subpage Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO SPACE
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            SPACE <span>/</span> ECLSS WATER RECOVERY SYSTEM & HYDRATION
          </div>
          <h1>ASTRONAUT AQUAGUARD</h1>
          <p className="subpage-subtitle">
            Closed-loop water safety telemetry, in-line Total Organic Carbon (TOC) & conductivity
            monitoring, and bioastronautics crew hydration management based on NASA ISS WRS.
          </p>
        </div>
      </div>

      {/* Global Siren / Alert Banner */}
      {(isSirenSounding || state.scenario !== "NOMINAL") && (
        <div
          className={`aquaguard-siren-banner ${
            state.scenario === "ELEVATED_TOC"
              ? "alert-amber"
              : state.scenario === "MICROBIAL_FLAG"
                ? "alert-red"
                : "alert-active"
          }`}
        >
          <div className="siren-info-col">
            <div className="siren-pulse-icon">
              <AlertOctagon size={24} className="siren-strobe-icon" />
            </div>
            <div>
              <span className="siren-title">
                {isSirenSounding ? "🚨 AUDIBLE SIREN ACTIVE:" : "⚠️ ACTIVE WATER QUALITY CAUTION:"}{" "}
                {state.scenario === "ELEVATED_TOC"
                  ? "ELEVATED TOTAL ORGANIC CARBON (620 ppb > 500 ppb LIMIT)"
                  : state.scenario === "MICROBIAL_FLAG"
                    ? "MICROBIAL CULTURE FLAGGED (>1 CFU/100 mL)"
                    : "ACTIVE CAUTION"}
              </span>
              <p className="siren-desc">
                {latestSample?.statusReason || "Potable water line requires immediate crew verification."}
              </p>
            </div>
          </div>

          <div className="siren-controls-group">
            <button
              className="button primary siren-silence-btn"
              onClick={handleToggleSilence}
              title="Silence or mute the audible alarm klaxon"
            >
              <VolumeX size={16} /> SILENCE SIREN
            </button>
            <button
              className="button outline siren-test-btn"
              onClick={handleTestSiren}
              title="Test a 3-second audible alarm blast"
            >
              <Volume2 size={16} /> TEST SIREN
            </button>
          </div>
        </div>
      )}

      {/* Demonstration Scenarios Selector */}
      <div className="aquaguard-scenario-toolbar">
        <div className="scenario-label-group">
          <Layers size={16} className="accent-cyan" />
          <span className="sc-label">DEMO SCENARIO:</span>
        </div>
        <div className="scenario-buttons-row">
          <button
            type="button"
            className={`sc-button ${state.scenario === "NOMINAL" ? "active" : ""}`}
            onClick={() => handleScenarioChange("NOMINAL")}
          >
            <CheckCircle2 size={14} className="accent-mint" /> 1. NOMINAL OPS (240 ppb)
          </button>
          <button
            type="button"
            className={`sc-button ${state.scenario === "ELEVATED_TOC" ? "active warning" : ""}`}
            onClick={() => handleScenarioChange("ELEVATED_TOC")}
          >
            <AlertTriangle size={14} className="accent-amber" /> 2. ELEVATED TOC (620 ppb)
          </button>
          <button
            type="button"
            className={`sc-button ${state.scenario === "MICROBIAL_FLAG" ? "active danger" : ""}`}
            onClick={() => handleScenarioChange("MICROBIAL_FLAG")}
          >
            <AlertOctagon size={14} className="accent-red" /> 3. MICROBIAL FLAG (COLIFORM)
          </button>
        </div>

        <div className="sc-provenance-tag">
          <span>SIMULATED NASA ECLSS TELEMETRY</span>
        </div>
      </div>

      {/* SECTION 1: IN-FLIGHT HARDWARE SAMPLING & ASTRONAUT TELEMETRY (IMAGE INTEGRATION) */}
      <section className="panel aquaguard-image-telemetry-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">NASA ISS ECLSS IN-FLIGHT HARDWARE</span>
            <h2>In-Flight Potable Water Sampling & Hardware Telemetry</h2>
          </div>
          <span className="badge-eclss-pill">
            <ShieldCheck size={14} /> 98.4% ECLSS RECOVERY MILESTONE
          </span>
        </div>

        <div className="image-telemetry-grid">
          {/* 3D Holographic / Glowing Image Card */}
          <div className="holographic-image-card">
            <div className="image-viewport">
              <img
                src="/media/aquaguard_sampling.jpg"
                alt="NASA Astronaut Nicole Mann sampling potable water on ISS ECLSS rack"
                className="astronaut-hardware-img"
              />

              {/* Animated HUD Laser Scanning Line */}
              <div className="hud-scan-beam" />

              {/* Glowing Interactive Hotspots */}
              <button
                type="button"
                className={`hardware-hotspot hotspot-pwd ${activeHotspot === "pwd" ? "active" : ""}`}
                onClick={() => setActiveHotspot("pwd")}
                title="Galley Potable Water Dispenser (PWD)"
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-label">1. PWD Port</span>
              </button>

              <button
                type="button"
                className={`hardware-hotspot hotspot-bioserve ${activeHotspot === "bioserve" ? "active" : ""}`}
                onClick={() => setActiveHotspot("bioserve")}
                title="BioServe Environmental & ECLSS Racks"
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-label">2. BioServe Rack</span>
              </button>

              <button
                type="button"
                className={`hardware-hotspot hotspot-sensor ${activeHotspot === "sensor" ? "active" : ""}`}
                onClick={() => setActiveHotspot("sensor")}
                title="In-Line TOC & Conductivity Optical Tap"
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-label">3. TOC Tap</span>
              </button>

              <button
                type="button"
                className={`hardware-hotspot hotspot-fluid ${activeHotspot === "fluid" ? "active" : ""}`}
                onClick={() => setActiveHotspot("fluid")}
                title="ECLSS Closed-Loop Fluid Quick-Disconnect"
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-label">4. ECLSS Line</span>
              </button>
            </div>

            {/* Hotspot Detailed Context Bar */}
            <div className="hotspot-caption-box">
              {activeHotspot === "pwd" && (
                <p>
                  <strong>[1] Potable Water Dispenser (PWD):</strong> Astronaut Nicole Mann rehydrating
                  a beverage pouch on ISS. Delivers ambient (21°C) and hot (71°C) water treated with
                  iodine biocide.
                </p>
              )}
              {activeHotspot === "bioserve" && (
                <p>
                  <strong>[2] BioServe ECLSS Environmental Rack:</strong> Active life-support hardware
                  controlling multi-filtration beds, gas-liquid separators, and microbial incubators.
                </p>
              )}
              {activeHotspot === "sensor" && (
                <p>
                  <strong>[3] In-Line TOC & Conductivity Optical Tap:</strong> Catalytic oxidation sensor
                  monitoring non-volatile organic compounds in real-time before line enters crew quarters.
                </p>
              )}
              {activeHotspot === "fluid" && (
                <p>
                  <strong>[4] ECLSS Closed-Loop Fluid System:</strong> Titanium fluid lines routing
                  humidity condensate and vacuum-distilled urine distillate through catalytic beds.
                </p>
              )}
            </div>
          </div>

          {/* Working Feature Rolling Numbers & Telemetry HUD */}
          <div className="telemetry-hud-column">
            <div className="hud-metric-card">
              <span className="hud-title">TOTAL ORGANIC CARBON (TOC)</span>
              <div
                className="hud-value-row"
                style={{
                  color:
                    latestSample?.tocPpb > NASA_WATER_LIMITS.TOC_MAX_PPB ? "#f43f5e" : "#38bdf8",
                }}
              >
                <span className="hud-number">{latestSample?.tocPpb ?? 240}</span>
                <span className="hud-unit">ppb</span>
              </div>
              <span className="hud-limit">NASA SMCL Limit: &lt; 500 ppb</span>
            </div>

            <div className="hud-metric-card">
              <span className="hud-title">ELECTRICAL CONDUCTIVITY</span>
              <div
                className="hud-value-row"
                style={{
                  color:
                    latestSample?.conductivityUscm > NASA_WATER_LIMITS.CONDUCTIVITY_MAX_USCM
                      ? "#f59e0b"
                      : "#34d399",
                }}
              >
                <span className="hud-number">{latestSample?.conductivityUscm ?? 1.2}</span>
                <span className="hud-unit">µS/cm</span>
              </div>
              <span className="hud-limit">NASA Baseline: &lt; 15.0 µS/cm @ 25°C</span>
            </div>

            <div className="hud-metric-card">
              <span className="hud-title">WRS WATER RECOVERY RATE</span>
              <div className="hud-value-row accent-mint">
                <span className="hud-number">{state.recoveryEfficiencyPercent}%</span>
                <span className="hud-unit">Closed-Loop</span>
              </div>
              <span className="hud-limit">NASA ISS ECLSS Milestone Achievement</span>
            </div>

            <div className="hud-metric-card">
              <span className="hud-title">MICROBIAL STATUS (COLIFORMS)</span>
              <div
                className="hud-value-row"
                style={{
                  color:
                    latestSample?.microbialStatus === "FLAGGED"
                      ? "#f43f5e"
                      : latestSample?.microbialStatus === "PENDING"
                        ? "#f59e0b"
                        : "#6ee7b7",
                }}
              >
                <span className="hud-number" style={{ fontSize: "1.3rem" }}>
                  {latestSample?.microbialStatus ?? "NEGATIVE"}
                </span>
              </div>
              <span className="hud-limit">Standard: &lt; 1 CFU / 100 mL</span>
            </div>

            <div className="hud-metric-card">
              <span className="hud-title">TODAY'S CREW HYDRATION</span>
              <div className="hud-value-row accent-cyan">
                <span className="hud-number">{todayHydration}</span>
                <span className="hud-unit">/ {state.targetHydrationMl} mL</span>
              </div>
              <div className="mini-hud-progress">
                <div className="mini-hud-fill" style={{ width: `${hydrationPct}%` }} />
              </div>
            </div>

            <div className="hud-metric-card">
              <span className="hud-title">RESIDUAL BIOCIDE (IODINE)</span>
              <div className="hud-value-row">
                <span className="hud-number">1.85</span>
                <span className="hud-unit">mg/L</span>
              </div>
              <span className="hud-limit">NASA Potable Standard: 1.5 - 2.5 mg/L</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SIMPLIFIED ANIMATED 3D/SCHEMATIC WATER RECOVERY SYSTEM PIPELINE */}
      <section className="panel aquaguard-pipeline-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">CLOSED-LOOP LIFE SUPPORT ARCHITECTURE</span>
            <h2>NASA ECLSS Water Recovery System (WRS) Closed Loop</h2>
          </div>
          <span className="pipeline-flow-pill">
            <Activity size={14} className="accent-mint" /> 98% WATER RECLAIMED
          </span>
        </div>

        <div className="pipeline-stages-container">
          <div className="pipeline-stage-card">
            <div className="stage-num">01</div>
            <h4>Input Wastewater</h4>
            <p>Cabin humidity condensate + Urine Processor Assembly (UPA) vacuum distillation.</p>
            <span className="stage-badge">Low Pressure</span>
          </div>

          <div className="pipeline-arrow-conn">➔</div>

          <div className="pipeline-stage-card">
            <div className="stage-num">02</div>
            <h4>Multi-Filtration</h4>
            <p>Two dual-bed ion-exchange resins remove inorganic ions & non-volatile organics.</p>
            <span className="stage-badge">Particulate & Ion Sorb</span>
          </div>

          <div className="pipeline-arrow-conn">➔</div>

          <div className="pipeline-stage-card highlight-glow">
            <div className="stage-num">03</div>
            <h4>Catalytic Reactor</h4>
            <p>130°C catalytic oxidation breaks down low-molecular weight organics into CO2.</p>
            <span className="stage-badge active-stage">In-Line TOC Sensor</span>
          </div>

          <div className="pipeline-arrow-conn">➔</div>

          <div className="pipeline-stage-card">
            <div className="stage-num">04</div>
            <h4>Biocide Injection</h4>
            <p>Iodine / ionic silver disinfectant injection prevents bacterial biofilm formation.</p>
            <span className="stage-badge">Microbial Control</span>
          </div>

          <div className="pipeline-arrow-conn">➔</div>

          <div className="pipeline-stage-card">
            <div className="stage-num">05</div>
            <h4>Galley PWD</h4>
            <p>Potable Water Dispenser delivers ambient and hot water for crew hydration pouches.</p>
            <span className="stage-badge verified">Potable Clean</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE WATER QUALITY TELEMETRY & HISTORICAL RECHARTS GRAPH */}
      <section className="panel aquaguard-trends-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">BIOASTRONAUTICS CONTINUOUS MONITORING</span>
            <h2>7-Day Water Quality Trends & Baseline Envelope</h2>
          </div>
          <span className="sample-clock">
            <Clock size={13} /> Last Sample: {latestSample?.timeFormatted} (Mission Day {latestSample?.missionDay})
          </span>
        </div>

        {/* Explainability & Procedural Next Steps Box */}
        <div
          className={`safety-explainability-box ${
            latestSample?.status === "ATTENTION"
              ? "status-attention"
              : latestSample?.status === "UNVERIFIED"
                ? "status-unverified"
                : "status-nominal"
          }`}
        >
          <div className="explain-header">
            <strong>
              {latestSample?.status === "ATTENTION"
                ? "⚠️ CAUTION DIRECTIVE: ACTION REQUIRED"
                : latestSample?.status === "UNVERIFIED"
                  ? "❓ UNVERIFIED POTABLE STATUS"
                  : "✓ NOMINAL POTABLE STATUS"}
            </strong>
            <span className="safety-rule-quote">
              "Never assume water is safe solely because TOC is nominal — microbial tests must verify."
            </span>
          </div>
          <div className="explain-body">
            <p className="explain-reason">
              <strong>Telemetry Assessment:</strong> {latestSample?.statusReason}
            </p>
            <p className="explain-next-step">
              <strong>Procedural Directive:</strong> {latestSample?.proceduralNextStep}
            </p>
          </div>
        </div>

        {/* Recharts Historical Graph */}
        <div className="aquaguard-chart-wrapper" style={{ width: "100%", height: 320, marginTop: "1rem" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="dayLabel" stroke="#94a3b8" />
              <YAxis
                yAxisId="left"
                stroke="#38bdf8"
                domain={[0, 700]}
                label={{ value: "TOC (ppb)", angle: -90, position: "insideLeft", fill: "#38bdf8" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#34d399"
                domain={[0, 20]}
                label={{ value: "Conductivity (µS/cm)", angle: 90, position: "insideRight", fill: "#34d399" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(11, 26, 42, 0.95)",
                  borderColor: "rgba(80, 180, 210, 0.4)",
                  color: "#f8fafc",
                }}
              />
              <Legend />
              {/* NASA Safety Reference Lines */}
              <ReferenceLine
                yAxisId="left"
                y={500}
                label={{ value: "NASA TOC Limit (500 ppb)", fill: "#f43f5e", position: "top" }}
                stroke="#f43f5e"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                yAxisId="right"
                y={15}
                label={{ value: "NASA Cond Limit (15 µS/cm)", fill: "#f59e0b", position: "top" }}
                stroke="#f59e0b"
                strokeDasharray="4 4"
              />

              <Bar yAxisId="left" dataKey="tocPpb" name="Total Organic Carbon (ppb)" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conductivityUscm"
                name="Conductivity (µS/cm)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#10b981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECTION 4: CREW HYDRATION TRACKING & QUICK LOGGING */}
      <section className="panel aquaguard-hydration-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">BIOASTRONAUTICS HYDRATION MANAGEMENT</span>
            <h2>Astronaut Daily Fluid Intake Tracker</h2>
          </div>
          <div className="target-setting-row">
            <span className="target-label">Target:</span>
            <input
              type="number"
              min="1500"
              max="4500"
              step="100"
              value={state.targetHydrationMl}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) {
                  setState(updateHydrationTarget(val));
                }
              }}
              className="target-input"
            />
            <span className="unit-label">mL/day</span>
          </div>
        </div>

        <div className="hydration-content-grid">
          {/* Progress Card */}
          <div className="hydration-progress-card">
            <div className="progress-big-number">
              <span className="current-ml">{todayHydration}</span>
              <span className="target-ml">/ {state.targetHydrationMl} mL</span>
            </div>
            <div className="hydration-meter-track">
              <div
                className="hydration-meter-fill"
                style={{
                  width: `${hydrationPct}%`,
                  background: hydrationPct >= 80 ? "linear-gradient(90deg, #0ea5e9, #10b981)" : "#0ea5e9",
                }}
              />
            </div>
            <div className="meter-label-row">
              <span>{hydrationPct}% Complete</span>
              <span>
                {hydrationPct >= 100
                  ? "Optimal Hydration"
                  : `${state.targetHydrationMl - todayHydration} mL Remaining`}
              </span>
            </div>
            <p className="hydration-advice">
              NASA HRP research demonstrates that microgravity cephalic fluid shift decreases thirst
              sensation by 15-20%. Adhering to the scheduled 2.5L intake target is vital for orthostatic
              tolerance during landing and post-EVA recovery.
            </p>
          </div>

          {/* Quick Logging Buttons & Custom Logger */}
          <div className="hydration-quicklog-card">
            <h4>Quick Log Water Intake</h4>
            <div className="quick-buttons-row">
              <button
                className="button primary quick-log-btn"
                onClick={() => handleLogHydration(250, "Standard 250mL Drink Pouch")}
              >
                <Droplet size={15} /> +250 mL Pouch
              </button>
              <button
                className="button primary quick-log-btn"
                onClick={() => handleLogHydration(500, "500mL Meal Rehydration / Flask")}
              >
                <Droplet size={15} /> +500 mL Bottle
              </button>
              <button
                className="button primary quick-log-btn"
                onClick={() => handleLogHydration(750, "750mL CEVIS Workout Hydration")}
              >
                <Droplet size={15} /> +750 mL Workout
              </button>
            </div>

            <div className="custom-log-row">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={customMl}
                onChange={(e) => setCustomMl(Number(e.target.value))}
                placeholder="Custom mL"
                className="custom-ml-input"
              />
              <button
                className="button secondary"
                onClick={() => {
                  if (customMl > 0) handleLogHydration(customMl, "Custom Crew Hydration Entry");
                }}
              >
                <PlusCircle size={15} /> LOG {customMl} mL
              </button>
            </div>

            <div className="today-logs-snippet">
              <span className="snippet-title">Recent Hydration Logs Today:</span>
              <div className="logs-tags-row">
                {state.consumptionLogs.slice(0, 4).map((l) => (
                  <span key={l.id} className="log-chip">
                    +{l.amountMl} mL ({l.timeFormatted})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: IN-FLIGHT WATER QUALITY SAMPLE ENTRY FORM & ARCHIVE */}
      <section className="panel aquaguard-samples-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">IN-FLIGHT LOCAL TEST ENTRY</span>
            <h2>Log Water Quality Sample Test</h2>
          </div>
          <button className="button outline small-btn" onClick={handleResetDefaults}>
            <RotateCcw size={14} /> RESET SAMPLE DATA
          </button>
        </div>

        {formFeedback && (
          <div
            className={`form-feedback-banner ${formFeedback.isError ? "feedback-err" : "feedback-ok"}`}
          >
            {formFeedback.isError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{formFeedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleAddSampleSubmit} className="sample-entry-form">
          <div className="form-fields-grid">
            <div className="form-field">
              <label>Sample Source Port:</label>
              <select
                value={sampleSource}
                onChange={(e) => setSampleSource(e.target.value as WaterQualitySample["source"])}
              >
                <option value="Galley PWD">Galley PWD (Potable Water Dispenser)</option>
                <option value="WPA Effluent">WPA Effluent (Pre-Storage Tank)</option>
                <option value="UPA Distillate">UPA Distillate (Urine Assembly)</option>
                <option value="Reserve CWC-I">Reserve CWC-I (Contingency Pouch)</option>
                <option value="Condensate Tank">Condensate Tank (Cabin Humidity)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Total Organic Carbon (ppb):</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={sampleToc}
                onChange={(e) => setSampleToc(Number(e.target.value))}
                required
              />
              <span className="field-hint">NASA Limit: &lt; 500 ppb</span>
            </div>

            <div className="form-field">
              <label>Conductivity (µS/cm @ 25°C):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={sampleCond}
                onChange={(e) => setSampleCond(Number(e.target.value))}
                required
              />
              <span className="field-hint">NASA Limit: &lt; 15.0 µS/cm</span>
            </div>

            <div className="form-field">
              <label>Microbial Culture Slide:</label>
              <select
                value={sampleMicrobial}
                onChange={(e) => setSampleMicrobial(e.target.value as MicrobialStatus)}
              >
                <option value="NEGATIVE">NEGATIVE (&lt; 1 CFU/100 mL - Safe)</option>
                <option value="PENDING">PENDING (Culture incubating in BioServe)</option>
                <option value="TRACE">TRACE (&lt; 10 CFU/100 mL - Non-coliform)</option>
                <option value="FLAGGED">FLAGGED (&gt; 1 CFU/100 mL Coliform Alert!)</option>
              </select>
            </div>
          </div>

          <div className="form-field" style={{ marginTop: "10px" }}>
            <label>Crew Observations / Operational Notes (Optional):</label>
            <input
              type="text"
              placeholder="e.g. In-line optical tap cleaned with sterile swab; flow rate nominal."
              value={sampleNotes}
              onChange={(e) => setSampleNotes(e.target.value)}
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="button primary">
              <Check size={16} /> SUBMIT SAMPLE TEST TO ECLSS ARCHIVE
            </button>
          </div>
        </form>

        {/* Stored Samples Archive Table */}
        <div className="samples-archive-table-container">
          <h4>Recent In-Flight Water Quality Records ({state.samples.length})</h4>
          <table className="samples-table">
            <thead>
              <tr>
                <th>Day &amp; Time</th>
                <th>Source</th>
                <th>TOC (ppb)</th>
                <th>Conductivity</th>
                <th>Microbial</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.samples.map((s) => (
                <tr key={s.id} className={s.status === "ATTENTION" ? "row-danger" : ""}>
                  <td>
                    <strong>Day {s.missionDay}</strong>
                    <div className="time-sub">{s.timeFormatted}</div>
                  </td>
                  <td>{s.source}</td>
                  <td className={s.tocPpb > NASA_WATER_LIMITS.TOC_MAX_PPB ? "text-danger" : ""}>
                    {s.tocPpb} ppb
                  </td>
                  <td
                    className={
                      s.conductivityUscm > NASA_WATER_LIMITS.CONDUCTIVITY_MAX_USCM
                        ? "text-warning"
                        : ""
                    }
                  >
                    {s.conductivityUscm} µS/cm
                  </td>
                  <td>
                    <span
                      className={`status-pill-badge ${
                        s.microbialStatus === "FLAGGED"
                          ? "badge-danger"
                          : s.microbialStatus === "PENDING"
                            ? "badge-warning"
                            : "badge-success"
                      }`}
                    >
                      {s.microbialStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill-badge ${
                        s.status === "ATTENTION"
                          ? "badge-danger"
                          : s.status === "UNVERIFIED"
                            ? "badge-warning"
                            : "badge-success"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="notes-col">{s.notes || "—"}</td>
                  <td>
                    <button
                      className="button outline small-btn del-btn"
                      onClick={() => handleDeleteSample(s.id)}
                      title="Delete sample"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 6: NASA SCIENTIFIC REFERENCES & DISCLOSURE */}
      <section className="panel aquaguard-citations-panel">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">AEROSPACE VALIDATION & SCIENTIFIC CITATIONS</span>
            <h3>NASA ECLSS Scientific Foundations</h3>
          </div>
          <Info size={18} className="accent-cyan" />
        </div>

        <div className="citations-grid">
          <div className="citation-card">
            <h5>NASA ECLSS Water Recovery System (WRS)</h5>
            <p>
              The International Space Station relies on the Urine Processor Assembly (UPA) and Water
              Processor Assembly (WPA) to recycle up to 98% of crew wastewater, perspiration, and
              humidity into certified potable drinking water.
            </p>
            <small>Source: NASA ECLSS Environmental Control &amp; Life Support Systems</small>
          </div>

          <div className="citation-card">
            <h5>NASA 98% Water Recovery Milestone (2023)</h5>
            <p>
              In June 2023, NASA ECLSS achieved a breakthrough milestone of 98% water recovery in
              low-Earth orbit using vacuum rotary distillation and brine processing assembly, enabling
              crewed Artemis and Mars transit missions.
            </p>
            <small>Source: NASA Space Station Research &amp; Technology</small>
          </div>

          <div className="citation-card">
            <h5>NASA JSC Toxicology &amp; Environmental Chemistry</h5>
            <p>
              Potable water must conform strictly to Spacecraft Maximum Contaminant Levels (SMCL): Total
              Organic Carbon &lt; 500 ppb, Conductivity &lt; 15 µS/cm, and Coliform count &lt; 1
              CFU/100 mL.
            </p>
            <small>Source: NASA Human Health and Performance Directorate (HH&amp;P)</small>
          </div>
        </div>

        <div className="citation-disclaimer">
          <strong>SCIENTIFIC DISCLOSURE:</strong> ASTRA AquaGuard is an interactive bioastronautics
          telemetry monitor developed for the NASA Space Apps Challenge 2026. All telemetry readings are
          simulated based on published NASA ECLSS operating envelopes. ASTRA does not actuate physical
          spacecraft valves or replace ground flight surgeon telemetry consoles.
        </div>
      </section>
    </div>
  );
}
