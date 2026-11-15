import {
  Smile,
  Zap,
  Moon,
  Target,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  Compass,
  HeartHandshake,
} from "lucide-react";
import type {
  MentalCheckinEntry,
  RecoverySessionRecord,
  PersonalBaselineStats,
  WellnessSuggestion,
} from "../../services/mindspaceService";

interface MindSpaceOverviewProps {
  todayCheckin?: MentalCheckinEntry;
  baseline: PersonalBaselineStats;
  suggestions: WellnessSuggestion[];
  recentRecovery?: RecoverySessionRecord;
  totalRecoveryCount: number;
  onOpenCheckin: () => void;
  onNavigateTab: (tab: "recovery" | "harmony" | "focus" | "journal" | "trends" | "support") => void;
  onOpenSupport: () => void;
  isDemoMode: boolean;
}

export default function MindSpaceOverview({
  todayCheckin,
  baseline,
  suggestions,
  recentRecovery,
  totalRecoveryCount,
  onOpenCheckin,
  onNavigateTab,
  onOpenSupport,
  isDemoMode,
}: MindSpaceOverviewProps) {
  const provenanceTag = todayCheckin
    ? todayCheckin.provenance
    : "NO DATA";

  return (
    <div className="mindspace-overview-container">
      {/* Top Banner Notice */}
      <div className="provenance-status-bar">
        <div className="provenance-left">
          <span className={`provenance-chip ${provenanceTag === "SIMULATED" ? "chip-simulated" : provenanceTag === "SELF-REPORTED" ? "chip-self" : "chip-nodata"}`}>
            DATA PROVENANCE: {provenanceTag}
          </span>
          <span className="non-clinical-badge">
            <ShieldCheck size={12} /> VOLUNTARY NON-CLINICAL SELF-REFLECTION
          </span>
        </div>
        {isDemoMode && (
          <span className="demo-indicator-pill">
            <Sparkles size={11} /> SYNTHETIC DEMONSTRATION MODE ACTIVE
          </span>
        )}
      </div>

      {/* Main Grid: Status Cards & Primary Action */}
      <div className="overview-cards-grid">
        {/* Card 1: Today's Mood */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">TODAY’S MOOD</span>
            <Smile size={16} className="card-icon accent-cyan" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <span className="val-text capitalize">{todayCheckin.mood}</span>
            ) : (
              <span className="val-text muted">Not recorded</span>
            )}
          </div>
          <small className="card-meta">
            {todayCheckin ? todayCheckin.timeFormatted : "Awaiting voluntary entry"}
          </small>
        </div>

        {/* Card 2: Perceived Stress */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">PERCEIVED STRESS</span>
            <Activity size={16} className="card-icon accent-mint" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <div className="stress-badge-row">
                <span className="val-text big">{todayCheckin.stress}</span>
                <span className="unit-label">/ 10</span>
                <span className={`stress-qualifier ${todayCheckin.stress <= 3 ? "low" : todayCheckin.stress <= 6 ? "moderate" : "elevated"}`}>
                  {todayCheckin.stress <= 3 ? "LOW" : todayCheckin.stress <= 6 ? "MODERATE" : "ELEVATED"}
                </span>
              </div>
            ) : (
              <span className="val-text muted">— / 10</span>
            )}
          </div>
          <small className="card-meta">
            {baseline.hasSufficientData && baseline.avgStress !== null
              ? `Personal baseline: ${baseline.avgStress}/10 (${baseline.observationCount} obs)`
              : "Baseline requires >= 3 check-ins"}
          </small>
        </div>

        {/* Card 3: Energy Level */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">ENERGY LEVEL</span>
            <Zap size={16} className="card-icon accent-orange" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <span className="val-text capitalize">{todayCheckin.energy}</span>
            ) : (
              <span className="val-text muted">Not recorded</span>
            )}
          </div>
          <small className="card-meta">Physical and cognitive stamina</small>
        </div>

        {/* Card 4: Sleep Quality */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">SLEEP QUALITY</span>
            <Moon size={16} className="card-icon accent-indigo" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <span className="val-text capitalize">{todayCheckin.sleep}</span>
            ) : (
              <span className="val-text muted">Not recorded</span>
            )}
          </div>
          <small className="card-meta">Last scheduled sleep block</small>
        </div>

        {/* Card 5: Focus & Readiness */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">ATTENTION & FOCUS</span>
            <Target size={16} className="card-icon accent-cyan" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <span className="val-text capitalize">{todayCheckin.focus}</span>
            ) : (
              <span className="val-text muted">Not recorded</span>
            )}
          </div>
          <small className="card-meta">Procedural checklist clarity</small>
        </div>

        {/* Card 6: Crew Connection */}
        <div className="mind-metric-card">
          <div className="card-top">
            <span className="card-lbl">CREW CONNECTION</span>
            <Users size={16} className="card-icon accent-mint" />
          </div>
          <div className="card-value">
            {todayCheckin ? (
              <span className="val-text capitalize">{todayCheckin.crewConnection}</span>
            ) : (
              <span className="val-text muted">Not recorded</span>
            )}
          </div>
          <small className="card-meta">Team cohesion & harmony</small>
        </div>
      </div>

      {/* Primary Action / Check-in Prompt Bar */}
      <section className="panel checkin-banner-panel">
        <div className="banner-content">
          <div className="banner-icon-box">
            <Sparkles size={24} className="accent-mint" />
          </div>
          <div className="banner-text">
            <h3>
              {todayCheckin
                ? `Today's Check-in Complete (Mission Day ${todayCheckin.missionDay})`
                : "Daily Mental Wellness Check-in (60–120 Seconds)"}
            </h3>
            <p>
              {todayCheckin
                ? `Logged at ${todayCheckin.timeFormatted}. You rated stress as ${todayCheckin.stress}/10 and focus as ${todayCheckin.focus}. You can update your answers anytime.`
                : "A voluntary, private moment to reflect on mood, fatigue, and stress. Stored locally without automatic supervisor transmission."}
            </p>
          </div>
        </div>
        <div className="banner-cta">
          <button
            type="button"
            className="button primary"
            onClick={onOpenCheckin}
          >
            {todayCheckin ? "Edit Today’s Check-in" : "Start Daily Check-in"} <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Suggestions & Recovery Section */}
      <div className="overview-split-layout">
        {/* Left: Personalized Suggestions Engine */}
        <section className="panel suggestions-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">TRANSPARENT HEURISTICS</span>
              <h2>Personalized Wellness Suggestions</h2>
            </div>
            <span className="tag">VOLUNTARY COPING</span>
          </div>

          <div className="suggestions-list">
            {suggestions.map((sug) => (
              <div key={sug.id} className="suggestion-card">
                <div className="sug-header">
                  <span className={`sug-priority-tag priority-${sug.priority}`}>
                    {sug.priority.toUpperCase()} PRIORITY
                  </span>
                  <h4>{sug.title}</h4>
                </div>
                <div className="sug-reason-box">
                  <Info size={14} className="info-icon" />
                  <p>
                    <strong>Why this was suggested:</strong> {sug.reason}
                  </p>
                </div>
                <div className="sug-action-row">
                  <button
                    type="button"
                    className="button outline small-btn"
                    onClick={() => onNavigateTab(sug.actionTab)}
                  >
                    {sug.actionLabel} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Recovery History & Quick Tool Shortcuts */}
        <div className="overview-side-col">
          {/* Recovery Stats Card */}
          <section className="panel recovery-summary-card">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">ACTIVE RESILIENCE</span>
                <h2>Stress Recovery Sessions</h2>
              </div>
              <span className="tag">{totalRecoveryCount} COMPLETED</span>
            </div>

            {recentRecovery ? (
              <div className="recent-rec-body">
                <div className="recent-rec-item">
                  <Clock size={16} className="accent-cyan" />
                  <div>
                    <strong>{recentRecovery.title}</strong>
                    <p>
                      Duration: {Math.round(recentRecovery.durationSeconds / 60)} min ·{" "}
                      {recentRecovery.stressDelta !== undefined && (
                        <span>
                          Self-reported change: {recentRecovery.stressDelta > 0 ? `+${recentRecovery.stressDelta}` : recentRecovery.stressDelta}/10
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="button outline full-width"
                  onClick={() => onNavigateTab("recovery")}
                >
                  Open Recovery Studio <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="empty-rec-body">
                <p>No stress recovery activities recorded yet today.</p>
                <button
                  type="button"
                  className="button outline full-width"
                  onClick={() => onNavigateTab("recovery")}
                >
                  Start Guided Breathing <ArrowRight size={13} />
                </button>
              </div>
            )}
          </section>

          {/* Quick Hub Shortcuts */}
          <section className="panel shortcuts-panel">
            <div className="panel-heading">
              <span>EXPLORE MINDSPACE MODULES</span>
            </div>
            <div className="shortcuts-grid">
              <button
                type="button"
                className="shortcut-tile"
                onClick={() => onNavigateTab("harmony")}
              >
                <Users size={16} className="tile-icon accent-mint" />
                <div className="tile-info">
                  <strong>Crew Harmony</strong>
                  <span>Team communication & conflict resolution</span>
                </div>
              </button>

              <button
                type="button"
                className="shortcut-tile"
                onClick={() => onNavigateTab("focus")}
              >
                <Target size={16} className="tile-icon accent-orange" />
                <div className="tile-info">
                  <strong>Focus & Readiness</strong>
                  <span>Task breakdown & reaction-time practice</span>
                </div>
              </button>

              <button
                type="button"
                className="shortcut-tile"
                onClick={() => onNavigateTab("journal")}
              >
                <Compass size={16} className="tile-icon accent-cyan" />
                <div className="tile-info">
                  <strong>Private Journal</strong>
                  <span>Confidential offline reflections</span>
                </div>
              </button>

              <button
                type="button"
                className="shortcut-tile"
                onClick={() => onNavigateTab("trends")}
              >
                <Activity size={16} className="tile-icon accent-indigo" />
                <div className="tile-info">
                  <strong>Wellness Trends</strong>
                  <span>Self-reported 7/14/30-day baseline charts</span>
                </div>
              </button>
            </div>
          </section>

          {/* Support Banner */}
          <div className="support-callout-card">
            <HeartHandshake size={20} className="callout-icon" />
            <div className="callout-text">
              <strong>Need Confidential Support?</strong>
              <p>
                Access authorized Flight Surgeon, BMed consultation guidelines, and crisis escalation protocols.
              </p>
            </div>
            <button
              type="button"
              className="button outline alert-btn"
              onClick={onOpenSupport}
            >
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
