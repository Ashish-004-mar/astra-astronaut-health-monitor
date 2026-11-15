import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Calendar,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  getMentalCheckins,
  getRecoveryLogs,
  computePersonalBaseline,
  type MentalCheckinEntry,
  type RecoverySessionRecord,
} from "../../services/mindspaceService";

interface WellnessTrendsSectionProps {
  isDemoMode: boolean;
}

export default function WellnessTrendsSection({ isDemoMode }: WellnessTrendsSectionProps) {
  const [timeRange, setTimeRange] = useState<"7D" | "14D" | "30D">("7D");

  const checkins = getMentalCheckins();
  const recoveryLogs = getRecoveryLogs();
  const baseline = computePersonalBaseline(checkins);

  // Numerical mapping for ordinal scales
  const energyScale = { exhausted: 1, low: 2, moderate: 3, high: 4 };
  const sleepScale = { insufficient: 1, delayed: 2, fragmented: 3, restful: 4 };
  const focusScale = { difficult: 1, scattered: 2, manageable: 3, sharp: 4 };
  const moodScale = { stressed: 1, low: 2, neutral: 3, good: 4, great: 5 };

  // Prepare trend data
  const chartData = useMemo(() => {
    const limit = timeRange === "7D" ? 7 : timeRange === "14D" ? 14 : 30;
    const slice = checkins.slice(0, limit).reverse();

    return slice.map((c) => ({
      date: c.dateFormatted,
      stress: c.stress,
      energy: energyScale[c.energy] || 3,
      sleep: sleepScale[c.sleep] || 3,
      focus: focusScale[c.focus] || 3,
      mood: moodScale[c.mood] || 3,
      provenance: c.provenance,
    }));
  }, [checkins, timeRange]);

  // Aggregate recovery sessions by activity type
  const recoveryAggregates = useMemo(() => {
    const counts: Record<string, number> = {
      breathing: 0,
      grounding: 0,
      reset: 0,
      earth: 0,
    };

    recoveryLogs.forEach((rec) => {
      if (rec.activityType === "guided_breathing") counts.breathing++;
      else if (rec.activityType === "grounding_54321") counts.grounding++;
      else if (rec.activityType === "mental_reset") counts.reset++;
      else if (rec.activityType === "earth_connection") counts.earth++;
    });

    return [
      { name: "Breathing", sessions: counts.breathing, color: "#38bdf8" },
      { name: "Grounding", sessions: counts.grounding, color: "#34d399" },
      { name: "Mental Reset", sessions: counts.reset, color: "#a78bfa" },
      { name: "Earth Focus", sessions: counts.earth, color: "#fb923c" },
    ];
  }, [recoveryLogs]);

  return (
    <div className="wellness-trends-container">
      {/* Header & Controls */}
      <div className="trends-header-row">
        <div>
          <span className="eyebrow">LONGITUDINAL SELF-REPORTED TELEMETRY</span>
          <h2>Astronaut Mental Wellness Trends</h2>
          <p className="trends-sub">
            Continuous baseline tracking based on voluntary check-ins and recovery logs.
          </p>
        </div>

        <div className="trends-controls-group">
          <div className="time-pills-row">
            {(["7D", "14D", "30D"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`button ${timeRange === r ? "primary" : "outline"} small-btn`}
                onClick={() => setTimeRange(r)}
              >
                {r === "7D" ? "7 Days" : r === "14D" ? "14 Days" : "30 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Baseline Summary Metrics */}
      <div className="baseline-metrics-strip">
        <div className="strip-item">
          <span className="strip-lbl">DATA PROVENANCE</span>
          <strong className="strip-val">{isDemoMode ? "SYNTHETIC DEMO" : "SELF-REPORTED"}</strong>
          <small>{baseline.observationCount} Observations Recorded</small>
        </div>

        <div className="strip-item">
          <span className="strip-lbl">AVG PERCEIVED STRESS</span>
          <strong className="strip-val">
            {baseline.avgStress !== null ? `${baseline.avgStress} / 10` : "Need >= 3 entries"}
          </strong>
          <small>Personal 14-Day Baseline</small>
        </div>

        <div className="strip-item">
          <span className="strip-lbl">AVG FOCUS SCORE</span>
          <strong className="strip-val">
            {baseline.avgFocusScore !== null ? `${baseline.avgFocusScore} / 4.0` : "Need >= 3 entries"}
          </strong>
          <small>Procedural Attention Readiness</small>
        </div>

        <div className="strip-item">
          <span className="strip-lbl">TOTAL RECOVERY SESSIONS</span>
          <strong className="strip-val">{recoveryLogs.length} Completed</strong>
          <small>Active Downregulation Pauses</small>
        </div>
      </div>

      {/* Main Trends Charts Grid */}
      <div className="trends-charts-grid">
        {/* Chart 1: Perceived Stress Trend */}
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SUBJECTIVE TENSION</span>
              <h3>Perceived Stress Trend (0–10 Scale)</h3>
            </div>
            <span className="tag">SELF-REPORTED</span>
          </div>

          {chartData.length < 2 ? (
            <div className="chart-empty-state">
              <Activity size={32} className="accent-cyan" />
              <p>Insufficient records to plot stress trend. Complete at least 2 check-ins.</p>
            </div>
          ) : (
            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(151, 189, 196, 0.1)" />
                  <XAxis dataKey="date" stroke="#6b8a95" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#6b8a95" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 22, 28, 0.95)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  />
                  {baseline.avgStress !== null && (
                    <ReferenceLine
                      y={baseline.avgStress}
                      stroke="#38bdf8"
                      strokeDasharray="4 4"
                      label={{ value: "Baseline", fill: "#38bdf8", fontSize: 10, position: "right" }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="stress"
                    name="Stress (0-10)"
                    stroke="#f472b6"
                    strokeWidth={2.4}
                    dot={{ r: 4, fill: "#f472b6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Chart 2: Focus & Sleep Quality Trends */}
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">COGNITIVE & CIRCADIAN METRICS</span>
              <h3>Focus & Sleep Recovery Trends</h3>
            </div>
            <span className="tag">1–4 SCALE</span>
          </div>

          {chartData.length < 2 ? (
            <div className="chart-empty-state">
              <Activity size={32} className="accent-mint" />
              <p>Insufficient records to plot attention trend. Complete at least 2 check-ins.</p>
            </div>
          ) : (
            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(151, 189, 196, 0.1)" />
                  <XAxis dataKey="date" stroke="#6b8a95" fontSize={10} tickLine={false} />
                  <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} stroke="#6b8a95" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 22, 28, 0.95)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="focus"
                    name="Focus (1-4)"
                    stroke="#38bdf8"
                    strokeWidth={2.2}
                    dot={{ r: 3, fill: "#38bdf8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    name="Sleep (1-4)"
                    stroke="#818cf8"
                    strokeWidth={2.2}
                    dot={{ r: 3, fill: "#818cf8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    name="Energy (1-4)"
                    stroke="#34d399"
                    strokeWidth={2.2}
                    dot={{ r: 3, fill: "#34d399" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Chart 3: Recovery Activities Bar Breakdown */}
        <section className="panel chart-panel recovery-bar-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ACTIVE COPING COMPLETIONS</span>
              <h3>Stress Recovery Sessions by Activity</h3>
            </div>
            <span className="tag">ALL TIME</span>
          </div>

          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={recoveryAggregates} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(151, 189, 196, 0.1)" />
                <XAxis dataKey="name" stroke="#6b8a95" fontSize={10} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#6b8a95" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 22, 28, 0.95)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="sessions" name="Sessions" fill="#76dfcb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Scientific Limitation & Non-Diagnostic Notice */}
      <div className="trends-scientific-footer">
        <Info size={14} className="accent-cyan" />
        <p>
          <strong>Scientific Methodology Disclaimer:</strong> All trends are generated solely from voluntary self-reported answers and logged exercise durations. ASTRA does not compute psychiatric vulnerability scores, assign diagnostic classifications (such as clinical depression or generalized anxiety), or calculate operational fitness for duty solely from software logs.
        </p>
      </div>
    </div>
  );
}
