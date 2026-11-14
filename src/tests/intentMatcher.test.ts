import { describe, it, expect } from "vitest";
import { matchQuery } from "../voice/intentMatcher";

describe("ASTRA Offline Intent Matcher", () => {
  it("matches English queries with high confidence", () => {
    const res1 = matchQuery("What is my current heart rate?");
    expect(res1.entry).toBeDefined();
    expect(res1.entry?.id).toBe("gh-01");
    expect(res1.confidence).toBeGreaterThanOrEqual(0.7);

    const res2 = matchQuery("How did I sleep last night?");
    expect(res2.entry).toBeDefined();
    expect(res2.entry?.id).toBe("sf-01");

    const res3 = matchQuery("What is my oxygen saturation level?");
    expect(res3.entry).toBeDefined();
    expect(res3.entry?.id).toBe("gh-02");
  });

  it("matches Hindi queries with high confidence", () => {
    const res = matchQuery("मेरा वर्तमान हृदय गति क्या है?");
    expect(res.entry).toBeDefined();
    expect(res.entry?.id).toBe("gh-01");
    expect(res.detectedLanguage).toBe("hi");
  });

  it("matches Hinglish transliterations smoothly", () => {
    const res1 = matchQuery("mera heart rate kya hai");
    expect(res1.entry).toBeDefined();
    expect(res1.entry?.id).toBe("gh-01");

    const res2 = matchQuery("kal raat ki neend kaisi thi");
    expect(res2.entry).toBeDefined();
    expect(res2.entry?.id).toBe("sf-01");

    const res3 = matchQuery("current stress score kitna hai");
    expect(res3.entry).toBeDefined();
    expect(res3.entry?.id).toBe("sr-01");
  });

  it("provides top 3 relevant suggestions for unknown or vague queries", () => {
    const res = matchQuery("something completely unknown in outer space xyz123");
    expect(res.suggestions.length).toBe(3);
  });
});
