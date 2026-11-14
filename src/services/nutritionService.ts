import type {
  FoodItem,
  InventoryItem,
  MealLogEntry,
  NutritionTargets,
  DailyNutritionSummary,
} from "../types/nutrition";

export const DEFAULT_TARGETS: NutritionTargets = {
  dailyCalories: 2400, // Planning reference
  dailyProtein: 90, // g
  dailyCarbs: 290, // g
  dailyFat: 65, // g
  dailyWater: 2400, // mL
};

// 30 illustrative NASA-inspired space flight food items
export const SPACE_FOOD_CATALOG: FoodItem[] = [
  // 1. Rehydratable meals
  {
    id: "rehyd-01",
    name: "Scrambled Eggs with Cheddar",
    category: "Rehydratable meals",
    servingSize: "1 pouch (55g dry)",
    calories: 280,
    protein: 16,
    carbs: 4,
    fat: 22,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "rehyd-02",
    name: "Beef Stroganoff with Noodles",
    category: "Rehydratable meals",
    servingSize: "1 pouch (85g dry)",
    calories: 390,
    protein: 24,
    carbs: 42,
    fat: 14,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "rehyd-03",
    name: "Chicken Teriyaki & Rice",
    category: "Rehydratable meals",
    servingSize: "1 pouch (90g dry)",
    calories: 360,
    protein: 26,
    carbs: 48,
    fat: 7,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "rehyd-04",
    name: "Spaghetti with Meat Sauce",
    category: "Rehydratable meals",
    servingSize: "1 pouch (85g dry)",
    calories: 340,
    protein: 20,
    carbs: 46,
    fat: 9,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "rehyd-05",
    name: "Macaroni and Cheese",
    category: "Rehydratable meals",
    servingSize: "1 pouch (75g dry)",
    calories: 310,
    protein: 12,
    carbs: 44,
    fat: 10,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },

  // 2. Thermostabilized foods
  {
    id: "thermo-01",
    name: "Smoked Turkey Breast Slices",
    category: "Thermostabilized foods",
    servingSize: "1 retort pouch (120g)",
    calories: 170,
    protein: 30,
    carbs: 2,
    fat: 4,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "thermo-02",
    name: "Tuna Salad Spread",
    category: "Thermostabilized foods",
    servingSize: "1 pouch (110g)",
    calories: 220,
    protein: 22,
    carbs: 6,
    fat: 12,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "thermo-03",
    name: "Spicy Mexican Corn Fiesta",
    category: "Thermostabilized foods",
    servingSize: "1 pouch (100g)",
    calories: 140,
    protein: 4,
    carbs: 26,
    fat: 3,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "thermo-04",
    name: "Vegetable Curry with Lentils",
    category: "Thermostabilized foods",
    servingSize: "1 pouch (130g)",
    calories: 230,
    protein: 11,
    carbs: 34,
    fat: 6,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "thermo-05",
    name: "Grilled Salmon in Dill Sauce",
    category: "Thermostabilized foods",
    servingSize: "1 pouch (115g)",
    calories: 260,
    protein: 28,
    carbs: 3,
    fat: 15,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },

  // 3. Packaged snacks
  {
    id: "snack-01",
    name: "Salt-Free Almonds & Cashews",
    category: "Packaged snacks",
    servingSize: "1 vacuum pack (45g)",
    calories: 260,
    protein: 9,
    carbs: 12,
    fat: 22,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "snack-02",
    name: "Whole Wheat Space Tortilla (x2)",
    category: "Packaged snacks",
    servingSize: "2 tortillas (60g)",
    calories: 160,
    protein: 5,
    carbs: 28,
    fat: 3.5,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "snack-03",
    name: "Peanut Butter Squeeze Tube",
    category: "Packaged snacks",
    servingSize: "1 tube (32g)",
    calories: 190,
    protein: 8,
    carbs: 7,
    fat: 16,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "snack-04",
    name: "Baked Pita Crisps",
    category: "Packaged snacks",
    servingSize: "1 pack (40g)",
    calories: 150,
    protein: 4,
    carbs: 25,
    fat: 4,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "snack-05",
    name: "Dark Chocolate Energy Squares",
    category: "Packaged snacks",
    servingSize: "1 pouch (35g)",
    calories: 180,
    protein: 3,
    carbs: 19,
    fat: 11,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },

  // 4. Fruit-based foods
  {
    id: "fruit-01",
    name: "Freeze-Dried Strawberries",
    category: "Fruit-based foods",
    servingSize: "1 pouch (28g)",
    calories: 100,
    protein: 2,
    carbs: 23,
    fat: 0.5,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "fruit-02",
    name: "Dried Peaches & Apricots",
    category: "Fruit-based foods",
    servingSize: "1 pack (40g)",
    calories: 120,
    protein: 2,
    carbs: 29,
    fat: 0.2,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "fruit-03",
    name: "Cinnamon Applesauce Pouch",
    category: "Fruit-based foods",
    servingSize: "1 pouch (90g)",
    calories: 80,
    protein: 0.5,
    carbs: 21,
    fat: 0.1,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "fruit-04",
    name: "Blueberry Granola Crunch",
    category: "Fruit-based foods",
    servingSize: "1 pouch (60g)",
    calories: 240,
    protein: 6,
    carbs: 38,
    fat: 8,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "fruit-05",
    name: "Tropical Mango Slices",
    category: "Fruit-based foods",
    servingSize: "1 pack (35g)",
    calories: 110,
    protein: 1,
    carbs: 27,
    fat: 0.3,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },

  // 5. Protein-rich meals
  {
    id: "protein-01",
    name: "Whey Protein Vanilla Shake",
    category: "Protein-rich meals",
    servingSize: "1 pouch (45g dry)",
    calories: 180,
    protein: 30,
    carbs: 5,
    fat: 2,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "protein-02",
    name: "Plant-Based High Protein Bar",
    category: "Protein-rich meals",
    servingSize: "1 bar (60g)",
    calories: 220,
    protein: 20,
    carbs: 22,
    fat: 7,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "protein-03",
    name: "Beef & Quinoa Power Bowl",
    category: "Protein-rich meals",
    servingSize: "1 pouch (120g)",
    calories: 380,
    protein: 32,
    carbs: 36,
    fat: 11,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "protein-04",
    name: "Chicken Fajita Skillet",
    category: "Protein-rich meals",
    servingSize: "1 pouch (110g)",
    calories: 290,
    protein: 28,
    carbs: 14,
    fat: 9,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "protein-05",
    name: "Soy & Edamame Crunch",
    category: "Protein-rich meals",
    servingSize: "1 pack (40g)",
    calories: 170,
    protein: 16,
    carbs: 10,
    fat: 6,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },

  // 6. Beverages
  {
    id: "bev-01",
    name: "Electrolyte Citrus Hydration",
    category: "Beverages",
    servingSize: "1 drink bag (250ml reconstituted)",
    calories: 35,
    protein: 0,
    carbs: 9,
    fat: 0,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "bev-02",
    name: "Kona Space Blend Coffee",
    category: "Beverages",
    servingSize: "1 pouch (240ml)",
    calories: 15,
    protein: 0.5,
    carbs: 2,
    fat: 0.2,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "bev-03",
    name: "Green Tea with Lemon & Honey",
    category: "Beverages",
    servingSize: "1 pouch (240ml)",
    calories: 40,
    protein: 0.2,
    carbs: 10,
    fat: 0,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "bev-04",
    name: "Calcium-Fortified Skim Milk",
    category: "Beverages",
    servingSize: "1 pouch (250ml reconstituted)",
    calories: 90,
    protein: 9,
    carbs: 12,
    fat: 0.5,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
  {
    id: "bev-05",
    name: "Orange Mango Recovery Juice",
    category: "Beverages",
    servingSize: "1 pouch (200ml)",
    calories: 85,
    protein: 1,
    carbs: 20,
    fat: 0,
    source: "Illustrative Space Food Catalog · NASA HRP Model",
    verified: true,
  },
];

// Default simulated inventory
export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: "inv-01",
    foodItemId: "rehyd-01",
    name: "Scrambled Eggs with Cheddar",
    category: "Rehydratable meals",
    quantityRemaining: 14,
    unit: "pouches",
    calories: 280,
    protein: 16,
    carbs: 4,
    fat: 22,
    useByDate: "2027-04-15",
    storageCategory: "Galley Rehydration",
    minThreshold: 4,
  },
  {
    id: "inv-02",
    foodItemId: "rehyd-02",
    name: "Beef Stroganoff with Noodles",
    category: "Rehydratable meals",
    quantityRemaining: 18,
    unit: "pouches",
    calories: 390,
    protein: 24,
    carbs: 42,
    fat: 14,
    useByDate: "2027-05-20",
    storageCategory: "Galley Rehydration",
    minThreshold: 5,
  },
  {
    id: "inv-03",
    foodItemId: "thermo-01",
    name: "Smoked Turkey Breast Slices",
    category: "Thermostabilized foods",
    quantityRemaining: 8,
    unit: "pouches",
    calories: 170,
    protein: 30,
    carbs: 2,
    fat: 4,
    useByDate: "2026-12-05", // Approaching date demo
    storageCategory: "Ambient Locker",
    minThreshold: 3,
  },
  {
    id: "inv-04",
    foodItemId: "thermo-05",
    name: "Grilled Salmon in Dill Sauce",
    category: "Thermostabilized foods",
    quantityRemaining: 2, // Low stock demo!
    unit: "pouches",
    calories: 260,
    protein: 28,
    carbs: 3,
    fat: 15,
    useByDate: "2026-11-28", // Approaching date demo
    storageCategory: "Chilled Storage",
    minThreshold: 4,
  },
  {
    id: "inv-05",
    foodItemId: "snack-01",
    name: "Salt-Free Almonds & Cashews",
    category: "Packaged snacks",
    quantityRemaining: 22,
    unit: "packs",
    calories: 260,
    protein: 9,
    carbs: 12,
    fat: 22,
    useByDate: "2027-08-10",
    storageCategory: "Ambient Locker",
    minThreshold: 5,
  },
  {
    id: "inv-06",
    foodItemId: "snack-02",
    name: "Whole Wheat Space Tortilla (x2)",
    category: "Packaged snacks",
    quantityRemaining: 30,
    unit: "packs",
    calories: 160,
    protein: 5,
    carbs: 28,
    fat: 3.5,
    useByDate: "2027-03-30",
    storageCategory: "Ambient Locker",
    minThreshold: 6,
  },
  {
    id: "inv-07",
    foodItemId: "fruit-01",
    name: "Freeze-Dried Strawberries",
    category: "Fruit-based foods",
    quantityRemaining: 12,
    unit: "pouches",
    calories: 100,
    protein: 2,
    carbs: 23,
    fat: 0.5,
    useByDate: "2027-09-01",
    storageCategory: "Ambient Locker",
    minThreshold: 4,
  },
  {
    id: "inv-08",
    foodItemId: "protein-01",
    name: "Whey Protein Vanilla Shake",
    category: "Protein-rich meals",
    quantityRemaining: 19,
    unit: "pouches",
    calories: 180,
    protein: 30,
    carbs: 5,
    fat: 2,
    useByDate: "2027-06-18",
    storageCategory: "Galley Rehydration",
    minThreshold: 5,
  },
  {
    id: "inv-09",
    foodItemId: "protein-02",
    name: "Plant-Based High Protein Bar",
    category: "Protein-rich meals",
    quantityRemaining: 15,
    unit: "bars",
    calories: 220,
    protein: 20,
    carbs: 22,
    fat: 7,
    useByDate: "2027-05-10",
    storageCategory: "Ambient Locker",
    minThreshold: 4,
  },
  {
    id: "inv-10",
    foodItemId: "bev-01",
    name: "Electrolyte Citrus Hydration",
    category: "Beverages",
    quantityRemaining: 28,
    unit: "bags",
    calories: 35,
    protein: 0,
    carbs: 9,
    fat: 0,
    useByDate: "2027-10-15",
    storageCategory: "Galley Rehydration",
    minThreshold: 8,
  },
];

// Initial simulated meal logs for Day 147 (Illustrative demonstration values: ~1650 kcal, 75g protein, 210g carbs, 55g fat, 3 meals)
export const INITIAL_DAY_147_MEALS: MealLogEntry[] = [
  {
    id: "meal-147-1",
    mealType: "Breakfast",
    foodItemId: "rehyd-01",
    foodName: "Scrambled Eggs with Cheddar",
    servingQuantity: 1,
    calories: 280,
    protein: 16,
    carbs: 4,
    fat: 22,
    missionDay: 147,
    timestamp: "2026-11-14T07:15:00.000Z",
    timeStr: "07:15",
    notes: "Consumed with 1 pouch Kona Coffee and strawberries.",
    fromInventory: true,
  },
  {
    id: "meal-147-2",
    mealType: "Breakfast",
    foodItemId: "fruit-01",
    foodName: "Freeze-Dried Strawberries",
    servingQuantity: 1,
    calories: 100,
    protein: 2,
    carbs: 23,
    fat: 0.5,
    missionDay: 147,
    timestamp: "2026-11-14T07:20:00.000Z",
    timeStr: "07:20",
    fromInventory: true,
  },
  {
    id: "meal-147-3",
    mealType: "Lunch",
    foodItemId: "thermo-01",
    foodName: "Smoked Turkey Breast Slices",
    servingQuantity: 1.5,
    calories: 255,
    protein: 45,
    carbs: 3,
    fat: 6,
    missionDay: 147,
    timestamp: "2026-11-14T12:30:00.000Z",
    timeStr: "12:30",
    notes: "Paired with space tortillas.",
    fromInventory: true,
  },
  {
    id: "meal-147-4",
    mealType: "Lunch",
    foodItemId: "snack-02",
    foodName: "Whole Wheat Space Tortilla (x2)",
    servingQuantity: 1.5,
    calories: 240,
    protein: 7.5,
    carbs: 42,
    fat: 5.25,
    missionDay: 147,
    timestamp: "2026-11-14T12:35:00.000Z",
    timeStr: "12:35",
    fromInventory: true,
  },
  {
    id: "meal-147-5",
    mealType: "Dinner",
    foodItemId: "rehyd-02",
    foodName: "Beef Stroganoff with Noodles",
    servingQuantity: 1,
    calories: 390,
    protein: 24,
    carbs: 42,
    fat: 14,
    missionDay: 147,
    timestamp: "2026-11-14T18:45:00.000Z",
    timeStr: "18:45",
    fromInventory: true,
  },
  {
    id: "meal-147-6",
    mealType: "Snack",
    foodItemId: "snack-01",
    foodName: "Salt-Free Almonds & Cashews",
    servingQuantity: 1.5,
    calories: 385,
    protein: 13.5,
    carbs: 18,
    fat: 33,
    missionDay: 147,
    timestamp: "2026-11-14T20:10:00.000Z",
    timeStr: "20:10",
    notes: "Post-workout evening snack.",
    fromInventory: true,
  },
];

// Storage keys
const STORAGE_KEYS = {
  MEALS: "astra_nutrition_meals_v1",
  INVENTORY: "astra_nutrition_inventory_v1",
  TARGETS: "astra_nutrition_targets_v1",
};

/**
 * Loads meal log entries from local storage or defaults.
 */
export function getAllMealLogs(): MealLogEntry[] {
  if (typeof window === "undefined") return INITIAL_DAY_147_MEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(INITIAL_DAY_147_MEALS));
      return INITIAL_DAY_147_MEALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DAY_147_MEALS;
  }
}

/**
 * Retrieves meal logs for a specific mission day.
 */
export function getMealLogs(missionDay: number): MealLogEntry[] {
  const all = getAllMealLogs();
  return all.filter((m) => m.missionDay === missionDay);
}

/**
 * Persists all meal logs to localStorage.
 */
function saveAllMealLogs(meals: MealLogEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (err) {
    console.error("Failed to save meal logs:", err);
  }
}

/**
 * Logs a new meal record and deducts inventory if specified.
 */
export function logMeal(
  entry: Omit<MealLogEntry, "id" | "timestamp" | "timeStr"> & { timeStr?: string },
): MealLogEntry {
  const all = getAllMealLogs();
  const now = new Date();
  const timeStr =
    entry.timeStr ||
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const newEntry: MealLogEntry = {
    ...entry,
    id: `meal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now.toISOString(),
    timeStr,
  };

  const updated = [newEntry, ...all];
  saveAllMealLogs(updated);

  // If item was pulled from inventory, deduct stock safely
  if (entry.fromInventory && entry.foodItemId) {
    deductInventory(entry.foodItemId, entry.servingQuantity);
  }

  return newEntry;
}

/**
 * Updates an existing meal record.
 */
export function updateMeal(entry: MealLogEntry): void {
  const all = getAllMealLogs();
  const index = all.findIndex((m) => m.id === entry.id);
  if (index >= 0) {
    all[index] = entry;
    saveAllMealLogs(all);
  }
}

/**
 * Deletes a meal record by ID.
 */
export function deleteMeal(id: string): void {
  const all = getAllMealLogs();
  const filtered = all.filter((m) => m.id !== id);
  saveAllMealLogs(filtered);
}

/**
 * Retrieves inventory list from storage or defaults.
 */
export function getInventory(): InventoryItem[] {
  if (typeof window === "undefined") return DEFAULT_INVENTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
      return DEFAULT_INVENTORY;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INVENTORY;
  }
}

/**
 * Saves inventory to storage.
 */
export function saveInventory(items: InventoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save inventory:", err);
  }
}

/**
 * Deducts inventory quantity safely (cannot go below 0).
 */
export function deductInventory(foodItemId: string, quantityToDeduct = 1): void {
  const inv = getInventory();
  const item = inv.find((i) => i.foodItemId === foodItemId);
  if (item) {
    item.quantityRemaining = Math.max(0, item.quantityRemaining - Math.round(quantityToDeduct));
    saveInventory(inv);
  }
}

/**
 * Restocks inventory items (either specific item or all to nominal levels).
 */
export function restockInventory(id?: string): void {
  const inv = getInventory();
  if (id) {
    const item = inv.find((i) => i.id === id);
    if (item) {
      item.quantityRemaining += 15;
      saveInventory(inv);
    }
  } else {
    // Restock all items
    const restored = DEFAULT_INVENTORY.map((item) => ({
      ...item,
      quantityRemaining: Math.max(item.quantityRemaining, item.minThreshold + 12),
    }));
    saveInventory(restored);
  }
}

/**
 * Computes daily summary for a given mission day.
 */
export function getDailyNutritionSummary(missionDay: number): DailyNutritionSummary {
  const dayMeals = getMealLogs(missionDay);
  const targets = DEFAULT_TARGETS;

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const m of dayMeals) {
    calories += m.calories;
    protein += m.protein;
    carbs += m.carbs;
    fat += m.fat;
  }

  // Simulated nominal water: 1900ml + (meals * 150ml)
  const waterMl = 1800 + dayMeals.length * 150;

  // Meal types recorded
  const typesRecorded = new Set(dayMeals.map((m) => m.mealType));
  const hasBreakfast = typesRecorded.has("Breakfast");
  const hasLunch = typesRecorded.has("Lunch");
  const hasDinner = typesRecorded.has("Dinner");

  let status: "COMPLETE" | "BELOW_TARGET" | "INCOMPLETE" = "COMPLETE";
  let statusMessage = "Your planned meal records are complete for today.";
  let actionRecommendation =
    "Maintain balanced macronutrient intake and adhere to scheduled hydration pouches.";

  if (!hasBreakfast || !hasLunch || !hasDinner) {
    status = "INCOMPLETE";
    statusMessage = "One planned meal has not been recorded yet.";
    actionRecommendation = "Review your galley meal log and log scheduled meal intake.";
  } else if (calories < targets.dailyCalories * 0.7) {
    status = "BELOW_TARGET";
    statusMessage = "Your recorded energy intake is below your configured planning target.";
    actionRecommendation =
      "Consider consuming a calorie-dense snack pack or rehydratable protein pouch before end-of-shift.";
  }

  return {
    missionDay,
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    waterMl,
    mealsCount: dayMeals.length,
    targets,
    status,
    statusMessage,
    actionRecommendation,
  };
}

/**
 * Calorie history for Recharts graphs with time filters.
 */
export function getCalorieHistory(
  range: "TODAY" | "7D" | "30D",
  currentDay: number,
): { name: string; calories: number; target: number }[] {
  const allMeals = getAllMealLogs();

  if (range === "TODAY") {
    // Show intake timeline throughout the day (hourly buckets)
    const hours = [
      { name: "06:00", calories: 0, target: 2400 },
      { name: "08:00", calories: 0, target: 2400 },
      { name: "10:00", calories: 0, target: 2400 },
      { name: "12:00", calories: 0, target: 2400 },
      { name: "14:00", calories: 0, target: 2400 },
      { name: "16:00", calories: 0, target: 2400 },
      { name: "18:00", calories: 0, target: 2400 },
      { name: "20:00", calories: 0, target: 2400 },
      { name: "22:00", calories: 0, target: 2400 },
    ];

    const todayMeals = allMeals.filter((m) => m.missionDay === currentDay);
    let cumulative = 0;

    for (const h of hours) {
      const hNum = parseInt(h.name.split(":")[0], 10);
      for (const m of todayMeals) {
        const mHour = parseInt(m.timeStr.split(":")[0], 10);
        if (mHour === hNum || (mHour < hNum && mHour >= hNum - 2)) {
          cumulative += m.calories;
        }
      }
      h.calories = cumulative;
    }

    // Ensure last point reflects current day total
    const daySummary = getDailyNutritionSummary(currentDay);
    hours[hours.length - 1].calories = Math.max(cumulative, daySummary.calories);
    return hours;
  }

  const daysCount = range === "7D" ? 7 : 30;
  const history: { name: string; calories: number; target: number }[] = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const day = Math.max(1, currentDay - i);
    const dayMeals = allMeals.filter((m) => m.missionDay === day);
    let sum = dayMeals.reduce((acc, m) => acc + m.calories, 0);

    // Provide deterministic realistic historical values if day was not explicitly logged
    if (sum === 0 && day !== currentDay) {
      const pseudoRand = Math.sin(day * 13.7) * 200;
      sum = Math.round(2100 + pseudoRand);
    } else if (day === currentDay) {
      sum = getDailyNutritionSummary(currentDay).calories;
    }

    history.push({
      name: `Day ${day}`,
      calories: sum,
      target: DEFAULT_TARGETS.dailyCalories,
    });
  }

  return history;
}

/**
 * Protein history for Recharts graphs with daily and weekly views.
 */
export function getProteinHistory(
  view: "DAILY" | "WEEKLY",
  currentDay: number,
): { name: string; protein: number; target: number }[] {
  const allMeals = getAllMealLogs();

  if (view === "DAILY") {
    // Last 7 days
    const result: { name: string; protein: number; target: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = Math.max(1, currentDay - i);
      const dayMeals = allMeals.filter((m) => m.missionDay === day);
      let sum = dayMeals.reduce((acc, m) => acc + m.protein, 0);

      if (sum === 0 && day !== currentDay) {
        const pseudoRand = Math.sin(day * 8.3) * 12;
        sum = Math.round(82 + pseudoRand);
      } else if (day === currentDay) {
        sum = getDailyNutritionSummary(currentDay).protein;
      }

      result.push({
        name: `Day ${day}`,
        protein: Math.round(sum),
        target: DEFAULT_TARGETS.dailyProtein,
      });
    }
    return result;
  }

  // WEEKLY view: 4 weeks
  const weeks = [
    { name: "W-4", protein: 84, target: DEFAULT_TARGETS.dailyProtein },
    { name: "W-3", protein: 89, target: DEFAULT_TARGETS.dailyProtein },
    { name: "W-2", protein: 78, target: DEFAULT_TARGETS.dailyProtein },
    {
      name: "Current",
      protein: Math.round(getDailyNutritionSummary(currentDay).protein),
      target: DEFAULT_TARGETS.dailyProtein,
    },
  ];
  return weeks;
}

/**
 * Deterministically simulates adding a meal event during simulation playback.
 */
export function simulateNextMeal(missionDay: number): MealLogEntry {
  const candidates: { foodId: string; type: "Breakfast" | "Lunch" | "Dinner" | "Snack" }[] = [
    { foodId: "protein-01", type: "Snack" },
    { foodId: "rehyd-03", type: "Lunch" },
    { foodId: "thermo-02", type: "Dinner" },
    { foodId: "bev-01", type: "Snack" },
    { foodId: "protein-02", type: "Snack" },
  ];

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const food = SPACE_FOOD_CATALOG.find((f) => f.id === pick.foodId) || SPACE_FOOD_CATALOG[0];

  return logMeal({
    mealType: pick.type,
    foodItemId: food.id,
    foodName: food.name,
    servingQuantity: 1,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    missionDay,
    notes: "Deterministic mission simulation auto-log",
    fromInventory: true,
  });
}
