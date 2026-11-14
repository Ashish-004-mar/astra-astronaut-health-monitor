import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  Package,
  History,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  Edit3,
  Search,
  Droplet,
  Flame,
  Dumbbell,
  CheckCircle2,
  X,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../state/store";
import {
  SPACE_FOOD_CATALOG,
  getDailyNutritionSummary,
  getMealLogs,
  logMeal,
  deleteMeal,
  getInventory,
  restockInventory,
  getCalorieHistory,
  getProteinHistory,
  simulateNextMeal,
  DEFAULT_TARGETS,
} from "../services/nutritionService";
import type {
  FoodItem,
  MealLogEntry,
  MealType,
  InventoryItem,
  DailyNutritionSummary,
} from "../types/nutrition";

export default function Nutrition() {
  const { mission, reduced } = useStore();
  const currentDay = mission.day;

  // State
  const [summary, setSummary] = useState<DailyNutritionSummary>(() =>
    getDailyNutritionSummary(currentDay),
  );
  const [meals, setMeals] = useState<MealLogEntry[]>(() => getMealLogs(currentDay));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getInventory());
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "history">("dashboard");

  // Time filters for charts
  const [calorieRange, setCalorieRange] = useState<"TODAY" | "7D" | "30D">("TODAY");
  const [proteinRange, setProteinRange] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [calorieData, setCalorieData] = useState(() =>
    getCalorieHistory(calorieRange, currentDay),
  );
  const [proteinData, setProteinData] = useState(() =>
    getProteinHistory(proteinRange, currentDay),
  );

  // Modals & Panels
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  // Simulation Playback state
  const [isSimRunning, setIsSimRunning] = useState(false);

  // Meal Logging Form State
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem>(SPACE_FOOD_CATALOG[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [deductFromInv, setDeductFromInv] = useState(true);

  // Refresh all state when mission day or data updates
  const refreshData = () => {
    setSummary(getDailyNutritionSummary(currentDay));
    setMeals(getMealLogs(currentDay));
    setInventory(getInventory());
    setCalorieData(getCalorieHistory(calorieRange, currentDay));
    setProteinData(getProteinHistory(proteinRange, currentDay));
  };

  useEffect(() => {
    refreshData();
  }, [currentDay, calorieRange, proteinRange]);

  // Simulation playback timer
  useEffect(() => {
    if (!isSimRunning) return;
    const interval = setInterval(() => {
      simulateNextMeal(currentDay);
      refreshData();
      setConfirmationNotice("Simulated meal logged via playback engine.");
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimRunning, currentDay]);

  // Auto-dismiss confirmation notice
  useEffect(() => {
    if (!confirmationNotice) return;
    const t = setTimeout(() => setConfirmationNotice(null), 3500);
    return () => clearTimeout(t);
  }, [confirmationNotice]);

  const handleLogMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = Math.round(selectedFood.calories * quantity);
    const protein = Math.round(selectedFood.protein * quantity * 10) / 10;
    const carbs = Math.round(selectedFood.carbs * quantity * 10) / 10;
    const fat = Math.round(selectedFood.fat * quantity * 10) / 10;

    logMeal({
      mealType: selectedMealType,
      foodItemId: selectedFood.id,
      foodName: selectedFood.name,
      servingQuantity: quantity,
      calories,
      protein,
      carbs,
      fat,
      missionDay: currentDay,
      notes: notes.trim() || undefined,
      fromInventory: deductFromInv,
    });

    setIsLogModalOpen(false);
    setNotes("");
    setQuantity(1);
    refreshData();
    setConfirmationNotice(`Meal successfully logged: ${selectedFood.name} (${calories} kcal)`);
  };

  const handleDeleteMeal = (id: string) => {
    deleteMeal(id);
    refreshData();
    setConfirmationNotice("Meal entry removed.");
  };

  // Filter catalog
  const filteredCatalog = SPACE_FOOD_CATALOG.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group meals by type
  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

  // Low stock and expiring items
  const lowStockItems = inventory.filter((i) => i.quantityRemaining <= i.minThreshold);
  const expiringItems = inventory.filter((i) => {
    const d = new Date(i.useByDate);
    const now = new Date("2026-11-14");
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays < 45;
  });

  return (
    <div className="nutrition-page">
      {/* Floating Action Header Bar */}
      <div className="nutrition-header-actions">
        <div className="title-area">
          <div className="eyebrow">
            <UtensilsCrossed size={12} /> ASTRA / CREW WELLNESS
          </div>
          <h1 className="page-heading">MISSION NUTRITION</h1>
          <p className="page-subheading">
            Fuel your body. Sustain your mission.
            <span className="nasa-ref-tag">
              NASA HRP RISK OF INADEQUATE FOOD & NUTRITION
            </span>
          </p>
        </div>

        {/* Floating Animated Buttons */}
        <div className="floating-actions-row">
          <motion.button
            className="button primary floating-button"
            whileHover={reduced ? {} : { y: -3, scale: 1.02 }}
            animate={reduced ? {} : { y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            onClick={() => setIsLogModalOpen(true)}
            aria-label="Log a new meal"
          >
            <Plus size={16} /> <strong>+ LOG MEAL</strong>
          </motion.button>

          <motion.button
            className={`button outline floating-button ${activeTab === "inventory" ? "active" : ""}`}
            whileHover={reduced ? {} : { y: -2 }}
            onClick={() => setActiveTab(activeTab === "inventory" ? "dashboard" : "inventory")}
            aria-label="View Galley Inventory"
          >
            <Package size={15} /> VIEW INVENTORY
          </motion.button>

          <motion.button
            className={`button outline floating-button ${activeTab === "history" ? "active" : ""}`}
            whileHover={reduced ? {} : { y: -2 }}
            onClick={() => setActiveTab(activeTab === "history" ? "dashboard" : "history")}
            aria-label="View Nutrition History"
          >
            <History size={15} /> VIEW HISTORY
          </motion.button>
        </div>
      </div>

      {/* Confirmation Banner */}
      <AnimatePresence>
        {confirmationNotice && (
          <motion.div
            className="nutrition-notice-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
          >
            <CheckCircle2 size={16} />
            <span>{confirmationNotice}</span>
            <button
              onClick={() => setConfirmationNotice(null)}
              aria-label="Dismiss notice"
              className="notice-dismiss-btn"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Galley Inventory View (when active) */}
      {activeTab === "inventory" && (
        <section className="panel inventory-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">GALLEY STORES</span>
              <h2>Food Package Inventory & Stock Status</h2>
            </div>
            <div className="inv-actions">
              <button
                className="button outline"
                onClick={() => {
                  restockInventory();
                  refreshData();
                  setConfirmationNotice("Galley inventory restocked to nominal levels.");
                }}
              >
                <RefreshCw size={14} /> RESTOCK ALL
              </button>
              <button
                className="icon-button"
                onClick={() => setActiveTab("dashboard")}
                aria-label="Close inventory view"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Inventory Alerts */}
          {(lowStockItems.length > 0 || expiringItems.length > 0) && (
            <div className="inventory-alerts-bar">
              {lowStockItems.length > 0 && (
                <div className="inv-alert warning">
                  <AlertTriangle size={15} />
                  <span>
                    <strong>Food stock running low:</strong> {lowStockItems.map((i) => i.name).join(", ")}.
                  </span>
                </div>
              )}
              {expiringItems.length > 0 && (
                <div className="inv-alert info">
                  <Info size={15} />
                  <span>
                    <strong>Approaching listed use-by date:</strong> {expiringItems.map((i) => i.name).join(", ")}.
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="inventory-grid">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`inv-card ${item.quantityRemaining <= item.minThreshold ? "low-stock" : ""}`}
              >
                <div className="inv-card-head">
                  <span className="category-tag">{item.category}</span>
                  <span className={`stock-badge ${item.quantityRemaining <= item.minThreshold ? "badge-low" : "badge-ok"}`}>
                    {item.quantityRemaining} {item.unit}
                  </span>
                </div>
                <h3>{item.name}</h3>
                <div className="inv-meta">
                  <span>{item.storageCategory}</span>
                  <small>Use-by: {item.useByDate}</small>
                </div>
                <div className="inv-nutrients">
                  <span>{item.calories} kcal</span>
                  <span>{item.protein}g protein</span>
                  <span>{item.carbs}g carbs</span>
                </div>
                <div className="inv-card-footer">
                  <button
                    className="button text-btn"
                    onClick={() => {
                      restockInventory(item.id);
                      refreshData();
                      setConfirmationNotice(`Restocked +15 ${item.name}`);
                    }}
                  >
                    + Restock Pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Dashboard View */}
      {activeTab === "dashboard" && (
        <>
          {/* Daily Nutrition Overview Cards */}
          <section className="nutrition-summary-grid">
            <div className="summary-card energy-card">
              <div className="card-top">
                <span className="label">
                  <Flame size={14} className="accent-flame" /> CALORIES LOGGED
                </span>
                <span className="tag">SIMULATED MISSION DATA</span>
              </div>
              <div className="value-row">
                <span className="big-num">{summary.calories.toLocaleString()}</span>
                <span className="unit">kcal</span>
              </div>
              <div className="target-comparison">
                Target: {DEFAULT_TARGETS.dailyCalories} kcal (
                {Math.round((summary.calories / DEFAULT_TARGETS.dailyCalories) * 100)}%)
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-fill cyan-fill"
                  style={{
                    width: `${Math.min(100, (summary.calories / DEFAULT_TARGETS.dailyCalories) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="summary-card protein-card">
              <div className="card-top">
                <span className="label">
                  <Dumbbell size={14} className="accent-mint" /> PROTEIN LOGGED
                </span>
                <span className="tag">NASA HRP MUSCLE FOCUS</span>
              </div>
              <div className="value-row">
                <span className="big-num">{summary.protein}</span>
                <span className="unit">g</span>
              </div>
              <div className="target-comparison">
                Target: {DEFAULT_TARGETS.dailyProtein} g (
                {Math.round((summary.protein / DEFAULT_TARGETS.dailyProtein) * 100)}%)
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-fill mint-fill"
                  style={{
                    width: `${Math.min(100, (summary.protein / DEFAULT_TARGETS.dailyProtein) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="summary-card carbs-card">
              <div className="card-top">
                <span className="label">CARBOHYDRATES</span>
                <span className="tag">GLYCOGEN</span>
              </div>
              <div className="value-row">
                <span className="big-num">{summary.carbs}</span>
                <span className="unit">g</span>
              </div>
              <div className="target-comparison">Target: {DEFAULT_TARGETS.dailyCarbs} g</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-fill yellow-fill"
                  style={{
                    width: `${Math.min(100, (summary.carbs / DEFAULT_TARGETS.dailyCarbs) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="summary-card fat-card">
              <div className="card-top">
                <span className="label">LIPIDS / FAT</span>
                <span className="tag">CELLULAR</span>
              </div>
              <div className="value-row">
                <span className="big-num">{summary.fat}</span>
                <span className="unit">g</span>
              </div>
              <div className="target-comparison">Target: {DEFAULT_TARGETS.dailyFat} g</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-fill orange-fill"
                  style={{
                    width: `${Math.min(100, (summary.fat / DEFAULT_TARGETS.dailyFat) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="summary-card water-card">
              <div className="card-top">
                <span className="label">
                  <Droplet size={14} className="accent-blue" /> WATER INTAKE
                </span>
                <span className="tag">HYDRATION</span>
              </div>
              <div className="value-row">
                <span className="big-num">{summary.waterMl}</span>
                <span className="unit">mL</span>
              </div>
              <div className="target-comparison">Target: {DEFAULT_TARGETS.dailyWater} mL</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-fill blue-fill"
                  style={{
                    width: `${Math.min(100, (summary.waterMl / DEFAULT_TARGETS.dailyWater) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Side-by-side Animated Graphs */}
          <div className="nutrition-charts-row">
            {/* Calorie Intake Graph */}
            <section className="panel chart-panel">
              <div className="chart-header">
                <div>
                  <span className="eyebrow">ENERGY TRAJECTORY</span>
                  <h2>CALORIE INTAKE</h2>
                </div>
                <div className="chart-filter-pills">
                  {(["TODAY", "7D", "30D"] as const).map((r) => (
                    <button
                      key={r}
                      className={`filter-pill ${calorieRange === r ? "active" : ""}`}
                      onClick={() => setCalorieRange(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-container" style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#4b6171"
                      tick={{ fill: "#82949e", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#4b6171"
                      tick={{ fill: "#82949e", fontSize: 11 }}
                      domain={[0, 3000]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(8, 23, 38, 0.95)",
                        borderColor: "rgba(14, 165, 233, 0.4)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "0.85rem",
                      }}
                      formatter={(val: any) => [`${val} kcal`, "Intake"]}
                    />
                    <ReferenceLine
                      y={DEFAULT_TARGETS.dailyCalories}
                      stroke="#76dfcb"
                      strokeDasharray="3 3"
                      label={{
                        value: "Target 2400 kcal",
                        fill: "#76dfcb",
                        fontSize: 10,
                        position: "insideTopRight",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="calories"
                      stroke="#0ea5e9"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#calGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="chart-caption">
                Cumulative energy absorption calculated from verified galley meal logs. Ambient scan active.
              </p>
            </section>

            {/* Protein Intake Graph */}
            <section className="panel chart-panel">
              <div className="chart-header">
                <div>
                  <span className="eyebrow">MUSCULOSKELETAL PRESERVATION</span>
                  <h2>PROTEIN INTAKE</h2>
                </div>
                <div className="chart-filter-pills">
                  {(["DAILY", "WEEKLY"] as const).map((r) => (
                    <button
                      key={r}
                      className={`filter-pill ${proteinRange === r ? "active" : ""}`}
                      onClick={() => setProteinRange(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-container" style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={proteinData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#4b6171"
                      tick={{ fill: "#82949e", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#4b6171"
                      tick={{ fill: "#82949e", fontSize: 11 }}
                      domain={[0, 130]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(8, 23, 38, 0.95)",
                        borderColor: "rgba(118, 223, 203, 0.4)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "0.85rem",
                      }}
                      formatter={(val: any) => [`${val} g`, "Protein"]}
                    />
                    <ReferenceLine
                      y={DEFAULT_TARGETS.dailyProtein}
                      stroke="#76dfcb"
                      strokeDasharray="3 3"
                      label={{
                        value: "Target 90g",
                        fill: "#76dfcb",
                        fontSize: 10,
                        position: "insideTopRight",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="protein"
                      stroke="#76dfcb"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#76dfcb" }}
                      activeDot={{ r: 6, fill: "#38bdf8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="chart-caption">
                Essential amino acid consumption countering microgravity muscle deconditioning.
              </p>
            </section>
          </div>

          {/* Interactive Meal Cards (Breakfast, Lunch, Dinner, Snack) */}
          <section className="panel meal-cards-section">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">TODAY’S RECORDED MEALS</span>
                <h2>Mission Day {currentDay} Galley Logs</h2>
              </div>
              <span className="tag">
                <Clock size={12} /> {meals.length} LOGS RECORDED
              </span>
            </div>

            <div className="meal-types-grid">
              {mealTypes.map((type) => {
                const typeMeals = meals.filter((m) => m.mealType === type);
                const typeCalories = typeMeals.reduce((acc, m) => acc + m.calories, 0);
                const typeProtein = typeMeals.reduce((acc, m) => acc + m.protein, 0);

                return (
                  <div key={type} className="meal-card">
                    <div className="meal-card-header">
                      <h3>{type.toUpperCase()}</h3>
                      <span className={`status-pill ${typeMeals.length > 0 ? "logged" : "pending"}`}>
                        {typeMeals.length > 0 ? "LOGGED" : "PENDING"}
                      </span>
                    </div>

                    {typeMeals.length === 0 ? (
                      <p className="no-meal-text">No meal recorded yet.</p>
                    ) : (
                      <div className="meal-items-list">
                        {typeMeals.map((item) => (
                          <div key={item.id} className="meal-item-row">
                            <div className="item-info">
                              <strong className="item-name">{item.foodName}</strong>
                              <span className="item-meta">
                                {item.servingQuantity}x · {item.timeStr} · {item.calories} kcal · {item.protein}g protein
                              </span>
                              {item.notes && <small className="item-notes">"{item.notes}"</small>}
                            </div>
                            <button
                              className="item-delete-btn"
                              onClick={() => handleDeleteMeal(item.id)}
                              aria-label={`Remove ${item.foodName}`}
                              title="Delete entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="meal-card-footer">
                      <div className="meal-totals">
                        <span>{typeCalories} kcal</span>
                        <span>{typeProtein}g protein</span>
                      </div>
                      <button
                        className="button text-btn add-item-btn"
                        onClick={() => {
                          setSelectedMealType(type);
                          setIsLogModalOpen(true);
                        }}
                      >
                        + Add Food
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Today's Nutrition Status & Recommendations */}
          <section className="panel status-panel">
            <div className="status-flex-row">
              <div className="status-icon-box">
                <ShieldCheck size={24} className="accent-mint" />
              </div>
              <div className="status-info">
                <div className="eyebrow">
                  TODAY’S NUTRITION STATUS ·{" "}
                  <span className={summary.status === "COMPLETE" ? "nominal-text" : "attention-text"}>
                    {summary.status}
                  </span>
                </div>
                <h3>{summary.statusMessage}</h3>
                <p>{summary.actionRecommendation}</p>
                <small className="disclaimer-note">
                  ASTRA nutrition tracking is an astronaut self-assessment tool based on NASA HRP guidelines. It is not a clinical medical diagnostic system.
                </small>
              </div>
            </div>
          </section>

          {/* Simulation Playback Control Bar */}
          <section className="panel sim-playback-bar">
            <div className="sim-playback-left">
              <span className="eyebrow">SIMULATED NUTRITION PLAYBACK</span>
              <p>Advance mission nutrition time to demo dynamic meal logs and inventory deductions.</p>
            </div>
            <div className="sim-playback-controls">
              <button
                className={`button ${isSimRunning ? "outline" : "primary"}`}
                onClick={() => setIsSimRunning(!isSimRunning)}
              >
                {isSimRunning ? (
                  <>
                    <Pause size={14} /> PAUSE
                  </>
                ) : (
                  <>
                    <Play size={14} /> START DEMO
                  </>
                )}
              </button>
              <button
                className="button outline"
                onClick={() => {
                  setIsSimRunning(false);
                  refreshData();
                  setConfirmationNotice("Simulation playback reset.");
                }}
              >
                <RotateCcw size={14} /> RESET
              </button>
            </div>
          </section>
        </>
      )}

      {/* Meal History View */}
      {activeTab === "history" && (
        <section className="panel history-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">CHRONOLOGICAL LOG</span>
              <h2>Comprehensive Meal & Galley History</h2>
            </div>
            <button className="icon-button" onClick={() => setActiveTab("dashboard")}>
              <X size={16} />
            </button>
          </div>

          <div className="history-table-container">
            <table className="nutrition-table">
              <thead>
                <tr>
                  <th>Time / Day</th>
                  <th>Meal</th>
                  <th>Food Item</th>
                  <th>Qty</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((m) => (
                  <tr key={m.id}>
                    <td>
                      Day {m.missionDay} · {m.timeStr}
                    </td>
                    <td>
                      <span className="meal-tag">{m.mealType}</span>
                    </td>
                    <td>
                      <strong>{m.foodName}</strong>
                    </td>
                    <td>{m.servingQuantity}</td>
                    <td>{m.calories} kcal</td>
                    <td>{m.protein} g</td>
                    <td>{m.carbs} g</td>
                    <td>{m.fat} g</td>
                    <td>
                      <button
                        className="text-btn danger"
                        onClick={() => handleDeleteMeal(m.id)}
                        aria-label="Delete entry"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal: LOG MEAL */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsLogModalOpen(false)}>
            <motion.div
              className="modal-content nutrition-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="eyebrow">ASTRONAUT LOGGING SYSTEM</span>
                  <h2>Log Mission Food Intake</h2>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setIsLogModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleLogMeal} className="meal-log-form">
                {/* Meal Type Selection */}
                <div className="form-group">
                  <label className="form-label">Meal Type</label>
                  <div className="meal-type-selector">
                    {mealTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`type-btn ${selectedMealType === type ? "selected" : ""}`}
                        onClick={() => setSelectedMealType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Catalog Search */}
                <div className="form-group">
                  <label className="form-label">
                    Search Illustrative Space Food Catalog (30 items)
                  </label>
                  <div className="search-bar-input">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Search food packages (e.g. eggs, chicken, almonds, shake)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="catalog-selection-box">
                    {filteredCatalog.map((food) => (
                      <button
                        type="button"
                        key={food.id}
                        className={`catalog-item-btn ${selectedFood.id === food.id ? "selected" : ""}`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="cat-item-left">
                          <strong>{food.name}</strong>
                          <small>
                            {food.category} · {food.servingSize}
                          </small>
                        </div>
                        <div className="cat-item-right">
                          <span>{food.calories} kcal</span>
                          <span>{food.protein}g P</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Serving & Quantity */}
                <div className="form-row-dual">
                  <div className="form-group">
                    <label className="form-label">Serving Quantity</label>
                    <div className="quantity-counter">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => setQuantity(quantity + 0.5)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calculated Intake</label>
                    <div className="calculated-preview-pill">
                      <span>{Math.round(selectedFood.calories * quantity)} kcal</span>
                      <span>{Math.round(selectedFood.protein * quantity * 10) / 10}g P</span>
                      <span>{Math.round(selectedFood.carbs * quantity * 10) / 10}g C</span>
                    </div>
                  </div>
                </div>

                {/* Notes & Inventory option */}
                <div className="form-group">
                  <label className="form-label">Optional Crew Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Rehydrated with 120ml warm galley water"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="form-group checkbox-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={deductFromInv}
                      onChange={(e) => setDeductFromInv(e.target.checked)}
                    />
                    <span>Deduct package from galley inventory stock</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="button outline"
                    onClick={() => setIsLogModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button primary">
                    + CONFIRM & LOG MEAL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
