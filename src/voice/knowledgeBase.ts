import type { KnowledgeEntry, VoiceCategory } from "./types";
import { generalHealthEntries } from "./kb/generalHealth";
import { personalBaselineEntries } from "./kb/personalBaseline";
import { sleepFatigueEntries } from "./kb/sleepFatigue";
import { stressRecoveryEntries } from "./kb/stressRecovery";
import { activityMovementEntries } from "./kb/activityMovement";
import { spaceEnvironmentEntries } from "./kb/spaceEnvironment";
import { missionSimulationEntries } from "./kb/missionSimulation";
import { checkinReportsEntries } from "./kb/checkinReports";
import { appHelpEntries } from "./kb/appHelp";

export const knowledgeBase: KnowledgeEntry[] = [
  ...generalHealthEntries,
  ...personalBaselineEntries,
  ...sleepFatigueEntries,
  ...stressRecoveryEntries,
  ...activityMovementEntries,
  ...spaceEnvironmentEntries,
  ...missionSimulationEntries,
  ...checkinReportsEntries,
  ...appHelpEntries,
];

export const categoryLabels: Record<VoiceCategory, { en: string; hi: string; count: number }> = {
  general: { en: "General Health", hi: "सामान्य स्वास्थ्य", count: generalHealthEntries.length },
  baseline: { en: "Personal Baseline & Signals", hi: "व्यक्तिगत बेसलाइन", count: personalBaselineEntries.length },
  sleep: { en: "Sleep & Fatigue", hi: "नींद व थकान", count: sleepFatigueEntries.length },
  stress: { en: "Stress & Recovery", hi: "तनाव व रिकवरी", count: stressRecoveryEntries.length },
  activity: { en: "Activity & Movement", hi: "शारीरिक गतिविधि", count: activityMovementEntries.length },
  space: { en: "Space Environment", hi: "अंतरिक्ष पर्यावरण", count: spaceEnvironmentEntries.length },
  simulation: { en: "Mission Simulation", hi: "मिशन सिमुलेशन", count: missionSimulationEntries.length },
  checkin: { en: "Check-in & Reports", hi: "चेक-इन व रिपोर्ट", count: checkinReportsEntries.length },
  help: { en: "ASTRA App & Help", hi: "ऐप सहायता", count: appHelpEntries.length },
};

export function getEntriesByCategory(category: VoiceCategory): KnowledgeEntry[] {
  return knowledgeBase.filter((e) => e.category === category);
}

export function getEntryById(id: string): KnowledgeEntry | undefined {
  return knowledgeBase.find((e) => e.id === id);
}
