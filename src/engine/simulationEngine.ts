import { type Mission, type Reading, type Scenario } from "../types";
export function initialMission(): Mission {
  const history: Reading[] = Array.from({ length: 721 }, (_, i) => ({
    hour: i - 720,
    day: 147 + Math.floor((i - 720) / 24),
    hr: i === 720 ? 72 : 68 + Math.round(Math.sin(i * 0.47) * 3),
    spo2: 98,
    sleep: 7.4,
    stress: 25,
    activity: 85,
    resting: true,
  }));
  return {
    hour: 0,
    day: 147,
    history,
    nights: Array.from({ length: 31 }, (_, i) => ({
      day: 117 + i,
      sleep: 7.4,
      stress: 25,
    })),
    scenario: "NORMAL",
    running: false,
  };
}
export function advance(m: Mission, hours = 1): Mission {
  let next = { ...m, history: [...m.history], nights: [...m.nights] };
  for (let i = 0; i < hours; i++) {
    const p = next.history.at(-1)!;
    const hour = next.hour + 1;
    const day = 147 + Math.floor(hour / 24);
    const night = day !== next.day;
    const target: Record<
      Scenario,
      { hr: number; stress: number; activity: number; sleep: number }
    > = {
      NORMAL: { hr: 68, stress: 25, activity: 85, sleep: 7.8 },
      FATIGUE: { hr: 82, stress: 72, activity: 42, sleep: 5.2 },
      "HIGH STRESS": { hr: 84, stress: 85, activity: 65, sleep: 7.1 },
      RECOVERY: { hr: 68, stress: 25, activity: 85, sleep: 7.8 },
    };
    const t = target[next.scenario];
    const approach = (v: number, goal: number, step: number) =>
      Math.round(
        (v + Math.sign(goal - v) * Math.min(Math.abs(goal - v), step)) * 10,
      ) / 10;
    const sleep = night ? approach(p.sleep, t.sleep, 1.2) : p.sleep;
    const r: Reading = {
      hour,
      day,
      hr: approach(p.hr, t.hr, 1),
      stress: approach(p.stress, t.stress, 4),
      activity: approach(p.activity, t.activity, 3),
      spo2: 98,
      sleep,
      resting: true,
    };
    next = {
      ...next,
      hour,
      day,
      history: [...next.history, r].slice(-1441),
      nights: night
        ? [...next.nights, { day, sleep, stress: r.stress }].slice(-61)
        : next.nights,
    };
  }
  return next;
}
