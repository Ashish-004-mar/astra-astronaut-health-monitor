import { useEffect, useState } from "react";
import {
  Check,
  ArrowUpRight,
  Globe,
  RefreshCw,
  FileText,
  Download,
  Moon,
  Dumbbell,
  Brain,
  Sun,
  Gauge,
  Sparkles,
  Radio,
  Droplet,
} from "lucide-react";
import { useStore } from "../state/store";
import { demo, fetchWeather } from "../services/spaceWeather";
import HealthChart from "../components/HealthChart";
import { evaluate } from "../engine/healthEngine";
import ReportModal from "../components/ReportModal";
import SleepCircadianSubpage from "./subpages/SleepCircadianSubpage";
import ExerciseTrackerSubpage from "./subpages/ExerciseTrackerSubpage";
import MentalWellnessSubpage from "./subpages/MentalWellnessSubpage";
import RadiationSubpage from "./subpages/RadiationSubpage";
import CabinEnvironmentSubpage from "./subpages/CabinEnvironmentSubpage";
import QuickWellnessCheckinSubpage from "./subpages/QuickWellnessCheckinSubpage";
import OfflineReadinessSubpage from "./subpages/OfflineReadinessSubpage";
import AquaGuardSubpage from "./subpages/AquaGuardSubpage";

export function MyHealth() {
  const { mission, subpage, setSubpage } = useStore(),
    health = evaluate(mission);
  const [reportOpen, setReportOpen] = useState(false);

  if (subpage === "sleep-circadian") {
    return <SleepCircadianSubpage onBack={() => setSubpage(null)} />;
  }
  if (subpage === "exercise-tracker") {
    return <ExerciseTrackerSubpage onBack={() => setSubpage(null)} />;
  }
  if (subpage === "mental-wellness") {
    return <MentalWellnessSubpage onBack={() => setSubpage(null)} />;
  }

  return (
    <>
      <div className="myhealth-actions-bar">
        <div>
          <span className="eyebrow">CREW TELEMETRY EXPORT</span>
          <h1 className="page-heading">My Health & Daily Metrics</h1>
        </div>
        <div className="report-action-buttons">
          <button
            className="button outline"
            onClick={() => setReportOpen(true)}
            aria-label="Preview Daily Health Report"
          >
            <FileText size={15} /> PREVIEW REPORT
          </button>
          <button
            className="button primary"
            onClick={() => setReportOpen(true)}
            aria-label="Download Health Report PDF"
          >
            <Download size={15} /> DOWNLOAD HEALTH REPORT
          </button>
        </div>
      </div>

      {/* NASA Spaceflight Countermeasures Subpage Buttons */}
      <div className="page-feature-nav-bar">
        <button
          className="feature-nav-button"
          onClick={() => setSubpage("sleep-circadian")}
        >
          <div className="feature-icon-box">
            <Moon size={18} className="accent-cyan" />
          </div>
          <div className="feature-text-box">
            <strong>Sleep & Circadian Rhythm</strong>
            <small>Orbital 16-sunrise day/night cycles, baseline & trends</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>

        <button
          className="feature-nav-button"
          onClick={() => setSubpage("exercise-tracker")}
        >
          <div className="feature-icon-box">
            <Dumbbell size={18} className="accent-mint" />
          </div>
          <div className="feature-text-box">
            <strong>Muscle & Exercise Tracker</strong>
            <small>Active workout timer, 2h countermeasure protocol & logs</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>

        <button
          className="feature-nav-button"
          onClick={() => setSubpage("mental-wellness")}
        >
          <div className="feature-icon-box">
            <Brain size={18} className="accent-cyan" />
          </div>
          <div className="feature-text-box">
            <strong>Mental Wellness & Vigilance</strong>
            <small>Psychomotor reaction test & behavioral mood logs</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>
      </div>

      <HealthChart />
      <section className="panel text-panel">
        <div className="eyebrow">WHAT CHANGED</div>
        <h2>
          {health.status === "NOMINAL"
            ? "A steady outlook."
            : "A pattern worth your attention."}
        </h2>
        {health.reasons.map((r) => (
          <p key={r}>{r}</p>
        ))}
        <p>{health.action}</p>
        <small>Illustrative simulation rules · not medical thresholds</small>
      </section>

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
const questions: Record<string, string[]> = {
  Energy: ["Low", "Normal", "High"],
  Stress: ["Low", "Medium", "High"],
  Mood: ["Good", "Okay", "Low"],
  Sleep: ["Poor", "Fair", "Good"],
  "Physical discomfort": ["None", "Mild", "Significant"],
};
export function Checkin() {
  const { checkins, save, subpage, setSubpage } = useStore();
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const existing = checkins.find((c) => c.date === date);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {},
  );
  const [saved, setSaved] = useState(false);

  if (subpage === "quick-wellness") {
    return <QuickWellnessCheckinSubpage onBack={() => setSubpage(null)} />;
  }
  if (subpage === "aquaguard" || subpage === "water-safety") {
    return <AquaGuardSubpage onBack={() => setSubpage(null)} />;
  }

  return (
    <div className="checkin-layout">
      <section className="panel text-panel">
        {/* Quick 2-Minute Wellness Check Banner */}
        <div className="quick-checkin-banner">
          <div className="quick-banner-content">
            <span className="eyebrow">FAST OPERATIONAL ASSESSMENTS</span>
            <h3>Quick 2-Minute Crew Wellness Check</h3>
            <p>Complete a streamlined 5-question check-in with step-by-step progress.</p>
          </div>
          <button
            className="button primary"
            onClick={() => setSubpage("quick-wellness")}
          >
            <Sparkles size={15} /> START 2-MIN CHECK
          </button>
        </div>

        {/* AquaGuard Sub-Feature Banner in Check-in */}
        <div className="quick-checkin-banner aquaguard-checkin-banner" style={{ marginTop: "1rem" }}>
          <div className="quick-banner-content">
            <span className="eyebrow">ECLSS LIFE SUPPORT · CREW HYDRATION</span>
            <h3>AquaGuard — Space Water Safety &amp; Hydration</h3>
            <p>Review closed-loop WRS telemetry, test TOC &amp; conductivity, and log daily fluid intake.</p>
          </div>
          <button
            className="button secondary"
            onClick={() => setSubpage("aquaguard")}
          >
            <Droplet size={15} /> OPEN AQUAGUARD
          </button>
        </div>

        <div className="eyebrow" style={{ marginTop: "1.5rem" }}>A MOMENT FOR YOU</div>
        <h2>How are you feeling today?</h2>
        <p>
          Your experience matters. Take a quick moment to check in with
          yourself.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save({
              date,
              timestamp: new Date().toISOString(),
              provenance: "SELF-REPORTED",
              answers,
            });
            setSaved(true);
          }}
        >
          {Object.entries(questions).map(([q, options], i) => (
            <fieldset key={q}>
              <legend>
                <span className="question-number">0{i + 1}</span>
                {q}
              </legend>
              <div className="answer-options">
                {options.map((o) => (
                  <label className={answers[q] === o ? "selected" : ""} key={o}>
                    <input
                      type="radio"
                      name={q}
                      value={o}
                      checked={answers[q] === o}
                      required
                      onChange={() => {
                        setAnswers((a) => ({ ...a, [q]: o }));
                        setSaved(false);
                      }}
                    />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="button primary" type="submit">
            <Check size={16} />
            {existing ? "UPDATE TODAY’S CHECK-IN" : "SUBMIT CHECK-IN"}
          </button>
          {saved && (
            <p role="status" className="success">
              ✓ Check-in complete. Your self-reported health profile has been
              updated.
            </p>
          )}
        </form>
      </section>
      <aside className="panel text-panel">
        <div className="eyebrow">YOUR PERSONAL LOG</div>
        <h2>
          Small check-ins.
          <br />A bigger picture.
        </h2>
        <p>
          Saved only on this device. Your answers complement your simulated
          health signals without changing them.
        </p>
        <span className="tag">SELF-REPORTED</span>
        {checkins
          .slice(-5)
          .reverse()
          .map((c) => (
            <div className="log-item" key={c.date}>
              <strong>{c.date}</strong>
              <p>
                Energy: {c.answers.Energy} · Mood: {c.answers.Mood}
              </p>
              <small>{new Date(c.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
      </aside>
    </div>
  );
}
export function Space() {
  const { subpage, setSubpage } = useStore();
  const [weather, setWeather] = useState(demo),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0);

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

  if (subpage === "radiation") {
    return <RadiationSubpage onBack={() => setSubpage(null)} />;
  }
  if (subpage === "cabin-environment") {
    return <CabinEnvironmentSubpage onBack={() => setSubpage(null)} />;
  }
  if (subpage === "aquaguard" || subpage === "water-safety") {
    return <AquaGuardSubpage onBack={() => setSubpage(null)} />;
  }

  return (
    <div className="space-page">
      {/* Space Feature Buttons */}
      <div className="page-feature-nav-bar space-feature-nav-bar">
        <button
          className="feature-nav-button"
          onClick={() => setSubpage("radiation")}
        >
          <div className="feature-icon-box">
            <Sun size={18} className="accent-orange" />
          </div>
          <div className="feature-text-box">
            <strong>Radiation & Space Weather</strong>
            <small>NASA DONKI solar flares, CME events & dosimeter</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>

        <button
          className="feature-nav-button"
          onClick={() => setSubpage("cabin-environment")}
        >
          <div className="feature-icon-box">
            <Gauge size={18} className="accent-cyan" />
          </div>
          <div className="feature-text-box">
            <strong>Cabin Environment & ECLSS</strong>
            <small>CO₂ scrubbing, temperature, humidity & scenario demo</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>

        <button
          className="feature-nav-button aquaguard-nav-btn"
          onClick={() => setSubpage("aquaguard")}
        >
          <div className="feature-icon-box">
            <Droplet size={18} className="accent-cyan" />
          </div>
          <div className="feature-text-box">
            <strong>AquaGuard — Water Safety & Hydration</strong>
            <small>NASA ECLSS WRS pipeline, TOC, conductivity & consumption</small>
          </div>
          <ArrowUpRight size={15} className="feature-arrow" />
        </button>
      </div>

      <div className="space-intro">
        <div className="eyebrow">OUR HOME. YOUR HORIZON.</div>
        <h2>
          A little perspective.
          <br />
          From 400 kilometers up.
        </h2>
        <p>
          Explore the environment beyond the cabin.
          <br />
          Public solar observations, kept in context.
        </p>
        <span className="tag">
          <Globe size={12} /> LOW EARTH ORBIT · VISUALIZATION
        </span>
      </div>
      <section className="panel weather-panel">
        <div className="panel-heading">
          <span>SPACE WEATHER</span>
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
          <p>No solar flare events reported in this seven-day response.</p>
        )}
        {weather.events.map((e) => (
          <article className="weather-event" key={e.id}>
            <small>{e.time}</small>
            <h3>{e.name}</h3>
            <p>{e.detail}</p>
            {e.url && (
              <a href={e.url} target="_blank" rel="noreferrer">
                View NASA record <ArrowUpRight size={13} />
              </a>
            )}
          </article>
        ))}
        <p className="privacy">
          NASA DONKI does not measure an astronaut’s personal radiation
          exposure.
        </p>
        <small>
          Last updated:{" "}
          {weather.updated
            ? new Date(weather.updated).toLocaleString()
            : "Not fetched · illustrative demo"}
        </small>
        <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
          Source: NASA DONKI <ArrowUpRight size={13} />
        </a>
      </section>
    </div>
  );
}
export function Settings() {
  const { quality, reduced, settings, reset, clear, subpage, setSubpage } = useStore();
  const [confirm, setConfirm] = useState(false);

  if (subpage === "offline-readiness") {
    return <OfflineReadinessSubpage onBack={() => setSubpage(null)} />;
  }

  return (
    <div className="settings-grid">
      <section className="panel text-panel">
        <div className="eyebrow">DEEP SPACE RESILIENCE</div>
        <h2>Distance & Offline Readiness</h2>
        <p>
          Verify autonomous bioastronautics operations, cache status, and client storage when disconnected from Earth.
        </p>
        <button
          className="button primary"
          style={{ marginTop: "0.8rem" }}
          onClick={() => setSubpage("offline-readiness")}
        >
          <Radio size={15} /> OPEN OFFLINE READINESS CONSOLE
        </button>
      </section>

      <section className="panel text-panel">
        <div className="eyebrow">MAKE IT YOURS</div>
        <h2>Experience settings</h2>
        <label className="setting-row">
          Animation quality
          <select
            value={quality}
            onChange={(e) =>
              settings({ quality: e.target.value as "high" | "low" })
            }
          >
            <option value="high">High</option>
            <option value="low">Low / battery saver</option>
          </select>
        </label>
        <label className="setting-row">
          Reduced motion
          <input
            type="checkbox"
            checked={reduced}
            onChange={(e) => settings({ reduced: e.target.checked })}
          />
        </label>
        <div className="setting-row">
          Restart virtual mission
          <button className="button outline" onClick={reset}>
            RESET SIMULATION
          </button>
        </div>
        <div className="setting-row">
          Local check-in history
          <button className="button outline" onClick={() => setConfirm(true)}>
            CLEAR HISTORY
          </button>
        </div>
        {confirm && (
          <div role="alert">
            <p>Delete all self-reported check-ins on this device?</p>
            <button
              className="button outline"
              onClick={() => {
                clear();
                setConfirm(false);
              }}
            >
              DELETE CHECK-INS
            </button>{" "}
            <button className="text-button" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        )}
      </section>
      <section className="panel text-panel">
        <div className="eyebrow">INTELLIGENCE & VOICE</div>
        <h2>ASTRA Voice & Offline Engine</h2>
        <div className="setting-row">
          <span>
            Knowledge base status
            <small style={{ display: "block", color: "#82949e", fontSize: "0.8rem" }}>
              Client-side rule engine & curated dataset
            </small>
          </span>
          <span className="tag" style={{ color: "#76dfcb", borderColor: "#76dfcb" }}>
            160/160 READY
          </span>
        </div>
        <div className="setting-row">
          <span>
            Offline architecture
            <small style={{ display: "block", color: "#82949e", fontSize: "0.8rem" }}>
              Zero remote API calls or cloud dependencies
            </small>
          </span>
          <span className="tag" style={{ color: "#76dfcb", borderColor: "#76dfcb" }}>
            100% LOCAL
          </span>
        </div>
        <div className="setting-row">
          <span>
            Supported languages
            <small style={{ display: "block", color: "#82949e", fontSize: "0.8rem" }}>
              Bilingual answers (EN / HI) + Romanized Hinglish matching
            </small>
          </span>
          <span className="tag">EN / हिन्दी</span>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#82949e", lineHeight: 1.5 }}>
          ASTRA Voice runs fully inside your browser memory. Audio is processed locally on this device without cloud transmission.
        </p>
      </section>
      <section className="panel text-panel">
        <div className="eyebrow">TRANSPARENT BY DESIGN</div>
        <h2>Methodology & sources</h2>
        <p>
          All health telemetry is deterministic, simulated data. Resting HR
          attention requires three consecutive comparable readings more than 10%
          above a 68 BPM baseline.
        </p>
        <p>
          The sleep–stress rule requires two simulated nights below 80% of a
          7.8-hour sleep baseline with stress at least 50/100 on both nights.
          These are illustrative rules, not medical thresholds. Missing signals
          produce an incomplete assessment.
        </p>
        <p>
          Heart-rate attention clears after three consecutive resting
          observations within the illustrative limit. Sleep–stress attention
          clears after two consecutive nights without the combined pattern.
          Sleep updates only at a virtual day boundary.
        </p>
        <h3>Camera privacy</h3>
        <p>
          MediaPipe Face and Pose Landmarker run locally. Video is not uploaded,
          recorded, or stored. Tracking describes visible landmarks; it does not
          measure heart rate, oxygen, sleep, or stress and does not identify
          you.
        </p>
        <a
          href="https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker"
          target="_blank"
          rel="noreferrer"
        >
          MediaPipe documentation ↗
        </a>
        <h3>About ASTRA</h3>
        <p>
          ASTRA is a prototype health monitoring and self-assessment support
          tool, not a medical device, diagnostic system, or replacement for
          mission medical professionals.
        </p>
        <p>
          Created for the NASA Space Apps Challenge 2026 concept. Independently
          developed; no NASA endorsement.
        </p>
        <a
          href="https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/"
          target="_blank"
          rel="noreferrer"
        >
          Challenge reference ↗
        </a>
      </section>
    </div>
  );
}
