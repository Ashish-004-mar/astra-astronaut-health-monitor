import { useState, useEffect } from "react";
import {
  Radio,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Info,
  ServerOff,
  Cpu,
} from "lucide-react";
import { testOfflineReadiness } from "../../services/hazardService";
import type { OfflineCheckItem } from "../../types/hazards";
import { useStore } from "../../state/store";

interface OfflineReadinessSubpageProps {
  onBack: () => void;
}

export default function OfflineReadinessSubpage({ onBack }: OfflineReadinessSubpageProps) {
  const { checkins, clear } = useStore();
  const [items, setItems] = useState<OfflineCheckItem[]>([]);
  const [testing, setTesting] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const runTests = async () => {
    setTesting(true);
    const results = await testOfflineReadiness();
    setItems(results);
    setTesting(false);
    setNotice("Offline capability verification completed.");
  };

  useEffect(() => {
    runTests();
  }, []);

  const handleExport = () => {
    const state = useStore.getState();
    const payload = {
      exportedAt: new Date().toISOString(),
      appName: "ASTRA Astronaut Health Monitor",
      mission: state.mission,
      checkins: state.checkins,
      meals: localStorage.getItem("astra_nutrition_meals_v1")
        ? JSON.parse(localStorage.getItem("astra_nutrition_meals_v1")!)
        : [],
      inventory: localStorage.getItem("astra_nutrition_inventory_v1")
        ? JSON.parse(localStorage.getItem("astra_nutrition_inventory_v1")!)
        : [],
      exercise: localStorage.getItem("astra_exercise_sessions_v1")
        ? JSON.parse(localStorage.getItem("astra_exercise_sessions_v1")!)
        : [],
      reaction: localStorage.getItem("astra_reaction_test_v1")
        ? JSON.parse(localStorage.getItem("astra_reaction_test_v1")!)
        : [],
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ASTRA_Mission_Day_${state.mission.day}_Telemetry_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Local telemetry archive successfully exported as JSON.");
  };

  const handleClearDemoData = () => {
    // Clear only simulated demo items, preserve core architecture
    clear();
    setConfirmClear(false);
    setNotice("Demo self-reported check-in history cleared.");
  };

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO SETTINGS
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            SETTINGS <span>/</span> DISTANCE FROM EARTH & OFFLINE AUTONOMY
          </div>
          <h1>OFFLINE MISSION READINESS CONSOLE</h1>
          <p className="subpage-subtitle">
            Autonomous bioastronautics operations during two-way deep space communications blackout.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="nutrition-notice-banner" role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button className="notice-dismiss-btn" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}

      {/* NASA Context */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA DISTANCE FROM EARTH ARCHITECTURAL HAZARD CONTEXT</strong>
        </div>
        <p>
          On deep space exploration missions (Lunar South Pole, Mars transit), Earth communications latency ranges from 1.3 seconds to up to 22 minutes each way, with potential solar conjunction blackouts lasting weeks. ASTRA is architected as an edge-computing, client-embedded system operating with 100% functionality without cloud infrastructure.
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/distance-from-earth/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Distance From Earth Bioastronautics ↗
        </a>
      </section>

      {/* Action Bar */}
      <div className="offline-test-bar">
        <button className="button primary" onClick={runTests} disabled={testing}>
          <RefreshCw size={15} className={testing ? "spinning" : ""} />
          {testing ? "TESTING READINESS…" : "TEST OFFLINE READINESS"}
        </button>
        <button className="button outline" onClick={handleExport}>
          <Download size={15} /> EXPORT LOCAL DATA
        </button>
        <button className="button outline" onClick={() => setConfirmClear(true)}>
          <Trash2 size={15} /> CLEAR DEMO DATA
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmClear && (
        <div className="scientific-warning-card attention-alert">
          <AlertTriangle size={20} className="accent-orange" />
          <div>
            <strong>Clear Local Demo Records?</strong>
            <p>This will reset self-reported check-in entries on this device. Deterministic telemetry models remain unaffected.</p>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button className="button outline" onClick={handleClearDemoData}>
                Confirm Delete
              </button>
              <button className="button text-btn" onClick={() => setConfirmClear(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Subsystem Readiness Checklist */}
      <section className="panel readiness-checklist-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">DIAGNOSTIC TEST RESULTS</span>
            <h2>On-Device Subsystem Capability Matrix</h2>
          </div>
          <span className="tag">
            <Cpu size={12} /> 100% CLIENT COMPUTE
          </span>
        </div>

        <div className="checklist-grid">
          {items.map((item) => (
            <div key={item.id} className="checklist-card">
              <div className="card-top">
                <span className="check-title">{item.label}</span>
                <span
                  className={`status-pill ${
                    item.status === "READY"
                      ? "logged"
                      : item.status === "CACHED"
                        ? "pending"
                        : "danger-pill"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="check-detail">{item.detail}</p>
              <div className="check-footer">
                <small>{item.isLocalOnly ? "✓ On-device only" : "• Public data cached"}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
