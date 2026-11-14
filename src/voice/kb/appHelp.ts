import type { KnowledgeEntry } from "../types";

export const appHelpEntries: KnowledgeEntry[] = [
  {
    id: "oh-01",
    category: "help",
    intent: "how_voice_assistant_offline",
    questionEn: "How does ASTRA Voice work completely offline without internet?",
    questionHi: "ASTRA वॉइस बिना इंटरनेट के पूरी तरह ऑफलाइन कैसे काम करता है?",
    questionHinglish: ["astra voice offline kaise chalta hai", "how offline voice assistant works"],
    keywords: ["offline", "voice", "assistant", "local", "internet", "speech"],
    answerEn:
      "ASTRA Voice operates using an embedded aerospace knowledge base of 160 curated bilingual topics, an in-browser deterministic intent matcher, local Web Speech synthesis, and zero remote cloud server dependencies. All telemetry calculation and audio processing run strictly inside your client browser.",
    answerHi:
      "ASTRA वॉइस 160 प्रमाणित द्विभाषी प्रश्नों के इनबिल्ट डेटाबेस, स्थानीय इंटेंट मैचर और ब्राउज़र के इन-मेमोरी स्पीच इंजन पर काम करता है। इसके लिए किसी रिमोट सर्वर या क्लाउड की आवश्यकता नहीं होती और यह पूरी तरह ऑफलाइन संचालित होता है।",
  },
  {
    id: "oh-02",
    category: "help",
    intent: "supported_languages_voice",
    questionEn: "What languages does ASTRA Voice support?",
    questionHi: "ASTRA वॉइस किन भाषाओं का समर्थन करता है?",
    questionHinglish: ["astra kaunsi bhasha samajhta hai", "supported languages in astra voice"],
    keywords: ["languages", "english", "hindi", "hinglish", "bilingual", "bhasha"],
    answerEn:
      "ASTRA Voice provides complete bilingual support in English and Hindi (हिन्दी), including phonetic matching for Romanized Hindi (Hinglish) voice queries. You can seamlessly switch display and voice response language using the EN / HI toggle button.",
    answerHi:
      "ASTRA वॉइस अंग्रेजी और हिन्दी दोनों भाषाओं का पूर्ण समर्थन करता है। यह रोमन लिपि में लिखी गई हिन्दी (Hinglish) के वॉयस प्रश्नों को भी आसानी से समझ लेता है। आप 'EN / HI' बटन दबाकर भाषा कभी भी बदल सकते हैं।",
  },
  {
    id: "oh-03",
    category: "help",
    intent: "adjust_speech_rate_settings",
    questionEn: "How do I adjust the speech rate or disable voice output?",
    questionHi: "मैं बोलने की गति (Speed) कैसे बदलूँ या आवाज़ बंद कैसे करूँ?",
    questionHinglish: ["voice speed kaise change kare", "speech rate adjust mute voice"],
    keywords: ["speech", "rate", "speed", "disable", "mute", "settings", "awaaz"],
    answerEn:
      "Navigate to the 'Settings' page in the top menu. Under the 'Voice Assistant' section, you can toggle voice synthesis on or off, adjust playback rate between 0.8x, 1.0x, and 1.2x, and choose your preferred language profile.",
    answerHi:
      "ऊपरी मेनू में 'Settings' पेज पर जाएं। 'Voice Assistant' सेक्शन में आप आवाज को चालू/बंद (Mute) कर सकते हैं, बोलने की गति को 0.8x, 1.0x या 1.2x पर सेट कर सकते हैं और पसंदीदा भाषा चुन सकते हैं।",
  },
  {
    id: "oh-04",
    category: "help",
    intent: "navigate_dashboard_sections",
    questionEn: "How do I navigate between different sections of the dashboard?",
    questionHi: "मैं डैशबोर्ड के विभिन्न अनुभागों के बीच कैसे नेविगेट करूँ?",
    questionHinglish: ["dashboard me alag alag page kaise khole", "navigation between sections astra"],
    keywords: ["navigate", "sections", "tabs", "overview", "health", "checkin", "settings"],
    answerEn:
      "Use the persistent top navigation bar to switch between the five primary operational screens: Overview (digital twin and biometrics), My Health (interactive trend graphs and PDF export), Check-in (daily self-assessment), Space Weather (solar flux), and Settings.",
    answerHi:
      "स्क्रीन के सबसे ऊपर मौजूद नेविगेशन बार से आप मुख्य 5 सेक्शन में जा सकते हैं: Overview (3D डिजिटल ट्विन), My Health (चार्ट और पीडीएफ रिपोर्ट), Check-in (दैनिक फॉर्म), Space Weather (सौर विकिरण), और Settings।",
  },
  {
    id: "oh-05",
    category: "help",
    intent: "interact_with_3d_digital_twin",
    questionEn: "How do I interact with the 3D Crew Health Digital Twin?",
    questionHi: "मैं 3D क्रू हेल्थ डिजिटल ट्विन के साथ कैसे इंटरैक्ट करूँ?",
    questionHinglish: ["3d astronaut ko rotate kaise kare", "interact with 3d digital twin"],
    keywords: ["3d", "digital", "twin", "astronaut", "rotate", "zoom", "earth"],
    answerEn:
      "Click and drag on the central 3D astronaut viewport to rotate the astronaut and rotating Earth globe, scroll to zoom in or out, and click the Head, Chest, or Muscles buttons to inspect region-specific physiological diagnostics.",
    answerHi:
      "मध्य में 3D अंतरिक्ष यात्री पर माउस से क्लिक करके खींचने पर वह और पीछे घूमती हुई पृथ्वी घूमेगी, स्क्रॉल करने पर ज़ूम होगा, और Head, Chest या Muscles बटन दबाकर आप संबंधित शारीरिक अंगों के आंकड़े देख सकते हैं।",
  },
  {
    id: "oh-06",
    category: "help",
    intent: "use_live_camera_tracker",
    questionEn: "How do I use the live camera face and body tracker?",
    questionHi: "मैं लाइव कैमरा फेस और बॉडी ट्रैकर का उपयोग कैसे करूँ?",
    questionHinglish: ["camera tracking kaise on kare", "camera panel face tracker astra"],
    keywords: ["camera", "tracker", "face", "body", "webcam", "permission"],
    answerEn:
      "Click 'Enable Camera' in the Camera Tracking panel on the Overview page. When prompted by your browser, grant webcam access. MediaPipe algorithms will automatically detect your facial landmarks and posture directly on your computer without transmitting any imagery.",
    answerHi:
      "Overview पेज पर कैमरा पैनल में 'Enable Camera' बटन दबाएं और ब्राउज़र में अनुमति दें। MediaPipe तकनीक बिना कोई वीडियो रिकॉर्ड किए सीधे आपके चेहरे और बैठने के तरीके का विश्लेषण शुरू कर देगी।",
  },
  {
    id: "oh-07",
    category: "help",
    intent: "voice_misunderstanding_troubleshooting",
    questionEn: "What should I do if voice recognition mishears or fails to answer?",
    questionHi: "यदि वॉइस रिकग्निशन सवाल न समझ पाए तो मुझे क्या करना चाहिए?",
    questionHinglish: ["agar voice samajh na aaye to kya kare", "speech recognition troubleshooting"],
    keywords: ["mishears", "troubleshooting", "fallback", "type", "mic", "retry"],
    answerEn:
      "You can always type your query directly into the text box at the bottom of the ASTRA Voice drawer and hit Enter, or select any of the suggested question chips categorized above the input box for immediate offline answers.",
    answerHi:
      "यदि माइक्रोफोन सही न सुने, तो आप वॉइस पैनल के नीचे दिए गए टेक्स्ट बॉक्स में अपना सवाल लिखकर एंटर दबा सकते हैं, या ऊपर दिए गए सुझाई गई श्रेणियों के किसी भी प्रश्न चिप पर क्लिक कर सकते हैं।",
  },
  {
    id: "oh-08",
    category: "help",
    intent: "mobile_touch_support",
    questionEn: "Can ASTRA run on tablets, mobile devices, and touch screens?",
    questionHi: "क्या ASTRA टैबलेट, मोबाइल और टच स्क्रीन पर चल सकता है?",
    questionHinglish: ["kya astra mobile tablet me chalta hai", "mobile touch support astra"],
    keywords: ["mobile", "tablet", "touch", "responsive", "ipad", "phone"],
    answerEn:
      "Yes. ASTRA is fully responsive and optimized for touch interactions. The 3D astronaut supports single-finger touch rotation and pinch-to-zoom, and the voice assistant floating button adapts seamlessly to handheld mobile viewports.",
    answerHi:
      "हाँ। ASTRA पूरी तरह रिस्पॉन्सिव है। टच स्क्रीन पर 3D अंतरिक्ष यात्री को एक उंगली से घुमाया जा सकता है, दो उंगलियों से ज़ूम किया जा सकता है और वॉइस असिस्टेंट बटन फोन पर भी बहुत आसानी से काम करता है।",
  },
  {
    id: "oh-09",
    category: "help",
    intent: "high_contrast_reduced_motion",
    questionEn: "How do I toggle high contrast or reduced motion settings?",
    questionHi: "हाई कंट्रास्ट या रिड्यूस्ड मोशन (कम गति) सेटिंग्स कैसे बदलें?",
    questionHinglish: ["high contrast mode kaise on kare", "reduced motion setting astra"],
    keywords: ["contrast", "reduced", "motion", "accessibility", "settings"],
    answerEn:
      "Navigate to the Settings tab. You can toggle High Contrast mode for enhanced visual legibility in bright glare environments, or enable Reduced Motion to suspend cosmetic animations while preserving the continuous 3D Earth axial rotation.",
    answerHi:
      "Settings टैब में जाकर आप तेज धूप या रोशनी में साफ देखने के लिए 'High Contrast' ऑन कर सकते हैं, या अनावश्यक एनिमेशन रोकने के लिए 'Reduced Motion' विकल्प चुन सकते हैं।",
  },
  {
    id: "oh-10",
    category: "help",
    intent: "scientific_credentials_disclaimer",
    questionEn: "What are the scientific credentials and simulation disclaimer of ASTRA?",
    questionHi: "ASTRA के वैज्ञानिक संदर्भ और सिमुलेशन डिस्क्लेमर क्या हैं?",
    questionHinglish: ["astra scientific disclaimer kya hai", "is astra certified by nasa"],
    keywords: ["scientific", "disclaimer", "credentials", "nasa", "space-apps", "prototype"],
    answerEn:
      "ASTRA was developed for the NASA Space Apps Challenge as an operational demonstration and educational self-assessment platform. It is modeled on NASA biomedical research and human spaceflight physiological guidelines, but is not certified as an FDA or clinical medical diagnostic device.",
    answerHi:
      "ASTRA नासा स्पेस ऐप्स चैलेंज के लिए विकसित एक सिमुलेशन और शैक्षिक स्वास्थ्य मंच है। यह नासा के वैज्ञानिक शोध और अंतरिक्ष शरीर विज्ञान पर आधारित है, किंतु यह क्लीनिकल मेडिकल डायग्नोस्टिक डिवाइस नहीं है।",
  },
];
