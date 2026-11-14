import { useState } from "react";
import {
  Moon,
  Clock,
  ArrowLeft,
  Orbit,
  ShieldCheck,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { useStore } from "../../state/store";

interface SleepCircadianSubpageProps {
  onBack: () => void;
}

export default function SleepCircadianSubpage({ onBack }: SleepCircadianSubpageProps) {
  const { mission } = useStore();
  const [range, setRange] = useState<"7D" | "30D">("7D");
  const [activeTab, setActiveTab] = useState<"trend" | "circadian">("trend");

  // Personal baseline
  const baselineSleep = 7.8;
  const recentNight = mission.nights.at(-1) ?? {
    day: mission.day,
    sleep: 6.8,
    stress: 30,
    quality: "fair",
  };
  const currentSleep = recentNight.sleep;
  const diffHours = Math.round((currentSleep - baselineSleep) * 10) / 10;
  const isBelow = diffHours < -1.0;

  // Chart data from mission nights
  const chartData = mission.nights
    .slice(range === "7D" ? -7 : -30)
    .map((n) => ({
      name: `Day ${n.day}`,
      sleep: n.sleep,
      baseline: baselineSleep,
    }));

  // Circadian orbit position simulation (ISS orbits every 90 minutes; 16 sunrises/day)
  const orbitProgress = (mission.hour % 24) / 24;

  return (
    <div className="subpage-container">
      {/* Subpage Breadcrumb & Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO MY HEALTH
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            MY HEALTH <span>/</span> SLEEP & CIRCADIAN RHYTHM
          </div>
          <h1>SLEEP & CIRCADIAN RHYTHM MONITOR</h1>
          <p className="subpage-subtitle">
            Rest architecture, orbital day/night synchronization, and fatigue mitigation.
          </p>
        </div>
      </div>

      {/* NASA Research Context Box */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA HUMAN RESEARCH PROGRAM (HRP) CONTEXT</strong>
        </div>
        <p>
          The International Space Station orbits Earth approximately every 90 minutes, exposing crew to 16 sunrises and sunsets every 24 hours. Without natural 24-hour solar cues, astronauts experience disrupted circadian alignment, delayed sleep onset, and shortened slow-wave sleep. Controlled sleep schedules and dynamic blue-enriched lighting protocols are operational countermeasures.
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/isolation-and-confinement/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Sleep & Circadian Reference ↗
        </a>
      </section>

      {/* Sleep Overview Metrics Cards */}
      <div className="metrics-summary-row">
        <div className="metric-box">
          <span className="metric-label">LAST RECORDED SLEEP</span>
          <div className="metric-value-row">
            <span className="big-val">
              {Math.floor(currentSleep)}h {Math.round((currentSleep % 1) * 60)}m
            </span>
          </div>
          <small className="metric-meta">Mission Day {recentNight.day} observation</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">PERSONAL BASELINE</span>
          <div className="metric-value-row">
            <span className="big-val">{baselineSleep}</span>
            <span className="unit">hours</span>
          </div>
          <small className="metric-meta">Configured personal standard</small>
        </div>

        <div className={`metric-box ${isBelow ? "warning-box" : ""}`}>
          <span className="metric-label">BASELINE DIFFERENCE</span>
          <div className="metric-value-row">
            <span className="big-val">{diffHours > 0 ? `+${diffHours}` : `${diffHours}`}</span>
            <span className="unit">hours</span>
          </div>
          <small className="metric-meta">
            {isBelow ? "Below baseline pattern" : "Within nominal pattern"}
          </small>
        </div>

        <div className="metric-box">
          <span className="metric-label">CIRCADIAN LIGHTING PHASE</span>
          <div className="metric-value-row">
            <span className="big-val">
              {mission.hour >= 21 || mission.hour < 6 ? "MELATONIC / WARM" : "HIGH-CRI BLUE"}
            </span>
          </div>
          <small className="metric-meta">Habitat scheduled lighting mode</small>
        </div>
      </div>

      {/* Action Buttons to toggle view */}
      <div className="subpage-action-pills">
        <button
          className={`button ${activeTab === "trend" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("trend")}
        >
          VIEW SLEEP TREND
        </button>
        <button
          className={`button ${activeTab === "circadian" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("circadian")}
        >
          VIEW CIRCADIAN TIMELINE
        </button>
      </div>

      {/* Tab: Trend Chart */}
      {activeTab === "trend" && (
        <section className="panel chart-panel">
          <div className="chart-header">
            <div>
              <span className="eyebrow">LONGITUDINAL MONITORING</span>
              <h2>Sleep Duration History vs. Personal Baseline</h2>
            </div>
            <div className="chart-filter-pills">
              {(["7D", "30D"] as const).map((r) => (
                <button
                  key={r}
                  className={`filter-pill ${range === r ? "active" : ""}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b6171" tick={{ fill: "#82949e", fontSize: 11 }} />
                <YAxis stroke="#4b6171" tick={{ fill: "#82949e", fontSize: 11 }} domain={[4, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(8, 23, 38, 0.95)",
                    borderColor: "rgba(129, 140, 248, 0.4)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(val: any) => [`${val} hrs`, "Sleep"]}
                />
                <ReferenceLine
                  y={baselineSleep}
                  stroke="#76dfcb"
                  strokeDasharray="3 3"
                  label={{
                    value: `Baseline ${baselineSleep}h`,
                    fill: "#76dfcb",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sleep"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sleepGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-caption">
            * Recorded sleep duration updates once per virtual mission day at circadian cycle boundary.
          </p>
        </section>
      )}

      {/* Tab: Circadian Timeline Visualization */}
      {activeTab === "circadian" && (
        <section className="panel circadian-viz-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ASTRONOMICAL & SCHEDULED TIMING</span>
              <h2>Simulated 24-Hour Earth Orbit Circadian Cycle</h2>
            </div>
            <span className="tag">
              <Orbit size={13} /> 16 SUNRISES / 24H
            </span>
          </div>

          <div className="orbit-circadian-graphic">
            <div className="earth-orbit-circle">
              <div className="orbit-sun-glow" />
              <div className="orbit-iss-marker" style={{ transform: `rotate(${orbitProgress * 360}deg)` }}>
                <span className="iss-dot" />
                <small className="iss-label">ISS / ASTRA</small>
              </div>
            </div>

            <div className="circadian-schedule-details">
              <h3>Current Circadian Phase: {String(mission.hour % 24).padStart(2, "0")}:00 Virtual UTC</h3>
              <div className="phase-block">
                <strong>06:00 - 08:00 UTC · Morning Crew Wake & Photopic Lighting</strong>
                <p>High intensity 480nm blue-enriched lighting suppress melatonin and reinforces alertness.</p>
              </div>
              <div className="phase-block">
                <strong>08:00 - 19:00 UTC · Mission Work, Science & 2h Exercise Session</strong>
                <p>Operational workload period with scheduled resistive and aerobic countermeasures.</p>
              </div>
              <div className="phase-block">
                <strong>19:00 - 21:30 UTC · Evening Wind-Down & Melatonin Preservation</strong>
                <p>Low-irradiance warm light (2700K) to facilitate natural sleep preparation.</p>
              </div>
              <div className="phase-block">
                <strong>21:30 - 06:00 UTC · Protected Sleep Rest Period (8.5 Hours)</strong>
                <p>Bunk darkness, sound mitigation earplugs, and carbon dioxide monitoring.</p>
              </div>
            </div>
          </div>
          <small className="disclaimer-note">
            Accelerated orbital illustration is an educational visualization of ISS lighting cycles, not a prescription of individual sleep.
          </small>
        </section>
      )}

      {/* Transparent Explainable Rules Section */}
      <section className="panel text-panel">
        <div className="eyebrow">TRANSPARENT DETECTION LOGIC</div>
        <h2>What Changed & Recommended Countermeasure</h2>
        <div className="explain-rule-box">
          <p>
            <strong>Current Status:</strong>{" "}
            <span className={isBelow ? "attention-text" : "nominal-text"}>
              {isBelow ? "ATTENTION" : "NOMINAL"}
            </span>
          </p>
          <p>
            <strong>Observation:</strong>{" "}
            {isBelow
              ? `Your recent sleep duration (${currentSleep}h) is ${Math.abs(diffHours)} hours below your personal baseline (${baselineSleep}h).`
              : `Your sleep duration is within normal variability of your personal baseline (${baselineSleep}h).`}
          </p>
          <p>
            <strong>Recommended General Action:</strong>{" "}
            {isBelow
              ? "Review your scheduled rest period in the mission timeline. Avoid screen glare within 45 minutes of scheduled sleep onset and continue monitoring."
              : "Maintain your scheduled sleep and active exercise regimen."}
          </p>
          <small>ASTRA monitoring is an informational prototype. It does not diagnose sleep disorders.</small>
        </div>
      </section>
    </div>
  );
}
