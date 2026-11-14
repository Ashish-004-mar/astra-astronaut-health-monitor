import { useState } from "react";
import {
  FileText,
  Download,
  X,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Activity,
  Heart,
  Moon,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../state/store";
import { buildReportData, downloadHealthReportPDF, type ReportData } from "../services/pdfReport";

export default function ReportModal({
  isOpen,
  onClose,
  initialDay,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: number;
}) {
  const { mission, checkins } = useStore();
  const [selectedDay, setSelectedDay] = useState<number>(initialDay ?? mission.day);
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "trends" | "checkin">("summary");

  if (!isOpen) return null;

  // Compute available mission days from history
  const availableDays = Array.from(
    new Set(mission.history.map((r) => r.day)),
  ).sort((a, b) => b - a);

  if (!availableDays.includes(selectedDay) && availableDays.length > 0) {
    setSelectedDay(availableDays[0]);
  }

  const reportData: ReportData = buildReportData(mission, checkins, selectedDay);

  const handleDownload = () => {
    setGenerating(true);
    setDownloadSuccess(null);
    try {
      setTimeout(() => {
        const filename = downloadHealthReportPDF(reportData);
        setGenerating(false);
        setDownloadSuccess(filename);
        setTimeout(() => setDownloadSuccess(null), 4000);
      }, 400);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setGenerating(false);
    }
  };

  const current = reportData.currentReading;
  const hrDiff = current.hr - reportData.baseline.hr;
  const sleepDiff = Math.round((current.sleep - reportData.baseline.sleep) * 10) / 10;
  const stressDiff = current.stress - reportData.baseline.stress;

  return (
    <div className="report-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="report-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="report-modal-header">
          <div className="report-modal-title">
            <span className="report-badge">
              <FileText size={15} /> ASTRA REPORT PREVIEW
            </span>
            <h2>Mission Day {reportData.day} Health Telemetry Report</h2>
            <p>
              Generated from deterministic simulated telemetry and on-device check-ins.
            </p>
          </div>
          <button className="icon-button close-btn" onClick={onClose} aria-label="Close report preview">
            <X size={18} />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="report-controls-bar">
          <div className="day-selector-group">
            <label htmlFor="mission-day-select">
              <Calendar size={14} /> Mission Day:
            </label>
            <select
              id="mission-day-select"
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(Number(e.target.value));
                setDownloadSuccess(null);
              }}
            >
              {availableDays.map((d) => (
                <option key={d} value={d}>
                  Day {d} {d === mission.day ? "(Current Virtual Day)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="preview-tab-buttons">
            <button
              className={activeTab === "summary" ? "active" : ""}
              onClick={() => setActiveTab("summary")}
            >
              Page 1: Summary
            </button>
            <button
              className={activeTab === "trends" ? "active" : ""}
              onClick={() => setActiveTab("trends")}
            >
              Page 2: Trends
            </button>
            <button
              className={activeTab === "checkin" ? "active" : ""}
              onClick={() => setActiveTab("checkin")}
            >
              Page 3: Check-in & Actions
            </button>
          </div>

          <button
            className="button primary download-pdf-btn"
            onClick={handleDownload}
            disabled={generating}
          >
            <Download size={15} />
            {generating ? "GENERATING PDF..." : "DOWNLOAD PDF"}
          </button>
        </div>

        {downloadSuccess && (
          <div className="report-alert success" role="status">
            <CheckCircle size={15} /> Downloaded {downloadSuccess} successfully.
          </div>
        )}

        {/* Document Preview Area (Styled like PDF Page) */}
        <div className="report-preview-sheet">
          {activeTab === "summary" && (
            <div className="sheet-page">
              <div className="sheet-topline">
                <div>
                  <span className="sheet-wordmark">✳ ASTRA · ASTRONAUT HEALTH MONITOR</span>
                  <div className="sheet-meta">
                    <span><Calendar size={12} /> Day {reportData.day} ({reportData.date})</span>
                    <span><Clock size={12} /> UTC Timestamp: {reportData.generatedAt}</span>
                  </div>
                </div>
                <div
                  className={`sheet-status-pill ${
                    reportData.status === "NOMINAL" ? "nominal" : "attention"
                  }`}
                >
                  {reportData.status === "NOMINAL" ? (
                    <CheckCircle size={13} />
                  ) : (
                    <AlertTriangle size={13} />
                  )}
                  {reportData.status}
                </div>
              </div>

              <div className="sheet-provenance">
                ● DATA SOURCE: SIMULATED ORBITAL TELEMETRY · NOT A MEDICAL DIAGNOSIS
              </div>

              {/* Status Banner */}
              <div
                className={`sheet-status-box ${
                  reportData.status === "NOMINAL" ? "nominal" : "attention"
                }`}
              >
                <h3>
                  {reportData.status === "NOMINAL"
                    ? "Daily Telemetry: NOMINAL BASELINE"
                    : "Daily Telemetry: ATTENTION PATTERN DETECTED"}
                </h3>
                <p>{reportData.reasons[0]}</p>
                <strong>Recommended Action: {reportData.action}</strong>
              </div>

              {/* Metrics Grid */}
              <div className="sheet-metrics-grid">
                <div className="sheet-metric-card">
                  <span className="label"><Heart size={13} /> Heart Rate</span>
                  <strong className="value">{current.hr} <small>BPM</small></strong>
                  <span className="diff">
                    Baseline: {reportData.baseline.hr} BPM ({hrDiff >= 0 ? "+" : ""}{hrDiff})
                  </span>
                </div>
                <div className="sheet-metric-card">
                  <span className="label"><Activity size={13} /> Blood Oxygen (SpO2)</span>
                  <strong className="value">{current.spo2}%</strong>
                  <span className="diff">Baseline: {reportData.baseline.spo2}% (Optimal)</span>
                </div>
                <div className="sheet-metric-card">
                  <span className="label"><Moon size={13} /> Sleep Duration</span>
                  <strong className="value">
                    {Math.floor(current.sleep)}h {Math.round((current.sleep % 1) * 60)}m
                  </strong>
                  <span className="diff">
                    Baseline: {reportData.baseline.sleep}h ({sleepDiff >= 0 ? "+" : ""}{sleepDiff}h)
                  </span>
                </div>
                <div className="sheet-metric-card">
                  <span className="label"><Zap size={13} /> Stress Index</span>
                  <strong className="value">{current.stress} <small>/ 100</small></strong>
                  <span className="diff">
                    Baseline: {reportData.baseline.stress} ({stressDiff >= 0 ? "+" : ""}{stressDiff})
                  </span>
                </div>
              </div>

              {/* Observations */}
              <div className="sheet-section">
                <h4>PHYSIOLOGICAL EVALUATION & FLIGHT SURGEON NOTES</h4>
                <div className="sheet-text-block">
                  <p>
                    <strong>1. Cardiovascular Dynamics:</strong> Resting heart rate observations remain synchronized with the circadian schedule. Microgravity fluid cephalic shifts remain accommodated by autonomic compensatory mechanisms.
                  </p>
                  <p>
                    <strong>2. Sleep & Restorative Health:</strong> Total sleep cycle analysis reflects continuous simulated orbital monitoring. Neuro-behavioral recovery requires minimum 7.5 hours per flight cycle to prevent cognitive fatigue.
                  </p>
                  <p>
                    <strong>3. Musculoskeletal Countermeasures:</strong> Daily adherence to ARED (Advanced Resistive Exercise Device) and cycle ergometer protocol mitigates spaceflight bone mineral density reduction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="sheet-page">
              <div className="sheet-topline">
                <span className="sheet-wordmark">PAGE 2 · PHYSIOLOGICAL TELEMETRY TRENDS</span>
                <span className="tag">24-HOUR PROFILE</span>
              </div>

              <div className="trend-preview-list">
                <div className="trend-preview-item">
                  <div className="item-head">
                    <strong>HEART RATE PROFILE (24-HOUR RESTING)</strong>
                    <span>Latest: {current.hr} BPM · Baseline: {reportData.baseline.hr} BPM</span>
                  </div>
                  <div className="sparkline-bar">
                    {reportData.dayReadings.slice(-16).map((r, i) => (
                      <span
                        key={i}
                        className="bar"
                        style={{ height: `${Math.max(20, Math.min(100, (r.hr / 100) * 100))}%` }}
                        title={`Hour ${r.hour % 24}:00 - ${r.hr} BPM`}
                      />
                    ))}
                  </div>
                  <p className="item-desc">
                    Resting observation trend. Sustained heart rate &gt;10% above baseline over 3 readings prompts Attention status.
                  </p>
                </div>

                <div className="trend-preview-item">
                  <div className="item-head">
                    <strong>BLOOD OXYGEN (SPO2) TREND</strong>
                    <span>Latest: {current.spo2}% · Target: 98%</span>
                  </div>
                  <div className="sparkline-bar">
                    {reportData.dayReadings.slice(-16).map((r, i) => (
                      <span
                        key={i}
                        className="bar green"
                        style={{ height: `${(r.spo2 / 100) * 100}%` }}
                        title={`${r.spo2}%`}
                      />
                    ))}
                  </div>
                  <p className="item-desc">
                    Nominal space suit and habitat atmosphere maintains partial pressure of oxygen between 95% and 100%.
                  </p>
                </div>

                <div className="trend-preview-item">
                  <div className="item-head">
                    <strong>MULTI-NIGHT SLEEP DURATION</strong>
                    <span>Latest: {current.sleep}h · Target: {reportData.baseline.sleep}h</span>
                  </div>
                  <div className="sparkline-bar">
                    {reportData.nights.map((n, i) => (
                      <span
                        key={i}
                        className="bar blue"
                        style={{ height: `${(n.sleep / 9) * 100}%` }}
                        title={`Day ${n.day}: ${n.sleep}h`}
                      />
                    ))}
                  </div>
                  <p className="item-desc">
                    Recorded once per completed mission night. Two consecutive deficit nights (&lt;80%) trigger Fatigue review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "checkin" && (
            <div className="sheet-page">
              <div className="sheet-topline">
                <span className="sheet-wordmark">PAGE 3 · CHECK-IN & OPERATIONAL GUIDANCE</span>
                <span className="tag">SELF-REPORTED & PROTOCOLS</span>
              </div>

              <div className="sheet-section">
                <h4>CREW SELF-REPORTED DAILY CHECK-IN</h4>
                {reportData.checkin && reportData.checkin.answers ? (
                  <div className="checkin-answers-grid">
                    {Object.entries(reportData.checkin.answers).map(([q, a]) => (
                      <div className="checkin-answer-card" key={q}>
                        <span className="q-label">{q}</span>
                        <strong className="q-ans">{a}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-checkin-notice">
                    <Shield size={16} />
                    <div>
                      <strong>No daily check-in recorded for Mission Day {reportData.day}.</strong>
                      <p>
                        Astronauts are encouraged to log self-reported mood, sleep quality, and physical discomfort once daily via the ASTRA Crew Terminal.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="sheet-section">
                <h4>ACTIONABLE HEALTH COUNTERMEASURE RECOMMENDATIONS</h4>
                <ul className="recs-list">
                  <li>
                    <strong>1. Cardiovascular Conditioning:</strong> Perform scheduled 45-minute cycle ergometer session maintaining target heart rate (65-75% VO2 max) to preserve cardiovascular tone.
                  </li>
                  <li>
                    <strong>2. Resistive Musculoskeletal Training:</strong> Complete ARED squats and deadlifts according to daily load matrix.
                  </li>
                  <li>
                    <strong>3. Circadian Synchronization & Lighting:</strong> Adhere to habitat high-CRI 480nm blue-enriched lighting schedule during operational shifts. Switch quarters to 2700K warm lighting 90 minutes prior to sleep.
                  </li>
                  <li>
                    <strong>4. Hydration Protocol:</strong> Ensure minimum 2.4 liters hydration per 24-hour cycle with balanced sodium-potassium supplementation.
                  </li>
                </ul>
              </div>

              <div className="sheet-disclaimer">
                ASTRA is a prototype health self-assessment tool for the NASA Space Apps Challenge 2026. Not an FDA-approved diagnostic system.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="report-modal-footer">
          <span className="sheet-page-indicator">
            Viewing {activeTab === "summary" ? "Page 1: Summary" : activeTab === "trends" ? "Page 2: Trends" : "Page 3: Check-in"}
          </span>
          <div className="footer-actions">
            <button className="button outline" onClick={onClose}>
              CLOSE
            </button>
            <button
              className="button primary"
              onClick={handleDownload}
              disabled={generating}
            >
              <Download size={14} />
              {generating ? "GENERATING PDF..." : `DOWNLOAD DAY ${reportData.day} REPORT (PDF)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
