import { describe, it, expect, beforeEach } from "vitest";
import {
  saveMentalCheckin,
  getMentalCheckins,
  getTodayCheckin,
  computePersonalBaseline,
  generateWellnessSuggestions,
  saveRecoverySession,
  getRecoveryLogs,
  saveJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  clearAllJournalEntries,
  saveDebriefRecord,
  getDebriefRecords,
  saveReactionRecord,
  getReactionRecords,
  getActiveDemoScenario,
  setActiveDemoScenario,
  DEMO_SCENARIOS,
  type MentalCheckinEntry,
} from "../services/mindspaceService";

describe("ASTRA MindSpace Service & Resilience Engine", () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveDemoScenario("NONE");
  });

  describe("Daily Mental Check-in & Storage", () => {
    it("saves and retrieves a voluntary mental check-in entry", () => {
      const entry = saveMentalCheckin({
        mood: "good",
        stress: 4,
        energy: "moderate",
        sleep: "restful",
        focus: "sharp",
        crewConnection: "strong",
        privateNote: "Felt productive during Airlock checkout.",
        missionDay: 147,
      });

      expect(entry.id).toBeDefined();
      expect(entry.stress).toBe(4);
      expect(entry.mood).toBe("good");
      expect(entry.provenance).toBe("SELF-REPORTED");

      const all = getMentalCheckins();
      expect(all.length).toBeGreaterThanOrEqual(1);
      expect(all[0].id).toBe(entry.id);
    });

    it("retrieves today's checkin for the specified mission day", () => {
      saveMentalCheckin({
        mood: "great",
        stress: 2,
        energy: "high",
        sleep: "restful",
        focus: "sharp",
        crewConnection: "strong",
        missionDay: 147,
      });

      const today = getTodayCheckin(147);
      expect(today).toBeDefined();
      expect(today?.mood).toBe("great");
      expect(today?.stress).toBe(2);
    });
  });

  describe("Personal Baseline Computation", () => {
    it("indicates insufficient data when fewer than 3 check-ins exist", () => {
      const entries: MentalCheckinEntry[] = [
        {
          id: "1",
          timestamp: "2026-11-15T08:00:00Z",
          timeFormatted: "08:00 UTC",
          dateFormatted: "Day 146",
          mood: "good",
          stress: 3,
          energy: "moderate",
          sleep: "restful",
          focus: "sharp",
          crewConnection: "strong",
          missionDay: 146,
          provenance: "SELF-REPORTED",
        },
      ];

      const baseline = computePersonalBaseline(entries);
      expect(baseline.hasSufficientData).toBe(false);
      expect(baseline.avgStress).toBeNull();
      expect(baseline.observationCount).toBe(1);
    });

    it("computes accurate baseline averages when >= 3 entries exist", () => {
      const entries: MentalCheckinEntry[] = [
        {
          id: "1",
          timestamp: "2026-11-13T08:00:00Z",
          timeFormatted: "08:00 UTC",
          dateFormatted: "Day 145",
          mood: "good",
          stress: 3,
          energy: "moderate",
          sleep: "restful",
          focus: "sharp",
          crewConnection: "strong",
          missionDay: 145,
          provenance: "SELF-REPORTED",
        },
        {
          id: "2",
          timestamp: "2026-11-14T08:00:00Z",
          timeFormatted: "08:00 UTC",
          dateFormatted: "Day 146",
          mood: "neutral",
          stress: 5,
          energy: "moderate",
          sleep: "delayed",
          focus: "manageable",
          crewConnection: "moderate",
          missionDay: 146,
          provenance: "SELF-REPORTED",
        },
        {
          id: "3",
          timestamp: "2026-11-15T08:00:00Z",
          timeFormatted: "08:00 UTC",
          dateFormatted: "Day 147",
          mood: "stressed",
          stress: 7,
          energy: "low",
          sleep: "insufficient",
          focus: "scattered",
          crewConnection: "strained",
          missionDay: 147,
          provenance: "SELF-REPORTED",
        },
      ];

      const baseline = computePersonalBaseline(entries);
      expect(baseline.hasSufficientData).toBe(true);
      expect(baseline.observationCount).toBe(3);
      // (3 + 5 + 7) / 3 = 5.0
      expect(baseline.avgStress).toBe(5);
    });
  });

  describe("Transparent Wellness Suggestions Engine", () => {
    it("suggests guided breathing when stress is elevated", () => {
      const checkin: MentalCheckinEntry = {
        id: "c-elevated",
        timestamp: "2026-11-15T08:00:00Z",
        timeFormatted: "08:00 UTC",
        dateFormatted: "Day 147",
        mood: "stressed",
        stress: 8,
        energy: "low",
        sleep: "delayed",
        focus: "manageable",
        crewConnection: "moderate",
        missionDay: 147,
        provenance: "SELF-REPORTED",
      };

      const baseline = computePersonalBaseline([checkin, checkin, checkin]);
      const suggestions = generateWellnessSuggestions(checkin, baseline);

      expect(suggestions.length).toBeGreaterThan(0);
      const breathingSug = suggestions.find((s) => s.actionTab === "recovery");
      expect(breathingSug).toBeDefined();
      expect(breathingSug?.priority).toBe("high");
      expect(breathingSug?.reason).toContain("8/10");
    });

    it("suggests debrief / harmony protocol when crew connection is strained", () => {
      const checkin: MentalCheckinEntry = {
        id: "c-strained",
        timestamp: "2026-11-15T08:00:00Z",
        timeFormatted: "08:00 UTC",
        dateFormatted: "Day 147",
        mood: "neutral",
        stress: 4,
        energy: "moderate",
        sleep: "restful",
        focus: "sharp",
        crewConnection: "strained",
        missionDay: 147,
        provenance: "SELF-REPORTED",
      };

      const baseline = computePersonalBaseline([checkin, checkin, checkin]);
      const suggestions = generateWellnessSuggestions(checkin, baseline);

      const harmonySug = suggestions.find((s) => s.actionTab === "harmony");
      expect(harmonySug).toBeDefined();
      expect(harmonySug?.title).toContain("Crew Harmony");
    });
  });

  describe("Stress Recovery Logging", () => {
    it("records a completed recovery session with stress delta", () => {
      const session = saveRecoverySession({
        activityType: "breathing",
        title: "3-Minute Resonant Breathing",
        durationSeconds: 180,
        beforeStress: 6,
        afterStress: 3,
      });

      expect(session.id).toBeDefined();
      expect(session.stressDelta).toBe(-3);

      const logs = getRecoveryLogs();
      expect(logs.length).toBeGreaterThanOrEqual(1);
      expect(logs[0].title).toBe("3-Minute Resonant Breathing");
    });
  });

  describe("Confidential Reflection Journal", () => {
    it("creates, retrieves, and deletes private local journal entries", () => {
      const entry = saveJournalEntry({
        title: "Station Horizon Reflection",
        content: "Quiet orbital sunrise through Cupola window.",
        mood: "great",
        prompt: "What perspective keeps you grounded?",
      });

      expect(entry.id).toBeDefined();
      expect(entry.title).toBe("Station Horizon Reflection");

      let entries = getJournalEntries();
      expect(entries.some((e) => e.id === entry.id)).toBe(true);

      deleteJournalEntry(entry.id);
      entries = getJournalEntries();
      expect(entries.some((e) => e.id === entry.id)).toBe(false);
    });

    it("clears all journal entries when confirmed", () => {
      saveJournalEntry({ title: "Note 1", content: "Test 1", mood: "good" });
      saveJournalEntry({ title: "Note 2", content: "Test 2", mood: "neutral" });

      expect(getJournalEntries().length).toBeGreaterThanOrEqual(2);

      clearAllJournalEntries();
      expect(getJournalEntries().length).toBe(0);
    });
  });

  describe("Crew Debrief & Reaction Tests", () => {
    it("saves and retrieves mission debrief records", () => {
      const rec = saveDebriefRecord({
        missionDay: 147,
        topic: "EVA Umbilical Line Handoff",
        strengths: "Fast verification of tertiary seal.",
        bottlenecks: "Radio congestion during depress sequence.",
        adjustments: "Designate dedicated silent com window.",
        actionItems: ["Update flight data file item 4b"],
      });

      expect(rec.id).toBeDefined();
      const debriefs = getDebriefRecords();
      expect(debriefs.length).toBeGreaterThanOrEqual(1);
      expect(debriefs[0].topic).toBe("EVA Umbilical Line Handoff");
    });

    it("records psychomotor reaction trials and computes median accurately", () => {
      const trialMs = [230, 245, 220, 260, 235];
      const record = saveReactionRecord({
        missionDay: 147,
        trialTimesMs: trialMs,
        earlyClicks: 0,
      });

      expect(record.id).toBeDefined();
      expect(record.medianMs).toBe(235);
      expect(record.avgMs).toBe(238);

      const records = getReactionRecords();
      expect(records.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Demonstration Scenarios", () => {
    it("switches active demo scenarios and reflects synthetic data", () => {
      expect(getActiveDemoScenario()).toBe("NONE");

      setActiveDemoScenario("ELEVATED_STRESS");
      expect(getActiveDemoScenario()).toBe("ELEVATED_STRESS");

      const checkins = getMentalCheckins();
      expect(checkins.length).toBeGreaterThan(0);
      expect(checkins[0].provenance).toBe("SIMULATED");

      const scenarioData = DEMO_SCENARIOS.ELEVATED_STRESS;
      expect(scenarioData.name).toBe("Elevated Stress");
    });
  });
});
