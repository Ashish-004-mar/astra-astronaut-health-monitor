import { useState } from "react";
import {
  Clock,
  Download,
  Plus,
  Filter,
  Trash2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Box,
  UserCheck,
} from "lucide-react";
import {
  getTimelineEntries,
  addTimelineEntry,
  clearTimelineEntries,
  downloadEmergencyTimelinePDF,
  getActiveEnvironment,
  type TimelineLogEntry,
} from "../../services/missionCareService";

export default function EmergencyTimelineView() {
  const [entries, setEntries] = useState<TimelineLogEntry[]>(() => getTimelineEntries());
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  // New Note Modal
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDetails, setNoteDetails] = useState("");
  const [noteCategory, setNoteCategory] = useState<TimelineLogEntry["category"]>("STATUS_UPDATE");

  const filtered = entries.filter((e) => {
    if (selectedFilter === "ALL") return true;
    return e.category === selectedFilter;
  });

  const handleAddNote = () => {
    if (!noteTitle.trim()) return;

    addTimelineEntry({
      category: noteCategory,
      title: noteTitle.trim(),
      details: noteDetails.trim() || "No additional commentary.",
      provenance: "MANUAL_ENTRY",
      author: "Crew Scribe",
      missionDay: 147,
    });

    setEntries(getTimelineEntries());
    setIsAddNoteOpen(false);
    setNoteTitle("");
    setNoteDetails("");
  };

  const handleExportPDF = () => {
    downloadEmergencyTimelinePDF(entries, getActiveEnvironment());
  };

  const handleClear = () => {
    if (window.confirm("Clear all timeline entries? This will reset the medical event log.")) {
      clearTimelineEntries();
      setEntries(getTimelineEntries());
    }
  };

  const getCategoryIcon = (cat: TimelineLogEntry["category"]) => {
    switch (cat) {
      case "ALERT":
        return <AlertTriangle size={14} className="accent-rose" />;
      case "VITAL":
        return <CheckCircle2 size={14} className="accent-cyan" />;
      case "COMMUNICATION":
        return <Radio size={14} className="accent-orange" />;
      case "EQUIPMENT":
        return <Box size={14} className="accent-mint" />;
      case "CREW_ACTION":
        return <UserCheck size={14} className="accent-mint" />;
      default:
        return <Clock size={14} className="accent-cyan" />;
    }
  };

  return (
    <div className="timeline-view-root">
      {/* Top Banner Notice */}
      <div className="timeline-header-bar">
        <div className="timeline-title-group">
          <span className="eyebrow">CHRONOLOGICAL AUDIT TRAIL</span>
          <h2>Emergency Medical Event Timeline</h2>
          <p className="timeline-sub">
            Continuous local recording of vitals, alerts, interventions, and communications for Flight Surgeon handover.
          </p>
        </div>

        <div className="timeline-actions-group">
          <button
            type="button"
            className="button outline small-btn"
            onClick={() => setIsAddNoteOpen(true)}
          >
            <Plus size={14} /> Add Event Note
          </button>
          <button
            type="button"
            className="button primary small-btn"
            onClick={handleExportPDF}
          >
            <Download size={14} /> Export Structured PDF Report
          </button>
          <button
            type="button"
            className="button outline small-btn alert-btn"
            onClick={handleClear}
            title="Clear event log"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="timeline-filter-chips">
        {(
          [
            { id: "ALL", label: "All Events" },
            { id: "ALERT", label: "Alerts" },
            { id: "VITAL", label: "Vitals Logged" },
            { id: "CREW_ACTION", label: "Crew Actions" },
            { id: "EQUIPMENT", label: "Equipment" },
            { id: "ASSESSMENT", label: "Assessments" },
            { id: "STATUS_UPDATE", label: "Status Updates" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-chip ${selectedFilter === f.id ? "active" : ""}`}
            onClick={() => setSelectedFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="timeline-stream-container">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className={`timeline-entry-node cat-${item.category.toLowerCase()}`}>
              <div className="node-marker">
                <div className="marker-dot">{getCategoryIcon(item.category)}</div>
                <div className="marker-line" />
              </div>

              <div className="node-card">
                <div className="node-top-row">
                  <div className="node-left">
                    <span className="category-tag">{item.category}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="node-right">
                    <span className="node-time">
                      <Clock size={11} /> {item.timeFormatted} (Day {item.missionDay})
                    </span>
                    <span className="provenance-tag">{item.provenance}</span>
                  </div>
                </div>

                <p className="node-details">{item.details}</p>

                <div className="node-footer">
                  <small>Recorded by: <strong>{item.author}</strong></small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-timeline-card">
            <p>No timeline entries found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Add Custom Note Modal */}
      {isAddNoteOpen && (
        <div className="missioncare-modal-backdrop">
          <div className="missioncare-modal-card">
            <div className="modal-header">
              <h3>Log Medical Event Entry</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsAddNoteOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Event Category:</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as TimelineLogEntry["category"])}
                  className="styled-select"
                >
                  <option value="STATUS_UPDATE">Status Update</option>
                  <option value="ALERT">Alert</option>
                  <option value="CREW_ACTION">Crew Action</option>
                  <option value="COMMUNICATION">Ground Communication</option>
                  <option value="EQUIPMENT">Equipment Deployment</option>
                </select>
              </div>

              <div className="input-group">
                <label>Headline / Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Patient positioned in CMRS; resting comfortably"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <label>Detailed Clinical Observations:</label>
                <textarea
                  rows={3}
                  placeholder="Record symptoms, verbal responses, or equipment serial tags..."
                  value={noteDetails}
                  onChange={(e) => setNoteDetails(e.target.value)}
                  className="styled-textarea"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button outline small-btn"
                onClick={() => setIsAddNoteOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary small-btn"
                onClick={handleAddNote}
              >
                Save Event to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
