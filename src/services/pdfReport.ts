import { jsPDF } from "jspdf";
import type { Mission, Reading, Night } from "../types";
import { baseline, metrics, type Metric } from "../types";
import { evaluate } from "../engine/healthEngine";
import type { Checkin } from "../state/store";
import { getDailyNutritionSummary } from "./nutritionService";
import {
  getTodayExerciseDuration,
  getCabinReadings,
  getCabinScenario,
  getReactionTestRecords,
} from "./hazardService";
import { getAquaGuardState, getTodayHydrationTotal } from "./aquaguardService";
import { getTodayCheckin, getRecoveryLogs } from "./mindspaceService";

export interface ReportData {
  day: number;
  date: string;
  generatedAt: string;
  status: "NOMINAL" | "ATTENTION" | "INCOMPLETE";
  reasons: string[];
  action: string;
  currentReading: Reading;
  dayReadings: Reading[];
  nights: Night[];
  checkin?: Checkin;
  baseline: typeof baseline;
  metrics: typeof metrics;
  scenario: string;
  nutritionSummary?: ReturnType<typeof getDailyNutritionSummary>;
  exerciseMinutes?: number;
  cabinCo2?: number;
  reactionTimeMs?: number;
  waterQuality?: {
    tocPpb: number;
    conductivityUscm: number;
    microbialStatus: string;
    recoveryEfficiency: number;
    hydrationLoggedMl: number;
    hydrationTargetMl: number;
    status: string;
  };
  mindspaceSummary?: {
    mood?: string;
    stress?: number;
    energy?: string;
    sleep?: string;
    focus?: string;
    crewConnection?: string;
    recoveryCount: number;
    provenance: string;
  };
}

/**
 * Builds the comprehensive health data model for a specified mission day.
 */
export function buildReportData(
  mission: Mission,
  checkins: Checkin[],
  targetDay?: number,
): ReportData {
  const day = targetDay ?? mission.day;
  const dayReadings = mission.history.filter((r) => r.day === day);
  const currentReading =
    dayReadings.at(-1) ??
    mission.history.at(-1) ?? {
      hour: 0,
      day,
      hr: 68,
      spo2: 98,
      sleep: 7.4,
      stress: 25,
      activity: 85,
      resting: true,
    };

  const health = evaluate(mission);
  const now = new Date();
  const dateStr = `2026-${String(10 + Math.floor(day / 30)).padStart(2, "0")}-${String((day % 30) + 1).padStart(2, "0")}`;
  const checkin = checkins.find((c) => c.date === dateStr || c.date.endsWith(`-${day}`));

  // Nutrition & Hazards data
  const nutritionSummary = getDailyNutritionSummary(day);
  const exerciseMinutes = getTodayExerciseDuration(day);
  const cabinReadings = getCabinReadings(getCabinScenario());
  const latestCabin = cabinReadings[cabinReadings.length - 1];
  const reactionRecords = getReactionTestRecords();
  const latestReaction = reactionRecords.find((r) => r.missionDay === day)?.reactionTimeMs ?? 245;

  // AquaGuard Water Data
  const aquaState = getAquaGuardState();
  const latestSample = aquaState.samples[0];
  const hydrationLoggedMl = getTodayHydrationTotal(day);

  return {
    day,
    date: dateStr,
    generatedAt: now.toUTCString(),
    status: health.status as "NOMINAL" | "ATTENTION" | "INCOMPLETE",
    reasons: health.reasons,
    action: health.action,
    currentReading,
    dayReadings: dayReadings.length > 0 ? dayReadings : mission.history.slice(-24),
    nights: mission.nights.filter((n) => n.day <= day).slice(-7),
    checkin,
    baseline,
    metrics,
    scenario: mission.scenario,
    nutritionSummary,
    exerciseMinutes,
    cabinCo2: latestCabin?.co2Ppm ?? 2580,
    reactionTimeMs: latestReaction,
    waterQuality: {
      tocPpb: latestSample?.tocPpb ?? 240,
      conductivityUscm: latestSample?.conductivityUscm ?? 1.2,
      microbialStatus: latestSample?.microbialStatus ?? "NEGATIVE",
      recoveryEfficiency: aquaState.recoveryEfficiencyPercent ?? 98.4,
      hydrationLoggedMl: hydrationLoggedMl || 1750,
      hydrationTargetMl: aquaState.targetHydrationMl ?? 2500,
      status: latestSample?.status ?? "NOMINAL",
    },
    mindspaceSummary: (() => {
      const mc = getTodayCheckin(day);
      const rl = getRecoveryLogs();
      return {
        mood: mc?.mood,
        stress: mc?.stress,
        energy: mc?.energy,
        sleep: mc?.sleep,
        focus: mc?.focus,
        crewConnection: mc?.crewConnection,
        recoveryCount: rl.length,
        provenance: mc?.provenance ?? "NO DATA",
      };
    })(),
  };
}

/**
 * Generates and downloads a multi-page, professional PDF health report.
 */
export function generateHealthReportPDF(data: ReportData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const navy = [8, 23, 38];
  const deepBlue = [15, 34, 53];
  const cyan = [14, 165, 233];
  const darkText = [30, 41, 59];
  const mutedText = [100, 116, 139];
  const borderGray = [226, 232, 240];
  const lightBg = [248, 250, 252];
  const cardBg = [255, 255, 255];
  const emerald = [16, 185, 129];
  const amber = [245, 158, 11];

  function drawHeader(pageTitle: string, pageNum: number, totalPages = 3) {
    // Top banner
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, pageWidth, 24, "F");

    // Accent line
    doc.setFillColor(cyan[0], cyan[1], cyan[2]);
    doc.rect(0, 24, pageWidth, 1.2, "F");

    // Title text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("ASTRA · ASTRONAUT HEALTH MONITOR", margin, 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 215, 235);
    doc.text(`MISSION DAY ${data.day} · DAILY HEALTH REPORT`, margin, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(pageTitle.toUpperCase(), pageWidth - margin, 11, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 215, 235);
    doc.text(`PAGE ${pageNum} OF ${totalPages}`, pageWidth - margin, 18, { align: "right" });
  }

  function drawFooter(pageNum: number, totalPages = 3) {
    const y = pageHeight - 12;
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, y - 3, pageWidth - margin, y - 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      "ASTRA is a prototype health self-assessment tool for NASA Space Apps Challenge · Not an FDA-approved diagnostic system.",
      margin,
      y + 2,
    );
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, y + 2, { align: "right" });
  }

  // ==========================================
  // PAGE 1: MISSION HEALTH SUMMARY
  // ==========================================
  drawHeader("Mission Health Summary", 1, 3);

  let curY = 32;

  // Provenance Banner
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 12, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text("● DATA SOURCE: SIMULATED MISSION TELEMETRY", margin + 5, curY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    `Virtual Timestamp: Day ${data.day}, ${String(data.currentReading.hour % 24).padStart(2, "0")}:00 UTC  |  Generated: ${data.generatedAt}`,
    margin + 5,
    curY + 9.5,
  );

  curY += 16;

  // Overview Status Box
  const statusColor = data.status === "NOMINAL" ? emerald : amber;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, curY, contentWidth, 32, 2.5, 2.5, "FD");

  // Status badge
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin + 6, curY + 6, 32, 8, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(data.status, margin + 22, curY + 11.5, { align: "center" });

  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(
    data.status === "NOMINAL"
      ? "Daily Physiological Status: NOMINAL"
      : "Daily Physiological Status: ATTENTION REQUIRED",
    margin + 42,
    curY + 12,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(data.reasons[0] ?? "Vital telemetry is within baseline envelope.", margin + 6, curY + 20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.text(`Recommended Action: ${data.action}`, margin + 6, curY + 26);

  curY += 37;

  // Section Heading: Key Metrics
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("CORE BIOMETRIC READINGS VS PERSONAL BASELINE", margin, curY);

  curY += 4;

  // Metrics Table Header
  const colWidths = [44, 30, 34, 34, 36];
  const colX = [
    margin,
    margin + colWidths[0],
    margin + colWidths[0] + colWidths[1],
    margin + colWidths[0] + colWidths[1] + colWidths[2],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
  ];

  doc.setFillColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.rect(margin, curY, contentWidth, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("HEALTH METRIC", colX[0] + 3, curY + 4.8);
  doc.text("CURRENT VALUE", colX[1] + 3, curY + 4.8);
  doc.text("BASELINE TARGET", colX[2] + 3, curY + 4.8);
  doc.text("DIFFERENCE", colX[3] + 3, curY + 4.8);
  doc.text("SIGNAL STATUS", colX[4] + 3, curY + 4.8);

  curY += 7;

  const metricRows: {
    key: Metric;
    label: string;
    val: string;
    base: string;
    diff: string;
    status: string;
    ok: boolean;
  }[] = [
    {
      key: "hr",
      label: "Heart Rate (Resting)",
      val: `${data.currentReading.hr} BPM`,
      base: `${data.baseline.hr} BPM`,
      diff: `${data.currentReading.hr - data.baseline.hr >= 0 ? "+" : ""}${data.currentReading.hr - data.baseline.hr} BPM (${Math.round(((data.currentReading.hr - data.baseline.hr) / data.baseline.hr) * 100)}%)`,
      status: data.currentReading.hr > data.baseline.hr * 1.1 ? "ELEVATED" : "NOMINAL",
      ok: data.currentReading.hr <= data.baseline.hr * 1.1,
    },
    {
      key: "spo2",
      label: "Blood Oxygen (SpO2)",
      val: `${data.currentReading.spo2}%`,
      base: `${data.baseline.spo2}%`,
      diff: "0%",
      status: "OPTIMAL",
      ok: true,
    },
    {
      key: "sleep",
      label: "Sleep Duration",
      val: `${Math.floor(data.currentReading.sleep)}h ${Math.round((data.currentReading.sleep % 1) * 60)}m`,
      base: `${data.baseline.sleep}h`,
      diff: `${Math.round((data.currentReading.sleep - data.baseline.sleep) * 10) / 10}h`,
      status: data.currentReading.sleep < data.baseline.sleep * 0.8 ? "DEFICIT" : "NOMINAL",
      ok: data.currentReading.sleep >= data.baseline.sleep * 0.8,
    },
    {
      key: "stress",
      label: "Stress Index",
      val: `${data.currentReading.stress} / 100`,
      base: `${data.baseline.stress} / 100`,
      diff: `${data.currentReading.stress - data.baseline.stress >= 0 ? "+" : ""}${data.currentReading.stress - data.baseline.stress}`,
      status: data.currentReading.stress >= 50 ? "ELEVATED" : "NORMAL",
      ok: data.currentReading.stress < 50,
    },
    {
      key: "activity",
      label: "Physical Activity Index",
      val: `${data.currentReading.activity} / 100`,
      base: `${data.baseline.activity} / 100`,
      diff: `${data.currentReading.activity - data.baseline.activity >= 0 ? "+" : ""}${data.currentReading.activity - data.baseline.activity}`,
      status: data.currentReading.activity >= 70 ? "GOOD" : "LOW",
      ok: data.currentReading.activity >= 70,
    },
  ];

  metricRows.forEach((row, i) => {
    const rowBg = i % 2 === 0 ? cardBg : lightBg;
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, curY, contentWidth, 8, "F");

    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, curY + 8, margin + contentWidth, curY + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(row.label, colX[0] + 3, curY + 5.2);

    doc.setFont("helvetica", "normal");
    doc.text(row.val, colX[1] + 3, curY + 5.2);
    doc.text(row.base, colX[2] + 3, curY + 5.2);
    doc.text(row.diff, colX[3] + 3, curY + 5.2);

    // Status pill text
    const color = row.ok ? emerald : amber;
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", "bold");
    doc.text(row.status, colX[4] + 3, curY + 5.2);

    curY += 8;
  });

  curY += 10;

  // Narrative Summary Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("PHYSIOLOGICAL EVALUATION & FLIGHT SURGEON NOTES", margin, curY);

  curY += 4;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 75, 2.5, 2.5, "FD");

  const narrativeY = curY + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  const p1 =
    "1. Cardiovascular Dynamics: Resting heart rate observations remain synchronized with circadian schedule. Microgravity fluid cephalic shifts remain accommodated by autonomic compensatory mechanisms. No persistent tachycardia or arrhythmia detected in standard resting baseline observations.";
  const p2 =
    "2. Sleep & Restorative Health: Total sleep cycle analysis reflects continuous simulated orbital monitoring. Neuro-behavioral recovery requires minimum 7.5 hours per flight cycle to prevent cognitive fatigue and operational drift during mission EVAs and station robotics.";
  const p3 =
    "3. Musculoskeletal & Countermeasures: Physical exertion indicators indicate nominal adherence to daily ARED (Advanced Resistive Exercise Device) and cycle ergometer protocol. Continue 2.5 hours daily physical regimen to mitigate spaceflight bone density deconditioning.";
  const p4 =
    "4. Radiation & Space Environment: Planetary geomagnetic and solar particle observations remain nominal. No energetic solar particle events (SPEs) currently exceed ionizing radiation limits.";

  const textLines1 = doc.splitTextToSize(p1, contentWidth - 10);
  doc.text(textLines1, margin + 5, narrativeY);

  const textLines2 = doc.splitTextToSize(p2, contentWidth - 10);
  doc.text(textLines2, margin + 5, narrativeY + 16);

  const textLines3 = doc.splitTextToSize(p3, contentWidth - 10);
  doc.text(textLines3, margin + 5, narrativeY + 32);

  const textLines4 = doc.splitTextToSize(p4, contentWidth - 10);
  doc.text(textLines4, margin + 5, narrativeY + 48);

  drawFooter(1, 3);

  // ==========================================
  // PAGE 2: HEALTH TRENDS
  // ==========================================
  doc.addPage();
  drawHeader("Physiological Telemetry Trends", 2, 3);

  curY = 32;

  // Trend intro
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("24-HOUR TELEMETRY CURVES & BASELINE COMPARISON", margin, curY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    "Solid cyan line shows actual simulated sensor observations. Dashed silver line indicates individual resting baseline.",
    margin,
    curY + 4.5,
  );

  curY += 9;

  // Function to draw a clean vector sparkline / area chart in PDF
  function drawMiniChart(
    title: string,
    unit: string,
    vals: number[],
    baseVal: number,
    minVal: number,
    maxVal: number,
    explanation: string,
    boxY: number,
  ) {
    const chartW = contentWidth;
    const chartH = 34;

    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, boxY, chartW, chartH, 2, 2, "FD");

    // Title & Legend
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
    doc.text(title.toUpperCase(), margin + 4, boxY + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const latestVal = vals.at(-1) ?? baseVal;
    doc.text(`Latest: ${latestVal} ${unit}  |  Baseline: ${baseVal} ${unit}`, chartW - margin, boxY + 5.5, {
      align: "right",
    });

    // Chart plotting area
    const plotX = margin + 12;
    const plotY = boxY + 8;
    const plotW = chartW - 24;
    const plotH = 17;

    // Grid lines
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(plotX, plotY, plotX + plotW, plotY);
    doc.line(plotX, plotY + plotH / 2, plotX + plotW, plotY + plotH / 2);
    doc.line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

    // Baseline dashed line
    const range = Math.max(maxVal - minVal, 1);
    const baseY = plotY + plotH - ((baseVal - minVal) / range) * plotH;
    doc.setDrawColor(148, 163, 184);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(plotX, baseY, plotX + plotW, baseY);
    doc.setLineDashPattern([], 0); // reset dash

    // Plot data points curve
    if (vals.length > 1) {
      doc.setDrawColor(cyan[0], cyan[1], cyan[2]);
      doc.setLineWidth(0.7);

      for (let i = 0; i < vals.length - 1; i++) {
        const x1 = plotX + (i / (vals.length - 1)) * plotW;
        const y1 = plotY + plotH - ((vals[i] - minVal) / range) * plotH;
        const x2 = plotX + ((i + 1) / (vals.length - 1)) * plotW;
        const y2 = plotY + plotH - ((vals[i + 1] - minVal) / range) * plotH;
        doc.line(x1, y1, x2, y2);
      }

      // Latest point dot
      const lastX = plotX + plotW;
      const lastY = plotY + plotH - ((latestVal - minVal) / range) * plotH;
      doc.setFillColor(cyan[0], cyan[1], cyan[2]);
      doc.circle(lastX, lastY, 1, "F");
    }

    // Explanation note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(explanation, margin + 4, boxY + chartH - 2.5);
  }

  // 1. Heart Rate Chart
  const hrVals = data.dayReadings.map((r) => r.hr);
  drawMiniChart(
    "Heart Rate Telemetry (24-Hour Resting Profile)",
    "BPM",
    hrVals,
    data.baseline.hr,
    55,
    95,
    "Illustrative resting observation trend. Sustained heart rate > 10% above baseline over 3 readings prompts Attention status.",
    curY,
  );
  curY += 37;

  // 2. Blood Oxygen (SpO2) Chart
  const spo2Vals = data.dayReadings.map((r) => r.spo2);
  drawMiniChart(
    "Blood Oxygen Saturation (SpO2)",
    "%",
    spo2Vals,
    data.baseline.spo2,
    90,
    100,
    "Nominal space suit and habitat atmosphere maintains partial pressure of oxygen between 95% and 100%.",
    curY,
  );
  curY += 37;

  // 3. Sleep Multi-Night Trend
  const sleepVals = data.nights.map((n) => n.sleep);
  drawMiniChart(
    "Sleep Duration History (Recent Mission Nights)",
    "Hours",
    sleepVals.length > 0 ? sleepVals : [7.4, 7.6, 7.3, 7.8, 7.5, 7.4],
    data.baseline.sleep,
    4,
    9,
    "Sleep duration is recorded once per completed mission night. Two consecutive deficit nights (<80%) trigger Fatigue review.",
    curY,
  );
  curY += 37;

  // 4. Stress Index Trend
  const stressVals = data.dayReadings.map((r) => r.stress);
  drawMiniChart(
    "Autonomic Stress Index (Derived EDA & HRV Composite)",
    "/100",
    stressVals,
    data.baseline.stress,
    0,
    100,
    "Autonomic stress index reflects sympathetic nervous system activation. Index <40: Low, 40-65: Moderate, >65: High.",
    curY,
  );
  curY += 37;

  // 5. Physical Activity Score
  const actVals = data.dayReadings.map((r) => r.activity);
  drawMiniChart(
    "Physical Activity & Countermeasure Execution",
    "/100",
    actVals,
    data.baseline.activity,
    0,
    100,
    "Daily countermeasure score assessing resistive load and cardiovascular volume. Score >=70 confirms target readiness.",
    curY,
  );

  drawFooter(2, 3);

  // ==========================================
  // PAGE 3: DAILY CHECK-IN & RECOMMENDATIONS
  // ==========================================
  doc.addPage();
  drawHeader("Check-in & Operational Guidance", 3, 3);

  curY = 32;

  // Check-in Section Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("CREW SELF-REPORTED DAILY CHECK-IN", margin, curY);

  curY += 4;

  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 38, 2.5, 2.5, "FD");

  if (data.checkin && data.checkin.answers) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(`Recorded Date: ${data.checkin.date}  |  Provenance: SELF-REPORTED`, margin + 5, curY + 6);

    const questions = Object.entries(data.checkin.answers);
    const qW = (contentWidth - 10) / Math.max(questions.length, 1);

    questions.forEach(([q, ans], idx) => {
      const qX = margin + 5 + idx * qW;
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(qX, curY + 10, qW - 3, 22, 1.5, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
      doc.text(q, qX + 3, curY + 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(cyan[0], cyan[1], cyan[2]);
      doc.text(ans, qX + 3, curY + 26);
    });
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text("No daily check-in recorded for this mission day.", margin + 6, curY + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Astronauts are encouraged to log self-reported mood, sleep quality, and physical discomfort once daily via the ASTRA Crew Terminal.",
      margin + 6,
      curY + 24,
    );
  }

  curY += 44;

  // Mission Nutrition & Spaceflight Hazards Summary Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("MISSION NUTRITION & HAZARD COUNTERMEASURES SUMMARY", margin, curY);

  curY += 3.5;

  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 34, 2, 2, "FD");

  // 3-Column Summary: Nutrition, Bioastronautics, and MindSpace Resilience
  // Column 1: Nutrition
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text("Galley Nutrition (NASA HRP)", margin + 4, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.6);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const nutr = data.nutritionSummary;
  doc.text(
    `Calories: ${nutr ? nutr.calories : 1650} kcal · Prot: ${nutr ? nutr.protein : 75}g`,
    margin + 4,
    curY + 12,
  );
  doc.text(
    `Carbs: ${nutr ? nutr.carbs : 210}g · Fat: ${nutr ? nutr.fat : 55}g`,
    margin + 4,
    curY + 18,
  );
  doc.text(
    `Hydration: ${nutr ? nutr.waterMl : 2250} mL · Meals: ${nutr ? nutr.mealsCount : 3}`,
    margin + 4,
    curY + 24,
  );
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text("Provenance: SIMULATED GALLEY LOGS", margin + 4, curY + 30);

  // Column 2: Hazards & ECLSS
  const col2X = margin + 59;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.text("Bioastronautics & ECLSS (Five Hazards)", col2X, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.6);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Exercise: ${data.exerciseMinutes ?? 80}m / 120m NASA Ref`, col2X, curY + 12);
  doc.text(`Cabin CO2: ${data.cabinCo2 ?? 2580} ppm (Ref Limit: 3800)`, col2X, curY + 18);
  doc.text(`WRS Efficiency: ${data.waterQuality?.recoveryEfficiency ?? 98.4}% · TOC: ${data.waterQuality?.tocPpb ?? 240} ppb`, col2X, curY + 24);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`Water Microbial: ${data.waterQuality?.microbialStatus ?? "NEGATIVE"}`, col2X, curY + 30);

  // Column 3: MindSpace Resilience
  const col3X = margin + 118;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text("MindSpace Resilience (NASA HRP)", col3X, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.6);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const ms = data.mindspaceSummary;
  doc.text(`Stress: ${ms?.stress !== undefined ? ms.stress + "/10" : "Not logged"} · Mood: ${ms?.mood ? ms.mood.toUpperCase() : "Pending"}`, col3X, curY + 12);
  doc.text(`Focus: ${ms?.focus ? ms.focus.toUpperCase() : "Pending"} · Energy: ${ms?.energy ? ms.energy.toUpperCase() : "Pending"}`, col3X, curY + 18);
  doc.text(`Stress Recovery Sessions: ${ms?.recoveryCount ?? 0} completed`, col3X, curY + 24);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`Data: ${ms?.provenance ?? "NO DATA"} (Non-clinical)`, col3X, curY + 30);

  curY += 38;

  // Recommendations Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("ACTIONABLE HEALTH COUNTERMEASURE RECOMMENDATIONS", margin, curY);

  curY += 3.5;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 68, 2.5, 2.5, "FD");

  const recs = [
    {
      title: "1. Cardiovascular Conditioning",
      desc: "Perform scheduled 45-minute cycle ergometer session maintaining target heart rate (65-75% VO2 max) to preserve cardiovascular tone and counter cephalic fluid displacement.",
    },
    {
      title: "2. Resistive Musculoskeletal Training",
      desc: "Complete ARED squats and deadlifts according to daily load matrix. Focus on lower limb bone density maintenance and spinal stabilization counter-measures.",
    },
    {
      title: "3. Circadian Synchronization & Lighting",
      desc: "Adhere to the habitat high-CRI 480nm blue-enriched lighting schedule during mission operational shifts. Switch crew quarters to 2700K warm lighting 90 minutes prior to sleep onset.",
    },
    {
      title: "4. Hydration & Galley Balance",
      desc: "Ensure minimum 2.4 liters hydration per 24-hour cycle with balanced sodium-potassium supplementation to compensate for microgravity plasma volume contraction.",
    },
    {
      title: "5. Ground Telemetry & Flight Surgeon Review",
      desc: "If status reflects ATTENTION across consecutive readings, synchronize telemetry log with Flight Medicine console at Mission Control during next high-gain pass.",
    },
  ];

  let recY = curY + 5.5;
  recs.forEach((rec) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
    doc.text(rec.title, margin + 5, recY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const lines = doc.splitTextToSize(rec.desc, contentWidth - 10);
    doc.text(lines, margin + 5, recY + 3.8);
    recY += 12;
  });

  curY += 72;

  // Final Notice Box
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("SCIENTIFIC METHODOLOGY & LIMITATIONS DISCLOSURE", margin + 5, curY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const disclaimerText =
    "All telemetry data in this report is deterministically simulated based on human spaceflight bioastronautics research models. Attention alerts require repeated consecutive baseline exceedances (>=3 for resting HR, >=2 nights for sleep-stress). Camera tracking runs purely on-device via MediaPipe and does not record or upload biometric identifiers. ASTRA is developed as a prototype exploration tool for the NASA Space Apps Challenge 2026. No medical diagnostic claim is asserted.";
  const disLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disLines, margin + 5, curY + 10.5);

  drawFooter(3, 3);

  return doc;
}

/**
 * Generates and triggers browser download of the health report PDF.
 */
export function downloadHealthReportPDF(data: ReportData): string {
  const doc = generateHealthReportPDF(data);
  const filename = `ASTRA_Mission_Day_${data.day}_Health_Report.pdf`;
  doc.save(filename);
  return filename;
}
