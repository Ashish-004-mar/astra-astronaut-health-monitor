export type NASAhazardId =
  | "radiation"
  | "isolation"
  | "distance"
  | "gravity"
  | "environment";

export interface NASAhazardInfo {
  id: NASAhazardId;
  name: string;
  tagline: string;
  shortDesc: string;
  dataAvailability: string;
  whyItMatters: string;
  whatAstraMonitors: string;
  dataSourceLabel: string;
  recommendedAction: string;
  nasaRefUrl: string;
  iconName: string;
}

export type ExerciseType =
  | "Treadmill (T2)"
  | "Resistance (ARED)"
  | "Stationary Cycling (CEVIS)"
  | "Mobility & Stretch"
  | "EVA Simulation Movement";

export interface ExerciseSession {
  id: string;
  exerciseType: ExerciseType;
  durationMinutes: number;
  missionDay: number;
  timestamp: string;
  notes?: string;
  caloriesBurned?: number;
  avgHeartRate?: number;
}

export interface ReactionTestRecord {
  id: string;
  timestamp: string;
  missionDay: number;
  reactionTimeMs: number;
  isEarlyClick: boolean;
  status: "GOOD" | "AVERAGE" | "NEEDS_REST";
}

export interface CabinEnvironmentReading {
  timeStr: string;
  co2Ppm: number; // Normal ~2500 - 3500 ppm in space habitat, elevated > 4000
  co2MmHg: number;
  temperatureC: number; // 21 - 24 C
  humidityPct: number; // 40 - 55 %
  status: "NOMINAL" | "ATTENTION" | "CRITICAL";
}

export type CabinScenario = "NORMAL" | "ELEVATED_CO2" | "RECOVERY";

export interface OfflineCheckItem {
  id: string;
  label: string;
  detail: string;
  status: "READY" | "CACHED" | "CHECKING" | "UNAVAILABLE";
  isLocalOnly: boolean;
}
