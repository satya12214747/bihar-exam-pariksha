# बिहार परीक्षा मंच — Bihar Exam Pariksha

Free, CBT-style mock tests for Bihar competitive exams (BPSC, Bihar SI, BSSC Inter & CGL, Bihar Police Constable, BPSC TRE, Bihar GK).
See **ROADMAP.md** for the full plan.

## Run locally
```
python -m http.server 5173
```
Open http://127.0.0.1:5173/  — or just double-click `index.html` (works from the file system too; offline/PWA needs http).

## Deploy
Pure static files with no build step. Upload the folder to GitHub Pages, Netlify or any web host.

## Add or edit questions
1. Edit or create `data/sets/set-NN.js` (strict JSON inside `BEP.registerSet(...)`, see ROADMAP §5).
2. `python tools/validate_sets.py` — schema, answer keys and duplicates.
3. `python tools/build_index.py` — regenerates the catalogue `data/index.js`.

Marking schemes and exam names live in `js/exams.js`.

## QA
With the server running, open http://127.0.0.1:5173/tools/selftest.html. It drives a full exam (answer, mark, submit) and checks the computed score.
