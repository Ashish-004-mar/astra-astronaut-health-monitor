import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateWellnessMetrics,
  getWellnessRecords,
  saveWellnessRecord,
  deleteWellnessRecord,
  getWellnessStats,
  resetToDefaultWellnessRecords,
} from "../services/wellnessService";
import { generateWellnessCheckinPDF } from "../services/wellnessPdfReport";

describe("ASTRA Wellness Check-in Database & Scoring Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calculates optimal score (95+) for nominal answers", () => {
    const res = calculateWellnessMetrics({
      Sleep: "Good",
      Energy: "High",
      Stress: "Low",
      Mood: "Good",
      "Physical discomfort": "None",
    });

    expect(res.score).toBe(100);
    expect(res.status).toBe("OPTIMAL");
    expect(res.summary).toContain("nominal operational readiness");
    expect(res.countermeasure).toContain("Maintain nominal flight profile");
  });

  it("calculates degraded score and triggers ATTENTION status when multiple flags are present", () => {
    const res = calculateWellnessMetrics({
      Sleep: "Poor",
      Energy: "Low",
      Stress: "High",
      Mood: "Low",
      "Physical discomfort": "Significant",
    });

    // 100 - 18 - 15 - 18 - 14 - 20 = 15 => clamped to 30 minimum
    expect(res.score).toBe(30);
    expect(res.status).toBe("ATTENTION");
    expect(res.countermeasure).toContain("Musculoskeletal decompression");
  });

  it("calculates NOMINAL status for moderate conditions", () => {
    const res = calculateWellnessMetrics({
      Sleep: "Fair",
      Energy: "Normal",
      Stress: "Medium",
      Mood: "Okay",
      "Physical discomfort": "None",
    });

    // 100 - 8 - 5 - 8 - 6 - 0 = 73
    expect(res.score).toBe(73);
    expect(res.status).toBe("NOMINAL");
  });

  it("manages persistent database storage with seed fallback and CRUD", () => {
    // 1. Initial get should return seeded records
    const initial = getWellnessRecords();
    expect(initial.length).toBeGreaterThanOrEqual(3);
    expect(initial[0].missionDay).toBe(147);

    // 2. Save a new checkin
    const newRec = saveWellnessRecord({
      missionDay: 148,
      date: "2026-11-15",
      answers: {
        Sleep: "Good",
        Energy: "High",
        Stress: "Low",
        Mood: "Good",
        "Physical discomfort": "None",
        Notes: "Pre-spacewalk checklist complete.",
      },
    });

    expect(newRec.id).toBeDefined();
    expect(newRec.score).toBe(100);
    expect(newRec.answers.Notes).toBe("Pre-spacewalk checklist complete.");

    const updated = getWellnessRecords();
    expect(updated[0].id).toBe(newRec.id);
    expect(updated.length).toBe(initial.length + 1);

    // 3. Stats calculation
    const stats = getWellnessStats(updated);
    expect(stats.totalCount).toBe(updated.length);
    expect(stats.latestScore).toBe(100);
    expect(stats.optimalCount).toBeGreaterThan(0);

    // 4. Delete record
    const afterDelete = deleteWellnessRecord(newRec.id);
    expect(afterDelete.length).toBe(initial.length);
    expect(afterDelete.find((r) => r.id === newRec.id)).toBeUndefined();
  });

  it("generates a valid single-page PDF document for a wellness record", () => {
    const record = {
      id: "chk-test-123456",
      missionDay: 147,
      date: "2026-11-14",
      timeFormatted: "10:30 UTC",
      timestamp: "2026-11-14T10:30:00.000Z",
      crewMember: "Commander Alex Mercer (AC-01)",
      station: "LEO Habitat Module ASTRA",
      answers: {
        Sleep: "Good",
        Energy: "High",
        Stress: "Low",
        Mood: "Good",
        "Physical discomfort": "None",
        Notes: "All systems nominal for EVA-3.",
      },
      score: 100,
      readinessStatus: "OPTIMAL" as const,
      statusColor: "#10b981",
      summary: "Crew member demonstrates excellent physical endurance.",
      countermeasure: "Maintain nominal flight profile and CEVIS workout.",
      provenance: "SELF-REPORTED" as const,
    };

    const doc = generateWellnessCheckinPDF(record);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(1);

    // Test output string generation
    const pdfDataUri = doc.output("datauristring");
    expect(pdfDataUri).toContain("data:application/pdf");
  });
});
