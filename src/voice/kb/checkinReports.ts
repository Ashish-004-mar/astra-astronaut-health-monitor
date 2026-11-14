import type { KnowledgeEntry } from "../types";

export const checkinReportsEntries: KnowledgeEntry[] = [
  {
    id: "cr-01",
    category: "checkin",
    intent: "latest_checkin_summary",
    questionEn: "What is my latest check-in record for today?",
    questionHi: "आज का मेरा नवीनतम चेक-इन रिकॉर्ड क्या है?",
    questionHinglish: ["aaj ka checkin record kya hai", "latest check-in status check", "meri checkin entry"],
    keywords: ["check-in", "latest", "today", "energy", "mood", "discomfort", "report"],
    isDynamic: true,
    answerEn: (ctx) => {
      if (!ctx.hasCheckinToday || !ctx.todayCheckin) {
        return "No self-reported check-in has been submitted for today yet. Navigate to the Check-in tab to record your subjective energy, stress, mood, sleep quality, and physical discomfort ratings.";
      }
      const c = ctx.todayCheckin;
      return `Today's logged check-in: Energy: ${c.energy || "Normal"}, Stress: ${c.stress || "Low"}, Mood: ${c.mood || "Good"}, Sleep Quality: ${c.sleep || "Good"}, Physical Discomfort: ${c.discomfort || "None"}. Your perspective has been integrated into the daily mission profile.`;
    },
    answerHi: (ctx) => {
      if (!ctx.hasCheckinToday || !ctx.todayCheckin) {
        return "आज के लिए अभी तक कोई दैनिक चेक-इन दर्ज नहीं किया गया है। अपनी ऊर्जा, तनाव, मूड और शारीरिक स्थिति दर्ज करने के लिए Check-in टैब पर जाएं।";
      }
      const c = ctx.todayCheckin;
      return `आज का चेक-इन: ऊर्जा: ${c.energy || "सामान्य"}, तनाव: ${c.stress || "कम"}, मूड: ${c.mood || "अच्छा"}, नींद की गुणवत्ता: ${c.sleep || "अच्छी"}, शारीरिक परेशानी: ${c.discomfort || "कोई नहीं"}। यह डेटा आज की मेडिकल प्रोफाइल में जोड़ दिया गया है।`;
    },
  },
  {
    id: "cr-02",
    category: "checkin",
    intent: "download_pdf_report_guidance",
    questionEn: "How do I download my Daily Health PDF Report?",
    questionHi: "मैं अपनी दैनिक स्वास्थ्य पीडीएफ रिपोर्ट कैसे डाउनलोड करूँ?",
    questionHinglish: ["pdf report kaise download kare", "download health report astra", "report download button"],
    keywords: ["download", "pdf", "report", "health", "export", "file"],
    answerEn:
      "Click the prominent 'DOWNLOAD HEALTH REPORT' button on the My Health screen, or use the compact 'REPORT PDF' action on the Overview dashboard. This opens the interactive report drawer where you can select the mission day, preview all 3 pages, and download the official PDF file.",
    answerHi:
      "My Health स्क्रीन पर जाकर 'DOWNLOAD HEALTH REPORT' बटन दबाएं, या Overview स्क्रीन पर 'REPORT PDF' पर क्लिक करें। इससे 3-पेज की रिपोर्ट का पूर्वावलोकन खुलेगा जहाँ से आप सीधे पीडीएफ डाउनलोड कर सकते हैं।",
  },
  {
    id: "cr-03",
    category: "checkin",
    intent: "how_to_complete_checkin",
    questionEn: "How do I complete my daily self-assessment check-in?",
    questionHi: "मैं अपना दैनिक स्व-मूल्यांकन चेक-इन कैसे पूरा करूँ?",
    questionHinglish: ["daily checkin kaise bhare", "complete daily check-in steps"],
    keywords: ["complete", "check-in", "self-assessment", "questions", "submit"],
    answerEn:
      "Open the 'Check-in' tab in the top navigation. Answer the five short questions covering Energy, Stress, Mood, Sleep Quality, and Physical Discomfort, then press 'SUBMIT CHECK-IN'. It takes less than 60 seconds and grounds telemetry with real crew experience.",
    answerHi:
      "ऊपरी मेनू से 'Check-in' टैब खोलें। ऊर्जा, तनाव, मूड, नींद और शारीरिक परेशानी से जुड़े 5 आसान विकल्पों को चुनें और 'SUBMIT CHECK-IN' दबाएं। इसमें 1 मिनट से भी कम समय लगता है।",
  },
  {
    id: "cr-04",
    category: "checkin",
    intent: "five_domains_of_checkin",
    questionEn: "What five domains are assessed in the daily check-in?",
    questionHi: "दैनिक चेक-इन में किन 5 क्षेत्रों का आकलन किया जाता है?",
    questionHinglish: ["checkin me kaunse 5 sawal hote hai", "five domains of check-in astra"],
    keywords: ["five", "domains", "questions", "categories", "energy", "mood", "discomfort"],
    answerEn:
      "The five domains are: 1) Energy (Low, Normal, High), 2) Stress (Low, Medium, High), 3) Mood (Good, Okay, Low), 4) Sleep Quality (Poor, Fair, Good), and 5) Physical Discomfort (None, Mild, Significant).",
    answerHi:
      "ये 5 क्षेत्र हैं: 1) ऊर्जा (कम, सामान्य, अधिक), 2) तनाव (कम, मध्यम, अधिक), 3) मूड (अच्छा, ठीक, उदास), 4) नींद की गुणवत्ता (खराब, सामान्य, अच्छी), और 5) शारीरिक परेशानी (कोई नहीं, हल्की, अधिक)।",
  },
  {
    id: "cr-05",
    category: "checkin",
    intent: "why_subjective_reporting_vital",
    questionEn: "Why is subjective self-reporting vital alongside objective telemetry?",
    questionHi: "सेंसर डेटा के साथ-साथ स्वयं के अनुभव (Self-Reporting) को दर्ज करना क्यों आवश्यक है?",
    questionHinglish: ["subjective checkin sensor data ke sath kyu zaroori hai", "importance of self reporting in space"],
    keywords: ["subjective", "self-reporting", "telemetry", "complementary", "holistic"],
    answerEn:
      "Sensors detect heart beats and oxygen saturation, but cannot measure morale, localized joint stiffness, subtle brain fog, or psychological coping. Combining biometric telemetry with subjective self-reporting creates a holistic, multi-dimensional health picture.",
    answerHi:
      "सेंसर केवल धड़कन और ऑक्सीजन माप सकते हैं, लेकिन मानसिक थकान, जोड़ों का दर्द, अकेलापन या मनोबल को नहीं आंक सकते। दोनों का मिश्रण ही अंतरिक्ष यात्री के संपूर्ण स्वास्थ्य का सही चित्र प्रस्तुत करता है।",
  },
  {
    id: "cr-06",
    category: "checkin",
    intent: "generate_pdf_past_mission_day",
    questionEn: "Can I generate a PDF report for a previous mission day?",
    questionHi: "क्या मैं पिछले किसी भी मिशन दिन के लिए पीडीएफ रिपोर्ट बना सकता हूँ?",
    questionHinglish: ["kya pichle din ki pdf report nikal sakte hai", "generate pdf past mission day"],
    keywords: ["previous", "past", "day", "historical", "pdf", "generate"],
    answerEn:
      "Yes. In the Report Preview drawer, use the Mission Day selector dropdown to choose any available day in your mission history. The PDF generator will dynamically compile telemetry, baseline comparisons, and check-in logs specific to that date.",
    answerHi:
      "हाँ। रिपोर्ट पैनल में दिए गए मिशन डे ड्रॉपडाउन से आप किसी भी पिछले दिन का चयन कर सकते हैं। सिस्टम उस दिन के वास्तविक आंकड़ों और चेक-इन को लेकर एक नई पीडीएफ तैयार कर देगा।",
  },
  {
    id: "cr-07",
    category: "checkin",
    intent: "pdf_page_one_contents",
    questionEn: "What information is included on Page 1 of the PDF health report?",
    questionHi: "पीडीएफ स्वास्थ्य रिपोर्ट के पृष्ठ 1 पर क्या जानकारी शामिल होती है?",
    questionHinglish: ["pdf report page 1 me kya hota hai", "page 1 mission health summary"],
    keywords: ["page", "1", "summary", "header", "metrics", "table", "status"],
    answerEn:
      "Page 1 contains the Mission Health Summary: header with mission day, generation timestamp, health status badge (NOMINAL or ATTENTION), a comprehensive 5-metric comparison table showing current values, baselines, deltas, and statuses, followed by a flight surgeon summary.",
    answerHi:
      "पेज 1 पर 'मिशन हेल्थ समरी' होती है: मिशन दिवस, समय, स्वास्थ्य स्थिति बैज, पांचों प्रमुख वाइटल्स की बेसलाइन तुलना तालिका और उड़ान सर्जन की प्राथमिक समीक्षा।",
  },
  {
    id: "cr-08",
    category: "checkin",
    intent: "pdf_page_two_charts",
    questionEn: "What charts are displayed on Page 2 of the PDF report?",
    questionHi: "पीडीएफ रिपोर्ट के पृष्ठ 2 पर कौन से चार्ट दिखाए जाते हैं?",
    questionHinglish: ["pdf report page 2 me kaunse charts hai", "page 2 health trends pdf"],
    keywords: ["page", "2", "charts", "trends", "sparklines", "baseline", "graphs"],
    answerEn:
      "Page 2 features five crisp multi-hour trend charts: Heart Rate, Oxygen Saturation (SpO2), Sleep Duration, Stress Index, and Activity Score, each rendered with dashed baseline reference lines and plain-language operational interpretations.",
    answerHi:
      "पेज 2 पर पांच मुख्य स्वास्थ्य ट्रेंड्स के सुंदर रेखाचित्र होते हैं: हार्ट रेट, SpO2, नींद, तनाव और शारीरिक गतिविधि। प्रत्येक चार्ट के साथ उसकी बेसलाइन और आसान भाषा में व्याख्या दी गई होती है।",
  },
  {
    id: "cr-09",
    category: "checkin",
    intent: "pdf_page_three_countermeasures",
    questionEn: "What does Page 3 of the PDF report cover regarding countermeasures?",
    questionHi: "पीडीएफ रिपोर्ट का पृष्ठ 3 उपायों (Countermeasures) के बारे में क्या बताता है?",
    questionHinglish: ["pdf report page 3 me kya hota hai", "page 3 check-in recommendations"],
    keywords: ["page", "3", "countermeasures", "recommendations", "check-in", "disclosure"],
    answerEn:
      "Page 3 details your self-reported daily check-in ratings, specific operational recommendations across five domains (Hydration, Sleep, Cardiovascular, Musculoskeletal, Cognitive), simulation context, data provenance, and prototype scientific disclosure notices.",
    answerHi:
      "पेज 3 पर आपका दैनिक चेक-इन रिकॉर्ड, पांच प्रमुख क्षेत्रों में अनुशंसित सावधानियां (जल सेवन, नींद, कसरत, मानसिक विश्राम), डेटा स्रोत और एयरोस्पेस वैज्ञानिक सूचनाएं विस्तार से दी गई होती हैं।",
  },
  {
    id: "cr-10",
    category: "checkin",
    intent: "pdf_offline_capability",
    questionEn: "Does the PDF report work completely offline without internet?",
    questionHi: "क्या पीडीएफ रिपोर्ट बिना इंटरनेट के पूरी तरह ऑफलाइन काम करती है?",
    questionHinglish: ["kya pdf offline download ho jati hai", "pdf export without internet"],
    keywords: ["offline", "internet", "pdf", "local", "client-side", "jspdf"],
    answerEn:
      "Yes. The PDF is generated entirely in-memory using client-side vector drawing routines (jsPDF). Zero network requests or backend servers are required, making it 100% functional during deep-space radio blackouts.",
    answerHi:
      "हाँ। यह पीडीएफ पूरी तरह आपके ब्राउज़र की मेमोरी में ऑफलाइन तैयार होती है। इसके लिए किसी सर्वर या इंटरनेट कनेक्शन की आवश्यकता नहीं होती, जिससे गहरे अंतरिक्ष में भी यह 100% काम करती है।",
  },
  {
    id: "cr-11",
    category: "checkin",
    intent: "pdf_naming_convention",
    questionEn: "How is the PDF report named when downloaded?",
    questionHi: "डाउनलोड होने पर पीडीएफ रिपोर्ट का नाम किस प्रारूप में रखा जाता है?",
    questionHinglish: ["pdf file ka naam kya hota hai", "pdf report download filename"],
    keywords: ["naming", "filename", "pdf", "download", "day", "file"],
    answerEn:
      "Downloaded reports follow official mission nomenclature: ASTRA_Mission_Day_<day>_Health_Report.pdf (for example, ASTRA_Mission_Day_147_Health_Report.pdf), enabling structured chronological archiving.",
    answerHi:
      "डाउनलोड की गई फाइल का नाम आधिकारिक मानक के अनुसार होता है: ASTRA_Mission_Day_<दिन>_Health_Report.pdf (जैसे ASTRA_Mission_Day_147_Health_Report.pdf)।",
  },
  {
    id: "cr-12",
    category: "checkin",
    intent: "discomfort_in_space_protocol",
    questionEn: "What should I do if I experience physical discomfort in space?",
    questionHi: "यदि मुझे अंतरिक्ष में शारीरिक परेशानी या दर्द महसूस हो तो क्या करना चाहिए?",
    questionHinglish: ["agar sharir me dard ho space me to kya kare", "physical discomfort space protocol"],
    keywords: ["discomfort", "pain", "back", "headache", "check-in", "protocol"],
    answerEn:
      "Record the severity (Mild or Significant) in your daily check-in. For lower back soreness, assume the neutral body posture foetal stretch. For sinus pressure, apply a warm facial towel and inspect cabin ventilation. If acute or sharp pain develops, contact the flight surgeon immediately via private medical channel.",
    answerHi:
      "दैनिक चेक-इन में परेशानी (हल्की या अधिक) तुरंत दर्ज करें। पीठ दर्द के लिए शरीर को मोड़कर स्ट्रेच करें, सिरदर्द में गर्म तौलिया रखें और केबिन वेंटिलेशन जांचें। यदि दर्द तेज हो तो तुरंत फ्लाइट सर्जन से निजी मेडिकल चैनल पर संपर्क करें।",
  },
  {
    id: "cr-13",
    category: "checkin",
    intent: "subjective_objective_mismatch",
    questionEn: "How does ASTRA flag a mismatch between subjective feelings and telemetry?",
    questionHi: "ASTRA आपकी भावनाओं और सेंसर डेटा के बीच के अंतर को कैसे पहचानता है?",
    questionHinglish: ["mismatch between feelings and telemetry astra", "subjective objective discrepancy"],
    keywords: ["mismatch", "discrepancy", "subjective", "objective", "fatigue", "denial"],
    answerEn:
      "When an astronaut logs 'High Energy' but telemetry shows elevated resting heart rate and 4 hours of sleep, ASTRA highlights a 'Subjective-Objective Discordance' advisory, reminding the crewmember of subconscious fatigue masking common in driven mission environments.",
    answerHi:
      "यदि कोई अंतरिक्ष यात्री चेक-इन में 'उच्च ऊर्जा' चुनता है लेकिन सेंसर डेटा कम नींद और बढ़ी हुई धड़कन दिखाता है, तो ASTRA इस अंतर को पहचानकर सतर्क करता है कि मिशन के उत्साह में अवचेतन थकान छिप सकती है।",
  },
  {
    id: "cr-14",
    category: "checkin",
    intent: "update_today_checkin",
    questionEn: "Can I edit or update today's submitted check-in?",
    questionHi: "क्या मैं आज के सबमिट किए गए चेक-इन को दोबारा अपडेट कर सकता हूँ?",
    questionHinglish: ["kya checkin update kar sakte hai", "edit today check-in"],
    keywords: ["update", "edit", "check-in", "re-submit", "change", "today"],
    answerEn:
      "Yes. If your physical state or symptoms change later in the mission day, simply return to the Check-in tab, adjust your ratings, and click 'UPDATE TODAY'S CHECK-IN' to overwrite the earlier record with updated observations.",
    answerHi:
      "हाँ। यदि दिन के दौरान आपकी तबीयत या लक्षणों में बदलाव आता है, तो आप कभी भी 'Check-in' टैब में जाकर नए विकल्प चुनकर 'UPDATE TODAY'S CHECK-IN' पर क्लिक कर सकते हैं।",
  },
  {
    id: "cr-15",
    category: "checkin",
    intent: "preview_pdf_report_modal",
    questionEn: "Where can I view the PDF report preview before downloading?",
    questionHi: "मैं डाउनलोड करने से पहले पीडीएफ रिपोर्ट का पूर्वावलोकन कहाँ देख सकता हूँ?",
    questionHinglish: ["pdf preview kaha dekh sakte hai", "preview report before downloading"],
    keywords: ["preview", "modal", "drawer", "before", "download", "look"],
    answerEn:
      "Clicking 'PREVIEW REPORT' on the My Health page or 'REPORT PDF' on the Overview opens the interactive Report Drawer. Here you can inspect formatted tabs for Page 1, Page 2, and Page 3 before initiating the local PDF download.",
    answerHi:
      "My Health पेज पर 'PREVIEW REPORT' या Overview पर 'REPORT PDF' क्लिक करते ही एक इंटरैक्टिव पैनल खुलता है, जहाँ आप तीनों पेजों का लाइव पूर्वावलोकन देख सकते हैं और फिर डाउनलोड कर सकते हैं।",
  },
];
