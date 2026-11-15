import { useState, useEffect } from "react";
import {
  Sun,
  ShieldAlert,
  ArrowLeft,
  ArrowUpRight,
  RefreshCw,
  Info,
  Radio,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { demo, fetchWeather, type Weather, type SpaceEvent } from "../../services/spaceWeather";
import { audioAlertService } from "../../services/audioAlertService";

interface RadiationSubpageProps {
  onBack: () => void;
}

export default function RadiationSubpage({ onBack }: RadiationSubpageProps) {
  const [weather, setWeather] = useState<Weather>(demo);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState<"solar" | "dosimeter">("solar");
  const [isSpeSimulated, setIsSpeSimulated] = useState(false);

  useEffect(() => {
    return () => {
      audioAlertService.clearAlertsBySource("Radiation");
    };
  }, []);

  const toggleSpeSimulation = () => {
    if (!isSpeSimulated) {
      setIsSpeSimulated(true);
      audioAlertService.triggerAlert({
        id: "radiation-spe-hazard",
        source: "Radiation",
        title: "SPACE RADIATION HAZARD: SOLAR PARTICLE EVENT",
        reason: "DONKI satellite proton flux surge. Retreat to core habitat storm shelter.",
        severity: "CRITICAL",
        timestamp: new Date().toISOString(),
      });
    } else {
      setIsSpeSimulated(false);
      audioAlertService.clearAlertsBySource("Radiation");
    }
  };

  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10000);
    setLoading(true);
    fetchWeather(ctrl.signal).then((w) => {
      if (mounted) {
        setWeather(w);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      ctrl.abort();
      clearTimeout(timeout);
    };
  }, [refresh]);

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO SPACE
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            SPACE <span>/</span> RADIATION & HELIOPHYSICS
          </div>
          <h1>RADIATION & SPACE WEATHER CONTEXT</h1>
          <p className="subpage-subtitle">
            Solar particle events, galactic cosmic rays, and habitat dosimeter telemetry.
          </p>
        </div>
      </div>

      {/* NASA Context */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA SPACE RADIATION RESEARCH CONTEXT</strong>
        </div>
        <p>
          Beyond low Earth orbit or outside geomagnetic shielding, astronauts face exposure to high-energy Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). Ionizing radiation deposits heavy energy tracks through tissue, increasing lifetime cancer risk, central nervous system degradation, and tissue necrosis.
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/radiation/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Space Radiation Bioastronautics ↗
        </a>
      </section>

      {/* Metrics Row */}
      <div className="metrics-summary-row">
        <div className="metric-box">
          <span className="metric-label">SOLAR STATUS (DONKI)</span>
          <div className="metric-value-row">
            <span className="big-val">
              {weather.events.length > 0 ? "ACTIVE EVENTS" : "QUIET"}
            </span>
          </div>
          <small className="metric-meta">Public NASA DONKI observations</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">HABITAT DOSIMETER (DEMO)</span>
          <div className="metric-value-row">
            <span className="big-val">0.48</span>
            <span className="unit">mSv / day</span>
          </div>
          <small className="metric-meta">SIMULATED RADIATION SENSOR</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">MISSION CUMULATIVE DOSE</span>
          <div className="metric-value-row">
            <span className="big-val">71.2</span>
            <span className="unit">mSv</span>
          </div>
          <small className="metric-meta">Day 147 estimated absorption</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">STORM SHELTER STATUS</span>
          <div className="metric-value-row">
            <span className="big-val">NOMINAL</span>
          </div>
          <small className="metric-meta">Water wall shielding active</small>
        </div>
      </div>

      {/* Action Pills */}
      <div className="subpage-action-pills">
        <button
          className={`button ${activeTab === "solar" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("solar")}
        >
          VIEW SOLAR EVENTS
        </button>
        <button
          className={`button ${activeTab === "dosimeter" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("dosimeter")}
        >
          VIEW RADIATION CONTEXT
        </button>
        <button
          className={`button ${isSpeSimulated ? "primary" : "outline"}`}
          onClick={toggleSpeSimulation}
          title={isSpeSimulated ? "Clear SPE Simulation" : "Simulate Solar Particle Event Hazard"}
        >
          <Radio size={14} /> {isSpeSimulated ? "CLEAR SPE ALERT" : "SIMULATE SOLAR PARTICLE EVENT"}
        </button>
      </div>

      {/* Scientific Distinction Warning Banner */}
      <div className="scientific-warning-card">
        <ShieldAlert size={20} className="accent-orange" />
        <div>
          <strong>Essential Scientific Distinction:</strong>
          <p>
            Public NASA DONKI solar flare and coronal mass ejection feeds report heliophysics observations. They do <strong>NOT</strong> directly measure an individual astronaut’s personal biological dose equivalent. A quiet space weather report does not imply zero radiation hazard.
          </p>
        </div>
      </div>

      {/* Tab: Solar Events from NASA DONKI */}
      {activeTab === "solar" && (
        <section className="panel weather-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PUBLIC SPACE WEATHER REPOSITORY</span>
              <h2>NASA DONKI Heliophysics Observations</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Refresh space weather"
              disabled={loading}
              onClick={() => setRefresh((x) => x + 1)}
            >
              <RefreshCw size={15} />
            </button>
          </div>

          <span className="tag">
            {loading ? "FETCHING PUBLIC DATA…" : weather.source}
          </span>

          {weather.events.length === 0 && (
            <p className="no-events-text">No major solar particle events reported in this seven-day response.</p>
          )}

          <div className="events-grid">
            {weather.events.map((e: SpaceEvent) => (
              <article className="weather-event-card" key={e.id}>
                <div className="event-head">
                  <span className="event-time">{e.time}</span>
                  <span className="event-type-badge">PUBLIC NASA EVENT</span>
                </div>
                <h3>{e.name}</h3>
                <p>{e.detail}</p>
                {e.url && (
                  <a href={e.url} target="_blank" rel="noreferrer" className="nasa-ext-link">
                    NASA DONKI Official Record <ArrowUpRight size={13} />
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="weather-footer">
            <small>
              Last updated: {weather.updated ? new Date(weather.updated).toLocaleString() : "Cached verified demo data"}
            </small>
            <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
              Source: NASA DONKI API <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
      )}

      {/* Tab: Radiation Context & Countermeasures */}
      {activeTab === "dosimeter" && (
        <section className="panel dosimeter-context-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">BIOASTRONAUTICS DEFENSE</span>
              <h2>Radiation Shielding & Habitat Storm Shelter</h2>
            </div>
            <span className="tag">SIMULATED HABITAT TELEMETRY</span>
          </div>

          <div className="dosimeter-details-grid">
            <div className="dosi-block">
              <h3>Galactic Cosmic Rays (GCR)</h3>
              <p>
                Omnidirectional, highly penetrating energetic atomic nuclei from outside the solar system. Secondary neutron generation inside aluminum hulls necessitates hydrogenous polyethylene and water shielding.
              </p>
            </div>
            <div className="dosi-block">
              <h3>Solar Particle Events (SPE)</h3>
              <p>
                Sporadic high-flux protons emitted during intense solar flares and CMEs. When detected by DONKI / GOES satellites, astronauts retreat to the core crew quarters storm shelter until flux subsides.
              </p>
            </div>
            <div className="dosi-block">
              <h3>Permissible Exposure Limits (PEL)</h3>
              <p>
                NASA standards restrict career exposure to prevent greater than 3% risk of exposure-induced death (REID) at 95% confidence intervals, adjusted for astronaut age and sex.
              </p>
            </div>
            <div className="dosi-block">
              <h3>Operational Countermeasures</h3>
              <p>
                Active dosimeter badges, habitat water-storage containment walls, pharmacological radioprotectant research, and dietary antioxidants.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
