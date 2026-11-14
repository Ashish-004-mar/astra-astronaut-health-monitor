import { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flame,
  Activity,
  Info,
  Calendar,
  Save,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { useStore } from "../../state/store";
import {
  getExerciseSessions,
  logExerciseSession,
  getTodayExerciseDuration,
} from "../../services/hazardService";
import type { ExerciseSession, ExerciseType } from "../../types/hazards";

interface ExerciseTrackerSubpageProps {
  onBack: () => void;
}

export default function ExerciseTrackerSubpage({ onBack }: ExerciseTrackerSubpageProps) {
  const { mission } = useStore();
  const currentDay = mission.day;

  const [sessions, setSessions] = useState<ExerciseSession[]>(() => getExerciseSessions());
  const [todayDuration, setTodayDuration] = useState(() => getTodayExerciseDuration(currentDay));

  // Exercise Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerType, setTimerType] = useState<ExerciseType>("Resistance (ARED)");
  const [activeTab, setActiveTab] = useState<"tracker" | "weekly" | "timer">("tracker");
  const [notice, setNotice] = useState<string | null>(null);

  // Manual Log Form State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualType, setManualType] = useState<ExerciseType>("Treadmill (T2)");
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualNotes, setManualNotes] = useState("");

  const targetMinutes = 120; // NASA standard 2 hours countermeasure reference

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const refreshSessions = () => {
    const list = getExerciseSessions();
    setSessions(list);
    setTodayDuration(getTodayExerciseDuration(currentDay));
  };

  const handleSaveTimerSession = () => {
    if (timerSeconds < 10) {
      setNotice("Session must be at least 10 seconds to record.");
      return;
    }
    const minutes = Math.max(1, Math.round(timerSeconds / 60));
    const caloriesBurned = Math.round(minutes * 7.5);

    logExerciseSession({
      exerciseType: timerType,
      durationMinutes: minutes,
      missionDay: currentDay,
      caloriesBurned,
      notes: `Timer recorded session (${timerSeconds}s elapsed).`,
    });

    setTimerRunning(false);
    setTimerSeconds(0);
    refreshSessions();
    setNotice(`Saved ${minutes} min ${timerType} session!`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caloriesBurned = Math.round(manualMinutes * 7.5);

    logExerciseSession({
      exerciseType: manualType,
      durationMinutes: manualMinutes,
      missionDay: currentDay,
      caloriesBurned,
      notes: manualNotes.trim() || undefined,
    });

    setIsManualModalOpen(false);
    setManualNotes("");
    refreshSessions();
    setNotice(`Logged ${manualMinutes} min ${manualType}!`);
  };

  // Format timer HH:MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Weekly data for bar chart
  const weeklyData = [
    { day: "Day 142", minutes: 110, target: targetMinutes },
    { day: "Day 143", minutes: 125, target: targetMinutes },
    { day: "Day 144", minutes: 95, target: targetMinutes },
    { day: "Day 145", minutes: 120, target: targetMinutes },
    { day: "Day 146", minutes: 80, target: targetMinutes },
    { day: `Day ${currentDay}`, minutes: todayDuration, target: targetMinutes },
  ];

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO MY HEALTH
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            MY HEALTH <span>/</span> MUSCLE & EXERCISE TRACKER
          </div>
          <h1>MUSCLE & EXERCISE COUNTERMEASURES</h1>
          <p className="subpage-subtitle">
            Counteracting microgravity musculoskeletal deconditioning through targeted exercise.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="nutrition-notice-banner" role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button className="notice-dismiss-btn" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}

      {/* NASA Context */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA COUNTERMEASURES PROTOCOL CONTEXT</strong>
        </div>
        <p>
          In microgravity, crew members typically spend approximately two hours daily performing resistive (ARED) and cardiovascular (T2 treadmill / CEVIS cycle) exercises. This daily regimen preserves bone mineral density, maintains cardiac volume, and counteracts muscular atrophy. Two hours is an operational reference and may be tailored per crew member.
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/gravity-fields/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Gravity Fields & Bone Loss Research ↗
        </a>
      </section>

      {/* Overview Metric Row */}
      <div className="metrics-summary-row">
        <div className="metric-box">
          <span className="metric-label">EXERCISE COMPLETED TODAY</span>
          <div className="metric-value-row">
            <span className="big-val">{todayDuration}</span>
            <span className="unit">minutes</span>
          </div>
          <small className="metric-meta">
            Target: {targetMinutes} min ({Math.round((todayDuration / targetMinutes) * 100)}%)
          </small>
        </div>

        <div className="metric-box">
          <span className="metric-label">SESSIONS LOGGED</span>
          <div className="metric-value-row">
            <span className="big-val">
              {sessions.filter((s) => s.missionDay === currentDay).length}
            </span>
          </div>
          <small className="metric-meta">Day {currentDay} completed sessions</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">ESTIMATED ENERGY EXPENDITURE</span>
          <div className="metric-value-row">
            <span className="big-val">{Math.round(todayDuration * 7.5)}</span>
            <span className="unit">kcal</span>
          </div>
          <small className="metric-meta">Derived metabolic burn</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">COUNTERMEASURE CONSISTENCY</span>
          <div className="metric-value-row">
            <span className="big-val">{todayDuration >= targetMinutes ? "OPTIMAL" : "ACTIVE"}</span>
          </div>
          <small className="metric-meta">Consistent daily mechanical load</small>
        </div>
      </div>

      {/* Action Pills */}
      <div className="subpage-action-pills">
        <button
          className={`button ${activeTab === "timer" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("timer")}
        >
          START EXERCISE TIMER
        </button>
        <button
          className="button outline"
          onClick={() => setIsManualModalOpen(true)}
        >
          <Plus size={14} /> LOG EXERCISE
        </button>
        <button
          className={`button ${activeTab === "weekly" ? "primary" : "outline"}`}
          onClick={() => setActiveTab("weekly")}
        >
          VIEW WEEKLY TREND
        </button>
      </div>

      {/* Exercise Timer Panel */}
      {activeTab === "timer" && (
        <section className="panel exercise-timer-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">LIVE WORKOUT TIMER</span>
              <h2>Active Exercise Session Counter</h2>
            </div>
            <select
              value={timerType}
              onChange={(e) => setTimerType(e.target.value as ExerciseType)}
              className="timer-type-select"
            >
              <option value="Resistance (ARED)">Resistance (ARED)</option>
              <option value="Treadmill (T2)">Treadmill (T2)</option>
              <option value="Stationary Cycling (CEVIS)">Stationary Cycling (CEVIS)</option>
              <option value="Mobility & Stretch">Mobility & Stretch</option>
              <option value="EVA Simulation Movement">EVA Simulation Movement</option>
            </select>
          </div>

          <div className="timer-display-box">
            <div className="timer-digits">{formatTime(timerSeconds)}</div>
            <span className="timer-type-label">{timerType}</span>
          </div>

          <div className="timer-controls-row">
            {!timerRunning ? (
              <button
                className="button primary"
                onClick={() => setTimerRunning(true)}
              >
                <Play size={16} /> START TIMER
              </button>
            ) : (
              <button
                className="button outline"
                onClick={() => setTimerRunning(false)}
              >
                <Pause size={16} /> PAUSE
              </button>
            )}

            <button
              className="button outline"
              onClick={() => {
                setTimerRunning(false);
                setTimerSeconds(0);
              }}
            >
              <RotateCcw size={15} /> RESET
            </button>

            <button
              className="button primary"
              onClick={handleSaveTimerSession}
              disabled={timerSeconds < 10}
            >
              <Save size={15} /> SAVE SESSION
            </button>
          </div>
        </section>
      )}

      {/* Weekly Trend Graph */}
      {activeTab === "weekly" && (
        <section className="panel chart-panel">
          <div className="chart-header">
            <div>
              <span className="eyebrow">COUNTERMEASURE DISCIPLINE</span>
              <h2>Weekly Exercise Duration vs. 120-min Target</h2>
            </div>
          </div>

          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#4b6171" tick={{ fill: "#82949e", fontSize: 11 }} />
                <YAxis stroke="#4b6171" tick={{ fill: "#82949e", fontSize: 11 }} domain={[0, 150]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(8, 23, 38, 0.95)",
                    borderColor: "rgba(118, 223, 203, 0.4)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(val: any) => [`${val} min`, "Exercise"]}
                />
                <ReferenceLine
                  y={targetMinutes}
                  stroke="#76dfcb"
                  strokeDasharray="3 3"
                  label={{
                    value: "2h Target",
                    fill: "#76dfcb",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
                <Bar dataKey="minutes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-caption">
            Daily physical load counters rapid osteoclast bone resorption and postural muscle decay.
          </p>
        </section>
      )}

      {/* Today's Recorded Sessions */}
      <section className="panel sessions-list-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">CHRONOLOGICAL SESSIONS</span>
            <h2>Today’s Exercise Records (Day {currentDay})</h2>
          </div>
          <span className="tag">
            <Clock size={12} /> {sessions.length} TOTAL LOGGED
          </span>
        </div>

        <div className="exercise-sessions-grid">
          {sessions
            .filter((s) => s.missionDay === currentDay)
            .map((s) => (
              <div key={s.id} className="session-card">
                <div className="session-card-head">
                  <strong>{s.exerciseType}</strong>
                  <span className="session-duration-tag">{s.durationMinutes} min</span>
                </div>
                <div className="session-meta">
                  <span>Burn: ~{s.caloriesBurned ?? Math.round(s.durationMinutes * 7.5)} kcal</span>
                  {s.avgHeartRate && <span>Avg HR: {s.avgHeartRate} BPM</span>}
                </div>
                {s.notes && <p className="session-notes">"{s.notes}"</p>}
              </div>
            ))}
        </div>

        <div className="distinction-note-box">
          <Info size={14} />
          <span>
            <strong>Scientific Distinction:</strong> On-device MediaPipe camera tracking provides kinematic visual feedback of visible posture and landmarks. It does NOT clinically measure muscle density, bone mineral loss, or physical fitness.
          </span>
        </div>
      </section>

      {/* Manual Log Modal */}
      {isManualModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsManualModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Exercise Session</h2>
              <button className="icon-button" onClick={() => setIsManualModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleManualSubmit} className="meal-log-form">
              <div className="form-group">
                <label className="form-label">Exercise Modality</label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as ExerciseType)}
                  className="type-select"
                >
                  <option value="Treadmill (T2)">Treadmill (T2)</option>
                  <option value="Resistance (ARED)">Resistance (ARED)</option>
                  <option value="Stationary Cycling (CEVIS)">Stationary Cycling (CEVIS)</option>
                  <option value="Mobility & Stretch">Mobility & Stretch</option>
                  <option value="EVA Simulation Movement">EVA Simulation Movement</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(parseInt(e.target.value, 10) || 5)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 5 sets deadlifts, completed without lumbar strain"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => setIsManualModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button primary">
                  Save Exercise Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
