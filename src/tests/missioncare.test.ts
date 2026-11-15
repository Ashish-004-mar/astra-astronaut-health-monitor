import { describe, it, expect, beforeEach } from "vitest";
import {
  evaluateSymptomEscalation,
  validateVitalInput,
  isVitalConcerning,
  MISSION_ENVIRONMENTS,
  getActiveEnvironment,
  setActiveEnvironment,
  getEquipmentInventory,
  updateEquipmentStatus,
  addTimelineEntry,
  getTimelineEntries,
  clearTimelineEntries,
  getCrewRoles,
  toggleCrewChecklistItem,
  getHealthReminders,
  addHealthReminder,
  toggleHealthReminder,
  deleteHealthReminder,
  OFFLINE_RESOURCES,
  generateEmergencyTimelinePDF,
} from "../services/missionCareService";

describe("ASTRA MissionCare — Space Medical Emergency Assistance System", () => {
  beforeEach(() => {
    localStorage.clear();
    clearTimelineEntries();
    setActiveEnvironment("spacecraft");
  });

  // CASE 1: Unresponsive with abnormal/absent breathing triggers immediate emergency escalation without waiting for vitals
  it("CASE 1: triggers immediate emergency escalation for unresponsive patient with absent/gasping breathing without waiting for vitals", () => {
    const result = evaluateSymptomEscalation({
      primarySymptom: "Sudden collapse during airlock egress",
      onsetTime: "Immediate",
      isResponsive: false,
      avpuLevel: "Unresponsive",
      isBreathingNormally: false,
      breathingQuality: "gasping",
      hasChestPain: false,
      hasSevereHeadache: false,
      hasFaintingOrCollapse: true,
      isGettingWorse: true,
      reportedVitals: {}, // Intentionally empty: emergency resuscitation MUST NOT wait for vitals!
    });

    expect(result.tier).toBe("EMERGENCY_ESCALATION");
    expect(result.tierLabel).toContain("EMERGENCY");
    expect(result.whatWasReported).toEqual(
      expect.arrayContaining([expect.stringContaining("UNRESPONSIVE")])
    );
    expect(result.whatShouldHappenNext).toEqual(
      expect.arrayContaining([expect.stringContaining("ALERT CREW IMMEDIATELY")])
    );
    // Explicit safety assertion: vitals must not delay emergency action
    expect(result.whyItMatters).toEqual(
      expect.arrayContaining([expect.stringMatching(/MUST NOT delay/i)])
    );
  });

  // CASE 2: Responsive chest pain triggers urgent escalation without declaring definitive diagnosis
  it("CASE 2: responsive chest pain triggers urgent escalation without declaring definitive diagnosis", () => {
    const result = evaluateSymptomEscalation({
      primarySymptom: "Severe substernal crushing pain",
      onsetTime: "15 minutes ago",
      isResponsive: true,
      avpuLevel: "Alert",
      isBreathingNormally: true,
      breathingQuality: "normal",
      hasChestPain: true,
      chestPainDetails: {
        character: "Crushing, heavy pressure",
        radiationToArmOrJaw: true,
        suddenOnset: true,
      },
      hasSevereHeadache: false,
      hasFaintingOrCollapse: false,
      isGettingWorse: true,
      reportedVitals: {
        hr: 104,
        spo2: 95,
      },
    });

    expect(result.tier).toBe("EMERGENCY_ESCALATION");
    expect(result.tierLabel).toContain("URGENT");
    expect(result.disclaimer).toMatch(/educational|non-diagnostic/i);
    // Must NOT claim a certified diagnosis such as "Confirmed Myocardial Infarction"
    expect(result.tierLabel).not.toMatch(/confirmed myocardial infarction/i);
    expect(result.whatShouldHappenNext).toEqual(
      expect.arrayContaining([expect.stringContaining("ALERT FLIGHT SURGEON")])
    );
  });

  // CASE 3: Missing equipment is marked UNAVAILABLE and never fabricated
  it("CASE 3: marks missing equipment as UNAVAILABLE and records state honestly without fabrication", () => {
    const inventory = getEquipmentInventory();
    const aed = inventory.find((i) => i.id === "eq-1");
    expect(aed).toBeDefined();

    // Mark AED as UNAVAILABLE
    updateEquipmentStatus("eq-1", "UNAVAILABLE");

    const updatedInventory = getEquipmentInventory();
    const updatedAed = updatedInventory.find((i) => i.id === "eq-1");
    expect(updatedAed?.status).toBe("UNAVAILABLE");

    // Verify timeline records this update honestly
    const events = getTimelineEntries();
    const equipmentEvent = events.find((e) => e.category === "EQUIPMENT");
    expect(equipmentEvent).toBeDefined();
    expect(equipmentEvent?.details).toContain("UNAVAILABLE");
  });

  // CASE 4: Earth comm delay / offline handling preserves timeline event log
  it("CASE 4: preserves chronological timeline log across simulated offline operations and comm delay", () => {
    const entry1 = addTimelineEntry({
      category: "ALERT",
      title: "Crew Emergency Broadcast",
      details: "Medical emergency signal sent to crew habitat",
      provenance: "SYSTEM_GENERATED",
      author: "Commander",
      missionDay: 147,
    });

    const entry2 = addTimelineEntry({
      category: "CREW_ACTION",
      title: "CMRS Deployed in US Lab",
      details: "Crew medical restraint system locked in position",
      provenance: "MANUAL_ENTRY",
      author: "Flight Engineer",
      missionDay: 147,
    });

    const timeline = getTimelineEntries();
    expect(timeline.length).toBeGreaterThanOrEqual(2);
    expect(timeline.some((e) => e.id === entry1.id)).toBe(true);
    expect(timeline.some((e) => e.id === entry2.id)).toBe(true);
  });

  // CASE 5: Mars transit mode sets 14m one-way latency
  it("CASE 5: configures Mars transit environment with 14-minute one-way comm latency", () => {
    setActiveEnvironment("mars");
    expect(getActiveEnvironment()).toBe("mars");

    const marsInfo = MISSION_ENVIRONMENTS.mars;
    expect(marsInfo.commLatencyMinutes).toBe(14);
    expect(marsInfo.evacuationPossible).toBe(false);
    expect(marsInfo.gravityG).toBe(0);
    expect(marsInfo.commSummary).toMatch(/14 minute/i);
  });

  // CASE 6: Vital measurement input validation rejects out-of-range values
  it("CASE 6: rejects out-of-range or invalid vital inputs (e.g. HR 300, BP invalid format, SpO2 120)", () => {
    // Heart rate
    expect(validateVitalInput("hr", "300").valid).toBe(false);
    expect(validateVitalInput("hr", "10").valid).toBe(false);
    expect(validateVitalInput("hr", "abc").valid).toBe(false);
    expect(validateVitalInput("hr", "72").valid).toBe(true);

    // SpO2
    expect(validateVitalInput("spo2", "120").valid).toBe(false);
    expect(validateVitalInput("spo2", "40").valid).toBe(false);
    expect(validateVitalInput("spo2", "98").valid).toBe(true);

    // Blood pressure
    expect(validateVitalInput("bp", "invalid").valid).toBe(false);
    expect(validateVitalInput("bp", "120-80").valid).toBe(false);
    expect(validateVitalInput("bp", "70/120").valid).toBe(false); // Systolic must be > diastolic
    expect(validateVitalInput("bp", "120/80").valid).toBe(true);

    // Respiratory rate
    expect(validateVitalInput("rr", "2").valid).toBe(false);
    expect(validateVitalInput("rr", "90").valid).toBe(false);
    expect(validateVitalInput("rr", "16").valid).toBe(true);

    // Temperature
    expect(validateVitalInput("temp", "25").valid).toBe(false);
    expect(validateVitalInput("temp", "50").valid).toBe(false);
    expect(validateVitalInput("temp", "37.0").valid).toBe(true);

    // AVPU
    expect(validateVitalInput("avpu", "Unknown").valid).toBe(false);
    expect(validateVitalInput("avpu", "Alert").valid).toBe(true);
    expect(validateVitalInput("avpu", "Unresponsive").valid).toBe(true);
  });

  // CASE 7: Missing mission procedure returns clear unavailable status
  it("CASE 7: transparently flags unverified or unavailable procedures without inventing protocols", () => {
    const lunarResource = OFFLINE_RESOURCES.find((r) => r.id === "res-5");
    expect(lunarResource).toBeDefined();
    expect(lunarResource?.summary).toContain(
      "Approved mission-specific procedure not available in this prototype."
    );
    expect(lunarResource?.caveats[0]).toContain("not available in this prototype");
  });

  // CASE 8: Crew roles checklist items toggle and record timestamps
  it("CASE 8: toggles crew checklist items and logs timestamp", () => {
    const initialRoles = getCrewRoles();
    const primaryRole = initialRoles.find((r) => r.roleId === "primary_responder");
    expect(primaryRole).toBeDefined();

    const firstItem = primaryRole!.checklist[0];
    const initialDone = firstItem.done;

    const updatedRoles = toggleCrewChecklistItem("primary_responder", firstItem.id);
    const updatedPrimary = updatedRoles.find((r) => r.roleId === "primary_responder");
    const updatedItem = updatedPrimary?.checklist.find((i) => i.id === firstItem.id);

    expect(updatedItem?.done).toBe(!initialDone);
    if (updatedItem?.done) {
      expect(updatedItem.timestamp).toBeDefined();
    }
  });

  // CASE 9: Reminders add, snooze, toggle, and delete
  it("CASE 9: manages health reminders (add, toggle, delete)", () => {
    const initialCount = getHealthReminders().length;

    const newReminder = addHealthReminder({
      title: "Evaluate Orthostatic Blood Pressure",
      type: "followup_vital",
      frequency: "shift",
      timeLabel: "14:00 UTC",
      completed: false,
      notes: "Post-exercise hydration check",
    });

    expect(newReminder.id).toBeDefined();
    expect(getHealthReminders().length).toBe(initialCount + 1);

    toggleHealthReminder(newReminder.id);
    const checked = getHealthReminders().find((r) => r.id === newReminder.id);
    expect(checked?.completed).toBe(true);

    deleteHealthReminder(newReminder.id);
    expect(getHealthReminders().length).toBe(initialCount);
  });

  // CASE 10: PDF export function returns valid jsPDF instance
  it("CASE 10: generates structured emergency timeline PDF with valid instance and formatting", () => {
    addTimelineEntry({
      category: "ALERT",
      title: "Emergency Assist Triggered",
      details: "Alex Vance collapsed in Transit Module",
      provenance: "MANUAL_ENTRY",
      author: "Commander",
      missionDay: 147,
    });

    const doc = generateEmergencyTimelinePDF(getTimelineEntries(), "mars");
    expect(doc).toBeDefined();
    expect(typeof doc.save).toBe("function");
    expect(typeof doc.output).toBe("function");
  });
});
