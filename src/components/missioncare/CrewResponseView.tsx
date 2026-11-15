import { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  Edit2,
  ShieldCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  getCrewRoles,
  saveCrewRoles,
  toggleCrewChecklistItem,
  addTimelineEntry,
  type CrewMemberRole,
  type CrewRoleType,
} from "../../services/missionCareService";

export default function CrewResponseView() {
  const [roles, setRoles] = useState<CrewMemberRole[]>(() => getCrewRoles());
  const [editingRoleId, setEditingRoleId] = useState<CrewRoleType | null>(null);
  const [assigneeInput, setAssigneeInput] = useState("");

  const handleToggleCheck = (roleId: CrewRoleType, itemId: string) => {
    const updated = toggleCrewChecklistItem(roleId, itemId);
    setRoles(updated);

    const role = updated.find((r) => r.roleId === roleId);
    const item = role?.checklist.find((i) => i.id === itemId);

    if (item) {
      addTimelineEntry({
        category: "CREW_ACTION",
        title: `${role?.title}: ${item.text}`,
        details: `Status: ${item.done ? "COMPLETED" : "RE-OPENED"} by ${role?.assignedMember}`,
        provenance: "MANUAL_ENTRY",
        author: role?.assignedMember || "Crew Coordinator",
        missionDay: 147,
      });
    }
  };

  const handleStartEdit = (role: CrewMemberRole) => {
    setEditingRoleId(role.roleId);
    setAssigneeInput(role.assignedMember);
  };

  const handleSaveAssignee = (roleId: CrewRoleType) => {
    const updated = roles.map((r) =>
      r.roleId === roleId ? { ...r, assignedMember: assigneeInput.trim() || r.assignedMember } : r,
    );
    setRoles(updated);
    saveCrewRoles(updated);
    setEditingRoleId(null);
  };

  return (
    <div className="crew-response-root">
      {/* Notice Card */}
      <div className="crew-notice-strip">
        <ShieldCheck size={18} className="accent-cyan" />
        <span>
          <strong>Organizational Coordination Notice:</strong> Emergency crew roles distribute tasks during high-stress off-nominal events. They represent operational assignments, not clinical licenses or medical certifications.
        </span>
      </div>

      {/* Grid of 5 Crew Roles */}
      <div className="crew-roles-grid">
        {roles.map((role) => (
          <div key={role.roleId} className="crew-role-card">
            <div className="role-card-header">
              <div className="role-title-group">
                <span className="role-badge">ROLE ASSIGNMENT</span>
                <h3>{role.title}</h3>
              </div>

              <div className="assigned-member-box">
                {editingRoleId === role.roleId ? (
                  <div className="inline-edit-row">
                    <input
                      type="text"
                      value={assigneeInput}
                      onChange={(e) => setAssigneeInput(e.target.value)}
                      className="styled-input mini-input"
                    />
                    <button
                      type="button"
                      className="button primary mini-btn"
                      onClick={() => handleSaveAssignee(role.roleId)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="assignee-display-row">
                    <UserCheck size={14} className="accent-mint" />
                    <strong>{role.assignedMember}</strong>
                    <button
                      type="button"
                      className="icon-edit-btn"
                      onClick={() => handleStartEdit(role)}
                      title="Change assignee"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="role-description">{role.description}</p>

            <div className="role-checklist-section">
              <span className="checklist-lbl">OPERATIONAL CHECKLIST:</span>
              <ul className="role-tasks-list">
                {role.checklist.map((item) => (
                  <li key={item.id} className={`task-item ${item.done ? "task-done" : ""}`}>
                    <label className="task-checkbox-label">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleCheck(role.roleId, item.id)}
                      />
                      <span className="task-text">{item.text}</span>
                    </label>
                    {item.timestamp && (
                      <span className="task-timestamp">
                        <Clock size={11} /> {item.timestamp}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
