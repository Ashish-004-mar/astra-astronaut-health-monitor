import { baseline, type Mission } from "../types";
export function evaluate(m: Mission) {
  const recent = m.history.slice(-3);
  const nights = m.nights.slice(-2);
  const current = m.history.at(-1);
  if (
    !current ||
    Object.values(baseline).some(
      (_, i) =>
        !Number.isFinite(
          current[(["hr", "spo2", "sleep", "stress", "activity"] as const)[i]],
        ),
    )
  )
    return {
      status: "INCOMPLETE",
      reasons: [
        "Some health signals are missing. A complete assessment is unavailable.",
      ],
      action: "Review the missing data before interpreting your status.",
    };
  const reasons: string[] = [];
  if (
    recent.length < 3 ||
    nights.length < 2 ||
    recent.some((r) => !Number.isFinite(r.hr)) ||
    nights.some((n) => !Number.isFinite(n.sleep) || !Number.isFinite(n.stress))
  )
    return {
      status: "INCOMPLETE",
      reasons: [
        "Not enough complete observations to assess a persistent trend.",
      ],
      action: "Review the missing data before interpreting your status.",
    };
  let hrAttention = false,
    high = 0,
    normal = 0;
  for (const r of m.history) {
    if (!r.resting || !Number.isFinite(r.hr)) {
      high = 0;
      normal = 0;
      continue;
    }
    if (r.hr > baseline.hr * 1.1) {
      high++;
      normal = 0;
    } else {
      normal++;
      high = 0;
    }
    if (high >= 3) hrAttention = true;
    if (normal >= 3) hrAttention = false;
  }
  let sleepAttention = false,
    poor = 0,
    recovered = 0;
  for (const n of m.nights) {
    if (!Number.isFinite(n.sleep) || !Number.isFinite(n.stress)) {
      poor = 0;
      recovered = 0;
      continue;
    }
    if (n.sleep < baseline.sleep * 0.8 && n.stress >= 50) {
      poor++;
      recovered = 0;
    } else {
      recovered++;
      poor = 0;
    }
    if (poor >= 2) sleepAttention = true;
    if (recovered >= 2) sleepAttention = false;
  }
  if (hrAttention)
    reasons.push("Your resting heart-rate trend is above your usual baseline.");
  if (sleepAttention)
    reasons.push(
      "Your sleep has remained below your usual pattern while stress signals are elevated.",
    );
  return {
    status: reasons.length ? "ATTENTION" : "NOMINAL",
    reasons: reasons.length
      ? reasons
      : ["Your recent signals are within your usual pattern."],
    action: reasons.length
      ? "Review your recovery routine and monitor your next readings."
      : "Keep your usual rest, movement, and daily check-in routine.",
  };
}
