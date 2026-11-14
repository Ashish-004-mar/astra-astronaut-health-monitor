import React, { useState } from "react";
import { Layers, Database, Cpu, Activity, Lightbulb, Monitor, ShieldCheck, ChevronRight } from "lucide-react";

interface NodeDetail {
  id: string;
  name: string;
  layer: string;
  role: string;
  inputs: string;
  processing: string;
  outputs: string;
  codeModule: string;
}

const ARCH_NODES: Record<string, NodeDetail> = {
  "bio-sim": {
    id: "bio-sim",
    name: "Simulated Biometrics",
    layer: "Layer 1: Data Sources",
    role: "Generates realistic, deterministic astronaut cardiovascular and respiratory telemetry.",
    inputs: "Mission elapsed time, crew sleep schedules, exercise load, baseline seeds.",
    processing: "Sine-wave diurnal variance, physiological drift, heart rate variability (HRV) math.",
    outputs: "Heart rate (BPM), SpO2 (%), sleep duration (hrs), stress index (0-100).",
    codeModule: "src/engine/simulationEngine.ts & healthEngine.ts",
  },
  "crew-checkins": {
    id: "crew-checkins",
    name: "Crew Check-in Records",
    layer: "Layer 1: Data Sources",
    role: "Ingests subjective astronaut self-assessments on fatigue, mood, energy, and physical discomfort.",
    inputs: "Daily crew questionnaire sliders, 2-minute quick check-in selections.",
    processing: "Validation against historical mission days, qualitative-to-quantitative mapping.",
    outputs: "Timestamped JSON self-reported wellness records.",
    codeModule: "src/services/wellnessService.ts",
  },
  "water-food": {
    id: "water-food",
    name: "AquaGuard & Nutrition",
    layer: "Layer 1: Data Sources",
    role: "Tracks spacecraft water quality (TOC, conductivity) and shelf-life food nutrient degradation.",
    inputs: "ECLSS sensor readings, manual test kit entries, galley meal consumption logs.",
    processing: "NASA SMCL safety thresholds (< 500 ppb TOC), micronutrient depletion equations.",
    outputs: "Water potability status, hydration percentages, nutrient deficit alerts.",
    codeModule: "src/services/aquaguardService.ts & nutritionService.ts",
  },
  "nasa-donki": {
    id: "nasa-donki",
    name: "NASA DONKI API",
    layer: "Layer 1: Data Sources",
    role: "Fetches space weather data: solar flares, coronal mass ejections, geomagnetic storms.",
    inputs: "NASA open API endpoints (kauai.ccmc.gsfc.nasa.gov/DONKI).",
    processing: "Live HTTPS polling with autonomous deterministic fallback when communication is delayed.",
    outputs: "Space radiation danger index, solar energetic particle (SEP) severity flags.",
    codeModule: "src/services/spaceWeather.ts",
  },
  "mediapipe": {
    id: "mediapipe",
    name: "MediaPipe Landmarks",
    layer: "Layer 1: Data Sources",
    role: "On-device CPU/WASM webcam face and body tracking with zero cloud video transmission.",
    inputs: "Webcam video frames in browser memory.",
    processing: "468 3D facial landmarks, Eye Aspect Ratio (EAR) for blink rate & fatigue detection.",
    outputs: "Blink frequency, micro-sleep flags, posture alignment angles.",
    codeModule: "src/camera/CameraPanel.tsx & LandmarkOverlay.ts",
  },
  "baseline-calc": {
    id: "baseline-calc",
    name: "Baseline Engine",
    layer: "Layer 2: Local Processing",
    role: "Computes personalized multi-day running averages to detect physiological anomalies.",
    inputs: "Raw biometric telemetry stream across past mission days.",
    processing: "Rolling mean, standard deviation envelope, deviation delta calculation.",
    outputs: "Personal baseline variance (% delta from nominal personal state).",
    codeModule: "src/engine/healthEngine.ts",
  },
  "local-persist": {
    id: "local-persist",
    name: "Local Persistence",
    layer: "Layer 2: Local Processing",
    role: "Stores all telemetry, check-ins, water tests, and logs in browser LocalStorage / IndexedDB.",
    inputs: "Zustand store state changes, completed check-in payloads, test logs.",
    processing: "JSON serialization, schema versioning, offline quota management.",
    outputs: "100% offline persistence across page reloads and browser sessions.",
    codeModule: "src/state/store.ts",
  },
  "digital-twin": {
    id: "digital-twin",
    name: "3D Digital Twin",
    layer: "Layer 3: Monitoring",
    role: "Renders interactive procedural 3D spacesuit with biometric anatomical highlight regions.",
    inputs: "Selected body region (Chest, Head, Arms, Legs), current biometric state.",
    processing: "Three.js mesh bone mapping, glowing shaders, real-time pulse animations.",
    outputs: "Interactive 3D model with anatomical inspection and visual telemetry anchors.",
    codeModule: "src/three/Scene.tsx",
  },
  "eclss-loop": {
    id: "eclss-loop",
    name: "ECLSS Closed Loop",
    layer: "Layer 3: Monitoring",
    role: "Monitors ISS-style 98% water recovery pipeline and spacecraft cabin life support.",
    inputs: "TOC (ppb), conductivity (µS/cm), microbial incubation status.",
    processing: "Autonomous safety rule evaluation (never treating pending test as safe).",
    outputs: "NOMINAL, ELEVATED TOC, or MICROBIAL TEST FLAG status badges with procedural steps.",
    codeModule: "src/pages/subpages/AquaGuardSubpage.tsx",
  },
  "explainable-ai": {
    id: "explainable-ai",
    name: "Explainable Signals",
    layer: "Layer 4: Decision Support",
    role: "Converts complex multi-variate telemetry variances into plain-language flight surgeon reasons.",
    inputs: "Baseline variances, sleep deficit, space radiation levels, water alerts.",
    processing: "Rule-based aerospace medicine inference engine with deterministic rationale trees.",
    outputs: "Clear medical reason strings (e.g. 'Elevated heart rate correlated with 3.2h sleep deficit').",
    codeModule: "src/services/pdfReport.ts & store.ts",
  },
  "voice-assistant": {
    id: "voice-assistant",
    name: "Offline Voice Assistant",
    layer: "Layer 5: User Experience",
    role: "160-item bilingual aerospace voice assistant running 100% in browser memory.",
    inputs: "Speech audio via Web Speech API or typed queries in English, Hindi, or Hinglish.",
    processing: "Token-based intent matcher with dynamic simulation telemetry interpolation.",
    outputs: "Spoken voice synthesis response and visual aerospace chat transcript.",
    codeModule: "src/voice/AstraVoicePanel.tsx & intentMatcher.ts",
  },
  "pdf-generator": {
    id: "pdf-generator",
    name: "Vector PDF Reports",
    layer: "Layer 5: User Experience",
    role: "Renders official 3-page clinical flight surgeon health reports directly in-memory.",
    inputs: "Mission telemetry history, baseline variances, daily check-in responses.",
    processing: "jsPDF client-side vector drawing, sparkline chart generation, aerospace typography.",
    outputs: "Downloadable crisp printable PDF report with zero server transmission.",
    codeModule: "src/services/pdfReport.ts & wellnessPdfReport.ts",
  },
};

const LAYERS = [
  {
    name: "Layer 1: Data Sources",
    icon: Database,
    badge: "5 CHANNELS",
    nodes: ["bio-sim", "crew-checkins", "water-food", "nasa-donki", "mediapipe"],
  },
  {
    name: "Layer 2: Local Processing",
    icon: Cpu,
    badge: "CLIENT-SIDE",
    nodes: ["baseline-calc", "local-persist"],
  },
  {
    name: "Layer 3: Monitoring",
    icon: Activity,
    badge: "REAL-TIME",
    nodes: ["digital-twin", "eclss-loop"],
  },
  {
    name: "Layer 4: Decision Support",
    icon: Lightbulb,
    badge: "DETERMINISTIC",
    nodes: ["explainable-ai"],
  },
  {
    name: "Layer 5: User Experience",
    icon: Monitor,
    badge: "OFFLINE-READY",
    nodes: ["voice-assistant", "pdf-generator"],
  },
];

export default function SystemArchitecture3D() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("bio-sim");
  const activeNode = ARCH_NODES[selectedNodeId] || ARCH_NODES["bio-sim"];

  return (
    <section className="arch-section" id="architecture">
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="section-badge">// 5-LAYER BIOASTRONAUTICS STACK</div>
        <h2 className="section-title">INSIDE ASTRA — SYSTEM ARCHITECTURE</h2>
        <p className="section-subtitle">
          Real implemented telemetry pipeline: from client-side deterministic biometrics and NASA DONKI APIs
          to explainable flight surgeon recommendations and vector PDF generation.
        </p>
      </div>

      <div className="arch-layout">
        {/* Left Side: 5 Layer Stack with Interactive Nodes */}
        <div className="arch-canvas-box">
          <div className="arch-layers-stack">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.name} className="arch-layer-card">
                  <div className="arch-layer-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon size={16} color="#38bdf8" />
                      <span className="arch-layer-title">{layer.name}</span>
                    </div>
                    <span className="arch-layer-badge">{layer.badge}</span>
                  </div>

                  <div className="arch-nodes-grid">
                    {layer.nodes.map((nodeKey) => {
                      const node = ARCH_NODES[nodeKey];
                      const isSelected = selectedNodeId === nodeKey;
                      return (
                        <button
                          key={nodeKey}
                          className={`arch-node-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedNodeId(nodeKey)}
                        >
                          <span>{node.name}</span>
                          <ChevronRight size={12} style={{ opacity: isSelected ? 1 : 0.4 }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Technical Inspector Drawer */}
        <div className="arch-inspector-panel">
          <div className="inspector-header">
            <div className="inspector-label">{activeNode.layer}</div>
            <h3 className="inspector-title">{activeNode.name}</h3>
            <div className="inspector-role">{activeNode.role}</div>
          </div>

          <div className="inspector-section">
            <div className="inspector-label">INPUTS / TRIGGERS</div>
            <div className="inspector-text">{activeNode.inputs}</div>
          </div>

          <div className="inspector-section">
            <div className="inspector-label">INTERNAL PROCESSING</div>
            <div className="inspector-text">{activeNode.processing}</div>
          </div>

          <div className="inspector-section">
            <div className="inspector-label">OUTPUT TELEMETRY</div>
            <div className="inspector-text">{activeNode.outputs}</div>
          </div>

          <div className="inspector-section" style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
            <div className="inspector-label">CODEBASE IMPLEMENTATION</div>
            <code style={{ fontSize: "0.72rem", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
              {activeNode.codeModule}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
