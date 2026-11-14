export type SpaceEvent = {
  id: string;
  time: string;
  name: string;
  detail: string;
  url?: string;
};
export type Weather = {
  source: "LIVE PUBLIC DATA" | "CACHED PUBLIC DATA" | "SIMULATED DEMO";
  updated: string | null;
  events: SpaceEvent[];
};
export const demo: Weather = {
  source: "SIMULATED DEMO",
  updated: null,
  events: [
    {
      id: "demo-1",
      time: "Illustrative event",
      name: "Solar flare · C-class",
      detail:
        "Example solar activity bulletin. No personal exposure measurement.",
    },
    {
      id: "demo-2",
      time: "Illustrative event",
      name: "Coronal mass ejection",
      detail: "Example of an outward-moving solar plasma event.",
    },
  ],
};
export async function fetchWeather(signal?: AbortSignal): Promise<Weather> {
  try {
    const end = new Date().toISOString().slice(0, 10),
      start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const response = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=DEMO_KEY`,
      { signal },
    );
    if (!response.ok) throw new Error("NASA unavailable");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid response");
    const result: Weather = {
      source: "LIVE PUBLIC DATA",
      updated: new Date().toISOString(),
      events: data
        .slice(-5)
        .reverse()
        .map(
          (x: {
            flrID: string;
            beginTime: string;
            classType: string;
            sourceLocation: string;
            link: string;
          }) => ({
            id: x.flrID,
            time: x.beginTime,
            name: `Solar flare · ${x.classType ?? "unclassified"}`,
            detail: `Source region: ${x.sourceLocation || "not reported"}. Public solar observation.`,
            url: x.link?.startsWith("https://") ? x.link : undefined,
          }),
        ),
    };
    try {
      localStorage.setItem("astra-space-cache", JSON.stringify(result));
    } catch {
      /* Storage may be disabled. */
    }
    return result;
  } catch {
    try {
      const cached = JSON.parse(
        localStorage.getItem("astra-space-cache") ?? "null",
      );
      if (cached && Array.isArray(cached.events) && cached.updated)
        return { ...cached, source: "CACHED PUBLIC DATA" };
    } catch {
      /* Fallback stays usable offline. */
    }
    return demo;
  }
}
