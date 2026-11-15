import { describe, expect, it } from "vitest";
import { NASA_SOURCES_DATA } from "../data/nasaSourcesData";

describe("NASA Sources & References Data Verification", () => {
  it("contains exactly 10 official NASA research and data sources", () => {
    expect(NASA_SOURCES_DATA.length).toBe(10);
  });

  it("verifies Group A contains the active NASA DONKI API integration", () => {
    const activeApis = NASA_SOURCES_DATA.filter((s) => s.group === "ACTIVE_DATA_API");
    expect(activeApis.length).toBe(1);
    expect(activeApis[0].id).toBe("nasa-donki-api");
    expect(activeApis[0].integrationDetails).toBeDefined();
    expect(activeApis[0].integrationDetails?.endpoint).toContain("api.nasa.gov/DONKI/FLR");
  });

  it("verifies Group B contains 9 official research and repository references", () => {
    const researchRefs = NASA_SOURCES_DATA.filter((s) => s.group === "RESEARCH_REFERENCE");
    expect(researchRefs.length).toBe(9);
  });

  it("ensures all 10 sources have valid HTTPS official NASA URLs", () => {
    NASA_SOURCES_DATA.forEach((source) => {
      expect(source.url).toMatch(/^https:\/\/(www\.)?(api\.)?(science\.)?(epic\.gsfc\.)?(kauai\.ccmc\.gsfc\.)?nasa\.gov/);
      expect(source.title.length).toBeGreaterThan(5);
      expect(source.shortDesc.length).toBeGreaterThan(20);
      expect(source.astraRelevance.length).toBeGreaterThan(20);
      expect(source.limitations.length).toBeGreaterThan(15);
    });
  });

  it("categorizes sources accurately across space environment and crew health domains", () => {
    const envSources = NASA_SOURCES_DATA.filter((s) => s.domain === "SPACE ENVIRONMENT");
    const healthSources = NASA_SOURCES_DATA.filter((s) => s.domain === "CREW HEALTH");
    expect(envSources.length).toBe(4);
    expect(healthSources.length).toBe(6);
  });
});
