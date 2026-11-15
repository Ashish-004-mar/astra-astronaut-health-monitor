import type { KnowledgeEntry } from "./types";

export const mindspaceKB: KnowledgeEntry[] = [
  {
    id: "mind-01",
    category: "stress",
    intent: "what_is_astra_mindspace",
    questionEn: "What is ASTRA MindSpace?",
    questionHi: "ASTRA MindSpace क्या है?",
    questionHinglish: ["mindspace kya hai", "astra mindspace ke bare me batao", "what is mindspace module"],
    keywords: ["mindspace", "wellness", "resilience", "mental", "recovery", "coping"],
    answerEn:
      "ASTRA MindSpace is an autonomous crew mental wellness and resilience module inspired by NASA Human Research Program. It provides voluntary non-clinical check-ins, guided resonant breathing, spacecraft 5-4-3-2-1 grounding, crew communication practice, reaction-time exercises, and confidential support pathways.",
    answerHi:
      "ASTRA MindSpace नासा ह्यूमन रिसर्च प्रोग्राम से प्रेरित अंतरिक्ष यात्रियों के लिए एक मानसिक स्वास्थ्य और लचीलापन (Resilience) मॉड्यूल है। इसमें स्वैच्छिक चेक-इन, गाइडेड ब्रीदिंग, स्पेसक्राफ्ट 5-4-3-2-1 ग्राउंडिंग, टीम संवाद अभ्यास और गोपनीय मेडिकल सहायता के सुरक्षित रास्ते उपलब्ध हैं।",
  },
  {
    id: "mind-02",
    category: "stress",
    intent: "how_to_use_stress_recovery_studio",
    questionEn: "How do I use the Stress Recovery Studio and Guided Breathing?",
    questionHi: "स्ट्रेस रिकवरी स्टूडियो और गाइडेड ब्रीदिंग का उपयोग कैसे करें?",
    questionHinglish: ["guided breathing kaise kare", "stress recovery studio kaise use kare", "breathing exercise mindspace"],
    keywords: ["studio", "breathing", "pacing", "inhale", "exhale", "box", "resonant"],
    answerEn:
      "Open the MindSpace tab and select 'Stress Recovery Studio'. Choose your duration (1, 3, or 5 minutes) and pacing style: 4s/4s Relaxing, 4-4-4-4 Box Breathing, or 4s/6s Calming. Follow the expanding and contracting visual sphere with optional harmonic chimes to reduce autonomic stress.",
    answerHi:
      "माइंडस्पेस टैब खोलें और 'Stress Recovery Studio' चुनें। अपनी अवधि (1, 3 या 5 मिनट) और ब्रीदिंग स्टाइल चुनें (जैसे 4-4-4-4 बॉक्स ब्रीदिंग या 4s/6s रिलेक्सिंग)। स्क्रीन पर फैलते और सिकुड़ते गोले के साथ सांस लें जिससे पैरासिम्पेथेटिक नर्वस सिस्टम सक्रिय होकर तनाव कम करता है।",
  },
  {
    id: "mind-03",
    category: "stress",
    intent: "spacecraft_grounding_54321",
    questionEn: "What is the Spacecraft Grounding 5-4-3-2-1 exercise?",
    questionHi: "स्पेसक्राफ्ट ग्राउंडिंग 5-4-3-2-1 तकनीक क्या है?",
    questionHinglish: ["5-4-3-2-1 grounding kya hai", "spacecraft sensory grounding", "grounding technique space"],
    keywords: ["grounding", "sensory", "5-4-3-2-1", "sight", "touch", "sound", "smell", "affirmation"],
    answerEn:
      "Spacecraft 5-4-3-2-1 Grounding adapts cognitive mindfulness for microgravity habitats. It guides you to notice 5 visual objects in your module, feel 4 physical contact points, listen for 3 life-support sounds (fans, pumps), identify 2 ambient scents, and anchor 1 steady affirmation.",
    answerHi:
      "स्पेसक्राफ्ट 5-4-3-2-1 ग्राउंडिंग तकनीक अंतरिक्ष आवास के लिए तैयार की गई है। इसमें आप केबिन में 5 चीजें देखते हैं, 4 शारीरिक स्पर्श बिंदुओं (जैसे हैंडरेल या फुट लूप) को महसूस करते हैं, 3 जीवन रक्षक ध्वनियां सुनते हैं, 2 महक पहचानते हैं और 1 सकारात्मक संकल्प दोहराते हैं।",
  },
  {
    id: "mind-04",
    category: "stress",
    intent: "crew_harmony_communication_practice",
    questionEn: "How does the Crew Harmony module support team communication?",
    questionHi: "क्रू हार्मनी मॉड्यूल टीम सहयोग में कैसे मदद करता है?",
    questionHinglish: ["crew harmony kya hai", "team conflict resolution space", "astronaut communication training"],
    keywords: ["harmony", "crew", "communication", "debrief", "conflict", "teamwork"],
    answerEn:
      "Crew Harmony addresses NASA's documented 'Risk of Inadequate Teamwork'. It includes 6 realistic spaceflight communication scenarios with constructive non-accusatory feedback, a 4-step mission debrief protocol, and a structured 6-step conflict resolution guide.",
    answerHi:
      "क्रू हार्मनी मॉड्यूल नासा के टीमवर्क जोखिमों को कम करने के लिए बनाया गया है। इसमें 6 वास्तविक अंतरिक्ष संवाद परिदृश्य (Scenarios), 4-चरणीय मिशन डीब्रीफ प्रोटोकॉल और निष्पक्ष बातचीत द्वारा आपसी मतभेद सुलझाने की 6-चरणीय गाइड शामिल है।",
  },
  {
    id: "mind-05",
    category: "stress",
    intent: "how_to_get_confidential_mental_support",
    questionEn: "How do I access confidential astronaut mental health support?",
    questionHi: "गोपनीय मनोवैज्ञानिक सहायता या फ्लाइट सर्जन से संपर्क कैसे करें?",
    questionHinglish: ["mental health support kaise le", "flight surgeon se kaise baat kare", "confidential astronaut support"],
    keywords: ["support", "confidential", "flight surgeon", "bmed", "escalation", "crisis"],
    answerEn:
      "Click the prominent 'Get Support' button in MindSpace. It displays four support tiers: autonomous self-care tools, crew peer support, private BMed / Flight Surgeon teleconsultations via encrypted space-to-ground link, and acute emergency escalation protocols.",
    answerHi:
      "माइंडस्पेस में 'Get Support' बटन पर क्लिक करें। यहाँ 4 स्तरीय सहायता मौजूद है: व्यक्तिगत सेल्फ-केयर, साथी क्रू सपोर्ट, सुरक्षित एन्क्रिप्टेड लिंक द्वारा फ्लाइट सर्जन और बिहेवियरल हेल्थ (BMed) टीम से परामर्श, और आपातकालीन सुरक्षा प्रोटोकॉल।",
  },
];
