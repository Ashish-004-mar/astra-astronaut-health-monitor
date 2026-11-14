/**
 * ASTRA - AquaGuard Space Water Safety & Hydration Service
 * Based on NASA International Space Station (ISS) Environmental Control and Life Support System (ECLSS)
 * Water Recovery System (WRS) bioastronautics research and potable water standards.
 */

import { audioAlertService } from "./audioAlertService";

export type AquaGuardScenario = "NOMINAL" | "ELEVATED_TOC" | "MICROBIAL_FLAG";
export type MicrobialStatus = "NEGATIVE" | "TRACE" | "FLAGGED" | "PENDING";
export type WaterSafetyStatus = "NOMINAL" | "ATTENTION" | "UNVERIFIED";

export interface WaterQualitySample {
  id: string;
  missionDay: number;
  timestamp: string;
  timeFormatted: string;
  source: "Galley PWD" | "WPA Effluent" | "UPA Distillate" | "Reserve CWC-I" | "Condensate Tank";
  tocPpb: number; // NASA Potable SMCL limit: < 500 ppb
  conductivityUscm: number; // NASA limit: < 15 µS/cm at 25°C
  microbialStatus: MicrobialStatus;
  status: WaterSafetyStatus;
  statusReason: string;
  proceduralNextStep: string;
  isSimulated: boolean;
  notes?: string;
}

export interface HydrationLogEntry {
  id: string;
  missionDay: number;
  timestamp: string;
  timeFormatted: string;
  amountMl: number;
  source: string;
}

export interface WaterHistoryDataPoint {
  day: number;
  dayLabel: string;
  tocPpb: number;
  tocLimit: number;
  conductivityUscm: number;
  condLimit: number;
  microbialResult: string;
  recoveryRate: number;
}

export interface AquaGuardState {
  scenario: AquaGuardScenario;
  targetHydrationMl: number;
  samples: WaterQualitySample[];
  consumptionLogs: HydrationLogEntry[];
  recoveryEfficiencyPercent: number; // e.g. 98.4%
  lastUpdated: string;
}

const STORAGE_KEY = "astra_aquaguard_v1";

// NASA ECLSS Potable Water Standard Thresholds
export const NASA_WATER_LIMITS = {
  TOC_MAX_PPB: 500, // Total Organic Carbon Spacecraft Maximum Contaminant Level
  CONDUCTIVITY_MAX_USCM: 15.0, // Electrical conductivity at 25°C
  MICROBIAL_MAX_CFU: 1, // Colony Forming Units per 100 mL for coliform bacteria
  DEFAULT_HYDRATION_TARGET_ML: 2500,
  RECOVERY_MILESTONE_PERCENT: 98.4,
};

/**
 * Returns the 7-day historical water quality dataset for charts.
 */
export function getWaterQualityHistory(): WaterHistoryDataPoint[] {
  return [
    { day: 141, dayLabel: "Day 141", tocPpb: 215, tocLimit: 500, conductivityUscm: 1.1, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.1 },
    { day: 142, dayLabel: "Day 142", tocPpb: 230, tocLimit: 500, conductivityUscm: 1.3, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.2 },
    { day: 143, dayLabel: "Day 143", tocPpb: 265, tocLimit: 500, conductivityUscm: 1.2, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.4 },
    { day: 144, dayLabel: "Day 144", tocPpb: 240, tocLimit: 500, conductivityUscm: 1.4, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.5 },
    { day: 145, dayLabel: "Day 145", tocPpb: 285, tocLimit: 500, conductivityUscm: 1.3, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.3 },
    { day: 146, dayLabel: "Day 146", tocPpb: 290, tocLimit: 500, conductivityUscm: 1.5, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.2 },
    { day: 147, dayLabel: "Day 147", tocPpb: 240, tocLimit: 500, conductivityUscm: 1.2, condLimit: 15, microbialResult: "Negative", recoveryRate: 98.4 },
  ];
}

/**
 * Evaluates water safety status based on scientific NASA parameters.
 * RULE: Never claim water is safe solely because TOC or conductivity appears normal.
 * RULE: Treat missing, stale, or pending test results as UNVERIFIED, not safe.
 */
export function evaluateWaterSafety(
  tocPpb: number,
  conductivityUscm: number,
  microbial: MicrobialStatus,
): {
  status: WaterSafetyStatus;
  reason: string;
  nextStep: string;
} {
  // Flagged microbial test
  if (microbial === "FLAGGED") {
    return {
      status: "ATTENTION",
      reason:
        "In-flight microbial slide flagged colonies (>1 CFU/100 mL) in dispensing loop. Microbial integrity compromised.",
      nextStep:
        "QUARANTINE Galley Potable Water Dispenser (PWD) immediately. Do NOT consume. Initiate iodine biocide loop flush and draw secondary verification culture.",
    };
  }

  // Pending microbial test: treat as unverified
  if (microbial === "PENDING") {
    return {
      status: "UNVERIFIED",
      reason:
        "Microbial culture incubation is currently in progress (48h protocol). Organic indicators are active but bacterial status is pending.",
      nextStep:
        "Treat potable lines as UNVERIFIED. If consuming from Galley PWD, verify secondary iodine residual (>1.5 mg/L) or use certified reserve CWC-I pouch.",
    };
  }

  // Elevated Total Organic Carbon
  if (tocPpb > NASA_WATER_LIMITS.TOC_MAX_PPB) {
    return {
      status: "ATTENTION",
      reason: `Total Organic Carbon (${tocPpb} ppb) exceeds NASA Spacecraft Maximum Contaminant Level (<500 ppb). Potential volatile organic breakthrough in Multi-Filtration Bed.`,
      nextStep:
        "ISOLATE Galley PWD line. Switch crew to contingency water container (CWC-I). Inspect catalytic reactor operating temperature (~130°C) and replace Multi-Filtration Bed 2.",
    };
  }

  // Elevated Conductivity
  if (conductivityUscm > NASA_WATER_LIMITS.CONDUCTIVITY_MAX_USCM) {
    return {
      status: "ATTENTION",
      reason: `Electrical conductivity (${conductivityUscm} µS/cm) exceeds NASA limit (<15 µS/cm). Indicates inorganic dissolved solids breakthrough across ion-exchange resin.`,
      nextStep:
        "Check ion-exchange resin saturation level. Divert WPA product water back to waste water tank for secondary pass distillation.",
    };
  }

  // Nominal condition
  return {
    status: "NOMINAL",
    reason: `All in-line sensors within NASA SMCL envelope (TOC: ${tocPpb} ppb < 500 ppb, Conductivity: ${conductivityUscm} µS/cm < 15 µS/cm, Microbial: NEGATIVE). Note: Chemical cleanliness confirmed; maintain routine biocide check.`,
    nextStep:
      "Potable water supply nominal for rehydration and consumption. Maintain scheduled 2.5L daily hydration target.",
  };
}

/**
 * Baseline default state
 */
function getDefaultAquaGuardState(): AquaGuardState {
  const now = new Date();
  const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  return {
    scenario: "NOMINAL",
    targetHydrationMl: NASA_WATER_LIMITS.DEFAULT_HYDRATION_TARGET_ML,
    recoveryEfficiencyPercent: NASA_WATER_LIMITS.RECOVERY_MILESTONE_PERCENT,
    lastUpdated: now.toISOString(),
    samples: [
      {
        id: "wsamp-147-01",
        missionDay: 147,
        timestamp: "2026-11-14T08:30:00.000Z",
        timeFormatted: "08:30 UTC",
        source: "Galley PWD",
        tocPpb: 240,
        conductivityUscm: 1.2,
        microbialStatus: "NEGATIVE",
        status: "NOMINAL",
        statusReason: "In-line catalytic oxidation output nominal. All organic and inorganic parameters within NASA SMCL.",
        proceduralNextStep: "Nominal operational status. Normal consumption authorized.",
        isSimulated: true,
        notes: "Morning pre-exercise sampling completed at Galley PWD port.",
      },
      {
        id: "wsamp-146-02",
        missionDay: 146,
        timestamp: "2026-11-13T14:15:00.000Z",
        timeFormatted: "14:15 UTC",
        source: "WPA Effluent",
        tocPpb: 290,
        conductivityUscm: 1.5,
        microbialStatus: "NEGATIVE",
        status: "NOMINAL",
        statusReason: "WPA post-catalytic reactor effluent sampled prior to iodine biocide injection.",
        proceduralNextStep: "Nominal. Transferred to potable storage tank.",
        isSimulated: true,
        notes: "Routine daily ECLSS life-support telemetry validation.",
      },
      {
        id: "wsamp-145-01",
        missionDay: 145,
        timestamp: "2026-11-12T09:00:00.000Z",
        timeFormatted: "09:00 UTC",
        source: "Galley PWD",
        tocPpb: 285,
        conductivityUscm: 1.3,
        microbialStatus: "NEGATIVE",
        status: "NOMINAL",
        statusReason: "Galley hot and ambient ports verified post-resupply.",
        proceduralNextStep: "Nominal baseline confirmed.",
        isSimulated: true,
        notes: "Pre-EVA potable supply checkout.",
      },
    ],
    consumptionLogs: [
      { id: "wlog-1", missionDay: 147, timestamp: "2026-11-14T07:15:00.000Z", timeFormatted: "07:15 UTC", amountMl: 500, source: "Galley PWD Hot (Tea/Hydration)" },
      { id: "wlog-2", missionDay: 147, timestamp: "2026-11-14T09:45:00.000Z", timeFormatted: "09:45 UTC", amountMl: 750, source: "Galley PWD Ambient (Electrolyte Pouch)" },
      { id: "wlog-3", missionDay: 147, timestamp: "2026-11-14T13:30:00.000Z", timeFormatted: "13:30 UTC", amountMl: 500, source: "Post-Workout CEVIS Rehydration Pouch" },
    ],
  };
}

/**
 * Loads the AquaGuard state from localStorage (or seeds default).
 */
export function getAquaGuardState(): AquaGuardState {
  if (typeof window === "undefined" || !window.localStorage) {
    return getDefaultAquaGuardState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultAquaGuardState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultAquaGuardState();
  }
}

/**
 * Saves state to localStorage.
 */
function saveAquaGuardState(state: AquaGuardState): void {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

/**
 * Changes active scenario and automatically manages alert siren triggering!
 */
export function setAquaGuardScenario(scenario: AquaGuardScenario): AquaGuardState {
  const current = getAquaGuardState();
  const now = new Date();
  const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  current.scenario = scenario;
  current.lastUpdated = now.toISOString();

  if (scenario === "ELEVATED_TOC") {
    // Generate elevated TOC sample
    const evalRes = evaluateWaterSafety(620, 4.8, "NEGATIVE");
    const sample: WaterQualitySample = {
      id: `wsamp-alert-${Date.now()}`,
      missionDay: 147,
      timestamp: now.toISOString(),
      timeFormatted,
      source: "Galley PWD",
      tocPpb: 620,
      conductivityUscm: 4.8,
      microbialStatus: "NEGATIVE",
      status: evalRes.status,
      statusReason: evalRes.reason,
      proceduralNextStep: evalRes.nextStep,
      isSimulated: true,
      notes: "SIMULATED ANOMALY: Volatile organic breakthrough across Multi-Filtration Bed 2.",
    };
    current.samples = [sample, ...current.samples];

    // Trigger Audible Siren Alert!
    audioAlertService.triggerAlert({
      id: "aquaguard-elevated-toc",
      source: "AquaGuard",
      title: "ECLSS WATER QUALITY ALERT: ELEVATED TOC (620 ppb)",
      reason: "TOC exceeds NASA 500 ppb potable water limit. Isolate Galley PWD.",
      severity: "CRITICAL",
      timestamp: now.toISOString(),
    });
  } else if (scenario === "MICROBIAL_FLAG") {
    // Generate microbial flag sample
    const evalRes = evaluateWaterSafety(310, 2.1, "FLAGGED");
    const sample: WaterQualitySample = {
      id: `wsamp-alert-${Date.now()}`,
      missionDay: 147,
      timestamp: now.toISOString(),
      timeFormatted,
      source: "Galley PWD",
      tocPpb: 310,
      conductivityUscm: 2.1,
      microbialStatus: "FLAGGED",
      status: evalRes.status,
      statusReason: evalRes.reason,
      proceduralNextStep: evalRes.nextStep,
      isSimulated: true,
      notes: "SIMULATED ANOMALY: In-flight microbial slide flagged colonies in Galley line.",
    };
    current.samples = [sample, ...current.samples];

    // Trigger Audible Siren Alert!
    audioAlertService.triggerAlert({
      id: "aquaguard-microbial-flag",
      source: "AquaGuard",
      title: "ECLSS WATER SAFETY ALERT: MICROBIAL TEST FLAGGED",
      reason: "Colonies detected in Galley PWD line. Immediate quarantine required.",
      severity: "CRITICAL",
      timestamp: now.toISOString(),
    });
  } else {
    // NOMINAL
    audioAlertService.clearAlertsBySource("AquaGuard");
  }

  saveAquaGuardState(current);
  return current;
}

/**
 * Logs a new hydration intake event.
 */
export function addHydrationLog(amountMl: number, source = "Galley PWD"): AquaGuardState {
  const current = getAquaGuardState();
  const now = new Date();
  const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const newLog: HydrationLogEntry = {
    id: `wlog-${Date.now()}`,
    missionDay: 147,
    timestamp: now.toISOString(),
    timeFormatted,
    amountMl,
    source,
  };

  current.consumptionLogs = [newLog, ...current.consumptionLogs];
  saveAquaGuardState(current);
  return current;
}

/**
 * Adds a manual crew-entered water quality test sample with strict input validation.
 */
export function addWaterSample(params: {
  source: WaterQualitySample["source"];
  tocPpb: number;
  conductivityUscm: number;
  microbialStatus: MicrobialStatus;
  notes?: string;
  missionDay?: number;
}): { success: boolean; error?: string; state?: AquaGuardState } {
  // Input validations
  if (isNaN(params.tocPpb) || params.tocPpb < 0 || params.tocPpb > 5000) {
    return { success: false, error: "TOC must be a valid number between 0 and 5,000 ppb." };
  }
  if (isNaN(params.conductivityUscm) || params.conductivityUscm < 0 || params.conductivityUscm > 100) {
    return { success: false, error: "Conductivity must be a valid number between 0 and 100 µS/cm." };
  }

  const current = getAquaGuardState();
  const now = new Date();
  const timeFormatted = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const evalRes = evaluateWaterSafety(params.tocPpb, params.conductivityUscm, params.microbialStatus);

  const sample: WaterQualitySample = {
    id: `wsamp-manual-${Date.now()}`,
    missionDay: params.missionDay ?? 147,
    timestamp: now.toISOString(),
    timeFormatted,
    source: params.source,
    tocPpb: Math.round(params.tocPpb),
    conductivityUscm: Number(params.conductivityUscm.toFixed(2)),
    microbialStatus: params.microbialStatus,
    status: evalRes.status,
    statusReason: evalRes.reason,
    proceduralNextStep: evalRes.nextStep,
    isSimulated: true,
    notes: params.notes?.trim() || "Manual in-flight test result entered by crew.",
  };

  // If new sample is degraded, trigger siren
  if (evalRes.status === "ATTENTION") {
    audioAlertService.triggerAlert({
      id: "aquaguard-manual-alert",
      source: "AquaGuard",
      title: "ECLSS WATER ALERT: MANUAL SAMPLE EXCEEDS LIMITS",
      reason: evalRes.reason,
      severity: "CRITICAL",
      timestamp: now.toISOString(),
    });
  }

  current.samples = [sample, ...current.samples];
  saveAquaGuardState(current);
  return { success: true, state: current };
}

/**
 * Calculates total hydration logged today in mL.
 */
export function getTodayHydrationTotal(missionDay = 147): number {
  const state = getAquaGuardState();
  return state.consumptionLogs
    .filter((l) => l.missionDay === missionDay)
    .reduce((sum, l) => sum + l.amountMl, 0);
}

/**
 * Updates the daily hydration goal target.
 */
export function updateHydrationTarget(targetMl: number): AquaGuardState {
  const current = getAquaGuardState();
  current.targetHydrationMl = Math.max(1000, Math.min(5000, targetMl));
  saveAquaGuardState(current);
  return current;
}

/**
 * Deletes a sample by ID.
 */
export function deleteSample(id: string): AquaGuardState {
  const current = getAquaGuardState();
  current.samples = current.samples.filter((s) => s.id !== id);
  saveAquaGuardState(current);
  return current;
}

/**
 * Resets state back to factory defaults.
 */
export function resetAquaGuardToDefaults(): AquaGuardState {
  const def = getDefaultAquaGuardState();
  audioAlertService.clearAlertsBySource("AquaGuard");
  saveAquaGuardState(def);
  return def;
}
