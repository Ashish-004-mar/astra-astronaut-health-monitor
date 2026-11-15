import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Database,
  ExternalLink,
  Filter,
  Globe2,
  Info,
  Radio,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  NASA_SOURCES_DATA,
  type NasaSource,
  type SourceDomain,
} from "../data/nasaSourcesData";
import "../styles/nasaSources.css";

interface Props {
  onBack: () => void;
  onEnterApp: () => void;
}

type FilterTab = "ALL" | "ACTIVE_APIS" | "RESEARCH_REFS" | "SPACE_ENV" | "CREW_HEALTH";

export default function NasaSourcesPage({ onBack, onEnterApp }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<NasaSource | null>(null);

  // Filter sources based on Tab and Search Query
  const filteredSources = useMemo(() => {
    return NASA_SOURCES_DATA.filter((source) => {
      // 1. Tab filter
      if (activeTab === "ACTIVE_APIS" && source.group !== "ACTIVE_DATA_API") {
        return false;
      }
      if (activeTab === "RESEARCH_REFS" && source.group !== "RESEARCH_REFERENCE") {
        return false;
      }
      if (activeTab === "SPACE_ENV" && source.domain !== "SPACE ENVIRONMENT") {
        return false;
      }
      if (activeTab === "CREW_HEALTH" && source.domain !== "CREW HEALTH") {
        return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        source.title.toLowerCase().includes(q) ||
        source.shortDesc.toLowerCase().includes(q) ||
        source.astraRelevance.toLowerCase().includes(q) ||
        source.officialOrg.toLowerCase().includes(q) ||
        source.category.toLowerCase().includes(q) ||
        source.keyTopics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  // Separate into Group A (Active Data APIs) and Group B (Research References)
  const groupA = useMemo(
    () => filteredSources.filter((s) => s.group === "ACTIVE_DATA_API"),
    [filteredSources]
  );
  const groupB = useMemo(
    () => filteredSources.filter((s) => s.group === "RESEARCH_REFERENCE"),
    [filteredSources]
  );

  return (
    <div className="nasa-sources-root">
      {/* Background Starfield and Orbital Geometry */}
      <div className="nasa-stars-canvas" aria-hidden="true" />
      <div className="nasa-orbital-ring" aria-hidden="true" />

      <div className="nasa-sources-container">
        {/* 1. Header Navigation Bar */}
        <header className="nasa-top-bar">
          <div className="nasa-brand-group">
            <span className="nasa-brand-dot" />
            <span className="nasa-brand-title">ASTRA // NASA RESEARCH HUB</span>
          </div>

          <nav className="nasa-nav-actions" aria-label="Reference navigation">
            <button
              type="button"
              className="nasa-btn-back"
              onClick={onBack}
              title="Return to the main ASTRA landing screen"
            >
              <ArrowLeft size={14} />
              <span>BACK TO LANDING</span>
            </button>

            <button
              type="button"
              className="nasa-btn-launch"
              onClick={onEnterApp}
              title="Enter ASTRA Health Monitor dashboard"
            >
              <Rocket size={14} />
              <span>ENTER ASTRA APP</span>
            </button>
          </nav>
        </header>

        {/* 2. Hero Section */}
        <section className="nasa-hero">
          <div className="nasa-hero-text">
            <div className="nasa-hero-eyebrow">
              <Sparkles size={12} />
              <span>NASA SPACE APPS CHALLENGE 2026 // BIOASTRONAUTICS</span>
            </div>
            <h1>
              POWERED BY RESEARCH. <br />
              <strong>INSPIRED BY NASA.</strong>
            </h1>
            <p className="nasa-hero-subtitle">
              Explore the official scientific references, space biology literature, and public open APIs
              that underpin ASTRA's clinical architecture, environmental safety envelopes, and autonomous crew health systems.
            </p>

            <div className="nasa-provenance-pills">
              <span className="provenance-pill live-data">
                <Radio size={11} /> 1 ACTIVE PUBLIC NASA API (DONKI)
              </span>
              <span className="provenance-pill research-ref">
                <BookOpen size={11} /> 9 PEER-REVIEWED RESEARCH REFERENCES
              </span>
              <span className="provenance-pill simulated-disc">
                <Info size={11} /> 100% EXPLAINABLE DATA PROVENANCE
              </span>
            </div>
          </div>

          <div className="nasa-hero-globe">
            <img
              src="./docs/assets/earth-rotating.gif"
              alt="Rotating Earth Visual"
              onError={(e) => {
                // Fallback if gif path differs in nested environment
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="globe-caption">ORBITAL VIEW // 400 KM</span>
          </div>
        </section>

        {/* 3. Controls: Filters & Real-Time Search */}
        <div className="nasa-control-bar">
          <div className="nasa-filter-tabs" role="tablist" aria-label="Filter scientific sources">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ALL"}
              className={`nasa-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
              onClick={() => setActiveTab("ALL")}
            >
              ALL SOURCES ({NASA_SOURCES_DATA.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ACTIVE_APIS"}
              className={`nasa-tab-btn ${activeTab === "ACTIVE_APIS" ? "active" : ""}`}
              onClick={() => setActiveTab("ACTIVE_APIS")}
            >
              ACTIVE DATA APIs (1)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "RESEARCH_REFS"}
              className={`nasa-tab-btn ${activeTab === "RESEARCH_REFS" ? "active" : ""}`}
              onClick={() => setActiveTab("RESEARCH_REFS")}
            >
              RESEARCH REFERENCES (9)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "SPACE_ENV"}
              className={`nasa-tab-btn ${activeTab === "SPACE_ENV" ? "active" : ""}`}
              onClick={() => setActiveTab("SPACE_ENV")}
            >
              SPACE ENVIRONMENT (4)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "CREW_HEALTH"}
              className={`nasa-tab-btn ${activeTab === "CREW_HEALTH" ? "active" : ""}`}
              onClick={() => setActiveTab("CREW_HEALTH")}
            >
              CREW HEALTH (6)
            </button>
          </div>

          <div className="nasa-search-box">
            <Search size={14} className="nasa-search-icon" />
            <input
              type="text"
              placeholder="Search references, APIs, keywords…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search NASA scientific references"
            />
            {searchQuery && (
              <button
                type="button"
                className="nasa-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 4. Filter Results Check */}
        {filteredSources.length === 0 && (
          <div className="nasa-disclaimer-box" style={{ margin: "40px 0" }}>
            <p>
              No matching NASA scientific references found for &ldquo;{searchQuery}&rdquo;.
              Try clearing your search query or selecting &ldquo;ALL SOURCES&rdquo;.
            </p>
          </div>
        )}

        {/* 5. GROUP A — NASA PUBLIC DATA INTEGRATIONS */}
        {groupA.length > 0 && (
          <section className="nasa-section-group">
            <div className="group-header">
              <div className="group-title-row">
                <Radio size={16} color="#00f0ff" />
                <h2>GROUP A // ACTIVE NASA PUBLIC DATA INTEGRATIONS</h2>
              </div>
              <span className="group-tag active-api">CONNECTED TO CODEBASE</span>
            </div>

            <div className="nasa-cards-grid">
              {groupA.map((source) => (
                <div
                  key={source.id}
                  className="nasa-card is-active-api"
                  onClick={() => setSelectedSource(source)}
                >
                  <div>
                    <div className="nasa-card-top">
                      <span className="nasa-card-category-badge badge-live-api">
                        {source.category}
                      </span>
                      <span className="nasa-org-label">{source.officialOrg}</span>
                    </div>

                    <h3 className="nasa-card-title">{source.title}</h3>
                    <p className="nasa-card-desc">{source.shortDesc}</p>

                    <div className="nasa-relevance-box">
                      <span className="relevance-header">ASTRA RELEVANCE</span>
                      <p>{source.astraRelevance}</p>
                    </div>

                    {source.integrationDetails && (
                      <div
                        className="modal-callout-box"
                        style={{ marginBottom: 14, fontSize: 11 }}
                      >
                        <strong style={{ color: "#00f0ff" }}>API Endpoint: </strong>
                        <code>{source.integrationDetails.endpoint}</code>
                        <br />
                        <strong style={{ color: "#00f0ff" }}>Cache Policy: </strong>
                        <span>{source.integrationDetails.cachedStatus}</span>
                      </div>
                    )}
                  </div>

                  <div className="nasa-card-footer">
                    <button
                      type="button"
                      className="card-details-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(source);
                      }}
                    >
                      VIEW ARCHITECTURE DETAILS <Info size={12} />
                    </button>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>OPEN OFFICIAL SOURCE</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. GROUP B — NASA RESEARCH & SCIENTIFIC REFERENCES */}
        {groupB.length > 0 && (
          <section className="nasa-section-group">
            <div className="group-header">
              <div className="group-title-row">
                <BookOpen size={16} color="#cca3ff" />
                <h2>GROUP B // NASA RESEARCH & SCIENTIFIC REFERENCES</h2>
              </div>
              <span className="group-tag research-ref">INFORMED SYSTEM DESIGN</span>
            </div>

            <div className="nasa-cards-grid">
              {groupB.map((source) => (
                <div
                  key={source.id}
                  className="nasa-card"
                  onClick={() => setSelectedSource(source)}
                >
                  <div>
                    <div className="nasa-card-top">
                      <span
                        className={`nasa-card-category-badge ${
                          source.category === "RESEARCH DATA REPOSITORY"
                            ? "badge-repository"
                            : source.category === "NASA IMAGERY API"
                            ? "badge-imagery"
                            : "badge-research"
                        }`}
                      >
                        {source.category}
                      </span>
                      <span className="nasa-org-label">{source.officialOrg}</span>
                    </div>

                    <h3 className="nasa-card-title">{source.title}</h3>
                    <p className="nasa-card-desc">{source.shortDesc}</p>

                    <div className="nasa-relevance-box">
                      <span className="relevance-header">ASTRA RELEVANCE</span>
                      <p>{source.astraRelevance}</p>
                    </div>
                  </div>

                  <div className="nasa-card-footer">
                    <button
                      type="button"
                      className="card-details-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(source);
                      }}
                    >
                      EXAMINE RATIONALE <Info size={12} />
                    </button>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>OPEN OFFICIAL SOURCE</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Detailed Source Modal */}
        {selectedSource && (
          <div
            className="nasa-modal-overlay"
            onClick={() => setSelectedSource(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="nasa-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedSource(null)}
                aria-label="Close modal dialog"
              >
                <X size={16} />
              </button>

              <div className="modal-meta-row">
                <span className="provenance-pill live-data">
                  {selectedSource.category}
                </span>
                <span className="nasa-org-label">
                  {selectedSource.officialOrg}
                </span>
              </div>

              <h3>{selectedSource.title}</h3>

              <div className="modal-section">
                <span className="modal-section-title">SCIENTIFIC PURPOSE & SCOPE</span>
                <p>{selectedSource.shortDesc}</p>
              </div>

              <div className="modal-section">
                <span className="modal-section-title">ASTRA RELEVANCE & MODULE APPLICATION</span>
                <div className="modal-callout-box">
                  <p>{selectedSource.astraRelevance}</p>
                </div>
              </div>

              {selectedSource.integrationDetails && (
                <div className="modal-section">
                  <span className="modal-section-title">ACTIVE INTEGRATION PARAMETERS</span>
                  <div
                    className="modal-callout-box"
                    style={{ fontSize: 12, lineHeight: 1.6 }}
                  >
                    <div>
                      <strong style={{ color: "#00f0ff" }}>Provider:</strong>{" "}
                      {selectedSource.integrationDetails.provider}
                    </div>
                    <div>
                      <strong style={{ color: "#00f0ff" }}>API Endpoint:</strong>{" "}
                      <code>{selectedSource.integrationDetails.endpoint}</code>
                    </div>
                    <div>
                      <strong style={{ color: "#00f0ff" }}>Retrieved Data:</strong>{" "}
                      {selectedSource.integrationDetails.retrievedData}
                    </div>
                    <div>
                      <strong style={{ color: "#00f0ff" }}>Offline Resilience:</strong>{" "}
                      {selectedSource.integrationDetails.cachedStatus}
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <span className="modal-section-title">SCIENTIFIC BOUNDARIES & LIMITATIONS</span>
                <p style={{ color: "#ffcf66" }}>{selectedSource.limitations}</p>
              </div>

              <div className="modal-footer-actions">
                <span className="provenance-pill">
                  STATUS: {selectedSource.integrationBadge}
                </span>

                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-official-btn"
                >
                  <span>OPEN NASA WEBSITE</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 8. Scientific Disclaimer */}
        <footer className="nasa-disclaimer-box">
          <p>
            &ldquo;ASTRA is an independent educational prototype inspired by publicly available NASA research.
            Simulated astronaut health readings are not real NASA crew telemetry. Research references do not imply NASA endorsement,
            certification, or clinical validation.&rdquo;
          </p>
        </footer>
      </div>
    </div>
  );
}
