import { describe, it, expect } from "vitest";
import { buildReportData, generateHealthReportPDF } from "../services/pdfReport";
import { useStore } from "../state/store";

describe("PDF Health Report Service", () => {
  it("builds structured 3-page report data from store state", () => {
    const state = useStore.getState();
    const data = buildReportData(state.mission, state.checkins, state.mission.day);

    expect(data.day).toBe(state.mission.day);
    expect(data.status).toMatch(/NOMINAL|ATTENTION/);
    expect(data.currentReading).toBeDefined();
    expect(data.currentReading.hr).toBeDefined();
    expect(data.currentReading.spo2).toBeDefined();
    expect(data.currentReading.stress).toBeDefined();
    expect(data.currentReading.activity).toBeDefined();

    expect(data.dayReadings.length).toBeGreaterThan(0);
    expect(data.baseline).toBeDefined();
    expect(data.metrics).toBeDefined();
  });

  it("generates a valid 3-page jsPDF document", () => {
    const state = useStore.getState();
    const data = buildReportData(state.mission, state.checkins, state.mission.day);
    const doc = generateHealthReportPDF(data);

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(3);
  });

  it("gracefully builds report data for historical days", () => {
    const state = useStore.getState();
    const pastDay = Math.max(1, state.mission.day - 2);
    const data = buildReportData(state.mission, state.checkins, pastDay);

    expect(data.day).toBe(pastDay);
    expect(data.baseline.hr).toBe(68);
  });
});
