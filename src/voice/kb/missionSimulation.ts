import type { KnowledgeEntry } from "../types";

export const missionSimulationEntries: KnowledgeEntry[] = [
  {
    id: "ms-01",
    category: "simulation",
    intent: "current_mission_day",
    questionEn: "What day of the mission is it?",
    questionHi: "मिशन का कौन सा दिन चल रहा है?",
    questionHinglish: ["kaunsa mission day chal raha hai", "current mission day check", "mission day kitna hai"],
    keywords: ["day", "mission", "date", "clock", "hour", "samay", "din"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Current simulation time is Mission Day ${ctx.missionDay}, Hour ${String(((ctx.missionHour % 24) + 24) % 24).padStart(2, "0")}:00 UTC. Total elapsed mission duration is ${ctx.missionHour} simulated operational hours.`,
    answerHi: (ctx) =>
      `वर्तमान सिमुलेशन समय: मिशन दिवस ${ctx.missionDay}, समय ${String(((ctx.missionHour % 24) + 24) % 24).padStart(2, "0")}:00 UTC है। कुल बीता हुआ मिशन समय ${ctx.missionHour} सिमुलेटेड घंटे है।`,
  },
  {
    id: "ms-02",
    category: "simulation",
    intent: "active_simulation_scenario",
    questionEn: "Which mission scenario is currently active in the simulator?",
    questionHi: "सिम्युलेटर में वर्तमान में कौन सा परिदृश्य (Scenario) सक्रिय है?",
    questionHinglish: ["kaunsa scenario chal raha hai", "active simulation scenario astra"],
    keywords: ["scenario", "active", "simulation", "stress", "hypoxia", "nominal"],
    isDynamic: true,
    answerEn: (ctx) =>
      `The simulator is executing: "${ctx.scenarioName}". Biometric outputs and simulated circadian rhythms reflect this operational profile.`,
    answerHi: (ctx) =>
      `सिम्युलेटर वर्तमान में चला रहा है: "${ctx.scenarioName}"। आपकी बायोमेट्रिक रीडिंग और जैविक चक्र इसी परिदृश्य के अनुसार संचालित हो रहे हैं।`,
  },
  {
    id: "ms-03",
    category: "simulation",
    intent: "how_simulation_advances_time",
    questionEn: "How does the mission simulation engine advance time?",
    questionHi: "मिशन सिमुलेशन इंजन समय को आगे कैसे बढ़ाता है?",
    questionHinglish: ["simulation me time kaise aage badhta hai", "simulation engine clock tick"],
    keywords: ["simulation", "engine", "time", "clock", "tick", "step", "advance"],
    answerEn:
      "When running, the simulation engine generates a state update tick every 800 milliseconds, representing one elapsed mission hour. Biometric vitals (HR, SpO2, stress, activity) update dynamically, and nightly sleep records append at the 24-hour day transition.",
    answerHi:
      "चलने पर सिमुलेशन इंजन हर 800 मिलीसेकंड में एक नया घंटा जोड़ता है। इसमें हृदय गति, ऑक्सीजन, तनाव और गतिविधि के मान वास्तविक समय में बदलते हैं, और प्रत्येक 24 घंटे पूरे होने पर रात की नींद का नया रिकॉर्ड दर्ज होता है।",
  },
  {
    id: "ms-04",
    category: "simulation",
    intent: "nominal_operations_scenario",
    questionEn: "What is the Nominal Operations scenario?",
    questionHi: "नॉमिनल ऑपरेशन्स (Nominal Operations) परिदृश्य क्या है?",
    questionHinglish: ["nominal scenario kya hota hai", "nominal baseline operations space"],
    keywords: ["nominal", "scenario", "operations", "baseline", "standard"],
    answerEn:
      "Nominal Operations models a standard, healthy expedition day: heart rate fluctuates smoothly around 62 BPM, oxygen saturation stays above 97%, sleep duration averages 7.4 hours, and countermeasure workout goals are fully met.",
    answerHi:
      "नॉमिनल ऑपरेशन्स एक सामान्य, स्वस्थ मिशन दिवस का मॉडल है: हृदय गति 62 BPM के आसपास स्थिर रहती है, ऑक्सीजन 97% से अधिक रहती है, 7.4 घंटे की सामान्य नींद मिलती है और कसरत के सभी लक्ष्य पूरे होते हैं।",
  },
  {
    id: "ms-05",
    category: "simulation",
    intent: "high_stress_scenario_effects",
    questionEn: "What physiological changes happen in the High Stress scenario?",
    questionHi: "हाई स्ट्रेस (High Stress) परिदृश्य में क्या शारीरिक बदलाव होते हैं?",
    questionHinglish: ["high stress scenario me kya hota hai", "stress scenario physiological changes"],
    keywords: ["high", "stress", "scenario", "workload", "eva", "sympathetic"],
    answerEn:
      "The High Stress scenario simulates intense operational pressure (such as emergency spacewalks or docking anomalies). Heart rate elevates to 75-88 BPM, systemic stress scores surge to 70+, and nocturnal heart rate deceleration is attenuated.",
    answerHi:
      "हाई स्ट्रेस परिदृश्य अत्यधिक मिशन दबाव (जैसे आपातकालीन स्पेसवॉक) का अनुकरण करता है। इसमें हृदय गति 75-88 BPM तक बढ़ जाती है, तनाव स्कोर 70 के पार चला जाता है और रात में रिकवरी कम हो जाती है।",
  },
  {
    id: "ms-06",
    category: "simulation",
    intent: "sleep_deprivation_scenario_effects",
    questionEn: "How does the Sleep Deprivation scenario alter biometric trends?",
    questionHi: "स्लीप डिप्राइवेशन (नींद की कमी) परिदृश्य ट्रेंड्स को कैसे बदलता है?",
    questionHinglish: ["sleep deprivation scenario me kya badalta hai", "lack of sleep simulated trend"],
    keywords: ["sleep", "deprivation", "scenario", "deficit", "fatigue"],
    answerEn:
      "In the Sleep Deprivation scenario, nightly sleep drops to 4.2 to 5.0 hours, triggering cumulative sleep debt. Over subsequent days, daytime resting pulse drifts upward and the ASTRA engine raises an operational ATTENTION alert.",
    answerHi:
      "इस परिदृश्य में रात की नींद घटकर केवल 4.2 से 5.0 घंटे रह जाती है। लगातार नींद कम रहने से दिन की पल्स रेट बढ़ने लगती है और ASTRA इंजन थकान की आधिकारिक चेतावनी (ATTENTION) जारी करता है।",
  },
  {
    id: "ms-07",
    category: "simulation",
    intent: "hypoxia_co2_scenario_effects",
    questionEn: "What occurs during the Cabin Hypoxia / Elevated CO2 scenario?",
    questionHi: "केबिन हाइपोक्सिया / अधिक CO2 परिदृश्य में क्या होता है?",
    questionHinglish: ["hypoxia scenario me kya hota hai", "cabin co2 hypoxia simulation"],
    keywords: ["hypoxia", "co2", "scenario", "spo2", "scrubber", "oxygen"],
    answerEn:
      "This scenario models life-support scrubber degradation. Arterial SpO2 drops to 92-94%, compensatory heart rate climbs by 10 BPM, and the astronaut logs dull frontal headaches and reduced physical energy.",
    answerHi:
      "यह लाइफ-सपोर्ट सिस्टम में खराबी का सिमुलेशन है। इसमें ऑक्सीजन सेचुरेशन (SpO2) घटकर 92-94% हो जाता है, फेफड़ों की भरपाई के लिए दिल तेज धड़कने लगता है और सिरदर्द की शिकायत दर्ज होती है।",
  },
  {
    id: "ms-08",
    category: "simulation",
    intent: "musculoskeletal_deconditioning_scenario",
    questionEn: "What is the Microgravity Deconditioning scenario?",
    questionHi: "माइक्रोग्रैविटी डीकंडीशनिंग (Deconditioning) परिदृश्य क्या है?",
    questionHinglish: ["deconditioning scenario kya hota hai", "muscle deconditioning simulation"],
    keywords: ["deconditioning", "musculoskeletal", "scenario", "atrophy", "exercise"],
    answerEn:
      "This profile simulates equipment breakdown on workout devices (e.g. ARED out of service). Daily activity scores plummet below 35, muscle tone diminishes, and cardiovascular exercise capacity displays progressive decay over consecutive days.",
    answerHi:
      "यह कसरत के उपकरण खराब होने का सिमुलेशन है। इसमें दैनिक एक्टिविटी स्कोर 35 से नीचे गिर जाता है, मांसपेशियों की ताकत घटने लगती है और कार्डियोवैस्कुलर क्षमता में लगातार गिरावट दिखाई देती है।",
  },
  {
    id: "ms-09",
    category: "simulation",
    intent: "how_to_control_simulation",
    questionEn: "How do I pause, run, or reset the mission simulation?",
    questionHi: "मैं मिशन सिमुलेशन को रोक (Pause), चालू (Run) या रीसेट कैसे करूँ?",
    questionHinglish: ["simulation pause run kaise kare", "simulation control buttons astra"],
    keywords: ["pause", "run", "reset", "control", "buttons", "toggle"],
    answerEn:
      "You can toggle simulation playback using the 'Play / Pause' button located in the bottom Simulation Control bar on the Overview screen, switch scenarios using the scenario dropdown, or click 'Reset' to return to baseline Day 147.",
    answerHi:
      "आप ओवरव्यू स्क्रीन के सबसे नीचे मौजूद सिमुलेशन कंट्रोल बार में 'Play / Pause' बटन दबाकर समय रोक या चालू कर सकते हैं, ड्रॉपडाउन से परिदृश्य बदल सकते हैं या 'Reset' बटन से वापस बेसलाइन दिन 147 पर जा सकते हैं।",
  },
  {
    id: "ms-10",
    category: "simulation",
    intent: "jump_to_specific_day",
    questionEn: "Can I jump to a specific mission day in the simulator?",
    questionHi: "क्या मैं सिम्युलेटर में किसी विशिष्ट मिशन दिन पर जा सकता हूँ?",
    questionHinglish: ["kya kisi specific mission day pe ja sakte hai", "jump to day in simulator"],
    keywords: ["jump", "day", "specific", "timeline", "history", "selector"],
    answerEn:
      "You can select any historical mission day in the Daily Health Report drawer to inspect that specific day's biometrics and check-in logs, while the live simulator maintains continuous chronological progression.",
    answerHi:
      "आप दैनिक स्वास्थ्य रिपोर्ट पैनल में जाकर किसी भी पिछले मिशन दिन को चुनकर उसके आंकड़े और चेक-इन देख सकते हैं, जबकि मुख्य सिमुलेटर समय के अनुसार आगे बढ़ता रहता है।",
  },
  {
    id: "ms-11",
    category: "simulation",
    intent: "hourly_telemetry_generation",
    questionEn: "How does ASTRA generate realistic hourly telemetry?",
    questionHi: "ASTRA प्रति घंटे का वास्तविक दिखने वाला टेलीमेट्री डेटा कैसे बनाता है?",
    questionHinglish: ["astra hourly telemetry kaise banata hai", "telemetry math formula astra"],
    keywords: ["hourly", "telemetry", "generation", "math", "stochastic", "circadian"],
    answerEn:
      "Telemetry values are calculated using sinusoidal circadian functions combined with stochastic Brownian walks and active scenario offsets. This ensures physiological curves mirror genuine human biological variability without repeating static loops.",
    answerHi:
      "टेलीमेट्री मान जैविक साइन तरंगों (Sinusoidal Waves), यादृच्छिक शारीरिक उतार-चढ़ाव और सक्रिय परिदृश्य के प्रभावों को जोड़कर तैयार किए जाते हैं। इससे आंकड़े पूरी तरह वास्तविक इंसानी धड़कन और सांस जैसे दिखाई देते हैं।",
  },
  {
    id: "ms-12",
    category: "simulation",
    intent: "stochastic_noise_purpose",
    questionEn: "Why does the simulation include stochastic random noise in vitals?",
    questionHi: "सिमुलेशन में वाइटल्स में यादृच्छिक उतार-चढ़ाव (Random Noise) क्यों शामिल है?",
    questionHinglish: ["vitals me random noise kyu hoti hai", "stochastic noise in biometric telemetry"],
    keywords: ["stochastic", "noise", "random", "variability", "realistic"],
    answerEn:
      "Living biological organisms never produce perfectly flat, straight lines. Real human physiology exhibits natural autonomic micro-fluctuations and sensor contact resistance. Including stochastic variance trains astronauts and flight controllers to distinguish benign noise from true clinical trends.",
    answerHi:
      "जीवित शरीर की धड़कन कभी भी सीधी लकीर नहीं होती। इसमें हमेशा सूक्ष्म उतार-चढ़ाव होते हैं। यह यादृच्छिक हलचल सिमुलेशन को सजीव बनाती है ताकि अंतरिक्ष यात्री सामान्य हलचल और वास्तविक बीमारी के फर्क को पहचान सकें।",
  },
  {
    id: "ms-13",
    category: "simulation",
    intent: "simulation_history_persistence",
    questionEn: "How does the simulation engine persist history across sessions?",
    questionHi: "सिमुलेशन इंजन ब्राउज़र बंद होने पर भी डेटा कैसे सुरक्षित रखता है?",
    questionHinglish: ["simulation history save kaise hoti hai", "browser session data persistence"],
    keywords: ["persist", "history", "localstorage", "session", "save", "storage"],
    answerEn:
      "ASTRA utilizes browser LocalStorage and state synchronization to persist your simulated mission timeline, past check-ins, and multi-day telemetry. Reloading or reopening the app restores your exact mission day without data loss.",
    answerHi:
      "ASTRA ब्राउज़र के लोकल स्टोरेज (LocalStorage) का उपयोग करता है। इसलिए पेज रीलोड करने या बाद में दोबारा खोलने पर भी आपका मिशन दिन, पिछले दिनों का डेटा और चेक-इन रिकॉर्ड सुरक्षित रहते हैं।",
  },
  {
    id: "ms-14",
    category: "simulation",
    intent: "purpose_of_scenarios_training",
    questionEn: "What is the purpose of running simulated scenarios before spaceflight?",
    questionHi: "अंतरिक्ष उड़ान से पहले इन परिदृश्यों का अभ्यास करने का क्या उद्देश्य है?",
    questionHinglish: ["simulation scenario practice se kya fayda hota hai", "astronaut simulation training purpose"],
    keywords: ["purpose", "training", "scenarios", "astronaut", "preparation", "readiness"],
    answerEn:
      "Scenarios train astronauts to develop instinctive biometric self-awareness. Recognizing the early physiological signatures of fatigue, CO2 buildup, or dehydration allows proactive countermeasure deployment days before severe performance degradation occurs.",
    answerHi:
      "इन परिदृश्यों के अभ्यास से अंतरिक्ष यात्री अपने शरीर के सूक्ष्म संकेतों को पहचानना सीखते हैं। थकान या CO2 बढ़ने के शुरुआती लक्षणों को समय पर पहचान लेने से वे बड़ी गलतियों से बच सकते हैं।",
  },
  {
    id: "ms-15",
    category: "simulation",
    intent: "flight_surgeon_alert_simulation",
    questionEn: "How does ASTRA alert the flight surgeon when a scenario triggers an alert?",
    questionHi: "सिमुलेशन में चेतावनी आने पर ASTRA फ्लाइट सर्जन को कैसे सचेत करता है?",
    questionHinglish: ["flight surgeon alert kaise hota hai simulation me", "attention alert flight surgeon"],
    keywords: ["flight", "surgeon", "alert", "attention", "banner", "action"],
    answerEn:
      "When criteria cross into ATTENTION status, ASTRA renders an amber attention banner across the Overview dashboard, logs specific physiological deviations into the Today's Status card, and automatically includes the warning in daily PDF report exports.",
    answerHi:
      "जब स्थिति ATTENTION में बदलती है, तो ASTRA ओवरव्यू स्क्रीन पर एम्बर रंग की चेतावनी पट्टी दिखाता है, 'Today's Status' कार्ड में कारण दर्ज करता है और दैनिक पीडीएफ रिपोर्ट में इस चेतावनी को प्रमुखता से शामिल करता है।",
  },
];
