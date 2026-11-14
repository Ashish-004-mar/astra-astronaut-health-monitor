import type { KnowledgeEntry } from "../types";

export const personalBaselineEntries: KnowledgeEntry[] = [
  {
    id: "pb-01",
    category: "baseline",
    intent: "compare_vitals_baseline",
    questionEn: "Compare my vitals with my personal baselines.",
    questionHi: "मेरे वाइटल्स की व्यक्तिगत बेसलाइन से तुलना करें।",
    questionHinglish: ["baseline se tulna karo", "vitals compare to baseline", "compare my health to normal"],
    keywords: ["compare", "vitals", "baseline", "variance", "tulna", "differences"],
    isDynamic: true,
    answerEn: (ctx) => {
      const hrDiff = ctx.hr - ctx.baselineHr;
      const spo2Diff = ctx.spo2 - ctx.baselineSpo2;
      const stressDiff = ctx.stress - ctx.baselineStress;
      const sleepDiff = Math.round((ctx.sleep - ctx.baselineSleep) * 10) / 10;
      const actDiff = ctx.activity - ctx.baselineActivity;
      return `Baseline telemetry comparison: Heart Rate is ${ctx.hr} BPM (${hrDiff >= 0 ? "+" : ""}${hrDiff} BPM). SpO2 is ${ctx.spo2}% (${spo2Diff >= 0 ? "+" : ""}${spo2Diff}%). Last Sleep was ${ctx.sleep}h (${sleepDiff >= 0 ? "+" : ""}${sleepDiff}h). Stress index is ${ctx.stress}/100 (${stressDiff >= 0 ? "+" : ""}${stressDiff}). Activity score is ${ctx.activity}/100 (${actDiff >= 0 ? "+" : ""}${actDiff}). Overall state is ${ctx.healthStatus}.`;
    },
    answerHi: (ctx) => {
      const hrDiff = ctx.hr - ctx.baselineHr;
      const spo2Diff = ctx.spo2 - ctx.baselineSpo2;
      const stressDiff = ctx.stress - ctx.baselineStress;
      const sleepDiff = Math.round((ctx.sleep - ctx.baselineSleep) * 10) / 10;
      return `बेसलाइन तुलना: हृदय गति ${ctx.hr} BPM (${hrDiff >= 0 ? "+" : ""}${hrDiff}), SpO2 ${ctx.spo2}% (${spo2Diff >= 0 ? "+" : ""}${spo2Diff}%), नींद ${ctx.sleep} घंटे (${sleepDiff >= 0 ? "+" : ""}${sleepDiff}h), और तनाव सूचकांक ${ctx.stress}/100 (${stressDiff >= 0 ? "+" : ""}${stressDiff}) है। समग्र स्थिति: ${ctx.healthStatus === "NOMINAL" ? "सामान्य" : "ध्यानाकर्षण"}।`;
    },
  },
  {
    id: "pb-02",
    category: "baseline",
    intent: "how_baseline_established",
    questionEn: "How is my resting heart rate baseline established?",
    questionHi: "मेरी रेस्टिंग हार्ट रेट बेसलाइन कैसे तय की जाती है?",
    questionHinglish: ["heart rate baseline kaise banti hai", "baseline establishment calculation"],
    keywords: ["baseline", "established", "calculated", "resting", "methodology"],
    answerEn:
      "Baselines are established using rolling multi-day medians during quiet resting periods, specifically filtering out vigorous exercise, post-workout recovery, and acute movement transients. This prevents strenuous EVA preparations or workouts from skewing your true cardiovascular resting reference.",
    answerHi:
      "आपकी रेस्टिंग बेसलाइन शांत विश्राम अवधि के दौरान दर्ज किए गए आंकड़ों के रोलिंग माध्यिका (Median) से तय की जाती है। इसमें कसरत या अतिरिक्त शारीरिक मेहनत के दौरान बढ़े हुए आंकड़ों को अलग रखा जाता है ताकि वास्तविक विश्राम स्तर का सही पता चले।",
  },
  {
    id: "pb-03",
    category: "baseline",
    intent: "baseline_hr_value",
    questionEn: "What is my personal baseline for heart rate?",
    questionHi: "हृदय गति के लिए मेरी व्यक्तिगत बेसलाइन क्या है?",
    questionHinglish: ["meri hr baseline kitni hai", "personal baseline heart rate value"],
    keywords: ["baseline", "heart", "rate", "hr", "value", "target"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your calibrated resting heart rate baseline is ${ctx.baselineHr} BPM. Current reading is ${ctx.hr} BPM, which is ${Math.abs(ctx.hr - ctx.baselineHr)} BPM ${ctx.hr >= ctx.baselineHr ? "above" : "below"} your baseline reference.`,
    answerHi: (ctx) =>
      `आपकी कैलिब्रेटेड रेस्टिंग हार्ट रेट बेसलाइन ${ctx.baselineHr} BPM है। वर्तमान रीडिंग ${ctx.hr} BPM है, जो आपके बेसलाइन संदर्भ से ${Math.abs(ctx.hr - ctx.baselineHr)} BPM ${ctx.hr >= ctx.baselineHr ? "अधिक" : "कम"} है।`,
  },
  {
    id: "pb-04",
    category: "baseline",
    intent: "baseline_spo2_value",
    questionEn: "What is my personal baseline for SpO2?",
    questionHi: "SpO2 (ऑक्सीजन) के लिए मेरी व्यक्तिगत बेसलाइन क्या है?",
    questionHinglish: ["spo2 baseline kya hai", "oxygen personal baseline"],
    keywords: ["baseline", "spo2", "oxygen", "percentage", "saturation"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your personal peripheral oxygen saturation baseline is established at ${ctx.baselineSpo2}%. The current reading of ${ctx.spo2}% reflects a delta of ${ctx.spo2 - ctx.baselineSpo2}%.`,
    answerHi: (ctx) =>
      `आपका व्यक्तिगत ऑक्सीजन सेचुरेशन बेसलाइन ${ctx.baselineSpo2}% पर निर्धारित है। वर्तमान रीडिंग ${ctx.spo2}% है, जो बेसलाइन से ${ctx.spo2 - ctx.baselineSpo2}% का अंतर दर्शाती है।`,
  },
  {
    id: "pb-05",
    category: "baseline",
    intent: "baseline_sleep_value",
    questionEn: "What is my baseline for sleep duration?",
    questionHi: "नींद की अवधि के लिए मेरी व्यक्तिगत बेसलाइन क्या है?",
    questionHinglish: ["sleep baseline kitne ghante hai", "baseline sleep duration"],
    keywords: ["baseline", "sleep", "duration", "hours", "night"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your personal target sleep duration baseline is ${ctx.baselineSleep} hours per 24-hour mission circadian cycle. Last night you achieved ${ctx.sleep} hours.`,
    answerHi: (ctx) =>
      `24 घंटे के मिशन चक्र में आपकी व्यक्तिगत नींद का बेसलाइन लक्ष्य ${ctx.baselineSleep} घंटे है। पिछली रात आपने ${ctx.sleep} घंटे की नींद दर्ज की।`,
  },
  {
    id: "pb-06",
    category: "baseline",
    intent: "baseline_stress_value",
    questionEn: "What is my baseline for daily stress index?",
    questionHi: "दैनिक तनाव सूचकांक के लिए मेरी बेसलाइन क्या है?",
    questionHinglish: ["stress baseline kya hai", "baseline stress index"],
    keywords: ["baseline", "stress", "index", "score"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your nominal resting stress baseline is calibrated at ${ctx.baselineStress} out of 100. Today's current stress score is registered at ${ctx.stress}.`,
    answerHi: (ctx) =>
      `आपका सामान्य विश्राम तनाव बेसलाइन 100 में से ${ctx.baselineStress} है। आज का वर्तमान तनाव स्कोर ${ctx.stress} दर्ज किया गया है।`,
  },
  {
    id: "pb-07",
    category: "baseline",
    intent: "baseline_activity_value",
    questionEn: "What is my baseline for physical activity?",
    questionHi: "शारीरिक गतिविधि के लिए मेरी व्यक्तिगत बेसलाइन क्या है?",
    questionHinglish: ["activity baseline kya hai", "baseline activity score"],
    keywords: ["baseline", "activity", "movement", "score"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your daily physical countermeasure activity baseline is ${ctx.baselineActivity} out of 100. Your current activity level is ${ctx.activity}/100.`,
    answerHi: (ctx) =>
      `आपका दैनिक शारीरिक व्यायाम और गतिविधि का बेसलाइन लक्ष्य 100 में से ${ctx.baselineActivity} है। वर्तमान स्तर ${ctx.activity}/100 है।`,
  },
  {
    id: "pb-08",
    category: "baseline",
    intent: "why_baselines_superior",
    questionEn: "Why are personal baselines superior to generic population averages?",
    questionHi: "व्यक्तिगत बेसलाइन सामान्य औसत की तुलना में बेहतर क्यों हैं?",
    questionHinglish: ["personal baseline generic average se better kyu hai", "why personalized baselines"],
    keywords: ["personal", "baselines", "population", "averages", "superior", "individual"],
    answerEn:
      "Astronauts are elite athletes with unique cardiac phenotypes. A resting pulse of 52 BPM may represent normal endurance fitness for one crewmember but bradycardia in another. Individual baselines eliminate false alarms and detect subtle physiological deterioration relative to each astronaut's personal homeostatic norm.",
    answerHi:
      "प्रत्येक अंतरिक्ष यात्री की शारीरिक संरचना और फिटनेस अलग होती है। किसी एथलीट के लिए 52 BPM का पल्स सामान्य हो सकता है जबकि दूसरे के लिए असामान्य। व्यक्तिगत बेसलाइन झूठे अलार्म से बचाती है और वास्तविक थकान को तुरंत पहचानती है।",
  },
  {
    id: "pb-09",
    category: "baseline",
    intent: "calibration_period_days",
    questionEn: "How many days of data are needed to calibrate a stable baseline?",
    questionHi: "एक स्थिर बेसलाइन कैलिब्रेट करने के लिए कितने दिनों का डेटा चाहिए?",
    questionHinglish: ["baseline calibrate hone me kitne din lagte hai", "calibration period days astra"],
    keywords: ["calibrate", "calibration", "days", "period", "stable", "history"],
    answerEn:
      "ASTRA utilizes a rolling 5 to 7 day initialization window to calibrate stable baseline medians. During initial orbital deployment, pre-flight terrestrial L-30 baseline parameters serve as seeds until sufficient in-flight adaptation metrics accumulate.",
    answerHi:
      "ASTRA स्थिर बेसलाइन तय करने के लिए 5 से 7 दिनों के रोलिंग डेटा का उपयोग करता है। अंतरिक्ष में पहुंचने पर शुरुआती दिनों में पृथ्वी के प्री-फ्लाइट मेडिकल डेटा का आधार लिया जाता है जब तक कि नया ऑर्बिटल डेटा पर्याप्त न हो जाए।",
  },
  {
    id: "pb-10",
    category: "baseline",
    intent: "attention_signal_triggers",
    questionEn: "What triggers an ATTENTION signal in ASTRA?",
    questionHi: "ASTRA में ATTENTION (ध्यानाकर्षण) सिग्नल किस कारण सक्रिय होता है?",
    questionHinglish: ["attention signal kab trigger hota hai", "attention status criteria astra"],
    keywords: ["attention", "signal", "trigger", "criteria", "rules", "algorithm"],
    answerEn:
      "An ATTENTION status is triggered when multi-day signals deviate concordantly: for instance, when resting heart rate exceeds baseline by 8+ BPM across 3 hours, sleep falls below 5.5 hours over consecutive nights, SpO2 dips below 94%, or combined stress index exceeds 65. Isolated transients do not trigger warnings.",
    answerHi:
      "ATTENTION सिग्नल तब सक्रिय होता है जब कई संकेत लगातार बिगड़ें: जैसे लगातार 3 घंटे हार्ट रेट 8+ BPM अधिक रहना, लगातार दो रातों में नींद 5.5 घंटे से कम होना, SpO2 94% से नीचे जाना, या तनाव सूचकांक 65 पार कर जाना।",
  },
  {
    id: "pb-11",
    category: "baseline",
    intent: "single_outlier_impact",
    questionEn: "Can a single outlier reading trigger a health alert?",
    questionHi: "क्या कोई एक असामान्य रीडिंग तुरंत स्वास्थ्य चेतावनी दे सकती है?",
    questionHinglish: ["kya ek reading se alert aa jata hai", "single outlier trigger warning"],
    keywords: ["single", "outlier", "spike", "false", "alarm", "noise"],
    answerEn:
      "No. Aerospace biometrics are naturally prone to motion artifacts, sensor displacement, and momentary exertion spikes. ASTRA applies temporal median filters and persistence rules requiring sustained drift before raising an operational attention banner.",
    answerHi:
      "नहीं। अंतरिक्ष में सेंसर के हिलने या अचानक शारीरिक हलचल से किसी एक रीडिंग में उतार-चढ़ाव आ सकता है। ASTRA में लगातार कई रीडिंग के औसत की पुष्टि के बाद ही चेतावनी जारी की जाती है ताकि झूठे अलार्म न बजें।",
  },
  {
    id: "pb-12",
    category: "baseline",
    intent: "circadian_variations_baseline",
    questionEn: "How does ASTRA handle diurnal circadian variations in baseline calculation?",
    questionHi: "ASTRA बेसलाइन में दिन-रात के सर्कैडियन चक्र का ध्यान कैसे रखता है?",
    questionHinglish: ["circadian variation baseline astra", "day night rhythm biological clock"],
    keywords: ["circadian", "diurnal", "rhythm", "cycle", "biological", "clock"],
    answerEn:
      "Biometrics vary systematically across circadian phases—heart rate naturally drops during nocturnal rest and peaks during mid-afternoon work cycles. ASTRA bins telemetry by subjective mission mission-clock hours, comparing diurnal readings against matching circadian time-windows.",
    answerHi:
      "मानव शरीर में हृदय गति और तापमान दिन में अधिक और रात में स्वाभाविक रूप से कम होते हैं। ASTRA 24 घंटे के चक्र को समय-अंतरालों में बांटता है और दिन के आंकड़ों की तुलना दिन के बेसलाइन से तथा रात के आंकड़ों की रात से करता है।",
  },
  {
    id: "pb-13",
    category: "baseline",
    intent: "cumulative_stress_signal",
    questionEn: "What is a cumulative stress signal?",
    questionHi: "संचयी तनाव संकेत (Cumulative Stress Signal) क्या है?",
    questionHinglish: ["cumulative stress signal kya hota hai", "chronic stress tracking in space"],
    keywords: ["cumulative", "stress", "signal", "chronic", "fatigue", "allostatic"],
    answerEn:
      "A cumulative stress signal tracks allostatic physiological load over time. Rather than assessing immediate momentary tension, it measures the compounding friction of sustained high workload, incomplete nocturnal recovery, elevated resting pulse, and unmitigated cabin environmental friction.",
    answerHi:
      "संचयी तनाव संकेत शरीर पर लगातार पड़ रहे कुल दबाव को मापता है। यह केवल एक पल के तनाव को नहीं, बल्कि कई दिनों की कम नींद, भारी कार्यभार और केबिन के माहौल से शरीर की रिकवरी में आई निरंतर कमी को दर्शाता है।",
  },
  {
    id: "pb-14",
    category: "baseline",
    intent: "signal_confidence_scoring",
    questionEn: "How does ASTRA compute signal confidence?",
    questionHi: "ASTRA बायोमेट्रिक सिग्नल की विश्वसनीयता (Confidence) कैसे निकालता है?",
    questionHinglish: ["signal confidence score kaise banta hai", "data quality confidence astra"],
    keywords: ["confidence", "score", "signal", "quality", "provenance", "reliability"],
    answerEn:
      "Signal confidence combines three factors: sensor contact stability (signal-to-noise ratio), historical variance stability, and cross-channel sensor agreement. Telemetry confirmed across multiple physiological streams receives high confidence status.",
    answerHi:
      "सिग्नल विश्वसनीयता तीन बातों पर निर्भर करती है: सेंसर का त्वचा से संपर्क, डेटा में उतार-चढ़ाव की स्थिरता, और विभिन्न सेंसरों (जैसे पल्स और ऑक्सीजन) के बीच तालमेल। सभी आंकड़े सही मिलने पर इसे उच्च विश्वसनीयता दी जाती है।",
  },
  {
    id: "pb-15",
    category: "baseline",
    intent: "separate_resting_exercise",
    questionEn: "Why does ASTRA separate resting readings from exercise telemetry?",
    questionHi: "ASTRA व्यायाम और विश्राम के टेलीमेट्री डेटा को अलग क्यों रखता है?",
    questionHinglish: ["exercise aur rest data alag kyu hota hai", "resting vs workout telemetry"],
    keywords: ["exercise", "resting", "telemetry", "workout", "ared", "treadmill"],
    answerEn:
      "Exercise demands heart rates of 130 to 170 BPM to stimulate cardiovascular and skeletal preservation. Blending high-intensity exercise data with resting baseline arrays would artificially distort baseline thresholds and mask genuine resting cardiovascular drift.",
    answerHi:
      "कसरत के समय हृदय गति 130 से 170 BPM तक पहुंच जाती है। यदि कसरत के डेटा को विश्राम के आंकड़ों में मिला दिया जाए, तो सामान्य बेसलाइन बिगड़ जाएगी और बीमारी या थकान के वास्तविक लक्षणों की पहचान नहीं हो पाएगी।",
  },
  {
    id: "pb-16",
    category: "baseline",
    intent: "baseline_recalibration_mission",
    questionEn: "How does baseline recalibration occur during multi-month missions?",
    questionHi: "महीनों लंबे मिशनों में बेसलाइन पुनः अनुकूलन (Recalibration) कैसे होता है?",
    questionHinglish: ["long mission baseline recalibration kaise hoti hai", "updating baseline over months"],
    keywords: ["recalibration", "months", "adaptation", "shift", "long-duration"],
    answerEn:
      "As the cardiovascular and muscular systems adapt to prolonged microgravity, baseline resting values undergo expected physiological drifts. ASTRA adapts using an exponential moving average weighting recent quiet days while preserving mission-start reference markers.",
    answerHi:
      "महीनों तक अंतरिक्ष में रहने पर शरीर भारहीनता के अनुकूल ढल जाता है जिससे सामान्य मानों में थोड़ा बदलाव आता है। ASTRA एक घातीय चलती औसत (Exponential Moving Average) का उपयोग करता है जिससे बेसलाइन धीरे-धीरे नए सामान्य स्तर के अनुसार समायोजित हो जाती है।",
  },
  {
    id: "pb-17",
    category: "baseline",
    intent: "positive_adaptation_markers",
    questionEn: "What indicates positive physiological adaptation in my trend lines?",
    questionHi: "मेरे ट्रेंड चार्ट में सकारात्मक अनुकूलन के क्या लक्षण दिखाई देते हैं?",
    questionHinglish: ["positive adaptation signs in health chart", "achha adaptation kaise pehchane"],
    keywords: ["positive", "adaptation", "improvement", "recovery", "stability", "trends"],
    answerEn:
      "Positive adaptation is evidenced by rapid heart rate recovery following daily workouts, stable nocturnal SpO2 above 96%, sleep duration exceeding 7 hours with deep architecture, and resting stress scores stabilizing below 30.",
    answerHi:
      "सकारात्मक अनुकूलन तब माना जाता है जब कसरत के बाद हृदय गति तेजी से सामान्य हो जाए, सोते समय SpO2 96% से ऊपर रहे, 7 घंटे से अधिक अच्छी नींद मिले और विश्राम तनाव स्कोर 30 से नीचे बना रहे।",
  },
  {
    id: "pb-18",
    category: "baseline",
    intent: "hrv_significance",
    questionEn: "What is the physiological significance of Heart Rate Variability (HRV)?",
    questionHi: "हार्ट रेट वेरिएबिलिटी (HRV) का शारीरिक महत्व क्या है?",
    questionHinglish: ["hrv ka kya matlab hai", "heart rate variability significance"],
    keywords: ["hrv", "variability", "vagal", "parasympathetic", "recovery"],
    answerEn:
      "HRV measures millisecond beat-to-beat variations governed by autonomic balance. High HRV reflects robust parasympathetic tone, readiness for cognitive and physical tasks, and cardiovascular resilience; depressed HRV indicates systemic stress, overtraining, or subclinical illness.",
    answerHi:
      "HRV दिल की दो धड़कनों के बीच के समय में होने वाले सूक्ष्म अंतर को मापता है। उच्च HRV यह दिखाता है कि आपका शरीर तनावमुक्त, स्वस्थ और नए कार्यों के लिए तैयार है; जबकि कम HRV थकान, अत्यधिक तनाव या बीमारी का संकेत देता है।",
  },
  {
    id: "pb-19",
    category: "baseline",
    intent: "combined_sleep_strain_flag",
    questionEn: "How does ASTRA flag combined sleep debt and cardiovascular strain?",
    questionHi: "ASTRA नींद की कमी और हृदय पर तनाव के संयुक्त प्रभाव को कैसे पहचानता है?",
    questionHinglish: ["sleep debt and heart strain combination alert", "neend aur stress ek sath"],
    keywords: ["sleep", "debt", "strain", "combined", "interaction", "cardiovascular"],
    answerEn:
      "ASTRA cross-correlates sleep logs with subsequent resting cardiovascular telemetry. When cumulative sleep falls 3+ hours below baseline and resting pulse climbs simultaneously by 6+ BPM, our engine elevates the alert tier, flagging compounded circadian exhaustion.",
    answerHi:
      "जब नींद में 3 घंटे से अधिक की कमी हो और साथ ही दिन की रेस्टिंग हार्ट रेट भी 6 BPM से अधिक बढ़ जाए, तो ASTRA इसे संयुक्त सर्कैडियन थकान (Compounded Exhaustion) के रूप में चिन्हित कर चेतावनी जारी करता है।",
  },
  {
    id: "pb-20",
    category: "baseline",
    intent: "manual_baseline_reset",
    questionEn: "Can I manually reset or recalibrate my personal baselines?",
    questionHi: "क्या मैं अपनी व्यक्तिगत बेसलाइन को मैन्युअल रूप से रीसेट कर सकता हूँ?",
    questionHinglish: ["kya baseline reset kar sakte hai", "manual baseline reset option"],
    keywords: ["reset", "recalibrate", "manual", "settings", "baseline", "clear"],
    answerEn:
      "Yes. Crewmembers and flight surgeons can initiate a baseline recalibration from the Settings panel or trigger baseline re-estimation when recovering from acute medical events or transitioning to a new orbital expedition phase.",
    answerHi:
      "हाँ। अंतरिक्ष यात्री या मिशन फ्लाइट सर्जन सेटिंग्स पैनल में जाकर बेसलाइन को रीसेट या री-कैलिब्रेट कर सकते हैं। यह विकल्प किसी बीमारी से ठीक होने के बाद या नए मिशन चरण में जाने पर उपयोगी होता है।",
  },
];
