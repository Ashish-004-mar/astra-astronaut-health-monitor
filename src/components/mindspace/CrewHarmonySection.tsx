import { useState } from "react";
import {
  Users,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  ShieldCheck,
  Send,
  BookOpen,
  ArrowRight,
  ListTodo,
} from "lucide-react";
import {
  getDebriefRecords,
  saveDebriefRecord,
  getTaskItems,
  saveTaskItems,
  type DebriefRecord,
  type TaskItem,
} from "../../services/mindspaceService";

export default function CrewHarmonySection() {
  const [harmonyTab, setHarmonyTab] = useState<"practice" | "debrief" | "guide" | "tasks">("practice");

  // ----------------------------------------------------
  // SCENARIO PRACTICE STATE
  // ----------------------------------------------------
  const scenarios = [
    {
      id: "scen-1",
      title: "Misunderstood Instructions During EVA Prep",
      context:
        "During pre-EVA airlock depressurization prep, you thought your crewmate was verifying suit umbilical seals, while they assumed you had already executed the leak check. You discover the step was missed.",
      choices: [
        {
          id: "c1",
          text: "“Why didn’t you double-check the seals? You know that’s your responsibility!”",
          score: "counterproductive",
          feedback:
            "Accusatory language immediately raises defensiveness and erodes crew trust in high-stakes environments. Blame distracts from the immediate priority: verifying procedural integrity.",
          principle: "Non-Accusatory Problem Solving",
        },
        {
          id: "c2",
          text: "“Let’s hold the airlock sequence. Step 4b wasn't completed. I will verify the primary umbilical seal right now while you log the hold with Ground.”",
          score: "optimal",
          feedback:
            "Optimal response: Declares an operational hold without blame, states the objective fact, and assigns immediate unambiguous roles to ensure safety.",
          principle: "Clear Operational Handoffs & Psychological Safety",
        },
        {
          id: "c3",
          text: "Say nothing to avoid conflict and silently rush to fix the seal yourself.",
          score: "risky",
          feedback:
            "Silent fixes conceal operational discrepancies from flight controllers and leave role boundaries ambiguous for future EVAs.",
          principle: "Transparent Two-Way Closed-Loop Communication",
        },
      ],
    },
    {
      id: "scen-2",
      title: "Conflicting Science vs Maintenance Priorities",
      context:
        "Ground schedules a high-priority biological crystal growth experiment at the same time as a mandatory carbon dioxide scrubber filter change. Both astronauts feel their assigned task is the critical one.",
      choices: [
        {
          id: "c1",
          text: "“Let’s look at the timeline together. Can we stagger the filter swap by 45 minutes so you have full glovebox power, or do we need flight director deconfliction?”",
          score: "optimal",
          feedback:
            "Constructive collaboration: Frames the issue as a shared scheduling problem rather than a personal rivalry, seeking mutually viable solutions before escalating.",
          principle: "Collaborative Deconfliction",
        },
        {
          id: "c2",
          text: "“ECLSS life support always outranks your science experiment. Step aside.”",
          score: "counterproductive",
          feedback:
            "While life support is fundamental, dismissing a teammate’s mission objectives causes resentment and damages teamwork across subsequent expedition phases.",
          principle: "Mutual Respect for Assigned Mission Portfolios",
        },
      ],
    },
    {
      id: "scen-3",
      title: "20-Minute Comm Latency Frustration",
      context:
        "On a simulated Mars transit trajectory, a 20-minute one-way communication delay with Earth creates misunderstandings regarding a payload software patch. Tension rises between crewmembers over interpreting the ambiguous uplink message.",
      choices: [
        {
          id: "c1",
          text: "“Since Earth cannot clarify in real-time, let’s read the flight rule book together, write down our consensus interpretation, and document the rationale in our evening downlink.”",
          score: "optimal",
          feedback:
            "High autonomous resilience: Uses shared objective standards (flight rules) to build consensus rather than arguing subjective interpretations in isolation.",
          principle: "Autonomous Consensus Under Comm Latency",
        },
        {
          id: "c2",
          text: "“My rank is senior, so we do it my way and we'll deal with Earth's complaint tomorrow.”",
          score: "counterproductive",
          feedback:
            "Imposing unilateral decisions without discussion under latency creates isolated silos and impairs emergency problem-solving.",
          principle: "Crew Consensus & Collective Situational Awareness",
        },
      ],
    },
    {
      id: "scen-4",
      title: "Unequal Habitat Housekeeping Workload",
      context:
        "Routine tasks like disinfecting galley food surfaces, emptying vacuum trap condensates, and sorting waste are falling disproportionately on one astronaut, who is beginning to feel exhausted.",
      choices: [
        {
          id: "c1",
          text: "“During our evening mess debrief, can we review the chore rotation schedule? I’ve noticed I'm handling the galley sanitation daily, and it’s cutting into my scheduled rest block.”",
          score: "optimal",
          feedback:
            "Addresses the impact objectively without passive aggression. Connects the issue directly to personal fatigue and rest boundaries.",
          principle: "Assertive Workload Transparency",
        },
        {
          id: "c2",
          text: "Leave the galley dirty for three days to teach the other crew members a lesson.",
          score: "counterproductive",
          feedback:
            "Passive-aggressive tactics in microgravity create microbial health hazards and rapidly escalate interpersonal tension.",
          principle: "Direct & Timely Communication",
        },
      ],
    },
    {
      id: "scen-5",
      title: "Tension After an Equipment Malfunction",
      context:
        "A crewmate overtightened a torque fitting on the urine processor distillation centrifuge, stripping the thread and requiring a 4-hour unscheduled repair. They are visibly anxious and on edge.",
      choices: [
        {
          id: "c1",
          text: "“Hardware hiccups happen to everyone up here. Take 5 minutes to breathe. We have spare tap extractors in Locker 3; let’s walk through the repair checklist together.”",
          score: "optimal",
          feedback:
            "Psychological safety in action: Normalizes honest mistakes, reduces performance anxiety, and pivots directly to constructive repair support.",
          principle: "Psychological Safety & Stress Reduction",
        },
        {
          id: "c2",
          text: "Remind them that torque specs are clearly written in red on the label.",
          score: "counterproductive",
          feedback:
            "Stating the obvious when someone is already anxious induces shame, impairs fine motor skills, and leads to further errors.",
          principle: "De-escalation During Operational Stress",
        },
      ],
    },
    {
      id: "scen-6",
      title: "Crew Member Withdrawing During Rest Hours",
      context:
        "For three consecutive days, a crewmate has skipped group meals, stayed inside their sleeping berth with closed curtains, and provided only one-word replies over the hab intercom.",
      choices: [
        {
          id: "c1",
          text: "“Hey, I noticed you’ve been keeping to your bunk a lot lately. No pressure to talk about anything operational, but I’m here if you want to chat or listen to some music together.”",
          score: "optimal",
          feedback:
            "Low-pressure connection: Acknowledges the behavioral change without probing invasively, validating their need for autonomy while keeping the door open.",
          principle: "Empathetic Peer Check-In",
        },
        {
          id: "c2",
          text: "Confront them in front of the whole crew and demand to know if they have a problem with someone.",
          score: "counterproductive",
          feedback:
            "Public confrontation creates defensive withdrawal and can trigger severe psychological distress in confined environments.",
          principle: "Private, Gentle Relationship Maintenance",
        },
      ],
    },
  ];

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  // ----------------------------------------------------
  // STRUCTURED MISSION DEBRIEF STATE
  // ----------------------------------------------------
  const [debriefShift, setDebriefShift] = useState("Alpha Shift (EVA Prep)");
  const [wentWell, setWentWell] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [needsClarification, setNeedsClarification] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [debriefsList, setDebriefsList] = useState<DebriefRecord[]>(() => getDebriefRecords());
  const [debriefSavedNotice, setDebriefSavedNotice] = useState(false);

  const handleSaveDebrief = () => {
    if (!wentWell && !difficulties && !nextSteps) return;
    const record = saveDebriefRecord({
      missionDay: 147,
      shift: debriefShift,
      wentWell: wentWell.trim(),
      difficulties: difficulties.trim(),
      needsClarification: needsClarification.trim(),
      nextSteps: nextSteps.trim(),
    });
    setDebriefsList([record, ...debriefsList]);
    setWentWell("");
    setDifficulties("");
    setNeedsClarification("");
    setNextSteps("");
    setDebriefSavedNotice(true);
    setTimeout(() => setDebriefSavedNotice(false), 3000);
  };

  // ----------------------------------------------------
  // DEMO TASK COORDINATION CHECKLIST
  // ----------------------------------------------------
  const [tasks, setTasks] = useState<TaskItem[]>(() => getTaskItems());

  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t,
    );
    setTasks(updated);
    saveTaskItems(updated);
  };

  return (
    <div className="crew-harmony-container">
      {/* Sub-navigation tabs */}
      <div className="harmony-tabs-bar">
        <button
          type="button"
          className={`harmony-tab-btn ${harmonyTab === "practice" ? "active" : ""}`}
          onClick={() => setHarmonyTab("practice")}
        >
          <MessageSquare size={16} /> Communication Practice Scenarios
        </button>
        <button
          type="button"
          className={`harmony-tab-btn ${harmonyTab === "debrief" ? "active" : ""}`}
          onClick={() => setHarmonyTab("debrief")}
        >
          <ClipboardList size={16} /> Mission Debrief Protocol
        </button>
        <button
          type="button"
          className={`harmony-tab-btn ${harmonyTab === "guide" ? "active" : ""}`}
          onClick={() => setHarmonyTab("guide")}
        >
          <BookOpen size={16} /> Conflict Resolution Guide
        </button>
        <button
          type="button"
          className={`harmony-tab-btn ${harmonyTab === "tasks" ? "active" : ""}`}
          onClick={() => setHarmonyTab("tasks")}
        >
          <ListTodo size={16} /> Team Coordination (Demo)
        </button>
      </div>

      {/* ========================================================
          TAB 1: COMMUNICATION PRACTICE SCENARIOS
          ======================================================== */}
      {harmonyTab === "practice" && (
        <div className="harmony-card practice-card">
          <div className="practice-header">
            <div>
              <span className="eyebrow">NASA RISK OF INADEQUATE TEAMWORK</span>
              <h2>Spaceflight Interpersonal Communication Practice</h2>
            </div>
            <span className="tag">SCENARIO {activeScenarioIdx + 1} OF {scenarios.length}</span>
          </div>

          <div className="scenario-selector-row">
            {scenarios.map((sc, i) => (
              <button
                key={sc.id}
                type="button"
                className={`scenario-pill-btn ${activeScenarioIdx === i ? "active" : ""}`}
                onClick={() => {
                  setActiveScenarioIdx(i);
                  setSelectedChoiceId(null);
                }}
              >
                {i + 1}. {sc.title}
              </button>
            ))}
          </div>

          <div className="scenario-body">
            <h3>{scenarios[activeScenarioIdx].title}</h3>
            <div className="scenario-context-box">
              <Info size={16} className="context-icon" />
              <p>{scenarios[activeScenarioIdx].context}</p>
            </div>

            <div className="choices-section">
              <h4>Choose the most constructive response:</h4>
              <div className="choices-list">
                {scenarios[activeScenarioIdx].choices.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    className={`choice-card ${selectedChoiceId === ch.id ? "selected" : ""}`}
                    onClick={() => setSelectedChoiceId(ch.id)}
                  >
                    <span className="choice-marker">
                      {selectedChoiceId === ch.id ? "●" : "○"}
                    </span>
                    <p className="choice-text">{ch.text}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedChoiceId && (
              <div className="feedback-result-box">
                {(() => {
                  const ch = scenarios[activeScenarioIdx].choices.find(
                    (c) => c.id === selectedChoiceId,
                  );
                  if (!ch) return null;
                  return (
                    <>
                      <div className="feedback-status-row">
                        <span className={`eval-badge ${ch.score}`}>
                          {ch.score === "optimal"
                            ? "CONSTRUCTIVE RESPONSE"
                            : ch.score === "risky"
                              ? "PROCEDURAL RISK"
                              : "COUNTERPRODUCTIVE"}
                        </span>
                        <span className="principle-tag">
                          PRINCIPLE: {ch.principle}
                        </span>
                      </div>
                      <p className="feedback-text">{ch.feedback}</p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: MISSION DEBRIEF PROTOCOL
          ======================================================== */}
      {harmonyTab === "debrief" && (
        <div className="harmony-card debrief-card">
          <div className="debrief-header">
            <div>
              <span className="eyebrow">STRUCTURED OPERATIONAL REVIEW</span>
              <h2>4-Step Mission Shift Debrief</h2>
            </div>
            <span className="tag">STORED 100% LOCALLY</span>
          </div>

          <p className="debrief-intro">
            NASA Human Research Program studies indicate structured post-shift debriefs prevent small frustrations from compounding into systemic team breakdowns.
          </p>

          <div className="debrief-form">
            <div className="form-row">
              <label>
                <span>Mission Shift Context:</span>
                <input
                  type="text"
                  value={debriefShift}
                  onChange={(e) => setDebriefShift(e.target.value)}
                  className="debrief-input"
                />
              </label>
            </div>

            <div className="debrief-grid">
              <div className="debrief-col">
                <label>
                  <strong>1. What went well today?</strong>
                  <textarea
                    rows={3}
                    value={wentWell}
                    onChange={(e) => setWentWell(e.target.value)}
                    placeholder="Milestones achieved, smooth teamwork, successful checklist execution..."
                    className="debrief-textarea"
                  />
                </label>
              </div>

              <div className="debrief-col">
                <label>
                  <strong>2. What was difficult or strained?</strong>
                  <textarea
                    rows={3}
                    value={difficulties}
                    onChange={(e) => setDifficulties(e.target.value)}
                    placeholder="Procedure bottlenecks, hardware delays, communication friction..."
                    className="debrief-textarea"
                  />
                </label>
              </div>

              <div className="debrief-col">
                <label>
                  <strong>3. What needs clarification?</strong>
                  <textarea
                    rows={3}
                    value={needsClarification}
                    onChange={(e) => setNeedsClarification(e.target.value)}
                    placeholder="Ambiguous flight director directives, timeline adjustments..."
                    className="debrief-textarea"
                  />
                </label>
              </div>

              <div className="debrief-col">
                <label>
                  <strong>4. What can we improve next shift?</strong>
                  <textarea
                    rows={3}
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="Concrete adjustments, chore rotation, quiet hours alignment..."
                    className="debrief-textarea"
                  />
                </label>
              </div>
            </div>

            <div className="debrief-actions">
              <button
                type="button"
                className="button primary"
                onClick={handleSaveDebrief}
              >
                Save Debrief Reflection <CheckCircle2 size={15} />
              </button>
              {debriefSavedNotice && (
                <span className="saved-notice-text">
                  <CheckCircle2 size={13} /> Saved to local history!
                </span>
              )}
            </div>
          </div>

          {debriefsList.length > 0 && (
            <div className="past-debriefs-list">
              <h3>Past Shift Debriefs ({debriefsList.length})</h3>
              {debriefsList.slice(0, 3).map((db) => (
                <div key={db.id} className="debrief-record-card">
                  <div className="record-header">
                    <strong>{db.shift}</strong>
                    <span>Mission Day {db.missionDay}</span>
                  </div>
                  {db.wentWell && (
                    <p>
                      <strong>Went Well:</strong> {db.wentWell}
                    </p>
                  )}
                  {db.difficulties && (
                    <p>
                      <strong>Difficulties:</strong> {db.difficulties}
                    </p>
                  )}
                  {db.nextSteps && (
                    <p>
                      <strong>Next Steps:</strong> {db.nextSteps}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: CONFLICT RESOLUTION GUIDE
          ======================================================== */}
      {harmonyTab === "guide" && (
        <div className="harmony-card guide-card">
          <div className="guide-header">
            <div>
              <span className="eyebrow">AEROSPACE HUMAN FACTORS</span>
              <h2>6-Step Spaceflight Conflict Resolution Protocol</h2>
            </div>
            <span className="tag">FLIGHT MEDICINE PROTOCOL</span>
          </div>

          <div className="guide-steps-grid">
            {[
              {
                step: 1,
                title: "Describe Situation Without Accusation",
                desc: "Stick strictly to observable facts. Say “The filter box wasn’t re-latched” rather than “You left the box open again.”",
              },
              {
                step: 2,
                title: "Explain Operational Impact",
                desc: "Describe the concrete consequence on mission timelines or personal fatigue: “Because of the delay, my rest block was cut by 45 minutes.”",
              },
              {
                step: 3,
                title: "Actively Listen to Teammate's Reality",
                desc: "In microgravity, tasks often take twice as long due to restraint bracing. Ask: “What bottlenecks did you run into on your side?”",
              },
              {
                step: 4,
                title: "Identify Shared Mission Objectives",
                desc: "Re-anchor in collective goals: “We both need the life support loop operational and we both need our scheduled sleep.”",
              },
              {
                step: 5,
                title: "Agree on One Concrete Adjustment",
                desc: "Avoid vague promises. Define specific roles: “Tomorrow I will stage the tools at 07:30 so you can begin the torque cycle on time.”",
              },
              {
                step: 6,
                title: "Review the Outcome Next Shift",
                desc: "Take 60 seconds at tomorrow’s mess to verify the adjustment worked without lingering friction.",
              },
            ].map((g) => (
              <div key={g.step} className="guide-step-card">
                <span className="step-badge">STEP {g.step}</span>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: DEMONSTRATION TEAM COORDINATION TASKS
          ======================================================== */}
      {harmonyTab === "tasks" && (
        <div className="harmony-card tasks-card">
          <div className="tasks-header">
            <div>
              <span className="eyebrow">DEMONSTRATION INTERFACE</span>
              <h2>Collaborative Task Coordination Board</h2>
            </div>
            <span className="tag">SIMULATED DEMO</span>
          </div>

          <p className="tasks-intro">
            Demonstration of collaborative mission task checklists. Notice: Real multiuser synchronization requires an active connected network backend. Individual mental check-ins are strictly isolated and never shown on task boards.
          </p>

          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-row ${task.completed ? "task-done" : ""}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-check"
                />
                <div className="task-content">
                  <div className="task-title-row">
                    <strong>{task.title}</strong>
                    <span className={`priority-tag p-${task.priority}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.role && <span className="role-tag">{task.role}</span>}
                  </div>
                  {task.subtasks && (
                    <div className="subtasks-chips">
                      {task.subtasks.map((st) => (
                        <span key={st.id} className={`subtask-chip ${st.done ? "done" : ""}`}>
                          {st.done ? "✓" : "○"} {st.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
