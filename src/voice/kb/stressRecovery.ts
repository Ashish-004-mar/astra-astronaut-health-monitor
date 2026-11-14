import type { KnowledgeEntry } from "../types";

export const stressRecoveryEntries: KnowledgeEntry[] = [
  {
    id: "sr-01",
    category: "stress",
    intent: "current_stress_score",
    questionEn: "What is my current stress level?",
    questionHi: "मेरा वर्तमान तनाव स्तर (Stress Level) क्या है?",
    questionHinglish: ["mera stress level kaisa hai", "current stress score kitna hai", "tanaav check karo"],
    keywords: ["stress", "level", "score", "index", "current", "tanaav"],
    isDynamic: true,
    answerEn: (ctx) => {
      const diff = ctx.stress - ctx.baselineStress;
      const tier = ctx.stress < 40 ? "LOW / NOMINAL" : ctx.stress < 65 ? "MODERATE / ADAPTIVE" : "ELEVATED / STRAIN";
      return `Your current stress score is registered at ${ctx.stress} out of 100 (${tier}). Your personal baseline is ${ctx.baselineStress} (${diff >= 0 ? "+" : ""}${diff} variance). Physiological recovery is ${ctx.stress < 50 ? "robust with balanced autonomic nervous system tone" : "experiencing sustained allostatic friction; consider a 15-minute mindfulness breathing block"}.`;
    },
    answerHi: (ctx) => {
      const diff = ctx.stress - ctx.baselineStress;
      const tier = ctx.stress < 40 ? "कम / सामान्य (LOW)" : ctx.stress < 65 ? "मध्यम (MODERATE)" : "अधिक (HIGH)";
      return `आपका वर्तमान तनाव स्कोर 100 में से ${ctx.stress} है (${tier})। आपका बेसलाइन स्कोर ${ctx.baselineStress} है (${diff >= 0 ? "+" : ""}${diff} अंतर)। शारीरिक रिकवरी ${ctx.stress < 50 ? "पूरी तरह संतुलित और नियंत्रण में है" : "तनाव थोड़ा बढ़ा हुआ है; 15 मिनट का डीप ब्रीदिंग अभ्यास करने की सलाह दी जाती है"}।`;
    },
  },
  {
    id: "sr-02",
    category: "stress",
    intent: "how_astra_quantifies_stress",
    questionEn: "How does ASTRA quantify physiological stress?",
    questionHi: "ASTRA शारीरिक तनाव की गणना कैसे करता है?",
    questionHinglish: ["astra stress kaise calculate karta hai", "stress scoring methodology astra"],
    keywords: ["quantify", "calculate", "stress", "score", "formula", "hrv"],
    answerEn:
      "ASTRA computes stress through a composite algorithm synthesizing autonomic pulse variability, elevation of resting heart rate above baseline, nocturnal dipping efficiency, and the astronaut's subjective self-reported stress ratings.",
    answerHi:
      "ASTRA तनाव की गणना एक समग्र मॉडल से करता है, जिसमें हार्ट रेट वेरिएबिलिटी (HRV), सामान्य से अधिक पल्स रेट, सोते समय दिल की धड़कन में गिरावट और आपके द्वारा चेक-इन में दर्ज किए गए रेटिंग्स का विश्लेषण शामिल होता है।",
  },
  {
    id: "sr-03",
    category: "stress",
    intent: "primary_psychological_stressors",
    questionEn: "What are the primary psychological stressors of long spaceflight?",
    questionHi: "लंबे अंतरिक्ष मिशनों में मुख्य मानसिक तनाव पैदा करने वाले कारक क्या हैं?",
    questionHinglish: ["space me mental stress kyu hota hai", "astronaut psychological stressors"],
    keywords: ["psychological", "stressors", "isolation", "confinement", "monotony", "danger"],
    answerEn:
      "Primary stressors include physical isolation from loved ones, strict sensory confinement in high-noise modules, continuous awareness of life-threatening operational hazards, rigid mission timelines, lack of privacy, and interpersonal friction with crewmates over 6 to 12 months.",
    answerHi:
      "मुख्य कारकों में परिजनों से लंबी दूरी, सीमित और शोरगुल वाले केबिन में बंद रहना, हर समय जानलेवा खतरों की आशंका, लगातार सख्त टाइम-टेबल, व्यक्तिगत एकांत (Privacy) का अभाव और महीनों तक एक ही छोटे समूह के साथ रहना शामिल हैं।",
  },
  {
    id: "sr-04",
    category: "stress",
    intent: "cortisol_neuroendocrine_space",
    questionEn: "How does microgravity affect cortisol and neuroendocrine regulation?",
    questionHi: "माइक्रोग्रैविटी कोर्टिसोल हार्मोन और न्यूरोएंडोक्राइन प्रणाली को कैसे बदलती है?",
    questionHinglish: ["space me cortisol hormone kaise badalta hai", "stress hormone microgravity"],
    keywords: ["cortisol", "hormone", "neuroendocrine", "adrenal", "hpa-axis"],
    answerEn:
      "Microgravity triggers hypothalamic-pituitary-adrenal (HPA) axis activation. Plasma and salivary free cortisol levels rise sharply during launch and orbital insertion, then adapt to a chronically elevated or blunted diurnal curve, directly suppressing cellular immunity and altering glucose metabolism.",
    answerHi:
      "भारहीनता और मिशन दबाव से कोर्टिसोल (तनाव हार्मोन) का स्तर बढ़ जाता है। विशेषकर शुरुआत में एड्रेनल ग्रंथियां अधिक सक्रिय होती हैं। लंबे समय में कोर्टिसोल का असामान्य स्तर रोग प्रतिरोधक क्षमता घटा सकता है और मूड में बदलाव ला सकता है।",
  },
  {
    id: "sr-05",
    category: "stress",
    intent: "overview_effect_mental_health",
    questionEn: "What is the Overview Effect and how does it influence mental health?",
    questionHi: "ओवरव्यू इफेक्ट (Overview Effect) क्या है और यह मानसिक स्वास्थ्य को कैसे प्रभावित करता है?",
    questionHinglish: ["overview effect kya hai", "earth dekhne ka mental effect"],
    keywords: ["overview", "effect", "earth", "cupola", "mental", "awe", "transcendence"],
    answerEn:
      "The Overview Effect is a profound cognitive and emotional shift reported by astronauts when viewing Earth from orbit. Witnessing the fragile blue oasis against deep void triggers feelings of cosmic awe, interconnectedness, peace, and cognitive renewal, acting as a natural psychological buffer against orbital depression.",
    answerHi:
      "कक्षा से पृथ्वी को एक नाजुक नीले ग्रह के रूप में अंतरिक्ष के अंधकार में देखना मन में असीम विस्मय, शांति और एकता का गहरा अहसास जगाता है। इसे 'ओवरव्यू इफेक्ट' कहते हैं, जो मानसिक तनाव को दूर करने और आत्मिक ऊर्जा देने में अत्यंत मददगार साबित होता है।",
  },
  {
    id: "sr-06",
    category: "stress",
    intent: "managing_isolation_confinement",
    questionEn: "How do astronauts manage isolation and confinement over 6 to 12 months?",
    questionHi: "अंतरिक्ष यात्री 6 से 12 महीने तक अकेलेपन और सीमित स्थान का सामना कैसे करते हैं?",
    questionHinglish: ["space me loneliness kaise jhelte hai", "isolation and confinement management"],
    keywords: ["isolation", "confinement", "loneliness", "coping", "coping-strategies"],
    answerEn:
      "Astronauts rely on structured routines, shared communal crew dinners, personal hobby time (photography, music, reading in the Cupola), regular video uplink calls with families, peer support, and active mindfulness training provided by mission behavioral health teams.",
    answerHi:
      "यात्री नियमित दिनचर्या, साथी अंतरिक्ष यात्रियों के साथ बैठकर भोजन, व्यक्तिगत शौक (जैसे फोटोग्राफी, संगीत या खिड़की से पृथ्वी देखना), परिवार से नियमित वीडियो कॉलिंग और माइंडफुलनेस के माध्यम से अकेलेपन से निपटते हैं।",
  },
  {
    id: "sr-07",
    category: "stress",
    intent: "guided_relaxation_breathing",
    questionEn: "What breathing techniques are recommended aboard ASTRA?",
    questionHi: "ASTRA पर तनाव कम करने के लिए कौन सी श्वास तकनीकें सुझाई गई हैं?",
    questionHinglish: ["stress kam karne ki breathing technique", "box breathing in space"],
    keywords: ["breathing", "relaxation", "box", "vagus", "parasympathetic", "4-7-8"],
    answerEn:
      "ASTRA recommends Tactical Box Breathing: inhale for 4 seconds, hold for 4 seconds, exhale smoothly for 4 seconds, and hold empty for 4 seconds. Repeating this cycle for 5 minutes activates the vagus nerve, rapidly lowering acute adrenergic heart rate spikes.",
    answerHi:
      "ASTRA 'टैक्टिकल बॉक्स ब्रीदिंग' की सलाह देता है: 4 सेकंड सांस अंदर लें, 4 सेकंड सांस रोकें, 4 सेकंड में सांस बाहर छोड़ें, और 4 सेकंड खाली पेट रुकें। 5 मिनट तक इसे दोहराने से वेगस नर्व सक्रिय होती है और दिल की धड़कन तुरंत शांत हो जाती है।",
  },
  {
    id: "sr-08",
    category: "stress",
    intent: "stress_immune_suppression_link",
    questionEn: "What is the relationship between elevated stress and immune suppression?",
    questionHi: "अधिक तनाव और रोग प्रतिरोधक क्षमता में कमी के बीच क्या संबंध है?",
    questionHinglish: ["tanaav se immunity kam kyu hoti hai", "stress and immune suppression link"],
    keywords: ["stress", "immune", "suppression", "cortisol", "cytokines", "infection"],
    answerEn:
      "Sustained psychological and environmental stress floods the circulatory system with glucocorticoids and catecholamines. These hormones suppress interleukin production, downregulate natural killer cell cytotoxicity, and leave astronauts vulnerable to opportunistic rashes and viral shedding.",
    answerHi:
      "लगातार तनाव रहने से शरीर में कोर्टिसोल और एड्रेनालाईन जैसे हार्मोन बढ़ जाते हैं। ये हार्मोन शरीर की रोग प्रतिरोधक टी-कोशिकाओं को दबा देते हैं, जिससे त्वचा पर चकत्ते, एलर्जी और पुराने वायरस दोबारा उभरने का खतरा बढ़ जाता है।",
  },
  {
    id: "sr-09",
    category: "stress",
    intent: "communication_delay_impact",
    questionEn: "How do communication delays impact crew psychological well-being?",
    questionHi: "संचार में देरी (Communication Delay) का चालक दल के मानसिक स्वास्थ्य पर क्या प्रभाव पड़ता है?",
    questionHinglish: ["mars mission communication delay stress", "signal delay mental health"],
    keywords: ["communication", "delay", "latency", "mars", "autonomy", "support"],
    answerEn:
      "On lunar or Martian missions, radio signals encounter delays from seconds up to 22 minutes each way. This eliminates real-time conversation with loved ones and mission control, forcing crews to develop extreme autonomous problem solving and heightened internal mutual emotional reliance.",
    answerHi:
      "मंगल या गहरे अंतरिक्ष मिशनों में रेडियो संकेतों को आने-जाने में 5 से 22 मिनट का समय लगता है। वास्तविक समय में बात न हो पाने से अकेलापन बढ़ता है, जिसके लिए क्रू को अत्यंत आत्मनिर्भर और आपस में भावनात्मक रूप से मजबूत होना पड़ता है।",
  },
  {
    id: "sr-10",
    category: "stress",
    intent: "third_quarter_phenomenon",
    questionEn: "What is the psychological Third-Quarter Phenomenon during missions?",
    questionHi: "मिशन के दौरान मनोवैज्ञानिक थर्ड-क्वार्टर फेनोमेनन (तीसरा पहर) क्या है?",
    questionHinglish: ["third quarter phenomenon kya hota hai", "mission mid point depression"],
    keywords: ["third-quarter", "phenomenon", "midpoint", "depression", "burnout"],
    answerEn:
      "The Third-Quarter Phenomenon is a documented dip in morale, motivation, and interpersonal patience occurring around the 50 to 75 percent mark of an expedition. The initial novelty has faded while the return date remains distant. Behavioral monitoring increases during this delicate phase.",
    answerHi:
      "थर्ड-क्वार्टर फेनोमेनन किसी मिशन के 50% से 75% समय बीतने पर उत्साह और धैर्य में आने वाली स्वाभाविक गिरावट है। शुरुआत का रोमांच खत्म हो चुका होता है और वापसी अभी दूर होती है। इस समय चालक दल के आपसी संवाद पर विशेष ध्यान दिया जाता है।",
  },
  {
    id: "sr-11",
    category: "stress",
    intent: "crew_cohesion_interpersonal",
    questionEn: "How do interpersonal dynamics and crew cohesion influence mission success?",
    questionHi: "आपसी तालमेल और क्रू सामंजस्य मिशन की सफलता को कैसे प्रभावित करते हैं?",
    questionHinglish: ["crew cohesion kyu zaroori hai", "interpersonal dynamics in space"],
    keywords: ["cohesion", "interpersonal", "dynamics", "crew", "teamwork", "conflict"],
    answerEn:
      "In high-stakes isolated environments, unaddressed interpersonal tension can lead to communication breakdowns, team fragmentation, and mission-threatening coordination errors. Crewmembers train extensively in empathetic communication, conflict de-escalation, and shared group leadership.",
    answerHi:
      "सीमित स्थान में अनसुलझे आपसी मनमुटाव टीम वर्क को बिगाड़ सकते हैं और गंभीर गलतियों का कारण बन सकते हैं। इसलिए अंतरिक्ष यात्री सहानुभूतिपूर्ण संवाद, विवाद सुलझाने और एक-दूसरे के सहयोग का विशेष मनोवैज्ञानिक प्रशिक्षण लेते हैं।",
  },
  {
    id: "sr-12",
    category: "stress",
    intent: "family_conferences_value",
    questionEn: "What role do Earth family conferences play in psychological health?",
    questionHi: "पृथ्वी पर परिवार से वीडियो कॉन्फ्रेंस मानसिक स्वास्थ्य में क्या भूमिका निभाती है?",
    questionHinglish: ["family call space me kyu zaroori hai", "earth family conference mental health"],
    keywords: ["family", "conferences", "uplink", "video", "morale", "support"],
    answerEn:
      "Weekly private family video conferences are the single most effective psychological countermeasure aboard space stations. Maintaining normal family connectivity grounds the astronaut's terrestrial identity, alleviates homesickness, and sustains long-term resilience.",
    answerHi:
      "परिवार के साथ साप्ताहिक निजी वीडियो कॉन्फ्रेंस अंतरिक्ष में सबसे असरदार मानसिक संबल है। अपनों से नियमित बातचीत यात्री को भावनात्मक रूप से जोड़े रखती है, घर की याद (Homesickness) को कम करती है और कार्यक्षमता बनाए रखती है।",
  },
  {
    id: "sr-13",
    category: "stress",
    intent: "journaling_checkins_alleviation",
    questionEn: "How does journaling or daily check-ins alleviate space expedition stress?",
    questionHi: "दैनिक चेक-इन या डायरी लिखने से अंतरिक्ष का तनाव कैसे कम होता है?",
    questionHinglish: ["daily checkin karne se kya fayda hota hai", "journaling stress relief space"],
    keywords: ["journaling", "check-in", "expression", "reflection", "catharsis"],
    answerEn:
      "Self-directed journaling provides emotional catharsis and metacognitive clarity. It allows astronauts to process frustration without burdening colleagues or ground controllers, while providing longitudinal behavioral self-awareness over multi-month orbital deployments.",
    answerHi:
      "दैनिक चेक-इन और डायरी लिखना मन के भावों को बिना किसी झिझक के व्यक्त करने का माध्यम बनता है। इससे अपनी भावनाओं को समझने में मदद मिलती है और मिशन के दौरान मानसिक संतुलन और आत्म-जागरूकता बनी रहती है।",
  },
  {
    id: "sr-14",
    category: "stress",
    intent: "sympathetic_overactivation_signs",
    questionEn: "What physiological signs indicate sympathetic nervous overactivation?",
    questionHi: "सिम्पैथेटिक तंत्रिका तंत्र के अत्यधिक सक्रिय होने के शारीरिक लक्षण क्या हैं?",
    questionHinglish: ["sympathetic overactivation ke lakshan kya hai", "signs of high stress body"],
    keywords: ["sympathetic", "overactivation", "adrenaline", "tachycardia", "tremors", "sweat"],
    answerEn:
      "Key signs include persistent resting tachycardia (pulse 15+ BPM above baseline), loss of nocturnal heart rate deceleration, micro-tremors during fine motor tasks, shallow thoracic breathing, pupillary dilation, and elevated galvanic skin conductance.",
    answerHi:
      "इसके मुख्य लक्षणों में आराम करते समय भी दिल की तेज धड़कन, सोते समय पल्स का कम न होना, हाथों में बारीक कंपन, उथली और तेज सांसें, पुतलियों का फैलना और हथेलियों पर पसीना आना शामिल हैं।",
  },
  {
    id: "sr-15",
    category: "stress",
    intent: "exercise_as_stress_reliever",
    questionEn: "How does physical exercise function as a psychological stress reliever in orbit?",
    questionHi: "शारीरिक व्यायाम कक्षा में मानसिक तनाव से राहत दिलाने में कैसे मदद करता है?",
    questionHinglish: ["exercise se stress kam kaise hota hai space me", "workout mental health space"],
    keywords: ["exercise", "stress", "endorphins", "bdnf", "running", "ared"],
    answerEn:
      "In addition to preserving bones and muscle, rigorous daily training releases beta-endorphins, stimulates brain-derived neurotrophic factor (BDNF), metabolizes circulating stress catecholamines, and provides a structured sensory outlet where astronauts can listen to music and disconnect from mission consoles.",
    answerHi:
      "हड्डियों और मांसपेशियों को मजबूत रखने के अलावा, व्यायाम शरीर में एंडोर्फिन (फील-गुड हार्मोन) रिलीज करता है, तनाव रसायनों को खत्म करता है और मानसिक ताजगी देता है। संगीत सुनते हुए कसरत करना एकांत और सुकून का बेहतरीन समय बन जाता है।",
  },
  {
    id: "sr-16",
    category: "stress",
    intent: "autonomic_nocturnal_recovery",
    questionEn: "What is autonomic recovery and why is nighttime recovery critical?",
    questionHi: "ऑटोनोमिक रिकवरी क्या है और रात में रिकवरी होना क्यों महत्वपूर्ण है?",
    questionHinglish: ["autonomic recovery kya hai", "nocturnal recovery in sleep"],
    keywords: ["autonomic", "recovery", "nocturnal", "parasympathetic", "dipping"],
    answerEn:
      "Autonomic recovery occurs when the parasympathetic vagal system downshifts myocardial pacing during deep sleep. Without adequate nocturnal heart rate dipping (at least 10 to 15 percent below daytime averages), vascular walls remain under chronic tension, elevating the risk of cardiovascular fatigue.",
    answerHi:
      "ऑटोनोमिक रिकवरी वह प्रक्रिया है जिसमें गहरी नींद के दौरान दिल की धड़कन स्वाभाविक रूप से दिन के औसत से 10-15% धीमी हो जाती है। यदि रात में यह रिकवरी न हो, तो रक्त वाहिकाएं तनाव में रहती हैं जिससे दिल पर लगातार दबाव बना रहता है।",
  },
  {
    id: "sr-17",
    category: "stress",
    intent: "sensory_monotony_confinement",
    questionEn: "How does sensory monotony affect the human brain in confined habitats?",
    questionHi: "सीमित आवास में एक जैसी दिनचर्या और वातावरण (Sensory Monotony) का मस्तिष्क पर क्या असर होता है?",
    questionHinglish: ["sensory monotony space me dimaag pe kya asar karti hai", "boredom in orbit"],
    keywords: ["sensory", "monotony", "deprivation", "boredom", "neuroplasticity"],
    answerEn:
      "Monotonous environments with uniform metallic walls, hum of machinery, and packaged rations induce sensory under-stimulation. Over time, this can lead to cognitive slowing, irritability, anhedonia, and emotional blunting unless counteracted with varied music, culinary variety, and novel visual stimuli.",
    answerHi:
      "महीनों तक एक ही जैसी धातु की दीवारें, मशीनों की आवाज और पैकेट का खाना मस्तिष्क को एकरसता की ओर धकेल देता है। इससे चिड़चिड़ापन और सुस्ती आ सकती है, जिसे दूर करने के लिए संगीत, अलग-अलग स्वाद का भोजन और मनोरंजक गतिविधियों की आवश्यकता होती है।",
  },
  {
    id: "sr-18",
    category: "stress",
    intent: "virtual_reality_earth_simulation",
    questionEn: "Can Virtual Reality or nature audio simulate Earth environments for relaxation?",
    questionHi: "क्या वर्चुअल रियलिटी (VR) या प्रकृति की आवाजें तनाव कम करने में मदद कर सकती हैं?",
    questionHinglish: ["vr nature simulation space relaxation", "virtual reality stress relief"],
    keywords: ["virtual", "reality", "vr", "nature", "audio", "relaxation", "forest"],
    answerEn:
      "Yes. Immersive VR headsets loaded with lush 3D forest environments, rain falling on leaves, ocean shores, and binaural nature audio significantly reduce salivary cortisol and self-reported anxiety scores, providing cognitive respite from the technological confines of the spacecraft.",
    answerHi:
      "हाँ। 3D वर्चुअल रियलिटी हेडसेट में हरे-भरे जंगलों, बारिश की बूंदों और समुद्र की लहरों के दृश्य और ध्वनियां देखने-सुनने से तनाव हार्मोन कोर्टिसोल तेजी से घटता है और मस्तिष्क को पृथ्वी के प्राकृतिक माहौल जैसा विश्राम मिलता है।",
  },
  {
    id: "sr-19",
    category: "stress",
    intent: "stress_spikes_critical_operations",
    questionEn: "What should I do if my stress score spikes during critical operations?",
    questionHi: "यदि किसी महत्वपूर्ण ऑपरेशन के दौरान तनाव अचानक बढ़ जाए तो मुझे क्या करना चाहिए?",
    questionHinglish: ["critical operation ke time stress badh jaye to kya kare", "handling acute space stress"],
    keywords: ["spikes", "critical", "operations", "acute", "calm", "checklist"],
    answerEn:
      "In acute high-stress moments: pause for 3 seconds, take a deep diaphragmatic breath, ground yourself on physical handrails, fall back strictly to published operational flight checklists, communicate calmly with your crewmate, and prioritize one tactical step at a time.",
    answerHi:
      "अचानक तनाव बढ़ने पर: 3 सेकंड रुकें, एक गहरी सांस लें, हैंडरेल को मजबूती से पकड़ें, केवल अपनी चेकलिस्ट के एक-एक कदम पर ध्यान दें, साथी से स्पष्ट बातचीत करें और एक समय में सिर्फ एक काम पूरा करें।",
  },
  {
    id: "sr-20",
    category: "stress",
    intent: "acute_stress_vs_chronic_burnout",
    questionEn: "How does ASTRA separate acute performance stress from chronic burnout?",
    questionHi: "ASTRA तात्कालिक कार्य तनाव और लंबे समय की थकान (Burnout) में अंतर कैसे करता है?",
    questionHinglish: ["acute stress aur chronic burnout me fark astra", "burnout detection engine"],
    keywords: ["acute", "chronic", "burnout", "performance", "distinction", "fatigue"],
    answerEn:
      "Acute stress causes brief spikes in heart rate and sympathetic tone that rapidly recover once an operational task ends. Chronic burnout, conversely, manifests as flatline blunted HRV, chronically elevated resting heart rate across multiple sleep cycles, and persistent subjective exhaustion in daily check-ins.",
    answerHi:
      "तात्कालिक तनाव किसी काम के दौरान थोड़े समय के लिए पल्स बढ़ाता है और काम खत्म होते ही सामान्य हो जाता है। जबकि क्रोनिक बर्नआउट में लगातार कई दिनों तक रेस्टिंग पल्स बढ़ी रहती है, नींद के बाद भी थकान दूर नहीं होती और चेक-इन में ऊर्जा का स्तर लगातार कम रहता है।",
  },
];
