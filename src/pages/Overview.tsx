import { lazy, Suspense, useState } from "react";
import {
  Heart,
  Wind,
  Moon,
  Activity,
  Zap,
  ArrowUpRight,
  RotateCcw,
  Move,
  ShieldCheck,
  FileText,
  Sun,
  Users,
  Radio as RadioIcon,
  Gauge,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import CameraPanel from "../camera/CameraPanel";
import Simulation from "../components/Simulation";
import ReportModal from "../components/ReportModal";
import { useStore } from "../state/store";
import { evaluate } from "../engine/healthEngine";
import { baseline, metrics, type Metric, type Region } from "../types";
import { NASA_FIVE_HAZARDS } from "../services/hazardService";
import type { NASAhazardId } from "../types/hazards";
import HazardDetailSubpage from "./subpages/HazardDetailSubpage";
const Astronaut = lazy(() => import("../three/Scene"));
const icons = {
  hr: Heart,
  spo2: Wind,
  sleep: Moon,
  stress: Zap,
  activity: Activity,
};
export default function Overview() {
  const { mission, region, select, trend, reduced, subpage, setSubpage, setPage } = useStore();
  const r = mission.history.at(-1)!;
  const health = evaluate(mission);
  const [reset, setReset] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const regionMetrics: Record<Region, Metric[]> = {
    Head: ["sleep", "stress"],
    Chest: ["hr", "spo2"],
    Muscles: ["activity"],
  };

  // If a hazard subpage is active, render dedicated detail subpage
  if (subpage?.startsWith("hazard-")) {
    const hazardId = subpage.replace("hazard-", "") as NASAhazardId;
    return (
      <HazardDetailSubpage
        hazardId={hazardId}
        onBack={() => setSubpage(null)}
        onOpenSubfeature={(id) => {
          if (id === "radiation") {
            setPage("Space");
            setSubpage("radiation");
          } else if (id === "isolation") {
            setPage("My Health");
            setSubpage("mental-wellness");
          } else if (id === "gravity") {
            setPage("My Health");
            setSubpage("exercise-tracker");
          } else if (id === "environment") {
            setPage("Space");
            setSubpage("cabin-environment");
          } else if (id === "distance") {
            setPage("Settings");
            setSubpage("offline-readiness");
          }
        }}
      />
    );
  }

  const hazardIcons = {
    radiation: Sun,
    isolation: Users,
    distance: RadioIcon,
    gravity: Activity,
    environment: Gauge,
  };
  return (
    <>
      <div className="overview-grid">
        <div className="overview-left">
          <section className="panel health-status">
            <div className="status-head-row">
              <div className="eyebrow">HEALTH STATUS</div>
              <button
                className="report-action-pill"
                onClick={() => setReportOpen(true)}
                title="Download daily health report"
              >
                <FileText size={12} /> REPORT PDF
              </button>
            </div>
            <div
              className={
                "status-title " +
                (health.status === "ATTENTION" ? "attention" : "")
              }
            >
              <i className="dot" />
              {health.status}
            </div>
            <p>
              {health.status === "NOMINAL"
                ? "Looking steady, Commander."
                : "A trend needs your attention."}
            </p>
            <div className="status-foot">
              <ShieldCheck size={14} /> PERSONAL BASELINE ACTIVE
            </div>
          </section>
          <section className="panel signals">
            <div className="panel-heading">
              <span>YOUR HEALTH SIGNALS</span>
              <span className="tiny-dot" />
            </div>
            {(Object.keys(metrics) as Metric[]).map((m) => {
              const Icon = icons[m];
              return (
                <button className="signal" key={m} onClick={() => trend(m)}>
                  <span className={"signal-icon " + m}>
                    <Icon size={18} />
                  </span>
                  <span className="signal-label">
                    {metrics[m].name}
                    <small>
                      {m === "hr"
                        ? "Resting observation"
                        : m === "sleep"
                          ? "Last simulated night"
                          : "Simulated reading"}
                    </small>
                  </span>
                  <span className="signal-value">
                    {m === "sleep"
                      ? `${Math.floor(r.sleep)}h ${Math.round((r.sleep % 1) * 60)}m`
                      : m === "stress"
                        ? r.stress < 40
                          ? "LOW"
                          : r.stress < 65
                            ? "MODERATE"
                            : "HIGH"
                        : m === "activity"
                          ? r.activity >= 70
                            ? "GOOD"
                            : "LOW"
                          : r[m]}
                    <small>
                      {m === "hr"
                        ? "BPM"
                        : m === "spo2"
                          ? "%"
                          : m === "stress" || m === "activity"
                            ? `${r[m]} / 100`
                            : ""}
                    </small>
                  </span>
                </button>
              );
            })}
            <div className="provenance">
              <i className="tiny-dot" /> SIMULATED TELEMETRY
            </div>
          </section>
          <section className="daily-note">
            <span className="eyebrow">A LITTLE CHECK-IN GOES A LONG WAY</span>
            <p>Your perspective completes the picture.</p>
            <button onClick={() => useStore.getState().setPage("Check-in")}>
              Complete daily check-in <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
        <section className="astronaut-stage">
          <div className="stage-heading">
            <span className="eyebrow">CREW HEALTH DIGITAL TWIN</span>
            <span className="tag">ASTRA / 01</span>
          </div>
          <div className="orbit-decoration" />
          <Suspense
            fallback={
              <div className="scene-fallback">Preparing astronaut…</div>
            }
          >
            <Astronaut resetKey={reset} />
          </Suspense>
          <div className="region-guide">
            <span className="tiny-dot" />
            {region.toUpperCase()}
            <span className="guide-line" />
          </div>
          <div className="stage-footer">
            <div className="region-buttons">
              {(["Head", "Chest", "Muscles"] as Region[]).map((r) => (
                <button
                  key={r}
                  aria-pressed={region === r}
                  onClick={() => select(r)}
                >
                  {r}
                </button>
              ))}
              <button
                className="icon-button"
                aria-label="Reset astronaut view"
                onClick={() => setReset((x) => x + 1)}
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <p>
              <Move size={12} /> Drag to rotate · Scroll to zoom · Select to
              explore
            </p>
          </div>
        </section>
        <div className="overview-right">
          <CameraPanel />
          <motion.section
            key={region}
            initial={reduced ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel body-analysis"
          >
            <div className="panel-heading">
              <span>BODY ANALYSIS</span>
              <div className="body-analysis-region-tabs">
                {(["Head", "Chest", "Muscles"] as Region[]).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    className={`analysis-reg-btn ${region === reg ? "active" : ""}`}
                    onClick={() => select(reg)}
                  >
                    {reg.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <h3>
              {region === "Chest"
                ? "At the heart of your health."
                : region === "Head"
                  ? "Rest. Recover. Refocus."
                  : "Keep your mission moving."}
            </h3>
            {regionMetrics[region].map((m) => (
              <div className="analysis-metric" key={m}>
                <span>
                  {metrics[m].name}
                  <small>
                    Personal baseline: {baseline[m]} {metrics[m].unit}
                  </small>
                </span>
                <strong>
                  {r[m]} <small>{metrics[m].unit}</small>
                </strong>
              </div>
            ))}
            <p>
              {region === "Chest"
                ? `${Math.round(((r.hr - baseline.hr) / baseline.hr) * 100)}% above resting baseline. ${health.status === "ATTENTION" ? "Review persistent trends in My Health." : "No persistent attention pattern."}`
                : region === "Head"
                  ? "Sleep and stress are considered together across repeated nights."
                  : "Activity is a simulated daily context score, independent of camera tracking."}
            </p>
            <div className="body-analysis-actions">
              <button
                className="trend-link"
                onClick={() => trend(regionMetrics[region][0])}
              >
                VIEW TREND <ArrowUpRight size={16} />
              </button>
              <button
                className="studio-shortcut-link"
                onClick={() => setPage("Camera Tracking")}
                title="Open full camera tracking studio"
              >
                FULL STUDIO <ChevronRight size={14} />
              </button>
            </div>
          </motion.section>
        </div>
      </div>
      <section
        className={
          "panel today-status " +
          (health.status === "ATTENTION" ? "attention-border" : "")
        }
      >
        <div className="today-icon">
          <ShieldCheck size={23} />
        </div>
        <div>
          <div className="eyebrow">
            TODAY’S STATUS{" "}
            <span className="status-inline">{health.status}</span>
          </div>
          <h3>{health.reasons[0]}</h3>
          <p>{health.action}</p>
        </div>
        <button className="button outline" onClick={() => trend("hr")}>
          VIEW DETAILS <ArrowUpRight size={14} />
        </button>
      </section>
      <Simulation />

      {/* NASA Five Human Spaceflight Hazards Section */}
      <section className="panel mission-hazards-section">
        <div className="section-head-box">
          <div className="eyebrow">NASA HUMAN RESEARCH PROGRAM (HRP) TAXONOMY</div>
          <h2>MISSION HEALTH RISKS</h2>
          <p className="subtitle">
            Understand the five fundamental hazards of living and working beyond Earth’s atmosphere.
          </p>
        </div>

        <div className="hazards-cards-grid">
          {NASA_FIVE_HAZARDS.map((hazard) => {
            const IconComponent = hazardIcons[hazard.id];
            return (
              <motion.div
                key={hazard.id}
                className="hazard-card"
                whileHover={reduced ? {} : { y: -3, boxShadow: "0 8px 24px rgba(14, 165, 233, 0.15)" }}
                transition={{ duration: 0.2 }}
                onClick={() => setSubpage(`hazard-${hazard.id}`)}
              >
                <div className="hazard-card-head">
                  <div className="hazard-icon-bubble">
                    <IconComponent size={20} className="accent-cyan" />
                  </div>
                  <span className="hazard-data-badge">{hazard.dataAvailability}</span>
                </div>
                <h3>{hazard.name}</h3>
                <p className="hazard-desc">{hazard.shortDesc}</p>
                <div className="hazard-card-foot">
                  <span className="details-link">
                    Open Details <ChevronRight size={14} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
