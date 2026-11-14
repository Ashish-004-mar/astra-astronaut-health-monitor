import { describe, it, expect } from "vitest";
import { advance, initialMission } from "../engine/simulationEngine";
import { evaluate } from "../engine/healthEngine";
describe("mission rules", () => {
  it("starts nominal with required initial values", () => {
    const m = initialMission();
    expect(evaluate(m).status).toBe("NOMINAL");
    expect(m.history.at(-1)?.hr).toBe(72);
  });
  it("does not alert on one noisy sample", () => {
    const m = initialMission();
    m.history.at(-1)!.hr = 100;
    expect(evaluate(m).status).toBe("NOMINAL");
  });
  it("requires three comparable elevated readings", () => {
    const m = initialMission();
    m.history.slice(-3).forEach((r) => (r.hr = 80));
    expect(evaluate(m).status).toBe("ATTENTION");
    m.history.at(-1)!.resting = false;
    expect(evaluate(m).status).toBe("NOMINAL");
  });
  it("fatigue triggers both persistent rules and recovery clears them", () => {
    const m = advance({ ...initialMission(), scenario: "FATIGUE" }, 48);
    expect(evaluate(m).reasons).toHaveLength(2);
    expect(evaluate(m).status).toBe("ATTENTION");
    const recovered = advance({ ...m, scenario: "RECOVERY" }, 72);
    expect(evaluate(recovered).status).toBe("NOMINAL");
  });
  it("does not create nightly sleep during hourly ticks", () => {
    const m = initialMission();
    expect(advance(m, 23).nights).toHaveLength(m.nights.length);
    expect(advance(m, 24).nights).toHaveLength(m.nights.length + 1);
  });
  it("is deterministic and resets", () => {
    expect(advance(initialMission(), 72)).toEqual(
      advance(initialMission(), 72),
    );
    expect(initialMission().day).toBe(147);
  });
  it("marks missing data incomplete", () => {
    const m = initialMission();
    m.history.at(-1)!.spo2 = NaN;
    expect(evaluate(m).status).toBe("INCOMPLETE");
  });
  it("high stress requires persistent heart-rate change", () => {
    const m = { ...initialMission(), scenario: "HIGH STRESS" as const };
    expect(evaluate(advance(m, 1)).status).toBe("NOMINAL");
    expect(evaluate(advance(m, 24)).status).toBe("ATTENTION");
  });
  it("requires sustained recovery rather than one improved observation", () => {
    const m = advance({ ...initialMission(), scenario: "HIGH STRESS" }, 24);
    const last = m.history.at(-1)!;
    m.history.push({ ...last, hour: last.hour + 1, hr: 68 });
    expect(evaluate(m).status).toBe("ATTENTION");
    m.history.push({ ...last, hour: last.hour + 2, hr: 68 });
    m.history.push({ ...last, hour: last.hour + 3, hr: 68 });
    expect(evaluate(m).status).toBe("NOMINAL");
  });
});
