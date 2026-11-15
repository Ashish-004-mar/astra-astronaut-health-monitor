import { useState } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Layers,
  Info,
} from "lucide-react";
import {
  OFFLINE_RESOURCES,
  type OfflineMedicalResource,
  type MissionEnvironmentId,
} from "../../services/missionCareService";

export default function OfflineMedicalResourcesView() {
  const [search, setSearch] = useState("");
  const [filterValidation, setFilterValidation] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<OfflineMedicalResource | null>(null);

  const filtered = OFFLINE_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.source.toLowerCase().includes(search.toLowerCase()) ||
      res.summary.toLowerCase().includes(search.toLowerCase());
    const matchesVal = filterValidation === "all" || res.validationStatus === filterValidation;
    return matchesSearch && matchesVal;
  });

  return (
    <div className="resources-view-root">
      {/* Top Banner Notice */}
      <div className="resources-header-bar">
        <div className="resources-title-group">
          <span className="eyebrow">OFFLINE MISSION MEDICAL REPOSITORY</span>
          <h2>Flight Procedures & Clinical References</h2>
          <p className="resources-sub">
            Verified emergency protocols cached locally on onboard hardware for autonomous execution beyond low Earth orbit.
          </p>
        </div>

        <div className="resources-search-box">
          <Search size={14} className="accent-cyan" />
          <input
            type="text"
            placeholder="Search procedures, guidelines, or NASA rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="styled-search-input"
          />
        </div>
      </div>

      {/* Validation Category Warning Strip */}
      <div className="validation-distinction-strip">
        <div className="distinction-card card-authorized">
          <ShieldCheck size={18} className="accent-mint" />
          <div>
            <strong>AUTHORIZED MISSION PROCEDURES:</strong>
            <p>Certified operational flight rules (e.g. NASA ISS Rule B13-102) validated for microgravity or deep space habitats.</p>
          </div>
        </div>

        <div className="distinction-card card-educational">
          <Info size={18} className="accent-cyan" />
          <div>
            <strong>GENERAL EDUCATIONAL GUIDANCE:</strong>
            <p>Terrestrial reference models (AHA CPR, general first aid). Educational comparison only; not flight certified.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="resources-filter-tabs">
        <button
          type="button"
          className={`filter-btn ${filterValidation === "all" ? "active" : ""}`}
          onClick={() => setFilterValidation("all")}
        >
          All Resources ({OFFLINE_RESOURCES.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filterValidation === "AUTHORIZED_MISSION_PROCEDURE" ? "active" : ""}`}
          onClick={() => setFilterValidation("AUTHORIZED_MISSION_PROCEDURE")}
        >
          Authorized Mission Procedures Only
        </button>
        <button
          type="button"
          className={`filter-btn ${filterValidation === "GENERAL_EDUCATIONAL_GUIDANCE" ? "active" : ""}`}
          onClick={() => setFilterValidation("GENERAL_EDUCATIONAL_GUIDANCE")}
        >
          General Educational Guidance
        </button>
      </div>

      {/* Resource Cards Grid */}
      <div className="resource-cards-grid">
        {filtered.map((res) => (
          <div key={res.id} className="resource-card">
            <div className="res-top-row">
              <span className={`validation-badge ${res.validationStatus === "AUTHORIZED_MISSION_PROCEDURE" ? "badge-auth" : "badge-edu"}`}>
                {res.validationStatus === "AUTHORIZED_MISSION_PROCEDURE"
                  ? "AUTHORIZED MISSION PROCEDURE"
                  : "GENERAL EDUCATIONAL GUIDANCE"}
              </span>
              <span className={`cache-badge ${res.offlineCached ? "cached" : "uncached"}`}>
                {res.offlineCached ? "OFFLINE CACHED" : "UNAVAILABLE"}
              </span>
            </div>

            <h4>{res.title}</h4>

            <div className="res-metadata-row">
              <span className="source-label">Source: <strong>{res.source}</strong></span>
              <span className="version-label">Ver: {res.version} · Rev: {res.reviewDate}</span>
            </div>

            <p className="res-summary">{res.summary}</p>

            {res.steps && res.steps.length > 0 && (
              <div className="res-steps-preview">
                <span className="steps-count-label">CHECKLIST PREVIEW ({res.steps.length} STEPS):</span>
                <ol className="preview-steps-ol">
                  {res.steps.slice(0, 3).map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                  {res.steps.length > 3 && <li className="more-steps">...and {res.steps.length - 3} additional procedure steps</li>}
                </ol>
              </div>
            )}

            {res.caveats.length > 0 && (
              <div className="res-caveats-box">
                <AlertTriangle size={13} className="accent-orange" />
                <p>{res.caveats[0]}</p>
              </div>
            )}

            <div className="res-footer-row">
              <button
                type="button"
                className="button outline small-btn"
                onClick={() => setSelectedResource(res)}
              >
                Open Full Document <ExternalLink size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Document Modal */}
      {selectedResource && (
        <div className="missioncare-modal-backdrop">
          <div className="missioncare-modal-card large-modal">
            <div className="modal-header">
              <div className="doc-header-titles">
                <span className="validation-badge badge-auth">
                  {selectedResource.validationStatus}
                </span>
                <h3>{selectedResource.title}</h3>
                <small>Source: {selectedResource.source} (Version {selectedResource.version} · Reviewed {selectedResource.reviewDate})</small>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedResource(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="doc-section">
                <h4>Operational Summary</h4>
                <p>{selectedResource.summary}</p>
              </div>

              {selectedResource.steps && selectedResource.steps.length > 0 ? (
                <div className="doc-section">
                  <h4>Full Authorized Checklist Steps</h4>
                  <ol className="full-steps-ol">
                    {selectedResource.steps.map((s, idx) => (
                      <li key={idx}>
                        <span className="step-num-badge">{idx + 1}</span>
                        <p>{s}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="doc-unavailable-notice">
                  <ShieldAlert size={20} className="accent-rose" />
                  <div>
                    <strong>Approved mission-specific procedure not available in this prototype.</strong>
                    <p>Consult physical hard-copy Flight Data File (FDF) Volume 4 or contact Flight Medicine console during next communication pass.</p>
                  </div>
                </div>
              )}

              <div className="doc-section caveats-list">
                <h4>Safety Caveats & Procedural Boundaries</h4>
                <ul>
                  {selectedResource.caveats.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button primary small-btn"
                onClick={() => setSelectedResource(null)}
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
