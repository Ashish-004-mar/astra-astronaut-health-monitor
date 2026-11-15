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
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  getActiveEnvironment,
  getEquipmentInventory,
  type MissionEnvironmentId,
  type EmergencyEquipmentItem,
  MISSION_ENVIRONMENTS,
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

const TABS: { id: MissionCareTab; label: string; icon: typeof Siren }[] = [
  { id: "emergency", label: "Emergency Assist", icon: Siren },
  { id: "vitals", label: "Vitals Guide", icon: Activity },
  { id: "assessment", label: "Triage & Symptoms", icon: ClipboardList },
  { id: "environment", label: "Environment & Delay", icon: Globe },
  { id: "crew", label: "Crew Roles", icon: Users },
  { id: "equipment", label: "Medical Gear", icon: Box },
  { id: "timeline", label: "Event Timeline", icon: Clock },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "resources", label: "Offline Protocols", icon: BookOpen },
];

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
  const [equipment] = useState<EmergencyEquipmentItem[]>(() => getEquipmentInventory());

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

  const envInfo = MISSION_ENVIRONMENTS[currentEnv];

  return (
    <div className="missioncare-cockpit-frame">
      {/* Top Training Drill Bar */}
      <TrainingScenarioBar
        onScenarioChange={(scenId) => {
          if (scenId === "chest_pain_collapse") {
            handleTabChange("emergency");
          }
        }}
      />

      {/* Cockpit Status Header Bar */}
      <div className="cockpit-hud-bar">
        <div className="hud-left-meta">
          <div className="hud-badge status-ready">
            <span className="live-dot" />
            <span>MEDICAL ASSIST READY</span>
          </div>

          <div className="hud-badge env-indicator">
            <Radio size={13} className="accent-cyan" />
            <span>{envInfo.name}</span>
            <small className="latency-tag">{envInfo.commLatencyMinutes}m 1-WAY DELAY</small>
          </div>
        </div>

        <div className="hud-right-actions">
          <button
            type="button"
            className={`hud-emergency-btn ${activeTab === "emergency" ? "active-alert" : ""}`}
            onClick={() => handleTabChange("emergency")}
          >
            <Siren size={15} />
            <span>RAPID EMERGENCY ASSIST</span>
          </button>
        </div>
      </div>

      {/* Main MissionCare Tab Bar */}
      <nav className="missioncare-nav-bar" aria-label="MissionCare sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`care-nav-tab ${activeTab === id ? "active" : ""} ${id === "emergency" ? "emergency-tab" : ""}`}
            onClick={() => handleTabChange(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Active Tab View Rendering */}
      <div className="missioncare-tab-content-area">
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
