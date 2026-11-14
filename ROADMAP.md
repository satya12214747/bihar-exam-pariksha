# Bihar Exam Pariksha — Product Roadmap

> A free, mobile-first mock test platform for Bihar competitive exams that gives a **real CBT (computer-based test) exam-hall experience**: same palette colours, same buttons, timer, negative marking, bilingual (Hindi / English) questions and a detailed post-exam analysis.

---

## 1. Who it is for

| Persona | Need | What we must give |
|---|---|---|
| Aspirant from a small town / village | Cheap phone, patchy 2G/4G, limited data | Very small download, works **offline** after the first visit, no login wall |
| Hindi-medium student | Wants questions in Hindi | **Hindi / English toggle on every question**, Devanagari-friendly fonts |
| First-time CBT candidate | Never seen the TCS-iON style exam screen | Replica of the real interface + instructions page, so exam day has no surprises |
| Serious repeat aspirant | Wants to know weak areas | Section-wise analysis, accuracy, time per question, attempt history |

## 2. Exams covered (v1)

| Code | Exam | Conducting body | Marking used in our mocks* |
|---|---|---|---|
| `bpsc` | BPSC Combined Competitive Exam – Prelims (GS) | BPSC | +1, −1/3 |
| `bihar-si` | Bihar Police Sub-Inspector (Daroga) – Prelims | BPSSC | +2, −0.2 |
| `bssc-inter` | BSSC Inter Level (+2) | BSSC | +4, −1 |
| `bssc-cgl` | BSSC Graduate Level (CGL-4) | BSSC | +4, −1 |
| `csbc` | Bihar Police Constable | CSBC | +1, no negative |
| `bpsc-tre` | BPSC TRE (Teacher) – General Studies | BPSC | +1, no negative |
| `bihar-gk` | Bihar Special GK – Grand Mock (useful for all exams) | — | +1, −0.25 |

\* Taken from the most recent notification patterns. Patterns change; every set shows the marking scheme on its instruction page and the scheme lives in one config file (`js/exams.js`), so it can be updated in seconds.

## 3. The 20 test sets (v1)

Each set has **25 bilingual questions** with explanations. The time limit is scaled from the real exam's time-per-question.

| # | Set | Exam | Sections | Time |
|---|---|---|---|---|
| 1–5 | BPSC Prelims Mock 1–5 | bpsc | History, Geography, Polity, Economy, Science, Bihar GK, Mental Ability | 20 min |
| 6–8 | Bihar SI Prelims Mock 1–3 | bihar-si | GS, Bihar GK, Science, Polity, Maths | 30 min |
| 9–12 | BSSC Inter Level Mock 1–4 | bssc-inter | General Studies, Science & Maths, Mental Ability | 23 min |
| 13–16 | BSSC CGL Mock 1–4 | bssc-cgl | General Studies, Science & Maths, Mental Ability | 23 min |
| 17–18 | Bihar Police Constable Mock 1–2 | csbc | Hindi, English, Maths, Science, Social Science, GK | 30 min |
| 19 | BPSC TRE GS Mock | bpsc-tre | Maths, Reasoning, GK / GS | 25 min |
| 20 | Bihar Special GK Grand Mock | bihar-gk | Bihar History, Geography, Economy, Culture, Polity | 25 min |

## 4. Feature set

### 4.1 Home / dashboard
- Hero with a "Start a free mock" call to action, plus quick stats (sets attempted, best score, average accuracy).
- **Exam filter chips** (All, BPSC, Bihar SI, BSSC +2, BSSC CGL, Constable, TRE, Bihar GK).
- Test cards: exam badge, questions, marks, time, negative marking, difficulty, and the student's best score and attempt count.
- Resume banner if a test was left half-way (state is saved every second).
- Language switch (हिन्दी / English) for the UI, and a dark mode.

### 4.2 Instructions screen (the real exam's "General Instructions")
- Candidate name (stored locally only), default question language.
- Explanation of the palette colours and the buttons.
- Marking scheme, duration and sections for that set.
- "I have read and understood the instructions" checkbox, which must be ticked before Start.

### 4.3 Live exam interface (the core experience)
- **Top bar:** exam name, candidate name, **countdown timer** (turns amber under 5 min and red under 1 min, with a toast warning), language toggle and full-screen button.
- **Section tabs** that show answered/total per section.
- **Question panel:** question number, marks (+x / −y), question text and 4 options as large tappable cards (the radio dot plus the full card are clickable; keys 1–4 / A–D also select).
- **Action bar (same as the real CBT):** `Mark for Review & Next`, `Clear Response`, `Previous`, `Save & Next`.
- **Question palette** with the five official states:
  - ⬜ Not Visited · 🟥 Not Answered · 🟩 Answered · 🟪 Marked for Review · 🟪✅ Answered & Marked for Review (counted for evaluation)
  - Live legend counts.
- On mobile the palette becomes a slide-up drawer.
- **Submit**: a confirmation modal with a per-status summary table. **Auto-submit** happens when time runs out.
- Autosave of the whole attempt to `localStorage`, so a refresh or dropped connection loses nothing.
- Keyboard shortcuts: ← / → navigate, 1–4 select, M marks for review, C clears.

### 4.4 Result & analysis
- Score card: score / max, correct, wrong, skipped, accuracy %, negative marks deducted, time taken.
- Score ring plus a section-wise bar breakdown (score, accuracy).
- Time spent per question.
- **Solutions review:** every question with your answer, the correct answer and a bilingual explanation. Filter by All / Correct / Wrong / Skipped / Marked.
- "Reattempt" and "Back to all tests" buttons.
- Attempt history is stored per set (best and last score shown on the dashboard).

### 4.5 Accessibility & reach
- Pure static HTML/CSS/JS with **zero dependencies**: opens straight from the file system or any free static host (GitHub Pages / Netlify).
- **PWA**: installable on Android home screen, offline via a service worker (when served over http/https).
- Mobile-first layout, minimum 44 px tap targets, high-contrast palette, `prefers-reduced-motion` respected, ARIA labels on palette and timer, visible focus rings.
- Total size well under 1 MB.

## 5. Architecture

```
BIHAR EXAM/
├── index.html            # Single-page app shell (home → instructions → exam → result)
├── manifest.webmanifest  # PWA manifest
├── sw.js                 # Offline cache
├── css/styles.css        # Design system + all screens
├── js/
│   ├── exams.js          # Exam configs: name, marking, colour, pattern notes
│   ├── store.js          # localStorage wrapper (attempts, in-progress state, prefs)
│   ├── i18n.js           # UI strings in Hindi / English
│   └── app.js            # Router + screens (home, instructions, exam engine, results)
├── data/
│   ├── index.js          # Registry and the order of sets
│   └── sets/set-01.js … set-20.js   # Question data (strict JSON inside BEP.registerSet(...))
└── tools/validate_sets.py   # Checks schema, answer keys, duplicates, answer-key balance
```

**Why `.js` data files rather than `.json`:** `fetch()` is blocked on `file://`. Script files let a student just double-click `index.html`. The inner payload is still strict JSON, so it can be generated or validated by tooling and moved to an API later.

**Question schema**
```json
{
  "s": "history",                       // section id
  "q": { "en": "...", "hi": "..." },    // question
  "o": { "en": ["A","B","C","D"], "hi": ["क","ख","ग","घ"] },
  "a": 2,                               // index of the correct option (0-3)
  "e": { "en": "...", "hi": "..." },    // explanation
  "d": "easy | medium | hard"
}
```

## 6. Quality bar for content
- One unambiguous correct answer per question, with every maths answer computed and checked.
- No volatile current-affairs facts (current office holders, recent rankings) in v1. Static GK only, so the bank does not go stale.
- Answer keys spread roughly evenly over A/B/C/D.
- No duplicate questions inside a set (checked by `tools/validate_sets.py`).

## 7. Execution phases

| Phase | Deliverable | Status |
|---|---|---|
| 0 | Roadmap (this file) | ✅ |
| 1 | Design system and app shell (layout, theme, i18n, storage) | ✅ |
| 2 | Exam engine: timer, palette states, navigation, autosave, auto-submit | ✅ |
| 3 | Result and solutions analysis | ✅ |
| 4 | 20 test sets (500 bilingual questions) and a validator | ✅ |
| 5 | PWA / offline, accessibility pass, mobile polish | ✅ |
| 6 | QA: validator run, manual walk-through | ✅ |

## 8. Future (v2+)
- **Full-length mocks** (150 Q BPSC, 100 Q SI) built by sampling a larger question bank.
- Backend (Supabase / Firebase): login by mobile OTP, cloud sync, **All-Bihar rank and percentile** on live scheduled tests.
- Admin panel to add questions (CSV/Excel upload), with review and approval.
- Previous Year Papers (PYQ) section, topic-wise practice and daily quiz.
- Weekly current-affairs packs (Bihar + national), each dated.
- Performance trends graph across attempts; weak-topic recommendations.
- BPSC 5-option format ("More than one of the above") toggle.
- Bhojpuri/Maithili UI, text-to-speech for questions, and a PDF download of solutions.
