import { useState, useEffect } from "react";
import {
  Globe,
  Orbit,
  Moon,
  Compass,
  Radio,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Box,
  Layers,
} from "lucide-react";
import {
  MISSION_ENVIRONMENTS,
  setActiveEnvironment,
  addTimelineEntry,
  type MissionEnvironmentId,
  type MissionEnvironmentInfo,
} from "../../services/missionCareService";

interface MissionEnvironmentViewProps {
  currentEnv: MissionEnvironmentId;
  onEnvironmentChange: (env: MissionEnvironmentId) => void;
}

export default function MissionEnvironmentView({
  currentEnv,
  onEnvironmentChange,
}: MissionEnvironmentViewProps) {
  const [selected, setSelected] = useState<MissionEnvironmentId>(currentEnv);

  // Simulated round-trip comm latency ping
  const [pingActive, setPingActive] = useState(false);
  const [pingSecondsRemaining, setPingSecondsRemaining] = useState<number>(0);

  const envInfo: MissionEnvironmentInfo = MISSION_ENVIRONMENTS[selected];

  const handleSelect = (envId: MissionEnvironmentId) => {
    setSelected(envId);
    setActiveEnvironment(envId);
    onEnvironmentChange(envId);

    addTimelineEntry({
      category: "STATUS_UPDATE",
      title: `Mission Environment Switched: ${MISSION_ENVIRONMENTS[envId].name}`,
      details: `Gravity: ${MISSION_ENVIRONMENTS[envId].gravityLabel} · Comm Latency: ${MISSION_ENVIRONMENTS[envId].commLatencyMinutes} min.`,
      provenance: "MANUAL_ENTRY",
      author: "Flight Director Console",
      missionDay: 147,
    });
  };

  const handleSimulatePing = () => {
    setPingActive(true);
    // Scale ping for interactive demo (10 seconds for demo visualization)
    setPingSecondsRemaining(10);
  };

  useEffect(() => {
    if (!pingActive || pingSecondsRemaining <= 0) {
      if (pingActive && pingSecondsRemaining <= 0) setPingActive(false);
      return;
    }

    const timer = setInterval(() => {
      setPingSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [pingActive, pingSecondsRemaining]);

  return (
    <div className="mission-env-root">
      {/* Environment Selector Strip */}
      <div className="env-selector-tabs-grid">
        {(
          [
            { id: "spacecraft", label: "Spacecraft / Transit", icon: Compass, sub: "Microgravity · Near Earth" },
            { id: "iss", label: "ISS (Low Earth Orbit)", icon: Orbit, sub: "0g · Real-time Comm · CMRS" },
            { id: "lunar", label: "Lunar Surface Base", icon: Moon, sub: "1/6th g · Artemis Habitat" },
            { id: "mars", label: "Mars Transit Vehicle", icon: Globe, sub: "0g · 14-min Comm Delay · Deep Space" },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`env-tab-card ${selected === tab.id ? "active" : ""}`}
              onClick={() => handleSelect(tab.id)}
            >
              <div className="env-tab-top">
                <Icon size={18} className="env-icon" />
                <span className="env-grav-tag">{MISSION_ENVIRONMENTS[tab.id].gravityLabel}</span>
              </div>
              <h4>{tab.label}</h4>
              <p>{tab.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Environment Dashboard */}
      <div className="env-dashboard-panel">
        <div className="env-panel-header">
          <div>
            <span className="eyebrow">ACTIVE MISSION OPERATING CONTEXT</span>
            <h2>{envInfo.name}</h2>
            <p className="env-desc-sub">{envInfo.habitatDescription}</p>
          </div>

          <div className="env-comm-hud">
            <Radio size={16} className={envInfo.commLatencyMinutes > 2 ? "accent-orange" : "accent-cyan"} />
            <div>
              <span className="hud-lbl">ONE-WAY COMM LATENCY:</span>
              <strong>{envInfo.commLatencyMinutes} MINUTES</strong>
            </div>
          </div>
        </div>

        {/* Mars Comm Delay Feature Card */}
        {selected === "mars" && (
          <div className="mars-latency-card">
            <div className="latency-left">
              <Clock size={20} className="accent-orange" />
              <div>
                <h4>Mars Transit Communications Latency: 14 Minutes One-Way</h4>
                <p>
                  At mid-point Mars transit, electromagnetic signals take 14 minutes to reach Houston Mission Control. A round-trip query and clinical response requires
                  <strong> at least 28 minutes</strong>. The on-orbit crew must act with full clinical autonomy.
                </p>
              </div>
            </div>

            <div className="latency-right">
              <button
                type="button"
                className="button outline small-btn"
                disabled={pingActive}
                onClick={handleSimulatePing}
              >
                {pingActive ? `Signal in Flight (${pingSecondsRemaining}s)` : "Simulate Ground Telemetry Ping"}
              </button>
            </div>
          </div>
        )}

        <div className="env-metrics-split-grid">
          {/* Column 1: Operational Guidelines */}
          <div className="env-col-card">
            <span className="col-tag">CRITICAL FACTORS</span>
            <h3>Operational Considerations</h3>
            <ul className="env-bullet-list">
              {envInfo.operationalConsiderations.map((item, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={14} className="accent-cyan" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>

            <div className="evac-info-box">
              <strong>Earth Evacuation Capability:</strong>
              <p>
                {envInfo.evacuationPossible
                  ? `Viable: ${envInfo.evacTimeDescription}`
                  : `Non-viable: ${envInfo.evacTimeDescription}`}
              </p>
            </div>
          </div>

          {/* Column 2: Equipment Assumptions */}
          <div className="env-col-card">
            <span className="col-tag">HARDWARE SUITE</span>
            <h3>Assumed Medical Equipment Set</h3>
            <ul className="env-bullet-list">
              {envInfo.equipmentAssumptions.map((item, idx) => (
                <li key={idx}>
                  <Box size={14} className="accent-mint" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>

            <div className="procedural-mandate-card">
              <ShieldCheck size={16} className="accent-mint" />
              <p>
                <strong>Procedural Rule:</strong> Physical emergency procedures are not generated from gravity alone; they strictly derive from authorized NASA/ISS Flight Rules and mission medical checklists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
