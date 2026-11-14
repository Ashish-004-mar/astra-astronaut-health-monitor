import { it, expect, vi } from "vitest";
import { fetchWeather } from "../services/spaceWeather";
it("falls back honestly when NASA is unavailable", async () => {
  localStorage.removeItem("astra-space-cache");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  expect((await fetchWeather()).source).toBe("SIMULATED DEMO");
  vi.unstubAllGlobals();
});
