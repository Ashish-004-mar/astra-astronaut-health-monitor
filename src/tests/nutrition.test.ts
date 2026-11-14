import { describe, it, expect, beforeEach } from "vitest";
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
  DEFAULT_TARGETS,
} from "../services/nutritionService";

describe("ASTRA Nutrition Module Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("contains 30 illustrative NASA-inspired space food items", () => {
    expect(SPACE_FOOD_CATALOG.length).toBe(30);
    const categories = new Set(SPACE_FOOD_CATALOG.map((f) => f.category));
    expect(categories.size).toBe(6);
    expect(categories.has("Rehydratable meals")).toBe(true);
    expect(categories.has("Thermostabilized foods")).toBe(true);
    expect(categories.has("Packaged snacks")).toBe(true);
    expect(categories.has("Fruit-based foods")).toBe(true);
    expect(categories.has("Protein-rich meals")).toBe(true);
    expect(categories.has("Beverages")).toBe(true);
  });

  it("calculates daily nutrition summary accurately from meal records", () => {
    const summary = getDailyNutritionSummary(147);
    expect(summary.calories).toBeGreaterThan(1000);
    expect(summary.protein).toBeGreaterThan(50);
    expect(summary.carbs).toBeGreaterThan(100);
    expect(summary.fat).toBeGreaterThan(30);
    expect(summary.waterMl).toBeGreaterThan(1500);
    expect(summary.status).toMatch(/COMPLETE|BELOW_TARGET|INCOMPLETE/);
  });

  it("accurately logs a new meal and updates totals and inventory", () => {
    const initialSummary = getDailyNutritionSummary(147);
    const initialCalories = initialSummary.calories;
    const initialProtein = initialSummary.protein;

    const logged = logMeal({
      mealType: "Snack",
      foodItemId: "protein-01",
      foodName: "Whey Protein Vanilla Shake",
      servingQuantity: 1,
      calories: 180,
      protein: 30,
      carbs: 5,
      fat: 2,
      missionDay: 147,
      fromInventory: true,
    });

    expect(logged.id).toBeDefined();

    const updatedSummary = getDailyNutritionSummary(147);
    expect(updatedSummary.calories).toBe(initialCalories + 180);
    expect(updatedSummary.protein).toBe(initialProtein + 30);

    // Verify deletion
    deleteMeal(logged.id);
    const afterDelete = getDailyNutritionSummary(147);
    expect(afterDelete.calories).toBe(initialCalories);
  });

  it("produces valid calorie and protein history series for graphs", () => {
    const todayCal = getCalorieHistory("TODAY", 147);
    expect(todayCal.length).toBeGreaterThan(5);

    const weekCal = getCalorieHistory("7D", 147);
    expect(weekCal.length).toBe(7);

    const monthCal = getCalorieHistory("30D", 147);
    expect(monthCal.length).toBe(30);

    const dailyProtein = getProteinHistory("DAILY", 147);
    expect(dailyProtein.length).toBe(7);

    const weeklyProtein = getProteinHistory("WEEKLY", 147);
    expect(weeklyProtein.length).toBe(4);
  });

  it("maintains inventory stock limits and supports restocking", () => {
    const inv = getInventory();
    expect(inv.length).toBeGreaterThan(5);

    restockInventory();
    const restocked = getInventory();
    for (const item of restocked) {
      expect(item.quantityRemaining).toBeGreaterThanOrEqual(item.minThreshold);
    }
  });
});
