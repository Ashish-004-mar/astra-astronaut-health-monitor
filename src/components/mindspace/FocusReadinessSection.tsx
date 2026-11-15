import { useState, useEffect, useRef } from "react";
import {
  Target,
  Clock,
  Zap,
  ListPlus,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import {
  playSoothingChime,
  getReactionRecords,
  saveReactionRecord,
  type ReactionRecord,
} from "../../services/mindspaceService";

type FocusTab = "timer" | "reaction" | "breakdown" | "workload";

export default function FocusReadinessSection() {
  const [activeTab, setActiveTab] = useState<FocusTab>("timer");

  // ----------------------------------------------------
  // 1. FOCUS TIMER STATE
  // ----------------------------------------------------
  const [timerMinutes, setTimerMinutes] = useState<number>(10);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(600);
  const [timerStatus, setTimerStatus] = useState<"idle" | "running" | "paused" | "completed">("idle");
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerStatus === "idle") {
      setTimerSecondsLeft(timerMinutes * 60);
    }
  }, [timerMinutes, timerStatus]);

  useEffect(() => {
    if (timerStatus !== "running") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setTimerStatus("completed");
          playSoothingChime(750, 2.0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerStatus]);

  const handleStartTimer = () => setTimerStatus("running");
  const handlePauseTimer = () => setTimerStatus("paused");
  const handleResetTimer = () => {
    setTimerStatus("idle");
    setTimerSecondsLeft(timerMinutes * 60);
  };

  // ----------------------------------------------------
  // 2. REACTION-TIME PRACTICE STATE (5 Trials)
  // ----------------------------------------------------
  type ReactionState = "IDLE" | "WAITING" | "READY" | "EARLY" | "TRIAL_COMPLETE" | "ALL_DONE";

  const [rxState, setRxState] = useState<ReactionState>("IDLE");
  const [currentTrialIdx, setCurrentTrialIdx] = useState<number>(0);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [earlyClicksCount, setEarlyClicksCount] = useState<number>(0);
  const [lastTrialMs, setLastTrialMs] = useState<number | null>(null);
  const [rxHistory, setRxHistory] = useState<ReactionRecord[]>(() => getReactionRecords());

  const stimulusStartTimeRef = useRef<number>(0);
  const stimulusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    };
  }, []);

  const startNextTrial = () => {
    setRxState("WAITING");
    setLastTrialMs(null);

    // Random delay between 1.5s and 4.0s
    const delay = Math.floor(Math.random() * 2500) + 1500;
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);

    stimulusTimeoutRef.current = setTimeout(() => {
      setRxState("READY");
      stimulusStartTimeRef.current = performance.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (rxState === "WAITING") {
      // Clicked too early!
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      setRxState("EARLY");
      setEarlyClicksCount((prev) => prev + 1);
      return;
    }

    if (rxState === "READY") {
      const elapsed = Math.round(performance.now() - stimulusStartTimeRef.current);
      setLastTrialMs(elapsed);
      const updatedTrials = [...trialTimes, elapsed];
      setTrialTimes(updatedTrials);

      if (updatedTrials.length >= 5) {
        // Completed 5 trials
        setRxState("ALL_DONE");
        const sum = updatedTrials.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / updatedTrials.length);
        const sorted = [...updatedTrials].sort((a, b) => a - b);
        const med = sorted[Math.floor(sorted.length / 2)];

        const record = saveReactionRecord({
          trials: updatedTrials,
          averageMs: avg,
          medianMs: med,
          earlyClicks: earlyClicksCount,
        });
        setRxHistory([record, ...rxHistory]);
      } else {
        setRxState("TRIAL_COMPLETE");
        setCurrentTrialIdx((prev) => prev + 1);
      }
    }
  };

  const resetReactionSession = () => {
    setRxState("IDLE");
    setCurrentTrialIdx(0);
    setTrialTimes([]);
    setEarlyClicksCount(0);
    setLastTrialMs(null);
  };

  // ----------------------------------------------------
  // 3. TASK BREAKDOWN ASSISTANT STATE
  // ----------------------------------------------------
  const [taskInput, setTaskInput] = useState("");
  const [breakdownSteps, setBreakdownSteps] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "s-1", text: "Verify procedure flight rule prerequisites", done: true },
    { id: "s-2", text: "Stage tools and tether assembly at work site", done: false },
    { id: "s-3", text: "Execute component inspection checklist", done: false },
    { id: "s-4", text: "Conduct post-install leak check and downlink log", done: false },
  ]);

  const handleGenerateBreakdown = () => {
    if (!taskInput.trim()) return;
    const taskName = taskInput.trim();
    setBreakdownSteps([
      { id: `b-${Date.now()}-1`, text: `Review flight data file for: ${taskName}`, done: false },
      { id: `b-${Date.now()}-2`, text: "Verify power and telemetry inhibits with Ground Control", done: false },
      { id: `b-${Date.now()}-3`, text: `Execute physical procedure steps for ${taskName}`, done: false },
      { id: `b-${Date.now()}-4`, text: "Perform post-maintenance functional checkout", done: false },
      { id: `b-${Date.now()}-5`, text: "Clean and stow all tools in designated module locker", done: false },
    ]);
    setTaskInput("");
  };

  const toggleStepDone = (stepId: string) => {
    setBreakdownSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
    );
  };

  // ----------------------------------------------------
  // 4. WORKLOAD REFLECTION STATE
  // ----------------------------------------------------
  const [workloadManageable, setWorkloadManageable] = useState<"yes" | "moderate" | "overwhelmed" | null>(null);

  return (
    <div className="focus-readiness-container">
      {/* Sub-navigation tabs */}
      <div className="focus-tabs-bar">
        <button
          type="button"
          className={`focus-tab-btn ${activeTab === "timer" ? "active" : ""}`}
          onClick={() => setActiveTab("timer")}
        >
          <Clock size={16} /> Timed Focus Session
        </button>
        <button
          type="button"
          className={`focus-tab-btn ${activeTab === "reaction" ? "active" : ""}`}
          onClick={() => setActiveTab("reaction")}
        >
          <Zap size={16} /> Reaction-Time Practice
        </button>
        <button
          type="button"
          className={`focus-tab-btn ${activeTab === "breakdown" ? "active" : ""}`}
          onClick={() => setActiveTab("breakdown")}
        >
          <ListPlus size={16} /> Task Breakdown Assistant
        </button>
        <button
          type="button"
          className={`focus-tab-btn ${activeTab === "workload" ? "active" : ""}`}
          onClick={() => setActiveTab("workload")}
        >
          <Target size={16} /> Workload Reflection
        </button>
      </div>

      {/* ========================================================
          TAB 1: TIMED FOCUS SESSION
          ======================================================== */}
      {activeTab === "timer" && (
        <div className="focus-card timer-card">
          <div className="card-top-head">
            <div>
              <span className="eyebrow">COGNITIVE FOCUS SPRINT</span>
              <h2>Timed Operational Focus Window</h2>
            </div>
            <span className="tag">ATTENTION TRAINING</span>
          </div>

          <p className="timer-intro">
            Short, uninterrupted focus windows prevent cognitive multitasking overload when reviewing complex flight checklists.
          </p>

          <div className="duration-presets-row">
            {[5, 10, 25].map((m) => (
              <button
                key={m}
                type="button"
                className={`button ${timerMinutes === m ? "primary" : "outline"} small-btn`}
                disabled={timerStatus === "running"}
                onClick={() => setTimerMinutes(m)}
              >
                {m} Minutes {m === 25 ? "(Pomodoro)" : ""}
              </button>
            ))}
          </div>

          <div className="timer-display-box">
            <span className="timer-big-digits">
              {String(Math.floor(timerSecondsLeft / 60)).padStart(2, "0")}:
              {String(timerSecondsLeft % 60).padStart(2, "0")}
            </span>
            <span className="timer-status-badge">
              STATUS: {timerStatus.toUpperCase()}
            </span>
          </div>

          <div className="timer-controls-row">
            {timerStatus === "idle" && (
              <button
                type="button"
                className="button primary"
                onClick={handleStartTimer}
              >
                <Play size={16} /> Start Focus Sprint
              </button>
            )}

            {timerStatus === "running" && (
              <>
                <button
                  type="button"
                  className="button outline"
                  onClick={handlePauseTimer}
                >
                  <Pause size={16} /> Pause Sprint
                </button>
                <button
                  type="button"
                  className="button outline alert-btn"
                  onClick={handleResetTimer}
                >
                  <Square size={16} /> Reset
                </button>
              </>
            )}

            {timerStatus === "paused" && (
              <>
                <button
                  type="button"
                  className="button primary"
                  onClick={handleStartTimer}
                >
                  <Play size={16} /> Resume
                </button>
                <button
                  type="button"
                  className="button outline"
                  onClick={handleResetTimer}
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </>
            )}

            {timerStatus === "completed" && (
              <div className="timer-done-box">
                <CheckCircle2 size={24} className="accent-mint" />
                <strong>Focus Sprint Complete! Take 3 minutes to rest your eyes.</strong>
                <button
                  type="button"
                  className="button outline small-btn"
                  onClick={handleResetTimer}
                >
                  Reset Timer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: REACTION-TIME PRACTICE (5 TRIALS)
          ======================================================== */}
      {activeTab === "reaction" && (
        <div className="focus-card reaction-card">
          <div className="card-top-head">
            <div>
              <span className="eyebrow">MONOTONIC PERFORMANCE TASK</span>
              <h2>Psychomotor Reaction Practice (5 Trials)</h2>
            </div>
            <span className="tag">
              TRIAL {trialTimes.length} / 5
            </span>
          </div>

          <div className="reaction-disclaimer-card">
            <Info size={15} className="accent-cyan" />
            <p>
              <strong>Practice Activity Notice:</strong> This reaction task is designed for personal alertness practice. It does <strong>NOT</strong> constitute a validated operational cognitive assessment or clinical psychiatric screening.
            </p>
          </div>

          {/* Interactive Stimulus Arena */}
          <div
            className={`reaction-arena arena-${rxState.toLowerCase()}`}
            onClick={rxState === "WAITING" || rxState === "READY" ? handleReactionClick : undefined}
            role="button"
            tabIndex={0}
            aria-label="Reaction stimulus area"
          >
            {rxState === "IDLE" && (
              <div className="arena-prompt">
                <Zap size={32} className="accent-cyan" />
                <h3>Ready to Practice?</h3>
                <p>Click below to begin. When the arena turns GREEN, click as fast as possible.</p>
                <button
                  type="button"
                  className="button primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNextTrial();
                  }}
                >
                  <Play size={16} /> Begin Trial 1
                </button>
              </div>
            )}

            {rxState === "WAITING" && (
              <div className="arena-prompt">
                <div className="pulse-stimulus-dot" />
                <h3>Wait for Green...</h3>
                <span>Hold steady... Don’t click yet.</span>
              </div>
            )}

            {rxState === "READY" && (
              <div className="arena-prompt">
                <Zap size={48} className="zap-flash" />
                <h2 className="click-now-text">CLICK NOW!</h2>
              </div>
            )}

            {rxState === "EARLY" && (
              <div className="arena-prompt">
                <AlertTriangle size={32} className="accent-orange" />
                <h3>Too Early!</h3>
                <p>You clicked before the green stimulus appeared.</p>
                <button
                  type="button"
                  className="button outline small-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNextTrial();
                  }}
                >
                  Retry This Trial
                </button>
              </div>
            )}

            {rxState === "TRIAL_COMPLETE" && (
              <div className="arena-prompt">
                <CheckCircle2 size={32} className="accent-mint" />
                <h3>{lastTrialMs} ms</h3>
                <p>Trial {trialTimes.length} recorded.</p>
                <button
                  type="button"
                  className="button primary small-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNextTrial();
                  }}
                >
                  Next Trial ({trialTimes.length + 1} of 5)
                </button>
              </div>
            )}

            {rxState === "ALL_DONE" && (
              <div className="arena-prompt">
                <CheckCircle2 size={40} className="accent-mint" />
                <h3>5-Trial Session Complete!</h3>
                <div className="session-stats-row">
                  <div>
                    <span>AVERAGE:</span>
                    <strong>
                      {Math.round(trialTimes.reduce((a, b) => a + b, 0) / trialTimes.length)} ms
                    </strong>
                  </div>
                  <div>
                    <span>MEDIAN:</span>
                    <strong>
                      {[...trialTimes].sort((a, b) => a - b)[Math.floor(trialTimes.length / 2)]} ms
                    </strong>
                  </div>
                  <div>
                    <span>EARLY CLICKS:</span>
                    <strong>{earlyClicksCount}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="button outline small-btn"
                  onClick={resetReactionSession}
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>

          {/* Past History */}
          {rxHistory.length > 0 && (
            <div className="reaction-history-tray">
              <h4>Recent Practice Sessions</h4>
              <div className="rx-history-chips">
                {rxHistory.slice(0, 4).map((rec) => (
                  <div key={rec.id} className="rx-chip">
                    <span>Avg: <strong>{rec.averageMs} ms</strong></span>
                    <small>Med: {rec.medianMs} ms</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: TASK BREAKDOWN ASSISTANT
          ======================================================== */}
      {activeTab === "breakdown" && (
        <div className="focus-card breakdown-card">
          <div className="card-top-head">
            <div>
              <span className="eyebrow">COGNITIVE LOAD REDUCTION</span>
              <h2>Operational Task Breakdown Assistant</h2>
            </div>
            <span className="tag">DE-ESCALATE COMPLEXITY</span>
          </div>

          <p className="breakdown-intro">
            High-tempo operational schedules induce decision fatigue. Enter a complex orbital procedure to break it into small, verifiable check steps.
          </p>

          <div className="breakdown-input-row">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Inspect Node 3 Urine Processor centrifuge and replace filter bed..."
              className="task-input-field"
            />
            <button
              type="button"
              className="button primary"
              onClick={handleGenerateBreakdown}
              disabled={!taskInput.trim()}
            >
              <Plus size={15} /> Decompose Task
            </button>
          </div>

          <div className="steps-checklist-box">
            <h4>Procedural Subtasks ({breakdownSteps.filter((s) => s.done).length} / {breakdownSteps.length} complete)</h4>
            <div className="steps-list">
              {breakdownSteps.map((step, idx) => (
                <div key={step.id} className={`step-item ${step.done ? "step-completed" : ""}`}>
                  <input
                    type="checkbox"
                    checked={step.done}
                    onChange={() => toggleStepDone(step.id)}
                    className="step-check"
                  />
                  <span className="step-number">{idx + 1}.</span>
                  <span className="step-text">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: WORKLOAD REFLECTION
          ======================================================== */}
      {activeTab === "workload" && (
        <div className="focus-card workload-card">
          <div className="card-top-head">
            <div>
              <span className="eyebrow">SUBJECTIVE CAPACITY CHECK</span>
              <h2>Shift Workload Reflection</h2>
            </div>
            <span className="tag">SELF-AWARENESS</span>
          </div>

          <p className="workload-intro">
            Honest appraisal of shift tempo helps prevent burnout and keeps errors from multiplying under fatigue.
          </p>

          <div className="workload-question-box">
            <h3>Does your assigned timeline feel manageable for the remainder of this shift?</h3>
            <div className="workload-choices-grid">
              <button
                type="button"
                className={`workload-btn ${workloadManageable === "yes" ? "selected" : ""}`}
                onClick={() => setWorkloadManageable("yes")}
              >
                <strong>Comfortably Manageable</strong>
                <span>Work tempo matches capacity; timeline realistic.</span>
              </button>
              <button
                type="button"
                className={`workload-btn ${workloadManageable === "moderate" ? "selected" : ""}`}
                onClick={() => setWorkloadManageable("moderate")}
              >
                <strong>Tight but Achievable</strong>
                <span>Requires steady focus; little room for delays.</span>
              </button>
              <button
                type="button"
                className={`workload-btn ${workloadManageable === "overwhelmed" ? "selected" : ""}`}
                onClick={() => setWorkloadManageable("overwhelmed")}
              >
                <strong>Overloaded / Drained</strong>
                <span>High likelihood of schedule slips or cognitive fatigue.</span>
              </button>
            </div>
          </div>

          {workloadManageable && (
            <div className="workload-advice-box">
              <Info size={16} className="accent-cyan" />
              <div>
                <strong>OPERATIONAL COUNTERMEASURE GUIDANCE:</strong>
                {workloadManageable === "yes" && (
                  <p>
                    Maintain steady pacing. Remember to log your hydration and take scheduled 5-minute eye-rest intervals every 90 minutes.
                  </p>
                )}
                {workloadManageable === "moderate" && (
                  <p>
                    Prioritize primary mission objectives over non-critical housekeeping. Communicate expected completion times to Commander before timeline crunches occur.
                  </p>
                )}
                {workloadManageable === "overwhelmed" && (
                  <p>
                    <strong>High Workload Alert:</strong> Do not compromise safety margins. Speak with the Mission Commander to deconflict lower-priority payload runs. Taking a 3-minute breathing reset now will improve procedural accuracy.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
