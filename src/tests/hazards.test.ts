import { describe, it, expect, beforeEach } from "vitest";
import {
  NASA_FIVE_HAZARDS,
  getExerciseSessions,
  logExerciseSession,
  getTodayExerciseDuration,
  getReactionTestRecords,
  saveReactionTestRecord,
  getCabinScenario,
  setCabinScenario,
  getCabinReadings,
  testOfflineReadiness,
} from "../services/hazardService";

describe("NASA Five Spaceflight Hazards & Subsystems", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defines the five canonical NASA Human Research Program hazards", () => {
    expect(NASA_FIVE_HAZARDS.length).toBe(5);
    const ids = NASA_FIVE_HAZARDS.map((h) => h.id);
    expect(ids).toContain("radiation");
    expect(ids).toContain("isolation");
    expect(ids).toContain("distance");
    expect(ids).toContain("gravity");
    expect(ids).toContain("environment");
  });

  it("records exercise sessions and computes daily countermeasure duration", () => {
    const initialDur = getTodayExerciseDuration(147);
    expect(initialDur).toBeGreaterThanOrEqual(0);

    const logged = logExerciseSession({
      exerciseType: "Resistance (ARED)",
      durationMinutes: 40,
      missionDay: 147,
      caloriesBurned: 300,
    });

    expect(logged.id).toBeDefined();
    const updatedDur = getTodayExerciseDuration(147);
    expect(updatedDur).toBe(initialDur + 40);
  });

  it("stores reaction time records and identifies cognitive vigilance status", () => {
    const fastRecord = saveReactionTestRecord(230, false);
    expect(fastRecord.status).toBe("GOOD");

    const averageRecord = saveReactionTestRecord(300, false);
    expect(averageRecord.status).toBe("AVERAGE");

    const slowRecord = saveReactionTestRecord(390, false);
    expect(slowRecord.status).toBe("NEEDS_REST");

    const earlyRecord = saveReactionTestRecord(120, true);
    expect(earlyRecord.status).toBe("NEEDS_REST");
  });

  it("simulates deterministic cabin environmental scenarios", () => {
    setCabinScenario("NORMAL");
    const normalReadings = getCabinReadings("NORMAL");
    expect(normalReadings.at(-1)?.co2Ppm).toBeLessThan(3800);

    setCabinScenario("ELEVATED_CO2");
    const elevatedReadings = getCabinReadings("ELEVATED_CO2");
    expect(elevatedReadings.at(-1)?.co2Ppm).toBeGreaterThan(4000);
    expect(elevatedReadings.at(-1)?.status).toBe("ATTENTION");
  });

  it("verifies offline mission readiness across client subsystems", async () => {
    const checks = await testOfflineReadiness();
    expect(checks.length).toBeGreaterThanOrEqual(6);
    for (const c of checks) {
      expect(["READY", "CACHED", "UNAVAILABLE"]).toContain(c.status);
    }
  });
});
