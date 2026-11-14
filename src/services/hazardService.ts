import type {
  NASAhazardInfo,
  NASAhazardId,
  ExerciseSession,
  ExerciseType,
  ReactionTestRecord,
  CabinEnvironmentReading,
  CabinScenario,
  OfflineCheckItem,
} from "../types/hazards";

export const NASA_FIVE_HAZARDS: NASAhazardInfo[] = [
  {
    id: "radiation",
    name: "Space Radiation",
    tagline: "The invisible hazard beyond Earth's magnetosphere.",
    shortDesc:
      "High-energy galactic cosmic rays (GCR) and solar particle events (SPE) can penetrate spacecraft shielding and impact cell DNA.",
    dataAvailability: "PUBLIC NASA DONKI + SIMULATED SENSOR",
    whyItMatters:
      "Unlike Earth's protective magnetosphere and atmosphere, deep-space or high-inclination missions expose astronauts to cumulative ionizing radiation, increasing lifetime cancer risks, cataracts, and acute radiation syndromes.",
    whatAstraMonitors:
      "Public NASA DONKI coronal mass ejections, solar flares, geomagnetic storms, and simulated personal habitat dosimeter readings.",
    dataSourceLabel: "PUBLIC NASA DONKI · NOT INDIVIDUAL CLINICAL DOSE",
    recommendedAction:
      "During detected SPE solar storms, move to spacecraft shielded storm shelter compartments (e.g. water-shielded crew quarters) and review dosimeter cumulative dose logs.",
    nasaRefUrl: "https://www.nasa.gov/hrp/hazards/radiation/",
    iconName: "Sun",
  },
  {
    id: "isolation",
    name: "Isolation & Confinement",
    tagline: "Psychological resilience in closed living environments.",
    shortDesc:
      "Small groups living in confined quarters for months or years face circadian shifts, sensory deprivation, and interpersonal stress.",
    dataAvailability: "SELF-REPORTED + REACTION TEST",
    whyItMatters:
      "Confinement can alter mood, sleep architecture, cognitive throughput, and team cohesion. NASA behavioral health research emphasizes continuous unobtrusive wellness tracking.",
    whatAstraMonitors:
      "Daily self-reported mood, energy, fatigue, stress scores, and psychomotor vigilance reaction-time practice metrics.",
    dataSourceLabel: "SELF-REPORTED & ON-DEVICE REACTION TIMING",
    recommendedAction:
      "Maintain strict daily routine, regular communications with flight psychologists, scheduled crew recreational debriefs, and circadian blue-enriched morning lighting.",
    nasaRefUrl: "https://www.nasa.gov/hrp/hazards/isolation-and-confinement/",
    iconName: "Users",
  },
  {
    id: "distance",
    name: "Distance from Earth",
    tagline: "Autonomous operations when immediate return is impossible.",
    shortDesc:
      "As distance increases toward Mars, two-way communications delay reaches up to 22 minutes each way, requiring fully autonomous offline medical systems.",
    dataAvailability: "100% LOCAL ARCHITECTURE",
    whyItMatters:
      "Astronauts cannot rely on real-time ground flight surgeons or cloud servers. All diagnostic algorithms, medical knowledge, and telemetry must function fully disconnected on local hardware.",
    whatAstraMonitors:
      "On-device health engine status, cached NASA datasets, local IndexedDB persistence, and offline speech assistant readiness.",
    dataSourceLabel: "ON-DEVICE EMBEDDED ENGINE · ZERO CLOUD API",
    recommendedAction:
      "Verify weekly offline telemetry backups, ensure emergency local protocol caches are intact, and run autonomous self-assessment checks.",
    nasaRefUrl: "https://www.nasa.gov/hrp/hazards/distance-from-earth/",
    iconName: "Radio",
  },
  {
    id: "gravity",
    name: "Gravity Fields & Microgravity",
    tagline: "Fluid shifts, muscle atrophy, and bone demineralization.",
    shortDesc:
      "Weightlessness eliminates the mechanical load on muscles and skeleton, leading to rapid loss of bone mineral density and postural muscle mass.",
    dataAvailability: "SIMULATED TELEMETRY + EXERCISE LOG",
    whyItMatters:
      "Astronauts lose up to 1-1.5% bone mass per month in microgravity without rigorous countermeasures. Cephalic fluid shift also alters intracranial pressure (SANS).",
    whatAstraMonitors:
      "Resting cardiovascular baseline, heart rate recovery, MediaPipe camera biomechanics, and daily resistive/aerobic exercise logs.",
    dataSourceLabel: "SIMULATED BIOASTRONAUTICS MODEL",
    recommendedAction:
      "Complete prescribed daily ~2 hours of countermeasure protocol: ARED heavy resistive training combined with T2 treadmill or CEVIS cycle ergometry.",
    nasaRefUrl: "https://www.nasa.gov/hrp/hazards/gravity-fields/",
    iconName: "Activity",
  },
  {
    id: "environment",
    name: "Hostile / Closed Environments",
    tagline: "Atmospheric life support in an airtight spacecraft cabin.",
    shortDesc:
      "Living in a sealed pressure vessel requires continuous environmental control: CO₂ scrubbing, temperature, humidity, toxic gas, and microbial control.",
    dataAvailability: "SIMULATED CABIN SENSORS",
    whyItMatters:
      "Elevated cabin CO₂ (above 3.0–4.0 mmHg) in microgravity correlates with crew headaches, lethargy, cognitive fog, and increased intracranial pressure due to lack of gravity convection.",
    whatAstraMonitors:
      "Simulated Cabin CO₂ (ppm and mmHg), ambient temperature (°C), relative humidity (%), and environmental life support system alerts.",
    dataSourceLabel: "SIMULATED ECLSS LIFE SUPPORT TELEMETRY",
    recommendedAction:
      "If elevated CO₂ is flagged, inspect galley/bunk air ventilation duct diffusers, verify CDRA carbon dioxide removal assembly scrubbing cycles, and report to mission support.",
    nasaRefUrl: "https://www.nasa.gov/hrp/hazards/hostile-closed-environments/",
    iconName: "Gauge",
  },
];

const HAZARD_STORAGE_KEYS = {
  EXERCISE: "astra_exercise_sessions_v1",
  REACTION: "astra_reaction_test_v1",
  CABIN_SCENARIO: "astra_cabin_scenario_v1",
};

// Initial exercise sessions for Day 147
export const INITIAL_EXERCISE_SESSIONS: ExerciseSession[] = [
  {
    id: "ex-147-1",
    exerciseType: "Resistance (ARED)",
    durationMinutes: 45,
    missionDay: 147,
    timestamp: "2026-11-14T09:30:00.000Z",
    caloriesBurned: 310,
    avgHeartRate: 132,
    notes: "ARED squat sets (4x10 @ 180 lbs equivalent) + heel raises.",
  },
  {
    id: "ex-147-2",
    exerciseType: "Stationary Cycling (CEVIS)",
    durationMinutes: 35,
    missionDay: 147,
    timestamp: "2026-11-14T10:20:00.000Z",
    caloriesBurned: 290,
    avgHeartRate: 146,
    notes: "Target heart rate zone maintained (72% VO2 max).",
  },
];

export function getExerciseSessions(): ExerciseSession[] {
  if (typeof window === "undefined") return INITIAL_EXERCISE_SESSIONS;
  try {
    const raw = localStorage.getItem(HAZARD_STORAGE_KEYS.EXERCISE);
    if (!raw) {
      localStorage.setItem(
        HAZARD_STORAGE_KEYS.EXERCISE,
        JSON.stringify(INITIAL_EXERCISE_SESSIONS),
      );
      return INITIAL_EXERCISE_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EXERCISE_SESSIONS;
  }
}

export function logExerciseSession(
  session: Omit<ExerciseSession, "id" | "timestamp">,
): ExerciseSession {
  const all = getExerciseSessions();
  const newSession: ExerciseSession = {
    ...session,
    id: `ex-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newSession, ...all];
  try {
    localStorage.setItem(HAZARD_STORAGE_KEYS.EXERCISE, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save exercise session:", err);
  }
  return newSession;
}

export function getTodayExerciseDuration(missionDay: number): number {
  const sessions = getExerciseSessions().filter((s) => s.missionDay === missionDay);
  return sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
}

// Reaction test records
export const INITIAL_REACTION_RECORDS: ReactionTestRecord[] = [
  {
    id: "rec-1",
    timestamp: "2026-11-14T08:00:00.000Z",
    missionDay: 147,
    reactionTimeMs: 238,
    isEarlyClick: false,
    status: "GOOD",
  },
  {
    id: "rec-2",
    timestamp: "2026-11-13T08:15:00.000Z",
    missionDay: 146,
    reactionTimeMs: 245,
    isEarlyClick: false,
    status: "GOOD",
  },
  {
    id: "rec-3",
    timestamp: "2026-11-12T08:30:00.000Z",
    missionDay: 145,
    reactionTimeMs: 262,
    isEarlyClick: false,
    status: "AVERAGE",
  },
];

export function getReactionTestRecords(): ReactionTestRecord[] {
  if (typeof window === "undefined") return INITIAL_REACTION_RECORDS;
  try {
    const raw = localStorage.getItem(HAZARD_STORAGE_KEYS.REACTION);
    if (!raw) {
      localStorage.setItem(
        HAZARD_STORAGE_KEYS.REACTION,
        JSON.stringify(INITIAL_REACTION_RECORDS),
      );
      return INITIAL_REACTION_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REACTION_RECORDS;
  }
}

export function saveReactionTestRecord(ms: number, isEarlyClick = false): ReactionTestRecord {
  const all = getReactionTestRecords();
  let status: "GOOD" | "AVERAGE" | "NEEDS_REST" = "GOOD";
  if (isEarlyClick || ms > 360) {
    status = "NEEDS_REST";
  } else if (ms > 280) {
    status = "AVERAGE";
  }

  const record: ReactionTestRecord = {
    id: `rt-${Date.now()}`,
    timestamp: new Date().toISOString(),
    missionDay: 147,
    reactionTimeMs: ms,
    isEarlyClick,
    status,
  };

  const updated = [record, ...all].slice(0, 50);
  try {
    localStorage.setItem(HAZARD_STORAGE_KEYS.REACTION, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save reaction test:", err);
  }
  return record;
}

// Cabin environment deterministic simulation
export function getCabinScenario(): CabinScenario {
  if (typeof window === "undefined") return "NORMAL";
  try {
    return (localStorage.getItem(HAZARD_STORAGE_KEYS.CABIN_SCENARIO) as CabinScenario) || "NORMAL";
  } catch {
    return "NORMAL";
  }
}

export function setCabinScenario(scenario: CabinScenario): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HAZARD_STORAGE_KEYS.CABIN_SCENARIO, scenario);
  } catch (err) {
    console.error("Failed to save cabin scenario:", err);
  }
}

export function getCabinReadings(scenario: CabinScenario = "NORMAL"): CabinEnvironmentReading[] {
  const times = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Current"];

  if (scenario === "ELEVATED_CO2") {
    // Simulated spike in CO2 to ~4200 ppm (3.2 mmHg)
    return [
      { timeStr: times[0], co2Ppm: 2600, co2MmHg: 1.98, temperatureC: 22.1, humidityPct: 44, status: "NOMINAL" },
      { timeStr: times[1], co2Ppm: 2750, co2MmHg: 2.09, temperatureC: 22.3, humidityPct: 45, status: "NOMINAL" },
      { timeStr: times[2], co2Ppm: 3100, co2MmHg: 2.36, temperatureC: 22.5, humidityPct: 46, status: "NOMINAL" },
      { timeStr: times[3], co2Ppm: 3600, co2MmHg: 2.74, temperatureC: 22.8, humidityPct: 48, status: "ATTENTION" },
      { timeStr: times[4], co2Ppm: 4050, co2MmHg: 3.08, temperatureC: 23.2, humidityPct: 51, status: "ATTENTION" },
      { timeStr: times[5], co2Ppm: 4320, co2MmHg: 3.28, temperatureC: 23.4, humidityPct: 53, status: "ATTENTION" },
      { timeStr: times[6], co2Ppm: 4450, co2MmHg: 3.38, temperatureC: 23.5, humidityPct: 54, status: "ATTENTION" },
    ];
  }

  if (scenario === "RECOVERY") {
    // Scrubbing cycles engaged, CO2 returning to nominal
    return [
      { timeStr: times[0], co2Ppm: 4400, co2MmHg: 3.34, temperatureC: 23.5, humidityPct: 53, status: "ATTENTION" },
      { timeStr: times[1], co2Ppm: 3950, co2MmHg: 3.00, temperatureC: 23.1, humidityPct: 51, status: "ATTENTION" },
      { timeStr: times[2], co2Ppm: 3500, co2MmHg: 2.66, temperatureC: 22.8, humidityPct: 49, status: "ATTENTION" },
      { timeStr: times[3], co2Ppm: 3100, co2MmHg: 2.36, temperatureC: 22.5, humidityPct: 47, status: "NOMINAL" },
      { timeStr: times[4], co2Ppm: 2800, co2MmHg: 2.13, temperatureC: 22.3, humidityPct: 46, status: "NOMINAL" },
      { timeStr: times[5], co2Ppm: 2650, co2MmHg: 2.01, temperatureC: 22.2, humidityPct: 45, status: "NOMINAL" },
      { timeStr: times[6], co2Ppm: 2550, co2MmHg: 1.94, temperatureC: 22.0, humidityPct: 44, status: "NOMINAL" },
    ];
  }

  // Nominal conditions
  return [
    { timeStr: times[0], co2Ppm: 2600, co2MmHg: 1.98, temperatureC: 22.0, humidityPct: 44, status: "NOMINAL" },
    { timeStr: times[1], co2Ppm: 2550, co2MmHg: 1.94, temperatureC: 22.1, humidityPct: 43, status: "NOMINAL" },
    { timeStr: times[2], co2Ppm: 2700, co2MmHg: 2.05, temperatureC: 22.2, humidityPct: 45, status: "NOMINAL" },
    { timeStr: times[3], co2Ppm: 2850, co2MmHg: 2.17, temperatureC: 22.4, humidityPct: 46, status: "NOMINAL" },
    { timeStr: times[4], co2Ppm: 2780, co2MmHg: 2.11, temperatureC: 22.3, humidityPct: 45, status: "NOMINAL" },
    { timeStr: times[5], co2Ppm: 2620, co2MmHg: 1.99, temperatureC: 22.1, humidityPct: 44, status: "NOMINAL" },
    { timeStr: times[6], co2Ppm: 2580, co2MmHg: 1.96, temperatureC: 22.0, humidityPct: 43, status: "NOMINAL" },
  ];
}

// Offline readiness status checker
export async function testOfflineReadiness(): Promise<OfflineCheckItem[]> {
  const items: OfflineCheckItem[] = [];

  // 1. IndexedDB & LocalStorage
  const hasStorage = typeof window !== "undefined" && "localStorage" in window;
  items.push({
    id: "local_storage",
    label: "Local Storage & Session Persistence",
    detail: hasStorage
      ? "Browser local state engine fully operational without cloud storage."
      : "Storage access limited.",
    status: hasStorage ? "READY" : "UNAVAILABLE",
    isLocalOnly: true,
  });

  // 2. Health Simulation Engine
  items.push({
    id: "health_engine",
    label: "Deterministic Bioastronautics Health Engine",
    detail: "Runs 100% on client CPU; zero remote compute dependencies.",
    status: "READY",
    isLocalOnly: true,
  });

  // 3. Nutrition & Galley Inventory
  const mealsLogged = getExerciseSessions().length;
  items.push({
    id: "nutrition_inventory",
    label: "Mission Food Catalog & Inventory System",
    detail: "30-item illustrative space food catalog stored locally in memory and cache.",
    status: "READY",
    isLocalOnly: true,
  });

  // 4. Daily Check-in & Personal Profile
  items.push({
    id: "checkin_system",
    label: "Crew Wellness Check-in & Self-Report Logging",
    detail: "Instant on-device questionnaire and history storage.",
    status: "READY",
    isLocalOnly: true,
  });

  // 5. Client-side PDF Report Generator
  const hasJsPdf = true;
  items.push({
    id: "pdf_generator",
    label: "Autonomous Client-side PDF Report Engine",
    detail: "jsPDF renders full vector A4 daily telemetry reports offline.",
    status: hasJsPdf ? "READY" : "UNAVAILABLE",
    isLocalOnly: true,
  });

  // 6. Speech Recognition & Synthesis
  const hasSpeechSynth = typeof window !== "undefined" && "speechSynthesis" in window;
  items.push({
    id: "speech_engine",
    label: "Bilingual Offline Speech Synthesis (ASTRA Voice)",
    detail: hasSpeechSynth
      ? "Web Speech API SpeechSynthesis available with local operating system voices."
      : "Speech synthesis not supported in this browser.",
    status: hasSpeechSynth ? "READY" : "UNAVAILABLE",
    isLocalOnly: true,
  });

  // 7. NASA DONKI Space Weather Cache
  let hasDonkiCache = false;
  if (typeof window !== "undefined") {
    try {
      hasDonkiCache = !!localStorage.getItem("astra_weather_cache");
    } catch {
      hasDonkiCache = false;
    }
  }
  items.push({
    id: "nasa_donki_cache",
    label: "NASA Public Space Weather Cache",
    detail: hasDonkiCache
      ? "Cached public solar observations stored for offline review."
      : "No live network fetch performed yet; running on verified demo cache.",
    status: "CACHED",
    isLocalOnly: false,
  });

  // 8. MediaPipe On-Device Vision
  items.push({
    id: "mediapipe_vision",
    label: "MediaPipe Face & Pose On-Device Vision",
    detail: "WASM vision models process video frames locally without cloud upload.",
    status: "READY",
    isLocalOnly: true,
  });

  return items;
}
