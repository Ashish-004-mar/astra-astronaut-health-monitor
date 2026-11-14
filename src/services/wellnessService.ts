/**
 * ASTRA - Dedicated Wellness Check-in Database & Analytics Service
 * Provides persistent local database storage, bioastronautics readiness scoring,
 * and historical retrieval for the Quick 2-Minute Crew Wellness Check protocol.
 */

export interface WellnessAnswers {
  Sleep: string;
  Energy: string;
  Stress: string;
  Mood: string;
  "Physical discomfort": string;
  Notes?: string;
  [key: string]: string | undefined;
}

export type ReadinessStatus = "OPTIMAL" | "NOMINAL" | "ATTENTION";

export interface WellnessCheckinRecord {
  id: string;
  missionDay: number;
  date: string;
  timeFormatted: string;
  timestamp: string;
  crewMember: string;
  station: string;
  answers: WellnessAnswers;
  score: number; // 0 - 100
  readinessStatus: ReadinessStatus;
  statusColor: string;
  summary: string;
  countermeasure: string;
  provenance: "SELF-REPORTED";
}

export interface WellnessStats {
  totalCount: number;
  averageScore: number;
  latestScore: number;
  latestStatus: ReadinessStatus;
  optimalCount: number;
  nominalCount: number;
  attentionCount: number;
}

const STORAGE_KEY = "astra_wellness_records_v1";

/**
 * Calculates Bioastronautics Readiness Score (0-100) and actionable countermeasure
 * based on NASA Human Research Program operational wellness indicators.
 */
export function calculateWellnessMetrics(answers: Record<string, string | undefined>): {
  score: number;
  status: ReadinessStatus;
  statusColor: string;
  summary: string;
  countermeasure: string;
} {
  let score = 100;

  // 1. Sleep: Good (0), Fair (-8), Poor (-18)
  const sleep = answers["Sleep"] ?? "Good";
  if (sleep === "Fair") score -= 8;
  else if (sleep === "Poor") score -= 18;

  // 2. Energy: High (0), Normal (-5), Low (-15)
  const energy = answers["Energy"] ?? "Normal";
  if (energy === "Normal") score -= 5;
  else if (energy === "Low") score -= 15;

  // 3. Stress: Low (0), Medium (-8), High (-18)
  const stress = answers["Stress"] ?? "Low";
  if (stress === "Medium") score -= 8;
  else if (stress === "High") score -= 18;

  // 4. Mood: Good (0), Okay (-6), Low (-14)
  const mood = answers["Mood"] ?? "Good";
  if (mood === "Okay") score -= 6;
  else if (mood === "Low") score -= 14;

  // 5. Physical Discomfort: None (0), Mild (-8), Significant (-20)
  const discomfort = answers["Physical discomfort"] ?? "None";
  if (discomfort === "Mild") score -= 8;
  else if (discomfort === "Significant") score -= 20;

  score = Math.max(30, Math.min(100, score));

  let status: ReadinessStatus = "OPTIMAL";
  let statusColor = "#10b981"; // Emerald
  let summary = "Crew member demonstrates excellent physical endurance, stable sleep circadian alignment, and nominal operational readiness.";
  let countermeasure = "Maintain nominal flight profile, standard CEVIS aerobic workout, and scheduled circadian rest intervals.";

  if (score < 70) {
    status = "ATTENTION";
    statusColor = "#f59e0b"; // Amber
    summary = "Elevated operational strain and/or physiological discomfort flags detected. Mitigation recommended.";
    
    // Tailored countermeasure
    if (discomfort === "Significant" || discomfort === "Mild") {
      countermeasure = "Musculoskeletal decompression: Perform 15-min spinal stretching & targeted thoracic foam roll. Review EVA harness ergonomics.";
    } else if (sleep === "Poor") {
      countermeasure = "Circadian adjustment: Initiate 45-minute cabin light dimming protocol prior to sleep window; verify crew quarters noise-canceling headsets.";
    } else if (stress === "High") {
      countermeasure = "Cognitive workload rebalancing: Request 30-min schedule pacing pause from Flight Director; engage in guided autogenic relaxation.";
    } else {
      countermeasure = "Operational pacing protocol: Review workload timeline, hydrate with 500ml electrolyte solution, and rest 20 minutes.";
    }
  } else if (score < 85) {
    status = "NOMINAL";
    statusColor = "#0ea5e9"; // Cyan
    summary = "Crew wellness metrics are within nominal operational parameters. Minor fatigue or moderate task load noted.";
    
    if (sleep === "Fair") {
      countermeasure = "Ensure sleep cabin temperature is maintained between 18-20°C and minimize screen use 30 minutes before sleep cycle.";
    } else if (energy === "Normal" && stress === "Medium") {
      countermeasure = "Hydrate with nutrient-rich electrolyte ration; take a 10-minute micro-break between orbital maintenance tasks.";
    } else {
      countermeasure = "Continue scheduled 2.5-hour countermeasure physical exercise block (ARED / T2 Treadmill).";
    }
  }

  return { score, status, statusColor, summary, countermeasure };
}

/**
 * Seed initial baseline historical records so the database is pre-populated
 * for demonstration upon initial launch.
 */
function getInitialSeedRecords(): WellnessCheckinRecord[] {
  return [
    {
      id: "chk-1731580800000",
      missionDay: 147,
      date: "2026-11-14",
      timeFormatted: "07:15 UTC",
      timestamp: "2026-11-14T07:15:00.000Z",
      crewMember: "Commander Alex Mercer (AC-01)",
      station: "LEO Habitat Module ASTRA",
      answers: {
        Sleep: "Good",
        Energy: "High",
        Stress: "Low",
        Mood: "Good",
        "Physical discomfort": "None",
        Notes: "Pre-shift readiness check nominal. Rested soundly in crew quarters.",
      },
      score: 95,
      readinessStatus: "OPTIMAL",
      statusColor: "#10b981",
      summary: "Crew member demonstrates excellent physical endurance, stable sleep circadian alignment, and nominal operational readiness.",
      countermeasure: "Maintain nominal flight profile, standard CEVIS aerobic workout, and scheduled circadian rest intervals.",
      provenance: "SELF-REPORTED",
    },
    {
      id: "chk-1731494400000",
      missionDay: 146,
      date: "2026-11-13",
      timeFormatted: "08:30 UTC",
      timestamp: "2026-11-13T08:30:00.000Z",
      crewMember: "Commander Alex Mercer (AC-01)",
      station: "LEO Habitat Module ASTRA",
      answers: {
        Sleep: "Fair",
        Energy: "Normal",
        Stress: "Medium",
        Mood: "Okay",
        "Physical discomfort": "Mild",
        Notes: "Mild lumbar soreness following prolonged ARED squat set; applied heat pack.",
      },
      score: 73,
      readinessStatus: "NOMINAL",
      statusColor: "#0ea5e9",
      summary: "Crew wellness metrics are within nominal operational parameters. Minor fatigue or moderate task load noted.",
      countermeasure: "Musculoskeletal decompression: Perform 15-min spinal stretching & targeted thoracic foam roll. Hydrate with 500ml electrolyte solution.",
      provenance: "SELF-REPORTED",
    },
    {
      id: "chk-1731408000000",
      missionDay: 145,
      date: "2026-11-12",
      timeFormatted: "07:45 UTC",
      timestamp: "2026-11-12T07:45:00.000Z",
      crewMember: "Commander Alex Mercer (AC-01)",
      station: "LEO Habitat Module ASTRA",
      answers: {
        Sleep: "Good",
        Energy: "Normal",
        Stress: "Low",
        Mood: "Good",
        "Physical discomfort": "None",
        Notes: "Post-EVA debrief complete. Morale high across crew complement.",
      },
      score: 95,
      readinessStatus: "OPTIMAL",
      statusColor: "#10b981",
      summary: "Crew member demonstrates excellent physical endurance, stable sleep circadian alignment, and nominal operational readiness.",
      countermeasure: "Maintain nominal flight profile, standard CEVIS aerobic workout, and scheduled circadian rest intervals.",
      provenance: "SELF-REPORTED",
    },
  ];
}

/**
 * Retrieves all stored wellness check-in records from local storage.
 * Seeds initial baseline history if empty.
 */
export function getWellnessRecords(): WellnessCheckinRecord[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return getInitialSeedRecords();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getInitialSeedRecords();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const seed = getInitialSeedRecords();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return getInitialSeedRecords();
  }
}

/**
 * Saves a new wellness check-in record into the persistent database.
 */
export function saveWellnessRecord(params: {
  answers: Record<string, string>;
  notes?: string;
  missionDay?: number;
  date?: string;
  crewMember?: string;
  station?: string;
}): WellnessCheckinRecord {
  const records = getWellnessRecords();
  const now = new Date();
  
  const missionDay = params.missionDay ?? 147;
  const date =
    params.date ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins = String(now.getUTCMinutes()).padStart(2, "0");
  const timeFormatted = `${hours}:${mins} UTC`;

  const cleanAnswers: WellnessAnswers = {
    Sleep: params.answers["Sleep"] ?? "Good",
    Energy: params.answers["Energy"] ?? "Normal",
    Stress: params.answers["Stress"] ?? "Low",
    Mood: params.answers["Mood"] ?? "Good",
    "Physical discomfort": params.answers["Physical discomfort"] ?? "None",
  };

  const finalNotes = params.notes?.trim() || params.answers["Notes"]?.trim();
  if (finalNotes) {
    cleanAnswers.Notes = finalNotes;
  }

  const { score, status, statusColor, summary, countermeasure } = calculateWellnessMetrics(cleanAnswers);

  const newRecord: WellnessCheckinRecord = {
    id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    missionDay,
    date,
    timeFormatted,
    timestamp: now.toISOString(),
    crewMember: params.crewMember ?? "Commander Alex Mercer (AC-01)",
    station: params.station ?? "LEO Habitat Module ASTRA",
    answers: cleanAnswers,
    score,
    readinessStatus: status,
    statusColor,
    summary,
    countermeasure,
    provenance: "SELF-REPORTED",
  };

  const updated = [newRecord, ...records];
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return newRecord;
}

/**
 * Deletes a wellness check-in record by its ID.
 */
export function deleteWellnessRecord(id: string): WellnessCheckinRecord[] {
  const records = getWellnessRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
  return filtered;
}

/**
 * Clears all wellness records.
 */
export function clearAllWellnessRecords(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

/**
 * Resets wellness records back to the default seed history.
 */
export function resetToDefaultWellnessRecords(): WellnessCheckinRecord[] {
  const seed = getInitialSeedRecords();
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  }
  return seed;
}

/**
 * Computes summary statistics over all stored records.
 */
export function getWellnessStats(records?: WellnessCheckinRecord[]): WellnessStats {
  const list = records ?? getWellnessRecords();
  if (list.length === 0) {
    return {
      totalCount: 0,
      averageScore: 100,
      latestScore: 100,
      latestStatus: "OPTIMAL",
      optimalCount: 0,
      nominalCount: 0,
      attentionCount: 0,
    };
  }

  const totalScore = list.reduce((sum, r) => sum + r.score, 0);
  const averageScore = Math.round(totalScore / list.length);
  const latest = list[0];

  const optimalCount = list.filter((r) => r.readinessStatus === "OPTIMAL").length;
  const nominalCount = list.filter((r) => r.readinessStatus === "NOMINAL").length;
  const attentionCount = list.filter((r) => r.readinessStatus === "ATTENTION").length;

  return {
    totalCount: list.length,
    averageScore,
    latestScore: latest.score,
    latestStatus: latest.readinessStatus,
    optimalCount,
    nominalCount,
    attentionCount,
  };
}
