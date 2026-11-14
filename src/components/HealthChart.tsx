import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";
import { useStore } from "../state/store";
import { baseline, metrics, type Metric } from "../types";

export default function HealthChart() {
  const { mission, metric, trend, reduced } = useStore();
  const [range, setRange] = useState<"6H" | "24H" | "7D" | "30D" | "ALL">("24H");
  const [isAnimationActive, setIsAnimationActive] = useState(true);

  const current = mission.history.at(-1)!;
  const hoursMap: Record<string, number> = {
    "6H": 6,
    "24H": 24,
    "7D": 168,
    "30D": 720,
    ALL: 999999,
  };
  const hours = hoursMap[range] || 24;

  const data =
    metric === "sleep"
      ? mission.nights
          .filter(
            (n) =>
              range === "ALL" ||
              n.day >= mission.day - Math.max(0, Math.floor(hours / 24) - 1),
          )
          .map((n) => ({ label: `Day ${n.day}`, value: n.sleep }))
      : mission.history
          .filter((r) => range === "ALL" || r.hour > mission.hour - hours)
          .map((r) => ({
            label: `D${r.day} ${String(((r.hour % 24) + 24) % 24).padStart(2, "0")}:00`,
            value: r[metric],
          }));

  const difference = Math.round((current[metric] - baseline[metric]) * 10) / 10;

  const handleResetView = () => {
    setRange("24H");
    trend("hr");
    setIsAnimationActive(true);
  };

  return (
    <section className="panel chart-panel">
      <div className="chart-header">
        <div>
          <div className="eyebrow">PERSONAL HEALTH TRENDS</div>
          <h2>Your signals, in perspective.</h2>
        </div>
        <div className="chart-header-status">
          {mission.running ? (
            <span className="live-stream-badge">
              <span className="pulse-radar-dot" /> SIMULATED LIVE PLAYBACK
            </span>
          ) : (
            <span className="telemetry-idle-badge">
              <span className="idle-scanner-dot" /> AMBIENT SCANNER ACTIVE
            </span>
          )}
          <span className="tag">SIMULATED TELEMETRY</span>
        </div>
      </div>

      <div className="metric-tabs">
        {(Object.keys(metrics) as Metric[]).map((m) => (
          <button key={m} aria-pressed={metric === m} onClick={() => trend(m)}>
            {metrics[m].name}
          </button>
        ))}
      </div>

      <div className="chart-summary">
        <div>
          <strong>
            {current[metric]} <small>{metrics[metric].unit}</small>
          </strong>
          <p>
            {difference > 0 ? "+" : ""}
            {difference} from personal baseline of {baseline[metric]}
          </p>
        </div>

        <div className="chart-controls-group">
          {/* Animation Play/Pause & Reset */}
          <div className="chart-action-buttons">
            <button
              className="chart-mini-btn"
              onClick={() => setIsAnimationActive((prev) => !prev)}
              title={isAnimationActive ? "Pause chart animation" : "Resume chart animation"}
            >
              {isAnimationActive ? <Pause size={12} /> : <Play size={12} />}
              <span>{isAnimationActive ? "PAUSE MOTION" : "RESUME"}</span>
            </button>
            <button
              className="chart-mini-btn"
              onClick={handleResetView}
              title="Reset chart view to default"
            >
              <RotateCcw size={12} />
              <span>RESET</span>
            </button>
          </div>

          {/* Time Range Selectors */}
          <div className="range-buttons">
            {(["6H", "24H", "7D", "30D", "ALL"] as const).map((r) => (
              <button
                key={r}
                aria-pressed={range === r}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-wrapper-relative">
        {/* Ambient scanning beam effect */}
        {isAnimationActive && !reduced && (
          <div className="chart-scanner-sweep" aria-hidden="true" />
        )}

        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
            >
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#76dfcb" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#76dfcb" stopOpacity={0.0} />
                </linearGradient>
                <filter id="glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid stroke="#1c2f37" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke="#82949e"
                fontSize={10}
                minTickGap={45}
                tickLine={false}
              />
              <YAxis
                stroke="#82949e"
                fontSize={10}
                domain={["auto", "auto"]}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0d1b20",
                  border: "1px solid #2d454f",
                  borderRadius: 8,
                  color: "#ecf5f3",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                }}
              />
              <ReferenceLine
                y={baseline[metric]}
                stroke="#8ba2ad"
                strokeDasharray="4 5"
                label={{
                  value: `BASELINE (${baseline[metric]})`,
                  fill: "#8ba2ad",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
              <Area
                isAnimationActive={isAnimationActive && !reduced}
                animationDuration={650}
                animationEasing="ease-in-out"
                type="monotone"
                dataKey="value"
                name={metrics[metric].name}
                stroke="#79e1cb"
                fill="url(#chart-fill)"
                strokeWidth={2.2}
                dot={data.length < 4}
                activeDot={{
                  r: 5,
                  fill: "#79e1cb",
                  stroke: "#0d1b20",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-footer-row">
        <p className="chart-note">
          {metric === "sleep"
            ? "Sleep is recorded once per simulated night at virtual day boundaries. Short ranges may contain only one nocturnal observation."
            : "Compare repeated, comparable resting observations with your personal baseline. A single sample does not trigger an alert."}
        </p>
        <span className="sampling-frequency">
          <Activity size={11} /> 1-HOUR DISCRETE INTERVALS
        </span>
      </div>
    </section>
  );
}
