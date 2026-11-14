export type Metric = "hr" | "spo2" | "sleep" | "stress" | "activity";
export type Scenario = "NORMAL" | "FATIGUE" | "HIGH STRESS" | "RECOVERY";
export type Region = "Head" | "Chest" | "Muscles";
export type Reading = {
  hour: number;
  day: number;
  hr: number;
  spo2: number;
  sleep: number;
  stress: number;
  activity: number;
  resting: boolean;
};
export type Night = { day: number; sleep: number; stress: number };
export type Mission = {
  hour: number;
  day: number;
  history: Reading[];
  nights: Night[];
  scenario: Scenario;
  running: boolean;
};
export const baseline = {
  hr: 68,
  spo2: 98,
  sleep: 7.8,
  stress: 25,
  activity: 85,
};
export const metrics: Record<Metric, { name: string; unit: string }> = {
  hr: { name: "Heart rate", unit: "BPM" },
  spo2: { name: "Blood oxygen", unit: "%" },
  sleep: { name: "Sleep", unit: "h" },
  stress: { name: "Stress", unit: "/100" },
  activity: { name: "Activity", unit: "/100" },
};
