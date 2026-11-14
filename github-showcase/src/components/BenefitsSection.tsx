import React from "react";
import { Shield, Brain, Activity, WifiOff, FileCheck, Layers } from "lucide-react";

const BENEFITS = [
  {
    num: "01 // RESILIENCE",
    title: "Autonomous Deep Space Operation",
    icon: WifiOff,
    desc: "Designed for interplanetary transits where light-speed communication delays reach up to 22 minutes each way. ASTRA functions with zero cloud dependency.",
  },
  {
    num: "02 // PERSONALIZATION",
    title: "Personal Baseline Comparisons",
    icon: Activity,
    desc: "Astronaut physiology varies widely in microgravity. ASTRA evaluates health against individualized multi-day rolling baselines rather than static terrestrial population norms.",
  },
  {
    num: "03 // HOLISTIC WELLNESS",
    title: "Physical & Cognitive Integration",
    icon: Brain,
    desc: "Combines cardiovascular biometrics with daily subjective check-ins, fatigue detection, and nutrition tracking for full-spectrum crew readiness assessment.",
  },
  {
    num: "04 // EXPLAINABILITY",
    title: "Transparent Flight Surgeon Logic",
    icon: FileCheck,
    desc: "Every health alert is paired with a clear, deterministic clinical rationale, preventing alert fatigue and giving astronauts actionable countermeasure steps.",
  },
  {
    num: "05 // PRIVACY",
    title: "Zero-Leak Client-Side Privacy",
    icon: Shield,
    desc: "Webcam facial landmarks, voice speech recognition, and medical records execute purely in local browser memory (WASM/CPU) without remote recording.",
  },
  {
    num: "06 // LIFE SUPPORT",
    title: "Closed-Loop ECLSS Integration",
    icon: Layers,
    desc: "Bridges human health telemetry with spacecraft environmental life support systems, correlating water purity and nutritional stability directly with crew vitals.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section" id="benefits">
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="section-badge">// VALUE PROPOSITION</div>
        <h2 className="section-title">WHY ASTRA MATTERS</h2>
        <p className="section-subtitle">
          Engineered to solve the critical bioastronautics challenges of Artemis lunar exploration,
          Mars transit missions, and orbital habitat operations.
        </p>
      </div>

      <div className="benefits-grid">
        {BENEFITS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="benefit-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className="benefit-number">{item.num}</span>
                <Icon size={18} color="#38bdf8" />
              </div>
              <h3 className="benefit-title">{item.title}</h3>
              <p className="benefit-desc">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
