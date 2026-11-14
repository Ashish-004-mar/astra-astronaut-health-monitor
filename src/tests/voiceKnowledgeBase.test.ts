import { describe, it, expect } from "vitest";
import { knowledgeBase } from "../voice/knowledgeBase";
import { getDynamicContext } from "../voice/dynamicContext";

describe("ASTRA Voice Knowledge Base (160 Offline Entries)", () => {
  it("contains exactly 160 curated bilingual entries", () => {
    expect(knowledgeBase.length).toBe(160);
  });

  it("strictly adheres to the required category breakdown", () => {
    const counts = knowledgeBase.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    expect(counts["general"]).toBe(25);
    expect(counts["baseline"]).toBe(20);
    expect(counts["sleep"]).toBe(20);
    expect(counts["stress"]).toBe(20);
    expect(counts["activity"]).toBe(20);
    expect(counts["space"]).toBe(15);
    expect(counts["simulation"]).toBe(15);
    expect(counts["checkin"]).toBe(15);
    expect(counts["help"]).toBe(10);

    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(160);
  });

  it("has unique IDs for every single entry", () => {
    const ids = new Set<string>();
    for (const entry of knowledgeBase) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
    }
    expect(ids.size).toBe(160);
  });

  it("provides valid English and Hindi questions and answers for all 160 entries", () => {
    const ctx = getDynamicContext();

    for (const entry of knowledgeBase) {
      expect(entry.questionEn.trim().length).toBeGreaterThan(5);
      expect(entry.questionHi.trim().length).toBeGreaterThan(5);

      const ansEn = typeof entry.answerEn === "function" ? entry.answerEn(ctx) : entry.answerEn;
      const ansHi = typeof entry.answerHi === "function" ? entry.answerHi(ctx) : entry.answerHi;

      expect(ansEn.trim().length).toBeGreaterThan(15);
      expect(ansHi.trim().length).toBeGreaterThan(15);
    }
  });

  it("successfully computes dynamic answers with live telemetry numbers", () => {
    const ctx = getDynamicContext();
    const hrEntry = knowledgeBase.find((e) => e.id === "gh-01");
    expect(hrEntry).toBeDefined();
    expect(hrEntry?.isDynamic).toBe(true);

    if (hrEntry && typeof hrEntry.answerEn === "function") {
      const text = hrEntry.answerEn(ctx);
      expect(text).toContain(String(ctx.hr));
      expect(text).toContain(String(ctx.baselineHr));
    }
  });
});
