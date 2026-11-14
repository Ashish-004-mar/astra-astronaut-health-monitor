export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type FoodCategory =
  | "Rehydratable meals"
  | "Thermostabilized foods"
  | "Packaged snacks"
  | "Fruit-based foods"
  | "Protein-rich meals"
  | "Beverages";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  servingSize: string;
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  source: string;
  verified: boolean;
}

export interface MealLogEntry {
  id: string;
  mealType: MealType;
  foodItemId: string;
  foodName: string;
  servingQuantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  missionDay: number;
  timestamp: string; // ISO
  timeStr: string; // "07:30"
  notes?: string;
  fromInventory?: boolean;
}

export interface InventoryItem {
  id: string;
  foodItemId: string;
  name: string;
  category: FoodCategory;
  quantityRemaining: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  useByDate: string; // YYYY-MM-DD
  storageCategory: "Ambient Locker" | "Chilled Storage" | "Galley Rehydration";
  minThreshold: number;
}

export interface NutritionTargets {
  dailyCalories: number; // e.g. 2400 kcal
  dailyProtein: number; // e.g. 90 g
  dailyCarbs: number; // e.g. 300 g
  dailyFat: number; // e.g. 70 g
  dailyWater: number; // e.g. 2500 mL
}

export interface DailyNutritionSummary {
  missionDay: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  mealsCount: number;
  targets: NutritionTargets;
  status: "COMPLETE" | "BELOW_TARGET" | "INCOMPLETE";
  statusMessage: string;
  actionRecommendation: string;
}
