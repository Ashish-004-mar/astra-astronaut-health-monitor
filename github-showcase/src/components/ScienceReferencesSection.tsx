import React from "react";
import { ExternalLink, AlertTriangle } from "lucide-react";

const CITATIONS = [
  {
    title: "NASA Human Research Program (HRP)",
    desc: "Risk of Inadequate Food and Nutrition on Long-Duration Exploration Missions.",
    url: "https://www.nasa.gov/reference/risk-of-inadequate-food-and-nutrition/",
  },
  {
    title: "NASA ISS 98% Water Recovery Milestone",
    desc: "ECLSS Environmental Control & Life Support Systems Water Recovery System milestone.",
    url: "https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/",
  },
  {
    title: "NASA DONKI Space Weather APIs",
    desc: "Space Weather Database Of Notifications, Knowledge, And Information.",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
  },
  {
    title: "NASA Open Science Data Repository (OSDR)",
    desc: "Spaceflight multi-omics and human spaceflight biomedical baselines.",
    url: "https://osdr.nasa.gov/",
  },
];

export default function ScienceReferencesSection() {
  return (
    <section className="science-section" id="science">
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div className="section-badge">// AEROSPACE SCIENTIFIC FOUNDATION</div>
        <h2 className="section-title">NASA RESEARCH CITATIONS</h2>
        <p className="section-subtitle">
          ASTRA's physiological modeling, water contaminant thresholds, and space weather correlation
          are built on published NASA open science and flight operational benchmarks.
        </p>
      </div>

      <div className="science-grid">
        {CITATIONS.map((cit) => (
          <a
            key={cit.title}
            href={cit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="science-ref-card"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 className="science-ref-title">{cit.title}</h4>
              <ExternalLink size={14} color="#38bdf8" />
            </div>
            <p className="science-ref-desc">{cit.desc}</p>
            <span className="science-ref-link">{cit.url.replace(/^https?:\/\//, "")}</span>
          </a>
        ))}
      </div>

      {/* Non-Diagnostic Bioastronautics Disclaimer */}
      <div className="medical-disclaimer-box">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "0.5rem" }}>
          <AlertTriangle size={18} color="#fb7185" />
          <h4 className="disclaimer-title">SCIENTIFIC & MEDICAL RESEARCH DISCLAIMER</h4>
        </div>
        <p className="disclaimer-text">
          ASTRA is an independent research prototype and technology demonstration developed for the{" "}
          <strong>NASA Space Apps Challenge 2026</strong>. All biometric telemetry readings and check-in scores
          are simulated or self-reported for bioastronautics evaluation. ASTRA is not certified by NASA, ESA,
          or the FDA as a clinical diagnostic medical device and must not be used for terrestrial medical treatment.
        </p>
      </div>
    </section>
  );
}
