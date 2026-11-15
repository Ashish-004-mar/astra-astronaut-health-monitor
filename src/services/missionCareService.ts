/**
 * ASTRA MissionCare — Space Medical Emergency Assistance System Service Engine
 *
 * Provides offline-first decision support, vital measurement tutorials,
 * conservative rule-based escalation, environment-aware comm delay tracking,
 * emergency crew coordination, equipment inventory, chronological timeline logging,
 * health reminders, and offline educational resources.
 *
 * SCIENTIFIC & SAFETY DISCLAIMER:
 * ASTRA MissionCare is an educational prototype and decision-support exploration tool
 * developed for the NASA Space Apps Challenge. It is NOT a certified diagnostic medical
 * device, does not prescribe medication, does not invent microgravity CPR procedures,
 * and does not replace qualified flight surgeons or authorized mission medical personnel.
 */

import { jsPDF } from "jspdf";

export type MissionEnvironmentId = "spacecraft" | "iss" | "lunar" | "mars";

export interface MissionEnvironmentInfo {
  id: MissionEnvironmentId;
  name: string;
  gravityLabel: string;
  gravityG: number;
  commLatencyMinutes: number; // one-way latency in minutes
  commSummary: string;
  evacuationPossible: boolean;
  evacTimeDescription: string;
  habitatDescription: string;
  operationalConsiderations: string[];
  equipmentAssumptions: string[];
}

export const MISSION_ENVIRONMENTS: Record<MissionEnvironmentId, MissionEnvironmentInfo> = {
  spacecraft: {
    id: "spacecraft",
    name: "Spacecraft / Transit Vehicle",
    gravityLabel: "Microgravity (0g)",
    gravityG: 0,
    commLatencyMinutes: 0.1, // Near Earth / LEO ~ instant
    commSummary: "Near-instantaneous ground communication available with short relay blackouts.",
    evacuationPossible: true,
    evacTimeDescription: "Earth return viable within 6–24 hours depending on orbital insertion.",
    habitatDescription: "Highly confined pressurized cabin with strict acoustic and volume limits.",
    operationalConsiderations: [
      "Physical resuscitation requires specialized microgravity crew positioning or crew restraints.",
      "Loose medical consumables must be tethered immediately to avoid aspiration or equipment fouling.",
      "Cephalic fluid shift alters facial landmarks and baseline venous pressures.",
    ],
    equipmentAssumptions: [
      "Portable Medical Pack (PMP)",
      "Automated External Defibrillator with microgravity harness",
      "Manual Bag Valve Mask with microbial filter",
      "Emergency oxygen kit with closed-circuit mask",
    ],
  },
  iss: {
    id: "iss",
    name: "International Space Station (LEO)",
    gravityLabel: "Microgravity (0g)",
    gravityG: 0,
    commLatencyMinutes: 0.05, // Continuous high-gain Ku-band passes
    commSummary: "Continuous real-time communication via Space Network / TDRS satellites.",
    evacuationPossible: true,
    evacTimeDescription: "Emergency undock and Earth deorbit landing within 3 to 6 hours.",
    habitatDescription: "Spacious multi-module laboratory with designated Crew Medical Restraint System (CMRS).",
    operationalConsiderations: [
      "Utilize Crew Medical Restraint System (CMRS) board to stabilize patient during chest compressions.",
      "Flight Surgeon teleconsultation available continuously on Space-to-Ground 2 (S/G 2).",
      "Expansive inventory of station medical packs distributed across US Lab, Columbus, and Node 2.",
    ],
    equipmentAssumptions: [
      "Station Crew Medical Restraint System (CMRS)",
      "Harmonized Medical Diagnostic Kit with continuous ECG",
      "Advanced Life Support Pack (ALSP)",
      "Resuscitation Respiratory Assembly",
    ],
  },
  lunar: {
    id: "lunar",
    name: "Lunar Surface Base / Habitat",
    gravityLabel: "Partial Gravity (~1/6th g / 0.166g)",
    gravityG: 0.166,
    commLatencyMinutes: 0.025, // ~1.3 seconds speed of light delay
    commSummary: "Direct line-of-sight communications with Earth (~1.3 second round-trip speed-of-light delay).",
    evacuationPossible: false,
    evacTimeDescription: "Lunar surface abort and Earth transit requires minimum 3.5 to 5 days.",
    habitatDescription: "Pressurized surface habitat module with dust mitigation vestibule and airlock.",
    operationalConsiderations: [
      "1/6th gravity allows patient placement on habitat floor or medical berth, but body weight is minimal.",
      "Airlock and suit doffing procedures take 15–30 minutes if emergency occurs during EVA.",
      "Lunar regolith toxicity requires airlock dust decontamination before opening chest for invasive procedures.",
    ],
    equipmentAssumptions: [
      "Surface Habitat Medical Locker",
      "EVA Trauma Response Kit",
      "Portable Suction and Fluid Management Unit",
      "Airlock Rapid Extraction Tether Kit",
    ],
  },
  mars: {
    id: "mars",
    name: "Mars Transit Vehicle (Deep Space)",
    gravityLabel: "Microgravity (0g)",
    gravityG: 0,
    commLatencyMinutes: 14.0, // Typical halfway Mars one-way delay (4 to 22 min)
    commSummary: "Severe communication delay: 14 minutes one-way (28 minutes round-trip). Autonomous crew action required.",
    evacuationPossible: false,
    evacTimeDescription: "NO abort or Earth evacuation possible. Mission trajectory is locked.",
    habitatDescription: "Deep space transit vehicle beyond Earth-Moon system with strict mass/power limits.",
    operationalConsiderations: [
      "Crew MUST execute all acute emergency interventions autonomously without waiting for Flight Surgeon reply.",
      "Every observation and action must be logged chronologically for delayed ground telemetry review.",
      "Medical consumable re-supply is impossible; inventory conservation protocols are active.",
    ],
    equipmentAssumptions: [
      "Deep Space Autonomous Medical Kit (DSAMK)",
      "Autonomous Clinical Decision Diagnostic Suite",
      "High-reliability mechanical ventilator with O2 recycling",
      "Full spectrum broad-spectrum emergency pharmaceutical pack",
    ],
  },
};

// ----------------------------------------------------
// VITAL MEASUREMENT DEFINITIONS & VALIDATION
// ----------------------------------------------------

export type VitalType = "hr" | "spo2" | "bp" | "temp" | "rr" | "avpu";

export interface VitalTutorialGuide {
  type: VitalType;
  label: string;
  shortLabel: string;
  unit: string;
  whatItMeasures: string;
  whyItMatters: string;
  requiredEquipment: string;
  measurementSteps: string[];
  limitations: string[];
  safetyCaveats: string[];
  normalRangeLabel: string;
  concerningCriteria: string;
  suggestedTools: string[];
}

export const VITAL_GUIDES: Record<VitalType, VitalTutorialGuide> = {
  hr: {
    type: "hr",
    label: "Heart Rate (Pulse)",
    shortLabel: "HR",
    unit: "BPM",
    whatItMeasures: "The number of cardiac contractions per minute, reflecting circulatory output and autonomic demand.",
    whyItMatters: "Tachycardia (>100 bpm) or severe bradycardia (<50 bpm) with symptoms indicates potential cardiac distress, systemic shock, hypoxia, or pain.",
    requiredEquipment: "Wearable optical sensor, automated pulse oximeter, or manual palpation of radial/carotid artery.",
    measurementSteps: [
      "Locate the radial artery on the wrist below the thumb base, or the carotid artery along the windpipe groove.",
      "Use two fingertips (never thumb, which has its own pulse) with light, steady pressure.",
      "Count beats for 30 seconds and multiply by 2 (or count full 60 seconds if rhythm is irregular).",
      "Observe rhythm regularity (regular vs erratic/irregular).",
    ],
    limitations: [
      "Microgravity fluid shift can cause transient jugular venous distention that confuses carotid palpation.",
      "Wearable optical photoplethysmography (PPG) is prone to motion artifact during physical activity.",
    ],
    safetyCaveats: [
      "Never compress both carotid arteries simultaneously.",
      "Do NOT interrupt active chest compressions to take a manual pulse unless a rhythm check is indicated.",
    ],
    normalRangeLabel: "60 – 100 BPM (Resting)",
    concerningCriteria: "Resting HR > 115 BPM or < 45 BPM, or sudden onset irregular palpitations with chest pain.",
    suggestedTools: ["Astronaut Wearable Band", "Pulse Oximeter Clip", "Manual Wrist Palpation"],
  },
  spo2: {
    type: "spo2",
    label: "Blood Oxygen Saturation (SpO₂)",
    shortLabel: "SpO₂",
    unit: "%",
    whatItMeasures: "The percentage of oxygenated hemoglobin circulating through arterial blood vessels.",
    whyItMatters: "SpO₂ below 94% indicates hypoxemia, which can result from cabin decompression, EVA suit scrubber failure, smoke inhalation, or pulmonary compromise.",
    requiredEquipment: "Calibrated transmission pulse oximeter finger sensor.",
    measurementSteps: [
      "Ensure patient finger is clean, warm, and free from dark nail coating or grease.",
      "Place pulse oximeter clip firmly onto index or middle fingertip.",
      "Instruct patient to keep hand still and rested at heart level.",
      "Wait 15–20 seconds for the plethysmograph waveform to stabilize before reading the value.",
    ],
    limitations: [
      "Webcams and standard computer cameras CANNOT reliably or clinically measure SpO₂.",
      "Hypothermia, peripheral vasoconstriction, or carbon monoxide poisoning cause false normal or error readings.",
    ],
    safetyCaveats: [
      "If SpO₂ drops below 90%, immediately verify cabin atmosphere PO₂ and administer emergency oxygen if authorized.",
    ],
    normalRangeLabel: "95% – 100%",
    concerningCriteria: "SpO₂ < 92% (or < 95% with acute dyspnea, confusion, or chest pain).",
    suggestedTools: ["Fingertip Pulse Oximeter", "Multi-parameter Monitor Cable"],
  },
  bp: {
    type: "bp",
    label: "Blood Pressure (Systolic / Diastolic)",
    shortLabel: "BP",
    unit: "mmHg",
    whatItMeasures: "The arterial pressure generated during ventricular contraction (systolic) and cardiac filling (diastolic).",
    whyItMatters: "Hypotension (systolic < 90 mmHg) with dizziness indicates hypovolemia or cardiogenic shock. Severe hypertension (> 160/100) indicates acute stress or neurological concern.",
    requiredEquipment: "Validated automated or manual pneumatic blood pressure cuff of correct arm circumference.",
    measurementSteps: [
      "Position the patient seated or strapped into the medical berth in neutral microgravity posture.",
      "Wrap cuff snugly around bare upper arm with artery marker aligned 2 cm above the elbow crease.",
      "Keep arm rested at heart level and ensure patient does not talk or flex forearm during inflation.",
      "Initiate automated cycle or manually inflate cuff 30 mmHg above pulse disappearance, then deflate at 2–3 mmHg/sec.",
    ],
    limitations: [
      "Microgravity shifts blood cephalad, altering orthostatic regulation and slightly modifying baseline arm pressures.",
      "Wrong cuff size generates significant artifact (too small overestimates; too large underestimates).",
    ],
    safetyCaveats: [
      "Do not measure blood pressure on an arm with an active intravenous catheter or acute traumatic injury.",
    ],
    normalRangeLabel: "90/60 – 120/80 mmHg",
    concerningCriteria: "Systolic < 90 mmHg (hypotension) or Systolic > 160 mmHg with severe headache/chest pain.",
    suggestedTools: ["Automated Oscillometric Arm Cuff", "Manual Aneroid Sphygmomanometer"],
  },
  temp: {
    type: "temp",
    label: "Core Body Temperature",
    shortLabel: "TEMP",
    unit: "°C",
    whatItMeasures: "Internal thermal homeostasis of central organs.",
    whyItMatters: "Elevated temp (>38.0°C / 100.4°F) signals infection, inflammatory response, or heat stress. Subnormal temp (<35.5°C) indicates hypothermia from suit thermal failure.",
    requiredEquipment: "Tympanic (ear) or temporal infrared medical thermometer.",
    measurementSteps: [
      "Verify thermometer lens probe is clean with fresh disposable protective sleeve.",
      "For tympanic: gently pull outer ear upward and backward, insert probe snugly into canal, press measurement trigger.",
      "For temporal: sweep probe gently across center forehead toward the hairline.",
      "Record reading and note site (tympanic, temporal, or oral).",
    ],
    limitations: [
      "Sweating or direct airflow from cabin environmental control ventilation can depress forehead surface readings.",
      "Spaceflight-associated microgravity core temp is often elevated 1°C due to impaired convective heat dissipation.",
    ],
    safetyCaveats: [
      "Never force an ear probe if resistance or acute ear pain is encountered.",
    ],
    normalRangeLabel: "36.5°C – 37.5°C (97.7°F – 99.5°F)",
    concerningCriteria: "Temp > 38.5°C (> 101.3°F) or < 35.0°C (< 95.0°F).",
    suggestedTools: ["Infrared Tympanic Thermometer", "Temporal Scanner"],
  },
  rr: {
    type: "rr",
    label: "Respiratory Rate",
    shortLabel: "RR",
    unit: "breaths/min",
    whatItMeasures: "The number of ventilatory cycles (inhalation + exhalation) completed in one minute.",
    whyItMatters: "Tachypnea (>24 breaths/min) is an early, highly sensitive sign of metabolic acidosis, pulmonary congestion, pain, or hypoxia.",
    requiredEquipment: "Visual chest wall observation or acoustic stethoscope.",
    measurementSteps: [
      "Observe patient's chest and abdominal movement unobtrusively (patients often change breathing rate if conscious of observation).",
      "Count complete breaths (one rise + one fall) for a full 60 seconds.",
      "Note breathing quality: shallow, labored, wheezing, gasping, or irregular.",
      "Check if patient is able to speak complete sentences without pausing for air.",
    ],
    limitations: [
      "Microgravity alters chest wall mechanics because gravity no longer opposes the diaphragm, causing subtle ribcage movement.",
    ],
    safetyCaveats: [
      "Agonal or gasping breaths (infrequent, labored gasps) in an unresponsive patient must be treated as ABSENT normal breathing; initiate resuscitation immediately.",
    ],
    normalRangeLabel: "12 – 20 breaths/min",
    concerningCriteria: "RR > 25 breaths/min, < 8 breaths/min, or labored/gasping breathing.",
    suggestedTools: ["Visual Observation Timer", "Cabin Audio Monitoring"],
  },
  avpu: {
    type: "avpu",
    label: "Consciousness & Responsiveness (AVPU Scale)",
    shortLabel: "AVPU",
    unit: "level",
    whatItMeasures: "Rapid neurological consciousness assessment on the international 4-tier scale: Alert, Verbal, Pain, Unresponsive.",
    whyItMatters: "Any degradation from 'Alert' to Verbal, Pain, or Unresponsive is a top-priority mission medical escalation.",
    requiredEquipment: "Standardized clinical verbal and tactile stimulus protocol.",
    measurementSteps: [
      "A - ALERT: Is the astronaut spontaneously awake, tracking with eyes, and answering orientation questions (Name, Location, Mission Day)?",
      "V - VERBAL: If eyes are closed, do they open eyes and respond to a clear loud verbal prompt ('Can you hear me?')?",
      "P - PAIN: If no response to voice, do they respond with purposeful movement or grimace to gentle trapezius squeeze?",
      "U - UNRESPONSIVE: No motor or verbal response to voice or physical stimulation.",
    ],
    limitations: [
      "AVPU is a rapid triage tool, not a full neurological or psychiatric diagnosis.",
    ],
    safetyCaveats: [
      "An astronaut assessed as 'U' (Unresponsive) must have breathing checked IMMEDIATELY. If breathing is absent or gasping, proceed to emergency resuscitation.",
    ],
    normalRangeLabel: "Alert (Oriented x 3)",
    concerningCriteria: "Any grade other than 'Alert' (Verbal, Pain, or Unresponsive).",
    suggestedTools: ["Verbal Check Protocol", "Pupillary Light Pen"],
  },
};

export interface RecordedVital {
  id: string;
  type: VitalType;
  value: number | string; // e.g. 78 or "120/80" or "Alert"
  systolic?: number;
  diastolic?: number;
  unit: string;
  timestamp: string; // ISO
  formattedTime: string;
  missionDay: number;
  source: "MANUAL_ENTRY" | "SIMULATED_SENSOR" | "WEARABLE";
  notes?: string;
  isConcerning: boolean;
}

export function validateVitalInput(type: VitalType, rawValue: string): { valid: boolean; error?: string } {
  const trimmed = rawValue.trim();
  if (!trimmed) return { valid: false, error: "Value cannot be empty." };

  switch (type) {
    case "hr": {
      const n = Number(trimmed);
      if (isNaN(n) || n < 20 || n > 260) {
        return { valid: false, error: "Heart rate must be between 20 and 260 BPM." };
      }
      return { valid: true };
    }
    case "spo2": {
      const n = Number(trimmed);
      if (isNaN(n) || n < 50 || n > 100) {
        return { valid: false, error: "SpO₂ must be between 50% and 100%." };
      }
      return { valid: true };
    }
    case "bp": {
      const match = trimmed.match(/^(\d{2,3})\/(\d{2,3})$/);
      if (!match) {
        return { valid: false, error: "Blood pressure format must be Systolic/Diastolic (e.g. 120/80)." };
      }
      const sys = Number(match[1]);
      const dia = Number(match[2]);
      if (sys < 50 || sys > 280 || dia < 30 || dia > 180 || sys <= dia) {
        return { valid: false, error: "Enter plausible blood pressure values (e.g. Systolic 50-280, Diastolic 30-180, Systolic > Diastolic)." };
      }
      return { valid: true };
    }
    case "temp": {
      const n = Number(trimmed);
      if (isNaN(n) || n < 32 || n > 43) {
        return { valid: false, error: "Temperature must be between 32.0°C and 43.0°C." };
      }
      return { valid: true };
    }
    case "rr": {
      const n = Number(trimmed);
      if (isNaN(n) || n < 4 || n > 60) {
        return { valid: false, error: "Respiratory rate must be between 4 and 60 breaths/min." };
      }
      return { valid: true };
    }
    case "avpu": {
      const validOptions = ["Alert", "Verbal", "Pain", "Unresponsive"];
      if (!validOptions.some((opt) => opt.toLowerCase() === trimmed.toLowerCase())) {
        return { valid: false, error: "Responsiveness must be Alert, Verbal, Pain, or Unresponsive." };
      }
      return { valid: true };
    }
    default:
      return { valid: true };
  }
}

export function isVitalConcerning(type: VitalType, value: number | string): boolean {
  switch (type) {
    case "hr": {
      const n = Number(value);
      return n > 115 || n < 50;
    }
    case "spo2": {
      const n = Number(value);
      return n < 93;
    }
    case "bp": {
      const str = String(value);
      const match = str.match(/^(\d{2,3})\/(\d{2,3})$/);
      if (!match) return false;
      const sys = Number(match[1]);
      const dia = Number(match[2]);
      return sys < 90 || sys > 160 || dia > 100;
    }
    case "temp": {
      const n = Number(value);
      return n > 38.2 || n < 35.2;
    }
    case "rr": {
      const n = Number(value);
      return n > 24 || n < 9;
    }
    case "avpu": {
      const str = String(value).toLowerCase();
      return str !== "alert";
    }
    default:
      return false;
  }
}

// ----------------------------------------------------
// SYMPTOM ASSESSMENT & CONSERVATIVE ESCALATION ENGINE
// ----------------------------------------------------

export type EscalationTier = "EMERGENCY_ESCALATION" | "PROMPT_REVIEW" | "ROUTINE_MONITORING";

export interface SymptomAssessmentInput {
  primarySymptom: string;
  onsetTime: string;
  isResponsive: boolean;
  avpuLevel: "Alert" | "Verbal" | "Pain" | "Unresponsive";
  isBreathingNormally: boolean;
  breathingQuality: "normal" | "rapid" | "labored" | "gasping" | "absent";
  hasChestPain: boolean;
  chestPainDetails?: {
    character: string;
    radiationToArmOrJaw: boolean;
    suddenOnset: boolean;
  };
  hasSevereHeadache: boolean;
  hasFaintingOrCollapse: boolean;
  isGettingWorse: boolean;
  observationsNotes?: string;
  reportedVitals?: {
    hr?: number;
    spo2?: number;
    bp?: string;
    temp?: number;
    rr?: number;
  };
}

export interface EscalationResult {
  tier: EscalationTier;
  tierLabel: string;
  badgeColor: string;
  whatWasReported: string[];
  whyItMatters: string[];
  whatShouldHappenNext: string[];
  whatInformationIsMissing: string[];
  applicableProtocolReference: string;
  disclaimer: string;
}

export function evaluateSymptomEscalation(input: SymptomAssessmentInput): EscalationResult {
  const reported: string[] = [];
  const why: string[] = [];
  const next: string[] = [];
  const missing: string[] = [];

  // Check top-priority emergency flags
  const isUnresponsive = !input.isResponsive || input.avpuLevel === "Unresponsive";
  const abnormalBreathing =
    !input.isBreathingNormally ||
    input.breathingQuality === "absent" ||
    input.breathingQuality === "gasping";
  const severeChestPain =
    input.hasChestPain ||
    input.primarySymptom.toLowerCase().includes("chest pain");
  const collapseReported =
    input.hasFaintingOrCollapse ||
    input.primarySymptom.toLowerCase().includes("collapse");

  // Rule 1: CRITICAL EMERGENCY — Unresponsive or Absent/Gasping Breathing or Sudden Collapse
  if (isUnresponsive || abnormalBreathing || (severeChestPain && collapseReported)) {
    if (isUnresponsive) reported.push("Patient is UNRESPONSIVE (AVPU grade U).");
    if (abnormalBreathing) reported.push(`Breathing is recorded as ${input.breathingQuality.toUpperCase()}.`);
    if (severeChestPain) reported.push("Severe chest pain accompanied or preceded event.");
    if (collapseReported) reported.push("Sudden collapse / loss of posture reported.");

    why.push(
      "Unresponsiveness combined with abnormal or absent breathing is a time-critical life-threatening condition.",
      "In microgravity or deep space, delay in initiating approved resuscitation protocols diminishes survival likelihood rapidly.",
      "Routine biometric measurements (BP, temp, wearable sync) MUST NOT delay immediate emergency action.",
    );

    next.push(
      "1. ALERT CREW IMMEDIATELY: Broadcast general cabin emergency alert to summon all available crewmates.",
      "2. POSITIONING: Move patient to designated medical restraint (CMRS board or firm surface).",
      "3. VERIFY AIRWAY & BREATHING: Check airway without hyperextending; if breathing is absent/gasping, follow approved resuscitation protocol.",
      "4. RETRIEVE EMERGENCY GEAR: Send second crewmate for Automated External Defibrillator (AED) and Bag Valve Mask (BVM).",
      "5. COMM PROTOCOL: Open emergency Space-to-Ground comm loop (or transmit emergency telemetry burst if on Mars transit).",
    );

    if (!input.reportedVitals?.spo2 && !isUnresponsive) {
      missing.push("Oxygen saturation (obtain only after airway & resuscitation sequence is secure).");
    }
    if (!input.reportedVitals?.bp) {
      missing.push("Blood pressure (secondary priority after acute stabilization).");
    }

    return {
      tier: "EMERGENCY_ESCALATION",
      tierLabel: "IMMEDIATE EMERGENCY ESCALATION",
      badgeColor: "#f43f5e",
      whatWasReported: reported,
      whyItMatters: why,
      whatShouldHappenNext: next,
      whatInformationIsMissing: missing,
      applicableProtocolReference: "NASA / ISS Flight Rule B13-102 (Crew Medical Emergency) & Spacecraft Resuscitation Protocol",
      disclaimer: "Non-diagnostic guidance. Follow certified mission flight rules and approved checklists.",
    };
  }

  // Rule 2: RESPONSIVE CHEST PAIN / SEVERE SYMPTOMS — Urgent Escalation
  if (severeChestPain || input.hasSevereHeadache || input.isGettingWorse || (input.reportedVitals?.spo2 && input.reportedVitals.spo2 < 93)) {
    if (severeChestPain) reported.push("Severe chest discomfort or tightness reported in responsive astronaut.");
    if (input.chestPainDetails?.radiationToArmOrJaw) reported.push("Pain radiates to arm, neck, or jaw.");
    if (input.hasSevereHeadache) reported.push("Severe acute headache with potential neurological impairment.");
    if (input.reportedVitals?.spo2 && input.reportedVitals.spo2 < 93) reported.push(`Oxygen saturation is ${input.reportedVitals.spo2}% (low).`);

    why.push(
      "Acute chest pain in a responsive crewmate requires prompt escalation to prevent potential cardiac decompensation or hemodynamic collapse.",
      "Microgravity cephalic fluid shift increases central venous pressure and can mask or exacerbate cardiovascular strain.",
    );

    next.push(
      "1. REST PATIENT: Have astronaut immediately cease all physical exercise and rest in seated or neutral body posture.",
      "2. ALERT FLIGHT SURGEON: Request Private Medical Conference (PMC) via Ground Control link.",
      "3. ATTACH VITALS MONITOR: Place pulse oximeter on finger and obtain 12-lead ECG if telemetry pack is available.",
      "4. PREPARE EMERGENCY PACK: Locate Defibrillator pack and emergency drug kit in readiness, without administering unapproved medication.",
    );

    if (!input.reportedVitals?.bp) missing.push("Blood pressure reading (systolic/diastolic).");
    if (!input.reportedVitals?.hr) missing.push("Resting heart rate / rhythm regularity.");

    return {
      tier: "EMERGENCY_ESCALATION",
      tierLabel: "URGENT CLINICAL ESCALATION",
      badgeColor: "#fb923c",
      whatWasReported: reported,
      whyItMatters: why,
      whatShouldHappenNext: next,
      whatInformationIsMissing: missing,
      applicableProtocolReference: "NASA HRP Medical Risk Mitigation Protocol: Acute Coronary / Thoracic Discomfort",
      disclaimer: "Educational escalation guidance. Do not administer prescription medication without Flight Surgeon authorization.",
    };
  }

  // Rule 3: PROMPT PROFESSIONAL REVIEW — Non-emergency abnormal findings
  if (input.isGettingWorse || (input.reportedVitals?.hr && (input.reportedVitals.hr > 110 || input.reportedVitals.hr < 50))) {
    reported.push(`Symptom reported: ${input.primarySymptom}.`);
    reported.push("Patient is responsive and breathing normally.");
    if (input.reportedVitals?.hr) reported.push(`Heart rate is ${input.reportedVitals.hr} BPM.`);

    why.push(
      "Observations differ from nominal mission baseline. Prompt medical oversight prevents condition progression.",
    );

    next.push(
      "1. Document exact time of symptom onset and any operational tasks performed.",
      "2. Schedule asynchronous medical consultation with Flight Medicine console.",
      "3. Repeat vital measurements in 30 minutes to establish trend line.",
    );

    missing.push("Repeat vital signs to detect ongoing trajectory.");

    return {
      tier: "PROMPT_REVIEW",
      tierLabel: "PROMPT MEDICAL REVIEW ADVISED",
      badgeColor: "#facc15",
      whatWasReported: reported,
      whyItMatters: why,
      whatShouldHappenNext: next,
      whatInformationIsMissing: missing,
      applicableProtocolReference: "NASA Routine In-Flight Clinical Assessment Protocol (RICAP-04)",
      disclaimer: "Non-emergency guidance. Log entry into Mission Care Timeline for Flight Surgeon review.",
    };
  }

  // Rule 4: ROUTINE MONITORING
  reported.push(`Mild or stable symptom: ${input.primarySymptom || "Routine check"}.`);
  why.push("Current observations are within or near anticipated operational spaceflight ranges.");
  next.push(
    "1. Continue scheduled flight duties.",
    "2. Re-assess during daily wellness check-in.",
    "3. Log any changes in intensity or character.",
  );

  return {
    tier: "ROUTINE_MONITORING",
    tierLabel: "ROUTINE MONITORING / OBSERVATION",
    badgeColor: "#9de9ce",
    whatWasReported: reported,
    whyItMatters: why,
    whatShouldHappenNext: next,
    whatInformationIsMissing: ["No urgent measurements missing."],
    applicableProtocolReference: "ASTRA Routine Health Maintenance Guidelines",
    disclaimer: "Standard non-clinical observation guidelines.",
  };
}

// ----------------------------------------------------
// CREW COORDINATION & ROLES
// ----------------------------------------------------

export type CrewRoleType =
  | "primary_responder"
  | "equipment_retriever"
  | "observations_scribe"
  | "communications_lead"
  | "procedure_reader";

export interface CrewMemberRole {
  roleId: CrewRoleType;
  title: string;
  assignedMember: string;
  description: string;
  checklist: { id: string; text: string; done: boolean; timestamp?: string }[];
}

export const DEFAULT_CREW_ROLES: CrewMemberRole[] = [
  {
    roleId: "primary_responder",
    title: "Primary Immediate Responder",
    assignedMember: "Commander (CDR)",
    description: "Provides direct hands-on assistance, stabilizes patient positioning, and initiates resuscitation if indicated.",
    checklist: [
      { id: "pr-1", text: "Verify scene safety (check for electrical hazards or atmospheric toxic gas alarms)", done: true, timestamp: "00:01" },
      { id: "pr-2", text: "Assess responsiveness and check airway/breathing", done: true, timestamp: "00:02" },
      { id: "pr-3", text: "Secure patient to CMRS berth or microgravity restraint strap", done: false },
      { id: "pr-4", text: "Follow approved resuscitation or stabilization checklist without interruption", done: false },
    ],
  },
  {
    roleId: "equipment_retriever",
    title: "Equipment & Logistics Retriever",
    assignedMember: "Flight Engineer 1 (FE-1)",
    description: "Retrieves emergency medical packs, AED, oxygen assembly, and diagnostic telemetry kits from lockers.",
    checklist: [
      { id: "er-1", text: "Retrieve Automated External Defibrillator (AED) and verify green readiness indicator", done: true, timestamp: "00:02" },
      { id: "er-2", text: "Retrieve Bag Valve Mask (BVM) and emergency oxygen cylinder", done: false },
      { id: "er-3", text: "Stage medical suction unit and multi-parameter monitor at berth", done: false },
      { id: "er-4", text: "Tether all loose consumable supply bags to equipment rails", done: false },
    ],
  },
  {
    roleId: "observations_scribe",
    title: "Observations & Scribe Recorder",
    assignedMember: "Mission Specialist (MS)",
    description: "Documents chronological event timestamps, vital readings, equipment deployments, and patient status updates.",
    checklist: [
      { id: "os-1", text: "Record exact time of collapse / emergency onset in MissionCare Timeline", done: true, timestamp: "00:01" },
      { id: "os-2", text: "Log serial vitals (Heart rate, SpO2, blood pressure) with source labels", done: false },
      { id: "os-3", text: "Document all medications or procedures attempted with timestamps", done: false },
      { id: "os-4", text: "Prepare timeline export summary for ground medical handover", done: false },
    ],
  },
  {
    roleId: "communications_lead",
    title: "Communications & Telemetry Lead",
    assignedMember: "Flight Engineer 2 (FE-2)",
    description: "Establishes emergency loop with Mission Control, manages comm latency, and streams telemetry.",
    checklist: [
      { id: "cl-1", text: "Open emergency Space-to-Ground audio circuit or transmit emergency burst", done: true, timestamp: "00:02" },
      { id: "cl-2", text: "Report patient status, location within habitat, and ongoing actions to Ground", done: false },
      { id: "cl-3", text: "Monitor comm latency countdown timer (e.g. 14 min Mars one-way)", done: false },
      { id: "cl-4", text: "Acknowledge Flight Surgeon teleconference directives when received", done: false },
    ],
  },
  {
    roleId: "procedure_reader",
    title: "Procedure Reader & Safety Verifier",
    assignedMember: "Science Officer (SO)",
    description: "Reads authorized mission flight checklists aloud step-by-step to prevent procedural errors.",
    checklist: [
      { id: "p-1", text: "Open approved emergency flight checklist for reported condition", done: true, timestamp: "00:02" },
      { id: "p-2", text: "Read each step aloud clearly and verify closed-loop confirmation from Primary Responder", done: false },
      { id: "p-3", text: "Ensure non-approved experimental procedures are NOT improvised", done: false },
    ],
  },
];

// ----------------------------------------------------
// EMERGENCY EQUIPMENT INVENTORY
// ----------------------------------------------------

export interface EmergencyEquipmentItem {
  id: string;
  name: string;
  category: "monitoring" | "resuscitation" | "airway" | "trauma" | "pharmaceutical" | "communication";
  location: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE_REQUIRED" | "UNAVAILABLE";
  notes?: string;
  lastCheckedDate: string;
  applicableEnvironments: MissionEnvironmentId[];
}

export const DEFAULT_EQUIPMENT_INVENTORY: EmergencyEquipmentItem[] = [
  {
    id: "eq-1",
    name: "Automated External Defibrillator (AED)",
    category: "resuscitation",
    location: "Node 1 / Forward Medical Rack",
    status: "AVAILABLE",
    notes: "Self-test nominal. Pediatric and adult electrode pads attached.",
    lastCheckedDate: "Day 146",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-2",
    name: "Bag Valve Mask (BVM) Resuscitator",
    category: "airway",
    location: "Emergency Airway Pack Locker A-2",
    status: "AVAILABLE",
    notes: "Microbial exhalation HEPA filter installed. 2 adult mask sizes included.",
    lastCheckedDate: "Day 145",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-3",
    name: "Pulse Oximeter Transmittance Sensor",
    category: "monitoring",
    location: "Diagnostic Telemetry Kit Pouch 1",
    status: "AVAILABLE",
    notes: "Battery at 98%. Clean optical aperture.",
    lastCheckedDate: "Day 147",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-4",
    name: "Automated Oscillometric Blood Pressure Cuff",
    category: "monitoring",
    location: "Diagnostic Telemetry Kit Pouch 2",
    status: "AVAILABLE",
    notes: "Standard adult cuff (22–32 cm). Pneumatic seal verified.",
    lastCheckedDate: "Day 146",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-5",
    name: "Emergency Oxygen Assembly with Demand Valve",
    category: "resuscitation",
    location: "Life Support Emergency Locker B-1",
    status: "AVAILABLE",
    notes: "Regulator pressure at 2000 psi. 45 min autonomous flow capacity.",
    lastCheckedDate: "Day 144",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-6",
    name: "Crew Medical Restraint System (CMRS)",
    category: "trauma",
    location: "US Lab Overhead Rack 3",
    status: "AVAILABLE",
    notes: "Stationary backboard with microgravity harness straps.",
    lastCheckedDate: "Day 140",
    applicableEnvironments: ["iss", "spacecraft"],
  },
  {
    id: "eq-7",
    name: "Suction Apparatus (Mechanical Foot-Pump)",
    category: "airway",
    location: "Airway Kit Pouch 3",
    status: "AVAILABLE",
    notes: "Manual vacuum unit for pharyngeal airway clearance in 0g.",
    lastCheckedDate: "Day 142",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
  },
  {
    id: "eq-8",
    name: "Airlock Rapid Extraction Litter",
    category: "trauma",
    location: "Airlock Equipment Vestibule",
    status: "AVAILABLE",
    notes: "For incapacitated EVA crew retrieval through suit hatch.",
    lastCheckedDate: "Day 135",
    applicableEnvironments: ["lunar"],
  },
];

// ----------------------------------------------------
// EMERGENCY TIMELINE LOGGING & PDF EXPORT
// ----------------------------------------------------

export interface TimelineLogEntry {
  id: string;
  timestamp: string; // ISO
  missionDay: number;
  timeFormatted: string; // e.g. "08:14 UTC"
  environment: MissionEnvironmentId;
  category: "ALERT" | "ASSESSMENT" | "VITAL" | "CREW_ACTION" | "COMMUNICATION" | "EQUIPMENT" | "STATUS_UPDATE";
  title: string;
  details: string;
  provenance: "MANUAL_ENTRY" | "SIMULATED" | "SYSTEM_GENERATED";
  author: string;
}

// ----------------------------------------------------
// HEALTH REMINDERS
// ----------------------------------------------------

export interface HealthReminderItem {
  id: string;
  title: string;
  type: "hr_check" | "sleep_checkin" | "wellness_assessment" | "hydration_log" | "followup_vital" | "equipment_check";
  timeLabel: string; // e.g. "14:00 UTC"
  frequency: "daily" | "shift" | "once";
  snoozedUntil?: string;
  completed: boolean;
  notes?: string;
}

export const DEFAULT_REMINDERS: HealthReminderItem[] = [
  {
    id: "rem-1",
    title: "Post-Workout Heart Rate & Hydration Log",
    type: "hr_check",
    timeLabel: "11:30 UTC",
    frequency: "daily",
    completed: true,
    notes: "Record resting HR 10 min following cycle ergometer session.",
  },
  {
    id: "rem-2",
    title: "Daily Wellness Self-Assessment Check-in",
    type: "wellness_assessment",
    timeLabel: "08:00 UTC",
    frequency: "daily",
    completed: false,
    notes: "Log perceived fatigue, mood, and sleep quality.",
  },
  {
    id: "rem-3",
    title: "Automated External Defibrillator (AED) Visual Readiness Inspection",
    type: "equipment_check",
    timeLabel: "18:00 UTC",
    frequency: "shift",
    completed: false,
    notes: "Inspect green self-test flashing indicator on forward medical rack.",
  },
];

// ----------------------------------------------------
// OFFLINE MEDICAL RESOURCES & PROCEDURES
// ----------------------------------------------------

export interface OfflineMedicalResource {
  id: string;
  title: string;
  source: string;
  version: string;
  reviewDate: string;
  applicableEnvironments: MissionEnvironmentId[];
  offlineCached: boolean;
  validationStatus: "GENERAL_EDUCATIONAL_GUIDANCE" | "AUTHORIZED_MISSION_PROCEDURE";
  summary: string;
  steps?: string[];
  caveats: string[];
}

export const OFFLINE_RESOURCES: OfflineMedicalResource[] = [
  {
    id: "res-1",
    title: "Crew Emergency Recognition & Initial Response",
    source: "NASA Human Research Program (HRP) Emergency Guidelines",
    version: "Rev 4.2",
    reviewDate: "2026-03-15",
    applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
    offlineCached: true,
    validationStatus: "GENERAL_EDUCATIONAL_GUIDANCE",
    summary: "Basic principles for recognizing astronaut unresponsiveness, acute collapse, and notifying the crew without delay.",
    steps: [
      "1. Check scene safety (no electrical or toxic gas alarms).",
      "2. Tap shoulder firmly and ask loudly: 'Are you okay? Can you hear me?'",
      "3. If no response: announce immediate crew emergency ('Medical Emergency in Module').",
      "4. Check for normal breathing for no more than 10 seconds.",
      "5. If breathing is absent or abnormal (gasping): follow approved mission resuscitation protocol.",
    ],
    caveats: [
      "Educational guidance only. Does not replace formal NASA Spaceflight First Responder certification.",
    ],
  },
  {
    id: "res-2",
    title: "International Space Station CMRS Resuscitation Protocol",
    source: "NASA / ISS Flight Rule B13-102 & Crew Healthcare System (CHeCS)",
    version: "CHeCS-ISS-2025.1",
    reviewDate: "2025-11-20",
    applicableEnvironments: ["iss"],
    offlineCached: true,
    validationStatus: "AUTHORIZED_MISSION_PROCEDURE",
    summary: "Authorized procedure for deploying the Crew Medical Restraint System (CMRS) board in the US Lab to perform chest compressions in 0g.",
    steps: [
      "1. Deploy CMRS board from US Lab overhead locker and lock latches into seat-track fittings.",
      "2. Secure patient supine onto CMRS using torso and thigh retention belts.",
      "3. Rescuer locks boots into foot restraints or utilizes the handstand method against opposite bulkheads.",
      "4. Power on Defibrillator and attach pads to bare chest (sternum & apex) per diagram.",
      "5. Follow automated voice directives from AED. Ensure nobody touches patient during rhythm analysis.",
    ],
    caveats: [
      "Approved for ISS operations only. Specific to US Lab CMRS architecture.",
    ],
  },
  {
    id: "res-3",
    title: "Deep Space Autonomous Chest Pain Management (Mars Transit)",
    source: "NASA Deep Space Transit Medical Capabilities Architecture",
    version: "Mars-Med-Draft-3.1",
    reviewDate: "2026-01-10",
    applicableEnvironments: ["mars", "spacecraft"],
    offlineCached: true,
    validationStatus: "AUTHORIZED_MISSION_PROCEDURE",
    summary: "Autonomous protocol for managing responsive chest pain during delayed-communication Mars transit missions.",
    steps: [
      "1. Ensure patient immediately ceases all physical activity and rests in neutral posture with eye mask and calm lighting.",
      "2. Administer supplemental oxygen via mask if SpO₂ drops below 94%.",
      "3. Connect portable ECG leads to record rhythm strip; transmit telemetry burst to Earth.",
      "4. Monitor blood pressure every 15 minutes.",
      "5. Follow autonomous clinical decision checklist for authorized antiplatelet or vasodilator administration if pre-approved.",
    ],
    caveats: [
      "Strictly non-diagnostic prototype. Medication administration requires adherence to onboard locked medical formulary rules.",
    ],
  },
  {
    id: "res-4",
    title: "Terrestrial Cardiopulmonary Resuscitation (AHA Guidelines)",
    source: "American Heart Association (AHA) CPR Guidelines (Reference Only)",
    version: "2025 Update",
    reviewDate: "2025-10-15",
    applicableEnvironments: [],
    offlineCached: true,
    validationStatus: "GENERAL_EDUCATIONAL_GUIDANCE",
    summary: "Terrestrial ground-based CPR principles. Included strictly for educational comparison.",
    caveats: [
      "TERRESTRIAL ONLY: Terrestrial CPR techniques that rely on Earth gravity (rescuer body weight) CANNOT be effectively performed in microgravity without specialized crew restraints or the reverse handstand method.",
      "Do NOT use terrestrial ground protocols as a substitute for microgravity mission procedures.",
    ],
  },
  {
    id: "res-5",
    title: "Lunar EVA Decompression & Dust Injury Management",
    source: "Artemis Surface Medical Operations Handbook",
    version: "Artemis-SMOH-2",
    reviewDate: "2026-04-01",
    applicableEnvironments: ["lunar"],
    offlineCached: false,
    validationStatus: "AUTHORIZED_MISSION_PROCEDURE",
    summary: "Approved mission-specific procedure not available in this prototype.",
    caveats: [
      "Approved mission-specific procedure not available in this prototype. Consult physical onboard Flight Data File (FDF) Volume 4.",
    ],
  },
];

// ----------------------------------------------------
// SIMULATION TRAINING SCENARIOS (DEMO MODE)
// ----------------------------------------------------

export interface TrainingScenarioDef {
  id: string;
  title: string;
  environment: MissionEnvironmentId;
  initialSummary: string;
  patientName: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    expectedAction: string;
    hint: string;
  }[];
}

export const TRAINING_SCENARIOS: TrainingScenarioDef[] = [
  {
    id: "chest_pain_collapse",
    title: "Scenario 1: Chest Pain & Sudden Collapse (Primary NASA Challenge)",
    environment: "mars",
    patientName: "Astronaut Alex Vance (Flight Engineer)",
    initialSummary: "Halfway to Mars, crewmate Alex suddenly clutches his chest in severe distress, groans, and collapses to the habitat floor. Earth communication has a 14-minute one-way delay.",
    steps: [
      {
        stepNumber: 1,
        title: "Recognize Emergency & Alert Crew",
        description: "Patient has collapsed. In deep space with a 14-minute comm delay, crew cannot wait for Earth. Immediate general alarm must be sounded.",
        expectedAction: "Click 'Broadcast Crew Alert' to initiate emergency status.",
        hint: "Do not attempt to sync wearable data first. Immediate alert is required.",
      },
      {
        stepNumber: 2,
        title: "Assess Responsiveness & Normal Breathing",
        description: "Tap patient's shoulder and call loudly. Observe chest for normal breathing.",
        expectedAction: "Check AVPU scale and observe breathing quality for <= 10 seconds.",
        hint: "Gasping or absent breathing in an unresponsive astronaut requires immediate resuscitation.",
      },
      {
        stepNumber: 3,
        title: "Initiate Emergency Resuscitation Protocol",
        description: "Patient is unresponsive with gasping breaths. Move patient to CMRS berth and retrieve Defibrillator and Bag Valve Mask.",
        expectedAction: "Follow microgravity resuscitation protocol. Apply AED pads.",
        hint: "Never delay defibrillator or chest compressions for routine vitals.",
      },
      {
        stepNumber: 4,
        title: "Coordinate Crew Roles & Transmit Telemetry Burst",
        description: "Assign Primary Responder, Equipment Retriever, and Communications Lead. Transmit emergency telemetry packet to Earth.",
        expectedAction: "Confirm crew assignments and log event timestamps in Timeline.",
        hint: "Maintain continuous chronological record for subsequent Flight Surgeon review.",
      },
      {
        stepNumber: 5,
        title: "Post-Stabilization Assessment & Handover",
        description: "AED delivers shock; return of spontaneous pulse noted. Patient breathing shallowly. Now obtain full vital signs set (HR, SpO2, BP).",
        expectedAction: "Enter vital measurements and export Emergency Timeline PDF.",
        hint: "Document all interventions and current state for Mission Control handover.",
      },
    ],
  },
  {
    id: "breathing_difficulty",
    title: "Scenario 2: Acute Breathing Difficulty in Microgravity",
    environment: "iss",
    patientName: "Astronaut Elena Rostova (Commander)",
    initialSummary: "Commander reports sudden progressive dyspnea and tightness while working inside Node 2. Stethoscope reveals audible wheezing.",
    steps: [
      {
        stepNumber: 1,
        title: "Check Cabin Atmosphere & Patient SpO₂",
        description: "Verify cabin CO2 is below threshold and check patient oxygen saturation immediately.",
        expectedAction: "Place pulse oximeter on finger and record SpO₂ reading.",
        hint: "Normal cabin CO2 should be < 3.8 mmHg; low SpO₂ demands prompt oxygen.",
      },
      {
        stepNumber: 2,
        title: "Administer Emergency Oxygen & Rest",
        description: "Provide supplemental oxygen via closed-circuit mask and place astronaut in neutral semi-upright posture.",
        expectedAction: "Deploy Emergency Oxygen Assembly and log start time.",
        hint: "Continuous verbal reassurance reduces work of breathing and autonomic anxiety.",
      },
      {
        stepNumber: 3,
        title: "Establish Flight Surgeon Teleconference",
        description: "Connect to Mission Control via S/G 2 for direct physician guidance.",
        expectedAction: "Initiate Private Medical Conference (PMC) link.",
        hint: "Have current vitals and allergy history ready for handover.",
      },
    ],
  },
  {
    id: "fainting_orthostatic",
    title: "Scenario 3: Post-Exercise Orthostatic Syncope (Fainting)",
    environment: "spacecraft",
    patientName: "Astronaut Marcus Cole (Mission Specialist)",
    initialSummary: "Astronaut unstraps from resistive exercise device and experiences sudden lightheadedness, briefly losing consciousness for 15 seconds.",
    steps: [
      {
        stepNumber: 1,
        title: "Protect From Impact & Assess Consciousness",
        description: "Gently tether astronaut to bulkhead rail to prevent floating into hazardous machinery. Verify rapid return of consciousness.",
        expectedAction: "Assess AVPU. Patient opens eyes and recognizes crewmates.",
        hint: "Transient syncopal episodes in microgravity frequently relate to venous pooling.",
      },
      {
        stepNumber: 2,
        title: "Obtain Blood Pressure & Hydration Check",
        description: "Measure blood pressure and check daily fluid intake log.",
        expectedAction: "Measure BP using automated arm cuff.",
        hint: "Systolic < 90 mmHg indicates orthostatic hypovolemia.",
      },
      {
        stepNumber: 3,
        title: "Oral Rehydration with Electrolyte Solution",
        description: "Administer 500 mL balanced electrolyte fluid and mandate 60-minute rest.",
        expectedAction: "Log fluid intake into Health Reminders and timeline.",
        hint: "Do not return to high-tempo mission operations until cleared.",
      },
    ],
  },
  {
    id: "missing_equipment",
    title: "Scenario 4: Emergency Response with Missing Equipment",
    environment: "spacecraft",
    patientName: "Astronaut Sarah Lin (Science Officer)",
    initialSummary: "Astronaut experiences severe palpitations, but primary pulse oximeter in locker A-1 is marked MISSING or defective.",
    steps: [
      {
        stepNumber: 1,
        title: "Identify Equipment Unavailability",
        description: "Attempted retrieval reveals primary sensor is unavailable.",
        expectedAction: "Mark Pulse Oximeter as UNAVAILABLE in inventory. Do NOT fabricate reading.",
        hint: "Never guess or simulate an unobtained vital sign in an emergency.",
      },
      {
        stepNumber: 2,
        title: "Switch to Manual Palpation Protocol",
        description: "Use tutorial guide to palpate manual radial pulse and count for 60 seconds.",
        expectedAction: "Record manual pulse rate with source marked 'MANUAL_ENTRY'.",
        hint: "Note rhythm irregularity and skin perfusion as clinical proxies.",
      },
    ],
  },
  {
    id: "lunar_eva_event",
    title: "Scenario 5: Lunar Surface Airlock Decompression Event",
    environment: "lunar",
    patientName: "Astronaut David Chen (Lunar Specialist)",
    initialSummary: "Crewmate returns through lunar airlock after surface traverse with severe shoulder pain and localized chest tightness following suit repressurization.",
    steps: [
      {
        stepNumber: 1,
        title: "Surface Airlock Safety & Dust Scrub",
        description: "Ensure airlock reaches nominal habitat pressure (101.3 kPa). Execute regolith dust vacuuming before suit doffing.",
        expectedAction: "Confirm airlock equalization and dust decontamination complete.",
        hint: "Avoid opening suit in dusty airlock to protect open airway from lunar particles.",
      },
      {
        stepNumber: 2,
        title: "Check Procedure Availability",
        description: "Check offline library for 'Lunar EVA Decompression Procedure'.",
        expectedAction: "Verify system shows: 'Approved mission-specific procedure not available in this prototype.'",
        hint: "System must honestly state when approved mission procedures are unavailable.",
      },
    ],
  },
];

// ----------------------------------------------------
// STORAGE KEYS & LOCAL PERSISTENCE HELPERS
// ----------------------------------------------------

const STORAGE_KEYS = {
  ENVIRONMENT: "astra_missioncare_environment",
  VITALS: "astra_missioncare_vitals",
  TIMELINE: "astra_missioncare_timeline",
  ROLES: "astra_missioncare_crew_roles",
  EQUIPMENT: "astra_missioncare_equipment",
  REMINDERS: "astra_missioncare_reminders",
  DEMO_ACTIVE: "astra_missioncare_demo_active",
  DEMO_SCENARIO: "astra_missioncare_demo_scenario",
  DEMO_STEP: "astra_missioncare_demo_step",
};

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
    // Quota safety
  }
}

// ----------------------------------------------------
// PUBLIC SERVICE API
// ----------------------------------------------------

// Environment
export function getActiveEnvironment(): MissionEnvironmentId {
  return readStorage<MissionEnvironmentId>(STORAGE_KEYS.ENVIRONMENT, "spacecraft");
}

export function setActiveEnvironment(env: MissionEnvironmentId): void {
  writeStorage(STORAGE_KEYS.ENVIRONMENT, env);
}

// Vitals
export function getRecordedVitals(): RecordedVital[] {
  return readStorage<RecordedVital[]>(STORAGE_KEYS.VITALS, []);
}

export function saveRecordedVital(vital: Omit<RecordedVital, "id" | "timestamp" | "formattedTime" | "isConcerning">): RecordedVital {
  const all = readStorage<RecordedVital[]>(STORAGE_KEYS.VITALS, []);
  const now = new Date();
  const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const newVital: RecordedVital = {
    ...vital,
    id: `vit-${Date.now()}`,
    timestamp: now.toISOString(),
    formattedTime: timeStr,
    isConcerning: isVitalConcerning(vital.type, vital.value),
  };

  all.unshift(newVital);
  writeStorage(STORAGE_KEYS.VITALS, all);

  // Automatically append to timeline
  addTimelineEntry({
    category: "VITAL",
    title: `Recorded ${VITAL_GUIDES[vital.type].label}: ${vital.value} ${vital.unit}`,
    details: `Source: ${vital.source} · Notes: ${vital.notes || "None"} ${newVital.isConcerning ? "⚠️ CONCERNING VALUE" : "Nominal"}`,
    provenance: vital.source === "SIMULATED_SENSOR" ? "SIMULATED" : "MANUAL_ENTRY",
    author: "Crew Terminal",
    missionDay: vital.missionDay,
  });

  return newVital;
}

// Timeline
export function getTimelineEntries(): TimelineLogEntry[] {
  const defaultEntries: TimelineLogEntry[] = [
    {
      id: "tl-init",
      timestamp: new Date().toISOString(),
      missionDay: 147,
      timeFormatted: "00:00 UTC",
      environment: "spacecraft",
      category: "STATUS_UPDATE",
      title: "MissionCare System Initialized",
      details: "Autonomous emergency assistance and decision support engine active. All cached offline references loaded.",
      provenance: "SYSTEM_GENERATED",
      author: "ASTRA Core",
    },
  ];
  return readStorage<TimelineLogEntry[]>(STORAGE_KEYS.TIMELINE, defaultEntries);
}

export function addTimelineEntry(entry: Omit<TimelineLogEntry, "id" | "timestamp" | "timeFormatted" | "environment"> & { environment?: MissionEnvironmentId }): TimelineLogEntry {
  const all = getTimelineEntries();
  const now = new Date();
  const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
  const env = entry.environment || getActiveEnvironment();

  const newEntry: TimelineLogEntry = {
    ...entry,
    id: `tl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now.toISOString(),
    timeFormatted: timeStr,
    environment: env,
  };

  all.unshift(newEntry);
  writeStorage(STORAGE_KEYS.TIMELINE, all);
  return newEntry;
}

export function clearTimelineEntries(): void {
  writeStorage(STORAGE_KEYS.TIMELINE, []);
}

// Crew Roles
export function getCrewRoles(): CrewMemberRole[] {
  return readStorage<CrewMemberRole[]>(STORAGE_KEYS.ROLES, DEFAULT_CREW_ROLES);
}

export function saveCrewRoles(roles: CrewMemberRole[]): void {
  writeStorage(STORAGE_KEYS.ROLES, roles);
}

export function toggleCrewChecklistItem(roleId: CrewRoleType, itemId: string): CrewMemberRole[] {
  const roles = getCrewRoles();
  const now = new Date();
  const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  const updated = roles.map((r) => {
    if (r.roleId !== roleId) return r;
    return {
      ...r,
      checklist: r.checklist.map((item) => {
        if (item.id !== itemId) return item;
        const newDone = !item.done;
        return {
          ...item,
          done: newDone,
          timestamp: newDone ? timeStr : undefined,
        };
      }),
    };
  });

  saveCrewRoles(updated);
  return updated;
}

// Equipment
export function getEquipmentInventory(): EmergencyEquipmentItem[] {
  return readStorage<EmergencyEquipmentItem[]>(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT_INVENTORY);
}

export function saveEquipmentInventory(items: EmergencyEquipmentItem[]): void {
  writeStorage(STORAGE_KEYS.EQUIPMENT, items);
}

export function updateEquipmentStatus(id: string, status: EmergencyEquipmentItem["status"]): void {
  const items = getEquipmentInventory();
  const updated = items.map((i) => (i.id === id ? { ...i, status } : i));
  saveEquipmentInventory(updated);

  addTimelineEntry({
    category: "EQUIPMENT",
    title: `Equipment Status Changed: ${items.find((i) => i.id === id)?.name || id}`,
    details: `New status: ${status}`,
    provenance: "MANUAL_ENTRY",
    author: "Equipment Lead",
    missionDay: 147,
  });
}

// Reminders
export function getHealthReminders(): HealthReminderItem[] {
  return readStorage<HealthReminderItem[]>(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
}

export function saveHealthReminders(reminders: HealthReminderItem[]): void {
  writeStorage(STORAGE_KEYS.REMINDERS, reminders);
}

export function addHealthReminder(reminder: Omit<HealthReminderItem, "id">): HealthReminderItem {
  const all = getHealthReminders();
  const newItem: HealthReminderItem = {
    ...reminder,
    id: `rem-${Date.now()}`,
  };
  all.push(newItem);
  saveHealthReminders(all);
  return newItem;
}

export function toggleHealthReminder(id: string): void {
  const all = getHealthReminders();
  const updated = all.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
  saveHealthReminders(updated);
}

export function deleteHealthReminder(id: string): void {
  const all = getHealthReminders();
  const filtered = all.filter((r) => r.id !== id);
  saveHealthReminders(filtered);
}

// Simulation Training Demo Mode
export function isTrainingDemoActive(): boolean {
  return readStorage<boolean>(STORAGE_KEYS.DEMO_ACTIVE, false);
}

export function setTrainingDemoActive(active: boolean): void {
  writeStorage(STORAGE_KEYS.DEMO_ACTIVE, active);
}

export function getActiveTrainingScenarioId(): string {
  return readStorage<string>(STORAGE_KEYS.DEMO_SCENARIO, "chest_pain_collapse");
}

export function setActiveTrainingScenarioId(scenarioId: string): void {
  writeStorage(STORAGE_KEYS.DEMO_SCENARIO, scenarioId);
  writeStorage(STORAGE_KEYS.DEMO_STEP, 1);
}

export function getTrainingScenarioStep(): number {
  return readStorage<number>(STORAGE_KEYS.DEMO_STEP, 1);
}

export function setTrainingScenarioStep(step: number): void {
  writeStorage(STORAGE_KEYS.DEMO_STEP, step);
}

// ----------------------------------------------------
// PDF EXPORT ENGINE FOR EMERGENCY EVENT TIMELINE
// ----------------------------------------------------

export function generateEmergencyTimelinePDF(entries = getTimelineEntries(), envId = getActiveEnvironment()): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const env = MISSION_ENVIRONMENTS[envId];
  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const navy = [8, 23, 38];
  const cyan = [14, 165, 233];
  const rose = [244, 63, 94];
  const darkText = [30, 41, 59];
  const mutedText = [100, 116, 139];
  const borderGray = [226, 232, 240];
  const lightBg = [248, 250, 252];

  // Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Rose emergency accent line
  doc.setFillColor(rose[0], rose[1], rose[2]);
  doc.rect(0, 28, pageWidth, 1.5, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("ASTRA MISSIONCARE · SPACE MEDICAL EMERGENCY TIMELINE", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 215, 235);
  doc.text("CHRONOLOGICAL MEDICAL EVENT LOG & CLINICAL HANDOVER SUMMARY", margin, 19);

  // Top Right Meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`ENVIRONMENT: ${env.name.toUpperCase()}`, pageWidth - margin, 12, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 215, 235);
  doc.text(`COMM LATENCY: ${env.commLatencyMinutes} MIN ONE-WAY`, pageWidth - margin, 19, { align: "right" });

  let curY = 36;

  // Environment & Safety Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 18, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(rose[0], rose[1], rose[2]);
  doc.text("LEGAL & CLINICAL DISCLAIMER (NON-DIAGNOSTIC PROTOTYPE)", margin + 4, curY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(
    "This event record is generated for educational exploration and Flight Surgeon telemedicine handover. It does not assert a certified clinical diagnosis.",
    margin + 4,
    curY + 10,
  );
  doc.text(
    `Gravity: ${env.gravityLabel}  |  Ground Link: ${env.commSummary}`,
    margin + 4,
    curY + 14.5,
  );

  curY += 24;

  // Timeline Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("CHRONOLOGICAL EVENT LOG", margin, curY);

  curY += 5;

  // Timeline Table Rows
  entries.slice(0, 16).forEach((entry, idx) => {
    if (curY > 265) {
      doc.addPage();
      curY = 20;
    }

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(margin, curY, contentWidth, 13, 1, 1, "FD");

    // Category Badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    const catColor = entry.category === "ALERT" ? rose : entry.category === "VITAL" ? cyan : darkText;
    doc.setTextColor(catColor[0], catColor[1], catColor[2]);
    doc.text(`[${entry.category}]`, margin + 3, curY + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(entry.title, margin + 28, curY + 4.5);

    // Time & Provenance
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(`${entry.timeFormatted} (Day ${entry.missionDay})`, pageWidth - margin - 3, curY + 4.5, { align: "right" });

    // Details Line
    const lines = doc.splitTextToSize(entry.details, contentWidth - 32);
    doc.text(lines[0] || "", margin + 28, curY + 9.5);

    curY += 15;
  });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text("ASTRA MISSIONCARE · NOT A DIAGNOSTIC DEVICE · CERTIFIED CREW FIRST-RESPONDER PROTOCOL", margin, 290);
  doc.text(`GENERATED: ${new Date().toUTCString()}`, pageWidth - margin, 290, { align: "right" });

  return doc;
}

export function downloadEmergencyTimelinePDF(entries = getTimelineEntries(), envId = getActiveEnvironment()): string {
  const doc = generateEmergencyTimelinePDF(entries, envId);
  const filename = `ASTRA_MissionCare_Emergency_Timeline_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
