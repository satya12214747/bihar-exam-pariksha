/* Admin — Question Manager.
   Create / edit question sets, bulk-import from Excel/CSV, validate, preview,
   and publish straight to the GitHub repo (GitHub Pages redeploys the site).
   Security: nothing can be published without a GitHub token that only the
   admin has. The token lives in this browser tab only (sessionStorage) unless
   "remember" is ticked, and is sent only to api.github.com. */
(function () {
  "use strict";

  var CFG = {
    owner: "satya12214747",
    repo: "bihar-exam-pariksha",
    branch: "main",
    // Commits are always made with the private GitHub address, never a work email.
    author: { name: "Satya Prakash", email: "120938334+satya12214747@users.noreply.github.com" },
    site: "https://satya12214747.github.io/bihar-exam-pariksha/"
  };
  var KEYS = ["A", "B", "C", "D"];
  var DIFFS = ["easy", "medium", "hard"];
  var RATE = { "bpsc": 0.8, "bihar-si": 1.2, "bssc-inter": 0.9, "bssc-cgl": 0.9, "csbc": 1.2, "bpsc-tre": 1.0, "bihar-gk": 1.0 };
  function sec(id, en, hi) { return { id: id, name: { en: en, hi: hi } }; }
  var DEFAULT_SECTIONS = {
    "bpsc": [sec("history", "History", "इतिहास"), sec("geography", "Geography", "भूगोल"), sec("polity", "Indian Polity", "भारतीय राजव्यवस्था"),
      sec("economy", "Economy", "अर्थव्यवस्था"), sec("science", "General Science", "सामान्य विज्ञान"), sec("bihar", "Bihar GK", "बिहार सामान्य ज्ञान"),
      sec("reasoning", "Mental Ability", "मानसिक क्षमता")],
    "bihar-si": [sec("gs", "General Studies", "सामान्य अध्ययन"), sec("bihar", "Bihar GK", "बिहार सामान्य ज्ञान"), sec("science", "General Science", "सामान्य विज्ञान"),
      sec("polity", "Polity & Law", "राजव्यवस्था एवं विधि"), sec("maths", "Arithmetic", "अंकगणित")],
    "bssc-inter": [sec("gs", "General Studies", "सामान्य अध्ययन"), sec("scimath", "General Science & Maths", "सामान्य विज्ञान एवं गणित"), sec("reasoning", "Mental Ability Test", "मानसिक क्षमता जाँच")],
    "bssc-cgl": [sec("gs", "General Studies", "सामान्य अध्ययन"), sec("scimath", "General Science & Maths", "सामान्य विज्ञान एवं गणित"), sec("reasoning", "Mental Ability Test", "मानसिक क्षमता जाँच")],
    "csbc": [sec("hindi", "Hindi", "हिन्दी"), sec("english", "English", "अंग्रेज़ी"), sec("maths", "Mathematics", "गणित"), sec("science", "Science", "विज्ञान"),
      sec("social", "Social Science", "सामाजिक विज्ञान"), sec("gk", "General Knowledge & Bihar", "सामान्य ज्ञान एवं बिहार")],
    "bpsc-tre": [sec("maths", "Elementary Maths", "प्रारंभिक गणित"), sec("reasoning", "Reasoning", "तर्कशक्ति"), sec("gk", "General Awareness & Bihar", "सामान्य जागरूकता एवं बिहार")],
    "bihar-gk": [sec("bhistory", "Bihar History", "बिहार का इतिहास"), sec("bgeo", "Bihar Geography", "बिहार का भूगोल"), sec("beco", "Bihar Economy", "बिहार की अर्थव्यवस्था"),
      sec("bculture", "Art, Culture & Polity", "कला, संस्कृति एवं राजव्यवस्था")]
  };
  var CSV_COLS = ["section", "difficulty", "question_en", "question_hi", "option_a_en", "option_b_en", "option_c_en", "option_d_en",
    "option_a_hi", "option_b_hi", "option_c_hi", "option_d_hi", "answer", "explanation_en", "explanation_hi"];

  /* ---------------- state ---------------- */
  var A = {
    token: "", login: "", connected: false,
    catalog: (BEP.catalog || []).slice(),
    set: null, original: "", isNew: false, dirty: false,
    open: {}, errors: null, filter: ""
  };
  var root = document.getElementById("admin");

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function store(kind) { try { return kind === "local" ? window.localStorage : window.sessionStorage; } catch (e) { return null; } }
  function sget(kind, k) { var s = store(kind); try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function sset(kind, k, v) { var s = store(kind); try { if (s) s.setItem(k, v); } catch (e) {} }
  function sdel(kind, k) { var s = store(kind); try { if (s) s.removeItem(k); } catch (e) {} }
  function examName(id) { var e = BEP.exams[id]; return e ? e.name.en : id; }
  function blankQ(s) { return { s: s || "", q: { en: "", hi: "" }, o: { en: ["", "", "", ""], hi: ["", "", "", ""] }, a: 0, e: { en: "", hi: "" }, d: "medium" }; }
  function nextId() {
    var max = 0;
    A.catalog.forEach(function (c) { var n = parseInt(c.id.slice(4), 10); if (n > max) max = n; });
    var n = max + 1;
    return "set-" + (n < 10 ? "0" + n : String(n));
  }
  function toast(msg, kind) {
    var box = document.querySelector(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("role", "status"); document.body.appendChild(box); }
    var el = document.createElement("div"); el.className = "toast " + (kind || ""); el.textContent = msg; box.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }
  function modal(html, bind) {
    var back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = '<div class="modal admin-modal" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(back);
    function close() { back.remove(); document.removeEventListener("keydown", onKey, true); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey, true);
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    back.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", close); });
    if (bind) bind(back, close);
    var f = back.querySelector("[data-autofocus]"); if (f) f.focus();
    return close;
  }
  function getPath(o, path) { return path.split(".").reduce(function (x, k) { return x == null ? x : x[k]; }, o); }
  function setPath(o, path, v) {
    var ks = path.split("."), last = ks.pop();
    var tgt = ks.reduce(function (x, k) { return x[k]; }, o);
    tgt[last] = v;
  }

  /* ---------------- base64 (UTF-8 safe) ---------------- */
  function b64encode(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64decode(b64) {
    var bin = atob(b64.replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------------- file formats ---------------- */
  function parseSetFile(text) {
    var m = /^\s*BEP\.registerSet\(([\s\S]*)\);?\s*$/.exec(text);
    if (!m) throw new Error("Not a question-set file");
    return JSON.parse(m[1]);
  }
  function orderedSet(s) {
    return {
      id: s.id, exam: s.exam, title: { en: s.title.en, hi: s.title.hi }, durationMin: s.durationMin,
      sections: s.sections.map(function (x) { return { id: x.id, name: { en: x.name.en, hi: x.name.hi } }; }),
      questions: s.questions.map(function (q) {
        return { s: q.s, q: { en: q.q.en, hi: q.q.hi }, o: { en: q.o.en.slice(), hi: q.o.hi.slice() }, a: q.a, e: { en: q.e.en, hi: q.e.hi }, d: q.d };
      })
    };
  }
  function setFileText(s) { return "BEP.registerSet(" + JSON.stringify(orderedSet(s), null, 1) + ");\n"; }
  function catalogEntry(s) {
    var diff = {};
    s.questions.forEach(function (q) { diff[q.d] = (diff[q.d] || 0) + 1; });
    return { id: s.id, exam: s.exam, title: { en: s.title.en, hi: s.title.hi }, durationMin: s.durationMin, count: s.questions.length, diff: diff };
  }
  function catalogFileText(cat) {
    return "/* Generated by tools/build_index.py or the admin panel — do not edit by hand */\nBEP.catalog = " + JSON.stringify(cat, null, 1) + ";\n";
  }
  function parseCatalogFile(text) {
    return JSON.parse(text.replace(/^[\s\S]*?BEP\.catalog\s*=\s*/, "").replace(/;\s*$/, ""));
  }

  /* ---------------- validation (mirrors tools/validate_sets.py) ---------------- */
  function norm(t) { return String(t).toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""); }
  function validate(s) {
    var errs = [], warns = [], seen = {}, secIds = {}, counts = [0, 0, 0, 0];
    if (!/^set-\d{2,3}$/.test(s.id)) errs.push({ msg: "Set ID must look like set-21" });
    if (!BEP.exams[s.exam]) errs.push({ msg: "Choose an exam" });
    if (!String(s.title.en).trim() || !String(s.title.hi).trim()) errs.push({ msg: "Title is needed in English and Hindi" });
    if (!(s.durationMin >= 1 && s.durationMin <= 300)) errs.push({ msg: "Duration must be 1–300 minutes" });
    if (!s.sections.length) errs.push({ msg: "Add at least one section" });
    s.sections.forEach(function (x, i) {
      if (!/^[a-z][a-z0-9-]{0,24}$/.test(x.id)) errs.push({ msg: "Section " + (i + 1) + ": ID must be lowercase letters/numbers (e.g. history)" });
      if (secIds[x.id]) errs.push({ msg: "Section ID '" + x.id + "' is used twice" });
      secIds[x.id] = true;
      if (!String(x.name.en).trim() || !String(x.name.hi).trim()) errs.push({ msg: "Section " + (i + 1) + ": name needed in English and Hindi" });
    });
    if (!s.questions.length) errs.push({ msg: "Add at least one question" });
    s.questions.forEach(function (q, i) {
      var p = "Q" + (i + 1) + ": ";
      if (!secIds[q.s]) errs.push({ qi: i, msg: p + "choose a section" });
      ["en", "hi"].forEach(function (l) {
        var L = l === "en" ? "English" : "Hindi";
        if (!String(q.q[l]).trim()) errs.push({ qi: i, msg: p + L + " question is empty" });
        if (!String(q.e[l]).trim()) errs.push({ qi: i, msg: p + L + " explanation is empty" });
        var opts = q.o[l].map(function (x) { return String(x).trim(); });
        if (opts.some(function (x) { return !x; })) errs.push({ qi: i, msg: p + L + " options: all 4 are needed" });
        else if (new Set(opts).size !== 4) errs.push({ qi: i, msg: p + L + " options: two options are the same" });
      });
      if ([0, 1, 2, 3].indexOf(q.a) < 0) errs.push({ qi: i, msg: p + "choose the correct answer" }); else counts[q.a]++;
      if (DIFFS.indexOf(q.d) < 0) errs.push({ qi: i, msg: p + "choose a difficulty" });
      var k = norm(q.q.en) + "|" + norm(q.q.hi);
      if (k.length > 1 && seen[k] != null) errs.push({ qi: i, msg: p + "same question as Q" + (seen[k] + 1) });
      else seen[k] = i;
    });
    var n = s.questions.length;
    if (n >= 8 && Math.max.apply(null, counts) > n * 0.4)
      warns.push({ msg: "Answer key is unbalanced (A:" + counts[0] + " B:" + counts[1] + " C:" + counts[2] + " D:" + counts[3] + ") — spread correct answers across A–D" });
    return { errors: errs, warnings: warns };
  }

  /* ---------------- GitHub API ---------------- */
  function gh(method, path, body) {
    return fetch("https://api.github.com" + path, {
      method: method,
      headers: { "Authorization": "Bearer " + A.token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var err = new Error((j && j.message) || ("HTTP " + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }
  function repoPath(p) { return "/repos/" + CFG.owner + "/" + CFG.repo + "/contents/" + p; }
  function getFile(path) {
    return gh("GET", repoPath(path) + "?ref=" + CFG.branch).then(function (j) { return { sha: j.sha, text: b64decode(j.content) }; },
      function (e) { if (e.status === 404) return null; throw e; });
  }
  function putFile(path, text, sha, message) {
    var body = { message: message, content: b64encode(text), branch: CFG.branch, author: CFG.author, committer: CFG.author };
    if (sha) body.sha = sha;
    return gh("PUT", repoPath(path), body);
  }
  function friendly(e) {
    if (e.status === 401) return "The token is wrong or has expired. Disconnect and paste a new token.";
    if (e.status === 403) return "The token is not allowed to write to this repository. Give it 'Contents: Read and write' for bihar-exam-pariksha.";
    if (e.status === 404) return "Repository not found for this token. Make sure the token has access to bihar-exam-pariksha.";
    if (e.status === 409) return "Someone else changed this file just now. Reload the set and try again.";
    return e.message || "Network error — check your internet and try again.";
  }

  function connect(token, remember) {
    A.token = token.trim();
    return gh("GET", "/user").then(function (u) {
      A.login = u.login;
      return gh("GET", "/repos/" + CFG.owner + "/" + CFG.repo);
    }).then(function (repo) {
      if (repo.permissions && repo.permissions.push === false) throw Object.assign(new Error("no push"), { status: 403 });
      A.connected = true;
      sset("session", "bep-admin:token", A.token);
      if (remember) sset("local", "bep-admin:token", A.token); else sdel("local", "bep-admin:token");
      return getFile("data/index.js");
    }).then(function (f) {
      if (f) A.catalog = parseCatalogFile(f.text);
      toast("Connected as " + A.login, "");
      render();
    }).catch(function (e) {
      A.token = ""; A.connected = false;
      toast(friendly(e), "bad");
      render();
    });
  }
  function disconnect() {
    A.token = ""; A.login = ""; A.connected = false;
    sdel("session", "bep-admin:token"); sdel("local", "bep-admin:token");
    render();
  }

  /* ---------------- open / new / draft ---------------- */
  function draftKey(id) { return "bep-admin:draft:" + id; }
  var saveTimer = null;
  function markDirty() {
    A.dirty = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (A.set) sset("local", draftKey(A.set.id), JSON.stringify({ ts: Date.now(), isNew: A.isNew, set: A.set }));
      var st = document.getElementById("draftState"); if (st) st.textContent = "Draft saved on this device · " + new Date().toLocaleTimeString();
    }, 700);
    var b = document.getElementById("dirtyDot"); if (b) b.hidden = false;
  }
  function confirmLeave() { return !A.dirty || window.confirm("You have unpublished changes in this set. They are saved as a draft on this device. Continue?"); }

  function loadSetData(id) {
    if (A.connected) return getFile("data/sets/" + id + ".js").then(function (f) { if (!f) throw new Error("File not found on GitHub"); return parseSetFile(f.text); });
    return BEP.loadSet(id).then(clone);
  }
  function startEditing(set, isNew) {
    A.set = set; A.isNew = isNew; A.original = JSON.stringify(set); A.dirty = false; A.open = {}; A.errors = null;
    var raw = sget("local", draftKey(set.id));
    if (raw) {
      try {
        var d = JSON.parse(raw);
        if (d && d.set && JSON.stringify(d.set) !== A.original) {
          render();
          modal("<h2>Restore your draft?</h2><p>An unpublished draft of <b>" + esc(set.id) + "</b> from <b>" + esc(new Date(d.ts).toLocaleString()) +
            "</b> is saved on this device.</p><div class='actions'><button class='btn btn-ghost' data-act-m='drop'>Discard draft</button><button class='btn btn-primary' data-act-m='restore' data-autofocus>Restore draft</button></div>",
            function (rootEl, close) {
              rootEl.querySelector("[data-act-m=restore]").addEventListener("click", function () { A.set = d.set; A.isNew = !!d.isNew; A.dirty = true; close(); render(); });
              rootEl.querySelector("[data-act-m=drop]").addEventListener("click", function () { sdel("local", draftKey(set.id)); close(); });
            });
          return;
        }
      } catch (e) {}
    }
    render();
  }
  function openSet(id) {
    if (!confirmLeave()) return;
    root.querySelector("#main").innerHTML = '<div class="loading"><div class="spinner"></div><div>Loading ' + esc(id) + "…</div></div>";
    loadSetData(id).then(function (s) { startEditing(s, false); }).catch(function (e) { toast(friendly(e), "bad"); render(); });
  }
  function newSet() {
    if (!confirmLeave()) return;
    var id = nextId(), exam = "bpsc";
    startEditing({ id: id, exam: exam, title: { en: "", hi: "" }, durationMin: 20, sections: clone(DEFAULT_SECTIONS[exam]), questions: [] }, true);
  }

  /* ---------------- CSV ---------------- */
  function parseCSV(text) {
    text = text.replace(/^﻿/, "");
    var firstLine = text.split(/\r?\n/)[0] || "";
    var delim = firstLine.indexOf("\t") >= 0 ? "\t" : ",";
    var rows = [], row = [], field = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"' && field === "") q = true;
      else if (c === delim) { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        if (row.some(function (x) { return x.trim() !== ""; })) rows.push(row);
        row = [];
      } else field += c;
    }
    row.push(field);
    if (row.some(function (x) { return x.trim() !== ""; })) rows.push(row);
    return rows;
  }
  function csvCell(v) { v = String(v == null ? "" : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function toCSV(rows) { return "﻿" + rows.map(function (r) { return r.map(csvCell).join(","); }).join("\r\n") + "\r\n"; }
  function questionsToRows(s) {
    return [CSV_COLS].concat(s.questions.map(function (q) {
      return [q.s, q.d, q.q.en, q.q.hi].concat(q.o.en, q.o.hi, [KEYS[q.a] || "", q.e.en, q.e.hi]);
    }));
  }
  function rowsToQuestions(rows, s) {
    if (!rows.length) throw new Error("Nothing to import");
    var head = rows[0].map(function (h) { return h.trim().toLowerCase().replace(/\s+/g, "_"); });
    var idx = {};
    CSV_COLS.forEach(function (c) { idx[c] = head.indexOf(c); });
    var missing = CSV_COLS.filter(function (c) { return idx[c] < 0 && c !== "difficulty"; });
    if (missing.length) throw new Error("Missing columns: " + missing.join(", ") + ". Use the template's first row as the header.");
    var secMap = {};
    s.sections.forEach(function (x) { secMap[x.id.toLowerCase()] = x.id; secMap[x.name.en.toLowerCase()] = x.id; secMap[x.name.hi] = x.id; });
    var out = [], problems = [];
    rows.slice(1).forEach(function (r, n) {
      function g(c) { return idx[c] >= 0 ? String(r[idx[c]] || "").trim() : ""; }
      var line = n + 2, secv = g("section"), sid = secMap[secv.toLowerCase()] || secMap[secv];
      if (!sid) problems.push("Row " + line + ": section '" + secv + "' is not one of this set's sections");
      var ans = g("answer").toUpperCase(), a = KEYS.indexOf(ans);
      if (a < 0 && /^[1-4]$/.test(ans)) a = parseInt(ans, 10) - 1;
      if (a < 0) problems.push("Row " + line + ": answer must be A, B, C or D");
      var d = g("difficulty").toLowerCase(); if (DIFFS.indexOf(d) < 0) d = "medium";
      out.push({ s: sid || "", q: { en: g("question_en"), hi: g("question_hi") },
        o: { en: [g("option_a_en"), g("option_b_en"), g("option_c_en"), g("option_d_en")], hi: [g("option_a_hi"), g("option_b_hi"), g("option_c_hi"), g("option_d_hi")] },
        a: a < 0 ? 0 : a, e: { en: g("explanation_en"), hi: g("explanation_hi") }, d: d });
    });
    return { questions: out, problems: problems };
  }
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type || "text/plain;charset=utf-8" }));
    var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------------- rendering ---------------- */
  function render() {
    root.innerHTML =
      '<header class="topbar"><div class="wrap admin-wrap"><a class="logo" href="index.html"><img src="icon.svg" alt="" width="38" height="38"><span><b>Admin · Question Manager</b><small>Bihar Exam Pariksha</small></span></a>' +
      (A.connected ? '<span class="conn ok">● Connected as ' + esc(A.login) + '</span><button class="btn btn-ghost btn-sm" data-act="disconnect">Disconnect</button>'
        : '<span class="conn">● Not connected</span>') +
      '<a class="btn btn-ghost btn-sm" href="' + esc(CFG.site) + '" target="_blank" rel="noopener noreferrer">Open live site ↗</a></div></header>' +
      '<div class="ornament" aria-hidden="true"></div>' +
      '<div class="wrap admin-wrap admin-layout"><aside id="side">' + sideHTML() + '</aside><main id="main">' + mainHTML() + "</main></div>";
  }

  function sideHTML() {
    var conn = A.connected ? "" :
      '<section class="panel"><h2>🔐 Connect to publish</h2><p class="muted small">Paste your GitHub token to publish directly to the live website. Without it you can still create sets and download the file.</p>' +
      '<div class="field"><label for="tok">GitHub token</label><input id="tok" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></div>' +
      '<label class="chk"><input type="checkbox" id="remember"> Remember on this device</label>' +
      '<button class="btn btn-primary" style="width:100%;margin-top:10px" data-act="connect">Connect</button>' +
      '<button class="linkish" data-act="token-help">How do I get a token?</button></section>';
    var groups = {};
    A.catalog.forEach(function (c) { (groups[c.exam] = groups[c.exam] || []).push(c); });
    var list = BEP.examOrder.filter(function (k) { return groups[k]; }).map(function (k) {
      return '<div class="side-group"><h3 style="--c:' + esc(BEP.exams[k].color) + '">' + esc(BEP.exams[k].short.en) + "</h3>" +
        groups[k].map(function (c) {
          var cur = A.set && A.set.id === c.id;
          var hasDraft = !!sget("local", draftKey(c.id));
          return '<button class="side-item' + (cur ? " cur" : "") + '" data-act="open" data-id="' + esc(c.id) + '"><span class="setno">' + esc(c.id) + "</span>" +
            "<span>" + esc(c.title.en) + "</span><span class='cnt'>" + c.count + " Q" + (hasDraft ? " · ✎" : "") + "</span></button>";
        }).join("") + "</div>";
    }).join("");
    return conn + '<section class="panel"><div class="side-head"><h2>📚 Test sets</h2><button class="btn btn-primary btn-sm" data-act="new">+ New set</button></div>' +
      '<p class="muted small">' + A.catalog.length + " sets · " + A.catalog.reduce(function (n, c) { return n + c.count; }, 0) + " questions" +
      (A.connected ? " (live from GitHub)" : " (from this website copy)") + "</p>" + list + "</section>";
  }

  function mainHTML() {
    if (!A.set) {
      return '<section class="panel welcome"><h1>Welcome, admin 👋</h1><p>Use this page to add and edit questions for the website.</p><ol>' +
        "<li><b>Connect</b> with your GitHub token (left panel) so you can publish.</li>" +
        "<li>Click <b>+ New set</b>, or open an existing set to edit it.</li>" +
        "<li>Add questions one by one, or <b>Import from Excel/CSV</b> to add many at once.</li>" +
        "<li>Press <b>Check</b> to find mistakes, <b>Preview</b> to see a question like a student.</li>" +
        "<li>Press <b>Publish to website</b> — the live site updates in about 1 minute.</li></ol>" +
        '<p class="muted small">Your work is auto-saved as a draft on this device, so closing the tab does not lose it.</p>' +
        '<div class="res-actions"><button class="btn btn-primary" data-act="new">+ Create a new set</button><button class="btn btn-ghost" data-act="template">⬇ Download Excel/CSV template</button></div></section>';
    }
    var s = A.set, v = A.errors;
    var examOpts = BEP.examOrder.map(function (k) { return '<option value="' + k + '"' + (s.exam === k ? " selected" : "") + ">" + esc(examName(k)) + "</option>"; }).join("");
    var rate = RATE[s.exam] || 1, sug = Math.max(5, Math.round(s.questions.length * rate));
    var counts = [0, 0, 0, 0]; s.questions.forEach(function (q) { if (q.a >= 0 && q.a <= 3) counts[q.a]++; });

    var html = '<div class="ed-head"><div><h1>' + (A.isNew ? "New set · " : "Edit · ") + esc(s.id) + ' <span id="dirtyDot" class="dirty"' + (A.dirty ? "" : " hidden") + ">● unpublished changes</span></h1>" +
      '<p class="muted small" id="draftState">' + (A.dirty ? "Draft saved on this device" : "No changes yet") + "</p></div>" +
      '<div class="ed-actions"><button class="btn btn-ghost btn-sm" data-act="validate">✔ Check</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="download">⬇ Download file</button>' +
      '<button class="btn btn-primary btn-sm" data-act="publish"' + (A.connected ? "" : ' title="Connect first"') + ">🚀 Publish to website</button></div></div>";

    if (v) {
      html += '<section class="panel vbox ' + (v.errors.length ? "bad" : "ok") + '"><h2>' + (v.errors.length ? "❌ " + v.errors.length + " problem(s) to fix" : "✅ Everything looks good") + "</h2>" +
        (v.errors.length ? "<ul>" + v.errors.slice(0, 60).map(function (e) {
          return "<li>" + (e.qi != null ? '<button class="linkish" data-act="goto" data-i="' + e.qi + '">' + esc(e.msg) + "</button>" : esc(e.msg)) + "</li>";
        }).join("") + "</ul>" : "") +
        (v.warnings.length ? '<ul class="warns">' + v.warnings.map(function (w) { return "<li>⚠ " + esc(w.msg) + "</li>"; }).join("") + "</ul>" : "") + "</section>";
    }

    html += '<section class="panel"><h2>1. Set details</h2><div class="meta-grid">' +
      '<div class="field"><label>Set ID</label><input value="' + esc(s.id) + '" ' + (A.isNew ? 'data-f="id"' : "readonly") + "></div>" +
      '<div class="field"><label>Exam</label><select data-f="exam">' + examOpts + "</select></div>" +
      '<div class="field"><label>Title (English)</label><input data-f="title.en" value="' + esc(s.title.en) + '" placeholder="BPSC Prelims Mock 6"></div>' +
      '<div class="field"><label>Title (हिन्दी)</label><input data-f="title.hi" value="' + esc(s.title.hi) + '" placeholder="बीपीएससी प्रारंभिक मॉक 6"></div>' +
      '<div class="field"><label>Time limit (minutes)</label><input type="number" min="1" max="300" data-f="durationMin" data-num value="' + esc(s.durationMin) + '"></div>' +
      '<div class="field"><label>Suggested time</label><div class="sugg">' + sug + " min for " + s.questions.length + ' Q <button class="btn btn-ghost btn-sm" data-act="apply-time" data-v="' + sug + '">Use</button></div></div>' +
      '</div><p class="muted small">Marking for this exam: +' + BEP.exams[s.exam].pos + " / −" + (Math.round(BEP.exams[s.exam].neg * 100) / 100) + " (set in js/exams.js)</p></section>";

    html += '<section class="panel"><h2>2. Sections</h2><p class="muted small">Every question belongs to one section. ID = short lowercase code (e.g. history).</p><div class="sec-rows">' +
      s.sections.map(function (x, i) {
        var used = s.questions.filter(function (q) { return q.s === x.id; }).length;
        return '<div class="sec-row"><input data-f="sections.' + i + '.id" data-secid="' + i + '" data-old="' + esc(x.id) + '" value="' + esc(x.id) + '" aria-label="Section ID">' +
          '<input data-f="sections.' + i + '.name.en" value="' + esc(x.name.en) + '" placeholder="English name">' +
          '<input data-f="sections.' + i + '.name.hi" value="' + esc(x.name.hi) + '" placeholder="हिन्दी नाम">' +
          '<span class="cnt">' + used + ' Q</span><button class="icon-btn" title="Remove section" data-act="del-sec" data-i="' + i + '"' + (used ? " disabled" : "") + ">✕</button></div>";
      }).join("") + '</div><button class="btn btn-ghost btn-sm" data-act="add-sec">+ Add section</button></section>';

    var filt = A.filter.toLowerCase();
    html += '<section class="panel"><div class="q-toolbar"><h2>3. Questions (' + s.questions.length + ")</h2>" +
      '<input class="q-search" data-search placeholder="Search questions…" value="' + esc(A.filter) + '">' +
      '<div class="ed-actions"><button class="btn btn-primary btn-sm" data-act="add-q">+ Add question</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="import">⬆ Import Excel/CSV</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="export">⬇ Export CSV</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="copy-hi">EN → empty हिन्दी</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="expand">Expand all</button><button class="btn btn-ghost btn-sm" data-act="collapse">Collapse all</button></div></div>' +
      '<p class="muted small">Answer key spread: A ' + counts[0] + " · B " + counts[1] + " · C " + counts[2] + " · D " + counts[3] + "</p>" +
      '<div id="qlist">' + s.questions.map(function (q, i) {
        if (filt && (q.q.en + " " + q.q.hi).toLowerCase().indexOf(filt) < 0) return "";
        return qCard(q, i);
      }).join("") + "</div>" +
      (s.questions.length ? '<button class="btn btn-ghost" style="width:100%;margin-top:10px" data-act="add-q">+ Add another question</button>'
        : '<div class="empty">No questions yet. <b>+ Add question</b> or <b>Import Excel/CSV</b>.</div>') + "</section>";
    return html;
  }

  function qHasError(i) { return A.errors && A.errors.errors.some(function (e) { return e.qi === i; }); }
  function qHead(q, i) {
    var secName = (A.set.sections.filter(function (x) { return x.id === q.s; })[0] || { name: { en: "— no section —" } }).name.en;
    var text = (q.q.en || q.q.hi || "(empty question)").replace(/\s+/g, " ");
    return '<span class="qn">Q' + (i + 1) + "</span><span class='qtxt'>" + esc(text.length > 110 ? text.slice(0, 110) + "…" : text) + "</span>" +
      '<span class="qmeta">' + esc(secName) + " · " + esc(q.d) + " · Ans " + (KEYS[q.a] || "?") + "</span>";
  }
  function qCard(q, i) {
    var open = !!A.open[i];
    var secOpts = '<option value="">— choose —</option>' + A.set.sections.map(function (x) {
      return '<option value="' + esc(x.id) + '"' + (q.s === x.id ? " selected" : "") + ">" + esc(x.name.en) + "</option>";
    }).join("");
    function col(l, label) {
      return '<div class="lang-col"><h4>' + label + '</h4><div class="field"><label>Question</label><textarea rows="3" data-f="questions.' + i + ".q." + l + '">' + esc(q.q[l]) + "</textarea></div>" +
        [0, 1, 2, 3].map(function (k) {
          return '<div class="opt-row' + (q.a === k ? " right" : "") + '" data-optrow="' + k + '"><span class="key">' + KEYS[k] + '</span><input data-f="questions.' + i + ".o." + l + "." + k + '" value="' + esc(q.o[l][k]) + '" placeholder="Option ' + KEYS[k] + '"></div>';
        }).join("") +
        '<div class="field"><label>Explanation</label><textarea rows="2" data-f="questions.' + i + ".e." + l + '">' + esc(q.e[l]) + "</textarea></div></div>";
    }
    return '<article class="qcard' + (open ? " open" : "") + (qHasError(i) ? " has-err" : "") + '" id="q-' + i + '">' +
      '<div class="qcard-head"><button class="qtoggle" data-act="toggle" data-i="' + i + '" aria-expanded="' + open + '">' + qHead(q, i) + "</button>" +
      '<div class="qbtns"><button class="icon-btn" title="Preview" data-act="preview" data-i="' + i + '">👁</button><button class="icon-btn" title="Move up" data-act="up" data-i="' + i + '">↑</button>' +
      '<button class="icon-btn" title="Move down" data-act="down" data-i="' + i + '">↓</button><button class="icon-btn" title="Duplicate" data-act="dup" data-i="' + i + '">⧉</button>' +
      '<button class="icon-btn danger" title="Delete" data-act="del" data-i="' + i + '">🗑</button></div></div>' +
      (open ? '<div class="qcard-body"><div class="q-top"><div class="field"><label>Section</label><select data-f="questions.' + i + '.s">' + secOpts + "</select></div>" +
        '<div class="field"><label>Difficulty</label><select data-f="questions.' + i + '.d">' + DIFFS.map(function (d) { return '<option' + (q.d === d ? " selected" : "") + ">" + d + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>Correct answer</label><div class="ans-pick" role="radiogroup">' + [0, 1, 2, 3].map(function (k) {
          return '<label class="ans' + (q.a === k ? " on" : "") + '"><input type="radio" name="ans-' + i + '" value="' + k + '" data-f="questions.' + i + '.a" data-num' + (q.a === k ? " checked" : "") + ">" + KEYS[k] + "</label>";
        }).join("") + "</div></div></div>" +
        '<div class="langs">' + col("en", "English") + col("hi", "हिन्दी") + "</div></div>" : "") + "</article>";
  }
  function refreshCard(i) {
    var el = document.getElementById("q-" + i);
    if (el) el.outerHTML = qCard(A.set.questions[i], i);
  }

  /* ---------------- actions ---------------- */
  function rerenderMain(keepScroll) {
    var y = window.scrollY;
    root.querySelector("#main").innerHTML = mainHTML();
    root.querySelector("#side").innerHTML = sideHTML();
    if (keepScroll) window.scrollTo(0, y);
  }
  function runValidate(scroll) {
    A.errors = validate(A.set);
    rerenderMain(!scroll);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return A.errors;
  }
  function previewQ(i, lang) {
    var q = A.set.questions[i]; lang = lang || "hi";
    var body = function (l) {
      return '<p class="q-text ' + l + '">' + esc(q.q[l]).replace(/\n/g, "<br>") + '</p><div class="opts">' + q.o[l].map(function (o, k) {
        return '<div class="opt" aria-checked="' + (k === q.a) + '"><span class="key">' + KEYS[k] + "</span><span>" + esc(o) + "</span></div>";
      }).join("") + '</div><div class="explain"><b>Explanation</b>' + esc(q.e[l]).replace(/\n/g, "<br>") + "</div>";
    };
    modal('<div class="ed-head"><h2>Preview · Q' + (i + 1) + '</h2><div class="lang-switch"><button data-pl="hi" aria-pressed="' + (lang === "hi") + '">हिं</button><button data-pl="en" aria-pressed="' + (lang === "en") + '">EN</button></div></div>' +
      '<div id="pv">' + body(lang) + '</div><div class="actions"><button class="btn btn-primary" data-close data-autofocus>Close</button></div>',
      function (r) {
        r.querySelectorAll("[data-pl]").forEach(function (b) {
          b.addEventListener("click", function () {
            r.querySelectorAll("[data-pl]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
            r.querySelector("#pv").innerHTML = body(b.getAttribute("data-pl"));
          });
        });
      });
  }
  function importDialog() {
    modal("<h2>⬆ Import questions from Excel / Google Sheets / CSV</h2>" +
      '<ol class="small"><li>Download the template and fill one question per row (keep the first row as it is).</li>' +
      "<li>In Excel/Sheets select all rows <b>including the header</b>, copy (Ctrl+C) and paste below (Ctrl+V). Or choose a .csv file.</li>" +
      "<li><b>section</b> = section ID or English name of this set's sections. <b>answer</b> = A, B, C or D.</li></ol>" +
      '<p class="small">This set\'s sections: ' + A.set.sections.map(function (x) { return "<code>" + esc(x.id) + "</code>"; }).join(", ") + "</p>" +
      '<button class="btn btn-ghost btn-sm" data-tpl>⬇ Download template</button> <label class="btn btn-ghost btn-sm">📄 Choose .csv file<input type="file" accept=".csv,.tsv,.txt" hidden data-file></label>' +
      '<textarea class="paste" rows="8" placeholder="Paste rows here…" data-paste></textarea>' +
      '<label class="chk"><input type="radio" name="imode" value="append" checked> Add to existing questions</label> <label class="chk"><input type="radio" name="imode" value="replace"> Replace all questions</label>' +
      '<div id="imsg" class="small"></div><div class="actions"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-go>Import</button></div>',
      function (r, close) {
        r.querySelector("[data-tpl]").addEventListener("click", function () { downloadTemplate(); });
        r.querySelector("[data-file]").addEventListener("change", function (e) {
          var f = e.target.files[0]; if (!f) return;
          f.text().then(function (t) { r.querySelector("[data-paste]").value = t; });
        });
        r.querySelector("[data-go]").addEventListener("click", function () {
          var msg = r.querySelector("#imsg");
          try {
            var res = rowsToQuestions(parseCSV(r.querySelector("[data-paste]").value), A.set);
            if (!res.questions.length) throw new Error("No question rows found below the header.");
            if (res.problems.length) {
              msg.innerHTML = '<p class="bad-text">Fix these rows first:</p><ul>' + res.problems.slice(0, 15).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>";
              return;
            }
            var mode = r.querySelector("input[name=imode]:checked").value;
            A.set.questions = mode === "replace" ? res.questions : A.set.questions.concat(res.questions);
            markDirty(); close(); A.errors = validate(A.set); rerenderMain(false);
            toast("Imported " + res.questions.length + " questions — press Check, then Publish", "");
          } catch (e) { msg.innerHTML = '<p class="bad-text">' + esc(e.message) + "</p>"; }
        });
      });
  }
  function downloadTemplate() {
    var exSec = (A.set && A.set.sections[0] && A.set.sections[0].id) || "history";
    download("question-template.csv", toCSV([CSV_COLS,
      [exSec, "easy", "Who founded the Maurya dynasty?", "मौर्य वंश की स्थापना किसने की?", "Bindusara", "Chandragupta Maurya", "Ashoka", "Brihadratha",
        "बिंदुसार", "चन्द्रगुप्त मौर्य", "अशोक", "बृहद्रथ", "B", "Chandragupta Maurya founded the dynasty around 322 BCE.", "चन्द्रगुप्त मौर्य ने लगभग 322 ई.पू. में मौर्य वंश की स्थापना की।"]]), "text/csv;charset=utf-8");
  }
  function tokenHelp() {
    modal("<h2>🔑 How to get your GitHub token (one time, 2 minutes)</h2><ol>" +
      '<li>Open <b>github.com/settings/personal-access-tokens/new</b> while logged in as <b>' + esc(CFG.owner) + "</b>.</li>" +
      "<li><b>Token name:</b> Bihar Pariksha admin. <b>Expiration:</b> 90 days (renew later).</li>" +
      "<li><b>Repository access:</b> Only select repositories → <b>" + esc(CFG.repo) + "</b>.</li>" +
      "<li><b>Permissions → Repository permissions → Contents:</b> <b>Read and write</b>. Leave everything else as is.</li>" +
      "<li>Click <b>Generate token</b>, copy it (starts with <code>github_pat_</code>) and paste it here.</li></ol>" +
      '<p class="small muted">Keep it secret like a password. It can only change files in this one repository. If it ever leaks, delete it on the same GitHub page — the site keeps working.</p>' +
      '<div class="actions"><button class="btn btn-primary" data-close data-autofocus>Got it</button></div>');
  }

  function publish() {
    if (!A.connected) { toast("Connect with your GitHub token first (left panel), or use Download file.", "warn"); return; }
    var v = runValidate(true);
    if (v.errors.length) { toast("Fix the problems shown at the top first.", "bad"); return; }
    var s = A.set, isUpdate = !A.isNew;
    modal("<h2>🚀 Publish " + esc(s.id) + "?</h2><p><b>" + esc(s.title.en) + "</b> · " + s.questions.length + " questions · " + s.durationMin + " min</p>" +
      "<p>This updates the live website for all students (in about 1 minute).</p>" +
      (v.warnings.length ? '<p class="small">⚠ ' + esc(v.warnings[0].msg) + "</p>" : "") +
      '<div class="actions"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-go data-autofocus>Yes, publish</button></div>',
      function (r, close) {
        r.querySelector("[data-go]").addEventListener("click", function () {
          var btn = r.querySelector("[data-go]"); btn.disabled = true; btn.textContent = "Publishing…";
          var setPath = "data/sets/" + s.id + ".js";
          getFile(setPath).then(function (f) {
            if (f && A.isNew) throw new Error(s.id + " already exists on GitHub. Change the Set ID.");
            return putFile(setPath, setFileText(s), f && f.sha, (isUpdate ? "Update " : "Add ") + s.id + " via admin panel (" + s.questions.length + " questions)");
          }).then(function () { return getFile("data/index.js"); }).then(function (f) {
            var cat = f ? parseCatalogFile(f.text) : [];
            var entry = catalogEntry(s), found = false;
            cat = cat.map(function (c) { if (c.id === s.id) { found = true; return entry; } return c; });
            if (!found) cat.push(entry);
            cat.sort(function (a, b) { return a.id < b.id ? -1 : 1; });
            A.catalog = cat;
            return putFile("data/index.js", catalogFileText(cat), f && f.sha, "Update catalogue for " + s.id);
          }).then(function () {
            sdel("local", draftKey(s.id));
            A.dirty = false; A.isNew = false; A.original = JSON.stringify(s);
            close(); rerenderMain(true);
            modal("<h2>✅ Published!</h2><p><b>" + esc(s.id) + "</b> is saved on GitHub. The live website updates in about 1 minute (phones may take up to 10 minutes because of caching).</p>" +
              '<div class="actions"><a class="btn btn-ghost" target="_blank" rel="noopener noreferrer" href="' + esc(CFG.site + "#/test/" + s.id) + '">Open on live site ↗</a><button class="btn btn-primary" data-close data-autofocus>Done</button></div>');
          }).catch(function (e) {
            btn.disabled = false; btn.textContent = "Yes, publish";
            toast(friendly(e), "bad");
          });
        });
      });
  }

  /* ---------------- events ---------------- */
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), i = parseInt(b.getAttribute("data-i"), 10), Q = A.set && A.set.questions;
    switch (act) {
      case "connect": {
        var t = document.getElementById("tok").value;
        if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(t.trim())) { toast("That doesn't look like a GitHub token (starts with github_pat_).", "bad"); return; }
        b.disabled = true; b.textContent = "Connecting…";
        connect(t, document.getElementById("remember").checked); break;
      }
      case "disconnect": disconnect(); break;
      case "token-help": tokenHelp(); break;
      case "open": openSet(b.getAttribute("data-id")); break;
      case "new": newSet(); break;
      case "template": downloadTemplate(); break;
      case "validate": runValidate(true); break;
      case "publish": publish(); break;
      case "download":
        if (runValidate(true).errors.length) toast("Downloaded — but fix the problems shown before using it.", "warn");
        download(A.set.id + ".js", setFileText(A.set), "text/javascript;charset=utf-8"); break;
      case "apply-time": A.set.durationMin = parseInt(b.getAttribute("data-v"), 10); markDirty(); rerenderMain(true); break;
      case "add-sec": A.set.sections.push(sec("section" + (A.set.sections.length + 1), "", "")); markDirty(); rerenderMain(true); break;
      case "del-sec": A.set.sections.splice(i, 1); markDirty(); rerenderMain(true); break;
      case "add-q": {
        var lastSec = Q.length ? Q[Q.length - 1].s : (A.set.sections[0] || {}).id;
        Q.push(blankQ(lastSec)); A.open = {}; A.open[Q.length - 1] = true; A.filter = ""; markDirty(); rerenderMain(true);
        var el = document.getElementById("q-" + (Q.length - 1)); if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); var ta = el.querySelector("textarea"); if (ta) ta.focus({ preventScroll: true }); }
        break;
      }
      case "toggle": A.open[i] = !A.open[i]; refreshCard(i); break;
      case "expand": Q.forEach(function (_, k) { A.open[k] = true; }); rerenderMain(true); break;
      case "collapse": A.open = {}; rerenderMain(true); break;
      case "del":
        if (!window.confirm("Delete Q" + (i + 1) + "?")) return;
        Q.splice(i, 1); A.open = {}; markDirty(); if (A.errors) A.errors = validate(A.set); rerenderMain(true); break;
      case "dup": Q.splice(i + 1, 0, clone(Q[i])); A.open = {}; A.open[i + 1] = true; markDirty(); rerenderMain(true); break;
      case "up": case "down": {
        var j = act === "up" ? i - 1 : i + 1; if (j < 0 || j >= Q.length) return;
        var tmp = Q[i]; Q[i] = Q[j]; Q[j] = tmp; var o = A.open[i]; A.open[i] = A.open[j]; A.open[j] = o;
        markDirty(); rerenderMain(true); break;
      }
      case "preview": previewQ(i); break;
      case "goto":
        A.open[i] = true; A.filter = ""; rerenderMain(true);
        var g = document.getElementById("q-" + i); if (g) g.scrollIntoView({ behavior: "smooth", block: "start" }); break;
      case "import": importDialog(); break;
      case "export": download(A.set.id + ".csv", toCSV(questionsToRows(A.set)), "text/csv;charset=utf-8"); break;
      case "copy-hi": {
        var n = 0;
        Q.forEach(function (q) {
          if (!q.q.hi.trim() && q.q.en.trim()) { q.q.hi = q.q.en; n++; }
          if (!q.e.hi.trim() && q.e.en.trim()) { q.e.hi = q.e.en; n++; }
          q.o.hi = q.o.hi.map(function (x, k) { if (!String(x).trim() && q.o.en[k].trim()) { n++; return q.o.en[k]; } return x; });
        });
        markDirty(); rerenderMain(true);
        toast(n ? "Copied English into " + n + " empty Hindi field(s) — translate them when you can." : "No empty Hindi fields.", ""); break;
      }
    }
  });

  root.addEventListener("input", function (e) {
    var el = e.target;
    if (el.hasAttribute("data-search")) {
      A.filter = el.value;
      var list = document.getElementById("qlist"), f = A.filter.toLowerCase();
      list.innerHTML = A.set.questions.map(function (q, i) { return f && (q.q.en + " " + q.q.hi).toLowerCase().indexOf(f) < 0 ? "" : qCard(q, i); }).join("");
      return;
    }
    var path = el.getAttribute("data-f"); if (!path || !A.set) return;
    if (el.type === "radio" && !el.checked) return;
    if (el.hasAttribute("data-secid")) return;          // section IDs are applied on change (they rename references)
    var val = el.hasAttribute("data-num") ? parseInt(el.value, 10) : el.value;
    if (el.hasAttribute("data-num") && isNaN(val)) val = 0;
    setPath(A.set, path, val);
    markDirty();
    var m = /^questions\.(\d+)\./.exec(path);
    if (m) {
      var qi = parseInt(m[1], 10), card = document.getElementById("q-" + qi);
      if (card) {
        card.querySelector(".qtoggle").innerHTML = qHead(A.set.questions[qi], qi);
        if (/\.a$/.test(path)) {
          card.querySelectorAll("[data-optrow]").forEach(function (r) { r.classList.toggle("right", +r.getAttribute("data-optrow") === val); });
          card.querySelectorAll(".ans").forEach(function (l, k) { l.classList.toggle("on", k === val); });
        }
      }
    }
  });
  root.addEventListener("change", function (e) {
    var el = e.target, path = el.getAttribute("data-f"); if (!path || !A.set) return;
    if (el.hasAttribute("data-secid")) {
      var i = parseInt(el.getAttribute("data-secid"), 10), oldId = el.getAttribute("data-old"), nid = el.value.trim().toLowerCase();
      A.set.sections[i].id = nid;
      A.set.questions.forEach(function (q) { if (q.s === oldId) q.s = nid; });
      markDirty(); rerenderMain(true); return;
    }
    if (path === "exam") {
      if (!A.set.questions.length) { A.set.sections = clone(DEFAULT_SECTIONS[A.set.exam] || []); A.set.durationMin = 20; }
      rerenderMain(true); return;
    }
    if (path === "id") { A.set.id = el.value.trim().toLowerCase(); }
    if (/\.s$|\.d$|durationMin/.test(path)) rerenderMain(true);
  });
  window.addEventListener("beforeunload", function (e) { if (A.dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* Pure helpers, exposed for tools/tests. No token or network access here. */
  BEP.adminTools = { parseCSV: parseCSV, toCSV: toCSV, questionsToRows: questionsToRows, rowsToQuestions: rowsToQuestions,
    validate: validate, setFileText: setFileText, parseSetFile: parseSetFile, catalogEntry: catalogEntry };

  /* ---------------- start ---------------- */
  var saved = sget("session", "bep-admin:token") || sget("local", "bep-admin:token");
  render();
  if (saved) connect(saved, !!sget("local", "bep-admin:token"));
})();
