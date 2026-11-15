import { useState } from "react";
import {
  Heart,
  Wind,
  Activity,
  Zap,
  Moon,
  Camera,
  Maximize2,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Crosshair,
  TrendingUp,
  Cpu,
  Eye,
  Sliders,
} from "lucide-react";
import CameraPanel from "../camera/CameraPanel";
import { useStore } from "../state/store";
import { baseline, metrics, type Metric, type Region } from "../types";
import { evaluate } from "../engine/healthEngine";

export default function CameraTrackingPage() {
  const { mission, region, select, trend } = useStore();
  const r = mission.history.at(-1)!;
  const health = evaluate(mission);

  const regionMetrics: Record<Region, Metric[]> = {
    Head: ["sleep", "stress"],
    Chest: ["hr", "spo2"],
    Muscles: ["activity"],
  };

  return (
    <div className="camera-tracking-page-root">
      {/* 1. Aerospace HUD Status Bar */}
      <div className="camera-flight-deck-hud">
        <div className="hud-left-meta">
          <div className="hud-badge status-ready">
            <span className="live-dot" />
            <span>AI COMPUTER VISION ACTIVE</span>
          </div>

          <div className="hud-badge engine-pill">
            <Cpu size={13} className="accent-cyan" />
            <span>MediaPipe Edge ML Tasks</span>
            <small className="engine-sub">LOCAL WASM / ON-DEVICE</small>
          </div>

          <div className="hud-badge privacy-pill">
            <ShieldCheck size={13} className="accent-green" />
            <span>ZERO CLOUD UPLOAD · 100% PRIVATE</span>
          </div>
        </div>

        <div className="hud-right-actions">
          <div className="region-selector-pills">
            <span className="region-lbl">ANALYZE REGION:</span>
            {(["Chest", "Head", "Muscles"] as Region[]).map((reg) => (
              <button
                key={reg}
                type="button"
                className={`reg-pill-btn ${region === reg ? "active" : ""}`}
                onClick={() => select(reg)}
              >
                {reg.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Studio Grid: Camera Tracking Feed (Left) + Body Analysis & Telemetry (Right) */}
      <div className="camera-studio-grid">
        {/* Left Column: Full-Featured Camera Tracking Console */}
        <div className="camera-feed-column">
          <CameraPanel />
        </div>

        {/* Right Column: Advanced Body Analysis & Biometric Telemetry Station */}
        <div className="body-analysis-station-column">
          <div className="panel telemetry-station-card">
            <div className="station-header">
              <div className="station-title-group">
                <span className="eyebrow">AEROSPACE BIOMETRIC TELEMETRY</span>
                <h2>BODY ANALYSIS · {region.toUpperCase()}</h2>
              </div>
              <span className="region-tag-pill">{region} REGION</span>
            </div>

            <div className="tagline-box">
              <Sparkles size={15} className="accent-cyan" />
              <h3>
                {region === "Chest"
                  ? "At the heart of your health."
                  : region === "Head"
                    ? "Rest. Recover. Refocus."
                    : "Keep your mission moving."}
              </h3>
            </div>

            {/* Live Metrics Grid */}
            <div className="telemetry-metrics-stack">
              {region === "Chest" && (
                <>
                  {/* Heart Rate Card */}
                  <div className="telemetry-metric-tile">
                    <div className="tile-top">
                      <div className="tile-lbl-group">
                        <span className="tile-icon-wrap rose">
                          <Heart size={16} />
                        </span>
                        <div>
                          <strong>Heart Rate</strong>
                          <small>Personal baseline: {baseline.hr} BPM</small>
                        </div>
                      </div>
                      <div className="tile-val-group">
                        <span className="tile-number">{r.hr}</span>
                        <span className="tile-unit">BPM</span>
                      </div>
                    </div>

                    <div className="pulse-rhythm-bar">
                      <div className="rhythm-wave" />
                      <span className="rhythm-tag">+6% above resting baseline</span>
                    </div>
                  </div>

                  {/* Blood Oxygen (SpO2) Card */}
                  <div className="telemetry-metric-tile">
                    <div className="tile-top">
                      <div className="tile-lbl-group">
                        <span className="tile-icon-wrap cyan">
                          <Wind size={16} />
                        </span>
                        <div>
                          <strong>Blood Oxygen (SpO₂)</strong>
                          <small>Personal baseline: {baseline.spo2} %</small>
                        </div>
                      </div>
                      <div className="tile-val-group">
                        <span className="tile-number">{r.spo2}</span>
                        <span className="tile-unit">%</span>
                      </div>
                    </div>

                    <div className="saturation-track">
                      <div
                        className="saturation-fill"
                        style={{ width: `${Math.min(100, r.spo2)}%` }}
                      />
                      <span className="saturation-tag">Nominal Arterial Perfusion</span>
                    </div>
                  </div>
                </>
              )}

              {region === "Head" && (
                <>
                  {/* Sleep & Circadian Card */}
                  <div className="telemetry-metric-tile">
                    <div className="tile-top">
                      <div className="tile-lbl-group">
                        <span className="tile-icon-wrap blue">
                          <Moon size={16} />
                        </span>
                        <div>
                          <strong>Sleep Duration</strong>
                          <small>Last simulated night</small>
                        </div>
                      </div>
                      <div className="tile-val-group">
                        <span className="tile-number">
                          {Math.floor(r.sleep)}h {Math.round((r.sleep % 1) * 60)}m
                        </span>
                      </div>
                    </div>
                    <div className="saturation-track">
                      <div className="saturation-fill blue" style={{ width: "88%" }} />
                      <span className="saturation-tag">Circadian Stability Nominal</span>
                    </div>
                  </div>

                  {/* Stress Level Card */}
                  <div className="telemetry-metric-tile">
                    <div className="tile-top">
                      <div className="tile-lbl-group">
                        <span className="tile-icon-wrap amber">
                          <Zap size={16} />
                        </span>
                        <div>
                          <strong>Stress Score</strong>
                          <small>Autonomic state evaluation</small>
                        </div>
                      </div>
                      <div className="tile-val-group">
                        <span className="tile-number">
                          {r.stress < 40 ? "LOW" : r.stress < 65 ? "MODERATE" : "HIGH"}
                        </span>
                        <span className="tile-unit">{r.stress}/100</span>
                      </div>
                    </div>
                    <div className="saturation-track">
                      <div
                        className="saturation-fill amber"
                        style={{ width: `${Math.min(100, r.stress)}%` }}
                      />
                      <span className="saturation-tag">Restful Cognitive Baseline</span>
                    </div>
                  </div>
                </>
              )}

              {region === "Muscles" && (
                <>
                  {/* Physical Activity Card */}
                  <div className="telemetry-metric-tile">
                    <div className="tile-top">
                      <div className="tile-lbl-group">
                        <span className="tile-icon-wrap green">
                          <Activity size={16} />
                        </span>
                        <div>
                          <strong>Physical Activity Score</strong>
                          <small>Microgravity resistive exercise</small>
                        </div>
                      </div>
                      <div className="tile-val-group">
                        <span className="tile-number">
                          {r.activity >= 70 ? "GOOD" : "LOW"}
                        </span>
                        <span className="tile-unit">{r.activity}/100</span>
                      </div>
                    </div>
                    <div className="saturation-track">
                      <div
                        className="saturation-fill green"
                        style={{ width: `${Math.min(100, r.activity)}%` }}
                      />
                      <span className="saturation-tag">Musculoskeletal Countermeasure Nominal</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Narrative Context Card */}
            <div className="narrative-callout-box">
              <div className="narrative-header">
                <span className="live-dot" />
                <strong>CLINICAL INTERPRETATION</strong>
              </div>
              <p>
                {region === "Chest"
                  ? "6% above resting baseline. No persistent attention pattern. Cardiovascular telemetry remains within predicted spaceflight parameters."
                  : region === "Head"
                    ? "Sleep was restful. Morning focus is sharp. Autonomic nervous recovery indicators are stable."
                    : "Activity is a simulated daily context score, evaluated alongside kinematic camera tracking feedback."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="station-action-buttons">
              <button
                type="button"
                className="button primary full-action-btn"
                onClick={() => trend(regionMetrics[region][0])}
              >
                <span>VIEW TREND IN MY HEALTH</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Biomechanical Spaceflight Guidance Box */}
          <div className="panel spaceflight-guidance-card">
            <div className="guidance-top">
              <Crosshair size={16} className="accent-cyan" />
              <h4>Microgravity Kinematic Alignment Guidelines</h4>
            </div>
            <ul className="guidance-list">
              <li>
                <strong>Camera Position:</strong> Position your device webcam at chest height, approximately 1.0–1.5 meters away for complete skeletal landmark capture.
              </li>
              <li>
                <strong>Neutral Body Posture (NBP):</strong> Astronauts naturally assume a semi-flexed neutral posture in zero gravity. Avoid hyperextending shoulders during tracking.
              </li>
              <li>
                <strong>Local Machine Processing:</strong> All facial landmarks, joint angles, and pose calculations run entirely in your local browser sandbox via WebAssembly.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
