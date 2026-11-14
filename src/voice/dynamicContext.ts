import { useStore } from "../state/store";
import { evaluate } from "../engine/healthEngine";
import { baseline } from "../types";
import type { DynamicVoiceContext } from "./types";

export function getDynamicContext(): DynamicVoiceContext {
  const state = useStore.getState();
  const current = state.mission.history.at(-1) || {
    day: state.mission.day,
    hour: state.mission.hour,
    hr: baseline.hr,
    spo2: baseline.spo2,
    stress: baseline.stress,
    activity: baseline.activity,
  };
  const lastNight = state.mission.nights.at(-1);
  const health = evaluate(state.mission);

  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const todayCheckin = state.checkins.find((c) => c.date === todayDate);

  const scenarioNames: Record<string, string> = {
    nominal: "Nominal Operations (Baseline Orbit)",
    stress: "High Cognitive Workload / EVA Prep",
    sleep_dep: "Cumulative Circadian Sleep Disruption",
    hypoxia: "Elevated Cabin CO2 / Minor Hypoxia",
    deconditioning: "Microgravity Musculoskeletal Deconditioning",
  };

  return {
    hr: current.hr,
    spo2: current.spo2,
    sleep: lastNight ? lastNight.sleep : baseline.sleep,
    stress: current.stress,
    activity: current.activity,
    baselineHr: baseline.hr,
    baselineSpo2: baseline.spo2,
    baselineSleep: baseline.sleep,
    baselineStress: baseline.stress,
    baselineActivity: baseline.activity,
    healthStatus: health.status,
    healthReasons: health.reasons,
    healthAction: health.action,
    missionDay: state.mission.day,
    missionHour: state.mission.hour,
    scenarioName: scenarioNames[state.mission.scenario] || state.mission.scenario,
    hasCheckinToday: !!todayCheckin,
    todayCheckin: todayCheckin
      ? {
          energy: todayCheckin.answers["Energy"],
          stress: todayCheckin.answers["Stress"],
          mood: todayCheckin.answers["Mood"],
          sleep: todayCheckin.answers["Sleep"],
          discomfort: todayCheckin.answers["Physical discomfort"],
        }
      : undefined,
  };
}
