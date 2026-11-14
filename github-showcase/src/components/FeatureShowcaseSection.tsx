import React from "react";
import {
  Heart,
  ShieldAlert,
  Droplets,
  UtensilsCrossed,
  ClipboardCheck,
  Mic,
  Eye,
  FileText,
} from "lucide-react";

interface FeatureItem {
  title: string;
  icon: React.ElementType;
  provenance: "SIMULATED TELEMETRY" | "PUBLIC DONKI API" | "ECLSS WRS SPEC" | "NASA HRP GUIDELINES" | "SELF-REPORTED DB" | "100% OFFLINE" | "LOCAL WASM/CPU" | "CLIENT-SIDE JSPDF";
  description: string;
  benefit: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "Crew Health Digital Twin",
    icon: Heart,
    provenance: "SIMULATED TELEMETRY",
    description: "Procedural 3D spacesuit with interactive anatomical highlight nodes, rotating 3D Earth planet, and deterministic cardiovascular telemetry (HR, SpO2, sleep, stress).",
    benefit: "Gives crew and flight surgeons an intuitive spatial model of biological stress and systemic physiological trends.",
  },
  {
    title: "NASA Five Spaceflight Hazards",
    icon: ShieldAlert,
    provenance: "PUBLIC DONKI API",
    description: "Tracks cosmic radiation, Coronal Mass Ejections (CMEs), and geomagnetic storms via NASA's DONKI API with offline deterministic fallback.",
    benefit: "Correlates deep-space space radiation exposure with astronaut heart rate elevation and DNA damage countermeasure protocols.",
  },
  {
    title: "ASTRA AquaGuard Water Safety",
    icon: Droplets,
    provenance: "ECLSS WRS SPEC",
    description: "Closed-loop water quality monitor inspired by NASA's 98% ISS recovery milestone. Tracks TOC (ppb), conductivity, and microbial testing.",
    benefit: "Provides flight-rule procedural guidance when water quality degrades, ensuring crew hydration safety during long-duration transit.",
  },
  {
    title: "Mission Nutrition & Galley",
    icon: UtensilsCrossed,
    provenance: "NASA HRP GUIDELINES",
    description: "Spaceflight nutrition tracking modeled on NASA Human Research Program data. Evaluates shelf-life degradation of vitamins and macronutrient balance.",
    benefit: "Prevents microgravity muscle atrophy and micronutrient deficiencies with targeted countermeasure meal suggestions.",
  },
  {
    title: "Quick 2-Min Wellness Check",
    icon: ClipboardCheck,
    provenance: "SELF-REPORTED DB",
    description: "Rapid clinical assessment of crew cognitive readiness, mood, sleep, and physical discomfort stored in a local indexed browser database.",
    benefit: "Generates instant dedicated vector PDF summaries for rapid crew debriefing without overburdening astronaut schedules.",
  },
  {
    title: "Offline Voice Assistant",
    icon: Mic,
    provenance: "100% OFFLINE",
    description: "Curated aerospace medical companion with 160 Q&As across 9 domains. Supports English, Hindi, and Hinglish with dynamic telemetry interpolation.",
    benefit: "Zero cloud network latency or private medical data leaks, allowing hands-free mission queries during microgravity tasks.",
  },
  {
    title: "Camera Vision Tracking",
    icon: Eye,
    provenance: "LOCAL WASM/CPU",
    description: "Real-time landmark tracking using Google MediaPipe in client WASM/CPU. Measures blink rate, saccade frequency, and workstation posture.",
    benefit: "Zero-storage privacy guarantee: camera frames are processed in volatile memory and immediately discarded, ensuring crew confidentiality.",
  },
  {
    title: "Daily Health PDF Reports",
    icon: FileText,
    provenance: "CLIENT-SIDE JSPDF",
    description: "Crisp 3-page clinical aerospace medical briefs generated directly in browser memory with multi-day trends and countermeasure plans.",
    benefit: "Allows printing or exporting full clinical documentation for Earth mission control synchronization when communication windows open.",
  },
];

export default function FeatureShowcaseSection() {
  return (
    <section className="features-section" id="features">
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="section-badge">// VERIFIED OPERATIONAL SUBSYSTEMS</div>
        <h2 className="section-title">EXPLORE ASTRA FEATURES</h2>
        <p className="section-subtitle">
          Every capability in ASTRA is engineered for zero-dependency deep space transit,
          transparent data provenance, and explainable bioastronautics decision support.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.title} className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper">
                  <Icon size={22} />
                </div>
                <span className="feature-provenance-tag">{feat.provenance}</span>
              </div>

              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.description}</p>

              <div className="feature-benefit-box">
                <strong>PRACTICAL BENEFIT:</strong> {feat.benefit}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
