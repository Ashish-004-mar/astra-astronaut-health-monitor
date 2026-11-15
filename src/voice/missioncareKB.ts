import type { KnowledgeEntry } from "./types";

export const missioncareKB: KnowledgeEntry[] = [
  {
    id: "mission-01",
    category: "general",
    intent: "what_is_astra_missioncare",
    questionEn: "What is ASTRA MissionCare?",
    questionHi: "ASTRA MissionCare क्या है?",
    questionHinglish: ["missioncare kya hai", "astra mission care ke bare me batao", "space emergency medical system"],
    keywords: ["missioncare", "emergency", "medical", "triage", "space", "mars", "assistance"],
    answerEn:
      "ASTRA MissionCare is an autonomous space medical emergency decision-support module designed for deep-space missions, such as Mars transit. When Earth communication has a 14-minute one-way delay, MissionCare guides non-medical astronauts through immediate triage, vital measurement tutorials, crew role assignments, equipment readiness, and structured offline procedures without replacing qualified flight surgeons.",
    answerHi:
      "ASTRA MissionCare गहरे अंतरिक्ष अभियानों (जैसे मंगल ट्रांजिट) के लिए एक स्वायत्त आपातकालीन चिकित्सा सहायता मॉड्यूल है। जब पृथ्वी से 14 मिनट का संचार विलंब होता है, तो मिशनकेयर गैर-चिकित्सक अंतरिक्ष यात्रियों को प्राथमिक आपातकालीन सहायता, वाइटल्स मापन ट्यूटोरियल, क्रू समन्वय और ऑफलाइन प्रक्रियाओं में मार्गदर्शन प्रदान करता है।",
  },
  {
    id: "mission-02",
    category: "general",
    intent: "how_to_start_emergency_assist",
    questionEn: "How do I start Emergency Medical Assist for acute chest pain or collapse?",
    questionHi: "सीने में गंभीर दर्द या बेहोशी पर आपातकालीन सहायता कैसे शुरू करें?",
    questionHinglish: ["chest pain emergency assist", "collapse hone par kya kare", "emergency medical assist kaise start kare"],
    keywords: ["emergency", "chest pain", "collapse", "assist", "cardiac", "unresponsive", "triage"],
    answerEn:
      "Navigate to MissionCare and open 'Emergency Assist'. For sudden collapse or acute chest pain, immediately alert all crew members, assess responsiveness using AVPU, check for normal breathing, retrieve the automated external defibrillator (AED) and medical pack, and initiate approved resuscitation without delaying to take routine vitals. MissionCare logs all timestamps into the permanent timeline.",
    answerHi:
      "MissionCare टैब में जाकर 'Emergency Assist' चुनें। अचानक बेहोशी या सीने में तेज दर्द होने पर तुरंत पूरी टीम को अलर्ट करें, AVPU से चेतना और सांस की जांच करें, मेडिकल पैक और AED तैयार करें और बिना समय गंवाए अनुमोदित आपातकालीन प्रक्रिया शुरू करें। सिस्टम सभी घटनाओं को टाइमलाइन में रिकॉर्ड करता है।",
  },
  {
    id: "mission-03",
    category: "general",
    intent: "how_to_measure_spo2_in_space",
    questionEn: "How do I measure oxygen saturation (SpO2) in spaceflight?",
    questionHi: "अंतरिक्ष में ऑक्सीजन सैचुरेशन (SpO2) कैसे नापें?",
    questionHinglish: ["spo2 kaise measure kare", "oxygen saturation measurement space", "pulse oximeter use"],
    keywords: ["spo2", "oxygen", "saturation", "oximeter", "pulse", "perfusion", "hypoxia"],
    answerEn:
      "Open the 'Vital Measurement Guide' in MissionCare and select 'Oxygen Saturation (SpO2)'. Ensure the crewmate's fingers are warm and free of moisture or dark polish, attach the pulse oximeter sensor firmly to the index or middle finger, and wait 15-30 seconds for a stable waveform. Note that webcams cannot clinically measure SpO2, and microgravity peripheral vasoconstriction may affect readings.",
    answerHi:
      "MissionCare में 'Vital Measurement Guide' खोलें और 'Oxygen Saturation (SpO2)' चुनें। उंगलियों को गर्म और सूखा रखें, पल्स ऑक्सीमीटर सेंसर को तर्जनी या मध्यमा उंगली पर लगाएं और स्थिर रीडिंग आने तक 15-30 सेकंड प्रतीक्षा करें। ध्यान दें कि वेबकैम से SpO2 नहीं नापा जा सकता और माइक्रोग्रैविटी में रक्त प्रवाह में बदलाव से रीडिंग प्रभावित हो सकती है।",
  },
  {
    id: "mission-04",
    category: "general",
    intent: "mars_transit_comm_delay_and_care",
    questionEn: "What is the Mars transit communication delay and how does it affect medical care?",
    questionHi: "मंगल ट्रांजिट में संचार विलंब क्या है और यह चिकित्सा को कैसे प्रभावित करता है?",
    questionHinglish: ["mars comm delay medical", "14 minute communication delay mars", "latency mission care"],
    keywords: ["delay", "latency", "mars", "transit", "communication", "earth", "flight surgeon"],
    answerEn:
      "During Mars transit, radio signals take approximately 14 minutes one-way (28 minutes round-trip) between spacecraft and Earth ground control. Because real-time telemedicine is physically impossible, crew members must act autonomously using verified onboard decision support, local medical checklists, and structured timeline records transmitted asynchronously to Earth.",
    answerHi:
      "मंगल ट्रांजिट के दौरान रेडियो तरंगों को अंतरिक्ष यान से पृथ्वी तक पहुंचने में लगभग 14 मिनट (राउंड-ट्रिप में 28 मिनट) लगते हैं। रियल-टाइम टेलीमेडिसिन असंभव होने के कारण क्रू को ऑन-बोर्ड स्वायत्त टूल्स, सत्यापित प्रक्रियाओं और ऑफलाइन रिकॉर्डिंग के आधार पर आपात स्थिति में तुरंत निर्णय लेना होता है।",
  },
  {
    id: "mission-05",
    category: "general",
    intent: "locate_emergency_medical_equipment",
    questionEn: "How do I check and locate spacecraft emergency medical equipment?",
    questionHi: "स्पेसक्राफ्ट इमरजेंसी मेडिकल उपकरण कैसे देखें और ढूंढें?",
    questionHinglish: ["medical equipment location", "emergency kit search", "equipment inventory status"],
    keywords: ["equipment", "inventory", "aed", "pack", "kit", "status", "location", "maintenance"],
    answerEn:
      "Open 'Emergency Equipment' in MissionCare to view the complete inventory with module stowage locations (e.g., Medical Locker Alpha, Bay 2), readiness status (AVAILABLE, IN USE, MAINTENANCE REQUIRED, UNAVAILABLE), and last-checked timestamps. You can search by name, filter by category (Diagnostic, Resuscitation, Trauma, Medication), and update equipment availability in real time.",
    answerHi:
      "MissionCare में 'Emergency Equipment' टैब खोलें। यहां सभी उपकरणों के मॉड्यूल स्थान (जैसे मेडिकल लॉकर अल्फा, बे 2), स्थिति (उपलब्ध, उपयोग में, मेंटेनेंस आवश्यक) और अंतिम जांच समय प्रदर्शित होता है। आप नाम से खोज सकते हैं और स्थिति को तुरंत अपडेट कर सकते हैं।",
  },
  {
    id: "mission-06",
    category: "general",
    intent: "how_to_assess_avpu_responsiveness",
    questionEn: "How do I assess crew responsiveness using the AVPU scale?",
    questionHi: "AVPU स्केल से अंतरिक्ष यात्री की चेतना की स्थिति कैसे जांचें?",
    questionHinglish: ["avpu scale kya hai", "responsiveness assess kaise kare", "unresponsive crew check"],
    keywords: ["avpu", "responsiveness", "alert", "voice", "pain", "unresponsive", "consciousness"],
    answerEn:
      "The AVPU scale grades consciousness rapidly: A (Alert - spontaneous eye opening, speaks), V (Voice - responds only when spoken to firmly), P (Pain - responds only to gentle shoulder pressure or sternal rub), U (Unresponsive - no response to verbal or physical stimuli). Any crewmate graded U requires immediate emergency escalation and airway evaluation.",
    answerHi:
      "AVPU स्केल चेतना का त्वरित वर्गीकरण करता है: A (अलर्ट - सचेत और सामान्य बातचीत), V (आवाज - बुलाने पर ही प्रतिक्रिया देना), P (दर्द - कंधे दबाने पर ही प्रतिक्रिया), U (अचेत - कोई प्रतिक्रिया नहीं)। ग्रेड U की स्थिति में तुरंत आपातकालीन अलार्म बजाएं और वायुमार्ग (Airway) की जांच करें।",
  },
];
