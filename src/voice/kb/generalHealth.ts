import type { KnowledgeEntry } from "../types";

export const generalHealthEntries: KnowledgeEntry[] = [
  {
    id: "gh-01",
    category: "general",
    intent: "current_heart_rate",
    questionEn: "What is my current heart rate?",
    questionHi: "मेरा वर्तमान हृदय गति (Heart Rate) क्या है?",
    questionHinglish: ["mera heart rate kya hai", "current heart rate kitna hai", "heart beat kitni hai", "hr check karo"],
    keywords: ["heart", "rate", "hr", "bpm", "pulse", "dil", "dhadkan"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your current heart rate is ${ctx.hr} BPM. Your personal baseline is ${ctx.baselineHr} BPM (${ctx.hr >= ctx.baselineHr ? "+" : ""}${ctx.hr - ctx.baselineHr} BPM variance). Resting telemetry indicates cardiovascular rhythm is currently ${Math.abs(ctx.hr - ctx.baselineHr) <= 8 ? "well within nominal mission tolerance limits" : "showing elevated autonomic arousal requiring routine rest protocol monitoring"}.`,
    answerHi: (ctx) =>
      `आपकी वर्तमान हृदय गति ${ctx.hr} BPM है। आपका व्यक्तिगत बेसलाइन ${ctx.baselineHr} BPM है (${ctx.hr >= ctx.baselineHr ? "+" : ""}${ctx.hr - ctx.baselineHr} BPM का अंतर)। यह रीडिंग दर्शाती है कि आपकी कार्डियोवैस्कुलर स्थिति ${Math.abs(ctx.hr - ctx.baselineHr) <= 8 ? "सामान्य मिशन सीमा के भीतर पूरी तरह स्थिर है" : "बेसलाइन से अधिक है, विश्राम प्रोटोकॉल का पालन करें"}।`,
  },
  {
    id: "gh-02",
    category: "general",
    intent: "current_spo2",
    questionEn: "What is my oxygen saturation level?",
    questionHi: "मेरा ऑक्सीजन सेचुरेशन (SpO2) स्तर क्या है?",
    questionHinglish: ["mera spo2 kitna hai", "oxygen level kya hai", "oxygen saturation check karo"],
    keywords: ["spo2", "oxygen", "saturation", "blood oxygen", "o2"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Your peripheral capillary oxygen saturation (SpO2) is currently ${ctx.spo2}%. Your established personal baseline is ${ctx.baselineSpo2}%. Arterial oxygenation remains ${ctx.spo2 >= 96 ? "optimal for pressurized cabin work" : "slightly constrained; verify cabin environmental scrubber status and airflow"}.`,
    answerHi: (ctx) =>
      `आपका वर्तमान ऑक्सीजन सेचुरेशन (SpO2) ${ctx.spo2}% है। आपका बेसलाइन स्तर ${ctx.baselineSpo2}% है। यह ऑक्सीजन स्तर केबिन के अंदर कार्य करने के लिए ${ctx.spo2 >= 96 ? "पूरी तरह अनुकूल और सामान्य है" : "हल्का कम है, केबिन वेंटिलेशन और स्क्रबर की जांच करें"}।`,
  },
  {
    id: "gh-03",
    category: "general",
    intent: "current_health_status",
    questionEn: "What is my overall health status today?",
    questionHi: "आज मेरी समग्र स्वास्थ्य स्थिति कैसी है?",
    questionHinglish: ["aaj mera health status kaisa hai", "overall tabiyat kaisi hai", "health checkup report status"],
    keywords: ["overall", "status", "health", "condition", "today", "samagra", "swasthya"],
    isDynamic: true,
    answerEn: (ctx) =>
      `Today's overall crew health status is evaluated as ${ctx.healthStatus}. ${ctx.healthReasons.join(" ")} Operational recommendation: ${ctx.healthAction}`,
    answerHi: (ctx) =>
      `आज आपकी समग्र स्वास्थ्य स्थिति ${ctx.healthStatus === "NOMINAL" ? "सामान्य (NOMINAL)" : "ध्यानाकर्षण (ATTENTION)"} आंकी गई है। ${ctx.healthReasons.join(" ")} उड़ान सर्जन की सिफारिश: ${ctx.healthAction}`,
  },
  {
    id: "gh-04",
    category: "general",
    intent: "active_health_alarms",
    questionEn: "Are there any active health alerts or attention flags?",
    questionHi: "क्या कोई सक्रिय स्वास्थ्य चेतावनी या अलर्ट है?",
    questionHinglish: ["kya koi health alert hai", "koi warning ya alarm hai kya", "attention flags check karo"],
    keywords: ["alert", "alarm", "warning", "attention", "flag", "chetavani"],
    isDynamic: true,
    answerEn: (ctx) =>
      ctx.healthStatus === "NOMINAL"
        ? "No active physiological warnings. All simulated biometric signals—heart rate, arterial oxygenation, sleep architecture, and stress recovery—are within nominal operational tolerances."
        : `Active Attention Flag: ${ctx.healthReasons[0] || "Elevated physiological drift observed"}. Flight Surgeon Action: ${ctx.healthAction}`,
    answerHi: (ctx) =>
      ctx.healthStatus === "NOMINAL"
        ? "कोई सक्रिय स्वास्थ्य चेतावनी नहीं है। सभी सिमुलेटेड बायोमेट्रिक सिग्नल—हृदय गति, ऑक्सीजन, नींद और तनाव—सामान्य सीमा के भीतर हैं।"
        : `सक्रिय अलर्ट: ${ctx.healthReasons[0] || "बायोमेट्रिक विचलन दर्ज हुआ है"}। अनुशंसित कदम: ${ctx.healthAction}`,
  },
  {
    id: "gh-05",
    category: "general",
    intent: "normal_resting_hr_microgravity",
    questionEn: "What is the normal resting heart rate range in microgravity?",
    questionHi: "माइक्रोग्रैविटी में सामान्य रेस्टिंग हार्ट रेट क्या होती है?",
    questionHinglish: ["space me normal heart rate kitna hota hai", "resting hr microgravity range kya hai"],
    keywords: ["normal", "resting", "heart", "rate", "microgravity", "space", "range"],
    answerEn:
      "In microgravity, resting heart rate typically ranges between 55 and 75 BPM for conditioned astronauts. Initial insertion causes transient elevation due to sympathetic activation and fluid redistribution. Over mission duration, stroke volume often increases slightly while resting pulse settles near pre-flight supine baselines.",
    answerHi:
      "माइक्रोग्रैविटी में प्रशिक्षित अंतरिक्ष यात्रियों की सामान्य रेस्टिंग हार्ट रेट 55 से 75 BPM के बीच होती है। अंतरिक्ष में प्रवेश के शुरुआती दिनों में तनाव और शारीरिक तरल पदार्थों के बदलाव से यह थोड़ी बढ़ सकती है, लेकिन बाद में यह स्थिर हो जाती है।",
  },
  {
    id: "gh-06",
    category: "general",
    intent: "fluid_shift_explanation",
    questionEn: "Why does fluid shift occur in spaceflight?",
    questionHi: "अंतरिक्ष उड़ान में शारीरिक तरल पदार्थों का विस्थापन (Fluid Shift) क्यों होता है?",
    questionHinglish: ["fluid shift kyu hota hai", "space me khoon upar kyu chadhta hai", "fluid shift explanation"],
    keywords: ["fluid", "shift", "cephalad", "blood", "gravity", "taral"],
    answerEn:
      "On Earth, gravity pulls approximately two liters of bodily fluids into the lower extremities. In weightlessness, hydrostatic pressure gradients vanish, causing vascular fluids to shift upward toward the chest and head. This cephalad redistribution causes facial puffiness, nasal congestion, and triggers physiological diuresis to reduce overall plasma volume.",
    answerHi:
      "पृथ्वी पर गुरुत्वाकर्षण लगभग 2 लीटर तरल पैरों और निचले शरीर की ओर खींचता है। अंतरिक्ष में भारहीनता के कारण यह दबाव समाप्त हो जाता है और तरल पदार्थ सिर व छाती की ओर विस्थापित हो जाते हैं। इससे चेहरे पर हल्की सूजन और नाक बंद होने जैसे लक्षण होते हैं।",
  },
  {
    id: "gh-07",
    category: "general",
    intent: "space_motion_sickness",
    questionEn: "What is Space Motion Sickness and how long does it last?",
    questionHi: "स्पेस मोशन सिकनेस (SMS) क्या है और यह कितने समय तक रहती है?",
    questionHinglish: ["space motion sickness kya hai", "sms kitne din rehta hai", "space me ulti chakkar kyu aate hai"],
    keywords: ["space", "motion", "sickness", "sms", "nausea", "vestibular"],
    answerEn:
      "Space Motion Sickness (SMS) affects 60 to 70 percent of astronauts during the first 48 to 72 hours of microgravity exposure. It results from neuro-vestibular sensory conflict between otolith organs and semicircular canals. Symptoms include headache, malaise, cold sweating, and nausea. Symptoms generally resolve completely as the vestibular system neuro-adapts.",
    answerHi:
      "स्पेस मोशन सिकनेस (SMS) 60-70% अंतरिक्ष यात्रियों को पहले 2 से 3 दिनों तक प्रभावित करती है। यह आंतरिक कान के संतुलन अंगों और दृष्टि के बीच तालमेल बिगड़ने से होती है। सिरदर्द, मिचली और थकान इसके मुख्य लक्षण हैं, जो 72 घंटों में मस्तिष्क के ढलने पर स्वतः ठीक हो जाते हैं।",
  },
  {
    id: "gh-08",
    category: "general",
    intent: "blood_pressure_microgravity",
    questionEn: "How does microgravity affect blood pressure regulation?",
    questionHi: "माइक्रोग्रैविटी रक्तचाप नियंत्रण को कैसे प्रभावित करती है?",
    questionHinglish: ["space me blood pressure kaise badalta hai", "microgravity bp regulation"],
    keywords: ["blood", "pressure", "regulation", "bp", "baroreceptor", "raktchap"],
    answerEn:
      "Without hydrostatic columns, carotid arterial pressure equilibrates with lower body pressures. Baroreceptors sense apparent central fluid overload and reset autonomic tone, slightly reducing systemic vascular resistance. While arterial pressures remain well regulated in orbit, baroreflex sensitivity gradually downregulates, making astronauts susceptible to orthostatic hypotensive episodes upon gravitational return.",
    answerHi:
      "माइक्रोग्रैविटी में गुरुत्वीय दबाव न होने से रक्तचाप पूरे शरीर में समान होने लगता है। शरीर का बैरोरिसेप्टर सिस्टम इस बदलाव के अनुसार तंत्रिका संकेतों को रीसेट करता है। कक्षा में रहते हुए बीपी स्थिर रहता है, लेकिन पृथ्वी पर वापसी के समय खड़े होने पर चक्कर आ सकते हैं।",
  },
  {
    id: "gh-09",
    category: "general",
    intent: "cardiac_deconditioning",
    questionEn: "What happens to cardiac muscle mass during long missions?",
    questionHi: "लंबे अंतरिक्ष मिशनों के दौरान हृदय की मांसपेशियों पर क्या प्रभाव पड़ता है?",
    questionHinglish: ["heart muscle space me kamzor hoti hai kya", "cardiac deconditioning in space"],
    keywords: ["cardiac", "muscle", "atrophy", "heart", "deconditioning", "hriday"],
    answerEn:
      "Because the heart no longer works against gravitational gradients to pump blood upward, myocardial workload decreases significantly. Over months in orbit, left ventricular mass can diminish by 8 to 10 percent unless rigorous high-intensity aerobic and resistive countermeasures are performed daily to maintain cardiac stroke volume.",
    answerHi:
      "भारहीनता में हृदय को गुरुत्वाकर्षण के विरुद्ध रक्त पंप करने की आवश्यकता नहीं होती, जिससे उसका कार्यभार घट जाता है। महीनों तक अंतरिक्ष में रहने पर हृदय की मांसपेशियों का द्रव्यमान 8-10% तक घट सकता है, जिसे रोकने के लिए दैनिक एरोबिक व्यायाम अनिवार्य होता है।",
  },
  {
    id: "gh-10",
    category: "general",
    intent: "hydration_monitoring_orbit",
    questionEn: "Why is hydration monitoring critical in orbit?",
    questionHi: "कक्षा में शरीर में पानी का स्तर (हाइड्रेशन) ट्रैक करना क्यों आवश्यक है?",
    questionHinglish: ["space me pani pina kyu zaroori hai", "hydration monitoring in orbit"],
    keywords: ["hydration", "water", "fluid", "kidney", "stones", "dehydration"],
    answerEn:
      "Cephalad fluid shift causes transient polyuria, reducing plasma volume by 10 to 15 percent early in flight. Astronauts often experience a suppressed thirst sensation. Poor hydration drastically amplifies the risk of nephrolithiasis (renal calcium phosphate/oxalate stones) from bone resorption and diminishes thermoregulation capacity during spacewalks.",
    answerHi:
      "अंतरिक्ष में प्यास लगने की स्वाभाविक इच्छा कम हो जाती है, जबकि तरल पदार्थ निकलने से प्लाज्मा 10-15% घट जाता है। कम पानी पीने से हड्डियों से निकलने वाले कैल्शियम के कारण गुर्दे में पथरी (Kidney Stones) बनने का गंभीर खतरा पैदा हो जाता है।",
  },
  {
    id: "gh-11",
    category: "general",
    intent: "diagnostic_boundary",
    questionEn: "Does ASTRA make clinical medical diagnoses?",
    questionHi: "क्या ASTRA कोई क्लीनिकल या मेडिकल निदान (Diagnosis) करता है?",
    questionHinglish: ["kya astra medical diagnosis karta hai", "is astra a medical device"],
    keywords: ["diagnostic", "medical", "clinical", "doctor", "certification", "nidan"],
    answerEn:
      "No. ASTRA is strictly an operational telemetry monitoring and self-assessment decision-support tool. It computes deviations from your personalized multi-day baselines and highlights patterns of physiological fatigue. ASTRA does not replace flight surgeons, clinical diagnostics, or certified medical equipment.",
    answerHi:
      "नहीं। ASTRA केवल एक ऑपरेशनल टेलीमेट्री मॉनिटरिंग और डिसीजन-सपोर्ट टूल है। यह आपके व्यक्तिगत बेसलाइन से अंतर की गणना करता है और थकान या तनाव के पैटर्न दिखाता है। यह फ्लाइट सर्जन या क्लीनिकल डॉक्टरों का विकल्प नहीं है।",
  },
  {
    id: "gh-12",
    category: "general",
    intent: "cardiovascular_countermeasures",
    questionEn: "What are the primary cardiovascular countermeasures on the ISS?",
    questionHi: "अंतरराष्ट्रीय अंतरिक्ष स्टेशन (ISS) पर मुख्य कार्डियोवैस्कुलर उपाय क्या हैं?",
    questionHinglish: ["iss pe heart exercise countermeasures kya hote hai", "cardio workout in space"],
    keywords: ["countermeasures", "cardiovascular", "iss", "cycle", "treadmill", "aerobic"],
    answerEn:
      "Current ISS countermeasures combine cycle ergometry (CEVIS), treadmill running with bungees (T2), and heavy resistive loading (ARED). Astronauts execute 30 to 45 minutes of aerobic conditioning targeting 75 to 85 percent VO2 max, alongside 45 minutes of resistive lifting to preserve left ventricular chamber dimensions and peripheral microvascular tone.",
    answerHi:
      "ISS पर साइकिल अर्गोमीटर (CEVIS), बंजी हार्नेस वाला ट्रेडमिल (T2), और एडवांस्ड रेसिस्टिव एक्सरसाइज डिवाइस (ARED) मुख्य उपकरण हैं। अंतरिक्ष यात्री प्रतिदिन 30-45 मिनट एरोबिक और 45 मिनट वेट ट्रेनिंग करते हैं ताकि हृदय की क्षमता बनी रहे।",
  },
  {
    id: "gh-13",
    category: "general",
    intent: "cabin_co2_effects",
    questionEn: "How does elevated cabin carbon dioxide affect astronaut physiology?",
    questionHi: "केबिन में कार्बन डाइऑक्साइड (CO2) की वृद्धि का शरीर पर क्या प्रभाव पड़ता है?",
    questionHinglish: ["cabin co2 badhne se kya hota hai", "carbon dioxide symptoms in space"],
    keywords: ["co2", "carbon", "dioxide", "headache", "cabin", "hypercapnia"],
    answerEn:
      "In enclosed spacecraft without convective buoyancy, expired CO2 forms micro-pockets around sleeping astronauts. Chronic ambient CO2 levels exceeding 3 to 4 mmHg can induce cerebral vasodilation, chronic low-grade headaches, cognitive sluggishness, and increased intraocular pressure, compounding visual impairment syndromes.",
    answerHi:
      "माइक्रोग्रैविटी में प्राकृतिक संवहन (convection) न होने से छोड़ी गई CO2 सिर के चारों ओर जमा हो सकती है। केबिन में CO2 बढ़ने से सिरदर्द, हल्का धुंधलापन, सुस्ती और आंखों के दबाव में वृद्धि हो सकती है।",
  },
  {
    id: "gh-14",
    category: "general",
    intent: "puffy_face_bird_legs",
    questionEn: "What causes the puffy face and bird legs syndrome in space?",
    questionHi: "अंतरिक्ष में चेहरे पर सूजन और पतले पैरों (Bird Legs) का क्या कारण है?",
    questionHinglish: ["puffy face bird legs kyu hota hai", "chehra kyu sujh jata hai space me"],
    keywords: ["puffy", "face", "bird", "legs", "syndrome", "edema"],
    answerEn:
      "Within hours of orbital entry, lack of gravity eliminates the hydrostatic gradient pulling blood toward the calves. Up to two liters of venous blood and interstitial fluid shift into the upper torso and head, causing facial edema and jugular vein distension, while calf circumference decreases by 10 to 30 percent, creating the classic 'bird legs' profile.",
    answerHi:
      "गुरुत्वाकर्षण न होने से पैरों का लगभग 2 लीटर तरल शरीर के ऊपरी हिस्से में आ जाता है। इससे चेहरा और गर्दन सूज जाते हैं, जबकि पिंडलियों की परिधि 10-30% तक घट जाती है। इसे ही अंतरिक्ष विज्ञान में 'पफी फेस और बर्ड लेग्स' सिंड्रोम कहते हैं।",
  },
  {
    id: "gh-15",
    category: "general",
    intent: "baroreceptor_sensitivity",
    questionEn: "How does microgravity alter baroreceptor reflex sensitivity?",
    questionHi: "माइक्रोग्रैविटी बैरोरिसेप्टर रिफ्लेक्स संवेदनशीलता को कैसे बदलती है?",
    questionHinglish: ["baroreceptor reflex space me kaise change hota hai", "baroreflex sensitivity"],
    keywords: ["baroreceptor", "reflex", "sensitivity", "autonomic", "carotid"],
    answerEn:
      "Carotid-cardiac and aortic baroreceptors continuously monitor arterial stretch. In weightlessness, chronic thoracic fluid centralization resets the set point and attenuates autonomic gain. The nervous system becomes sluggish at rapidly initiating vasoconstriction upon sudden posture shifts when gravitational loading is reintroduced.",
    answerHi:
      "गले और महाधमनी में मौजूद बैरोरिसेप्टर रक्तचाप के खिंचाव को मापते हैं। अंतरिक्ष में लगातार ऊपरी शरीर में तरल रहने से इनकी संवेदनशीलता कम हो जाती है। इस कारण गुरुत्वाकर्षण में लौटने पर अचानक खड़े होने पर शरीर तुरंत नसें सिकोड़ नहीं पाता।",
  },
  {
    id: "gh-16",
    category: "general",
    intent: "orthostatic_intolerance",
    questionEn: "What is orthostatic intolerance and when is it most hazardous?",
    questionHi: "ऑर्थोस्टैटिक इनटॉलेरेंस क्या है और यह कब सबसे अधिक खतरनाक होता है?",
    questionHinglish: ["orthostatic intolerance kya hota hai", "dharti pe aake chakkar kyu aate hai"],
    keywords: ["orthostatic", "intolerance", "landing", "syncope", "fainting"],
    answerEn:
      "Orthostatic intolerance is the inability to maintain cerebral blood perfusion upon standing in gravity, leading to lightheadedness, presyncope, or syncope. It is most hazardous during spacecraft reentry, landing operations, and emergency egress when g-forces pull blood downward into compliant venous beds of the abdomen and legs.",
    answerHi:
      "ऑर्थोस्टैटिक इनटॉलेरेंस गुरुत्वाकर्षण में खड़े होने पर मस्तिष्क तक पर्याप्त रक्त न पहुंच पाने की स्थिति है, जिससे चक्कर आते हैं या बेहोशी हो सकती है। यह अंतरिक्ष यान की लैंडिंग और आपातकालीन निकास के समय सबसे खतरनाक होता है।",
  },
  {
    id: "gh-17",
    category: "general",
    intent: "immune_system_space",
    questionEn: "How does spaceflight affect the human immune system?",
    questionHi: "अंतरिक्ष उड़ान मानव प्रतिरक्षा प्रणाली (Immune System) को कैसे प्रभावित करती है?",
    questionHinglish: ["space me immunity kamzor hoti hai kya", "immune system spaceflight changes"],
    keywords: ["immune", "immunity", "t-cells", "infection", "reactivation", "pratiraksha"],
    answerEn:
      "Prolonged spaceflight causes subclinical immune dysregulation. T-cell activation and cytokine production decrease, while latent herpesviruses (such as Epstein-Barr and Varicella-Zoster) can shed at higher rates due to combined microgravity stress, circadian disruption, and space radiation exposure.",
    answerHi:
      "अंतरिक्ष में लंबी अवधि तक रहने से प्रतिरक्षा प्रणाली (इम्यून सिस्टम) कमजोर पड़ सकता है। टी-कोशिकाओं की सक्रियता घटती है और शरीर में पहले से मौजूद निष्क्रिय वायरस (जैसे हर्पीस) तनाव और रेडिएशन के कारण पुनः सक्रिय हो सकते हैं।",
  },
  {
    id: "gh-18",
    category: "general",
    intent: "sans_syndrome",
    questionEn: "What is Spaceflight-Associated Neuro-Ocular Syndrome (SANS)?",
    questionHi: "स्पेसफ्लाइट-एसोसिएटेड न्यूरो-ऑक्युलर सिंड्रोम (SANS) क्या है?",
    questionHinglish: ["sans syndrome kya hota hai", "space me aankh ki roshni kyu badalti hai", "sans eye issue"],
    keywords: ["sans", "neuro-ocular", "vision", "optic", "disc", "edema", "hyperopic"],
    answerEn:
      "SANS is a spectrum of ophthalmic alterations observed in long-duration astronauts, characterized by optic disc edema, globe flattening, choroidal folds, and hyperopic refractive shifts. It is thought to stem from chronic cephalad venous hypertension and altered cerebrospinal fluid pressure dynamics around the optic nerve sheath.",
    answerHi:
      "SANS अंतरिक्ष यात्रियों की आंखों में होने वाला एक विकार है, जिसमें ऑप्टिक तंत्रिका में सूजन, पुतली का चपटा होना और दूर दृष्टि दोष हो सकता है। यह सिर में तरल दबाव और मस्तिष्क-मेरुद्रव (CSF) के संतुलन बिगड़ने से होता है।",
  },
  {
    id: "gh-19",
    category: "general",
    intent: "nasal_congestion_taste",
    questionEn: "Why do astronauts experience nasal congestion and altered taste?",
    questionHi: "अंतरिक्ष में नाक बंद और स्वाद बदलने का अनुभव क्यों होता है?",
    questionHinglish: ["space me khana be-swaad kyu lagta hai", "nasal congestion in space"],
    keywords: ["nasal", "congestion", "taste", "smell", "flavor", "spicy"],
    answerEn:
      "Cephalad fluid congestion swells mucosal linings in the nasal passages and sinuses, severely blunting olfactory receptor stimulation. Because 80 percent of perceived flavor derives from retro-nasal olfaction, food tastes noticeably blander, which is why astronauts routinely favor spicy condiments like sriracha and wasabi.",
    answerHi:
      "सिर में तरल पदार्थों का दबाव बढ़ने से नाक की झिल्लियों में सूजन आ जाती है और सूंघने की क्षमता घट जाती है। चूंकि 80% स्वाद गंध से जुड़ा होता है, इसलिए अंतरिक्ष में भोजन बेस्वाद लगता है और यात्री तीखे मसालों का अधिक उपयोग करते हैं।",
  },
  {
    id: "gh-20",
    category: "general",
    intent: "physiological_drift_detection",
    questionEn: "How does ASTRA detect early physiological drift?",
    questionHi: "ASTRA शरीर में प्रारंभिक विचलन (Physiological Drift) कैसे पकड़ता है?",
    questionHinglish: ["astra drift kaise detect karta hai", "early physiological drift tracking"],
    keywords: ["drift", "detection", "engine", "multiday", "algorithms", "signals"],
    answerEn:
      "ASTRA aggregates multi-hour telemetry into rolling multi-day baseline models. Rather than relying on rigid population static cutoffs, our engine watches for sustained multi-sigma drift across interconnected vectors—such as resting heart rate rising simultaneously with declining sleep efficiency and elevated daily stress indexes.",
    answerHi:
      "ASTRA बहु-दिवसीय रोलिंग बेसलाइन मॉडल का उपयोग करता है। यह केवल एक समय के आंकड़े देखने के बजाय लगातार कई दिनों में हृदय गति, नींद की गुणवत्ता और तनाव के स्तर में होने वाले सूक्ष्म विचलन को मापकर प्रारंभिक चेतावनी देता है।",
  },
  {
    id: "gh-21",
    category: "general",
    intent: "elevated_hr_protocol",
    questionEn: "What should I do if my resting heart rate remains elevated?",
    questionHi: "यदि मेरी रेस्टिंग हार्ट रेट लगातार बढ़ी रहे तो मुझे क्या करना चाहिए?",
    questionHinglish: ["agar heart rate badhi rahe to kya kare", "elevated hr recovery protocol"],
    keywords: ["elevated", "heart", "rate", "recovery", "protocol", "hydration"],
    answerEn:
      "If your resting pulse exceeds baseline by more than 10 BPM over three consecutive cycles: verify cabin hydration intake (minimum 2.5 L/day), inspect cabin CO2 partial pressure, schedule 20 minutes of parasympathetic box breathing, log a self-reported check-in, and alert the mission flight surgeon for review.",
    answerHi:
      "यदि रेस्टिंग पल्स लगातार 3 चक्रों तक बेसलाइन से 10 BPM अधिक रहे: तुरंत 2.5 लीटर दैनिक जल सेवन सुनिश्चित करें, केबिन CO2 स्क्रबर जांचें, 20 मिनट डीप ब्रीदिंग करें, और फ्लाइट सर्जन को समीक्षा के लिए सूचित करें।",
  },
  {
    id: "gh-22",
    category: "general",
    intent: "space_anemia",
    questionEn: "What is space anemia and how does red blood cell mass change?",
    questionHi: "स्पेस एनीमिया क्या है और लाल रक्त कोशिकाओं पर क्या असर होता है?",
    questionHinglish: ["space anemia kya hai", "red blood cells in space"],
    keywords: ["space", "anemia", "red", "blood", "cells", "erythrocytes", "hemolysis"],
    answerEn:
      "Recent orbital studies show that human bodies destroy roughly 3 million red blood cells per second in microgravity, compared to 2 million per second on Earth—a 54 percent increase in hemolysis. While plasma volume contracts quickly to normalize hematocrit in space, returning astronauts face pronounced post-flight hemolytic anemia.",
    answerHi:
      "अंतरिक्ष में मानव शरीर पृथ्वी की तुलना में 54% तेजी से लाल रक्त कोशिकाओं (RBCs) को नष्ट करता है (प्रति सेकंड लगभग 30 लाख कोशिकाएं)। कक्षा में प्लाज्मा घटने से यह तुरंत महसूस नहीं होता, लेकिन पृथ्वी पर लौटने पर तीव्र हीमोलिटिक एनीमिया हो सकता है।",
  },
  {
    id: "gh-23",
    category: "general",
    intent: "lbnp_device_purpose",
    questionEn: "What is the purpose of Lower Body Negative Pressure (LBNP)?",
    questionHi: "लोअर बॉडी नेगेटिव प्रेशर (LBNP) उपकरण का क्या उद्देश्य है?",
    questionHinglish: ["lbnp device kya hota hai", "lower body negative pressure space"],
    keywords: ["lbnp", "lower", "body", "negative", "pressure", "chibis"],
    answerEn:
      "LBNP chambers (such as the Russian Chibis suit) apply a partial vacuum around the lower limbs, mechanically pulling 500 to 1000 mL of blood from the thoracic cavity back down into the pelvis and legs. This simulates terrestrial gravitational pooling, conditioning baroreceptors and testing cardiovascular responsiveness prior to landing.",
    answerHi:
      "LBNP उपकरण (जैसे रूसी चिबिस सूट) पैरों के चारों ओर आंशिक वैक्यूम बनाकर रक्त को छाती से वापस निचले शरीर की ओर खींचता है। यह पृथ्वी के गुरुत्वाकर्षण जैसा माहौल बनाकर नसों और हृदय को पुनः अनुकूल बनाने में मदद करता है।",
  },
  {
    id: "gh-24",
    category: "general",
    intent: "autonomic_adaptation",
    questionEn: "How does the autonomic nervous system adapt to weightlessness?",
    questionHi: "ऑटोनोमिक नर्वस सिस्टम भारहीनता में कैसे ढलता है?",
    questionHinglish: ["autonomic nervous system space adaptation", "sympathetic parasympathetic orbit"],
    keywords: ["autonomic", "nervous", "sympathetic", "parasympathetic", "hrv"],
    answerEn:
      "Initially, sympathetic drive surges during launch and orbital insertion. Over prolonged exposure, high-frequency heart rate variability (HRV) fluctuates as vagal parasympathetic modulation struggles against environmental stressors such as high ambient noise, confined quarters, and continuous circadian disruptions.",
    answerHi:
      "लॉन्च के समय सिम्पैथेटिक तंत्रिका तंत्र अत्यधिक सक्रिय होता है। लंबे समय तक अंतरिक्ष में रहने पर केबिन का शोर, सीमित स्थान और नींद के बदलाव पैरासिम्पैथेटिक टोन और हार्ट रेट वेरिएबिलिटी (HRV) को प्रभावित करते हैं।",
  },
  {
    id: "gh-25",
    category: "general",
    intent: "data_privacy_confidentiality",
    questionEn: "How does ASTRA protect astronaut health data privacy?",
    questionHi: "ASTRA अंतरिक्ष यात्रियों के स्वास्थ्य डेटा की गोपनीयता कैसे सुरक्षित रखता है?",
    questionHinglish: ["astra privacy kaise protect karta hai", "health data privacy offline"],
    keywords: ["privacy", "confidentiality", "security", "offline", "encryption", "gopniyata"],
    answerEn:
      "ASTRA adheres strictly to aerospace privacy protocols. All telemetry analytics, voice processing, and PDF reporting execute completely on the local client device without unencrypted cloud broadcasts. Health self-check-ins and personal baselines remain isolated inside browser sandbox storage under direct crewmember control.",
    answerHi:
      "ASTRA एयरोस्पेस गोपनीयता मानकों का कड़ाई से पालन करता है। सभी वॉयस प्रोसेसिंग, बायोमेट्रिक विश्लेषण और पीडीएफ रिपोर्ट पूरी तरह आपके स्थानीय डिवाइस पर ऑफलाइन तैयार होते हैं। कोई भी व्यक्तिगत डेटा अनधिकृत क्लाउड पर नहीं भेजा जाता।",
  },
];
