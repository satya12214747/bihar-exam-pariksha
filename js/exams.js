/* Exam configurations. Marking schemes follow the latest known notification
   patterns; update here if a commission changes its pattern. */
window.BEP = window.BEP || { sets: {}, catalog: [] };
BEP.version = 4;
BEP.registerSet = function (d) { BEP.sets[d.id] = d; };

BEP.exams = {
  "bpsc": {
    short: { en: "BPSC", hi: "BPSC" },
    name: { en: "BPSC Combined Competitive (Prelims)", hi: "बीपीएससी संयुक्त प्रतियोगी (प्रारंभिक)" },
    body: { en: "Bihar Public Service Commission", hi: "बिहार लोक सेवा आयोग" },
    pos: 1, neg: 1 / 3, color: "#b42318",
    pattern: { en: "Real exam: 150 Q · 150 marks · 2 hours", hi: "वास्तविक परीक्षा: 150 प्रश्न · 150 अंक · 2 घंटे" }
  },
  "bihar-si": {
    short: { en: "Bihar SI", hi: "बिहार दारोगा" },
    name: { en: "Bihar Police Sub-Inspector (Prelims)", hi: "बिहार पुलिस अवर निरीक्षक (प्रारंभिक)" },
    body: { en: "BPSSC", hi: "बिहार पुलिस अवर सेवा आयोग" },
    pos: 2, neg: 0.2, color: "#1d4ed8",
    pattern: { en: "Real exam: 100 Q · 200 marks · 2 hours", hi: "वास्तविक परीक्षा: 100 प्रश्न · 200 अंक · 2 घंटे" }
  },
  "bssc-inter": {
    short: { en: "BSSC +2", hi: "BSSC इंटर" },
    name: { en: "BSSC Inter Level (+2)", hi: "बीएसएससी इंटर स्तरीय (+2)" },
    body: { en: "Bihar Staff Selection Commission", hi: "बिहार कर्मचारी चयन आयोग" },
    pos: 4, neg: 1, color: "#0f766e",
    pattern: { en: "Real exam: 150 Q · 600 marks · 2 h 15 min", hi: "वास्तविक परीक्षा: 150 प्रश्न · 600 अंक · 2 घंटे 15 मिनट" }
  },
  "bssc-cgl": {
    short: { en: "BSSC CGL", hi: "BSSC स्नातक" },
    name: { en: "BSSC Graduate Level (CGL-4)", hi: "बीएसएससी स्नातक स्तरीय (CGL-4)" },
    body: { en: "Bihar Staff Selection Commission", hi: "बिहार कर्मचारी चयन आयोग" },
    pos: 4, neg: 1, color: "#7c3aed",
    pattern: { en: "Real exam: 150 Q · 600 marks · 2 h 15 min", hi: "वास्तविक परीक्षा: 150 प्रश्न · 600 अंक · 2 घंटे 15 मिनट" }
  },
  "csbc": {
    short: { en: "Constable", hi: "सिपाही" },
    name: { en: "Bihar Police Constable", hi: "बिहार पुलिस सिपाही" },
    body: { en: "CSBC Bihar", hi: "केंद्रीय चयन पर्षद (सिपाही भर्ती)" },
    pos: 1, neg: 0, color: "#a15c07",
    pattern: { en: "Real exam: 100 Q · 100 marks · 2 hours", hi: "वास्तविक परीक्षा: 100 प्रश्न · 100 अंक · 2 घंटे" }
  },
  "bpsc-tre": {
    short: { en: "BPSC TRE", hi: "BPSC शिक्षक" },
    name: { en: "BPSC Teacher Recruitment (GS)", hi: "बीपीएससी शिक्षक भर्ती (सामान्य अध्ययन)" },
    body: { en: "Bihar Public Service Commission", hi: "बिहार लोक सेवा आयोग" },
    pos: 1, neg: 0, color: "#be185d",
    pattern: { en: "Real exam: Language + Subject + GS papers", hi: "वास्तविक परीक्षा: भाषा + विषय + सामान्य अध्ययन" }
  },
  "bihar-gk": {
    short: { en: "Bihar GK", hi: "बिहार GK" },
    name: { en: "Bihar Special GK (All Exams)", hi: "बिहार विशेष सामान्य ज्ञान (सभी परीक्षाएँ)" },
    body: { en: "Useful for every Bihar exam", hi: "बिहार की हर परीक्षा के लिए उपयोगी" },
    pos: 1, neg: 0.25, color: "#ea580c",
    pattern: { en: "Grand mock · Bihar-only questions", hi: "ग्रैंड मॉक · केवल बिहार से प्रश्न" }
  }
};

BEP.examOrder = ["bpsc", "bihar-si", "bssc-inter", "bssc-cgl", "csbc", "bpsc-tre", "bihar-gk"];

/* Load a set file on demand (a script tag works from file:// too). */
BEP.loadSet = function (id) {
  if (BEP.sets[id]) return Promise.resolve(BEP.sets[id]);
  if (!/^set-\d{2}$/.test(id)) return Promise.reject(new Error("bad id"));
  return new Promise(function (resolve, reject) {
    var s = document.createElement("script");
    s.src = "data/sets/" + id + ".js?v=" + BEP.version;
    s.onload = function () { BEP.sets[id] ? resolve(BEP.sets[id]) : reject(new Error("empty")); };
    s.onerror = function () { s.remove(); reject(new Error("load failed")); };
    document.head.appendChild(s);
  });
};
