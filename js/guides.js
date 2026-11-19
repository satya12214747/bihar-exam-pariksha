/* Preparation guides — pattern, syllabus, strategy, roadmap, books, tips.
   Patterns follow recent notifications; anything that changes often is kept
   general on purpose. Always confirm with the official notification. */
BEP.guides = {
  common: {
    daily: [
      { t: { en: "Morning (2–2.5 h)", hi: "सुबह (2–2.5 घंटे)" }, d: { en: "New topic from the core subjects — the mind is fresh, so study the hardest subject first.", hi: "मुख्य विषयों से नया टॉपिक — दिमाग ताज़ा रहता है, इसलिए सबसे कठिन विषय पहले पढ़ें।" } },
      { t: { en: "Late morning (1 h)", hi: "दोपहर से पहले (1 घंटा)" }, d: { en: "Newspaper + current affairs notes (national + Bihar).", hi: "अख़बार + करेंट अफ़ेयर्स नोट्स (राष्ट्रीय + बिहार)।" } },
      { t: { en: "Afternoon (1.5–2 h)", hi: "दोपहर (1.5–2 घंटे)" }, d: { en: "Maths / reasoning practice — at least 30–40 questions every day, timed.", hi: "गणित / रीज़निंग अभ्यास — रोज़ कम से कम 30–40 प्रश्न, समय लगाकर।" } },
      { t: { en: "Evening (1.5 h)", hi: "शाम (1.5 घंटे)" }, d: { en: "Second subject or Bihar special GK.", hi: "दूसरा विषय या बिहार विशेष सामान्य ज्ञान।" } },
      { t: { en: "Night (1 h)", hi: "रात (1 घंटा)" }, d: { en: "Revise what you read today + one 25-question mock on this platform. Note every mistake.", hi: "आज पढ़े हुए का रिवीज़न + इस मंच पर एक 25 प्रश्नों का मॉक। हर गलती नोट करें।" } }
    ],
    mistakes: [
      { en: "Collecting too many books and finishing none. One standard book per subject, revised 3–4 times, beats ten books read once.", hi: "बहुत सारी किताबें जमा करना और कोई पूरी न करना। हर विषय की एक मानक किताब 3–4 बार दोहराना, दस किताबें एक बार पढ़ने से बेहतर है।" },
      { en: "Ignoring previous year questions (PYQs). PYQs show what the commission actually asks — solve the last 5–10 years.", hi: "पिछले वर्षों के प्रश्न (PYQ) छोड़ देना। PYQ बताते हैं कि आयोग असल में क्या पूछता है — पिछले 5–10 वर्षों के प्रश्न हल करें।" },
      { en: "Reading without revising. Plan revision on day 1, day 7 and day 30 for every topic.", hi: "पढ़ना पर दोहराना नहीं। हर टॉपिक का रिवीज़न पहले दिन, सातवें दिन और तीसवें दिन तय करें।" },
      { en: "Never giving timed mocks. Speed and accuracy improve only under a ticking clock.", hi: "समयबद्ध मॉक टेस्ट न देना। गति और सटीकता केवल चलती घड़ी के दबाव में ही सुधरती है।" },
      { en: "Guessing blindly when there is negative marking — see the 'When to guess' section.", hi: "नेगेटिव मार्किंग होने पर अंधाधुंध अनुमान लगाना — 'कब अनुमान लगाएँ' भाग देखें।" },
      { en: "Leaving Bihar GK for the end. Bihar-specific questions decide the cut-off in almost every Bihar exam.", hi: "बिहार सामान्य ज्ञान को अंत के लिए छोड़ देना। लगभग हर बिहार परीक्षा में बिहार से जुड़े प्रश्न ही कट-ऑफ़ तय करते हैं।" }
    ]
  },

  /* ----------------------------------------------------------- BPSC */
  "bpsc": {
    level: { en: "Graduate", hi: "स्नातक" },
    stages: [
      { name: { en: "Preliminary exam", hi: "प्रारंभिक परीक्षा" }, tag: "qualifying", points: [
        { en: "One paper of General Studies — 150 objective questions, 150 marks, 2 hours.", hi: "सामान्य अध्ययन का एक पेपर — 150 वस्तुनिष्ठ प्रश्न, 150 अंक, 2 घंटे।" },
        { en: "Only qualifying for Mains — Prelims marks are not added to the final merit.", hi: "केवल मुख्य परीक्षा के लिए क्वालिफ़ाइंग — प्रारंभिक के अंक अंतिम मेरिट में नहीं जुड़ते।" },
        { en: "Recent papers have a 5th option such as 'More than one of the above / None of the above' and negative marking — read every statement carefully.", hi: "हाल के पेपरों में 'उपर्युक्त में से एक से अधिक / इनमें से कोई नहीं' जैसा 5वाँ विकल्प और नेगेटिव मार्किंग है — हर कथन ध्यान से पढ़ें।" }
      ] },
      { name: { en: "Main exam (written)", hi: "मुख्य परीक्षा (लिखित)" }, tag: "merit", points: [
        { en: "General Hindi — qualifying only.", hi: "सामान्य हिन्दी — केवल क्वालिफ़ाइंग।" },
        { en: "General Studies Paper I, General Studies Paper II and Essay — 300 marks each; these decide your merit.", hi: "सामान्य अध्ययन पेपर I, सामान्य अध्ययन पेपर II और निबंध — प्रत्येक 300 अंक; यही मेरिट तय करते हैं।" },
        { en: "Optional subject — qualifying in the recent pattern.", hi: "वैकल्पिक विषय — हाल के पैटर्न में क्वालिफ़ाइंग।" },
        { en: "Descriptive answers — regular answer-writing practice is essential.", hi: "वर्णनात्मक उत्तर — नियमित उत्तर-लेखन अभ्यास ज़रूरी है।" }
      ] },
      { name: { en: "Interview (personality test)", hi: "साक्षात्कार (व्यक्तित्व परीक्षण)" }, tag: "merit", points: [
        { en: "Marks are added to Mains for the final list.", hi: "अंतिम सूची के लिए अंक मुख्य परीक्षा में जोड़े जाते हैं।" },
        { en: "Expect questions on your home district, Bihar's development, your graduation subject and current issues.", hi: "अपने गृह ज़िले, बिहार के विकास, स्नातक विषय और समसामयिक मुद्दों पर प्रश्नों की अपेक्षा रखें।" }
      ] }
    ],
    syllabus: [
      { h: { en: "History & National Movement", hi: "इतिहास एवं राष्ट्रीय आंदोलन" }, items: { en: "Ancient, medieval, modern India; Bihar's role — Champaran, 1857 (Kunwar Singh), Quit India, Kisan Sabha", hi: "प्राचीन, मध्यकालीन, आधुनिक भारत; बिहार की भूमिका — चंपारण, 1857 (कुँवर सिंह), भारत छोड़ो, किसान सभा" } },
      { h: { en: "Geography", hi: "भूगोल" }, items: { en: "Physical, Indian and world geography; Bihar's rivers, soils, minerals, climate", hi: "भौतिक, भारत एवं विश्व भूगोल; बिहार की नदियाँ, मिट्टी, खनिज, जलवायु" } },
      { h: { en: "Indian Polity", hi: "भारतीय राजव्यवस्था" }, items: { en: "Constitution, Parliament, judiciary, federalism, Panchayati Raj, Bihar's administration", hi: "संविधान, संसद, न्यायपालिका, संघवाद, पंचायती राज, बिहार का प्रशासन" } },
      { h: { en: "Economy", hi: "अर्थव्यवस्था" }, items: { en: "Basic concepts, planning, banking, budget, Bihar's economy (Bihar Economic Survey)", hi: "मूल अवधारणाएँ, योजना, बैंकिंग, बजट, बिहार की अर्थव्यवस्था (बिहार आर्थिक सर्वेक्षण)" } },
      { h: { en: "General Science", hi: "सामान्य विज्ञान" }, items: { en: "Everyday physics, chemistry, biology; health, environment", hi: "दैनिक जीवन का भौतिकी, रसायन, जीवविज्ञान; स्वास्थ्य, पर्यावरण" } },
      { h: { en: "Mental Ability & Current Affairs", hi: "मानसिक क्षमता एवं करेंट अफ़ेयर्स" }, items: { en: "Basic arithmetic and reasoning; national, international and Bihar events of the last 12–18 months", hi: "मूल अंकगणित और तर्कशक्ति; पिछले 12–18 महीनों की राष्ट्रीय, अंतरराष्ट्रीय और बिहार की घटनाएँ" } }
    ],
    strategy: [
      { t: { en: "Prelims + Mains together", hi: "प्रारंभिक + मुख्य साथ-साथ" }, d: { en: "BPSC's GS for Mains overlaps heavily with Prelims. Read every topic once for both — make short MCQ notes and short answer notes at the same time.", hi: "BPSC मुख्य परीक्षा का GS प्रारंभिक से काफ़ी मिलता है। हर टॉपिक एक बार दोनों के लिए पढ़ें — साथ ही छोटे MCQ नोट्स और उत्तर नोट्स बनाएँ।" } },
      { t: { en: "NCERT first, then standard books", hi: "पहले NCERT, फिर मानक किताबें" }, d: { en: "Class 6–12 NCERTs build the base. Then one standard book per subject — don't jump between sources.", hi: "कक्षा 6–12 की NCERT आधार बनाती हैं। फिर हर विषय की एक मानक किताब — स्रोत बार-बार न बदलें।" } },
      { t: { en: "Bihar special is the game-changer", hi: "बिहार विशेष ही निर्णायक है" }, d: { en: "Bihar history, geography, economy and culture appear in both Prelims and Mains. Read the latest Bihar Economic Survey highlights.", hi: "बिहार का इतिहास, भूगोल, अर्थव्यवस्था और संस्कृति प्रारंभिक और मुख्य दोनों में आते हैं। नवीनतम बिहार आर्थिक सर्वेक्षण के मुख्य बिंदु पढ़ें।" } },
      { t: { en: "Statement questions need elimination", hi: "कथन-आधारित प्रश्नों में विलोपन" }, d: { en: "Judge each statement separately as true/false before looking at options. This protects you from the 5th-option traps.", hi: "विकल्प देखने से पहले हर कथन को अलग-अलग सही/गलत आँकें। इससे 5वें विकल्प के जाल से बचाव होता है।" } },
      { t: { en: "Answer writing from month 2", hi: "दूसरे महीने से उत्तर-लेखन" }, d: { en: "Write 2 answers a day (within word limit). Use Bihar examples, data and a short conclusion in every answer.", hi: "रोज़ 2 उत्तर लिखें (शब्द-सीमा में)। हर उत्तर में बिहार के उदाहरण, आँकड़े और छोटा निष्कर्ष दें।" } }
    ],
    roadmap: { span: { en: "6-month plan", hi: "6 महीने की योजना" }, phases: [
      { when: { en: "Month 1–2", hi: "महीना 1–2" }, t: { en: "Foundation", hi: "आधार" }, d: { en: "NCERTs (history, geography, polity, economy, science). Start daily current affairs. Bihar history basics.", hi: "NCERT (इतिहास, भूगोल, राजव्यवस्था, अर्थशास्त्र, विज्ञान)। रोज़ करेंट अफ़ेयर्स शुरू करें। बिहार इतिहास की मूल बातें।" } },
      { when: { en: "Month 3–4", hi: "महीना 3–4" }, t: { en: "Core books + Bihar", hi: "मानक किताबें + बिहार" }, d: { en: "Laxmikanth, Spectrum, Leong / NCERT geography, economy. Full Bihar special GK. Begin answer writing.", hi: "लक्ष्मीकांत, स्पेक्ट्रम, भूगोल, अर्थव्यवस्था। पूरा बिहार विशेष GK। उत्तर-लेखन शुरू करें।" } },
      { when: { en: "Month 5", hi: "महीना 5" }, t: { en: "PYQs + mocks", hi: "PYQ + मॉक" }, d: { en: "Solve 10 years of BPSC PYQs topic-wise. 3 mocks a week; analyse every wrong answer.", hi: "BPSC के 10 वर्षों के PYQ टॉपिक-वार हल करें। सप्ताह में 3 मॉक; हर गलत उत्तर का विश्लेषण।" } },
      { when: { en: "Month 6", hi: "महीना 6" }, t: { en: "Revision", hi: "रिवीज़न" }, d: { en: "Revise only your notes. Daily full mock. Last 12 months of current affairs, twice.", hi: "केवल अपने नोट्स दोहराएँ। रोज़ पूरा मॉक। पिछले 12 महीनों के करेंट अफ़ेयर्स दो बार।" } }
    ] },
    books: [
      { t: "NCERT Class 6–12", d: { en: "History, Geography, Polity, Economics, Science — the base for everything.", hi: "इतिहास, भूगोल, राजव्यवस्था, अर्थशास्त्र, विज्ञान — हर चीज़ का आधार।" } },
      { t: "Indian Polity — M. Laxmikanth", d: { en: "Standard polity book (Hindi edition available).", hi: "राजव्यवस्था की मानक किताब (हिन्दी संस्करण उपलब्ध)।" } },
      { t: "A Brief History of Modern India — Spectrum (Rajiv Ahir)", d: { en: "Modern India and the freedom struggle.", hi: "आधुनिक भारत और स्वतंत्रता संग्राम।" } },
      { t: "Lucent's General Knowledge", d: { en: "Quick one-liner revision of static GK.", hi: "स्थैतिक GK का त्वरित वन-लाइनर रिवीज़न।" } },
      { t: { en: "Bihar Economic Survey (Govt. of Bihar)", hi: "बिहार आर्थिक सर्वेक्षण (बिहार सरकार)" }, d: { en: "Latest edition's summary chapter — for Bihar economy and schemes.", hi: "नवीनतम संस्करण का सारांश अध्याय — बिहार की अर्थव्यवस्था व योजनाओं के लिए।" } },
      { t: { en: "BPSC previous year papers", hi: "BPSC पिछले वर्षों के प्रश्नपत्र" }, d: { en: "Prelims and Mains — the single most important resource.", hi: "प्रारंभिक और मुख्य — सबसे महत्वपूर्ण स्रोत।" } }
    ],
    tips: [
      { en: "Read a newspaper with a good Bihar page daily (Bihar news repeats in BPSC).", hi: "रोज़ ऐसा अख़बार पढ़ें जिसमें बिहार का अच्छा पेज हो (बिहार की ख़बरें BPSC में आती हैं)।" },
      { en: "Keep one thin notebook only for Bihar facts — revise it weekly.", hi: "बिहार के तथ्यों के लिए एक पतली अलग कॉपी रखें — हर सप्ताह दोहराएँ।" },
      { en: "In Prelims, first round: attempt only sure questions; second round: elimination-based ones.", hi: "प्रारंभिक में पहले राउंड में केवल पक्के प्रश्न; दूसरे राउंड में विलोपन वाले।" },
      { en: "Real BPSC papers have 5 options. A blind guess among 5 averages about −0.07 marks (1/5 − 4/5 × 1/3), so it loses marks — guess only after eliminating at least one option.", hi: "असली BPSC पेपर में 5 विकल्प होते हैं। 5 में अंधाधुंध अनुमान का औसत लगभग −0.07 अंक (1/5 − 4/5 × 1/3) है, यानी नुकसान — कम से कम एक विकल्प हटाने के बाद ही अनुमान लगाएँ।" }
    ]
  },

  /* ------------------------------------------------------- Bihar SI */
  "bihar-si": {
    level: { en: "Graduate", hi: "स्नातक" },
    stages: [
      { name: { en: "Preliminary exam", hi: "प्रारंभिक परीक्षा" }, tag: "qualifying", points: [
        { en: "100 objective questions on General Knowledge & Current Affairs — 200 marks, 2 hours.", hi: "सामान्य ज्ञान एवं करेंट अफ़ेयर्स के 100 वस्तुनिष्ठ प्रश्न — 200 अंक, 2 घंटे।" },
        { en: "Negative marking applies. Prelims only shortlists for Mains.", hi: "नेगेटिव मार्किंग लागू। प्रारंभिक केवल मुख्य परीक्षा के लिए छँटनी करती है।" }
      ] },
      { name: { en: "Main exam", hi: "मुख्य परीक्षा" }, tag: "merit", points: [
        { en: "Paper 1: General Hindi — qualifying.", hi: "पेपर 1: सामान्य हिन्दी — क्वालिफ़ाइंग।" },
        { en: "Paper 2: General Studies, General Science, Civics, Arithmetic & Mental Ability — decides merit.", hi: "पेपर 2: सामान्य अध्ययन, सामान्य विज्ञान, नागरिक शास्त्र, अंकगणित एवं मानसिक क्षमता — मेरिट तय करता है।" }
      ] },
      { name: { en: "Physical test (PET) & measurement", hi: "शारीरिक दक्षता परीक्षा (PET) एवं माप" }, tag: "qualifying", points: [
        { en: "Running, high jump, long jump and shot put, plus height/chest measurement — standards differ for men and women; check the notification.", hi: "दौड़, ऊँची कूद, लंबी कूद और गोला फेंक, साथ ही ऊँचाई/सीना माप — पुरुष व महिला के मानक अलग; अधिसूचना देखें।" },
        { en: "Start running practice from day 1 — don't wait for the written result.", hi: "पहले दिन से दौड़ का अभ्यास शुरू करें — लिखित परिणाम का इंतज़ार न करें।" }
      ] }
    ],
    syllabus: [
      { h: { en: "General Studies", hi: "सामान्य अध्ययन" }, items: { en: "History, geography, polity, economy, static GK", hi: "इतिहास, भूगोल, राजव्यवस्था, अर्थव्यवस्था, स्थैतिक GK" } },
      { h: { en: "Bihar GK", hi: "बिहार सामान्य ज्ञान" }, items: { en: "History, districts, rivers, culture, administration", hi: "इतिहास, ज़िले, नदियाँ, संस्कृति, प्रशासन" } },
      { h: { en: "Science", hi: "विज्ञान" }, items: { en: "Class 10 level physics, chemistry, biology", hi: "कक्षा 10 स्तर का भौतिकी, रसायन, जीवविज्ञान" } },
      { h: { en: "Civics & Law basics", hi: "नागरिक शास्त्र एवं विधि की मूल बातें" }, items: { en: "Fundamental rights, Articles 20–22, police as a State subject, writs", hi: "मौलिक अधिकार, अनुच्छेद 20–22, पुलिस राज्य सूची का विषय, रिट" } },
      { h: { en: "Arithmetic & Reasoning (Mains)", hi: "अंकगणित एवं तर्कशक्ति (मुख्य)" }, items: { en: "Percentage, ratio, average, profit-loss, time-work, series, coding", hi: "प्रतिशत, अनुपात, औसत, लाभ-हानि, समय-कार्य, श्रेणी, कोडिंग" } },
      { h: { en: "Current Affairs", hi: "करेंट अफ़ेयर्स" }, items: { en: "Last 12 months — national, Bihar, sports, awards, schemes", hi: "पिछले 12 महीने — राष्ट्रीय, बिहार, खेल, पुरस्कार, योजनाएँ" } }
    ],
    strategy: [
      { t: { en: "Prelims is GK-heavy", hi: "प्रारंभिक पूरी तरह GK पर" }, d: { en: "With 100 GK questions, breadth matters more than depth. Revise one-liners (Lucent) repeatedly.", hi: "100 GK प्रश्नों में गहराई से ज़्यादा विस्तार ज़रूरी। वन-लाइनर (लुसेंट) बार-बार दोहराएँ।" } },
      { t: { en: "Prepare for Mains in parallel", hi: "मुख्य की तैयारी साथ में" }, d: { en: "Practise arithmetic and reasoning daily from the start — the Mains gap is short.", hi: "शुरू से रोज़ अंकगणित और रीज़निंग का अभ्यास करें — मुख्य परीक्षा में समय कम मिलता है।" } },
      { t: { en: "Hindi grammar is easy marks", hi: "हिन्दी व्याकरण आसान अंक" }, d: { en: "The Hindi paper is qualifying but people fail it — revise sandhi, samas, muhavare, essay/letter format.", hi: "हिन्दी पेपर क्वालिफ़ाइंग है पर लोग इसमें छँट जाते हैं — संधि, समास, मुहावरे, निबंध/पत्र प्रारूप दोहराएँ।" } },
      { t: { en: "Fitness is a separate subject", hi: "फ़िटनेस एक अलग विषय है" }, d: { en: "Give 45–60 minutes every morning to running and jumps. Many candidates clear the written test and fail PET.", hi: "हर सुबह 45–60 मिनट दौड़ और कूद को दें। कई अभ्यर्थी लिखित पास कर PET में छँट जाते हैं।" } }
    ],
    roadmap: { span: { en: "4-month plan", hi: "4 महीने की योजना" }, phases: [
      { when: { en: "Week 1–4", hi: "सप्ताह 1–4" }, t: { en: "Static GK base", hi: "स्थैतिक GK आधार" }, d: { en: "History, polity, geography from Lucent/NCERT. Daily running starts.", hi: "लुसेंट/NCERT से इतिहास, राजव्यवस्था, भूगोल। रोज़ दौड़ शुरू।" } },
      { when: { en: "Week 5–8", hi: "सप्ताह 5–8" }, t: { en: "Science + Bihar", hi: "विज्ञान + बिहार" }, d: { en: "Class 10 science, full Bihar GK, polity articles. Arithmetic 30 Q/day.", hi: "कक्षा 10 विज्ञान, पूरा बिहार GK, संविधान के अनुच्छेद। अंकगणित 30 प्रश्न/दिन।" } },
      { when: { en: "Week 9–12", hi: "सप्ताह 9–12" }, t: { en: "Current affairs + PYQs", hi: "करेंट अफ़ेयर्स + PYQ" }, d: { en: "12 months of current affairs; solve previous SI papers; 3 mocks/week.", hi: "12 महीनों के करेंट अफ़ेयर्स; पिछले SI पेपर हल करें; 3 मॉक/सप्ताह।" } },
      { when: { en: "Week 13–16", hi: "सप्ताह 13–16" }, t: { en: "Revision + mocks", hi: "रिवीज़न + मॉक" }, d: { en: "Daily mock, revise notes, Hindi grammar for Mains, PET drills.", hi: "रोज़ मॉक, नोट्स रिवीज़न, मुख्य के लिए हिन्दी व्याकरण, PET अभ्यास।" } }
    ] },
    books: [
      { t: "Lucent's General Knowledge", d: { en: "Main static GK book for Prelims.", hi: "प्रारंभिक के लिए मुख्य स्थैतिक GK किताब।" } },
      { t: "NCERT Science Class 9–10", d: { en: "Enough for the science part.", hi: "विज्ञान भाग के लिए पर्याप्त।" } },
      { t: "Indian Polity — M. Laxmikanth", d: { en: "Only the fundamental rights, DPSP and judiciary chapters are must-read.", hi: "मौलिक अधिकार, नीति-निदेशक तत्व और न्यायपालिका अध्याय ज़रूर पढ़ें।" } },
      { t: "Samanya Hindi — Vasudev Nandan Prasad", d: { en: "Hindi grammar for Mains Paper 1.", hi: "मुख्य पेपर 1 के लिए हिन्दी व्याकरण।" } },
      { t: "Quantitative Aptitude / Reasoning — R.S. Aggarwal", d: { en: "Arithmetic and reasoning practice.", hi: "अंकगणित और रीज़निंग अभ्यास।" } }
    ],
    tips: [
      { en: "In this pattern a wrong answer costs little compared with a right one — read 'When to guess' below.", hi: "इस पैटर्न में सही उत्तर की तुलना में गलत उत्तर का नुकसान कम है — नीचे 'कब अनुमान लगाएँ' पढ़ें।" },
      { en: "Keep your documents (domicile, caste, EWS, NCC etc.) ready early.", hi: "अपने दस्तावेज़ (निवास, जाति, EWS, NCC आदि) पहले से तैयार रखें।" }
    ]
  },

  /* ------------------------------------------------------ BSSC Inter */
  "bssc-inter": {
    level: { en: "Intermediate (10+2)", hi: "इंटरमीडिएट (10+2)" },
    stages: [
      { name: { en: "Preliminary exam", hi: "प्रारंभिक परीक्षा" }, tag: "qualifying", points: [
        { en: "150 objective questions, 2 h 15 min, in three parts: General Studies, General Science & Maths, Mental Ability.", hi: "150 वस्तुनिष्ठ प्रश्न, 2 घंटे 15 मिनट, तीन भाग: सामान्य अध्ययन, सामान्य विज्ञान एवं गणित, मानसिक क्षमता।" },
        { en: "Negative marking applies.", hi: "नेगेटिव मार्किंग लागू।" }
      ] },
      { name: { en: "Main exam", hi: "मुख्य परीक्षा" }, tag: "merit", points: [
        { en: "Same subjects at a higher level; decides the merit list.", hi: "वही विषय, ऊँचा स्तर; मेरिट सूची तय करती है।" },
        { en: "Some posts may also need a skill/typing test — check your post in the notification.", hi: "कुछ पदों के लिए कौशल/टंकण परीक्षा भी हो सकती है — अधिसूचना में अपना पद देखें।" }
      ] },
      { name: { en: "Document verification", hi: "दस्तावेज़ सत्यापन" }, tag: "qualifying", points: [
        { en: "Certificates, domicile and reservation documents are checked.", hi: "प्रमाणपत्र, निवास और आरक्षण से जुड़े दस्तावेज़ जाँचे जाते हैं।" }
      ] }
    ],
    syllabus: [
      { h: { en: "General Studies", hi: "सामान्य अध्ययन" }, items: { en: "History, geography, polity, economy, Bihar GK, current affairs", hi: "इतिहास, भूगोल, राजव्यवस्था, अर्थव्यवस्था, बिहार GK, करेंट अफ़ेयर्स" } },
      { h: { en: "General Science", hi: "सामान्य विज्ञान" }, items: { en: "Class 10 physics, chemistry, biology", hi: "कक्षा 10 भौतिकी, रसायन, जीवविज्ञान" } },
      { h: { en: "Maths", hi: "गणित" }, items: { en: "Number system, LCM/HCF, percentage, SI/CI, ratio, speed-distance, mensuration", hi: "संख्या पद्धति, LCM/HCF, प्रतिशत, साधारण/चक्रवृद्धि ब्याज, अनुपात, चाल-दूरी, क्षेत्रमिति" } },
      { h: { en: "Mental Ability", hi: "मानसिक क्षमता" }, items: { en: "Series, coding, analogy, odd one out, blood relations, direction, calendar, clock", hi: "श्रेणी, कोडिंग, सादृश्यता, विषम चुनें, रक्त संबंध, दिशा, कैलेंडर, घड़ी" } }
    ],
    strategy: [
      { t: { en: "Score in Maths & Reasoning", hi: "गणित व रीज़निंग में अंक बनाएँ" }, d: { en: "These two parts are fully scoreable with practice. Do 40–50 timed questions daily.", hi: "ये दोनों भाग अभ्यास से पूरे अंक दिला सकते हैं। रोज़ 40–50 प्रश्न समय लगाकर करें।" } },
      { t: { en: "GS from one source", hi: "GS एक ही स्रोत से" }, d: { en: "Lucent + Bihar GK notes + monthly current affairs is enough at this level.", hi: "इस स्तर पर लुसेंट + बिहार GK नोट्स + मासिक करेंट अफ़ेयर्स पर्याप्त हैं।" } },
      { t: { en: "Learn short tricks", hi: "शॉर्ट ट्रिक्स सीखें" }, d: { en: "Percentage-fraction table, squares to 30, cubes to 20, tables to 20 — saves minutes.", hi: "प्रतिशत-भिन्न तालिका, 30 तक वर्ग, 20 तक घन, 20 तक पहाड़े — मिनट बचाते हैं।" } },
      { t: { en: "Section order matters", hi: "भागों का क्रम ज़रूरी" }, d: { en: "In the exam start with your strongest section; don't get stuck on one maths question for more than 90 seconds.", hi: "परीक्षा में अपने सबसे मज़बूत भाग से शुरू करें; किसी एक गणित प्रश्न पर 90 सेकंड से ज़्यादा न अटकें।" } }
    ],
    roadmap: { span: { en: "3-month plan", hi: "3 महीने की योजना" }, phases: [
      { when: { en: "Week 1–4", hi: "सप्ताह 1–4" }, t: { en: "Basics", hi: "मूल बातें" }, d: { en: "Maths chapters one by one, reasoning types, GS history + polity.", hi: "गणित के अध्याय एक-एक करके, रीज़निंग के प्रकार, GS इतिहास + राजव्यवस्था।" } },
      { when: { en: "Week 5–8", hi: "सप्ताह 5–8" }, t: { en: "Cover everything", hi: "पूरा सिलेबस" }, d: { en: "Geography, economy, science, Bihar GK. Maths mixed practice.", hi: "भूगोल, अर्थव्यवस्था, विज्ञान, बिहार GK। गणित मिश्रित अभ्यास।" } },
      { when: { en: "Week 9–12", hi: "सप्ताह 9–12" }, t: { en: "Mocks & PYQs", hi: "मॉक और PYQ" }, d: { en: "Previous BSSC papers, a mock every day, current affairs revision.", hi: "पिछले BSSC पेपर, रोज़ एक मॉक, करेंट अफ़ेयर्स रिवीज़न।" } }
    ] },
    books: [
      { t: "Lucent's General Knowledge", d: { en: "GS part.", hi: "GS भाग।" } },
      { t: "NCERT Science Class 9–10", d: { en: "Science part.", hi: "विज्ञान भाग।" } },
      { t: "Quantitative Aptitude — R.S. Aggarwal", d: { en: "Maths practice.", hi: "गणित अभ्यास।" } },
      { t: "A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal", d: { en: "Reasoning practice.", hi: "रीज़निंग अभ्यास।" } },
      { t: { en: "BSSC previous year papers", hi: "BSSC पिछले वर्षों के प्रश्नपत्र" }, d: { en: "Shows the real level.", hi: "असली स्तर दिखाते हैं।" } }
    ],
    tips: [
      { en: "Fill the form carefully — post preference and category cannot always be changed later.", hi: "फ़ॉर्म ध्यान से भरें — पद वरीयता और श्रेणी बाद में हमेशा नहीं बदल सकते।" },
      { en: "Practise on screen: this exam is computer-based in recent cycles — mocks here mimic that.", hi: "स्क्रीन पर अभ्यास करें: हाल के चक्रों में यह परीक्षा कंप्यूटर आधारित है — यहाँ के मॉक वैसा ही अनुभव देते हैं।" }
    ]
  },

  /* -------------------------------------------------------- BSSC CGL */
  "bssc-cgl": {
    level: { en: "Graduate", hi: "स्नातक" },
    stages: [
      { name: { en: "Preliminary exam", hi: "प्रारंभिक परीक्षा" }, tag: "qualifying", points: [
        { en: "150 objective questions, 2 h 15 min — General Studies, General Science & Maths, Mental Ability.", hi: "150 वस्तुनिष्ठ प्रश्न, 2 घंटे 15 मिनट — सामान्य अध्ययन, सामान्य विज्ञान एवं गणित, मानसिक क्षमता।" },
        { en: "Negative marking applies; graduate-level difficulty.", hi: "नेगेटिव मार्किंग लागू; स्नातक स्तर की कठिनाई।" }
      ] },
      { name: { en: "Main exam", hi: "मुख्य परीक्षा" }, tag: "merit", points: [
        { en: "Higher-level GS, science-maths and mental ability, with a General Hindi paper as notified.", hi: "उच्च स्तर का GS, विज्ञान-गणित और मानसिक क्षमता, अधिसूचना अनुसार सामान्य हिन्दी पेपर के साथ।" },
        { en: "Decides the final merit (with any skill test for specific posts).", hi: "अंतिम मेरिट तय करती है (विशिष्ट पदों के लिए कौशल परीक्षा सहित)।" }
      ] },
      { name: { en: "Document verification", hi: "दस्तावेज़ सत्यापन" }, tag: "qualifying", points: [
        { en: "Graduation, domicile and category documents are checked.", hi: "स्नातक, निवास और श्रेणी दस्तावेज़ जाँचे जाते हैं।" }
      ] }
    ],
    syllabus: [
      { h: { en: "General Studies", hi: "सामान्य अध्ययन" }, items: { en: "History, geography, polity, economy, environment, Bihar GK, current affairs", hi: "इतिहास, भूगोल, राजव्यवस्था, अर्थव्यवस्था, पर्यावरण, बिहार GK, करेंट अफ़ेयर्स" } },
      { h: { en: "Science & Maths", hi: "विज्ञान एवं गणित" }, items: { en: "Science up to class 12 basics; algebra, geometry, mensuration, CI, partnership, data interpretation", hi: "कक्षा 12 तक विज्ञान की मूल बातें; बीजगणित, ज्यामिति, क्षेत्रमिति, चक्रवृद्धि ब्याज, साझेदारी, आँकड़ा विश्लेषण" } },
      { h: { en: "Mental Ability", hi: "मानसिक क्षमता" }, items: { en: "Syllogism, seating arrangement, statement-conclusion, Venn diagram, coding, series", hi: "न्याय निगमन, बैठक व्यवस्था, कथन-निष्कर्ष, वेन आरेख, कोडिंग, श्रेणी" } }
    ],
    strategy: [
      { t: { en: "Treat it like SSC CGL + Bihar", hi: "इसे SSC CGL + बिहार की तरह लें" }, d: { en: "Maths and reasoning need SSC-level practice; GS needs strong Bihar coverage.", hi: "गणित व रीज़निंग में SSC स्तर का अभ्यास चाहिए; GS में बिहार की मज़बूत पकड़।" } },
      { t: { en: "Puzzles daily", hi: "रोज़ पज़ल" }, d: { en: "Solve 2 seating/puzzle sets daily — they are slow if unpractised.", hi: "रोज़ 2 बैठक व्यवस्था/पज़ल सेट हल करें — बिना अभ्यास के ये धीमे होते हैं।" } },
      { t: { en: "Accuracy over attempts", hi: "प्रयास से ज़्यादा सटीकता" }, d: { en: "With negative marking, 85%+ accuracy matters more than attempting all 150.", hi: "नेगेटिव मार्किंग में सभी 150 करने से ज़्यादा 85%+ सटीकता महत्वपूर्ण है।" } },
      { t: { en: "Error notebook", hi: "गलतियों की कॉपी" }, d: { en: "Write down every mock mistake with the correct concept; revise it every Sunday.", hi: "हर मॉक की गलती सही अवधारणा के साथ लिखें; हर रविवार दोहराएँ।" } }
    ],
    roadmap: { span: { en: "4-month plan", hi: "4 महीने की योजना" }, phases: [
      { when: { en: "Month 1", hi: "महीना 1" }, t: { en: "Maths + reasoning concepts", hi: "गणित + रीज़निंग अवधारणाएँ" }, d: { en: "All arithmetic chapters; reasoning types; GS history.", hi: "सभी अंकगणित अध्याय; रीज़निंग के प्रकार; GS इतिहास।" } },
      { when: { en: "Month 2", hi: "महीना 2" }, t: { en: "Advanced maths + GS", hi: "उन्नत गणित + GS" }, d: { en: "Algebra, geometry, DI; polity, geography, economy.", hi: "बीजगणित, ज्यामिति, DI; राजव्यवस्था, भूगोल, अर्थव्यवस्था।" } },
      { when: { en: "Month 3", hi: "महीना 3" }, t: { en: "Science + Bihar + CA", hi: "विज्ञान + बिहार + करेंट अफ़ेयर्स" }, d: { en: "Science, complete Bihar GK, 12 months current affairs; sectional tests.", hi: "विज्ञान, पूरा बिहार GK, 12 महीने करेंट अफ़ेयर्स; सेक्शनल टेस्ट।" } },
      { when: { en: "Month 4", hi: "महीना 4" }, t: { en: "Full mocks + revision", hi: "पूर्ण मॉक + रिवीज़न" }, d: { en: "Daily full mock, PYQs, error notebook revision.", hi: "रोज़ पूरा मॉक, PYQ, गलतियों की कॉपी का रिवीज़न।" } }
    ] },
    books: [
      { t: "Lucent's General Knowledge", d: { en: "Static GS.", hi: "स्थैतिक GS।" } },
      { t: "Indian Polity — M. Laxmikanth", d: { en: "Polity depth for graduate level.", hi: "स्नातक स्तर के लिए राजव्यवस्था की गहराई।" } },
      { t: "Quantitative Aptitude — R.S. Aggarwal", d: { en: "Maths, plus SSC-level previous papers.", hi: "गणित, साथ में SSC स्तर के पिछले पेपर।" } },
      { t: "A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal", d: { en: "Reasoning.", hi: "रीज़निंग।" } },
      { t: { en: "BSSC CGL previous year papers", hi: "BSSC CGL पिछले वर्षों के प्रश्नपत्र" }, d: { en: "Real level and repeated topics.", hi: "असली स्तर और बार-बार आने वाले टॉपिक।" } }
    ],
    tips: [
      { en: "Don't skip General Hindi if it is in your Mains — it can block an otherwise good score.", hi: "अगर मुख्य परीक्षा में सामान्य हिन्दी है तो उसे न छोड़ें — यह अच्छे स्कोर को भी रोक सकती है।" },
      { en: "Take sectional mocks first, full mocks in the last month.", hi: "पहले सेक्शनल मॉक, अंतिम महीने में पूर्ण मॉक।" }
    ]
  },

  /* ------------------------------------------------- Police Constable */
  "csbc": {
    level: { en: "Intermediate (10+2)", hi: "इंटरमीडिएट (10+2)" },
    stages: [
      { name: { en: "Written exam", hi: "लिखित परीक्षा" }, tag: "qualifying", points: [
        { en: "100 objective questions, 100 marks, 2 hours — Hindi, English, Maths, Science, Social Science, GK & current affairs (Class 10–12 level).", hi: "100 वस्तुनिष्ठ प्रश्न, 100 अंक, 2 घंटे — हिन्दी, अंग्रेज़ी, गणित, विज्ञान, सामाजिक विज्ञान, GK व करेंट अफ़ेयर्स (कक्षा 10–12 स्तर)।" },
        { en: "No negative marking. Written test is qualifying (minimum marks as notified).", hi: "नेगेटिव मार्किंग नहीं। लिखित परीक्षा क्वालिफ़ाइंग है (न्यूनतम अंक अधिसूचना अनुसार)।" }
      ] },
      { name: { en: "Physical efficiency test (PET)", hi: "शारीरिक दक्षता परीक्षा (PET)" }, tag: "merit", points: [
        { en: "Running, high jump and shot put — in recent notifications the final merit is prepared mainly from PET marks.", hi: "दौड़, ऊँची कूद और गोला फेंक — हाल की अधिसूचनाओं में अंतिम मेरिट मुख्य रूप से PET के अंकों से बनती है।" },
        { en: "So PET preparation is as important as the written test.", hi: "इसलिए PET की तैयारी लिखित जितनी ही ज़रूरी है।" }
      ] },
      { name: { en: "Medical & documents", hi: "चिकित्सा जाँच एवं दस्तावेज़" }, tag: "qualifying", points: [
        { en: "Height/chest measurement, medical fitness and document verification.", hi: "ऊँचाई/सीना माप, चिकित्सा फ़िटनेस और दस्तावेज़ सत्यापन।" }
      ] }
    ],
    syllabus: [
      { h: { en: "Hindi", hi: "हिन्दी" }, items: { en: "Sandhi, samas, synonyms, antonyms, muhavare, tatsam-tadbhav, spelling", hi: "संधि, समास, पर्यायवाची, विलोम, मुहावरे, तत्सम-तद्भव, वर्तनी" } },
      { h: { en: "English", hi: "अंग्रेज़ी" }, items: { en: "Synonyms, antonyms, error spotting, fill in the blanks, one-word substitution", hi: "पर्यायवाची, विलोम, त्रुटि पहचान, रिक्त स्थान, एक शब्द प्रतिस्थापन" } },
      { h: { en: "Maths", hi: "गणित" }, items: { en: "Class 10 arithmetic — percentage, profit-loss, interest, average, ratio", hi: "कक्षा 10 अंकगणित — प्रतिशत, लाभ-हानि, ब्याज, औसत, अनुपात" } },
      { h: { en: "Science & Social Science", hi: "विज्ञान एवं सामाजिक विज्ञान" }, items: { en: "Class 10 NCERT/Bihar Board level", hi: "कक्षा 10 NCERT/बिहार बोर्ड स्तर" } },
      { h: { en: "GK & Bihar", hi: "GK एवं बिहार" }, items: { en: "Static GK, Bihar GK, current affairs", hi: "स्थैतिक GK, बिहार GK, करेंट अफ़ेयर्स" } }
    ],
    strategy: [
      { t: { en: "Clear written comfortably, win in PET", hi: "लिखित आराम से पास करें, PET में जीतें" }, d: { en: "Aim well above the qualifying mark, but give equal daily time to running and field events.", hi: "क्वालिफ़ाइंग अंक से अच्छा ऊपर का लक्ष्य रखें, पर दौड़ और फ़ील्ड इवेंट्स को रोज़ बराबर समय दें।" } },
      { t: { en: "Attempt all 100", hi: "सभी 100 प्रश्न करें" }, d: { en: "No negative marking — never leave a question blank.", hi: "नेगेटिव मार्किंग नहीं — कोई प्रश्न खाली न छोड़ें।" } },
      { t: { en: "Bihar Board books are enough", hi: "बिहार बोर्ड की किताबें काफ़ी" }, d: { en: "Class 9–10 textbooks for science and social science, plus a GK one-liner book.", hi: "विज्ञान और सामाजिक विज्ञान के लिए कक्षा 9–10 की पाठ्यपुस्तकें, साथ में GK वन-लाइनर किताब।" } },
      { t: { en: "Running plan", hi: "दौड़ की योजना" }, d: { en: "Build up slowly: jog → interval runs → timed runs. Proper shoes, warm-up and rest days prevent injury.", hi: "धीरे-धीरे बढ़ाएँ: जॉग → अंतराल दौड़ → समयबद्ध दौड़। सही जूते, वार्म-अप और आराम के दिन चोट से बचाते हैं।" } }
    ],
    roadmap: { span: { en: "3-month plan", hi: "3 महीने की योजना" }, phases: [
      { when: { en: "Week 1–4", hi: "सप्ताह 1–4" }, t: { en: "Base + fitness", hi: "आधार + फ़िटनेस" }, d: { en: "Hindi grammar, maths basics, science chapters. Daily jogging 3–4 km.", hi: "हिन्दी व्याकरण, गणित की मूल बातें, विज्ञान अध्याय। रोज़ 3–4 किमी जॉगिंग।" } },
      { when: { en: "Week 5–8", hi: "सप्ताह 5–8" }, t: { en: "Full syllabus", hi: "पूरा सिलेबस" }, d: { en: "English, social science, Bihar GK, current affairs. Add high-jump and shot-put practice.", hi: "अंग्रेज़ी, सामाजिक विज्ञान, बिहार GK, करेंट अफ़ेयर्स। ऊँची कूद और गोला फेंक का अभ्यास जोड़ें।" } },
      { when: { en: "Week 9–12", hi: "सप्ताह 9–12" }, t: { en: "Mocks + timed runs", hi: "मॉक + समयबद्ध दौड़" }, d: { en: "Daily mock, previous CSBC papers. Timed trial runs twice a week.", hi: "रोज़ मॉक, पिछले CSBC पेपर। सप्ताह में दो बार समयबद्ध ट्रायल दौड़।" } }
    ] },
    books: [
      { t: { en: "Bihar Board / NCERT Class 9–10 textbooks", hi: "बिहार बोर्ड / NCERT कक्षा 9–10 पाठ्यपुस्तकें" }, d: { en: "Science and social science.", hi: "विज्ञान और सामाजिक विज्ञान।" } },
      { t: "Lucent's General Knowledge", d: { en: "GK one-liners.", hi: "GK वन-लाइनर।" } },
      { t: "Samanya Hindi — Vasudev Nandan Prasad", d: { en: "Hindi grammar.", hi: "हिन्दी व्याकरण।" } },
      { t: "Objective General English — S.P. Bakshi", d: { en: "English section.", hi: "अंग्रेज़ी भाग।" } },
      { t: { en: "CSBC previous year papers", hi: "CSBC पिछले वर्षों के प्रश्नपत्र" }, d: { en: "The best guide to level.", hi: "स्तर का सबसे अच्छा मार्गदर्शक।" } }
    ],
    tips: [
      { en: "Check the height/chest standards for your category before preparing.", hi: "तैयारी से पहले अपनी श्रेणी के ऊँचाई/सीना मानक जाँच लें।" },
      { en: "Sleep 7–8 hours — fitness and memory both need it.", hi: "7–8 घंटे सोएँ — फ़िटनेस और याददाश्त दोनों को इसकी ज़रूरत है।" }
    ]
  },

  /* -------------------------------------------------------- BPSC TRE */
  "bpsc-tre": {
    level: { en: "As per teacher category (D.El.Ed / B.Ed + eligibility test)", hi: "शिक्षक श्रेणी अनुसार (D.El.Ed / B.Ed + पात्रता परीक्षा)" },
    stages: [
      { name: { en: "Written exam — Part I: Language", hi: "लिखित परीक्षा — भाग I: भाषा" }, tag: "qualifying", points: [
        { en: "Language paper (Hindi/other language + English as notified) — only qualifying.", hi: "भाषा पेपर (हिन्दी/अन्य भाषा + अंग्रेज़ी, अधिसूचना अनुसार) — केवल क्वालिफ़ाइंग।" }
      ] },
      { name: { en: "Written exam — Part II: Subject + General Studies", hi: "लिखित परीक्षा — भाग II: विषय + सामान्य अध्ययन" }, tag: "merit", points: [
        { en: "Your teaching subject plus General Studies (maths, reasoning, GK, Bihar, education) — decides merit.", hi: "आपका शिक्षण विषय और सामान्य अध्ययन (गणित, रीज़निंग, GK, बिहार, शिक्षा) — मेरिट तय करता है।" },
        { en: "Objective questions; no negative marking in recent TRE phases.", hi: "वस्तुनिष्ठ प्रश्न; हाल के TRE चरणों में नेगेटिव मार्किंग नहीं।" }
      ] },
      { name: { en: "Document verification", hi: "दस्तावेज़ सत्यापन" }, tag: "qualifying", points: [
        { en: "Training degree, CTET/BTET/STET and domicile documents.", hi: "प्रशिक्षण डिग्री, CTET/BTET/STET और निवास दस्तावेज़।" }
      ] }
    ],
    syllabus: [
      { h: { en: "Elementary Maths", hi: "प्रारंभिक गणित" }, items: { en: "Simplification, percentage, ratio, average, interest, time-work", hi: "सरलीकरण, प्रतिशत, अनुपात, औसत, ब्याज, समय-कार्य" } },
      { h: { en: "Reasoning", hi: "तर्कशक्ति" }, items: { en: "Series, coding, analogy, direction, blood relation", hi: "श्रेणी, कोडिंग, सादृश्यता, दिशा, रक्त संबंध" } },
      { h: { en: "General Awareness & Bihar", hi: "सामान्य जागरूकता एवं बिहार" }, items: { en: "Static GK, Bihar GK, Indian education (RTE Act, commissions), current affairs", hi: "स्थैतिक GK, बिहार GK, भारतीय शिक्षा (RTE अधिनियम, आयोग), करेंट अफ़ेयर्स" } },
      { h: { en: "Your subject", hi: "आपका विषय" }, items: { en: "As per class level (1–5, 6–8, 9–10, 11–12) in the notification", hi: "अधिसूचना में दिए कक्षा स्तर (1–5, 6–8, 9–10, 11–12) के अनुसार" } }
    ],
    strategy: [
      { t: { en: "Subject is the decider", hi: "विषय ही निर्णायक" }, d: { en: "Most marks come from your subject — revise school/college textbooks of that subject thoroughly.", hi: "ज़्यादातर अंक आपके विषय से आते हैं — उस विषय की स्कूल/कॉलेज की पाठ्यपुस्तकें अच्छे से दोहराएँ।" } },
      { t: { en: "Don't take the language paper lightly", hi: "भाषा पेपर को हल्के में न लें" }, d: { en: "It is qualifying — failing it ends the attempt. Practise grammar and comprehension weekly.", hi: "यह क्वालिफ़ाइंग है — इसमें फेल होने पर प्रयास समाप्त। हर सप्ताह व्याकरण और गद्यांश का अभ्यास करें।" } },
      { t: { en: "Attempt everything", hi: "सभी प्रश्न करें" }, d: { en: "With no negative marking, leave nothing blank.", hi: "नेगेटिव मार्किंग न होने पर कुछ भी खाली न छोड़ें।" } },
      { t: { en: "Education-related GK", hi: "शिक्षा से जुड़ा GK" }, d: { en: "RTE Act, NEP, education commissions and Bihar education schemes often appear.", hi: "RTE अधिनियम, NEP, शिक्षा आयोग और बिहार की शिक्षा योजनाएँ अक्सर पूछी जाती हैं।" } }
    ],
    roadmap: { span: { en: "3-month plan", hi: "3 महीने की योजना" }, phases: [
      { when: { en: "Month 1", hi: "महीना 1" }, t: { en: "Subject + language", hi: "विषय + भाषा" }, d: { en: "Full subject syllabus pass 1; language grammar.", hi: "पूरे विषय सिलेबस का पहला दौर; भाषा व्याकरण।" } },
      { when: { en: "Month 2", hi: "महीना 2" }, t: { en: "GS + subject pass 2", hi: "GS + विषय दूसरा दौर" }, d: { en: "Maths, reasoning, Bihar GK, education GK; subject revision with MCQs.", hi: "गणित, रीज़निंग, बिहार GK, शिक्षा GK; MCQ के साथ विषय रिवीज़न।" } },
      { when: { en: "Month 3", hi: "महीना 3" }, t: { en: "Mocks", hi: "मॉक" }, d: { en: "Previous TRE papers, daily mocks, current affairs.", hi: "पिछले TRE पेपर, रोज़ मॉक, करेंट अफ़ेयर्स।" } }
    ] },
    books: [
      { t: { en: "NCERT / Bihar Board textbooks of your subject", hi: "आपके विषय की NCERT / बिहार बोर्ड पाठ्यपुस्तकें" }, d: { en: "Core of Part II.", hi: "भाग II का मुख्य आधार।" } },
      { t: "Lucent's General Knowledge", d: { en: "GS part.", hi: "GS भाग।" } },
      { t: "Quantitative Aptitude / Reasoning — R.S. Aggarwal", d: { en: "Maths and reasoning.", hi: "गणित और रीज़निंग।" } },
      { t: { en: "BPSC TRE previous papers", hi: "BPSC TRE पिछले प्रश्नपत्र" }, d: { en: "All phases (1.0, 2.0, 3.0…).", hi: "सभी चरण (1.0, 2.0, 3.0…)।" } }
    ],
    tips: [
      { en: "Check which class level and subject you are eligible for before applying.", hi: "आवेदन से पहले जाँचें कि आप किस कक्षा स्तर और विषय के लिए पात्र हैं।" },
      { en: "Keep your eligibility-test certificate valid and ready.", hi: "अपना पात्रता परीक्षा प्रमाणपत्र वैध और तैयार रखें।" }
    ]
  },

  /* -------------------------------------------------------- Bihar GK */
  "bihar-gk": {
    level: { en: "For every Bihar exam", hi: "बिहार की हर परीक्षा के लिए" },
    stages: [
      { name: { en: "Where it is asked", hi: "कहाँ पूछा जाता है" }, tag: "merit", points: [
        { en: "BPSC (Prelims + Mains), Bihar SI, BSSC Inter & CGL, Constable, TRE, Bihar Police and other state exams.", hi: "BPSC (प्रारंभिक + मुख्य), बिहार दारोगा, BSSC इंटर व स्नातक, सिपाही, TRE, बिहार पुलिस और अन्य राज्य परीक्षाएँ।" },
        { en: "These questions usually decide the cut-off, because outside-state candidates find them hard.", hi: "यही प्रश्न अक्सर कट-ऑफ़ तय करते हैं, क्योंकि बाहरी अभ्यर्थियों को ये कठिन लगते हैं।" }
      ] }
    ],
    syllabus: [
      { h: { en: "Bihar History", hi: "बिहार का इतिहास" }, items: { en: "Magadh, Mauryas, Guptas, Nalanda & Vikramshila, Buddha & Mahavira, Sher Shah, 1857, Champaran, Quit India, JP movement", hi: "मगध, मौर्य, गुप्त, नालंदा व विक्रमशिला, बुद्ध व महावीर, शेरशाह, 1857, चंपारण, भारत छोड़ो, जेपी आंदोलन" } },
      { h: { en: "Bihar Geography", hi: "बिहार का भूगोल" }, items: { en: "Rivers, divisions & districts, soils, climate, minerals, wildlife sanctuaries, waterfalls", hi: "नदियाँ, प्रमंडल व ज़िले, मिट्टी, जलवायु, खनिज, वन्यजीव अभयारण्य, जलप्रपात" } },
      { h: { en: "Bihar Economy", hi: "बिहार की अर्थव्यवस्था" }, items: { en: "Agriculture, makhana, litchi, industries, Bihar Economic Survey highlights, state schemes", hi: "कृषि, मखाना, लीची, उद्योग, बिहार आर्थिक सर्वेक्षण के मुख्य बिंदु, राज्य योजनाएँ" } },
      { h: { en: "Art, Culture & Polity", hi: "कला, संस्कृति एवं राजव्यवस्था" }, items: { en: "Madhubani, Chhath, fairs, folk dances & songs, languages, Bihar Legislature, local bodies", hi: "मधुबनी, छठ, मेले, लोकनृत्य व लोकगीत, भाषाएँ, बिहार विधानमंडल, स्थानीय निकाय" } }
    ],
    strategy: [
      { t: { en: "One Bihar notebook", hi: "बिहार की एक कॉपी" }, d: { en: "Write every Bihar fact you meet in one notebook, topic-wise. It becomes your final revision.", hi: "जो भी बिहार तथ्य मिले, उसे टॉपिक-वार एक कॉपी में लिखें। यही आपका अंतिम रिवीज़न बनेगी।" } },
      { t: { en: "Learn with the map", hi: "नक्शे के साथ पढ़ें" }, d: { en: "Mark rivers, districts, sanctuaries and historical places on a blank Bihar map.", hi: "खाली बिहार नक्शे पर नदियाँ, ज़िले, अभयारण्य और ऐतिहासिक स्थल चिह्नित करें।" } },
      { t: { en: "Link history with places", hi: "इतिहास को स्थानों से जोड़ें" }, d: { en: "Vaishali → Licchavi, Mahavira; Rajgir → Bimbisara; Sasaram → Sher Shah. Places make facts stick.", hi: "वैशाली → लिच्छवि, महावीर; राजगीर → बिंबिसार; सासाराम → शेरशाह। स्थान तथ्यों को याद रखने में मदद करते हैं।" } },
      { t: { en: "Bihar current affairs monthly", hi: "बिहार करेंट अफ़ेयर्स हर महीने" }, d: { en: "State schemes, budget highlights, appointments and awards — revise monthly.", hi: "राज्य योजनाएँ, बजट के मुख्य बिंदु, नियुक्तियाँ और पुरस्कार — हर महीने दोहराएँ।" } }
    ],
    roadmap: { span: { en: "6-week plan", hi: "6 सप्ताह की योजना" }, phases: [
      { when: { en: "Week 1–2", hi: "सप्ताह 1–2" }, t: { en: "History", hi: "इतिहास" }, d: { en: "Ancient → medieval → modern Bihar.", hi: "प्राचीन → मध्यकालीन → आधुनिक बिहार।" } },
      { when: { en: "Week 3–4", hi: "सप्ताह 3–4" }, t: { en: "Geography + economy", hi: "भूगोल + अर्थव्यवस्था" }, d: { en: "Map work, rivers, crops, industries, Economic Survey summary.", hi: "नक्शा अभ्यास, नदियाँ, फ़सलें, उद्योग, आर्थिक सर्वेक्षण सारांश।" } },
      { when: { en: "Week 5–6", hi: "सप्ताह 5–6" }, t: { en: "Culture + revision", hi: "संस्कृति + रिवीज़न" }, d: { en: "Art, festivals, polity; then the Grand Mock here and full revision.", hi: "कला, त्योहार, राजव्यवस्था; फिर यहाँ ग्रैंड मॉक और पूरा रिवीज़न।" } }
    ] },
    books: [
      { t: { en: "Bihar Economic Survey (Govt. of Bihar)", hi: "बिहार आर्थिक सर्वेक्षण (बिहार सरकार)" }, d: { en: "Official, free; read the summary chapter.", hi: "आधिकारिक, निःशुल्क; सारांश अध्याय पढ़ें।" } },
      { t: { en: "Any one standard Bihar GK book", hi: "कोई एक मानक बिहार GK किताब" }, d: { en: "Pick one and finish it 3 times — don't collect many.", hi: "एक चुनें और उसे 3 बार पूरा करें — कई जमा न करें।" } },
      { t: { en: "Bihar pages of a daily newspaper", hi: "दैनिक अख़बार के बिहार पेज" }, d: { en: "For state current affairs.", hi: "राज्य के करेंट अफ़ेयर्स के लिए।" } }
    ],
    tips: [
      { en: "Revise the Bihar notebook every Sunday — 30 minutes is enough.", hi: "हर रविवार बिहार वाली कॉपी दोहराएँ — 30 मिनट काफ़ी हैं।" },
      { en: "Where sources disagree on a fact, prefer official government sources.", hi: "जहाँ स्रोतों में किसी तथ्य पर मतभेद हो, वहाँ आधिकारिक सरकारी स्रोत को प्राथमिकता दें।" }
    ]
  }
};
