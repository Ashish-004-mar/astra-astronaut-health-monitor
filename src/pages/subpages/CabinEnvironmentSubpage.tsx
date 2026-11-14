import { useState, useEffect } from "react";
import {
  Gauge,
  Thermometer,
  Droplet,
  Wind,
  ArrowLeft,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  getCabinScenario,
  setCabinScenario,
  getCabinReadings,
} from "../../services/hazardService";
import type { CabinScenario } from "../../types/hazards";

interface CabinEnvironmentSubpageProps {
  onBack: () => void;
}

export default function CabinEnvironmentSubpage({ onBack }: CabinEnvironmentSubpageProps) {
  const [scenario, setScenarioState] = useState<CabinScenario>(() => getCabinScenario());
  const [timeRange, setTimeRange] = useState<"6H" | "24H" | "7D">("24H");
  const [readings, setReadings] = useState(() => getCabinReadings(scenario));
  const [activeMetric, setActiveMetric] = useState<"co2" | "temp" | "humidity">("co2");

  useEffect(() => {
    setReadings(getCabinReadings(scenario));
  }, [scenario]);

  const handleScenarioChange = (s: CabinScenario) => {
    setCabinScenario(s);
    setScenarioState(s);
  };

  const currentReading = readings[readings.length - 1];
  const isElevated = scenario === "ELEVATED_CO2";

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO SPACE
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            SPACE <span>/</span> HOSTILE OR CLOSED CABIN ENVIRONMENT
          </div>
          <h1>CABIN ENVIRONMENT & ECLSS LIFE SUPPORT</h1>
          <p className="subpage-subtitle">
            Atmospheric composition, carbon dioxide scrubbing, temperature, and humidity monitoring.
          </p>
        </div>
      </div>

      {/* NASA Context */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA ENVIRONMENTAL LIFE SUPPORT SYSTEMS (ECLSS) CONTEXT</strong>
        </div>
        <p>
          In a closed spacecraft habitat, absence of natural convection can cause exhaled carbon dioxide to form stagnant pockets around sleeping crew. Elevated CO₂ concentrations (above ~3.0 to 4.0 mmHg) are associated with headaches, lethargy, cognitive fog, and increased intracranial pressure. NASA monitors cabin air continuously with automated scrubbing assemblies (CDRA).
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/hostile-closed-environments/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Hostile & Closed Environments Research ↗
        </a>
      </section>

      {/* Key Metrics Row */}
      <div className="metrics-summary-row">
        <div className={`metric-box ${isElevated ? "warning-box" : ""}`}>
          <span className="metric-label">CABIN CO₂ LEVEL</span>
          <div className="metric-value-row">
            <span className="big-val">{currentReading.co2Ppm}</span>
            <span className="unit">PPM</span>
          </div>
          <small className="metric-meta">
            {currentReading.co2MmHg} mmHg · Ref limit: 3800 PPM (3.0 mmHg)
          </small>
        </div>

        <div className="metric-box">
          <span className="metric-label">HABITAT TEMPERATURE</span>
          <div className="metric-value-row">
            <span className="big-val">{currentReading.temperatureC}</span>
            <span className="unit">°C</span>
          </div>
          <small className="metric-meta">Nominal range: 21.0 - 24.0 °C</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">RELATIVE HUMIDITY</span>
          <div className="metric-value-row">
            <span className="big-val">{currentReading.humidityPct}</span>
            <span className="unit">%</span>
          </div>
          <small className="metric-meta">Target range: 40 - 55%</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">ECLSS SCRUBBER STATUS</span>
          <div className="metric-value-row">
            <span className="big-val">
              {isElevated ? "CYCLE 2 BOOST" : "ACTIVE NOMINAL"}
            </span>
          </div>
          <small className="metric-meta">SIMULATED CABIN SENSOR DATA</small>
        </div>
      </div>

      {/* Scenario Simulation Controls */}
      <section className="panel scenario-selector-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">DETERMINISTIC CABIN SIMULATION</span>
            <h2>Select Cabin Environmental Scenario</h2>
          </div>
          <span className="tag">SIMULATED DEMO</span>
        </div>

        <div className="scenario-buttons-row">
          <button
            className={`button ${scenario === "NORMAL" ? "primary" : "outline"}`}
            onClick={() => handleScenarioChange("NORMAL")}
          >
            NORMAL CABIN
          </button>
          <button
            className={`button ${scenario === "ELEVATED_CO2" ? "primary" : "outline"}`}
            onClick={() => handleScenarioChange("ELEVATED_CO2")}
          >
            <AlertTriangle size={14} /> ELEVATED CO₂ DEMO
          </button>
          <button
            className={`button ${scenario === "RECOVERY" ? "primary" : "outline"}`}
            onClick={() => handleScenarioChange("RECOVERY")}
          >
            <RotateCcw size={14} /> ENVIRONMENT RECOVERY
          </button>
        </div>
      </section>

      {/* Elevated Alert Banner when scenario triggers */}
      {isElevated && (
        <div className="scientific-warning-card attention-alert">
          <AlertTriangle size={24} className="accent-orange" />
          <div>
            <strong>ATTENTION — DEMO: Elevated Cabin CO₂ Detected</strong>
            <p>
              Simulated cabin CO₂ has reached <strong>{currentReading.co2Ppm} ppm (3.38 mmHg)</strong>, exceeding the demonstration reference guideline of 3800 ppm. In microgravity, crew members may experience mild headache or cognitive slowing.
            </p>
            <p className="action-hint">
              <strong>Recommended Action:</strong> Inspect cabin ventilation duct diffusers, confirm CDRA scrubbing bed cycles, and notify mission support.
            </p>
          </div>
        </div>
      )}

      {/* Trend Graph */}
      <section className="panel chart-panel">
        <div className="chart-header">
          <div>
            <span className="eyebrow">ENVIRONMENTAL SENSOR TIME SERIES</span>
            <h2>
              {activeMetric === "co2"
                ? "Carbon Dioxide Concentration (PPM)"
                : activeMetric === "temp"
                  ? "Habitat Temperature (°C)"
                  : "Relative Humidity (%)"}
            </h2>
          </div>

          <div className="chart-filter-pills">
            <button
              className={`filter-pill ${activeMetric === "co2" ? "active" : ""}`}
              onClick={() => setActiveMetric("co2")}
            >
              CO₂
            </button>
            <button
              className={`filter-pill ${activeMetric === "temp" ? "active" : ""}`}
              onClick={() => setActiveMetric("temp")}
            >
              TEMP
            </button>
            <button
              className={`filter-pill ${activeMetric === "humidity" ? "active" : ""}`}
              onClick={() => setActiveMetric("humidity")}
            >
              HUMIDITY
            </button>
          </div>
        </div>

        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <XAxis dataKey="timeStr" stroke="#4b6171" tick={{ fill: "#82949e", fontSize: 11 }} />
              <YAxis
                stroke="#4b6171"
                tick={{ fill: "#82949e", fontSize: 11 }}
                domain={
                  activeMetric === "co2"
                    ? [2000, 5000]
                    : activeMetric === "temp"
                      ? [18, 28]
                      : [30, 70]
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(8, 23, 38, 0.95)",
                  borderColor: "rgba(14, 165, 233, 0.4)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              {activeMetric === "co2" && (
                <ReferenceLine
                  y={3800}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{
                    value: "Ref Limit 3800 PPM",
                    fill: "#f59e0b",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey={
                  activeMetric === "co2"
                    ? "co2Ppm"
                    : activeMetric === "temp"
                      ? "temperatureC"
                      : "humidityPct"
                }
                stroke={activeMetric === "co2" ? "#0ea5e9" : activeMetric === "temp" ? "#f59e0b" : "#76dfcb"}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="chart-caption">
          Illustrative bioastronautics simulation rules · not operational spacecraft flight rules.
        </p>
      </section>
    </div>
  );
}
