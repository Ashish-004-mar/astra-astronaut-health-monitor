import { lazy, Suspense, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Heart,
  UtensilsCrossed,
  Orbit,
  ClipboardCheck,
  Brain,
  ShieldAlert,
  Camera,
  Settings as SettingsIcon,
  ArrowUpRight,
  Radio,
  ChevronRight,
  VolumeX,
  BookOpen,
} from "lucide-react";
import { useStore } from "../state/store";
import Overview from "../pages/Overview";
import { MyHealth, Checkin, Space, Settings } from "../pages/Pages";
import Nutrition from "../pages/Nutrition";
import MindSpace from "../pages/MindSpace";
import MissionCare from "../pages/MissionCare";
import CameraTrackingPage from "../pages/CameraTrackingPage";
import CinematicLanding from "../components/landing/CinematicLanding";
import NasaSourcesPage from "../pages/NasaSourcesPage";
import AstraVoicePanel from "../voice/AstraVoicePanel";
import { audioAlertService, type ActiveAlert } from "../services/audioAlertService";
const Background = lazy(() =>
  import("../three/Scene").then((m) => ({ default: m.SpaceBackground })),
);
const nav = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "My Health", icon: Heart },
  { name: "Nutrition", icon: UtensilsCrossed },
  { name: "Space", icon: Orbit },
  { name: "Camera Tracking", icon: Camera },
  { name: "Check-in", icon: ClipboardCheck },
  { name: "MindSpace", icon: Brain },
  { name: "MissionCare", icon: ShieldAlert },
  { name: "Settings", icon: SettingsIcon },
];
export default function App() {
  const { entered, enter, page, setPage, subpage, setSubpage, mission, tick, reduced, settings } =
    useStore();

  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [isSirenSounding, setIsSirenSounding] = useState(false);
  const [viewNasaSources, setViewNasaSources] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
      return (
        hash.startsWith("nasa-sources") ||
        hash.startsWith("nasa") ||
        hash.startsWith("sources")
      );
    }
    return false;
  });

  useEffect(() => {
    return audioAlertService.subscribe((alerts, sounding) => {
      setActiveAlerts(alerts);
      setIsSirenSounding(sounding);
    });
  }, []);

  // Sync hash routing for back/forward and direct refresh
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
      if (!hash) {
        setViewNasaSources(false);
        return;
      }

      if (
        hash.startsWith("nasa-sources") ||
        hash.startsWith("nasa") ||
        hash.startsWith("sources")
      ) {
        setViewNasaSources(true);
        return;
      }
      setViewNasaSources(false);

      if (hash.startsWith("overview")) {
        setPage("Overview");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (hash.startsWith("my-health") || hash.startsWith("health")) {
        setPage("My Health");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (hash.startsWith("nutrition")) {
        setPage("Nutrition");
      } else if (hash.startsWith("space")) {
        setPage("Space");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (
        hash.startsWith("camera-tracking") ||
        hash.startsWith("camera") ||
        hash.startsWith("tracking")
      ) {
        setPage("Camera Tracking");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (hash.startsWith("check-in") || hash.startsWith("checkin")) {
        setPage("Check-in");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (hash.startsWith("mindspace") || hash.startsWith("mind")) {
        setPage("MindSpace");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (
        hash.startsWith("missioncare") ||
        hash.startsWith("care") ||
        hash.startsWith("emergency")
      ) {
        setPage("MissionCare");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      } else if (hash.startsWith("settings")) {
        setPage("Settings");
        const parts = hash.split("/");
        if (parts[1]) setSubpage(parts[1]);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial check on load
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [setPage, setSubpage]);

  // Keep hash updated when page / subpage changes
  useEffect(() => {
    if (!entered || viewNasaSources) return;
    const pageSlug = page.toLowerCase().replace(/\s+/g, "-");
    const targetHash = subpage ? `#/${pageSlug}/${subpage}` : `#/${pageSlug}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, "", targetHash);
    }
  }, [page, subpage, entered, viewNasaSources]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page, entered, viewNasaSources]);
  useEffect(() => {
    if (entered)
      document
        .querySelector<HTMLElement>("main.main")
        ?.focus({ preventScroll: true });
  }, [entered]);
  useEffect(() => {
    if (!mission.running) return;
    const id = setInterval(() => tick(), 2000);
    return () => clearInterval(id);
  }, [mission.running, tick]);
  return (
    <div
      className={`app ${reduced ? "reduced" : ""} ${entered ? "mission-arrival" : ""}`}
    >
      {entered && !viewNasaSources && (
        <Suspense fallback={null}>
          <Background large={page === "Space"} />
        </Suspense>
      )}
      {viewNasaSources ? (
        <NasaSourcesPage
          onBack={() => {
            setViewNasaSources(false);
            if (window.location.hash.includes("nasa") || window.location.hash.includes("sources")) {
              window.location.hash = entered ? "#/overview" : "";
            }
          }}
          onEnterApp={() => {
            setViewNasaSources(false);
            enter();
            setPage("Overview");
            window.location.hash = "#/overview";
          }}
        />
      ) : !entered ? (
        <CinematicLanding
          onEnter={enter}
          reducedMotion={false}
          onExploreNasaSources={() => {
            setViewNasaSources(true);
            window.location.hash = "#/nasa-sources";
          }}
        />
      ) : (
        <>
          <aside className="sidebar">
            <button
              className="brand"
              onClick={() => setPage("Overview")}
              aria-label="ASTRA overview"
            >
              ✳ <span>ASTRA</span>
            </button>
            <span className="sidebar-label">MISSION CONTROL</span>
            <nav aria-label="Main navigation">
              {nav.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setPage(name)}
                  aria-current={page === name ? "page" : undefined}
                >
                  <Icon size={19} />
                  <span>{name}</span>
                  {page === name && (
                    <ChevronRight className="nav-chevron" size={13} />
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="connection">
                <i className="dot" /> LOCAL SYSTEM
              </div>
              <p>
                Your health.
                <br />
                Your mission.
              </p>
              <div className="crew">
                <div className="avatar">AC</div>
                <div>
                  ASTRA Crew<small>MISSION SPECIALIST</small>
                </div>
              </div>
              <small>
                PROTOTYPE V1.0 <ArrowUpRight size={11} />
              </small>
              <button
                type="button"
                className="nasa-sidebar-link"
                onClick={() => {
                  setViewNasaSources(true);
                  window.location.hash = "#/nasa-sources";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10px",
                  color: "#00f0ff",
                  background: "rgba(0, 240, 255, 0.08)",
                  border: "1px solid rgba(0, 240, 255, 0.25)",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginTop: "8px",
                  width: "100%",
                  justifyContent: "center",
                }}
                title="View NASA research and data sources"
              >
                <BookOpen size={12} />
                <span>NASA SOURCES</span>
              </button>
            </div>
          </aside>
          <main className="main" tabIndex={-1}>
            {isSirenSounding && (
              <div className="global-siren-alert-banner">
                <div className="siren-banner-inner">
                  <span className="pulse-siren-dot" />
                  <span className="siren-banner-text">
                    🚨 <strong>AUDIBLE ALARM ACTIVE:</strong> {activeAlerts[0]?.title || "BIOASTRONAUTICS HAZARD ACTIVE"}
                  </span>
                  <button
                    className="button primary small-btn silence-banner-btn"
                    onClick={() => audioAlertService.silenceAlarm()}
                    title="Silence audible alarm siren"
                  >
                    <VolumeX size={14} /> SILENCE ALARM
                  </button>
                </div>
              </div>
            )}
            <header className="topbar">
              <div className="breadcrumb">
                MISSION CONTROL <span>/</span>{" "}
                <strong>{page.toUpperCase()}</strong>
                {subpage && (
                  <>
                    {" "}
                    <span>/</span>{" "}
                    <strong style={{ color: "#76dfcb" }}>
                      {subpage.replace(/^hazard-/, "").replace(/-/g, " ").toUpperCase()}
                    </strong>
                  </>
                )}
              </div>
              <div className="mission-clock">
                <Radio size={13} />
                <span>
                  MISSION DAY <strong>{mission.day}</strong>
                </span>
                <span className="clock-time">
                  {String(mission.hour % 24).padStart(2, "0")}:00{" "}
                  <small>VIRTUAL UTC</small>
                </span>
              </div>
            </header>
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  {page === "Overview"
                    ? "YOUR WELLBEING, IN ORBIT."
                    : page === "Nutrition"
                      ? "ASTRA / CREW WELLNESS"
                      : page === "MindSpace"
                        ? "ASTRA / CREW RESILIENCE"
                        : page === "MissionCare"
                          ? "ASTRA / MEDICAL DECISION SUPPORT"
                          : page === "Camera Tracking"
                            ? "ASTRA / COMPUTER VISION & BIOMETRICS"
                            : "ASTRA / MISSION SUPPORT"}
                </div>
                <h1>
                  {page === "Overview"
                    ? "Ready for what’s ahead."
                    : page === "My Health"
                      ? "My health."
                      : page === "Nutrition"
                        ? "Fuel your body. Sustain your mission."
                        : page === "Space"
                          ? "Beyond the cabin."
                          : page === "Camera Tracking"
                            ? "Kinematic camera tracking & body analysis."
                            : page === "Check-in"
                              ? "Your daily check-in."
                              : page === "MindSpace"
                                ? "Mental wellness & recovery."
                                : page === "MissionCare"
                                  ? "Space medical emergency assistance."
                                  : "Your mission, your settings."}
                </h1>
                <p>
                  {page === "Overview"
                    ? "A clear view of your health. A little more peace of mind."
                    : page === "My Health"
                      ? "Understand the pattern behind every signal."
                      : page === "Nutrition"
                        ? "Interactive bioastronautics galley monitoring inspired by NASA Human Research Program."
                        : page === "Space"
                          ? "A window into the environment around you."
                          : page === "Camera Tracking"
                            ? "Real-time edge computer vision, landmark skeletal detection, and regional biometric analysis."
                            : page === "Check-in"
                              ? "Take a minute. Listen to yourself."
                              : page === "MindSpace"
                                ? "Autonomous stress recovery, team harmony, and cognitive resilience in deep space."
                                : page === "MissionCare"
                                  ? "Autonomous medical triage, vital measurement guidance, crew response coordination, and emergency decision support."
                                  : "A transparent, personal experience."}
                </p>
              </div>
              <span className="mission-badge">
                <i className="dot" />{" "}
                {mission.running ? "SIMULATION RUNNING" : "MISSION DEMO"}{" "}
                <span> / 0147</span>
              </span>
            </div>
            {page === "Overview" ? (
              <Overview />
            ) : page === "My Health" ? (
              <MyHealth />
            ) : page === "Nutrition" ? (
              <Nutrition />
            ) : page === "Space" ? (
              <Space />
            ) : page === "Camera Tracking" ? (
              <CameraTrackingPage />
            ) : page === "Check-in" ? (
              <Checkin />
            ) : page === "MindSpace" ? (
              <MindSpace subpage={subpage} setSubpage={setSubpage} />
            ) : page === "MissionCare" ? (
              <MissionCare subpage={subpage} setSubpage={setSubpage} />
            ) : (
              <Settings />
            )}
            <footer className="app-footer">
              <span>ASTRA · KNOW YOUR HEALTH. STAY MISSION-READY.</span>
              <span>PROTOTYPE · NOT A MEDICAL DEVICE</span>
            </footer>
          </main>
          <AstraVoicePanel />
        </>
      )}
    </div>
  );
}
