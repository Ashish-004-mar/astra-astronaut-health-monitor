import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Zap,
  ArrowLeft,
  Play,
  RotateCcw,
  ShieldCheck,
  Info,
  Clock,
  Activity,
  HeartHandshake,
} from "lucide-react";
import { useStore } from "../../state/store";
import {
  getReactionTestRecords,
  saveReactionTestRecord,
} from "../../services/hazardService";
import type { ReactionTestRecord } from "../../types/hazards";

interface MentalWellnessSubpageProps {
  onBack: () => void;
}

type TestState = "IDLE" | "WAITING" | "READY" | "COMPLETED" | "EARLY";

export default function MentalWellnessSubpage({ onBack }: MentalWellnessSubpageProps) {
  const { checkins, mission } = useStore();
  const currentDay = mission.day;

  // Most recent check-in
  const latestCheckin = checkins.at(-1);

  // Reaction test state
  const [testState, setTestState] = useState<TestState>("IDLE");
  const [startTime, setStartTime] = useState<number>(0);
  const [resultMs, setResultMs] = useState<number | null>(null);
  const [history, setHistory] = useState<ReactionTestRecord[]>(() => getReactionTestRecords());
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setTestState("WAITING");
    setResultMs(null);

    // Randomized delay between 1500ms and 4500ms
    const delay = Math.floor(Math.random() * 3000) + 1500;

    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);

    timerTimeoutRef.current = setTimeout(() => {
      setTestState("READY");
      setStartTime(performance.now());
    }, delay);
  };

  const handleTrigger = () => {
    if (testState === "WAITING") {
      // Clicked too early!
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setTestState("EARLY");
      return;
    }

    if (testState === "READY") {
      const elapsed = Math.round(performance.now() - startTime);
      setResultMs(elapsed);
      setTestState("COMPLETED");

      const saved = saveReactionTestRecord(elapsed, false);
      setHistory(getReactionTestRecords());
    }
  };

  // Keyboard Space listener for reaction test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (testState === "WAITING" || testState === "READY") {
          handleTrigger();
        } else if (testState === "IDLE" || testState === "COMPLETED" || testState === "EARLY") {
          startTest();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [testState, startTime]);

  // Average reaction time
  const validHistory = history.filter((h) => !h.isEarlyClick);
  const avgReactionTime =
    validHistory.length > 0
      ? Math.round(
          validHistory.reduce((acc, h) => acc + h.reactionTimeMs, 0) / validHistory.length,
        )
      : 250;

  return (
    <div className="subpage-container">
      {/* Header */}
      <div className="subpage-header">
        <button className="button outline back-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={16} /> BACK TO MY HEALTH
        </button>
        <div className="subpage-title-box">
          <div className="eyebrow">
            MY HEALTH <span>/</span> MENTAL WELLNESS & COGNITIVE VIGILANCE
          </div>
          <h1>BEHAVIORAL HEALTH & REACTION MONITOR</h1>
          <p className="subpage-subtitle">
            Psychological resilience, cognitive throughput, and psychomotor alertness.
          </p>
        </div>
      </div>

      {/* NASA Context */}
      <section className="panel research-context-panel">
        <div className="context-head">
          <Info size={16} className="accent-cyan" />
          <strong>NASA BEHAVIORAL HEALTH & PERFORMANCE (BHP) CONTEXT</strong>
        </div>
        <p>
          Prolonged confinement in spacecraft habitats combined with heavy operational tempos can induce cognitive fatigue, sleep deficits, and behavioral stress. NASA employs brief psychomotor vigilance testing (PVT) to measure visual alertness and neural response times without imposing diagnostic clinical burdens.
        </p>
        <a
          href="https://www.nasa.gov/hrp/hazards/isolation-and-confinement/"
          target="_blank"
          rel="noreferrer"
          className="research-link"
        >
          NASA HRP Behavioral Health & Performance Research ↗
        </a>
      </section>

      {/* Self-Reported Wellness Overview */}
      <div className="metrics-summary-row">
        <div className="metric-box">
          <span className="metric-label">SELF-REPORTED MOOD</span>
          <div className="metric-value-row">
            <span className="big-val">{latestCheckin?.answers?.Mood ?? "Good"}</span>
          </div>
          <small className="metric-meta">From today’s crew check-in</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">ENERGY LEVEL</span>
          <div className="metric-value-row">
            <span className="big-val">{latestCheckin?.answers?.Energy ?? "Normal"}</span>
          </div>
          <small className="metric-meta">Subjective self-assessment</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">STRESS LEVEL</span>
          <div className="metric-value-row">
            <span className="big-val">{latestCheckin?.answers?.Stress ?? "Low"}</span>
          </div>
          <small className="metric-meta">Self-reported tension score</small>
        </div>

        <div className="metric-box">
          <span className="metric-label">AVERAGE REACTION SPEED</span>
          <div className="metric-value-row">
            <span className="big-val">{avgReactionTime}</span>
            <span className="unit">ms</span>
          </div>
          <small className="metric-meta">Personal practice historical mean</small>
        </div>
      </div>

      {/* Interactive Reaction-Time Demonstration */}
      <section className="panel reaction-test-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">COGNITIVE PSYCHOMOTOR VIGILANCE DEMO</span>
            <h2>Reaction-Time Visual Alertness Test</h2>
          </div>
          <span className="tag">
            <Zap size={13} /> MONOTONIC BROWSER TIMER
          </span>
        </div>

        <div className="reaction-interactive-stage">
          {testState === "IDLE" && (
            <div className="reaction-box idle-state" onClick={startTest}>
              <Zap size={36} className="accent-cyan" />
              <h3>START REACTION TEST</h3>
              <p>Click this box or press SPACE to begin. When the screen turns GREEN, click as fast as you can!</p>
              <button className="button primary">BEGIN PRACTICE TEST</button>
            </div>
          )}

          {testState === "WAITING" && (
            <div className="reaction-box waiting-state" onClick={handleTrigger}>
              <div className="pulse-circle red-pulse" />
              <h3>WAIT FOR GREEN...</h3>
              <p>Keep your finger ready. Do not click yet!</p>
            </div>
          )}

          {testState === "READY" && (
            <div className="reaction-box ready-state" onClick={handleTrigger}>
              <div className="pulse-circle green-pulse" />
              <h2 className="click-now-text">CLICK NOW!</h2>
              <p>Press Space or Click immediately!</p>
            </div>
          )}

          {testState === "EARLY" && (
            <div className="reaction-box early-state" onClick={startTest}>
              <h3>TOO EARLY!</h3>
              <p>You clicked before the visual signal turned green. Try again!</p>
              <button className="button outline">TRY AGAIN</button>
            </div>
          )}

          {testState === "COMPLETED" && (
            <div className="reaction-box completed-state" onClick={startTest}>
              <div className="result-circle">
                <span className="result-ms">{resultMs}</span>
                <span className="result-unit">ms</span>
              </div>
              <h3>
                {resultMs! < 250
                  ? "Sharp & Alert!"
                  : resultMs! < 320
                    ? "Nominal Response Time"
                    : "Slight Cognitive Delay Detected"}
              </h3>
              <p>
                Baseline historical comparison:{" "}
                <strong>
                  {resultMs! <= avgReactionTime
                    ? `${avgReactionTime - resultMs!} ms faster than average`
                    : `${resultMs! - avgReactionTime} ms slower than average`}
                </strong>
              </p>
              <button className="button primary">TEST AGAIN (SPACE)</button>
            </div>
          )}
        </div>

        <div className="distinction-note-box">
          <Info size={14} />
          <span>
            <strong>Practice Metric Disclosure:</strong> Reaction-time tests measure momentary psychomotor response speed. This is an astronaut self-awareness practice tool and is NOT a clinical psychological or psychiatric evaluation.
          </span>
        </div>
      </section>

      {/* Historical Test Results Table */}
      <section className="panel history-table-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">PRACTICE RUNS</span>
            <h2>Recent Reaction-Time Attempts</h2>
          </div>
          <span className="tag">{validHistory.length} VALID SESSIONS</span>
        </div>

        <div className="history-table-container">
          <table className="nutrition-table">
            <thead>
              <tr>
                <th>Mission Day</th>
                <th>Reaction Time</th>
                <th>Status</th>
                <th>Comparison</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 5).map((h) => (
                <tr key={h.id}>
                  <td>Day {h.missionDay}</td>
                  <td>
                    <strong>{h.reactionTimeMs} ms</strong>
                  </td>
                  <td>
                    <span className={`status-pill ${h.status === "GOOD" ? "logged" : "pending"}`}>
                      {h.status}
                    </span>
                  </td>
                  <td>
                    {h.reactionTimeMs <= avgReactionTime
                      ? `-${avgReactionTime - h.reactionTimeMs} ms vs avg`
                      : `+${h.reactionTimeMs - avgReactionTime} ms vs avg`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
