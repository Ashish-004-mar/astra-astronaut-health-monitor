import { useState } from "react";
import {
  Compass,
  Plus,
  Search,
  Trash2,
  Download,
  Edit3,
  Lock,
  CheckCircle2,
  Calendar,
  Smile,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  clearAllJournalEntries,
  type JournalEntry,
  type MoodState,
} from "../../services/mindspaceService";

export default function ReflectionJournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournalEntries());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodState | "all">("all");

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [entryPrompt, setEntryPrompt] = useState<string | undefined>(undefined);
  const [entryMood, setEntryMood] = useState<MoodState>("good");

  // Confirm Delete All Modal State
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const promptsList = [
    "What went well during today's shift?",
    "What was a key challenge and how did you adapt?",
    "What is one thing you are grateful for aboard the station?",
    "What perspective or anchor keeps you grounded?",
    "What is one achievable goal for tomorrow?",
  ];

  const handleStartNew = (prompt?: string) => {
    setEditingId(null);
    setEntryTitle(prompt ? `Reflection: ${prompt}` : "");
    setEntryContent("");
    setEntryPrompt(prompt);
    setEntryMood("good");
    setIsEditing(true);
  };

  const handleEditExisting = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryPrompt(entry.promptUsed);
    setEntryMood(entry.moodTag || "good");
    setIsEditing(true);
  };

  const handleSaveEntry = () => {
    if (!entryTitle.trim() && !entryContent.trim()) return;

    const saved = saveJournalEntry({
      id: editingId || undefined,
      missionDay: 147,
      title: entryTitle.trim() || "Untitled Reflection",
      content: entryContent.trim(),
      promptUsed: entryPrompt,
      moodTag: entryMood,
    });

    setEntries(getJournalEntries());
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    setEntries(getJournalEntries());
    if (editingId === id) {
      setIsEditing(false);
      setEditingId(null);
    }
  };

  const handleClearAll = () => {
    clearAllJournalEntries();
    setEntries([]);
    setShowClearConfirm(false);
    setIsEditing(false);
  };

  const handleExportJournal = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ASTRA-MindSpace-Journal-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered List
  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMoodFilter === "all" || item.moodTag === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="reflection-journal-container">
      {/* Privacy Guarantee Header */}
      <div className="journal-privacy-banner">
        <Lock size={16} className="accent-mint" />
        <div>
          <strong>100% PRIVATE & CONFIDENTIAL LOCAL JOURNAL</strong>
          <p>
            NASA research recommends journaling as an autonomous coping tool. Your entries are stored strictly in this browser’s private sandbox. They are never uploaded, never scanned by AI, and never shared with supervisors.
          </p>
        </div>
      </div>

      {/* Editor Modal / View */}
      {isEditing ? (
        <div className="journal-editor-card">
          <div className="editor-header">
            <h3>{editingId ? "Edit Journal Entry" : "New Private Journal Entry"}</h3>
            <button
              type="button"
              className="text-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>

          <div className="editor-form">
            <div className="form-group">
              <label>Entry Title</label>
              <input
                type="text"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                placeholder="Give your reflection a title..."
                className="journal-input"
              />
            </div>

            <div className="form-row-compact">
              <div className="form-group">
                <label>Mood Tag</label>
                <select
                  value={entryMood}
                  onChange={(e) => setEntryMood(e.target.value as MoodState)}
                  className="journal-select"
                >
                  <option value="great">Great / Inspired</option>
                  <option value="good">Good / Balanced</option>
                  <option value="neutral">Neutral / Steady</option>
                  <option value="low">Low / Drained</option>
                  <option value="stressed">Stressed / Working Through It</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Reflection Content</label>
              <textarea
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                placeholder="Write freely. Express your thoughts, questions, or observations without judgment..."
                rows={8}
                className="journal-textarea"
              />
            </div>

            <div className="editor-actions">
              <button
                type="button"
                className="button primary"
                onClick={handleSaveEntry}
                disabled={!entryTitle.trim() && !entryContent.trim()}
              >
                Save Private Entry <CheckCircle2 size={15} />
              </button>
              {editingId && (
                <button
                  type="button"
                  className="button outline alert-btn"
                  onClick={() => handleDelete(editingId)}
                >
                  <Trash2 size={14} /> Delete Entry
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Action Row & Writing Prompts */}
          <div className="journal-top-bar">
            <button
              type="button"
              className="button primary"
              onClick={() => handleStartNew()}
            >
              <Plus size={16} /> Write New Entry
            </button>

            <div className="journal-secondary-actions">
              <button
                type="button"
                className="button outline small-btn"
                onClick={handleExportJournal}
                disabled={entries.length === 0}
                title="Export all personal entries to JSON file"
              >
                <Download size={14} /> Export Backup
              </button>
              {entries.length > 0 && (
                <button
                  type="button"
                  className="button outline alert-btn small-btn"
                  onClick={() => setShowClearConfirm(true)}
                  title="Delete all journal entries"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* Suggested Prompts Tray */}
          <div className="journal-prompts-tray">
            <span className="prompts-title">SUGGESTED WRITING PROMPTS:</span>
            <div className="prompts-chips-scroll">
              {promptsList.map((pr, i) => (
                <button
                  key={i}
                  type="button"
                  className="prompt-chip-btn"
                  onClick={() => handleStartNew(pr)}
                >
                  “{pr}”
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="journal-filter-bar">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search reflections by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="mood-filter-box">
              <label>Filter by Mood:</label>
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value as MoodState | "all")}
                className="mood-filter-select"
              >
                <option value="all">All Moods</option>
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
                <option value="low">Low</option>
                <option value="stressed">Stressed</option>
              </select>
            </div>
          </div>

          {/* Entries Feed */}
          <div className="journal-entries-feed">
            {filteredEntries.length === 0 ? (
              <div className="empty-journal-card">
                <Compass size={32} className="accent-cyan" />
                <h3>No Journal Entries Found</h3>
                <p>
                  {searchQuery || selectedMoodFilter !== "all"
                    ? "No reflections match your search filters."
                    : "Your private journal is currently empty. Writing even a couple of sentences helps process high-tempo mission shifts."}
                </p>
                <button
                  type="button"
                  className="button primary small-btn"
                  onClick={() => handleStartNew()}
                >
                  Write First Reflection
                </button>
              </div>
            ) : (
              filteredEntries.map((item) => (
                <div key={item.id} className="journal-entry-card">
                  <div className="entry-head">
                    <div className="entry-title-box">
                      <h4>{item.title}</h4>
                      <div className="entry-meta-row">
                        <span className="entry-day">
                          <Calendar size={11} /> Day {item.missionDay}
                        </span>
                        {item.moodTag && (
                          <span className={`entry-mood-tag mood-${item.moodTag}`}>
                            {item.moodTag.toUpperCase()}
                          </span>
                        )}
                        <span className="entry-time">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="entry-actions-row">
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => handleEditExisting(item)}
                        title="Edit Entry"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn delete"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {item.promptUsed && (
                    <div className="entry-prompt-badge">
                      Prompt: <em>{item.promptUsed}</em>
                    </div>
                  )}

                  <p className="entry-body-text">{item.content}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="mindspace-modal-backdrop" role="dialog" aria-modal="true">
          <div className="mindspace-modal-card confirm-modal">
            <AlertTriangle size={36} className="accent-orange" />
            <h3>Delete All Private Entries?</h3>
            <p>
              This will permanently delete all {entries.length} reflections from this device’s local storage. This action cannot be undone.
            </p>
            <div className="modal-actions-row">
              <button
                type="button"
                className="button outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button outline alert-btn"
                onClick={handleClearAll}
              >
                Permanently Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
