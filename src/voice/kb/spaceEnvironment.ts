import type { KnowledgeEntry } from "../types";

export const spaceEnvironmentEntries: KnowledgeEntry[] = [
  {
    id: "se-01",
    category: "space",
    intent: "space_weather_radiation_risk",
    questionEn: "What is the current space weather status and radiation risk?",
    questionHi: "वर्तमान अंतरिक्ष मौसम (Space Weather) और रेडिएशन का क्या जोखिम है?",
    questionHinglish: ["space weather kaisa hai", "solar radiation risk today", "suraj ka tufaan check karo"],
    keywords: ["space", "weather", "radiation", "solar", "flare", "risk", "mausam"],
    answerEn:
      "Space weather telemetry indicates nominal solar conditions. The Sun's X-ray flux is at background B-class levels with no coronal mass ejections directed along our orbital vector. Geomagnetic activity (Kp index) is tranquil, and the radiation dosage rate remains within standard ALARA shielding guidelines.",
    answerHi:
      "अंतरिक्ष मौसम का डेटा सामान्य सौर स्थिति दर्शाता है। सूर्य का एक्स-रे स्तर शांत बी-क्लास पर है और कोई कोरोनल मास इजेक्शन (CME) हमारे रास्ते में नहीं है। भू-चुंबकीय गतिविधि (Kp इंडेक्स) शांत है और विकिरण दर सुरक्षित सीमा के भीतर है।",
  },
  {
    id: "se-02",
    category: "space",
    intent: "cosmic_radiation_human_body",
    questionEn: "How does cosmic radiation affect the human body?",
    questionHi: "ब्रह्मांडीय विकिरण (Cosmic Radiation) मानव शरीर को कैसे प्रभावित करता है?",
    questionHinglish: ["cosmic radiation se sharir pe kya asar hota hai", "radiation damage human cells space"],
    keywords: ["cosmic", "radiation", "dna", "cancer", "gcr", "damage"],
    answerEn:
      "High-energy galactic cosmic rays (HZE ions) penetrate spacecraft aluminum hulls and pass directly through human tissue. These densely ionizing particles create complex, clustered DNA double-strand breaks that challenge cellular repair enzymes, elevating lifetime cancer risk, degenerative tissue disease, and central nervous system degradation.",
    answerHi:
      "गैलेक्टिक कॉस्मिक किरणें अंतरिक्ष यान की दीवारों को चीरकर मानव ऊतकों से गुजरती हैं। ये किरणें कोशिकाओं के डीएनए को तोड़ देती हैं, जिससे शरीर की मरम्मत प्रणाली पर भारी दबाव पड़ता है और लंबे समय में कैंसर, मोतियाबिंद और तंत्रिका तंत्र को नुकसान का खतरा बढ़ जाता है।",
  },
  {
    id: "se-03",
    category: "space",
    intent: "solar_particle_event_shelter",
    questionEn: "What is a Solar Particle Event and how do astronauts shelter?",
    questionHi: "सोलर पार्टिकल इवेंट (SPE) क्या है और यात्री इससे कैसे बचते हैं?",
    questionHinglish: ["solar particle event kya hota hai", "space me solar storm se kaise bachte hai"],
    keywords: ["solar", "particle", "event", "spe", "storm", "shelter", "storm-shelter"],
    answerEn:
      "A Solar Particle Event occurs when magnetic reconnection during intense solar flares accelerates high-energy relativistic protons toward Earth orbit. In severe SPEs, astronauts retreat to well-shielded central modules (like the Columbus or Zvezda aft areas) surrounded by hydrogen-rich water bags and food storage for radiation shielding.",
    answerHi:
      "सोलर पार्टिकल इवेंट तब होता है जब सूर्य के तीव्र तूफान से अरबों उच्च-ऊर्जा प्रोटॉन अंतरिक्ष में फैलते हैं। ऐसे समय अंतरिक्ष यात्री स्टेशन के सबसे सुरक्षित अंदरूनी हिस्से में शरण लेते हैं, जिसके चारों ओर पानी के बैग और भोजन के बक्से रखकर रेडिएशन से बचाव किया जाता है।",
  },
  {
    id: "se-04",
    category: "space",
    intent: "south_atlantic_anomaly",
    questionEn: "What is the South Atlantic Anomaly (SAA)?",
    questionHi: "साउथ अटलांटिक एनोमली (SAA) क्या है?",
    questionHinglish: ["south atlantic anomaly kya hai", "saa radiation belt space"],
    keywords: ["south", "atlantic", "anomaly", "saa", "van-allen", "radiation"],
    answerEn:
      "The South Atlantic Anomaly is an area where Earth's inner Van Allen radiation belt dips closest to the surface, down to 200 km altitude over South America and the South Atlantic Ocean. Spacecraft crossing this region receive roughly 30 times higher radiation flux, occasionally requiring computer memory fault masking.",
    answerHi:
      "साउथ अटलांटिक एनोमली (SAA) पृथ्वी के चुंबकीय क्षेत्र का वह कमजोर हिस्सा है जहां वैन एलन रेडिएशन बेल्ट अंतरिक्ष स्टेशन की कक्षा (लगभग 400 किमी) के सबसे करीब आ जाती है। यहां से गुजरते समय अंतरिक्ष यात्रियों और कंप्यूटर चिप्स को 30 गुना अधिक रेडिएशन का सामना करना पड़ता है।",
  },
  {
    id: "se-05",
    category: "space",
    intent: "daily_radiation_dose_iss",
    questionEn: "What is the typical daily radiation dose on the space station?",
    questionHi: "अंतरिक्ष स्टेशन पर प्रतिदिन औसतन कितना रेडिएशन मिलता है?",
    questionHinglish: ["iss pe daily kitna radiation milta hai", "daily dose millisieverts space"],
    keywords: ["daily", "radiation", "dose", "millisieverts", "milligray", "sievert"],
    answerEn:
      "Astronauts aboard the ISS absorb approximately 0.5 to 1.0 millisieverts (mSv) of ionizing radiation per day, which equates to receiving roughly 5 to 10 chest X-rays every 24 hours. Over a standard 6-month mission, the cumulative dose approaches 100 to 150 mSv.",
    answerHi:
      "अंतरिक्ष स्टेशन पर एक यात्री प्रतिदिन लगभग 0.5 से 1.0 मिलिसीवर्ट (mSv) रेडिएशन सोखता है, जो दिनभर में 5 से 10 छाती के एक्स-रे करवाने के बराबर है। 6 महीने के मिशन में यह कुल 100 से 150 मिलिसीवर्ट तक पहुंच जाता है।",
  },
  {
    id: "se-06",
    category: "space",
    intent: "gcr_vs_spe_differences",
    questionEn: "How do Galactic Cosmic Rays differ from Solar Proton Events?",
    questionHi: "गैलेक्टिक कॉस्मिक किरणों (GCR) और सोलर प्रोटॉन (SPE) में क्या अंतर है?",
    questionHinglish: ["gcr aur spe me kya antar hai", "galactic cosmic rays vs solar storm"],
    keywords: ["gcr", "spe", "differences", "protons", "heavy-ions", "shielding"],
    answerEn:
      "Solar Proton Events are sporadic, intense bursts of medium-energy protons that can be largely attenuated using hydrogen-rich shielding. Galactic Cosmic Rays are a steady, isotropic background of ultra-high-energy heavy atomic nuclei (iron, carbon, silicon) from outside our solar system that easily penetrate conventional spacecraft hulls.",
    answerHi:
      "सौर तूफान (SPE) कभी-कभार आने वाले तीव्र प्रोटॉन होते हैं जिन्हें पानी या पॉलीथीन की दीवारों से रोका जा सकता है। जबकि गैलेक्टिक कॉस्मिक किरणें (GCR) सौरमंडल के बाहर से आने वाली अत्यंत शक्तिशाली किरणें हैं जिन्हें साधारण धातुओं से पूरी तरह रोकना लगभग असंभव है।",
  },
  {
    id: "se-07",
    category: "space",
    intent: "long_term_cancer_risk_space",
    questionEn: "What are the long-term cancer risks from space radiation?",
    questionHi: "अंतरिक्ष रेडिएशन से लंबे समय में कैंसर होने का कितना खतरा रहता है?",
    questionHinglish: ["space radiation se cancer ka risk kitna hota hai", "long term cancer risk astronauts"],
    keywords: ["cancer", "risk", "long-term", "mortality", "recode", "limits"],
    answerEn:
      "NASA space radiation health standards set career radiation exposure limits to ensure that an astronaut's Risk of Exposure Induced Death (REID) from fatal cancer does not exceed 3 percent with a 95 percent confidence interval, rigorously tracking lifetime millisievert tallies.",
    answerHi:
      "नासा के मानकों के अनुसार किसी भी अंतरिक्ष यात्री के पूरे करियर में रेडिएशन का कुल स्तर इस प्रकार सीमित रखा जाता है कि उसके जीवनकाल में कैंसर से मृत्यु का अतिरिक्त जोखिम 3% से अधिक न बढ़े। प्रत्येक यात्री के डोज की लगातार निगरानी की जाती है।",
  },
  {
    id: "se-08",
    category: "space",
    intent: "radiation_induced_cataracts",
    questionEn: "Can space radiation cause acute or accelerated cataracts in astronauts?",
    questionHi: "क्या अंतरिक्ष विकिरण से आंखों में मोतियाबिंद (Cataracts) हो सकता है?",
    questionHinglish: ["space radiation se motiyabind hota hai kya", "astronaut cataracts eye radiation"],
    keywords: ["cataracts", "eyes", "lens", "radiation", "phosphenes", "motiyabind"],
    answerEn:
      "Yes. The epithelial cells of the ocular crystalline lens are exceptionally radiosensitive. Even low doses of heavy-ion cosmic radiation accelerate posterior subcapsular cataracts. Many astronauts also observe 'light flashes' (radiation phosphenes) when energetic particles traverse their dark-adapted retinas.",
    answerHi:
      "हाँ। आंखों की पुतली की कोशिकाएं रेडिएशन के प्रति अत्यंत संवेदनशील होती हैं। अंतरिक्ष में भारी किरणों के संपर्क से कम उम्र में भी मोतियाबिंद हो सकता है। कई अंतरिक्ष यात्री आंखें बंद करने पर 'चमकदार रोशनी' (Radiation Phosphenes) दिखने की रिपोर्ट करते हैं।",
  },
  {
    id: "se-09",
    category: "space",
    intent: "micrometeoroid_orbital_debris",
    questionEn: "How does Whipple shielding protect against orbital debris?",
    questionHi: "व्हिपल शील्डिंग (Whipple Shielding) अंतरिक्ष मलबे से यान को कैसे बचाती है?",
    questionHinglish: ["whipple shield space debris se kaise bachati hai", "micrometeoroid protection space"],
    keywords: ["whipple", "shielding", "debris", "meteoroids", "impact", "hull"],
    answerEn:
      "Spacecraft use multi-layer Whipple bumper shields: an outer thin aluminum plate shatters incoming micro-meteoroids moving at 10 km/s into a diffuse cloud of harmless molten vapor, and an inner Nextel-Kevlar blanket absorbs the residual blast before it can puncture the pressurized pressure vessel.",
    answerHi:
      "व्हिपल शील्ड में यान की मुख्य दीवार से कुछ दूरी पर एल्यूमीनियम की बाहरी पतली परत लगाई जाती है। 10 किमी प्रति सेकंड की गति से आने वाला मलबा टकराते ही वाष्प और छोटे कणों में बिखर जाता है, जिसे अंदर मौजूद केवलर और नेक्स्टेल की परत आसानी से रोक लेती है।",
  },
  {
    id: "se-10",
    category: "space",
    intent: "thermal_extremes_eva",
    questionEn: "What are the thermal extremes experienced outside during spacewalks?",
    questionHi: "स्पेसवॉक (EVA) के दौरान बाहर तापमान के क्या अत्यधिक उतार-चढ़ाव होते हैं?",
    questionHinglish: ["spacewalk ke time bahar kitna temperature hota hai", "thermal extremes outside station"],
    keywords: ["thermal", "extremes", "temperature", "eva", "suit", "cooling"],
    answerEn:
      "In the vacuum of low Earth orbit, direct unfiltered sunlight heats spacesuit exteriors up to +121°C (+250°F), while entering Earth's shadow plunges temperatures to -157°C (-250°F). Liquid Cooling and Ventilation Garments (LCVG) cycle chilled water over astronaut skin to regulate body temperature.",
    answerHi:
      "अंतरिक्ष के निर्वात में सीधे सूर्य की धूप में तापमान +121°C तक खौलने लगता है, जबकि पृथ्वी की छाया में जाते ही यह शून्य से नीचे -157°C तक जम जाता है। इस भारी अंतर से बचाने के लिए स्पेसवॉक सूट के अंदर ठंडे पानी की नलियों वाला विशेष अंडरगारमेंट पहना जाता है।",
  },
  {
    id: "se-11",
    category: "space",
    intent: "atmospheric_drag_orbital_decay",
    questionEn: "How does atmospheric drag cause orbital decay of low Earth orbit stations?",
    questionHi: "वायुमंडलीय घर्षण (Atmospheric Drag) अंतरिक्ष स्टेशन की कक्षा को कैसे गिराता है?",
    questionHinglish: ["station niche kyu girta hai drag se", "orbital decay atmospheric friction"],
    keywords: ["drag", "decay", "orbit", "reboost", "atmosphere", "reboosts"],
    answerEn:
      "At 400 km altitude, traces of Earth's thermosphere exert minute aerodynamic drag on large station surfaces like solar arrays. This continuously robs the outpost of orbital velocity, causing it to lose roughly 50 to 100 meters of altitude per day unless regular rocket reboosts are executed.",
    answerHi:
      "400 किमी की ऊंचाई पर भी पृथ्वी के वायुमंडल के बेहद सूक्ष्म कण मौजूद होते हैं जो स्टेशन के विशाल सोलर पैनल्स से टकराते हैं। इस घर्षण से स्टेशन की गति धीमी होती है और वह प्रतिदिन 50 से 100 मीटर नीचे खिसक जाता है, जिसे ठीक करने के लिए समय-समय पर रॉकेट थ्रस्टर्स चलाए जाते हैं।",
  },
  {
    id: "se-12",
    category: "space",
    intent: "cabin_oxygen_nitrogen_balance",
    questionEn: "Why is oxygen partial pressure maintained at 21% inside the station?",
    questionHi: "अंतरिक्ष स्टेशन के अंदर ऑक्सीजन का स्तर 21% पर ही क्यों रखा जाता है?",
    questionHinglish: ["cabin me 21% oxygen kyu rakhte hai", "space station atmosphere air mix"],
    keywords: ["oxygen", "nitrogen", "atmosphere", "partial-pressure", "fire", "air"],
    answerEn:
      "The ISS maintains a sea-level equivalent atmosphere of 14.7 psi (101.3 kPa) with 21 percent oxygen and 78 percent nitrogen. This prevents severe flammability hazards that exist in pure oxygen environments (like Apollo 1) and preserves normal pulmonary mechanics without decompression overhead.",
    answerHi:
      "अंतरिक्ष स्टेशन के अंदर पृथ्वी के समुद्र तल जैसा 14.7 psi दबाव, 21% ऑक्सीजन और 78% नाइट्रोजन का मिश्रण रखा जाता है। इससे शुद्ध ऑक्सीजन से लगने वाली भयानक आग का खतरा नहीं रहता और यात्रियों के फेफड़ों को सामान्य सांस लेने की आदत बनी रहती है।",
  },
  {
    id: "se-13",
    category: "space",
    intent: "rapid_cabin_decompression",
    questionEn: "What happens if cabin pressurization is lost (rapid decompression)?",
    questionHi: "यदि केबिन का दबाव अचानक समाप्त हो जाए (Rapid Decompression) तो क्या होगा?",
    questionHinglish: ["cabin puncture decompression hone par kya hota hai", "loss of pressure in space"],
    keywords: ["decompression", "pressure", "puncture", "hypoxia", "ebullism", "emergency"],
    answerEn:
      "Rapid decompression reduces time of useful consciousness to 9 to 12 seconds due to sudden anoxia as oxygen diffuses backward out of pulmonary capillaries. Body fluids vaporize at body temperature (ebullism) once pressure drops below the Armstrong Limit (6.3 kPa). Quick emergency hatch isolation is mandatory.",
    answerHi:
      "यदि केबिन में छेद हो जाए और दबाव खत्म हो, तो व्यक्ति के पास होश में रहने के लिए केवल 9 से 12 सेकंड का समय होता है। दबाव शून्य होते ही फेफड़ों से तुरंत सारी हवा बाहर निकल जाती है। ऐसी स्थिति में आपातकालीन हैच तुरंत बंद करना जीवनरक्षक होता है।",
  },
  {
    id: "se-14",
    category: "space",
    intent: "water_recovery_system_recycling",
    questionEn: "How does the water recovery system recycle sweat and urine?",
    questionHi: "जल शोधन प्रणाली (Water Recovery System) पसीने और मूत्र को कैसे रीसायकल करती है?",
    questionHinglish: ["space me urine pani kaise banta hai", "water recovery system recycling iss"],
    keywords: ["water", "recovery", "recycling", "urine", "condensate", "purification", "pani"],
    answerEn:
      "The Environmental Control and Life Support System (ECLSS) captures cabin humidity condensate (breath and sweat) and distills crew urine through a rotary Vacuum Distillation Assembly (VDA). It then passes through catalytic oxidizers and fine micro-filters, producing water cleaner than municipal terrestrial tap water.",
    answerHi:
      "ECLSS लाइफ सपोर्ट सिस्टम यात्रियों की सांस और पसीने से हवा में आई नमी को सोखता है और वैक्यूम डिस्टिलेशन तकनीक से मूत्र को शुद्ध करता है। रासायनिक शोधन और सूक्ष्म फिल्टरों से गुजरने के बाद यह पानी पृथ्वी के सामान्य नलों से आने वाले पानी से भी अधिक शुद्ध और पीने योग्य बन जाता है।",
  },
  {
    id: "se-15",
    category: "space",
    intent: "crew_radiation_dosimeters",
    questionEn: "How do personal dosimeters track an astronaut's cumulative radiation?",
    questionHi: "पर्सनल डोसीमीटर (Dosimeter) अंतरिक्ष यात्री के कुल विकिरण को कैसे मापते हैं?",
    questionHinglish: ["dosimeter radiation kaise napta hai", "crew radiation badge dosimeter"],
    keywords: ["dosimeters", "radiation", "badge", "thermoluminescent", "mvd", "sieverts"],
    answerEn:
      "Astronauts wear active battery-powered silicon pixel detectors and passive thermoluminescent dosimeter (TLD) badges on their flight suits 24/7. These devices log absorbed dose and linear energy transfer (LET) spectra, providing precise millisievert tallies recorded into lifelong flight medicine dossiers.",
    answerHi:
      "अंतरिक्ष यात्री अपने सूट पर 24 घंटे सक्रिय सिलिकॉन डिटेक्टर और TLD बैज पहनते हैं। ये छोटे उपकरण उनके शरीर द्वारा सोखे गए रेडिएशन और ऊर्जा स्तर को लगातार मापते हैं और इसका पूरा मेडिकल रिकॉर्ड फ्लाइट सर्जन के पास सुरक्षित रहता है।",
  },
];
