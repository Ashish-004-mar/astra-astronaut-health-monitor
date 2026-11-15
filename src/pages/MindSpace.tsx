import { useState, useEffect } from "react";
import {
  Brain,
  Wind,
  Users,
  Target,
  Compass,
  Activity,
  ShieldAlert,
  BookOpen,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  isDemoModeActive,
  setDemoModeActive,
  getActiveDemoScenario,
  setActiveDemoScenario,
  getMentalCheckins,
  getTodayCheckin,
  getRecoveryLogs,
  computePersonalBaseline,
  generateWellnessSuggestions,
  type MentalCheckinEntry,
  type DemoScenarioKey,
} from "../services/mindspaceService";

import MindSpaceOverview from "../components/mindspace/MindSpaceOverview";
import DailyCheckinModal from "../components/mindspace/DailyCheckinModal";
import StressRecoveryStudio from "../components/mindspace/StressRecoveryStudio";
import CrewHarmonySection from "../components/mindspace/CrewHarmonySection";
import FocusReadinessSection from "../components/mindspace/FocusReadinessSection";
import ReflectionJournalSection from "../components/mindspace/ReflectionJournalSection";
import WellnessTrendsSection from "../components/mindspace/WellnessTrendsSection";
import SupportSafetyModal from "../components/mindspace/SupportSafetyModal";
import NasaReferencesModal from "../components/mindspace/NasaReferencesModal";

interface MindSpaceProps {
  subpage?: string | null;
  setSubpage?: (sp: string | null) => void;
}

type MindSpaceTab =
  | "overview"
  | "recovery"
  | "harmony"
  | "focus"
  | "journal"
  | "trends"
  | "support";

export default function MindSpace({ subpage, setSubpage }: MindSpaceProps) {
  // Active Tab state synced with subpage
  const [activeTab, setActiveTab] = useState<MindSpaceTab>(() => {
    if (subpage === "recovery" || subpage === "harmony" || subpage === "focus" || subpage === "journal" || subpage === "trends" || subpage === "support") {
      return subpage;
    }
    return "overview";
  });

  // Sync subpage changes from parent
  useEffect(() => {
    if (subpage && (subpage === "recovery" || subpage === "harmony" || subpage === "focus" || subpage === "journal" || subpage === "trends" || subpage === "support")) {
      setActiveTab(subpage as MindSpaceTab);
    }
  }, [subpage]);

  const handleTabChange = (tab: MindSpaceTab) => {
    setActiveTab(tab);
    if (setSubpage) {
      setSubpage(tab === "overview" ? null : tab);
    }
  };

  // Modals state
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  // Demo Mode state
  const [isDemo, setIsDemo] = useState(() => isDemoModeActive());
  const [demoScenario, setDemoScenario] = useState<DemoScenarioKey>(() => getActiveDemoScenario());

  const handleScenarioSelect = (scenario: DemoScenarioKey) => {
    setActiveDemoScenario(scenario);
    setDemoScenario(scenario);
    setIsDemo(scenario !== "NONE");
  };

  // Data queries
  const todayCheckin = getTodayCheckin(147);
  const checkins = getMentalCheckins();
  const recoveryLogs = getRecoveryLogs();
  const baseline = computePersonalBaseline(checkins);
  const suggestions = generateWellnessSuggestions(todayCheckin, baseline);

  return (
    <div className="mindspace-page-root">
      {/* MindSpace Header Bar */}
      <div className="mindspace-header-bar">
        <div className="mindspace-title-group">
          <div className="eyebrow">
            ASTRA <span>/</span> CREW RESILIENCE & PSYCHOLOGICAL SUPPORT
          </div>
          <h1>ASTRA MindSpace</h1>
          <p className="mindspace-sub">
            Autonomous astronaut mental wellness, stress recovery, and team resilience inspired by NASA Human Research Program.
          </p>
        </div>

        <div className="mindspace-header-actions">
          {/* Demo Scenario Selector */}
          <div className="demo-scenario-select-box">
            <span className="demo-lbl">DEMO SCENARIO:</span>
            <select
              value={demoScenario}
              onChange={(e) => handleScenarioSelect(e.target.value as DemoScenarioKey)}
              className="scenario-select-dropdown"
              title="Select a simulated demonstration scenario"
            >
              <option value="NONE">Realistic User Data (Local)</option>
              <option value="NORMAL">Scenario A: Normal Flight (Demo)</option>
              <option value="ELEVATED_STRESS">Scenario B: Elevated Stress (Demo)</option>
              <option value="CREW_CONFLICT">Scenario C: Crew Conflict (Demo)</option>
              <option value="FATIGUE">Scenario D: Fatigue & Focus (Demo)</option>
            </select>
          </div>

          <button
            type="button"
            className="button outline small-btn"
            onClick={() => setIsReferencesOpen(true)}
            title="View NASA Human Research Program references"
          >
            <BookOpen size={14} /> NASA References
          </button>

          <button
            type="button"
            className="button outline alert-btn small-btn"
            onClick={() => setIsSupportOpen(true)}
            title="Open Confidential Support Pathways"
          >
            <HeartHandshake size={14} /> Get Support
          </button>
        </div>
      </div>

      {/* Main MindSpace Navigation Bar */}
      <nav className="mindspace-nav-bar" aria-label="MindSpace sub-sections">
        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          <Brain size={15} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "recovery" ? "active" : ""}`}
          onClick={() => handleTabChange("recovery")}
        >
          <Wind size={15} />
          <span>Stress Recovery Studio</span>
        </button>

        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "harmony" ? "active" : ""}`}
          onClick={() => handleTabChange("harmony")}
        >
          <Users size={15} />
          <span>Crew Harmony</span>
        </button>

        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "focus" ? "active" : ""}`}
          onClick={() => handleTabChange("focus")}
        >
          <Target size={15} />
          <span>Focus & Readiness</span>
        </button>

        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "journal" ? "active" : ""}`}
          onClick={() => handleTabChange("journal")}
        >
          <Compass size={15} />
          <span>Private Journal</span>
        </button>

        <button
          type="button"
          className={`mind-nav-tab ${activeTab === "trends" ? "active" : ""}`}
          onClick={() => handleTabChange("trends")}
        >
          <Activity size={15} />
          <span>Wellness Trends</span>
        </button>
      </nav>

      {/* Active Tab View Rendering */}
      <div className="mindspace-tab-view">
        {activeTab === "overview" && (
          <MindSpaceOverview
            todayCheckin={todayCheckin}
            baseline={baseline}
            suggestions={suggestions}
            recentRecovery={recoveryLogs[0]}
            totalRecoveryCount={recoveryLogs.length}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onNavigateTab={handleTabChange}
            onOpenSupport={() => setIsSupportOpen(true)}
            isDemoMode={isDemo}
          />
        )}

        {activeTab === "recovery" && (
          <StressRecoveryStudio
            onSessionLogged={() => {
              // Trigger state refresh
            }}
          />
        )}

        {activeTab === "harmony" && <CrewHarmonySection />}

        {activeTab === "focus" && <FocusReadinessSection />}

        {activeTab === "journal" && <ReflectionJournalSection />}

        {activeTab === "trends" && <WellnessTrendsSection isDemoMode={isDemo} />}
      </div>

      {/* Modals */}
      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onComplete={() => {
          setIsCheckinOpen(false);
        }}
        initialEntry={todayCheckin}
        missionDay={147}
      />

      <SupportSafetyModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <NasaReferencesModal
        isOpen={isReferencesOpen}
        onClose={() => setIsReferencesOpen(false)}
      />
    </div>
  );
}
