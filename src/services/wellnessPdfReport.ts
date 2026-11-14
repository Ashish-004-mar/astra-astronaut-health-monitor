import { jsPDF } from "jspdf";
import type { WellnessCheckinRecord } from "./wellnessService";

/**
 * Generates a clean, professional, aerospace-styled single-page PDF document
 * for an individual 2-Minute Crew Wellness Check-in record.
 */
export function generateWellnessCheckinPDF(record: WellnessCheckinRecord): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Design color palette
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

  // Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 25, "F");

  // Cyan accent line
  doc.setFillColor(cyan[0], cyan[1], cyan[2]);
  doc.rect(0, 25, pageWidth, 1.2, "F");

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ASTRA · ASTRONAUT HEALTH MONITOR", margin, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 215, 235);
  doc.text("RAPID CREW WELLNESS RECORD (2-MINUTE PROTOCOL)", margin, 18);

  // Header right side
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`MISSION DAY ${record.missionDay}`, pageWidth - margin, 11, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 215, 235);
  doc.text(`RECORD: #${record.id.slice(-6).toUpperCase()}`, pageWidth - margin, 18, { align: "right" });

  let curY = 32;

  // Metadata Box (4 columns)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 16, 2, 2, "FD");

  const metaColWidth = contentWidth / 4;
  const metaCols = [
    { label: "CREW MEMBER", value: record.crewMember.split(" (")[0] },
    { label: "STATION / HABITAT", value: "ASTRA Orbital LEO" },
    { label: "LOGGED TIMESTAMP", value: `${record.date} · ${record.timeFormatted}` },
    { label: "PROVENANCE", value: "SELF-REPORTED / OK" },
  ];

  metaCols.forEach((col, idx) => {
    const x = margin + idx * metaColWidth + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(col.label, x, curY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(col.value, x, curY + 11.5);
  });

  curY += 21;

  // Readiness Score Hero Box
  let statusBg = [236, 253, 245]; // light emerald
  let statusBorder = [16, 185, 129];
  let statusColor = emerald;

  if (record.readinessStatus === "ATTENTION") {
    statusBg = [255, 251, 235]; // light amber
    statusBorder = [245, 158, 11];
    statusColor = amber;
  } else if (record.readinessStatus === "NOMINAL") {
    statusBg = [240, 249, 255]; // light cyan
    statusBorder = [14, 165, 233];
    statusColor = cyan;
  }

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusBorder[0], statusBorder[1], statusBorder[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, 24, 2, 2, "FD");

  // Score number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`${record.score}`, margin + 8, curY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text("/ 100", margin + 26, curY + 15);

  // Status Badge
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin + 42, curY + 5, 42, 6.5, 1.2, 1.2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(`${record.readinessStatus} READINESS`, margin + 63, curY + 9.5, { align: "center" });

  // Summary message
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const summaryLines = doc.splitTextToSize(record.summary, contentWidth - 48);
  doc.text(summaryLines, margin + 42, curY + 16);

  curY += 29;

  // Section: Detailed Recorded Answers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("QUESTIONNAIRE BREAKDOWN & IMPACT ASSESSMENT", margin, curY);

  curY += 4;

  // Table Header
  const qColWidths = [56, 32, 90];
  const qColX = [
    margin,
    margin + qColWidths[0],
    margin + qColWidths[0] + qColWidths[1],
  ];

  doc.setFillColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.rect(margin, curY, contentWidth, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WELLNESS METRIC", qColX[0] + 4, curY + 4.8);
  doc.text("REPORTED LEVEL", qColX[1] + 4, curY + 4.8);
  doc.text("BIOASTRONAUTICS CONTEXT & INTERPRETATION", qColX[2] + 4, curY + 4.8);

  curY += 7;

  const questionsList = [
    {
      metric: "Sleep Quality",
      answer: record.answers.Sleep || "Good",
      desc: "Evaluates sleep continuity, sleep-quarter acoustic comfort, and ease of morning wakefulness.",
      favorable: record.answers.Sleep === "Good",
      warning: record.answers.Sleep === "Poor",
    },
    {
      metric: "Physical Energy",
      answer: record.answers.Energy || "Normal",
      desc: "Physical stamina required for nominal 2.5h daily exercise, EVA operations, and payload tasks.",
      favorable: record.answers.Energy === "High",
      warning: record.answers.Energy === "Low",
    },
    {
      metric: "Operational Stress",
      answer: record.answers.Stress || "Low",
      desc: "Cognitive workload intensity, flight timeline pacing, and autonomic sympathetic balance.",
      favorable: record.answers.Stress === "Low",
      warning: record.answers.Stress === "High",
    },
    {
      metric: "Morale & Mood",
      answer: record.answers.Mood || "Good",
      desc: "Psychological resilience, interpersonal team cohesion, and isolation adjustment index.",
      favorable: record.answers.Mood === "Good",
      warning: record.answers.Mood === "Low",
    },
    {
      metric: "Physical Discomfort",
      answer: record.answers["Physical discomfort"] || "None",
      desc: "Screening for microgravity spinal lengthening soreness, neurovestibular space adaptation, or headache.",
      favorable: record.answers["Physical discomfort"] === "None",
      warning: record.answers["Physical discomfort"] === "Significant",
    },
  ];

  questionsList.forEach((item, index) => {
    const rowHeight = 11;
    const isEven = index % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.2);
    doc.rect(margin, curY, contentWidth, rowHeight, "FD");

    // Metric Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(item.metric, qColX[0] + 4, curY + 6.8);

    // Answer Badge
    let badgeBg = [241, 245, 249];
    let badgeText = darkText;
    if (item.favorable) {
      badgeBg = [236, 253, 245];
      badgeText = [5, 150, 105];
    } else if (item.warning) {
      badgeBg = [254, 242, 242];
      badgeText = [220, 38, 38];
    } else {
      badgeBg = [240, 249, 255];
      badgeText = [2, 132, 199];
    }

    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.roundedRect(qColX[1] + 3, curY + 2.5, 24, 6, 1, 1, "F");
    doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(item.answer, qColX[1] + 15, curY + 6.6, { align: "center" });

    // Description text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const lines = doc.splitTextToSize(item.desc, qColWidths[2] - 6);
    doc.text(lines, qColX[2] + 4, curY + 5.2);

    curY += rowHeight;
  });

  curY += 5;

  // Astronaut's Subjective Notes Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("CREW MEMBER SUBJECTIVE OBSERVATIONS", margin, curY);

  curY += 3;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 14, 1.5, 1.5, "FD");

  const notesText = record.answers.Notes
    ? `"${record.answers.Notes}"`
    : "No subjective physical remarks or operational notes recorded for this assessment session.";

  doc.setFont("helvetica", record.answers.Notes ? "italic" : "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(record.answers.Notes ? darkText[0] : mutedText[0], record.answers.Notes ? darkText[1] : mutedText[1], record.answers.Notes ? darkText[2] : mutedText[2]);
  const noteLines = doc.splitTextToSize(notesText, contentWidth - 10);
  doc.text(noteLines, margin + 5, curY + 6.5);

  curY += 19;

  // Recommended Spaceflight Countermeasures Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("RECOMMENDED COUNTERMEASURES & MEDICAL PROTOCOL", margin, curY);

  curY += 3.5;

  doc.setFillColor(240, 249, 255); // light cyan bg
  doc.setDrawColor(cyan[0], cyan[1], cyan[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, curY, contentWidth, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 102, 160);
  doc.text("OPERATIONAL ACTION DIRECTIVE:", margin + 5, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const counterLines = doc.splitTextToSize(record.countermeasure, contentWidth - 10);
  doc.text(counterLines, margin + 5, curY + 11.5);

  curY += 25;

  // NASA HRP Spaceflight Reference & Audit Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, contentWidth, 21, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("AEROSPACE VALIDATION & SCIENTIFIC CITATION", margin + 5, curY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const disclaimerText =
    "This wellness assessment is recorded based on NASA Human Research Program (HRP) Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders. All values are logged securely on-device in the ASTRA local habitat telemetry store. ASTRA is a demonstration prototype for the NASA Space Apps Challenge 2026. This report is simulated for bioastronautics training and does not constitute certified clinical diagnosis.";
  const disLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disLines, margin + 5, curY + 10.5);

  // Footer
  const footerY = pageHeight - 10;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    `ASTRA Telemetry Hash: [${record.id}] · Generated: ${new Date().toUTCString()} · Confidential Astronaut Health Record`,
    margin,
    footerY + 1,
  );
  doc.text("Page 1 of 1", pageWidth - margin, footerY + 1, { align: "right" });

  return doc;
}

/**
 * Triggers instant browser download of the single-page wellness check PDF.
 */
export function downloadWellnessReportPDF(record: WellnessCheckinRecord): string {
  const doc = generateWellnessCheckinPDF(record);
  const cleanId = record.id.slice(-6);
  const filename = `ASTRA_Wellness_Check_Day_${record.missionDay}_${cleanId}.pdf`;
  doc.save(filename);
  return filename;
}
