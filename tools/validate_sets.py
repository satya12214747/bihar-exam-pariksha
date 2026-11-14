"""Validate question set files in data/sets/.

Each file must look like:  BEP.registerSet({ ...strict JSON... });
Usage:  python tools/validate_sets.py            (all sets)
        python tools/validate_sets.py set-03.js  (one file)
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETS_DIR = ROOT / "data" / "sets"
EXAMS = {"bpsc", "bihar-si", "bssc-inter", "bssc-cgl", "csbc", "bpsc-tre", "bihar-gk"}
DIFF = {"easy", "medium", "hard"}


def norm(t):
    return re.sub(r"[\W_]", "", t.lower())  # \w is Unicode-aware, keeps Devanagari


def load(path):
    src = path.read_text(encoding="utf-8").strip()
    m = re.match(r"^BEP\.registerSet\((.*)\);?\s*$", src, re.S)
    if not m:
        raise ValueError("file must be exactly: BEP.registerSet({...});")
    return json.loads(m.group(1))


def check(path, seen_global):
    errs, warns = [], []
    try:
        d = load(path)
    except Exception as ex:  # noqa: BLE001
        return [f"PARSE: {ex}"], [], None
    for k in ("id", "exam", "title", "durationMin", "sections", "questions"):
        if k not in d:
            errs.append(f"missing top-level key '{k}'")
    if errs:
        return errs, warns, d
    if d["id"] != path.stem:
        errs.append(f"id '{d['id']}' must equal file name '{path.stem}'")
    if d["exam"] not in EXAMS:
        errs.append(f"unknown exam '{d['exam']}'")
    sec_ids = set()
    for s in d["sections"]:
        if not {"id", "name"} <= s.keys() or not {"en", "hi"} <= s["name"].keys():
            errs.append(f"bad section {s}")
        sec_ids.add(s.get("id"))
    answers = Counter()
    seen_local = set()
    for i, q in enumerate(d["questions"], 1):
        p = f"Q{i}"
        for k in ("s", "q", "o", "a", "e", "d"):
            if k not in q:
                errs.append(f"{p}: missing '{k}'")
        if any(k not in q for k in ("s", "q", "o", "a", "e", "d")):
            continue
        if q["s"] not in sec_ids:
            errs.append(f"{p}: section '{q['s']}' not declared")
        for lang in ("en", "hi"):
            if not str(q["q"].get(lang, "")).strip():
                errs.append(f"{p}: empty q.{lang}")
            if not str(q["e"].get(lang, "")).strip():
                errs.append(f"{p}: empty e.{lang}")
            opts = q["o"].get(lang)
            if not isinstance(opts, list) or len(opts) != 4 or any(not str(x).strip() for x in opts):
                errs.append(f"{p}: o.{lang} must be 4 non-empty options")
            elif len(set(map(str, opts))) != 4:
                errs.append(f"{p}: duplicate options in o.{lang}")
        if not isinstance(q["a"], int) or not 0 <= q["a"] <= 3:
            errs.append(f"{p}: a must be int 0-3")
        else:
            answers[q["a"]] += 1
        if q["d"] not in DIFF:
            errs.append(f"{p}: d must be easy/medium/hard")
        key = norm(q["q"]["en"])
        if key in seen_local:
            errs.append(f"{p}: duplicate question inside set")
        seen_local.add(key)
        if key in seen_global:
            warns.append(f"{p}: same question also in {seen_global[key]}")
        else:
            seen_global[key] = path.stem
    n = len(d["questions"])
    if n != 25:
        warns.append(f"has {n} questions (expected 25)")
    if n and max(answers.values(), default=0) > n * 0.4:
        warns.append(f"answer key unbalanced: {dict(sorted(answers.items()))}")
    return errs, warns, d


def main():
    files = sorted(SETS_DIR.glob("set-*.js"))
    if len(sys.argv) > 1:
        files = [SETS_DIR / a for a in sys.argv[1:]]
    seen, total_q, bad = {}, 0, 0
    for f in files:
        errs, warns, d = check(f, seen)
        n = len(d["questions"]) if d and "questions" in d else 0
        total_q += n
        status = "FAIL" if errs else "ok  "
        bad += bool(errs)
        print(f"[{status}] {f.name}: {n} questions")
        for e in errs:
            print(f"     ERROR {e}")
        for w in warns:
            print(f"     warn  {w}")
    print(f"\n{len(files)} files, {total_q} questions, {bad} failing")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
