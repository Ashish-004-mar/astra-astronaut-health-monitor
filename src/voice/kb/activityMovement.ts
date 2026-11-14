import type { KnowledgeEntry } from "../types";

export const activityMovementEntries: KnowledgeEntry[] = [
  {
    id: "am-01",
    category: "activity",
    intent: "current_activity_score",
    questionEn: "What is my physical activity score today?",
    questionHi: "आज मेरा शारीरिक गतिविधि स्कोर (Activity Score) क्या है?",
    questionHinglish: ["aaj mera activity score kitna hai", "daily exercise score check", "activity points today"],
    keywords: ["activity", "score", "exercise", "workout", "points", "movement", "kasrat"],
    isDynamic: true,
    answerEn: (ctx) => {
      const diff = ctx.activity - ctx.baselineActivity;
      return `Today's physical countermeasure activity score is ${ctx.activity} out of 100. Your personal baseline quota is ${ctx.baselineActivity} (${diff >= 0 ? "+" : ""}${diff} delta). Workout completion status is ${ctx.activity >= 70 ? "OPTIMAL: full 2.5-hour countermeasure envelope satisfied" : "INCOMPLETE: scheduled resistive or aerobic load remaining on mission timeline"}.`;
    },
    answerHi: (ctx) => {
      const diff = ctx.activity - ctx.baselineActivity;
      return `आज आपका शारीरिक व्यायाम और गतिविधि स्कोर 100 में से ${ctx.activity} है। आपका व्यक्तिगत बेसलाइन कोटा ${ctx.baselineActivity} है (${diff >= 0 ? "+" : ""}${diff} का अंतर)। आपकी स्थिति: ${ctx.activity >= 70 ? "उत्कृष्ट: दैनिक 2.5 घंटे का वर्कआउट कोटा पूरा हो चुका है" : "अपूर्ण: आज की आवश्यक वेट ट्रेनिंग या कार्डियो कसरत अभी बाकी है"}।`;
    },
  },
  {
    id: "am-02",
    category: "activity",
    intent: "evaluating_movement_camera",
    questionEn: "How does ASTRA evaluate physical movement and camera tracking?",
    questionHi: "ASTRA कैमरे और ट्रैकिंग से शारीरिक गतिविधि का आकलन कैसे करता है?",
    questionHinglish: ["astra camera se activity kaise track karta hai", "movement evaluation camera astra"],
    keywords: ["evaluate", "movement", "camera", "mediapipe", "tracking", "vision"],
    answerEn:
      "ASTRA utilizes lightweight on-device computer vision models (MediaPipe) to track anatomical landmarks in real-time. It computes joint kinematics and postural sway to guide regional body analysis (Head, Chest, and Muscles) without recording private crew video.",
    answerHi:
      "ASTRA आपके ब्राउज़र में सीधे चलने वाले हल्के कंप्यूटर विज़न मॉडल (MediaPipe) का उपयोग करता है। यह शरीर के जोड़ों की स्थिति और गति को मापकर सिर, छाती और मांसपेशियों का विश्लेषण करता है, बिना किसी निजी वीडियो को रिकॉर्ड या सेव किए।",
  },
  {
    id: "am-03",
    category: "activity",
    intent: "why_two_hours_exercise",
    questionEn: "Why must astronauts exercise 2 to 2.5 hours every day in orbit?",
    questionHi: "अंतरिक्ष में प्रतिदिन 2 से 2.5 घंटे व्यायाम करना क्यों अनिवार्य है?",
    questionHinglish: ["space me rojana 2 ghante exercise kyu zaroori hai", "why 2.5 hours exercise daily in space"],
    keywords: ["exercise", "hours", "daily", "mandatory", "atrophy", "bone", "muscle"],
    answerEn:
      "Without gravity, bones shed calcium at 1 percent per month and muscle fibers atrophy rapidly. Exercising 2 to 2.5 hours daily (combining heavy resistive loads with high-intensity cycling or running) provides the mechanical strain necessary to preserve bone architecture and cardiac output.",
    answerHi:
      "गुरुत्वाकर्षण के अभाव में शरीर की हड्डियां प्रति माह 1% कैल्शियम खोने लगती हैं और मांसपेशियां कमजोर हो जाती हैं। प्रतिदिन 2.5 घंटे भारी वेट ट्रेनिंग और कार्डियो व्यायाम करने से हड्डियों और दिल की ताकत बनी रहती है ताकि पृथ्वी पर सुरक्षित वापसी हो सके।",
  },
  {
    id: "am-04",
    category: "activity",
    intent: "ared_device_mechanics",
    questionEn: "What is ARED and how does it mimic free weights in microgravity?",
    questionHi: "ARED क्या है और यह भारहीनता में डम्बल/वजन की तरह कैसे काम करता है?",
    questionHinglish: ["ared machine kya hai space me", "advanced resistive exercise device"],
    keywords: ["ared", "resistive", "exercise", "vacuum", "cylinders", "weights"],
    answerEn:
      "The Advanced Resistive Exercise Device (ARED) uses inertial flywheels and two evacuated vacuum canisters to simulate up to 600 pounds (272 kg) of constant gravitational resistance. This allows squats, deadlifts, and heel raises with constant load through the full range of motion.",
    answerHi:
      "ARED (एडवांस्ड रेसिस्टिव एक्सरसाइज डिवाइस) वैक्यूम सिलेंडर और फ्लाईव्हील का उपयोग करके भारहीनता में 272 किलोग्राम (600 पाउंड) तक का निरंतर खिंचाव पैदा करता है। इससे अंतरिक्ष यात्री पृथ्वी की तरह स्क्वैट्स, डेडलिफ्ट और बेंच प्रेस कर पाते हैं।",
  },
  {
    id: "am-05",
    category: "activity",
    intent: "t2_treadmill_bungees",
    questionEn: "What is the T2 treadmill and why are bungee harnesses necessary?",
    questionHi: "T2 ट्रेडमिल क्या है और इस पर बंजी हार्नेस पहनना क्यों जरूरी है?",
    questionHinglish: ["t2 treadmill pe bungee kyu lagate hai", "running treadmill space harness"],
    keywords: ["t2", "colbert", "treadmill", "bungee", "harness", "running"],
    answerEn:
      "The T2 Colbert treadmill uses a vibration isolation system to keep running forces from jarring station solar arrays. Astronauts wear a shoulder and waist harness attached to elastic bungee cords, which pull them downward to generate 60 to 80 percent of their terrestrial body weight onto the belt.",
    answerHi:
      "भारहीनता में दौड़ते समय हवा में उड़ने से बचने के लिए T2 ट्रेडमिल पर बंजी हार्नेस पहनना पड़ता है। ये खिंचावदार डोरियां यात्री को नीचे की ओर खींचकर उनके शरीर के भार का 60 से 80% दबाव पैदा करती हैं, जिससे दौड़ने का वास्तविक प्रभाव मिलता है।",
  },
  {
    id: "am-06",
    category: "activity",
    intent: "skeletal_muscle_atrophy_rate",
    questionEn: "How rapidly do skeletal muscles atrophy without countermeasures?",
    questionHi: "व्यायाम न करने पर मांसपेशियां कितनी तेजी से कमजोर (Atrophy) होती हैं?",
    questionHinglish: ["bina exercise muscle kitni jaldi kamzor hoti hai space me", "muscle atrophy rate space"],
    keywords: ["atrophy", "muscle", "rate", "loss", "skeletal", "fibers"],
    answerEn:
      "Without countermeasures, astronauts can lose up to 20 percent of their muscle mass and 30 percent of their muscle strength in just 11 to 14 days of microgravity. Type I postural slow-twitch fibers that fight gravity on Earth degenerate fastest.",
    answerHi:
      "यदि व्यायाम न किया जाए, तो अंतरिक्ष में केवल 11 से 14 दिनों के भीतर ही 20% तक मांसपेशियों का द्रव्यमान और 30% तक ताकत खत्म हो सकती है। पृथ्वी पर खड़े रहने में मदद करने वाली पोस्टुरल मांसपेशियां सबसे पहले कमजोर पड़ती हैं।",
  },
  {
    id: "am-07",
    category: "activity",
    intent: "bone_loss_monthly_rate",
    questionEn: "What is the monthly rate of bone mineral density loss in space?",
    questionHi: "अंतरिक्ष में हड्डियों के घनत्व (Bone Density) में प्रति माह कितनी कमी आती है?",
    questionHinglish: ["space me haddiya kitni ghis-ti hai", "bone density loss rate space"],
    keywords: ["bone", "density", "bmd", "loss", "calcium", "osteopenia", "haddi"],
    answerEn:
      "Astronauts lose roughly 1.0 to 1.5 percent of bone mineral density per month in load-bearing regions like the lumbar spine, hips, and femoral necks. This rate is nearly ten times faster than postmenopausal osteoporosis on Earth.",
    answerHi:
      "अंतरिक्ष यात्री रीढ़ की हड्डी, कूल्हों और जांघों जैसी वजन उठाने वाली हड्डियों से प्रति माह लगभग 1.0 से 1.5% बोन मिनरल डेंसिटी खो देते हैं। यह दर पृथ्वी पर ऑस्टियोपोरोसिस की बीमारी से लगभग 10 गुना तेज है।",
  },
  {
    id: "am-08",
    category: "activity",
    intent: "soleus_gastrocnemius_vulnerability",
    questionEn: "Why are the calf muscles particularly vulnerable in space?",
    questionHi: "पिंडली की मांसपेशियां (Calf Muscles) अंतरिक्ष में सबसे अधिक कमजोर क्यों होती हैं?",
    questionHinglish: ["calf muscle space me jaldi kyu atrophied hoti hai", "soleus gastrocnemius space"],
    keywords: ["calf", "soleus", "gastrocnemius", "vulnerable", "postural"],
    answerEn:
      "The soleus and gastrocnemius are dedicated anti-gravity posture muscles. On Earth, they are under continuous tonic activation whenever you stand or walk. In space, they are virtually silent because astronauts propel themselves using fingertip pushes, causing rapid disuse atrophy.",
    answerHi:
      "पिंडलियों की सोलियस मांसपेशियां पृथ्वी पर खड़े होने और चलने के दौरान लगातार खिंचाव में रहती हैं। अंतरिक्ष में भारहीन तैरने और केवल उंगलियों से यान को छूकर आगे बढ़ने के कारण इन मांसपेशियों का उपयोग शून्य हो जाता है, जिससे ये तेजी से सिकुड़ती हैं।",
  },
  {
    id: "am-09",
    category: "activity",
    intent: "resistive_training_bone_preservation",
    questionEn: "How does resistance training prevent bone resorption?",
    questionHi: "वेट ट्रेनिंग हड्डियों को गलने और कमजोर होने से कैसे रोकती है?",
    questionHinglish: ["weight training haddiyo ko kaise bachati hai", "how resistance training stops bone loss"],
    keywords: ["resistance", "bone", "osteocytes", "piezoelectric", "resorption"],
    answerEn:
      "Heavy axial loading generates mechanical strain and fluid flow within bone canaliculi. This mechanical shear triggers osteocytes to release prostaglandins and downregulate sclerostin, stimulating osteoblastic bone formation and halting osteoclastic calcium resorption.",
    answerHi:
      "भारी वजन उठाने से हड्डियों पर जो खिंचाव और दबाव पड़ता है, वह हड्डियों की कोशिकाओं (Osteocytes) को संकेत देता है कि हड्डी को मजबूत बनाए रखना जरूरी है। इससे कैल्शियम का टूटना रुक जाता है और नई हड्डी का निर्माण उत्तेजित होता है।",
  },
  {
    id: "am-10",
    category: "activity",
    intent: "cevis_cycle_ergometer_purpose",
    questionEn: "What is the Cycle Ergometer (CEVIS) used for during orbital training?",
    questionHi: "कक्षा में साइकिल अर्गोमीटर (CEVIS) का क्या उपयोग है?",
    questionHinglish: ["cevis cycle space me kyu chalate hai", "cycle ergometer in orbit"],
    keywords: ["cevis", "cycle", "ergometer", "aerobic", "cardio", "vo2"],
    answerEn:
      "The Cycle Ergometer with Vibration Isolation and Stabilization (CEVIS) is used for high-intensity cardiovascular conditioning and interval training. Astronauts cycle against calibrated electromagnetic workloads to sustain VO2 max and arterial compliance.",
    answerHi:
      "CEVIS एक विशेष स्थिर अंतरिक्ष साइकिल है जिसका उपयोग कार्डियो और एरोबिक वर्कआउट के लिए किया जाता है। यात्री इस पर तेज साइकिल चलाकर अपनी हृदय गति और फेफड़ों की कार्यक्षमता (VO2 Max) को बरकरार रखते हैं।",
  },
  {
    id: "am-11",
    category: "activity",
    intent: "body_regions_head_chest_muscles",
    questionEn: "How does ASTRA analyze the Head, Chest, and Muscles regions?",
    questionHi: "ASTRA सिर (Head), छाती (Chest) और मांसपेशियों (Muscles) का विश्लेषण कैसे करता है?",
    questionHinglish: ["head chest muscles analysis astra", "digital twin body regions"],
    keywords: ["head", "chest", "muscles", "regions", "digital", "twin"],
    answerEn:
      "ASTRA partitions your digital twin into three mission systems: Chest evaluates cardiovascular rhythm (HR and SpO2); Head assesses neuro-cognitive recovery and circadian rest (Sleep and Stress); Muscles tracks physical countermeasure compliance and movement intensity.",
    answerHi:
      "ASTRA आपके डिजिटल ट्विन को तीन क्षेत्रों में बांटता है: छाती (कार्डियोवैस्कुलर पल्स और SpO2), सिर (नींद, तनाव और न्यूरो-संज्ञानात्मक स्वास्थ्य), और मांसपेशियां (दैनिक व्यायाम कोटा और शारीरिक गतिशीलता)।",
  },
  {
    id: "am-12",
    category: "activity",
    intent: "spinal_elongation_back_pain",
    questionEn: "What is the risk of spinal elongation and back pain in microgravity?",
    questionHi: "भारहीनता में रीढ़ की हड्डी लंबी होने और पीठ दर्द का क्या जोखिम है?",
    questionHinglish: ["space me height kyu badhti hai", "spinal elongation and back pain space"],
    keywords: ["spinal", "elongation", "spine", "back", "pain", "intervertebral", "height"],
    answerEn:
      "Without gravity compressing the spine, intervertebral discs absorb fluid and swell, lengthening the vertebral column by up to 2 inches (5 cm). This stretches spinal ligaments and paravertebral muscles, frequently causing moderate lumbar back pain and heightening the risk of disc herniation upon return to Earth.",
    answerHi:
      "गुरुत्वाकर्षण का दबाव न होने से रीढ़ की हड्डियों के बीच की डिस्क तरल सोखकर फूल जाती हैं, जिससे अंतरिक्ष यात्रियों की लंबाई 5 सेमी (2 इंच) तक बढ़ जाती है। इसके खिंचाव से पीठ के निचले हिस्से में दर्द होता है और पृथ्वी पर लौटने पर डिस्क स्लिप होने का खतरा बढ़ जाता है।",
  },
  {
    id: "am-13",
    category: "activity",
    intent: "dietary_protein_caloric_balance",
    questionEn: "What dietary protein and calories are needed to maintain muscle in space?",
    questionHi: "अंतरिक्ष में मांसपेशियों को बनाए रखने के लिए कितना प्रोटीन और कैलोरी चाहिए?",
    questionHinglish: ["space me kitna protein khana chahiye", "astronaut nutrition calories protein"],
    keywords: ["protein", "calories", "diet", "nutrition", "leucine", "muscle"],
    answerEn:
      "Flight dietitians mandate 1.2 to 1.7 grams of high-quality protein per kilogram of body mass per day, rich in branched-chain amino acids (particularly leucine), alongside a 2800 to 3200 kcal daily intake to prevent catabolic breakdown of skeletal muscle.",
    answerHi:
      "अंतरिक्ष यात्रियों को अपने वजन के प्रति किलोग्राम 1.2 से 1.7 ग्राम उच्च गुणवत्ता वाला प्रोटीन (विशेषकर ल्यूसीन युक्त) और 2800 से 3200 कैलोरी प्रतिदिन लेने की सलाह दी जाती है ताकि व्यायाम के साथ मांसपेशियों का निर्माण जारी रहे।",
  },
  {
    id: "am-14",
    category: "activity",
    intent: "neuromuscular_motor_coordination",
    questionEn: "How does microgravity alter neuromuscular motor coordination?",
    questionHi: "माइक्रोग्रैविटी न्यूरोमस्कुलर तालमेल और संतुलन को कैसे प्रभावित करती है?",
    questionHinglish: ["motor coordination space me kaise bigadti hai", "neuromuscular coordination microgravity"],
    keywords: ["neuromuscular", "motor", "coordination", "proprioception", "balance"],
    answerEn:
      "Weightlessness disrupts proprioceptive feedback from joint mechanoreceptors and muscle spindles. Astronauts initially overestimate the force required for limb movements, struggle with fine motor dexterity, and require sensorimotor recalibration to control tools accurately.",
    answerHi:
      "भारहीनता जोड़ों और मांसपेशियों के संवेदी संकेतों (Proprioception) को बदल देती है। शुरुआत में यात्री किसी चीज को पकड़ने या हिलाने में जरूरत से ज्यादा ताकत लगा देते हैं और उपकरणों को संभालने के लिए दिमाग को नए तालमेल की जरूरत होती है।",
  },
  {
    id: "am-15",
    category: "activity",
    intent: "flywheel_exercise_devices",
    questionEn: "What are flywheel exercise devices and how do they benefit deep space missions?",
    questionHi: "फ्लाईव्हील उपकरण क्या हैं और गहरे अंतरिक्ष अभियानों (Mars) में इनका क्या लाभ है?",
    questionHinglish: ["flywheel exercise machine space mars", "compact workout devices space"],
    keywords: ["flywheel", "inertial", "deep-space", "mars", "compact", "orion"],
    answerEn:
      "Flywheel devices use rotating inertial discs instead of heavy vacuum canisters to provide resistance during concentric and eccentric muscle actions. Their compact volume and low mass make them the ideal candidate for small exploration craft like Orion or Mars transit vehicles.",
    answerHi:
      "फ्लाईव्हील मशीनें घूमने वाले पहियों की जड़ता (Inertia) का उपयोग करके कसरत का भारी खिंचाव पैदा करती हैं। ये बहुत हल्की और छोटी होती हैं, जो भविष्य के छोटे मंगल यान (Orion) के लिए सबसे उपयुक्त व्यायाम उपकरण हैं।",
  },
  {
    id: "am-16",
    category: "activity",
    intent: "post_workout_hr_recovery",
    questionEn: "How does post-workout heart rate recovery indicate conditioning?",
    questionHi: "कसरत के बाद हृदय गति का सामान्य होना (Recovery) फिटनेस का क्या संकेत देता है?",
    questionHinglish: ["workout ke baad hr recovery time fitness", "heart rate recovery post exercise"],
    keywords: ["post-workout", "recovery", "heart", "rate", "vagal", "fitness"],
    answerEn:
      "Heart Rate Recovery (HRR) measures how fast your pulse drops during the first 60 seconds after peak exertion. A drop of 25+ BPM within 1 minute indicates strong vagal reactivation and superior aerobic conditioning, whereas sluggish recovery signals autonomic fatigue or overtraining.",
    answerHi:
      "कसरत खत्म होने के 1 मिनट के भीतर दिल की धड़कन में कम से कम 25 BPM की गिरावट आना बेहतरीन फिटनेस और स्वस्थ वेगस नर्व का संकेत है। यदि धड़कन बहुत धीरे-धीरे सामान्य होती है, तो यह शारीरिक थकान या ओवर-ट्रेनिंग को दर्शाती है।",
  },
  {
    id: "am-17",
    category: "activity",
    intent: "ems_electrical_muscle_stimulation",
    questionEn: "Can Electrical Muscle Stimulation (EMS) substitute for resistive loading?",
    questionHi: "क्या इलेक्ट्रिकल मसल स्टिमुलेशन (EMS) भारी व्यायाम का विकल्प हो सकता है?",
    questionHinglish: ["kya ems machine exercise ka badal hai", "electrical muscle stimulation space"],
    keywords: ["ems", "electrical", "muscle", "stimulation", "substitute"],
    answerEn:
      "No. While EMS can evoke involuntary muscular contractions and slow superficial atrophy in paralyzed or bedridden subjects, it generates negligible skeletal bone strain and provides zero cardiovascular, aerobic, or vestibular benefits.",
    answerHi:
      "नहीं। हालांकि बिजली के हल्के झटके (EMS) मांसपेशियों को सिकोड़कर कुछ हद तक कमजोरी रोक सकते हैं, लेकिन यह हड्डियों पर दबाव नहीं डालते और दिल व फेफड़ों को कोई लाभ नहीं पहुंचाते। इसलिए यह वास्तविक व्यायाम का विकल्प नहीं हो सकता।",
  },
  {
    id: "am-18",
    category: "activity",
    intent: "bisphosphonates_vitamin_d_bone",
    questionEn: "What is the role of bisphosphonates and Vitamin D in mitigating bone loss?",
    questionHi: "हड्डियों को मजबूत रखने में बायोफॉस्फोनेट्स और विटामिन डी की क्या भूमिका है?",
    questionHinglish: ["vitamin d aur bisphosphonates space me kyu dete hai", "bone loss medication space"],
    keywords: ["bisphosphonates", "vitamin", "d", "calcium", "bone", "osteoclasts"],
    answerEn:
      "NASA flight protocols combine oral or intravenous bisphosphonates (which chemically inhibit osteoclast bone reabsorption) with 1000 IU/day of Vitamin D3. When paired with heavy ARED resistive exercise, this therapeutic regimen has virtually halted orbital bone density loss.",
    answerHi:
      "नासा के मेडिकल प्रोटोकॉल में विटामिन डी3 (प्रतिदिन 1000 IU) और बायोफॉस्फोनेट्स दवाओं का उपयोग किया जाता है जो हड्डियों को गलने से रोकती हैं। ARED व्यायाम के साथ मिलकर इस उपचार ने अंतरिक्ष में हड्डियों के नुकसान को लगभग समाप्त कर दिया है।",
  },
  {
    id: "am-19",
    category: "activity",
    intent: "daily_countermeasure_quota_check",
    questionEn: "How does ASTRA determine whether daily countermeasure quotas were met?",
    questionHi: "ASTRA यह कैसे तय करता है कि दैनिक व्यायाम का कोटा पूरा हुआ या नहीं?",
    questionHinglish: ["astra exercise quota complete kaise check karta hai", "workout quota check astra"],
    keywords: ["quota", "countermeasure", "met", "target", "score", "algorithm"],
    answerEn:
      "ASTRA tracks integrated exertion minutes, peak sustained cardiovascular load, and daily subjective activity logs. An activity score above 70 indicates full satisfaction of mission countermeasure objectives.",
    answerHi:
      "ASTRA कुल कसरत के मिनटों, हृदय गति के पीक लोड और गतिविधि लॉग को मिलाकर गणना करता है। 70 से अधिक का एक्टिविटी स्कोर यह पुष्टि करता है कि आज का आवश्यक व्यायाम कोटा सफलतापूर्वक पूरा हो गया है।",
  },
  {
    id: "am-20",
    category: "activity",
    intent: "vibration_isolation_station_science",
    questionEn: "What precautions prevent exercise vibrations from disturbing station science?",
    questionHi: "व्यायाम के कंपनों को अंतरिक्ष स्टेशन के वैज्ञानिक प्रयोगों को हिलाने से कैसे रोका जाता है?",
    questionHinglish: ["exercise vibration station ko disturb kyu nahi karti", "vibration isolation system space"],
    keywords: ["vibration", "isolation", "vis", "microgravity", "experiments", "damping"],
    answerEn:
      "All major workout devices (ARED, T2, CEVIS) sit on active and passive Vibration Isolation Systems (VIS). Magnetic dampers and pneumatic springs decouple running and lifting shockloads from the hull, preserving the ultra-quiet microgravity environment required for protein crystal and fluid physics research.",
    answerHi:
      "सभी व्यायाम उपकरण (ARED, ट्रेडमिल, साइकिल) विशेष 'वाइब्रेशन आइसोलेशन सिस्टम' पर लगे होते हैं। चुंबकीय डैम्पर्स और एयर स्प्रिंग्स दौड़ने और वजन उठाने के झटकों को सोख लेते हैं ताकि स्टेशन के नाजुक वैज्ञानिक प्रयोगों में कोई रुकावट न आए।",
  },
];
