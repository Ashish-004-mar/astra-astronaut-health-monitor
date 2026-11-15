import { useState } from "react";
import {
  Box,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  XCircle,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import {
  getEquipmentInventory,
  saveEquipmentInventory,
  updateEquipmentStatus,
  type EmergencyEquipmentItem,
  type MissionEnvironmentId,
} from "../../services/missionCareService";

interface EmergencyEquipmentViewProps {
  currentEnv: MissionEnvironmentId;
}

export default function EmergencyEquipmentView({ currentEnv }: EmergencyEquipmentViewProps) {
  const [items, setItems] = useState<EmergencyEquipmentItem[]>(() => getEquipmentInventory());
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Add Item Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemLocation, setNewItemLocation] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<EmergencyEquipmentItem["category"]>("monitoring");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.location.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleStatusChange = (id: string, status: EmergencyEquipmentItem["status"]) => {
    updateEquipmentStatus(id, status);
    setItems(getEquipmentInventory());
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim() || !newItemLocation.trim()) return;

    const newItem: EmergencyEquipmentItem = {
      id: `eq-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      location: newItemLocation.trim(),
      status: "AVAILABLE",
      notes: "Newly staged emergency consumable.",
      lastCheckedDate: "Day 147",
      applicableEnvironments: ["spacecraft", "iss", "lunar", "mars"],
    };

    const updated = [newItem, ...items];
    saveEquipmentInventory(updated);
    setItems(updated);
    setIsAddOpen(false);
    setNewItemName("");
    setNewItemLocation("");
  };

  return (
    <div className="equipment-view-root">
      {/* Notice Card */}
      <div className="equipment-notice-strip">
        <ShieldAlert size={18} className="accent-cyan" />
        <span>
          <strong>Operational Hardware Notice:</strong> ASTRA MissionCare tracks location and availability status. The software cannot physically control, arm, or operate physical spacecraft medical devices.
        </span>
      </div>

      {/* Controls Bar */}
      <div className="equipment-controls-bar">
        <div className="search-box">
          <Search size={14} className="accent-cyan" />
          <input
            type="text"
            placeholder="Search equipment or locker location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="styled-search-input"
          />
        </div>

        <div className="filter-actions-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="styled-select mini-select"
          >
            <option value="all">All Categories</option>
            <option value="resuscitation">Resuscitation (AED/BVM)</option>
            <option value="monitoring">Monitoring (Vitals)</option>
            <option value="airway">Airway & Suction</option>
            <option value="trauma">Trauma & Restraint</option>
            <option value="pharmaceutical">Pharmaceuticals</option>
          </select>

          <button
            type="button"
            className="button primary small-btn"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={14} /> Add Equipment Item
          </button>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="equipment-cards-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="equip-item-card">
            <div className="item-card-top">
              <span className={`status-badge status-${item.status.toLowerCase()}`}>
                {item.status.replace(/_/g, " ")}
              </span>
              <span className="category-tag">{item.category.toUpperCase()}</span>
            </div>

            <h4>{item.name}</h4>

            <div className="location-row">
              <MapPin size={13} className="accent-cyan" />
              <span>Location: <strong>{item.location}</strong></span>
            </div>

            {item.notes && <p className="item-notes">{item.notes}</p>}

            <div className="item-card-footer">
              <span className="verified-date">Checked: {item.lastCheckedDate}</span>

              <div className="status-toggle-btns">
                <button
                  type="button"
                  className={`btn-tag ${item.status === "AVAILABLE" ? "active" : ""}`}
                  onClick={() => handleStatusChange(item.id, "AVAILABLE")}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`btn-tag ${item.status === "IN_USE" ? "active" : ""}`}
                  onClick={() => handleStatusChange(item.id, "IN_USE")}
                >
                  In Use
                </button>
                <button
                  type="button"
                  className={`btn-tag btn-unavail ${item.status === "UNAVAILABLE" ? "active" : ""}`}
                  onClick={() => handleStatusChange(item.id, "UNAVAILABLE")}
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Equipment Modal */}
      {isAddOpen && (
        <div className="missioncare-modal-backdrop">
          <div className="missioncare-modal-card">
            <div className="modal-header">
              <h3>Stage New Medical Equipment Item</h3>
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
                <label>Equipment Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Endotracheal Tube Pack or Tourniquet"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <label>Locker Location:</label>
                <input
                  type="text"
                  placeholder="e.g. Node 2 / Port Medical Pouch 4"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  className="styled-input"
                />
              </div>

              <div className="input-group">
                <label>Category:</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as EmergencyEquipmentItem["category"])}
                  className="styled-select"
                >
                  <option value="monitoring">Monitoring</option>
                  <option value="resuscitation">Resuscitation</option>
                  <option value="airway">Airway & Suction</option>
                  <option value="trauma">Trauma & Restraint</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
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
                onClick={handleAddNewItem}
              >
                Save Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
