import { describe, it, expect, beforeEach } from "vitest";
import {
  evaluateWaterSafety,
  getAquaGuardState,
  setAquaGuardScenario,
  addHydrationLog,
  addWaterSample,
  getTodayHydrationTotal,
  resetAquaGuardToDefaults,
  updateHydrationTarget,
  NASA_WATER_LIMITS,
} from "../services/aquaguardService";
import { audioAlertService } from "../services/audioAlertService";

describe("ASTRA AquaGuard - Water Safety & Hydration Engine", () => {
  beforeEach(() => {
    localStorage.clear();
    audioAlertService.silenceAlarm();
    resetAquaGuardToDefaults();
  });

  it("evaluates nominal water chemistry within NASA limits as NOMINAL", () => {
    const res = evaluateWaterSafety(240, 1.2, "NEGATIVE");
    expect(res.status).toBe("NOMINAL");
    expect(res.reason).toContain("All in-line sensors within NASA SMCL envelope");
    expect(res.nextStep).toContain("Potable water supply nominal");
  });

  it("evaluates TOC exceeding 500 ppb as ATTENTION with isolation directive", () => {
    const res = evaluateWaterSafety(620, 1.5, "NEGATIVE");
    expect(res.status).toBe("ATTENTION");
    expect(res.reason).toContain("exceeds NASA Spacecraft Maximum Contaminant Level");
    expect(res.nextStep).toContain("ISOLATE Galley PWD line");
  });

  it("evaluates pending microbial culture as UNVERIFIED, never assuming safety", () => {
    const res = evaluateWaterSafety(200, 1.0, "PENDING");
    expect(res.status).toBe("UNVERIFIED");
    expect(res.reason).toContain("culture incubation is currently in progress");
    expect(res.nextStep).toContain("Treat potable lines as UNVERIFIED");
  });

  it("evaluates flagged microbial coliform culture as ATTENTION with quarantine directive", () => {
    const res = evaluateWaterSafety(240, 1.2, "FLAGGED");
    expect(res.status).toBe("ATTENTION");
    expect(res.reason).toContain("flagged colonies (>1 CFU/100 mL)");
    expect(res.nextStep).toContain("QUARANTINE Galley Potable Water Dispenser");
  });

  it("triggers audible audio alert and siren when switching to ELEVATED_TOC and MICROBIAL_FLAG", () => {
    const stateElevated = setAquaGuardScenario("ELEVATED_TOC");
    expect(stateElevated.scenario).toBe("ELEVATED_TOC");
    expect(stateElevated.samples[0].tocPpb).toBe(620);

    const alerts = audioAlertService.getActiveAlerts();
    expect(alerts.some((a) => a.id === "aquaguard-elevated-toc")).toBe(true);

    // Silence alarm
    audioAlertService.silenceAlarm();
    expect(audioAlertService.getIsMuted()).toBe(true);

    // Switch to Nominal clears alerts
    const stateNominal = setAquaGuardScenario("NOMINAL");
    expect(stateNominal.scenario).toBe("NOMINAL");
    const alertsAfter = audioAlertService.getActiveAlerts();
    expect(alertsAfter.some((a) => a.id === "aquaguard-elevated-toc")).toBe(false);
  });

  it("tracks hydration intake and updates daily totals", () => {
    const initial = getTodayHydrationTotal(147);
    addHydrationLog(250, "Pouch 1");
    addHydrationLog(500, "Meal Rehydration");

    const updated = getTodayHydrationTotal(147);
    expect(updated).toBe(initial + 750);
  });

  it("validates manual sample inputs and rejects out-of-range values", () => {
    // Negative TOC
    const invalidToc = addWaterSample({
      source: "Galley PWD",
      tocPpb: -50,
      conductivityUscm: 1.5,
      microbialStatus: "NEGATIVE",
    });
    expect(invalidToc.success).toBe(false);
    expect(invalidToc.error).toContain("between 0 and 5,000 ppb");

    // Out of range conductivity
    const invalidCond = addWaterSample({
      source: "Galley PWD",
      tocPpb: 300,
      conductivityUscm: 150,
      microbialStatus: "NEGATIVE",
    });
    expect(invalidCond.success).toBe(false);
    expect(invalidCond.error).toContain("between 0 and 100 µS/cm");

    // Valid sample
    const valid = addWaterSample({
      source: "WPA Effluent",
      tocPpb: 275,
      conductivityUscm: 1.45,
      microbialStatus: "NEGATIVE",
      notes: "Post-maintenance check",
    });
    expect(valid.success).toBe(true);
    expect(valid.state?.samples[0].tocPpb).toBe(275);
    expect(valid.state?.samples[0].source).toBe("WPA Effluent");
  });
});
