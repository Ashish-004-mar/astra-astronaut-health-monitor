import { ArrowLeft, ArrowUpRight, ShieldCheck, Info, ExternalLink } from "lucide-react";
import { NASA_FIVE_HAZARDS } from "../../services/hazardService";
import type { NASAhazardId } from "../../types/hazards";

interface HazardDetailSubpageProps {
  hazardId: NASAhazardId;
  onBack: () => void;
  onOpenSubfeature?: (feature: string) => void;
}

export default function HazardDetailSubpage({
  hazardId,
  onBack,
  onOpenSubfeature,
}: HazardDetailSubpageProps) {
  const hazard = NASA_FIVE_HAZARDS.find((h) => h.id === hazardId) || NASA_FIVE_HAZARDS[0];

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO OVERVIEW
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            MISSION HEALTH RISKS <span>/</span> NASA FIVE HUMAN SPACEFLIGHT HAZARDS
          </div>
          <h1>{hazard.name.toUpperCase()}</h1>
          <p className="subpage-subtitle">{hazard.tagline}</p>
        </div>
      </div>

      {/* Main Hazard Card */}
      <section className="panel hazard-main-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">NASA HUMAN RESEARCH PROGRAM (HRP) TAXONOMY</span>
            <h2>Scientific Overview & Physiological Vulnerability</h2>
          </div>
          <span className="tag">{hazard.dataAvailability}</span>
        </div>

        <div className="hazard-breakdown-grid">
          <div className="breakdown-card">
            <h3>Why It Matters in Human Spaceflight</h3>
            <p>{hazard.whyItMatters}</p>
          </div>

          <div className="breakdown-card">
            <h3>What ASTRA Monitors</h3>
            <p>{hazard.whatAstraMonitors}</p>
          </div>

          <div className="breakdown-card">
            <h3>Safe Recommended Countermeasures</h3>
            <p>{hazard.recommendedAction}</p>
          </div>

          <div className="breakdown-card">
            <h3>Data Provenance & Limitations</h3>
            <p>
              Data Source: <strong>{hazard.dataSourceLabel}</strong>
            </p>
            <small>
              ASTRA provides informational astronaut self-assessment context. All alert thresholds are demonstrative guidelines and do not constitute clinical diagnosis.
            </small>
          </div>
        </div>

        <div className="hazard-action-footer">
          <a
            href={hazard.nasaRefUrl}
            target="_blank"
            rel="noreferrer"
            className="button outline"
          >
            NASA HRP Official Documentation <ArrowUpRight size={14} />
          </a>

          {onOpenSubfeature && (
            <button
              className="button primary"
              onClick={() => onOpenSubfeature(hazard.id)}
            >
              Open Interactive {hazard.name} Monitor →
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
