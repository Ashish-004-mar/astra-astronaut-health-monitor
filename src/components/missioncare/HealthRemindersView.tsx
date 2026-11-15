import { useState } from "react";
import {
  Bell,
  Clock,
  Plus,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  getHealthReminders,
  addHealthReminder,
  toggleHealthReminder,
  deleteHealthReminder,
  type HealthReminderItem,
} from "../../services/missionCareService";

export default function HealthRemindersView() {
  const [reminders, setReminders] = useState<HealthReminderItem[]>(() => getHealthReminders());

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<HealthReminderItem["type"]>("hr_check");
  const [newTime, setNewTime] = useState("14:00 UTC");
  const [newFreq, setNewFreq] = useState<HealthReminderItem["frequency"]>("daily");

  const handleToggle = (id: string) => {
    toggleHealthReminder(id);
    setReminders(getHealthReminders());
  };

  const handleDelete = (id: string) => {
    deleteHealthReminder(id);
    setReminders(getHealthReminders());
  };

  const handleSnooze = (id: string, mins: number) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, snoozedUntil: `Snoozed ${mins}m` } : r,
    );
    setReminders(updated);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addHealthReminder({
      title: newTitle.trim(),
      type: newType,
      timeLabel: newTime,
      frequency: newFreq,
      completed: false,
    });
    setReminders(getHealthReminders());
    setIsAddOpen(false);
    setNewTitle("");
  };

  return (
    <div className="reminders-view-root">
      {/* Top Banner Notice */}
      <div className="reminders-header-bar">
        <div className="reminders-title-group">
          <span className="eyebrow">PREVENTIVE MISSION PROTOCOLS</span>
          <h2>Routine Health & Vitals Reminders</h2>
          <p className="reminders-sub">
            Scheduled checks to detect creeping cardiovascular deconditioning, fatigue, and equipment maintenance needs.
          </p>
        </div>

        <button
          type="button"
          className="button primary small-btn"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={14} /> Schedule Reminder
        </button>
      </div>

      <div className="reminders-policy-card">
        <ShieldCheck size={18} className="accent-cyan" />
        <div>
          <strong>Operational Notification Policy:</strong>
          <p>
            Health reminders trigger local in-browser notices while ASTRA is open. During an active crew emergency alert,
            <strong> all routine reminders are suppressed</strong> so attention remains entirely on acute resuscitation.
          </p>
        </div>
      </div>

      {/* Reminders List */}
      <div className="reminders-list-container">
        {reminders.map((rem) => (
          <div key={rem.id} className={`reminder-item-card ${rem.completed ? "completed" : ""}`}>
            <div className="rem-left">
              <button
                type="button"
                className={`rem-checkbox-circle ${rem.completed ? "active" : ""}`}
                onClick={() => handleToggle(rem.id)}
                title={rem.completed ? "Mark incomplete" : "Mark complete"}
              >
                {rem.completed && <CheckCircle2 size={16} />}
              </button>

              <div className="rem-text">
                <h4 className={rem.completed ? "strikethrough" : ""}>{rem.title}</h4>
                <div className="rem-meta-row">
                  <span className="meta-pill">
                    <Clock size={11} /> {rem.timeLabel} ({rem.frequency})
                  </span>
                  {rem.snoozedUntil && <span className="snooze-pill">{rem.snoozedUntil}</span>}
                  {rem.notes && <span className="rem-notes">{rem.notes}</span>}
                </div>
              </div>
            </div>

            <div className="rem-right-actions">
              {!rem.completed && (
                <div className="snooze-btns">
                  <button
                    type="button"
                    className="snooze-btn"
                    onClick={() => handleSnooze(rem.id, 15)}
                    title="Snooze 15 min"
                  >
                    +15m
                  </button>
                  <button
                    type="button"
                    className="snooze-btn"
                    onClick={() => handleSnooze(rem.id, 60)}
                    title="Snooze 1 hour"
                  >
                    +1h
                  </button>
                </div>
              )}

              <button
                type="button"
                className="del-btn"
                onClick={() => handleDelete(rem.id)}
                title="Delete reminder"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isAddOpen && (
        <div className="missioncare-modal-backdrop">
          <div className="missioncare-modal-card">
            <div className="modal-header">
              <h3>Create Health & Protocol Reminder</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsAddOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Reminder Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Measure Resting Blood Pressure in CMRS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <label>Protocol Category:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as HealthReminderItem["type"])}
                  className="styled-select"
                >
                  <option value="hr_check">Heart Rate & Pulse Check</option>
                  <option value="sleep_checkin">Sleep & Recovery Log</option>
                  <option value="wellness_assessment">Daily Wellness Assessment</option>
                  <option value="hydration_log">Hydration Balance Log</option>
                  <option value="followup_vital">Follow-up Vital Measurement</option>
                  <option value="equipment_check">Emergency Equipment Inspection</option>
                </select>
              </div>

              <div className="input-group">
                <label>Scheduled UTC Time:</label>
                <input
                  type="text"
                  placeholder="e.g. 15:30 UTC"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <label>Repetition Frequency:</label>
                <select
                  value={newFreq}
                  onChange={(e) => setNewFreq(e.target.value as HealthReminderItem["frequency"])}
                  className="styled-select"
                >
                  <option value="daily">Daily</option>
                  <option value="shift">Every Shift (12h)</option>
                  <option value="once">One-Time Only</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button outline small-btn"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary small-btn"
                onClick={handleCreate}
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
