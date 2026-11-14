import type { KnowledgeEntry } from "../types";

export const sleepFatigueEntries: KnowledgeEntry[] = [
  {
    id: "sf-01",
    category: "sleep",
    intent: "last_night_sleep",
    questionEn: "How did I sleep last night?",
    questionHi: "मेरी पिछली रात की नींद कैसी रही?",
    questionHinglish: ["kal raat ki neend kaisi thi", "last night sleep review", "neend kitni hui kal"],
    keywords: ["sleep", "last", "night", "neend", "duration", "hours", "soya"],
    isDynamic: true,
    answerEn: (ctx) => {
      const diff = Math.round((ctx.sleep - ctx.baselineSleep) * 10) / 10;
      return `Last night you logged ${ctx.sleep} hours of sleep, compared to your personal baseline target of ${ctx.baselineSleep} hours (${diff >= 0 ? "+" : ""}${diff}h difference). Sleep efficiency was ${ctx.sleep >= 7 ? "nominal with restorative slow-wave architecture" : ctx.sleep >= 5.5 ? "moderately curtailed; expect mild afternoon cognitive drag" : "severely truncated; prioritize recovery sleep and cognitive pacing today"}.`;
    },
    answerHi: (ctx) => {
      const diff = Math.round((ctx.sleep - ctx.baselineSleep) * 10) / 10;
      return `पिछली रात आपने ${ctx.sleep} घंटे की नींद दर्ज की, जबकि आपका बेसलाइन लक्ष्य ${ctx.baselineSleep} घंटे है (${diff >= 0 ? "+" : ""}${diff}h अंतर)। आपकी नींद ${ctx.sleep >= 7 ? "पूरी तरह संतोषजनक और ताजगी से भरी रही" : ctx.sleep >= 5.5 ? "औसत से कम रही; दोपहर में सुस्ती महसूस हो सकती है" : "काफी कम रही; आज अतिरिक्त आराम और मानसिक विश्राम को प्राथमिकता दें"}।`;
    },
  },
  {
    id: "sf-02",
    category: "sleep",
    intent: "cumulative_sleep_debt",
    questionEn: "What is my cumulative sleep debt right now?",
    questionHi: "वर्तमान में मेरी संचयी नींद की कमी (Sleep Debt) कितनी है?",
    questionHinglish: ["sleep debt kitna ho gaya hai", "cumulative sleep loss space"],
    keywords: ["sleep", "debt", "deficit", "cumulative", "loss", "hours"],
    isDynamic: true,
    answerEn: (ctx) => {
      const deficit = Math.max(0, Math.round((ctx.baselineSleep - ctx.sleep) * 10) / 10);
      return deficit === 0
        ? "Your current cumulative sleep debt is 0.0 hours. Your recent nocturnal rest matches or exceeds your calibrated baseline, supporting optimal operational vigilance."
        : `Your estimated sleep deficit over the current cycle is approximately ${deficit} hours below baseline. Chronic accumulation above 4 hours triggers operational fatigue mitigation protocols.`;
    },
    answerHi: (ctx) => {
      const deficit = Math.max(0, Math.round((ctx.baselineSleep - ctx.sleep) * 10) / 10);
      return deficit === 0
        ? "आपकी नींद की संचयी कमी शून्य (0.0 घंटे) है। आपकी हालिया नींद बेसलाइन के अनुकूल है और एकाग्रता उच्च स्तर पर है।"
        : `वर्तमान में आपकी लगभग ${deficit} घंटे की नींद की कमी है। 4 घंटे से अधिक की कमी मिशन में थकान और ध्यान भटकने का खतरा पैदा कर सकती है।`;
    },
  },
  {
    id: "sf-03",
    category: "sleep",
    intent: "why_astronauts_insomnia",
    questionEn: "Why do astronauts frequently suffer from insomnia in space?",
    questionHi: "अंतरिक्ष में यात्रियों को अनिद्रा (Insomnia) की समस्या अक्सर क्यों होती है?",
    questionHinglish: ["space me neend kyu nahi aati", "astronaut insomnia causes"],
    keywords: ["insomnia", "astronauts", "disruption", "anidra", "trouble", "sleeping"],
    answerEn:
      "Insomnia in orbit stems from multiple converging environmental disruptors: the absence of familiar tactile mattress contact, continuous mechanical ventilation humming (50-60 dB), lack of normal natural day/night illumination cues, cephalad fluid congestion causing headaches, and high operational stress.",
    answerHi:
      "अंतरिक्ष में गद्दे के बिना भारहीन तैरते हुए सोने की अजीब अनुभूति, वेंटिलेशन पंखों का लगातार शोर, हर 90 मिनट में सूर्योदय-सूर्यास्त का चक्र, सिर में तरल दबाव और मिशन का भारी तनाव मिलकर अनिद्रा का कारण बनते हैं।",
  },
  {
    id: "sf-04",
    category: "sleep",
    intent: "ninety_minute_circadian_effect",
    questionEn: "How does the 90-minute orbital sunrise cycle affect circadian rhythms?",
    questionHi: "90 मिनट का कक्षीय सूर्योदय/सूर्यास्त चक्र जैविक घड़ी को कैसे प्रभावित करता है?",
    questionHinglish: ["90 minute orbit day night effect", "circadian rhythm space sunset"],
    keywords: ["90-minute", "orbit", "sunrise", "sunset", "circadian", "rhythm", "iss"],
    answerEn:
      "In low Earth orbit, spacecraft experience 16 sunrises and sunsets every 24 hours. Without deliberate cabin lighting discipline and window shutter control, the suprachiasmatic nucleus receives erratic photic cues, completely desynchronizing endogenous melatonin synthesis and biological sleep rhythms.",
    answerHi:
      "अंतरिक्ष स्टेशन पृथ्वी का चक्कर 90 मिनट में लगाता है, जिससे 24 घंटे में 16 बार सूर्योदय और सूर्यास्त होता है। यदि केबिन की खिड़कियां बंद न रखी जाएं और कृत्रिम प्रकाश का सही उपयोग न हो, तो शरीर की जैविक घड़ी (Circadian Rhythm) पूरी तरह भ्रमित हो जाती है।",
  },
  {
    id: "sf-05",
    category: "sleep",
    intent: "target_sleep_duration",
    questionEn: "What is the ideal sleep duration target for an astronaut on duty?",
    questionHi: "ड्यूटी पर तैनात अंतरिक्ष यात्री के लिए आदर्श नींद का लक्ष्य क्या है?",
    questionHinglish: ["astronaut ko kitne ghante sona chahiye", "ideal sleep hours space"],
    keywords: ["target", "ideal", "duration", "hours", "astronaut", "standard"],
    answerEn:
      "Flight medicine guidelines mandate an 8.5-hour scheduled sleep block per 24-hour mission day, with a physiological target of at least 7.0 to 7.5 hours of actual restorative sleep to preserve neurobehavioral vigilance, emotional stability, and executive cognitive capacity.",
    answerHi:
      "फ्लाइट मेडिसिन के नियमों के अनुसार अंतरिक्ष यात्रियों के लिए प्रतिदिन 8.5 घंटे का स्लीप-ब्लॉक शेड्यूल किया जाता है, जिसमें कम से कम 7 से 7.5 घंटे की गहरी नींद लेना अनिवार्य माना जाता है ताकि मानसिक सतर्कता बनी रहे।",
  },
  {
    id: "sf-06",
    category: "sleep",
    intent: "sleeping_in_tethered_bag",
    questionEn: "How does sleeping strapped into a tethered sleeping bag feel?",
    questionHi: "तैरते हुए स्लीपिंग बैग में बंधकर सोने का अनुभव कैसा होता है?",
    questionHinglish: ["space me sleeping bag me kaise sote hai", "sleeping tethered microgravity"],
    keywords: ["sleeping", "bag", "tethered", "strapped", "feeling", "floating"],
    answerEn:
      "Astronauts zip into sleeping bags tethered to private cabin walls so they don't drift into ventilation intakes or console switches. Because limbs naturally float in a neutral body posture, arms drift forward in a 'zombie posture' unless velcroed or tucked inside the bag.",
    answerHi:
      "अंतरिक्ष यात्री अपने केबिन की दीवार से बंधे स्लीपिंग बैग में सोते हैं ताकि वे हवा के झोंकों से तैरते हुए उपकरणों से न टकराएं। भारहीनता में हाथ स्वाभाविक रूप से आगे की ओर तैरने लगते हैं, इसलिए उन्हें बैग के अंदर रखना पड़ता है।",
  },
  {
    id: "sf-07",
    category: "sleep",
    intent: "iss_sleep_hygiene_protocols",
    questionEn: "What are sleep hygiene protocols aboard the space station?",
    questionHi: "अंतरिक्ष स्टेशन पर नींद के अनुशासन (Sleep Hygiene) के क्या नियम हैं?",
    questionHinglish: ["iss sleep hygiene rules kya hai", "space station sleep protocol"],
    keywords: ["hygiene", "protocol", "sleep", "iss", "rules", "preparation"],
    answerEn:
      "ISS sleep hygiene includes dimming cabin illumination 2 hours before bed, switching solid-state lighting to red-spectrum sleep modes, eliminating screens 30 minutes prior to crew sleep, wearing noise-dampening earplugs or active headsets, and setting personal cabin airflow to avoid stagnant CO2 bubbles.",
    answerHi:
      "नियमों के अनुसार सोने से 2 घंटे पहले रोशनी धीमी कर दी जाती है, ब्लू लाइट बंद कर रेड-स्पेक्ट्रम लाइट जलाई जाती है, 30 मिनट पहले स्क्रीन बंद कर दी जाती है, कानों में ईयरप्लग लगाए जाते हैं और ताजी हवा का फ्लो सुनिश्चित किया जाता है।",
  },
  {
    id: "sf-08",
    category: "sleep",
    intent: "spacecraft_noise_impact",
    questionEn: "What is the impact of ambient spacecraft noise and fans on sleep?",
    questionHi: "केबिन के पंखों और उपकरणों के शोर का नींद पर क्या असर होता है?",
    questionHinglish: ["spacecraft fan noise sleep issue", "cabin ambient noise level decibels"],
    keywords: ["noise", "ambient", "fans", "decibels", "sound", "earplugs"],
    answerEn:
      "Spacecraft environmental control systems, coolant pumps, and ventilation fans generate continuous noise between 55 and 65 decibels. This constant acoustic drone prevents entry into deep Stage 3 slow-wave sleep and causes frequent micro-arousals unless sound attenuation measures are employed.",
    answerHi:
      "कूलेंट पंप और वेंटिलेशन पंखों का लगातार 55 से 65 डेसिबल का शोर होता रहता है। यह निरंतर शोर दिमाग को पूरी तरह शांत नहीं होने देता और गहरी नींद (Stage 3 Slow-Wave Sleep) में बाधा डालकर बार-बार सूक्ष्म नींद तोड़ता है।",
  },
  {
    id: "sf-09",
    category: "sleep",
    intent: "evaluating_sleep_without_psg",
    questionEn: "How does ASTRA evaluate sleep quality without invasive polysomnography?",
    questionHi: "ASTRA बिना पॉलीसोम्नोग्राफी के नींद की गुणवत्ता का आकलन कैसे करता है?",
    questionHinglish: ["astra neend ki quality kaise napta hai", "evaluating sleep without eeg"],
    keywords: ["evaluate", "quality", "polysomnography", "actigraphy", "hrv", "modeling"],
    answerEn:
      "ASTRA integrates multi-axial actigraphy telemetry with nocturnal heart rate deceleration and autonomic HRV spectral shifts. Nocturnal heart rate dipping below daytime baseline strongly correlates with restorative physiological recovery without requiring bulky scalp EEG electrodes.",
    answerHi:
      "ASTRA शरीर की गति (Actigraphy), सोते समय हृदय गति में आने वाली प्राकृतिक गिरावट (Nocturnal Dipping) और हार्ट रेट वेरिएबिलिटी के तालमेल से नींद की गुणवत्ता और गहराई का सटीक मॉडल तैयार करता है।",
  },
  {
    id: "sf-10",
    category: "sleep",
    intent: "sleep_shifting_protocols",
    questionEn: "What are sleep shifting protocols during EVAs and spacecraft dockings?",
    questionHi: "स्पेसवॉक (EVA) और डॉकिंग के समय नींद का समय (Sleep Shifting) कैसे बदला जाता है?",
    questionHinglish: ["eva docking time sleep shift kaise hota hai", "circadian sleep shifting space"],
    keywords: ["sleep", "shifting", "eva", "docking", "slamshift", "phase"],
    answerEn:
      "When mission dockings or spacewalks occur outside standard station crew sleep, flight controllers execute 'slam-shifting' or gradual phase shifting. Astronauts shift sleep schedules by 1 to 2 hours per day over 3 to 4 days using controlled bright blue light pulses and timed dark periods.",
    answerHi:
      "जब स्पेसवॉक या रॉकेट डॉकिंग रात के समय निर्धारित होती है, तो कई दिनों में सोने का समय धीरे-धीरे 1 से 2 घंटे रोज खिसकाया जाता है। इसके लिए विशेष हाई-इंटेंसिटी ब्लू लाइट थेरेपी का उपयोग करके दिमाग को नए समय के अनुकूल किया जाता है।",
  },
  {
    id: "sf-11",
    category: "sleep",
    intent: "deep_sleep_rem_microgravity",
    questionEn: "How does microgravity affect slow-wave deep sleep and REM cycles?",
    questionHi: "माइक्रोग्रैविटी गहरी नींद (Deep Sleep) और REM चक्रों को कैसे प्रभावित करती है?",
    questionHinglish: ["deep sleep aur rem space me kam kyu hote hai", "slow wave sleep microgravity"],
    keywords: ["slow-wave", "deep", "rem", "cycles", "architecture", "eeg"],
    answerEn:
      "Orbital polysomnographic research demonstrates that microgravity significantly curtails Stage 3 deep slow-wave sleep and causes fragmented REM episodes. Crewmembers spend disproportionate time in lighter Stage 1 and Stage 2 sleep, leaving them prone to subjective feelings of unrefreshing rest.",
    answerHi:
      "अनुसंधानों से पता चला है कि अंतरिक्ष में स्टेज-3 गहरी नींद और सपनों वाली REM नींद की अवधि घट जाती है। अंतरिक्ष यात्री अधिकतर हल्की नींद (स्टेज 1 और 2) में समय बिताते हैं, जिसके कारण सुबह उठने पर भी ताजगी का अहसास कम होता है।",
  },
  {
    id: "sf-12",
    category: "sleep",
    intent: "sleep_deprivation_critical_errors",
    questionEn: "Why is sleep deprivation considered a primary risk for critical errors?",
    questionHi: "नींद की कमी को मिशन की गंभीर गलतियों का मुख्य जोखिम क्यों माना जाता है?",
    questionHinglish: ["sleep deprivation se mission risk kyu badhta hai", "fatigue critical errors space"],
    keywords: ["deprivation", "risk", "errors", "vigilance", "reaction", "safety"],
    answerEn:
      "Chronic sleep loss induces cognitive micro-sleeps, slows psychomotor reaction time by over 300 percent, degrades spatial situational awareness, and impairs emergency decision-making. In spacecraft docking or EVA operations, a fraction of a second lapse can have catastrophic outcomes.",
    answerHi:
      "नींद की कमी से दिमाग में अनजाने में सेकंड भर की झपकी (Micro-sleep) आ सकती है और प्रतिक्रिया समय 300% तक धीमा हो जाता है। जटिल स्पेसवॉक या डॉकिंग के दौरान पल भर की असावधानी भी यान और क्रू के लिए जानलेवा साबित हो सकती है।",
  },
  {
    id: "sf-13",
    category: "sleep",
    intent: "sleep_interruption_countermeasures",
    questionEn: "What countermeasures help when sleep is severely interrupted in orbit?",
    questionHi: "कक्षा में नींद गंभीर रूप से बाधित होने पर क्या उपाय काम आते हैं?",
    questionHinglish: ["neend kharab hone par kya kare space me", "sleep interruption countermeasures"],
    keywords: ["countermeasures", "nap", "powernap", "recovery", "melatonin"],
    answerEn:
      "When sleep is interrupted by alarms or duty demands: schedule a strategic 20 to 25 minute power nap before mid-day operations, avoid caffeine within 6 hours of the next sleep block, engage in high-intensity cardiovascular flush, and coordinate schedule deconfliction with ground support.",
    answerHi:
      "यदि अलार्म या ड्यूटी के कारण नींद टूट जाए: दोपहर में 20 से 25 मिनट की पावर नैप (झपकी) लें, सोने से 6 घंटे पहले कैफीन से बचें, हल्का व्यायाम करें और ग्राउंड कंट्रोल से अनावश्यक शेड्यूल टालने का अनुरोध करें।",
  },
  {
    id: "sf-14",
    category: "sleep",
    intent: "solid_state_lighting_melatonin",
    questionEn: "How does cabin solid-state lighting regulate astronaut melatonin?",
    questionHi: "केबिन की सॉलिड-स्टेट लाइटिंग मेलाटोनिन हार्मोन को कैसे नियंत्रित करती है?",
    questionHinglish: ["cabin lighting melatonin kaise control karti hai", "blue light vs red light space"],
    keywords: ["lighting", "melatonin", "blue-enriched", "red-shifted", "led", "circadian"],
    answerEn:
      "ISS Solid-State Light Assemblies (SSLAs) utilize 480nm blue-enriched high-lux illumination in the morning to suppress melatonin and stimulate alertness. In the evening, the system switches to 2700K low-intensity red-shifted light, allowing endogenous pineal melatonin secretion to peak naturally.",
    answerHi:
      "केबिन की उन्नत एलईडी लाइटें सुबह के समय 480nm की ब्लू-लाइट उत्सर्जित करती हैं जो मेलाटोनिन को रोककर चुस्ती लाती हैं। शाम को यह लाल रंग की मंद रोशनी में बदल जाती हैं, जिससे शरीर में स्वाभाविक रूप से मेलाटोनिन बढ़ता है और नींद आने लगती है।",
  },
  {
    id: "sf-15",
    category: "sleep",
    intent: "sleep_apnea_microgravity",
    questionEn: "Can microgravity cause or worsen central or obstructive sleep apnea?",
    questionHi: "क्या भारहीनता में स्लीप एपनिया (Sleep Apnea) की बीमारी हो सकती है?",
    questionHinglish: ["space me sleep apnea hota hai kya", "breathing stopping in sleep microgravity"],
    keywords: ["sleep", "apnea", "central", "obstructive", "breathing", "snoring"],
    answerEn:
      "Interestingly, obstructive sleep apnea often decreases in microgravity because gravity no longer pulls the tongue and soft palate backward into the pharynx. However, central sleep apnea episodes can increase due to altered chemoreceptor CO2 responsiveness and fluid shift pressures on the brainstem.",
    answerHi:
      "दिलचस्प बात यह है कि भारहीनता में खर्राटे और ऑब्सट्रक्टिव एपनिया कम हो जाते हैं क्योंकि जीभ पीछे गले में नहीं गिरती। लेकिन मस्तिष्क द्वारा सांस रोकने का संकेत देने वाला 'सेंट्रल स्लीप एपनिया' CO2 संतुलन बिगड़ने के कारण बढ़ सकता है।",
  },
  {
    id: "sf-16",
    category: "sleep",
    intent: "light_therapy_glasses",
    questionEn: "What is the role of light therapy glasses in circadian alignment?",
    questionHi: "जैविक घड़ी ठीक रखने में लाइट थेरेपी चश्मों की क्या भूमिका है?",
    questionHinglish: ["light therapy glasses space use", "circadian alignment glasses"],
    keywords: ["light", "therapy", "glasses", "goggles", "alignment", "melatonin"],
    answerEn:
      "Portable light therapy visors deliver targeted narrow-bandwidth cyan light directly to retinal ganglion cells. Astronauts wear them for 30 minutes upon waking to accelerate circadian phase-locking, particularly during mission phases when station module lighting configurations cannot be personalized.",
    answerHi:
      "लाइट थेरेपी चश्मे रेटिना की विशेष कोशिकाओं तक सीधे नियंत्रित सियान रोशनी पहुंचाते हैं। उठने के बाद इन्हें 30 मिनट पहनने से जैविक घड़ी तुरंत दिन के मोड में आ जाती है, खासकर जब केबिन की मुख्य लाइटें व्यक्तिगत रूप से बदली न जा सकें।",
  },
  {
    id: "sf-17",
    category: "sleep",
    intent: "caffeine_timing_orbit",
    questionEn: "How should caffeine intake timing be managed during mission operations?",
    questionHi: "मिशन कार्यों के दौरान कैफीन (कॉफी/चाय) का सेवन कब करना चाहिए?",
    questionHinglish: ["space me coffee kab pini chahiye", "caffeine timing in orbit"],
    keywords: ["caffeine", "coffee", "timing", "half-life", "adenosine", "sleep"],
    answerEn:
      "Caffeine has an average systemic half-life of 5 to 7 hours. In orbit, flight surgeons recommend consuming caffeine exclusively within the first 6 hours of wakefulness (maximum 200–300 mg) to prevent competitive antagonism of adenosine receptors during scheduled sleep windows.",
    answerHi:
      "कैफीन का असर शरीर में 5 से 7 घंटे तक रहता है। अंतरिक्ष में सलाह दी जाती है कि जागने के शुरुआती 6 घंटों के भीतर ही सीमित मात्रा में (200-300 mg) चाय या कॉफी पिएं, ताकि सोते समय यह मस्तिष्क के रिसेप्टर्स में बाधा न डाले।",
  },
  {
    id: "sf-18",
    category: "sleep",
    intent: "sleep_inertia_emergency",
    questionEn: "What is sleep inertia and how can astronauts mitigate it during emergencies?",
    questionHi: "स्लीप इनर्शिया (नींद का खुमार) क्या है और आपातकाल में इसे कैसे कम करें?",
    questionHinglish: ["sleep inertia kya hota hai", "sudden alarm waking grogginess"],
    keywords: ["sleep", "inertia", "grogginess", "emergency", "awakening", "cognitive"],
    answerEn:
      "Sleep inertia is the temporary grogginess and cognitive impairment lasting 10 to 30 minutes following abrupt awakening, especially from slow-wave sleep. Astronauts mitigate it via pre-memorized tactile abort drills, rapid exposure to high-intensity cabin lighting, and cold facial wiping.",
    answerHi:
      "गहरी नींद से अचानक जागने पर 10 से 30 मिनट तक रहने वाली भारी सुस्ती और भ्रम की स्थिति को स्लीप इनर्शिया कहते हैं। अचानक आपातकालीन अलार्म बजने पर तेज रोशनी, ठंडे पानी का पोंछा और रटे हुए सुरक्षा अभ्यास इसके प्रभाव को तेजी से कम करते हैं।",
  },
  {
    id: "sf-19",
    category: "sleep",
    intent: "sleep_deficit_cognitive_alert",
    questionEn: "How does ASTRA alert me if my sleep deficit is impairing alertness?",
    questionHi: "ASTRA मुझे कैसे चेतावनी देता है यदि नींद की कमी मेरी सतर्कता घटा रही है?",
    questionHinglish: ["astra sleep alert kab deta hai", "sleep deficit cognitive warning"],
    keywords: ["sleep", "deficit", "alert", "cognitive", "warning", "fatigue"],
    answerEn:
      "When sleep logs fall below 6 hours across two consecutive days or rolling sleep deficit exceeds 3 hours, ASTRA triggers an operational FATIGUE ALERT badge, displays a cautionary banner on your overview, and suggests re-scheduling high-dexterity robotic or docking simulations.",
    answerHi:
      "जब लगातार दो दिनों तक नींद 6 घंटे से कम दर्ज होती है या कुल कमी 3 घंटे से अधिक हो जाती है, तो ASTRA तुरंत FATIGUE ALERT जारी करता है और जटिल रोबोटिक या स्पेसवॉक अभ्यास टालने की सलाह देता है।",
  },
  {
    id: "sf-20",
    category: "sleep",
    intent: "cannot_sleep_in_quarters",
    questionEn: "What should I do if I cannot fall asleep in the crew sleeping quarters?",
    questionHi: "यदि मुझे अपने क्रू क्वार्टर में नींद न आ रही हो तो मुझे क्या करना चाहिए?",
    questionHinglish: ["agar neend na aaye to kya kare space me", "trouble sleeping in crew quarters"],
    keywords: ["cannot", "sleep", "quarters", "carm", "restless", "tips"],
    answerEn:
      "If you cannot sleep within 25 minutes: do not struggle in your tether. Dim all lighting completely, run a 10-minute guided autogenic relaxation audio track, check cabin ventilation airflow across your head to eliminate CO2 accumulation, and perform slow diaphragmatic breathing.",
    answerHi:
      "यदि 25 मिनट तक नींद न आए: जबरदस्ती सोने का प्रयास न करें। लाइट पूरी बंद करें, 10 मिनट का रिलैक्सेशन ऑडियो सुनें, सुनिश्चित करें कि पंखे की हवा सिर तक आ रही है (ताकि CO2 न जमे), और गहरी सांस लेने की क्रिया करें।",
  },
];
