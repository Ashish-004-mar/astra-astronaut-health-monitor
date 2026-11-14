import type { KnowledgeEntry } from "./types";
import { getDailyNutritionSummary, getMealLogs, getInventory } from "../services/nutritionService";
import { getTodayExerciseDuration, getCabinReadings, getCabinScenario } from "../services/hazardService";
import { getAquaGuardState, getTodayHydrationTotal } from "../services/aquaguardService";
import { audioAlertService } from "../services/audioAlertService";
import { useStore } from "../state/store";

export const nutritionHazardsKB: KnowledgeEntry[] = [
  // Nutrition - Calories
  {
    id: "nutr-01",
    category: "general",
    intent: "nutrition_calories_logged",
    questionEn: "How many calories have I logged today?",
    questionHi: "आज मैंने कितनी कैलोरी ली?",
    questionHinglish: ["aaj kitni calorie li", "total calories logged today", "calorie intake kitna hai"],
    keywords: ["calorie", "calories", "kcal", "intake", "energy", "कैलोरी", "ऊर्जा"],
    isDynamic: true,
    answerEn: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `Today on Mission Day ${state.mission.day}, you have logged ${s.calories} kcal out of your ${s.targets.dailyCalories} kcal planning target (${Math.round((s.calories / s.targets.dailyCalories) * 100)}%). Total meals recorded: ${s.mealsCount}.`;
    },
    answerHi: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `मिशन डे ${state.mission.day} पर आज आपने ${s.targets.dailyCalories} kcal के लक्ष्य में से ${s.calories} kcal दर्ज की है। कुल ${s.mealsCount} भोजन लॉग किए गए हैं।`;
    },
  },

  // Nutrition - Protein
  {
    id: "nutr-02",
    category: "activity",
    intent: "nutrition_protein_intake",
    questionEn: "How much protein have I consumed?",
    questionHi: "आज मैंने कितना प्रोटीन लिया?",
    questionHinglish: ["protein intake kitna hai", "how much protein logged", "aaj kitna protein khaya"],
    keywords: ["protein", "grams", "muscle", "प्रोटीन", "मांसपेशी"],
    isDynamic: true,
    answerEn: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `Your recorded protein intake for today is ${s.protein} grams against your daily countermeasure target of ${s.targets.dailyProtein} g (${Math.round((s.protein / s.targets.dailyProtein) * 100)}%). This directly supports postural muscle retention.`;
    },
    answerHi: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `आज आपने ${s.targets.dailyProtein} ग्राम के लक्ष्य में से ${s.protein} ग्राम प्रोटीन लिया है। यह माइक्रोग्रैविटी में मांसपेशियों के संरक्षण के लिए आवश्यक है।`;
    },
  },

  // Nutrition - Summary & Meals
  {
    id: "nutr-03",
    category: "general",
    intent: "nutrition_summary",
    questionEn: "Show my nutrition summary.",
    questionHi: "मेरी न्यूट्रिशन रिपोर्ट बताओ।",
    questionHinglish: ["nutrition summary batao", "diet report kya hai", "aaj kya khaya"],
    keywords: ["nutrition", "summary", "diet", "meals", "food", "भोजन", "आहार", "न्यूट्रिशन"],
    isDynamic: true,
    answerEn: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `Mission Nutrition Summary (Day ${state.mission.day}): ${s.calories} kcal, ${s.protein}g protein, ${s.carbs}g carbs, ${s.fat}g fat, and ${s.waterMl}mL hydration. Status: ${s.statusMessage}`;
    },
    answerHi: () => {
      const state = useStore.getState();
      const s = getDailyNutritionSummary(state.mission.day);
      return `मिशन न्यूट्रिशन सारांश (दिन ${state.mission.day}): ${s.calories} kcal, ${s.protein}g प्रोटीन, ${s.carbs}g कार्बोहाइड्रेट और ${s.waterMl}mL पानी। स्थिति: ${s.statusMessage}`;
    },
  },

  // Nutrition - Breakfast
  {
    id: "nutr-04",
    category: "general",
    intent: "nutrition_breakfast",
    questionEn: "What did I eat for breakfast?",
    questionHi: "आज मैंने नाश्ते में क्या खाया?",
    questionHinglish: ["breakfast me kya khaya", "what was my breakfast", "nashte me kya tha"],
    keywords: ["breakfast", "नाश्ता", "सुबह का खाना"],
    isDynamic: true,
    answerEn: () => {
      const state = useStore.getState();
      const bMeals = getMealLogs(state.mission.day).filter((m) => m.mealType === "Breakfast");
      if (bMeals.length === 0) return "No breakfast meal has been recorded yet for today.";
      const items = bMeals.map((m) => `${m.foodName} (${m.calories} kcal)`).join(", ");
      return `For breakfast on Day ${state.mission.day}, you logged: ${items}.`;
    },
    answerHi: () => {
      const state = useStore.getState();
      const bMeals = getMealLogs(state.mission.day).filter((m) => m.mealType === "Breakfast");
      if (bMeals.length === 0) return "आज के नाश्ते का कोई रिकॉर्ड अभी दर्ज नहीं है।";
      const items = bMeals.map((m) => `${m.foodName} (${m.calories} kcal)`).join(", ");
      return `दिन ${state.mission.day} के नाश्ते में आपने दर्ज किया: ${items}।`;
    },
  },

  // Nutrition - Inventory
  {
    id: "nutr-05",
    category: "help",
    intent: "nutrition_inventory_status",
    questionEn: "Which food items are running low?",
    questionHi: "कौन सा खाना कम हो रहा है?",
    questionHinglish: ["food stock low konsa hai", "galley inventory status", "low inventory items"],
    keywords: ["inventory", "stock", "running low", "stores", "स्टॉक", "इन्वेंटरी"],
    isDynamic: true,
    answerEn: () => {
      const inv = getInventory();
      const low = inv.filter((i) => i.quantityRemaining <= i.minThreshold);
      if (low.length === 0) return "All galley food packages are currently at nominal inventory levels.";
      const names = low.map((i) => `${i.name} (${i.quantityRemaining} remaining)`).join(", ");
      return `The following food packages are running low in the galley: ${names}. Restock when scheduled.`;
    },
    answerHi: () => {
      const inv = getInventory();
      const low = inv.filter((i) => i.quantityRemaining <= i.minThreshold);
      if (low.length === 0) return "किचन में सभी फूड पैकेट का स्टॉक सामान्य स्तर पर है।";
      const names = low.map((i) => `${i.name} (${i.quantityRemaining} बचे हैं)`).join(", ");
      return `गैली में इन पैकेट्स का स्टॉक कम है: ${names}।`;
    },
  },

  // NASA 5 Hazards
  {
    id: "haz-01",
    category: "space",
    intent: "nasa_five_hazards",
    questionEn: "What are NASA's five spaceflight hazards?",
    questionHi: "NASA के पाँच स्पेस रिस्क क्या हैं?",
    questionHinglish: ["nasa ke 5 hazards kya hain", "five human spaceflight risks", "5 space hazards"],
    keywords: ["five hazards", "hazards", "risks", "पांच खतरे", "रिस्क", "एचआरपी"],
    answerEn:
      "NASA's Human Research Program classifies spaceflight hazards into five categories: 1. Space Radiation, 2. Isolation and Confinement, 3. Distance from Earth, 4. Gravity Fields / Microgravity, and 5. Hostile/Closed Environments (abbreviated RIDGE). ASTRA tracks countermeasures across all five.",
    answerHi:
      "नासा के ह्यूमन रिसर्च प्रोग्राम के अनुसार अंतरिक्ष उड़ान के पाँच मुख्य खतरे हैं: 1. अंतरिक्ष विकिरण (Radiation), 2. अलगाव व संकीर्णता (Isolation), 3. पृथ्वी से दूरी (Distance), 4. परिवर्तित गुरुत्वाकर्षण (Gravity), और 5. बंद वातावरण (Closed Environments)। ASTRA इन सभी पर निगरानी रखता है।",
  },

  // Exercise & Muscle
  {
    id: "haz-02",
    category: "activity",
    intent: "exercise_logged_today",
    questionEn: "How much exercise have I logged today?",
    questionHi: "आज मैंने कितनी एक्सरसाइज की?",
    questionHinglish: ["aaj kitni exercise ki", "total exercise today", "workout duration"],
    keywords: ["exercise", "workout", "minutes", "व्यायाम", "कसरत"],
    isDynamic: true,
    answerEn: () => {
      const state = useStore.getState();
      const dur = getTodayExerciseDuration(state.mission.day);
      return `You have completed ${dur} minutes of physical exercise today toward the NASA 120-minute daily countermeasure reference (${Math.round((dur / 120) * 100)}%).`;
    },
    answerHi: () => {
      const state = useStore.getState();
      const dur = getTodayExerciseDuration(state.mission.day);
      return `आज आपने 120 मिनट के दैनिक काउंटरमेजर संदर्भ में से ${dur} मिनट की कसरत पूरी की है (${Math.round((dur / 120) * 100)}%)।`;
    },
  },

  // Cabin CO2
  {
    id: "haz-03",
    category: "space",
    intent: "cabin_co2_level",
    questionEn: "What is cabin CO2 level?",
    questionHi: "केबिन का CO2 कितना है?",
    questionHinglish: ["cabin co2 kitna hai", "carbon dioxide level in cabin", "eclss co2 status"],
    keywords: ["co2", "carbon dioxide", "cabin", "air", "सीओ2", "कार्बन डाइऑक्साइड"],
    isDynamic: true,
    answerEn: () => {
      const sc = getCabinScenario();
      const readings = getCabinReadings(sc);
      const curr = readings[readings.length - 1];
      return `Current simulated cabin CO2 is ${curr.co2Ppm} ppm (${curr.co2MmHg} mmHg). Habitat temperature: ${curr.temperatureC}°C, humidity: ${curr.humidityPct}%. Status: ${curr.status}.`;
    },
    answerHi: () => {
      const sc = getCabinScenario();
      const readings = getCabinReadings(sc);
      const curr = readings[readings.length - 1];
      return `केबिन में वर्तमान सिम्युलेटेड CO2 स्तर ${curr.co2Ppm} ppm (${curr.co2MmHg} mmHg) है। तापमान ${curr.temperatureC}°C और आर्द्रता ${curr.humidityPct}% है। स्थिति: ${curr.status}।`;
    },
  },

  // Offline Readiness
  {
    id: "haz-04",
    category: "help",
    intent: "offline_readiness_status",
    questionEn: "Is ASTRA ready for offline use?",
    questionHi: "क्या ASTRA बिना इंटरनेट काम कर सकता है?",
    questionHinglish: ["astra offline ready hai kya", "can astra work offline", "offline readiness"],
    keywords: ["offline", "disconnected", "internet", "ऑफलाइन", "इंटरनेट"],
    answerEn:
      "Yes. ASTRA is architected as an edge client application. All physiological models, 160+ knowledge entries, nutrition catalog, daily check-in storage, and vector PDF generators execute entirely on your device without cloud server calls.",
    answerHi:
      "हाँ, ASTRA पूरी तरह से ऑफलाइन काम करता है। सभी बायोएस्ट्रोनॉटिक्स मॉडल, 160+ नॉलेज बेस, न्यूट्रिशन कैटलॉग, और PDF रिपोर्ट बिना किसी क्लाउड सर्वर के आपके डिवाइस पर लोकली चलते हैं।",
  },

  // AquaGuard - Water Monitoring Status
  {
    id: "aqua-01",
    category: "space",
    intent: "water_monitoring_status",
    questionEn: "What is my water monitoring status?",
    questionHi: "मेरे पानी की निगरानी की स्थिति क्या है?",
    questionHinglish: ["water monitoring status kya hai", "aquaguard water status", "paani ka status kaisa hai", "water quality status"],
    keywords: ["water", "aquaguard", "monitoring", "quality", "potable", "eclss", "पानी", "जल", "क्वालिटी"],
    isDynamic: true,
    answerEn: () => {
      const state = getAquaGuardState();
      const latest = state.samples[0];
      if (!latest) return "No water quality samples available.";
      return `AquaGuard Water Monitoring Status is ${latest.status}. In-line TOC is ${latest.tocPpb} ppb against the 500 ppb NASA limit, conductivity is ${latest.conductivityUscm} µS/cm, and microbial culture status is ${latest.microbialStatus}. ECLSS WRS closed-loop recovery efficiency is currently ${state.recoveryEfficiencyPercent}%.`;
    },
    answerHi: () => {
      const state = getAquaGuardState();
      const latest = state.samples[0];
      if (!latest) return "कोई पानी परीक्षण डेटा उपलब्ध नहीं है।";
      return `एक्वागार्ड जल निगरानी स्थिति ${latest.status} है। इन-लाइन TOC ${latest.tocPpb} ppb (NASA सीमा 500 ppb), चालकता ${latest.conductivityUscm} µS/cm, और माइक्रोबियल स्थिति ${latest.microbialStatus} है। ECLSS रिकवरी दर ${state.recoveryEfficiencyPercent}% है।`;
    },
  },

  // AquaGuard - Water Logged Today
  {
    id: "aqua-02",
    category: "activity",
    intent: "water_logged_today",
    questionEn: "How much water have I logged today?",
    questionHi: "आज मैंने कितना पानी पिया है?",
    questionHinglish: ["aaj kitna paani piya", "how much water have i logged today", "hydration intake today kitna hai", "water logged today"],
    keywords: ["water", "logged", "hydration", "fluid", "ml", "drank", "drink", "पानी", "हाइड्रेशन"],
    isDynamic: true,
    answerEn: () => {
      const totalMl = getTodayHydrationTotal(147);
      const state = getAquaGuardState();
      const pct = Math.round((totalMl / state.targetHydrationMl) * 100);
      return `Today you have logged ${totalMl} mL of water out of your ${state.targetHydrationMl} mL mission hydration target (${pct}%). ${pct >= 80 ? "Hydration level is nominal." : "Consider consuming an additional 250mL pouch prior to sleep window."}`;
    },
    answerHi: () => {
      const totalMl = getTodayHydrationTotal(147);
      const state = getAquaGuardState();
      const pct = Math.round((totalMl / state.targetHydrationMl) * 100);
      return `आज आपने अपने ${state.targetHydrationMl} mL के लक्ष्य में से ${totalMl} mL पानी दर्ज किया है (${pct}%)। हाइड्रेशन बनाए रखने के लिए समय पर पानी पीते रहें।`;
    },
  },

  // AquaGuard - Is Spacecraft Water Safe?
  {
    id: "aqua-03",
    category: "space",
    intent: "water_safety_check",
    questionEn: "Is the spacecraft water safe to drink?",
    questionHi: "क्या अंतरिक्ष यान का पानी पीने के लिए सुरक्षित है?",
    questionHinglish: ["is spacecraft water safe to drink", "kya paani peene ke liye safe hai", "is water safe"],
    keywords: ["safe", "drink", "potable", "clean", "सुरक्षित", "पीने योग्य"],
    isDynamic: true,
    answerEn: () => {
      const state = getAquaGuardState();
      const latest = state.samples[0];
      if (latest && latest.status === "ATTENTION") {
        return `WARNING: Potable water is currently flagged under ${state.scenario} with status ATTENTION. Reason: ${latest.statusReason}. Procedural Directive: ${latest.proceduralNextStep}`;
      }
      return `NASA ECLSS safety protocol: In-line sensors show nominal chemistry (TOC ${latest ? latest.tocPpb : 240} ppb < 500 ppb). Note: Water is never assumed safe solely on TOC or conductivity; in-flight microbial cultures must also be verified.`;
    },
    answerHi: () => {
      const state = getAquaGuardState();
      const latest = state.samples[0];
      if (latest && latest.status === "ATTENTION") {
        return `चेतावनी: पानी को वर्तमान में ATTENTION स्थिति में ध्वजांकित किया गया है। निर्देश: ${latest.proceduralNextStep}`;
      }
      return `NASA ECLSS सुरक्षा प्रोटोकॉल: इन-लाइन सेंसर सामान्य रसायन शास्त्र दिखाते हैं। ध्यान दें: केवल TOC से पानी सुरक्षित नहीं माना जाता, माइक्रोबियल सत्यापन भी आवश्यक है।`;
    },
  },

  // AquaGuard - NASA TOC Limit
  {
    id: "aqua-04",
    category: "space",
    intent: "nasa_toc_limit",
    questionEn: "What is the NASA TOC limit for potable water?",
    questionHi: "पीने के पानी के लिए NASA TOC सीमा क्या है?",
    questionHinglish: ["what is nasa toc limit", "nasa toc limit kitni hai", "total organic carbon limit"],
    keywords: ["toc", "limit", "carbon", "ppb", "smcl", "कार्बन", "सीमा"],
    answerEn:
      "Per NASA Spacecraft Maximum Contaminant Levels (SMCL) and JSC Toxicology specifications, the potable water limit for Total Organic Carbon (TOC) is less than 500 parts per billion (ppb). Electrical conductivity must remain below 15 µS/cm at 25°C.",
    answerHi:
      "NASA अंतरिक्ष यान अधिकतम संदूषक स्तर (SMCL) के अनुसार, पीने के पानी के लिए कुल कार्बन (TOC) की सीमा 500 ppb (parts per billion) से कम है, और विद्युत चालकता 15 µS/cm से कम होनी चाहिए।",
  },

  // Audio Siren / Silence Control
  {
    id: "aqua-05",
    category: "help",
    intent: "silence_alarm",
    questionEn: "Silence alarm siren",
    questionHi: "अलार्म सायरन बंद करो",
    questionHinglish: ["silence alarm", "stop siren", "alarm band karo", "siren mute karo"],
    keywords: ["silence", "alarm", "siren", "mute", "stop", "अलार्म", "सायरन", "बंद"],
    isDynamic: true,
    answerEn: () => {
      audioAlertService.silenceAlarm();
      return "Alarm siren silenced. Caution state remains active in telemetry logs until hazard is resolved.";
    },
    answerHi: () => {
      audioAlertService.silenceAlarm();
      return "अलार्म सायरन बंद कर दिया गया है। खतरा दूर होने तक टेलीमेट्री में सावधानी स्थिति बनी रहेगी।";
    },
  },
];
