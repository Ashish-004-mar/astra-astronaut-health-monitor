import { useState } from "react";
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Database,
  Calendar,
  Activity,
  Trash2,
  RotateCcw,
  FileText,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useStore } from "../../state/store";
import {
  getWellnessRecords,
  saveWellnessRecord,
  deleteWellnessRecord,
  resetToDefaultWellnessRecords,
  getWellnessStats,
  type WellnessCheckinRecord,
} from "../../services/wellnessService";
import { downloadWellnessReportPDF } from "../../services/wellnessPdfReport";

interface QuickWellnessCheckinSubpageProps {
  onBack: () => void;
}

const steps = [
  {
    key: "Sleep",
    title: "How was your sleep quality last night?",
    subtitle: "Considers sleep continuity, comfort in the crew quarters, and ease of waking.",
    options: ["Poor", "Fair", "Good"],
  },
  {
    key: "Energy",
    title: "What is your energy level right now?",
    subtitle: "Assess your physical stamina for scheduled tasks and exercise.",
    options: ["Low", "Normal", "High"],
  },
  {
    key: "Stress",
    title: "How would you rate your operational stress today?",
    subtitle: "Workload intensity, schedule pacing, and mental tension.",
    options: ["Low", "Medium", "High"],
  },
  {
    key: "Mood",
    title: "How is your mood and overall morale?",
    subtitle: "Emotional resilience, connection with team, and general outlook.",
    options: ["Good", "Okay", "Low"],
  },
  {
    key: "Physical discomfort",
    title: "Are you feeling any physical discomfort?",
    subtitle: "Common spaceflight symptoms include back lengthening soreness and space motion nausea.",
    options: ["None", "Mild", "Significant"],
  },
];

export default function QuickWellnessCheckinSubpage({ onBack }: QuickWellnessCheckinSubpageProps) {
  const { checkins, save, mission } = useStore();
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const existing = checkins.find((c) => c.date === dateStr);

  // Active View Tab: "checkin" or "database"
  const [activeTab, setActiveTab] = useState<"checkin" | "database">("checkin");

  // Wellness records state loaded from service
  const [records, setRecords] = useState<WellnessCheckinRecord[]>(() => getWellnessRecords());
  const [latestSavedRecord, setLatestSavedRecord] = useState<WellnessCheckinRecord | null>(null);

  // Download notification feedback
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Form state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {
      Sleep: "Good",
      Energy: "Normal",
      Stress: "Low",
      Mood: "Good",
      "Physical discomfort": "None",
    },
  );
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const step = steps[currentStepIndex];
  const stats = getWellnessStats(records);

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [step.key]: opt }));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    const finalAnswers = {
      ...answers,
      ...(notes.trim() ? { Notes: notes.trim() } : {}),
    };

    // 1. Save to global store for application-wide sync and telemetry
    save({
      date: dateStr,
      timestamp: new Date().toISOString(),
      provenance: "SELF-REPORTED",
      answers: finalAnswers,
    });

    // 2. Save into dedicated wellness database archive
    const newRecord = saveWellnessRecord({
      missionDay: mission.day ?? 147,
      date: dateStr,
      answers: finalAnswers,
      notes: notes.trim(),
    });

    setLatestSavedRecord(newRecord);
    setRecords(getWellnessRecords());
    setIsCompleted(true);
  };

  const handleDownloadPDF = (record: WellnessCheckinRecord) => {
    const filename = downloadWellnessReportPDF(record);
    setDownloadNotice(`Generated & Downloaded: ${filename}`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteWellnessRecord(id);
    setRecords(updated);
    if (latestSavedRecord?.id === id) {
      setLatestSavedRecord(null);
    }
  };

  const handleResetSeed = () => {
    const seed = resetToDefaultWellnessRecords();
    setRecords(seed);
  };

  const startNewCheckin = () => {
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setNotes("");
    setActiveTab("checkin");
  };

  return (
    <div className="subpage-container wellness-subpage">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO CHECK-IN
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            CHECK-IN <span>/</span> QUICK 2-MINUTE WELLNESS CHECK & DATABASE
          </div>
          <h1>QUICK CREW WELLNESS CHECK</h1>
          <p className="subpage-subtitle">
            Fast, focused daily self-assessment completed in two minutes or less, with persistent
            database archiving and downloadable single-page aerospace flight reports.
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="wellness-view-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "checkin"}
          className={`wellness-tab-btn ${activeTab === "checkin" ? "active" : ""}`}
          onClick={() => setActiveTab("checkin")}
        >
          <Sparkles size={16} />
          {isCompleted ? "CHECK-IN COMPLETE & REPORT" : "+ NEW 2-MIN CHECK"}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "database"}
          className={`wellness-tab-btn ${activeTab === "database" ? "active" : ""}`}
          onClick={() => setActiveTab("database")}
        >
          <Database size={16} />
          WELLNESS DATABASE & ARCHIVE ({records.length})
        </button>
      </div>

      {/* Floating Download Feedback Notice */}
      {downloadNotice && (
        <div className="wellness-download-banner">
          <CheckCircle2 size={16} className="accent-mint" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* TAB 1: CHECK-IN / COMPLETION VIEW */}
      {activeTab === "checkin" && (
        <>
          {!isCompleted ? (
            <section className="panel quick-checkin-stage">
              {/* Progress Indicator */}
              <div className="checkin-progress-bar-container">
                <div className="progress-labels">
                  <span>
                    QUESTION {currentStepIndex + 1} OF {steps.length}
                  </span>
                  <span>
                    <Clock size={12} /> ~90 SECONDS
                  </span>
                </div>
                <div className="checkin-progress-track">
                  <div
                    className="checkin-progress-fill"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="question-content-box">
                <span className="question-step-tag">Step {currentStepIndex + 1}</span>
                <h2>{step.title}</h2>
                <p className="question-subtitle">{step.subtitle}</p>

                <div className="options-selection-grid">
                  {step.options.map((opt) => {
                    const isSelected = answers[step.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        className={`wellness-option-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectOption(opt)}
                      >
                        <span className="option-name">{opt}</span>
                        {isSelected && <Check size={18} className="option-check-icon" />}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Notes on the last step */}
                {currentStepIndex === steps.length - 1 && (
                  <div className="optional-notes-box">
                    <label className="form-label">Optional Short Note (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mild headache post-EVA; hydrated with 500ml water."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Nav Controls */}
              <div className="quick-checkin-nav-row">
                <button className="button outline" onClick={handleBack}>
                  <ArrowLeft size={15} /> BACK
                </button>
                <button className="button primary" onClick={handleNext}>
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      <Check size={16} /> SUBMIT CHECK-IN
                    </>
                  ) : (
                    <>
                      NEXT <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </section>
          ) : (
            <section className="panel checkin-success-panel wellness-success-card">
              <div className="success-anim-box">
                <CheckCircle2 size={52} className="accent-mint" />
                <h2>Check-in Recorded & Archived</h2>
                <p className="success-tagline">
                  Your mission wellness profile has been securely saved to the on-device habitat database.
                </p>
              </div>

              {/* Readiness Score Hero Card */}
              {latestSavedRecord && (
                <div
                  className="wellness-hero-score"
                  style={{
                    borderColor: latestSavedRecord.statusColor,
                  }}
                >
                  <div className="score-main-group">
                    <div className="score-num" style={{ color: latestSavedRecord.statusColor }}>
                      {latestSavedRecord.score}
                      <span className="score-total">/ 100</span>
                    </div>
                    <div className="score-badge-col">
                      <span
                        className="status-pill-badge"
                        style={{
                          backgroundColor: `${latestSavedRecord.statusColor}22`,
                          color: latestSavedRecord.statusColor,
                          border: `1px solid ${latestSavedRecord.statusColor}66`,
                        }}
                      >
                        <ShieldCheck size={13} /> {latestSavedRecord.readinessStatus} READINESS
                      </span>
                      <p className="score-summary-text">{latestSavedRecord.summary}</p>
                    </div>
                  </div>

                  <div className="score-countermeasure-box">
                    <strong>PRESCRIBED COUNTERMEASURE:</strong> {latestSavedRecord.countermeasure}
                  </div>
                </div>
              )}

              {/* Recorded Answers Recap */}
              <div className="summary-recap-box">
                <h3>Recorded Answers (Mission Day {mission.day ?? 147} · {dateStr})</h3>
                <div className="recap-grid">
                  {Object.entries(answers).map(([q, ans]) => (
                    <div key={q} className="recap-item">
                      <span className="recap-q">{q}:</span>
                      <strong className="recap-ans">{ans}</strong>
                    </div>
                  ))}
                  {notes.trim() && (
                    <div className="recap-item recap-notes-span">
                      <span className="recap-q">Subjective Notes:</span>
                      <strong className="recap-ans">"{notes.trim()}"</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Dedicated Download PDF Action & Navigation */}
              <div className="wellness-success-actions">
                {latestSavedRecord && (
                  <button
                    className="button primary download-pdf-cta"
                    onClick={() => handleDownloadPDF(latestSavedRecord)}
                  >
                    <Download size={18} /> DOWNLOAD THIS WELLNESS PDF REPORT
                  </button>
                )}

                <div className="secondary-buttons-row">
                  <button
                    className="button secondary"
                    onClick={() => setActiveTab("database")}
                  >
                    <Database size={15} /> VIEW IN DATABASE ARCHIVE ({records.length})
                  </button>

                  <button className="button outline" onClick={startNewCheckin}>
                    <PlusCircle size={15} /> START NEW CHECK-IN
                  </button>

                  <button className="button outline" onClick={onBack}>
                    RETURN TO CHECK-IN LOG
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* TAB 2: DATABASE & ARCHIVE VIEW */}
      {activeTab === "database" && (
        <section className="wellness-database-section">
          {/* Quick Metrics KPI Bar */}
          <div className="wellness-stat-grid">
            <div className="panel wellness-stat-card">
              <span className="stat-label">TOTAL RECORDS ARCHIVED</span>
              <div className="stat-val">{stats.totalCount}</div>
              <span className="stat-sub">100% on-device SQLite / LocalStorage</span>
            </div>
            <div className="panel wellness-stat-card">
              <span className="stat-label">AVERAGE READINESS SCORE</span>
              <div className="stat-val accent-mint">{stats.averageScore} / 100</div>
              <span className="stat-sub">Across all mission assessments</span>
            </div>
            <div className="panel wellness-stat-card">
              <span className="stat-label">LATEST CREW STATUS</span>
              <div
                className="stat-val"
                style={{
                  color:
                    stats.latestStatus === "OPTIMAL"
                      ? "#10b981"
                      : stats.latestStatus === "NOMINAL"
                        ? "#0ea5e9"
                        : "#f59e0b",
                }}
              >
                {stats.latestStatus}
              </div>
              <span className="stat-sub">Mission Day {mission.day ?? 147} Telemetry</span>
            </div>
            <div className="panel wellness-stat-card">
              <span className="stat-label">PDF REPORT EXPORTS</span>
              <div className="stat-val accent-cyan">SINGLE-PAGE</div>
              <span className="stat-sub">Instant aerospace PDF download</span>
            </div>
          </div>

          {/* Database Controls Header */}
          <div className="database-controls-bar">
            <div>
              <h3>Wellness Telemetry Database Archive</h3>
              <p className="controls-sub">
                Historical records of all 2-minute crew wellness assessments with individual PDF report generation.
              </p>
            </div>
            <div className="controls-actions">
              <button className="button primary" onClick={startNewCheckin}>
                <Sparkles size={14} /> + LOG NEW CHECK-IN
              </button>
              <button
                className="button outline"
                onClick={handleResetSeed}
                title="Restore default sample historical records"
              >
                <RotateCcw size={14} /> RESET SAMPLE DATA
              </button>
            </div>
          </div>

          {/* Records List */}
          {records.length === 0 ? (
            <div className="panel empty-records-box">
              <ClipboardCheck size={36} className="text-muted" />
              <h4>No Wellness Records Found</h4>
              <p>No 2-minute assessments logged yet. Start a new check-in to begin logging telemetry.</p>
              <button className="button primary" onClick={startNewCheckin}>
                START 2-MIN CHECK-IN
              </button>
            </div>
          ) : (
            <div className="wellness-records-list">
              {records.map((rec) => (
                <article key={rec.id} className="panel wellness-record-card">
                  {/* Card Top Row */}
                  <div className="record-header-row">
                    <div className="record-title-group">
                      <span className="mission-day-badge">MISSION DAY {rec.missionDay}</span>
                      <span className="record-timestamp">
                        <Calendar size={13} /> {rec.date} · {rec.timeFormatted}
                      </span>
                    </div>

                    <div className="record-score-badge-group">
                      <span
                        className="status-pill-badge"
                        style={{
                          backgroundColor: `${rec.statusColor}22`,
                          color: rec.statusColor,
                          border: `1px solid ${rec.statusColor}66`,
                        }}
                      >
                        <Activity size={13} /> {rec.readinessStatus} ({rec.score}/100)
                      </span>

                      <button
                        className="button primary small-btn download-card-btn"
                        onClick={() => handleDownloadPDF(rec)}
                        title="Download PDF report for this specific check-in"
                      >
                        <Download size={14} /> DOWNLOAD PDF
                      </button>

                      <button
                        className="record-delete-btn"
                        onClick={() => handleDeleteRecord(rec.id)}
                        title="Delete record from database"
                        aria-label="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Answers Chips Grid */}
                  <div className="record-answers-chips">
                    <span className="answer-chip">
                      <span className="chip-key">Sleep:</span>
                      <strong className={`chip-val ${rec.answers.Sleep === "Good" ? "good" : ""}`}>
                        {rec.answers.Sleep}
                      </strong>
                    </span>
                    <span className="answer-chip">
                      <span className="chip-key">Energy:</span>
                      <strong className={`chip-val ${rec.answers.Energy === "High" ? "good" : ""}`}>
                        {rec.answers.Energy}
                      </strong>
                    </span>
                    <span className="answer-chip">
                      <span className="chip-key">Stress:</span>
                      <strong className={`chip-val ${rec.answers.Stress === "Low" ? "good" : ""}`}>
                        {rec.answers.Stress}
                      </strong>
                    </span>
                    <span className="answer-chip">
                      <span className="chip-key">Mood:</span>
                      <strong className={`chip-val ${rec.answers.Mood === "Good" ? "good" : ""}`}>
                        {rec.answers.Mood}
                      </strong>
                    </span>
                    <span className="answer-chip">
                      <span className="chip-key">Discomfort:</span>
                      <strong className={`chip-val ${rec.answers["Physical discomfort"] === "None" ? "good" : ""}`}>
                        {rec.answers["Physical discomfort"]}
                      </strong>
                    </span>
                  </div>

                  {/* Optional Notes Quote */}
                  {rec.answers.Notes && (
                    <div className="record-notes-quote">
                      <FileText size={13} className="accent-cyan" />
                      <span>"{rec.answers.Notes}"</span>
                    </div>
                  )}

                  {/* Summary & Countermeasure Brief */}
                  <div className="record-footer-brief">
                    <span className="record-summary-snippet">{rec.summary}</span>
                    <span className="record-counter-snippet">
                      <strong>Directive:</strong> {rec.countermeasure}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
