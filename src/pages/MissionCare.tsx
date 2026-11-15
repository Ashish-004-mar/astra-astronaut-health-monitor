import { useState, useEffect } from "react";
import {
  Siren,
  Activity,
  ClipboardList,
  Globe,
  Users,
  Box,
  Clock,
  Bell,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  getActiveEnvironment,
  getEquipmentInventory,
  type MissionEnvironmentId,
  type EmergencyEquipmentItem,
} from "../services/missionCareService";

import EmergencyAssistView from "../components/missioncare/EmergencyAssistView";
import VitalMeasurementGuideView from "../components/missioncare/VitalMeasurementGuideView";
import SymptomAssessmentView from "../components/missioncare/SymptomAssessmentView";
import MissionEnvironmentView from "../components/missioncare/MissionEnvironmentView";
import CrewResponseView from "../components/missioncare/CrewResponseView";
import EmergencyEquipmentView from "../components/missioncare/EmergencyEquipmentView";
import EmergencyTimelineView from "../components/missioncare/EmergencyTimelineView";
import HealthRemindersView from "../components/missioncare/HealthRemindersView";
import OfflineMedicalResourcesView from "../components/missioncare/OfflineMedicalResourcesView";
import TrainingScenarioBar from "../components/missioncare/TrainingScenarioBar";

interface MissionCareProps {
  subpage?: string | null;
  setSubpage?: (sp: string | null) => void;
}

export type MissionCareTab =
  | "emergency"
  | "vitals"
  | "assessment"
  | "environment"
  | "crew"
  | "equipment"
  | "timeline"
  | "reminders"
  | "resources";

export default function MissionCare({ subpage, setSubpage }: MissionCareProps) {
  const [activeTab, setActiveTab] = useState<MissionCareTab>(() => {
    if (
      subpage === "vitals" ||
      subpage === "assessment" ||
      subpage === "environment" ||
      subpage === "crew" ||
      subpage === "equipment" ||
      subpage === "timeline" ||
      subpage === "reminders" ||
      subpage === "resources"
    ) {
      return subpage;
    }
    return "emergency";
  });

  const [currentEnv, setCurrentEnv] = useState<MissionEnvironmentId>(() => getActiveEnvironment());
  const [equipment, setEquipment] = useState<EmergencyEquipmentItem[]>(() => getEquipmentInventory());

  // Sync subpage prop changes from parent
  useEffect(() => {
    if (
      subpage &&
      (subpage === "emergency" ||
        subpage === "vitals" ||
        subpage === "assessment" ||
        subpage === "environment" ||
        subpage === "crew" ||
        subpage === "equipment" ||
        subpage === "timeline" ||
        subpage === "reminders" ||
        subpage === "resources")
    ) {
      setActiveTab(subpage as MissionCareTab);
    }
  }, [subpage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as MissionCareTab);
    if (setSubpage) {
      setSubpage(tab === "emergency" ? null : tab);
    }
  };

  return (
    <div className="missioncare-page-root">
      {/* Simulation Training Bar */}
      <TrainingScenarioBar
        onScenarioChange={(scenId) => {
          if (scenId === "chest_pain_collapse") {
            handleTabChange("emergency");
          }
        }}
      />

      {/* Main MissionCare Header Bar */}
      <div className="missioncare-header-bar">
        <div className="missioncare-title-group">
          <div className="eyebrow">
            ASTRA <span>/</span> SPACE MEDICAL EMERGENCY ASSISTANCE SYSTEM
          </div>
          <h1>MissionCare Emergency Support</h1>
          <p className="missioncare-sub">
            Autonomous health assessment, vital measurement tutorials, and crew coordination protocols designed for non-medical astronauts in deep space.
          </p>
        </div>

        <div className="missioncare-header-actions">
          <button
            type="button"
            className="button primary emergency-shortcut-btn"
            onClick={() => handleTabChange("emergency")}
          >
            <Siren size={16} /> EMERGENCY ASSIST
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <nav className="missioncare-nav-bar" aria-label="MissionCare sections">
        <button
          type="button"
          className={`care-nav-tab ${activeTab === "emergency" ? "active alert-tab" : ""}`}
          onClick={() => handleTabChange("emergency")}
        >
          <Siren size={15} />
          <span>1. Emergency Assist</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "vitals" ? "active" : ""}`}
          onClick={() => handleTabChange("vitals")}
        >
          <Activity size={15} />
          <span>2. Vital Guide</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "assessment" ? "active" : ""}`}
          onClick={() => handleTabChange("assessment")}
        >
          <ClipboardList size={15} />
          <span>3. Symptom Assessment</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "environment" ? "active" : ""}`}
          onClick={() => handleTabChange("environment")}
        >
          <Globe size={15} />
          <span>4. Mission Environment</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "crew" ? "active" : ""}`}
          onClick={() => handleTabChange("crew")}
        >
          <Users size={15} />
          <span>5. Crew Response</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "equipment" ? "active" : ""}`}
          onClick={() => handleTabChange("equipment")}
        >
          <Box size={15} />
          <span>6. Emergency Equipment</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "timeline" ? "active" : ""}`}
          onClick={() => handleTabChange("timeline")}
        >
          <Clock size={15} />
          <span>7. Emergency Timeline</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "reminders" ? "active" : ""}`}
          onClick={() => handleTabChange("reminders")}
        >
          <Bell size={15} />
          <span>8. Health Reminders</span>
        </button>

        <button
          type="button"
          className={`care-nav-tab ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => handleTabChange("resources")}
        >
          <BookOpen size={15} />
          <span>9. Offline Resources</span>
        </button>
      </nav>

      {/* Active Tab View Rendering */}
      <div className="missioncare-tab-view">
        {activeTab === "emergency" && (
          <EmergencyAssistView
            environment={currentEnv}
            equipment={equipment}
            onNavigateTab={handleTabChange}
            onOpenTimeline={() => handleTabChange("timeline")}
          />
        )}

        {activeTab === "vitals" && <VitalMeasurementGuideView />}

        {activeTab === "assessment" && <SymptomAssessmentView />}

        {activeTab === "environment" && (
          <MissionEnvironmentView
            currentEnv={currentEnv}
            onEnvironmentChange={(env) => setCurrentEnv(env)}
          />
        )}

        {activeTab === "crew" && <CrewResponseView />}

        {activeTab === "equipment" && <EmergencyEquipmentView currentEnv={currentEnv} />}

        {activeTab === "timeline" && <EmergencyTimelineView />}

        {activeTab === "reminders" && <HealthRemindersView />}

        {activeTab === "resources" && <OfflineMedicalResourcesView />}
      </div>
    </div>
  );
}
