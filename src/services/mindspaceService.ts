/**
 * ASTRA MindSpace — Service Engine
 * Manages voluntary mental wellness check-ins, stress recovery logs,
 * private reflection journals, teamwork debriefs, cognitive focus tasks,
 * personalized suggestion heuristics, and synthetic demonstration scenarios.
 *
 * SCIENTIFIC DISCLAIMER:
 * This software provides non-clinical educational coping tools and voluntary
 * self-reflection logs. It does NOT diagnose, treat, prevent, or cure psychiatric
 * disorders, nor does it clinically measure stress or verify psychological fitness.
 */

export type MoodState = "great" | "good" | "neutral" | "low" | "stressed";
export type EnergyLevel = "high" | "moderate" | "low" | "exhausted";
export type SleepQuality = "restful" | "fragmented" | "delayed" | "insufficient";
export type FocusLevel = "sharp" | "manageable" | "scattered" | "difficult";
export type CrewConnection = "strong" | "good" | "moderate" | "isolated" | "tension" | "strained";

export interface MentalCheckinEntry {
  id: string;
  missionDay: number;
  timestamp: string; // ISO
  dateFormatted: string; // e.g. "Day 147"
  timeFormatted: string; // e.g. "08:30 UTC"
  mood: MoodState;
  stress: number; // 0 - 10
  energy: EnergyLevel;
  sleep: SleepQuality;
  focus: FocusLevel;
  crewConnection: CrewConnection;
  privateNote?: string;
  provenance: "SELF-REPORTED" | "SIMULATED";
}

export type RecoveryActivityType =
  | "breathing"
  | "guided_breathing"
  | "grounding"
  | "grounding_54321"
  | "reset"
  | "mental_reset"
  | "earth"
  | "earth_connection"
  | "focus_session";

export interface RecoverySessionRecord {
  id: string;
  activityType: RecoveryActivityType;
  title: string;
  durationSeconds: number;
  timestamp: string;
  beforeStress?: number;
  afterStress?: number;
  stressDelta?: number; // afterStress - beforeStress
  notes?: string;
  provenance?: "SELF-REPORTED" | "SIMULATED";
}

export interface JournalEntry {
  id: string;
  missionDay?: number;
  timestamp: string;
  title: string;
  content: string;
  promptUsed?: string;
  prompt?: string;
  moodTag?: MoodState;
  mood?: MoodState;
  updatedAt?: string;
}

export interface DebriefRecord {
  id: string;
  missionDay: number;
  timestamp: string;
  shift?: string;
  wentWell?: string;
  difficulties?: string;
  needsClarification?: string;
  nextSteps?: string;
  topic?: string;
  strengths?: string;
  bottlenecks?: string;
  adjustments?: string;
  actionItems?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  role?: string;
  subtasks?: { id: string; text: string; done: boolean }[];
}

export interface ReactionRecord {
  id: string;
  timestamp: string;
  trials: number[]; // ms
  averageMs: number;
  medianMs: number;
  earlyClicks: number;
  missionDay?: number;
  trialTimesMs?: number[];
  avgMs?: number;
}

export interface WellnessSuggestion {
  id: string;
  title: string;
  category: "breathing" | "rest" | "harmony" | "focus" | "support";
  reason: string;
  actionLabel: string;
  actionTab: "recovery" | "harmony" | "focus" | "journal" | "support";
  priority: "high" | "medium" | "low";
}

export type DemoScenarioKey =
  | "NONE"
  | "NORMAL"
  | "ELEVATED_STRESS"
  | "CREW_CONFLICT"
  | "FATIGUE"
  | "POST_ACTIVITY";

// Storage Keys
const STORAGE_KEYS = {
  CHECKINS: "astra_mindspace_checkins",
  RECOVERY_LOGS: "astra_mindspace_recovery_logs",
  JOURNAL: "astra_mindspace_journal",
  DEBRIEFS: "astra_mindspace_debriefs",
  TASKS: "astra_mindspace_tasks",
  REACTIONS: "astra_mindspace_reactions",
  DEMO_MODE: "astra_mindspace_demo_mode",
  DEMO_SCENARIO: "astra_mindspace_demo_scenario",
};

// Safe Local Storage Helpers
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage quota or privacy mode restriction
  }
}

// ----------------------------------------------------
// DEMONSTRATION SCENARIOS (SYNTHETIC DATA)
// ----------------------------------------------------

export const DEMO_CHECKINS_NORMAL: MentalCheckinEntry[] = [
  {
    id: "demo-chk-1",
    missionDay: 141,
    timestamp: "2026-11-09T08:00:00Z",
    dateFormatted: "Day 141",
    timeFormatted: "08:00 UTC",
    mood: "good",
    stress: 3,
    energy: "high",
    sleep: "restful",
    focus: "sharp",
    crewConnection: "strong",
    privateNote: "Smooth morning maintenance shift.",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-2",
    missionDay: 142,
    timestamp: "2026-11-10T08:15:00Z",
    dateFormatted: "Day 142",
    timeFormatted: "08:15 UTC",
    mood: "great",
    stress: 2,
    energy: "high",
    sleep: "restful",
    focus: "sharp",
    crewConnection: "strong",
    privateNote: "Great family comm pass yesterday evening.",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-3",
    missionDay: 143,
    timestamp: "2026-11-11T08:30:00Z",
    dateFormatted: "Day 143",
    timeFormatted: "08:30 UTC",
    mood: "good",
    stress: 3,
    energy: "moderate",
    sleep: "restful",
    focus: "manageable",
    crewConnection: "good",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-4",
    missionDay: 144,
    timestamp: "2026-11-12T07:45:00Z",
    dateFormatted: "Day 144",
    timeFormatted: "07:45 UTC",
    mood: "good",
    stress: 4,
    energy: "moderate",
    sleep: "delayed",
    focus: "manageable",
    crewConnection: "good",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-5",
    missionDay: 145,
    timestamp: "2026-11-13T08:00:00Z",
    dateFormatted: "Day 145",
    timeFormatted: "08:00 UTC",
    mood: "good",
    stress: 3,
    energy: "high",
    sleep: "restful",
    focus: "sharp",
    crewConnection: "strong",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-6",
    missionDay: 146,
    timestamp: "2026-11-14T08:10:00Z",
    dateFormatted: "Day 146",
    timeFormatted: "08:10 UTC",
    mood: "great",
    stress: 2,
    energy: "high",
    sleep: "restful",
    focus: "sharp",
    crewConnection: "strong",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-7",
    missionDay: 147,
    timestamp: "2026-11-15T08:00:00Z",
    dateFormatted: "Day 147",
    timeFormatted: "08:00 UTC",
    mood: "good",
    stress: 3,
    energy: "moderate",
    sleep: "restful",
    focus: "sharp",
    crewConnection: "strong",
    privateNote: "Current mission shift starting with steady focus.",
    provenance: "SIMULATED",
  },
];

export const DEMO_CHECKINS_STRESSED: MentalCheckinEntry[] = [
  ...DEMO_CHECKINS_NORMAL.slice(0, 4),
  {
    id: "demo-chk-s5",
    missionDay: 145,
    timestamp: "2026-11-13T08:00:00Z",
    dateFormatted: "Day 145",
    timeFormatted: "08:00 UTC",
    mood: "neutral",
    stress: 6,
    energy: "moderate",
    sleep: "fragmented",
    focus: "manageable",
    crewConnection: "good",
    privateNote: "Workload increased due to payload troubleshooting.",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-s6",
    missionDay: 146,
    timestamp: "2026-11-14T08:10:00Z",
    dateFormatted: "Day 146",
    timeFormatted: "08:10 UTC",
    mood: "low",
    stress: 7,
    energy: "low",
    sleep: "delayed",
    focus: "scattered",
    crewConnection: "isolated",
    privateNote: "Felt mentally drained after consecutive high-tempo shifts.",
    provenance: "SIMULATED",
  },
  {
    id: "demo-chk-s7",
    missionDay: 147,
    timestamp: "2026-11-15T08:00:00Z",
    dateFormatted: "Day 147",
    timeFormatted: "08:00 UTC",
    mood: "stressed",
    stress: 8,
    energy: "exhausted",
    sleep: "insufficient",
    focus: "difficult",
    crewConnection: "tension",
    privateNote: "Elevated stress self-reported. Recovery activity recommended.",
    provenance: "SIMULATED",
  },
];

export const DEMO_RECOVERY_LOGS: RecoverySessionRecord[] = [
  {
    id: "demo-rec-1",
    activityType: "guided_breathing",
    title: "Guided Resonant Breathing (3 Min)",
    durationSeconds: 180,
    timestamp: "2026-11-13T19:30:00Z",
    beforeStress: 7,
    afterStress: 4,
    stressDelta: -3,
    provenance: "SIMULATED",
  },
  {
    id: "demo-rec-2",
    activityType: "earth_connection",
    title: "Orbital Earth Viewing Focus",
    durationSeconds: 300,
    timestamp: "2026-11-14T20:15:00Z",
    beforeStress: 6,
    afterStress: 3,
    stressDelta: -3,
    provenance: "SIMULATED",
  },
  {
    id: "demo-rec-3",
    activityType: "grounding_54321",
    title: "Spacecraft 5-4-3-2-1 Sensory Grounding",
    durationSeconds: 120,
    timestamp: "2026-11-15T09:00:00Z",
    beforeStress: 8,
    afterStress: 5,
    stressDelta: -3,
    provenance: "SIMULATED",
  },
];

export const DEMO_SCENARIOS: Record<
  DemoScenarioKey,
  { name: string; description: string; checkins: MentalCheckinEntry[] }
> = {
  NONE: {
    name: "Realistic User Data (Local)",
    description: "Operates exclusively with real local check-ins entered by the astronaut.",
    checkins: [],
  },
  NORMAL: {
    name: "Normal Flight",
    description: "Nominal sleep, baseline stress (2-4/10), high cohesion, smooth mission operations.",
    checkins: DEMO_CHECKINS_NORMAL,
  },
  ELEVATED_STRESS: {
    name: "Elevated Stress",
    description: "High-workload anomaly simulation, stress elevated to 7-8/10, reduced sleep.",
    checkins: DEMO_CHECKINS_STRESSED,
  },
  CREW_CONFLICT: {
    name: "Crew Conflict",
    description: "Interpersonal friction and communication misalignment during EVA prep.",
    checkins: DEMO_CHECKINS_STRESSED,
  },
  FATIGUE: {
    name: "Fatigue & Focus",
    description: "Cumulative circadian disruption and delayed sleep cycles with lower focus.",
    checkins: DEMO_CHECKINS_STRESSED,
  },
  POST_ACTIVITY: {
    name: "Post-Activity Recovery",
    description: "Successful recovery following guided breathing and perspective reset.",
    checkins: DEMO_CHECKINS_NORMAL,
  },
};

export const DEMO_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "demo-jnl-1",
    missionDay: 144,
    timestamp: "2026-11-12T21:00:00Z",
    title: "Reflections on Cupola Observation",
    content:
      "Spent twenty quiet minutes watching the terminator line sweep across the Pacific. Seeing the thin blue atmospheric ribbon reminds me of why we train so hard. Team felt synchronized today.",
    promptUsed: "What brought you perspective today?",
    moodTag: "great",
  },
  {
    id: "demo-jnl-2",
    missionDay: 146,
    timestamp: "2026-11-14T21:30:00Z",
    title: "Decompressing After Long Hardware Swap",
    content:
      "The carbon scrubber valve replacement took longer than planned. My shoulders were tight from bracing in foot restraints. Doing three minutes of breathing helped reset my attention before sleep.",
    promptUsed: "What challenged you and how did you adapt?",
    moodTag: "neutral",
  },
];

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Inspect Galley PWD Water Sampling Port",
    completed: true,
    priority: "high",
    role: "Flight Engineer",
    subtasks: [
      { id: "st-1", text: "Verify line depressurization", done: true },
      { id: "st-2", text: "Collect 250mL in sterile syringe", done: true },
      { id: "st-3", text: "Run in-line spectrophotometry", done: true },
    ],
  },
  {
    id: "task-2",
    title: "Conduct 45-Min ARED Countermeasure Workout",
    completed: false,
    priority: "high",
    role: "Crew Member",
    subtasks: [
      { id: "st-4", text: "Calibrate vacuum cylinder load", done: true },
      { id: "st-5", text: "Complete 4 sets deadlift", done: false },
      { id: "st-6", text: "Log session heart rate in ASTRA", done: false },
    ],
  },
  {
    id: "task-3",
    title: "Evening Crew Coordination & Deconfliction",
    completed: false,
    priority: "medium",
    role: "All Crew",
    subtasks: [
      { id: "st-7", text: "Review tomorrow's comm blackout intervals", done: false },
      { id: "st-8", text: "Align sleep compartment quiet hours", done: false },
    ],
  },
];

// ----------------------------------------------------
// CORE SERVICE METHODS
// ----------------------------------------------------

export function isDemoModeActive(): boolean {
  return readStorage<boolean>(STORAGE_KEYS.DEMO_MODE, false);
}

export function setDemoModeActive(active: boolean): void {
  writeStorage(STORAGE_KEYS.DEMO_MODE, active);
}

export function getActiveDemoScenario(): DemoScenarioKey {
  return readStorage<DemoScenarioKey>(STORAGE_KEYS.DEMO_SCENARIO, "NONE");
}

export function setActiveDemoScenario(scenario: DemoScenarioKey): void {
  writeStorage(STORAGE_KEYS.DEMO_SCENARIO, scenario);
  if (scenario === "NONE") {
    setDemoModeActive(false);
  } else {
    setDemoModeActive(true);
  }
}

// Check-ins Management
export function getMentalCheckins(): MentalCheckinEntry[] {
  const isDemo = isDemoModeActive();
  const scenario = getActiveDemoScenario();

  if (isDemo) {
    if (scenario === "ELEVATED_STRESS" || scenario === "CREW_CONFLICT") {
      return DEMO_CHECKINS_STRESSED;
    }
    return DEMO_CHECKINS_NORMAL;
  }

  return readStorage<MentalCheckinEntry[]>(STORAGE_KEYS.CHECKINS, []);
}

export function saveMentalCheckin(
  entry: Omit<MentalCheckinEntry, "id" | "timestamp" | "dateFormatted" | "timeFormatted" | "provenance"> & {
    provenance?: "SELF-REPORTED" | "SIMULATED";
  },
): MentalCheckinEntry {
  const all = readStorage<MentalCheckinEntry[]>(STORAGE_KEYS.CHECKINS, []);
  const now = new Date();
  const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const newEntry: MentalCheckinEntry = {
    ...entry,
    id: `mchk-${Date.now()}`,
    timestamp: now.toISOString(),
    dateFormatted: `Day ${entry.missionDay}`,
    timeFormatted,
    provenance: entry.provenance ?? "SELF-REPORTED",
  };

  // Replace today's checkin if same day exists, or prepend
  const existingIdx = all.findIndex((c) => c.missionDay === entry.missionDay);
  if (existingIdx >= 0) {
    all[existingIdx] = newEntry;
  } else {
    all.unshift(newEntry);
  }

  writeStorage(STORAGE_KEYS.CHECKINS, all);
  return newEntry;
}

export function getTodayCheckin(missionDay = 147): MentalCheckinEntry | undefined {
  const checkins = getMentalCheckins();
  return checkins.find((c) => c.missionDay === missionDay);
}

// Recovery Log Management
export function getRecoveryLogs(): RecoverySessionRecord[] {
  const isDemo = isDemoModeActive();
  if (isDemo) {
    return DEMO_RECOVERY_LOGS;
  }
  return readStorage<RecoverySessionRecord[]>(STORAGE_KEYS.RECOVERY_LOGS, []);
}

export function saveRecoverySession(
  session: Omit<RecoverySessionRecord, "id" | "timestamp" | "provenance">,
): RecoverySessionRecord {
  const all = readStorage<RecoverySessionRecord[]>(STORAGE_KEYS.RECOVERY_LOGS, []);
  const computedDelta =
    session.stressDelta !== undefined
      ? session.stressDelta
      : session.beforeStress !== undefined && session.afterStress !== undefined
        ? session.afterStress - session.beforeStress
        : undefined;

  const newSession: RecoverySessionRecord = {
    ...session,
    stressDelta: computedDelta,
    id: `rec-${Date.now()}`,
    timestamp: new Date().toISOString(),
    provenance: "SELF-REPORTED",
  };
  all.unshift(newSession);
  writeStorage(STORAGE_KEYS.RECOVERY_LOGS, all);
  return newSession;
}

// Journal Management
export function getJournalEntries(): JournalEntry[] {
  const isDemo = isDemoModeActive();
  if (isDemo) {
    return DEMO_JOURNAL_ENTRIES;
  }
  return readStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
}

export function saveJournalEntry(
  entry: Omit<JournalEntry, "id" | "timestamp"> & { id?: string },
): JournalEntry {
  const all = readStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
  const now = new Date().toISOString();

  if (entry.id) {
    // Edit existing
    const idx = all.findIndex((j) => j.id === entry.id);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        ...entry,
        id: entry.id,
        updatedAt: now,
      };
      writeStorage(STORAGE_KEYS.JOURNAL, all);
      return all[idx];
    }
  }

  // Create new
  const created: JournalEntry = {
    ...entry,
    id: `jnl-${Date.now()}`,
    timestamp: now,
  };
  all.unshift(created);
  writeStorage(STORAGE_KEYS.JOURNAL, all);
  return created;
}

export function deleteJournalEntry(id: string): void {
  const all = readStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
  const filtered = all.filter((j) => j.id !== id);
  writeStorage(STORAGE_KEYS.JOURNAL, filtered);
}

export function clearAllJournalEntries(): void {
  writeStorage(STORAGE_KEYS.JOURNAL, []);
}

// Debrief Management
export function getDebriefRecords(): DebriefRecord[] {
  return readStorage<DebriefRecord[]>(STORAGE_KEYS.DEBRIEFS, []);
}

export function saveDebriefRecord(
  debrief: Omit<DebriefRecord, "id" | "timestamp">,
): DebriefRecord {
  const all = readStorage<DebriefRecord[]>(STORAGE_KEYS.DEBRIEFS, []);
  const record: DebriefRecord = {
    ...debrief,
    id: `dbf-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  all.unshift(record);
  writeStorage(STORAGE_KEYS.DEBRIEFS, all);
  return record;
}

// Tasks Management
export function getTaskItems(): TaskItem[] {
  return readStorage<TaskItem[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
}

export function saveTaskItems(tasks: TaskItem[]): void {
  writeStorage(STORAGE_KEYS.TASKS, tasks);
}

// Reaction Practice Management
export function getReactionRecords(): ReactionRecord[] {
  return readStorage<ReactionRecord[]>(STORAGE_KEYS.REACTIONS, []);
}

export function saveReactionRecord(
  record: Partial<ReactionRecord> & { earlyClicks: number; trials?: number[]; trialTimesMs?: number[] },
): ReactionRecord {
  const all = readStorage<ReactionRecord[]>(STORAGE_KEYS.REACTIONS, []);
  const trialsList = record.trials ?? record.trialTimesMs ?? [];
  const sorted = [...trialsList].sort((a, b) => a - b);
  const calculatedMedian =
    sorted.length === 0
      ? 0
      : sorted.length % 2 === 1
        ? sorted[Math.floor(sorted.length / 2)]
        : Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2);

  const calculatedAvg =
    trialsList.length === 0
      ? 0
      : Math.round(trialsList.reduce((acc, v) => acc + v, 0) / trialsList.length);

  const item: ReactionRecord = {
    id: `rct-${Date.now()}`,
    timestamp: new Date().toISOString(),
    trials: trialsList,
    trialTimesMs: trialsList,
    earlyClicks: record.earlyClicks ?? 0,
    averageMs: record.averageMs ?? record.avgMs ?? calculatedAvg,
    medianMs: record.medianMs ?? calculatedMedian,
    avgMs: record.avgMs ?? record.averageMs ?? calculatedAvg,
    missionDay: record.missionDay ?? 147,
  };
  all.unshift(item);
  writeStorage(STORAGE_KEYS.REACTIONS, all);
  return item;
}

// ----------------------------------------------------
// PERSONAL BASELINE & SUGGESTION ENGINE
// ----------------------------------------------------

export interface PersonalBaselineStats {
  observationCount: number;
  avgStress: number | null;
  avgEnergyScore: number | null;
  avgFocusScore: number | null;
  hasSufficientData: boolean; // Needs >= 3 entries
}

export function computePersonalBaseline(checkins = getMentalCheckins()): PersonalBaselineStats {
  const count = checkins.length;
  if (count < 3) {
    return {
      observationCount: count,
      avgStress: null,
      avgEnergyScore: null,
      avgFocusScore: null,
      hasSufficientData: false,
    };
  }

  const sumStress = checkins.reduce((acc, c) => acc + c.stress, 0);
  const avgStress = Math.round((sumStress / count) * 10) / 10;

  const energyMap: Record<EnergyLevel, number> = { exhausted: 1, low: 2, moderate: 3, high: 4 };
  const sumEnergy = checkins.reduce((acc, c) => acc + (energyMap[c.energy] || 3), 0);
  const avgEnergyScore = Math.round((sumEnergy / count) * 10) / 10;

  const focusMap: Record<FocusLevel, number> = { difficult: 1, scattered: 2, manageable: 3, sharp: 4 };
  const sumFocus = checkins.reduce((acc, c) => acc + (focusMap[c.focus] || 3), 0);
  const avgFocusScore = Math.round((sumFocus / count) * 10) / 10;

  return {
    observationCount: count,
    avgStress,
    avgEnergyScore,
    avgFocusScore,
    hasSufficientData: true,
  };
}

/**
 * Transparent rule-based suggestions.
 * Explicitly states WHY each activity was suggested.
 */
export function generateWellnessSuggestions(
  todayCheckin?: MentalCheckinEntry,
  baseline?: PersonalBaselineStats,
): WellnessSuggestion[] {
  const suggestions: WellnessSuggestion[] = [];

  if (!todayCheckin) {
    suggestions.push({
      id: "sug-checkin",
      title: "Complete 60-Second Daily Check-in",
      category: "rest",
      reason: "No entry recorded for today. Daily self-reflection helps track patterns over time.",
      actionLabel: "Start Check-in",
      actionTab: "recovery",
      priority: "high",
    });
    return suggestions;
  }

  // High Stress Heuristic
  if (todayCheckin.stress >= 6) {
    suggestions.push({
      id: "sug-breathing",
      title: "Guided Resonant Breathing (3 Min)",
      category: "breathing",
      reason: `You reported elevated stress (${todayCheckin.stress}/10 today). Slow paced respiration supports autonomic regulation without demanding physical strain.`,
      actionLabel: "Open Breathing Guide",
      actionTab: "recovery",
      priority: "high",
    });
  }

  // Poor Sleep Heuristic
  if (todayCheckin.sleep === "fragmented" || todayCheckin.sleep === "insufficient") {
    suggestions.push({
      id: "sug-sleep",
      title: "Shift-Break Reset & Rest Protocol",
      category: "rest",
      reason: `You reported ${todayCheckin.sleep === "fragmented" ? "fragmented" : "insufficient"} sleep. A 5-minute quiet mental reset helps mitigate shift fatigue before critical procedures.`,
      actionLabel: "Try Mental Reset",
      actionTab: "recovery",
      priority: "medium",
    });
  }

  // Crew Friction Heuristic
  if (
    todayCheckin.crewConnection === "tension" ||
    todayCheckin.crewConnection === "isolated" ||
    (todayCheckin.crewConnection as string) === "strained"
  ) {
    suggestions.push({
      id: "sug-harmony",
      title: "Crew Harmony & Debrief Tool",
      category: "harmony",
      reason: `You indicated team ${todayCheckin.crewConnection === "tension" ? "tension" : todayCheckin.crewConnection === "isolated" ? "isolation" : "strain"}. Reviewing structured non-accusatory debrief steps supports mission collaboration.`,
      actionLabel: "Review Crew Harmony",
      actionTab: "harmony",
      priority: "medium",
    });
  }

  // Scattered Focus Heuristic
  if (todayCheckin.focus === "scattered" || todayCheckin.focus === "difficult") {
    suggestions.push({
      id: "sug-focus",
      title: "Task Breakdown & Timed Focus",
      category: "focus",
      reason: `You noted difficulty focusing today. Deconstructing complex operational steps reduces cognitive overhead and decision fatigue.`,
      actionLabel: "Open Task Breakdown",
      actionTab: "focus",
      priority: "medium",
    });
  }

  // Escalation Recommendation
  if (todayCheckin.stress >= 9) {
    suggestions.push({
      id: "sug-support",
      title: "Confidential Flight Surgeon / BMed Consultation",
      category: "support",
      reason: "Your self-reported stress is in the high operational range. Authorized mission behavioral health professionals are available for private consultations.",
      actionLabel: "View Support Pathways",
      actionTab: "support",
      priority: "high",
    });
  }

  // If no high-priority concerns, provide proactive wellness reinforcement
  if (suggestions.length === 0) {
    suggestions.push({
      id: "sug-calm",
      title: "Earth Connection Experience",
      category: "breathing",
      reason: "Your reported vitals and wellbeing are steady. A 3-minute orbital overview pause provides cognitive relaxation and maintains perspective.",
      actionLabel: "View Earth Focus",
      actionTab: "recovery",
      priority: "low",
    });
  }

  return suggestions;
}

// ----------------------------------------------------
// OFFLINE WEB AUDIO CHIMES (100% Zero External Files)
// ----------------------------------------------------

export function playSoothingChime(frequency = 528, durationSec = 1.2): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);

    // Smooth soft bell envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec);
  } catch {
    // AudioContext blocked or unsupported
  }
}
