/* Bihar Exam Pariksha — single-page app
   Routes:  #/                    home
            #/test/<set>          instructions
            #/exam/<set>          live exam
            #/result/<set>/<aid>  result & solutions                */
(function () {
  "use strict";
  var S = BEP.store;
  var prefs = S.prefs();
  var app = document.getElementById("app");
  var cleanup = null;          // teardown of the active screen
  var homeFilter = "all";

  /* ---------------- helpers ---------------- */
  function t(k, vars) {
    var s = (BEP.i18n[prefs.ui] || BEP.i18n.en)[k];
    if (s == null) s = BEP.i18n.en[k] != null ? BEP.i18n.en[k] : k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.replace("{" + v + "}", vars[v]); });
    return s;
  }
  function L(o, lang) {
    if (o == null) return "";
    if (typeof o === "string") return o;
    lang = lang || prefs.ui;
    return o[lang] != null ? o[lang] : (o.en != null ? o.en : o.hi);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function rich(s) { return esc(s).replace(/\n/g, "<br>"); }
  function num(n) { return String(Math.round(n * 100) / 100); }
  function negLabel(n) { return n === 0 ? "0" : "−" + num(n); }
  function clock(sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var mm = (m < 10 ? "0" : "") + m, ss = (s < 10 ? "0" : "") + s;
    return h ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  }
  function human(sec) {
    var m = Math.floor(sec / 60), s = Math.round(sec % 60);
    return m ? m + "m " + s + "s" : s + "s";
  }
  var KEYS = ["A", "B", "C", "D"];
  var DIFFS = ["easy", "medium", "hard"];
  var STATES = ["nv", "na", "a", "m", "am"];
  function catalogEntry(id) { return (BEP.catalog || []).filter(function (c) { return c.id === id; })[0]; }
  function examOf(x) { return BEP.exams[x.exam] || BEP.exams["bihar-gk"]; }

  function applyTheme() {
    var r = document.documentElement;
    if (prefs.theme === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", prefs.theme);
    r.lang = prefs.ui === "hi" ? "hi" : "en";
  }
  function isDark() {
    if (prefs.theme !== "auto") return prefs.theme === "dark";
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---------------- toast & modal ---------------- */
  var toastBox = document.createElement("div");
  toastBox.className = "toasts"; toastBox.setAttribute("role", "status"); toastBox.setAttribute("aria-live", "assertive");
  document.body.appendChild(toastBox);
  function toast(msg, kind, ms) {
    var el = document.createElement("div");
    el.className = "toast " + (kind || "");
    el.textContent = msg;
    toastBox.appendChild(el);
    setTimeout(function () { el.remove(); }, ms || 3200);
  }
  function modal(html, bind) {
    var back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(back);
    function close() { back.remove(); document.removeEventListener("keydown", onKey, true); }
    function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    document.addEventListener("keydown", onKey, true);
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    if (bind) bind(back, close);
    var f = back.querySelector("[data-autofocus]") || back.querySelector("button");
    if (f) f.focus();
    return close;
  }

  /* ---------------- shared chrome ---------------- */
  var LOGO = '<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="22" fill="var(--brand)"/>' +
    '<g stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round">' +
    [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
      var r1 = 13.5, r2 = 18.5, rad = a * Math.PI / 180;
      return '<line x1="' + (24 + r1 * Math.cos(rad)).toFixed(1) + '" y1="' + (24 + r1 * Math.sin(rad)).toFixed(1) +
        '" x2="' + (24 + r2 * Math.cos(rad)).toFixed(1) + '" y2="' + (24 + r2 * Math.sin(rad)).toFixed(1) + '"/>';
    }).join("") + '</g><circle cx="24" cy="24" r="10" fill="var(--accent)"/>' +
    '<path d="M19.5 24.5l3 3 6-6.5" fill="none" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function langSwitch(cur, attr) {
    return '<div class="lang-switch" role="group" aria-label="Language">' +
      '<button type="button" ' + attr + '="hi" aria-pressed="' + (cur === "hi") + '">हिं</button>' +
      '<button type="button" ' + attr + '="en" aria-pressed="' + (cur === "en") + '">EN</button></div>';
  }
  function topbar() {
    return '<header class="topbar"><div class="wrap">' +
      '<a class="logo" href="#/">' + LOGO + "<span><b>" + esc(t("brand")) + "</b><small>" + esc(t("brandSub")) + "</small></span></a>" +
      langSwitch(prefs.ui, "data-ui") +
      '<button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle dark mode" title="Theme">' + (isDark() ? "☀" : "☾") + "</button>" +
      '</div></header><div class="ornament" aria-hidden="true"></div>';
  }
  function bindChrome(root) {
    root.querySelectorAll("[data-ui]").forEach(function (b) {
      b.addEventListener("click", function () {
        prefs.ui = b.getAttribute("data-ui"); S.setPref("ui", prefs.ui);
        prefs.qlang = prefs.ui; S.setPref("qlang", prefs.qlang);
        applyTheme(); route();
      });
    });
    var th = root.querySelector("[data-theme-toggle]");
    if (th) th.addEventListener("click", function () {
      prefs.theme = isDark() ? "light" : "dark"; S.setPref("theme", prefs.theme); applyTheme(); route();
    });
  }
  function safeUrl(u) { return /^(https:\/\/|mailto:)[^\s"'<>]+$/i.test(u || "") ? u : ""; }
  function aboutSection() {
    var a = BEP.about; if (!a) return "";
    var links = (a.links || []).filter(function (l) { return safeUrl(l.url); }).map(function (l) {
      return '<a class="btn btn-ghost btn-sm" href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + " ↗</a>";
    }).join("");
    var photo = a.photo && /^[\w\/.-]+\.(png|jpe?g|webp|svg)$/i.test(a.photo)
      ? '<img class="about-photo" src="' + esc(a.photo) + '" alt="' + esc(a.name) + '" width="120" height="120" loading="lazy">'
      : '<div class="about-photo about-initials" aria-hidden="true">' + esc(a.initials || a.name.charAt(0)) + "</div>";
    return '<section class="wrap" id="about"><div class="sec-head"><div><h2>' + esc(t("aboutTitle")) + "</h2></div></div>" +
      '<div class="about">' + photo + '<div class="about-body"><h3>' + esc(a.name) + '</h3><p class="about-role">' + esc(L(a.role)) + "</p>" +
      "<p>" + esc(L(a.bio)) + '</p><p class="about-mission">“' + esc(L(a.mission)) + "”</p>" +
      (links ? '<div class="about-links">' + links + "</div>" : "") + "</div></div></section>";
  }
  function footer() {
    var by = BEP.about ? BEP.about.name : "";
    return '<footer class="footer"><div class="wrap"><b>' + esc(t("brand")) + "</b><span>" + esc(t("footer")) +
      '</span><small>' + esc(t("disclaimer")) + "</small>" +
      (by ? "<small>© " + new Date().getFullYear() + " " + esc(by) + " · " + esc(t("madeWith")) + "</small>" : "") + "</div></footer>";
  }
  function loadingView() {
    app.innerHTML = topbar() + '<div class="loading"><div class="spinner"></div><div>' + esc(t("loading")) + "</div></div>";
  }
  function errorView() {
    app.innerHTML = topbar() + '<div class="loading"><div style="font-size:42px">⚠</div><div>' + esc(t("loadErr")) +
      '</div><div><a class="btn btn-primary" href="#/">' + esc(t("backHome")) + "</a></div></div>";
    bindChrome(app);
  }

  /* ---------------- HOME ---------------- */
  function heroArt() {
    var rays = "";
    for (var i = 0; i < 24; i++) {
      var a = (i * 15) * Math.PI / 180, a1 = a - 0.09, a2 = a + 0.09, r1 = 132, r2 = i % 2 ? 158 : 168;
      rays += '<path d="M' + (200 + r1 * Math.cos(a1)).toFixed(1) + " " + (200 + r1 * Math.sin(a1)).toFixed(1) +
        " L" + (200 + r2 * Math.cos(a)).toFixed(1) + " " + (200 + r2 * Math.sin(a)).toFixed(1) +
        " L" + (200 + r1 * Math.cos(a2)).toFixed(1) + " " + (200 + r1 * Math.sin(a2)).toFixed(1) + 'Z" fill="' + (i % 2 ? "var(--brand)" : "var(--accent)") + '"/>';
    }
    return '<svg viewBox="0 0 400 400" aria-hidden="true">' +
      '<circle cx="200" cy="200" r="196" fill="var(--brand-soft)"/>' +
      '<g class="spin-slow">' + rays +
      '<circle cx="200" cy="200" r="182" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-dasharray="1 11" stroke-linecap="round"/></g>' +
      '<circle cx="200" cy="200" r="128" fill="var(--surface)" stroke="var(--brand)" stroke-width="3"/>' +
      '<circle cx="200" cy="200" r="118" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 6"/>' +
      // mini CBT card
      '<rect x="128" y="132" width="144" height="136" rx="14" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="2"/>' +
      '<rect x="128" y="132" width="144" height="30" rx="14" fill="var(--brand)"/><rect x="128" y="148" width="144" height="14" fill="var(--brand)"/>' +
      '<text x="140" y="152" font-size="13" font-weight="700" fill="#fff" font-family="monospace">⏱ 19:42</text>' +
      '<circle cx="256" cy="147" r="6" fill="#74e08f"/>' +
      '<rect x="142" y="172" width="104" height="7" rx="3.5" fill="var(--line-2)"/><rect x="142" y="184" width="72" height="7" rx="3.5" fill="var(--line-2)"/>' +
      [0, 1, 2, 3].map(function (k) {
        var y = 202 + k * 16, on = k === 2;
        return '<circle cx="150" cy="' + y + '" r="5.5" fill="' + (on ? "var(--ok)" : "none") + '" stroke="' + (on ? "var(--ok)" : "var(--line-2)") + '" stroke-width="2"/>' +
          '<rect x="162" y="' + (y - 3) + '" width="' + [70, 56, 80, 50][k] + '" height="6" rx="3" fill="' + (on ? "var(--ok)" : "var(--line)") + '"/>';
      }).join("") +
      // floating tags
      '<g><rect x="262" y="96" width="92" height="34" rx="17" fill="var(--ok)"/><text x="308" y="118" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">✓ Saved</text></g>' +
      '<g><rect x="40" y="262" width="96" height="34" rx="17" fill="var(--mark)"/><text x="88" y="284" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">+4 / −1</text></g>' +
      '<g><rect x="250" y="292" width="104" height="34" rx="17" fill="var(--accent)"/><text x="302" y="314" text-anchor="middle" font-size="14" font-weight="700" fill="#231400">हिं | EN</text></g>' +
      "</svg>";
  }

  function homeStats() {
    var taken = 0, bestPct = null, accSum = 0, accN = 0;
    (BEP.catalog || []).forEach(function (c) {
      cleanAtts(c.id).forEach(function (a) {
        taken++;
        var pct = a.max ? Math.max(0, a.score) / a.max * 100 : 0;
        if (bestPct == null || pct > bestPct) bestPct = pct;
        if (a.correct + a.wrong > 0) { accSum += a.correct / (a.correct + a.wrong) * 100; accN++; }
      });
    });
    return { sets: (BEP.catalog || []).length, taken: taken, best: bestPct == null ? "—" : Math.round(bestPct) + "%", acc: accN ? Math.round(accSum / accN) + "%" : "—" };
  }

  function testCard(c) {
    var ex = examOf(c), atts = cleanAtts(c.id), prog = S.progress(c.id);
    var max = c.count * ex.pos;
    var best = atts.reduce(function (m, a) { return Math.max(m, a.score); }, -Infinity);
    var foot = prog
      ? '<span class="progress-tag">● ' + esc(t("inProgress")) + " · " + clock(prog.remaining) + "</span>"
      : atts.length
        ? '<span class="best">' + esc(t("best")) + ": <b>" + num(best) + "/" + max + "</b><br>" + atts.length + " " + esc(t("attempts")) + "</span>"
        : '<span class="best">' + esc(t("notAttempted")) + "</span>";
    var btn = prog ? t("resume") : atts.length ? t("reattempt") : t("start");
    return '<article class="card" style="--c:' + esc(ex.color) + '">' +
      '<div class="card-top"><span class="badge">' + esc(L(ex.short)) + '</span><span class="setno">#' + c.id.slice(4) + "</span></div>" +
      "<h3>" + esc(L(c.title)) + "</h3>" +
      '<div class="meta"><div><b>' + c.count + "</b><span>" + esc(t("questions")) + "</span></div>" +
      "<div><b>" + max + "</b><span>" + esc(t("marks")) + "</span></div>" +
      "<div><b>" + c.durationMin + "</b><span>" + esc(t("minutes")) + "</span></div></div>" +
      '<div class="scheme"><span class="pill pos">+' + num(ex.pos) + "</span>" +
      (ex.neg ? '<span class="pill neg">' + negLabel(ex.neg) + "</span>" : '<span class="pill zero">' + esc(t("noNeg")) + "</span>") +
      "<span>" + esc(t("perQ")) + "</span></div>" +
      '<div class="card-foot">' + foot +
      (atts.length && !prog ? '<a class="btn btn-ghost btn-sm" href="#/result/' + c.id + "/" + atts[0].id + '">' + esc(t("viewResult")) + "</a>" : "") +
      '<a class="btn btn-primary btn-sm" href="#/test/' + esc(c.id) + '">' + esc(btn) + "</a></div></article>";
  }

  function renderHome() {
    var st = homeStats();
    var counts = {};
    (BEP.catalog || []).forEach(function (c) { counts[c.exam] = (counts[c.exam] || 0) + 1; });
    var resumes = S.allProgress().map(function (r) {
      var c = catalogEntry(r.id); if (!c) return "";
      return '<div class="resume' + (isDark() ? " dark-resume" : "") + '"><div class="grow"><b>⏳ ' + esc(t("resumeTitle")) + "</b>" +
        esc(L(c.title)) + " · " + clock(r.p.remaining) + " " + esc(t("resumeLeft")) + "</div>" +
        '<button class="btn btn-ghost btn-sm" data-discard="' + c.id + '">' + esc(t("discard")) + "</button>" +
        '<a class="btn btn-accent btn-sm" href="#/exam/' + c.id + '">' + esc(t("resume")) + " →</a></div>";
    }).join("");

    var chips = '<button class="chip" data-filter="all" aria-pressed="' + (homeFilter === "all") + '">' + esc(t("all")) +
      ' <span class="n">' + st.sets + "</span></button>" +
      BEP.examOrder.filter(function (k) { return counts[k]; }).map(function (k) {
        var ex = BEP.exams[k];
        return '<button class="chip" style="--c:' + ex.color + '" data-filter="' + k + '" aria-pressed="' + (homeFilter === k) + '"><i></i>' +
          esc(L(ex.short)) + ' <span class="n">' + counts[k] + "</span></button>";
      }).join("");

    var icons = ["▦", "⏱", "📊", "अ"];
    var feats = [1, 2, 3, 4].map(function (i) {
      return '<div class="feature"><div class="ic" aria-hidden="true">' + icons[i - 1] + "</div><h4>" + esc(t("f" + i + "t")) + "</h4><p>" + esc(t("f" + i + "d")) + "</p></div>";
    }).join("");

    var patterns = BEP.examOrder.filter(function (k) { return counts[k]; }).map(function (k) {
      var ex = BEP.exams[k];
      return '<div class="feature" style="border-top:4px solid ' + ex.color + '"><h4>' + esc(L(ex.name)) + '</h4><p>' + esc(L(ex.body)) + "</p>" +
        '<p style="margin-top:8px">' + esc(L(ex.pattern)) + '</p><div class="scheme" style="margin-top:10px;display:flex;gap:6px"><span class="pill pos">+' + num(ex.pos) +
        "</span>" + (ex.neg ? '<span class="pill neg">' + negLabel(ex.neg) + "</span>" : '<span class="pill zero">' + esc(t("noNeg")) + "</span>") + "</div></div>";
    }).join("");

    app.innerHTML = topbar() +
      '<main><section class="hero"><div class="wrap">' + resumes +
      '<div class="hero-grid"><div>' +
      '<span class="eyebrow"><span class="dot"></span>' + esc(t("eyebrow")) + "</span>" +
      "<h1>" + esc(t("heroA")) + " <em>" + esc(t("heroB")) + "</em><br>" + esc(t("heroC")) + "</h1>" +
      '<p class="lead">' + esc(t("heroSub")) + "</p>" +
      '<div class="hero-cta"><a class="btn btn-primary" href="#tests" data-scroll="tests">' + esc(t("startFree")) + ' →</a>' +
      '<a class="btn btn-ghost" href="#patterns" data-scroll="patterns">' + esc(t("howItWorks")) + "</a></div>" +
      '<div class="stats-row">' +
      '<div class="stat"><b>' + st.sets + "</b><span>" + esc(t("statSets")) + "</span></div>" +
      '<div class="stat"><b>' + st.taken + "</b><span>" + esc(t("statAttempted")) + "</span></div>" +
      '<div class="stat"><b>' + st.best + "</b><span>" + esc(t("statBest")) + "</span></div>" +
      '<div class="stat"><b>' + st.acc + "</b><span>" + esc(t("statAcc")) + "</span></div></div>" +
      '</div><div class="hero-art">' + heroArt() + "</div></div></div></section>" +
      '<section class="wrap"><div class="features">' + feats + "</div></section>" +
      '<section class="wrap" id="tests"><div class="sec-head"><div><h2>' + esc(t("testsTitle")) + "</h2><p>" + esc(t("testsSub")) + "</p></div></div>" +
      '<div class="chips" role="group" aria-label="Filter">' + chips + '</div><div class="grid" id="grid"></div></section>' +
      '<section class="wrap" id="patterns"><div class="sec-head"><div><h2>' + esc(t("examPattern")) + "</h2><p>" + esc(t("subjectiveNote")) + "</p></div></div>" +
      '<div class="features">' + patterns + "</div></section>" + aboutSection() + "</main>" + footer();

    function drawGrid() {
      var list = (BEP.catalog || []).filter(function (c) { return homeFilter === "all" || c.exam === homeFilter; });
      document.getElementById("grid").innerHTML = list.length ? list.map(testCard).join("") : '<div class="empty">—</div>';
    }
    drawGrid();
    bindChrome(app);
    app.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        homeFilter = b.getAttribute("data-filter");
        app.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        drawGrid();
      });
    });
    app.querySelectorAll("[data-scroll]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById(a.getAttribute("data-scroll")).scrollIntoView({ behavior: "smooth" });
      });
    });
    app.querySelectorAll("[data-discard]").forEach(function (b) {
      b.addEventListener("click", function () { S.clearProgress(b.getAttribute("data-discard")); renderHome(); });
    });
  }

  /* ---------------- INSTRUCTIONS ---------------- */
  function legendRows() {
    return '<div class="legend">' + ["nv", "na", "a", "m", "am"].map(function (k, i) {
      return '<div class="legend-row"><span class="qs ' + k + ' sm">' + (i + 1) + "</span>" + esc(t(k)) + "</div>";
    }).join("") + "</div>";
  }

  function renderInstructions(set) {
    var ex = examOf(set), n = set.questions.length, prog = S.progress(set.id);
    app.innerHTML = topbar() + '<main class="wrap ins">' +
      '<div class="ins-head"><a class="btn btn-ghost btn-sm" href="#/">← ' + esc(t("back")) + "</a>" +
      '<span class="badge" style="--c:' + ex.color + '">' + esc(L(ex.name)) + "</span></div>" +
      '<div class="ins-head"><h1>' + esc(L(set.title)) + "</h1></div>" +
      (prog ? '<div class="resume' + (isDark() ? " dark-resume" : "") + '"><div class="grow"><b>⏳ ' + esc(t("resumeTitle")) + "</b>" + esc(t("resumeExam")) + " · " + clock(prog.remaining) + " " + esc(t("resumeLeft")) + "</div></div>" : "") +
      '<div class="ins-grid"><section class="panel"><h2>' + esc(t("insTitle")) + '</h2><p class="muted" style="margin-top:-6px">' + esc(t("insRead")) + "</p><ol>" +
      [1, 2, 3, 4, 5, 6].map(function (i) { return "<li>" + esc(t("ins" + i, { min: set.durationMin })) + "</li>"; }).join("") +
      '</ol><h2 style="margin-top:22px">' + esc(t("paletteMeaning")) + "</h2>" + legendRows() + "</section>" +
      '<aside class="panel"><h2>' + esc(t("testDetails")) + '</h2><dl class="kv">' +
      "<dt>" + esc(t("questions")) + "</dt><dd>" + n + "</dd>" +
      "<dt>" + esc(t("duration")) + "</dt><dd>" + set.durationMin + " " + esc(t("minutes")) + "</dd>" +
      "<dt>" + esc(t("totalMarks")) + "</dt><dd>" + n * ex.pos + "</dd>" +
      "<dt>" + esc(t("correctMark")) + '</dt><dd><span class="pill pos">+' + num(ex.pos) + "</span></dd>" +
      "<dt>" + esc(t("wrongMark")) + '</dt><dd><span class="pill ' + (ex.neg ? "neg" : "zero") + '">' + negLabel(ex.neg) + "</span></dd></dl>" +
      '<div class="field"><label>' + esc(t("sections")) + '</label><div class="sec-list">' +
      set.sections.map(function (s) {
        var c = set.questions.filter(function (q) { return q.s === s.id; }).length;
        return "<span>" + esc(L(s.name)) + " · " + c + "</span>";
      }).join("") + "</div></div>" +
      '<div class="field"><label for="cname">' + esc(t("name")) + '</label><input id="cname" maxlength="40" autocomplete="name" placeholder="' + esc(t("namePh")) + '" value="' + esc(prefs.name) + '"></div>' +
      '<div class="field"><label for="qlang">' + esc(t("qlang")) + '</label><select id="qlang"><option value="hi"' + (prefs.qlang === "hi" ? " selected" : "") +
      '>हिन्दी</option><option value="en"' + (prefs.qlang === "en" ? " selected" : "") + ">English</option></select></div>" +
      '<label class="agree"><input type="checkbox" id="agree"' + (prog ? " checked" : "") + "><span>" + esc(t("agree")) + "</span></label>" +
      '<button class="btn btn-primary" style="width:100%" id="go"' + (prog ? "" : " disabled") + ">" + esc(prog ? t("resume") : t("startExam")) + " →</button>" +
      "</aside></div></main>" + footer();
    bindChrome(app);
    var agree = document.getElementById("agree"), go = document.getElementById("go");
    agree.addEventListener("change", function () { go.disabled = !agree.checked; });
    go.addEventListener("click", function () {
      prefs.name = document.getElementById("cname").value.trim(); S.setPref("name", prefs.name);
      prefs.qlang = document.getElementById("qlang").value; S.setPref("qlang", prefs.qlang);
      location.hash = "#/exam/" + set.id;
    });
  }

  /* ---------------- EXAM ENGINE ---------------- */
  function newProgress(set) {
    var n = set.questions.length, z = function (v) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; };
    return {
      v: 1, setId: set.id, startedAt: Date.now(), updatedAt: Date.now(),
      total: set.durationMin * 60, remaining: set.durationMin * 60,
      cur: 0, saved: z(null), status: z("nv"), times: z(0), qlang: prefs.qlang, w5: false, w1: false
    };
  }

  /* Saved state comes from localStorage, so treat it as untrusted:
     anything malformed is discarded and the test starts fresh. */
  function isNum(x) { return typeof x === "number" && isFinite(x) && x >= 0; }
  function sanitizeProgress(p, n) {
    if (!p || typeof p !== "object" || !Array.isArray(p.saved) || !Array.isArray(p.status) || !Array.isArray(p.times)) return null;
    if (p.saved.length !== n || p.status.length !== n || p.times.length !== n) return null;
    if (!isNum(p.total) || !isNum(p.remaining) || p.remaining > p.total || !(p.cur >= 0 && p.cur < n && p.cur % 1 === 0)) return null;
    for (var i = 0; i < n; i++) {
      if (!(p.saved[i] === null || [0, 1, 2, 3].indexOf(p.saved[i]) >= 0)) return null;
      if (STATES.indexOf(p.status[i]) < 0 || !isNum(p.times[i])) return null;
    }
    p.qlang = p.qlang === "en" ? "en" : "hi";
    return p;
  }
  function sanitizeAttempt(a, n) {
    if (!a || !Array.isArray(a.saved) || !Array.isArray(a.status) || !Array.isArray(a.times) || a.saved.length !== n) return null;
    if (![a.correct, a.wrong, a.skipped, a.neg, a.timeTaken, a.max].every(isNum) || typeof a.score !== "number" || !isFinite(a.score)) return null;
    a.times = a.times.map(function (x) { return isNum(x) ? Math.round(x) : 0; });
    a.status = a.status.map(function (x) { return STATES.indexOf(x) >= 0 ? x : "nv"; });
    a.saved = a.saved.map(function (x) { return [0, 1, 2, 3].indexOf(x) >= 0 ? x : null; });
    return a;
  }

  function cleanAtts(id) {
    return S.attempts(id).filter(function (a) {
      return a && typeof a.id === "string" && /^a[0-9a-z]+$/.test(a.id) && isNum(a.ts) &&
        [a.correct, a.wrong, a.skipped, a.max].every(isNum) && typeof a.score === "number" && isFinite(a.score);
    });
  }

  function evaluate(set, st) {
    var ex = examOf(set), c = 0, w = 0, s = 0;
    set.questions.forEach(function (q, i) {
      var counted = st.status[i] === "a" || st.status[i] === "am";
      var ans = counted ? st.saved[i] : null;
      if (ans == null) s++; else if (ans === q.a) c++; else w++;
    });
    var neg = Math.round(w * ex.neg * 100) / 100;
    return {
      id: "a" + Date.now().toString(36), ts: Date.now(), setId: set.id,
      saved: set.questions.map(function (q, i) { return (st.status[i] === "a" || st.status[i] === "am") ? st.saved[i] : null; }),
      status: st.status.slice(), times: st.times.slice(),
      timeTaken: st.total - st.remaining, total: st.total,
      correct: c, wrong: w, skipped: s, neg: neg,
      score: Math.round((c * ex.pos - neg) * 100) / 100, max: set.questions.length * ex.pos
    };
  }

  function renderExam(set) {
    var ex = examOf(set), Q = set.questions, n = Q.length;
    var st = sanitizeProgress(S.progress(set.id), n) || newProgress(set);
    var pending = st.saved[st.cur];
    if (st.status[st.cur] === "nv") st.status[st.cur] = "na";
    var timerId = null, last = Date.now(), acc = 0, finished = false;
    var secIndex = {};
    set.sections.forEach(function (s) { secIndex[s.id] = s; });
    var name = prefs.name || t("candidate");
    var C = 2 * Math.PI * 14;

    app.innerHTML = '<div class="exam">' +
      '<header class="x-head"><div class="avatar" aria-hidden="true">' + esc(name.charAt(0).toUpperCase()) + "</div>" +
      '<div class="x-title"><b>' + esc(L(set.title)) + "</b><small>" + esc(L(ex.name)) + " · " + esc(name) + "</small></div>" +
      '<div class="timer" id="timer" role="timer" aria-label="' + esc(t("timeLeft")) + '"><svg class="timer-ring" viewBox="0 0 34 34"><circle class="trk" cx="17" cy="17" r="14"/><circle class="bar" id="tbar" cx="17" cy="17" r="14" stroke-dasharray="' + C.toFixed(2) + '"/></svg>' +
      '<div><div class="lbl">' + esc(t("timeLeft")) + '</div><div class="clock" id="clock">--:--</div></div></div>' +
      '<div class="x-tools">' + langSwitch(st.qlang, "data-ql") +
      '<button class="icon-btn fs-btn" type="button" id="fs" title="' + esc(t("fullscreen")) + '" aria-label="' + esc(t("fullscreen")) + '">⛶</button>' +
      '<button class="icon-btn pal-toggle" type="button" id="palBtn" aria-label="' + esc(t("openPalette")) + '">▦ <span>' + esc(t("openPalette")) + "</span></button></div></header>" +
      '<nav class="x-sections" id="secs" aria-label="' + esc(t("sections")) + '"></nav>' +
      '<div class="x-body"><section class="x-main">' +
      '<div class="q-bar"><h2 id="qno"></h2><div class="q-meta" id="qmeta"></div></div>' +
      '<div class="q-scroll" id="qscroll"><p class="q-text" id="qtext"></p><div class="opts" id="opts" role="radiogroup"></div><div id="hint"></div></div>' +
      '<div class="x-actions"><button class="btn btn-mark" id="bMark">' + esc(t("markNext")) + "</button>" +
      '<button class="btn btn-clear" id="bClear">' + esc(t("clear")) + '</button><span class="spacer"></span>' +
      '<button class="btn btn-ghost" id="bPrev">← ' + esc(t("prev")) + "</button>" +
      '<button class="btn btn-save" id="bSave">' + esc(t("saveNext")) + " →</button>" +
      '<button class="btn btn-primary m-submit" id="bSubmit2">✓ ' + esc(t("submit")) + "</button></div></section>" +
      '<aside class="x-side" id="side" aria-label="' + esc(t("palette")) + '"><div class="cand"><div class="avatar">' + esc(name.charAt(0).toUpperCase()) + "</div><div><b>" + esc(name) +
      "</b><small>" + esc(t("candidate")) + '</small></div></div><div class="legend-grid" id="legend"></div>' +
      '<div class="pal-wrap" id="pal"></div><div class="side-foot"><button class="btn btn-primary" id="bSubmit">' + esc(t("submit")) + "</button></div></aside></div>" +
      '<div class="scrim" id="scrim"></div></div>';

    var $ = function (id) { return document.getElementById(id); };
    var side = $("side"), scrim = $("scrim");

    function persist() { st.updatedAt = Date.now(); if (!finished) S.saveProgress(set.id, st); }

    function drawTimer() {
      $("clock").textContent = clock(st.remaining);
      $("tbar").style.strokeDashoffset = (C * (1 - st.remaining / st.total)).toFixed(2);
      var tm = $("timer");
      tm.classList.toggle("warn", st.remaining <= 300 && st.remaining > 60);
      tm.classList.toggle("danger", st.remaining <= 60);
    }

    function counts(filter) {
      var r = { nv: 0, na: 0, a: 0, m: 0, am: 0 };
      st.status.forEach(function (s, i) { if (!filter || filter(i)) r[s]++; });
      return r;
    }

    function drawSections() {
      var curSec = Q[st.cur].s;
      $("secs").innerHTML = set.sections.map(function (s) {
        var idx = []; Q.forEach(function (q, i) { if (q.s === s.id) idx.push(i); });
        var done = idx.filter(function (i) { return st.status[i] === "a" || st.status[i] === "am"; }).length;
        return '<button class="x-sec" data-sec="' + esc(s.id) + '" aria-current="' + (s.id === curSec) + '">' + esc(L(s.name, st.qlang)) +
          ' <span class="cnt">' + done + "/" + idx.length + "</span></button>";
      }).join("");
      var cur = $("secs").querySelector('[aria-current="true"]');
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    function drawPalette() {
      var c = counts();
      $("legend").innerHTML = ["a", "na", "nv", "m", "am"].map(function (k) {
        return '<div class="legend-row' + (k === "am" ? " full" : "") + '"><span class="qs ' + k + ' sm">' + c[k] + "</span>" + esc(t(k)) + "</div>";
      }).join("");
      $("pal").innerHTML = set.sections.map(function (s) {
        var html = "";
        Q.forEach(function (q, i) {
          if (q.s !== s.id) return;
          html += '<button class="qs ' + (STATES.indexOf(st.status[i]) > 0 ? st.status[i] : "") + (i === st.cur ? " cur" : "") + '" data-q="' + i +
            '" aria-label="' + esc(t("question")) + " " + (i + 1) + ", " + esc(t(st.status[i])) + '">' + (i + 1) + "</button>";
        });
        return '<div class="pal-sec">' + esc(L(s.name, st.qlang)) + '</div><div class="palette">' + html + "</div>";
      }).join("");
    }

    function drawHint() {
      $("hint").innerHTML = pending != null && pending !== st.saved[st.cur] ? '<div class="unsaved">' + esc(t("unsaved")) + "</div>" : "";
    }

    function drawQuestion(animate) {
      var q = Q[st.cur], lang = st.qlang;
      $("qno").textContent = t("question") + " " + (st.cur + 1) + " " + t("of") + " " + n;
      $("qmeta").innerHTML = "<span>" + esc(L(secIndex[q.s] ? secIndex[q.s].name : q.s, lang)) + "</span>" +
        '<span class="diff ' + (DIFFS.indexOf(q.d) >= 0 ? q.d : "medium") + '">' + esc(q.d) + "</span>" +
        '<span class="pill pos">+' + num(ex.pos) + "</span>" + (ex.neg ? '<span class="pill neg">' + negLabel(ex.neg) + "</span>" : "");
      var qt = $("qtext");
      qt.className = "q-text " + lang;
      qt.innerHTML = rich(L(q.q, lang));
      $("opts").innerHTML = (q.o[lang] || q.o.en).map(function (o, k) {
        return '<button type="button" class="opt" role="radio" data-o="' + k + '" aria-checked="' + (pending === k) + '"><span class="key">' + KEYS[k] + "</span><span>" + rich(o) + "</span></button>";
      }).join("");
      drawHint();
      if (animate) $("qscroll").scrollTop = 0;
    }

    function drawAll(animate) { drawQuestion(animate); drawPalette(); drawSections(); }

    function goTo(i) {
      st.cur = (i + n) % n;
      pending = st.saved[st.cur];
      if (st.status[st.cur] === "nv") st.status[st.cur] = "na";
      persist(); drawAll(true);
      closePalette();
    }
    function choose(k) {
      pending = pending === k ? null : k;   // tap again to unselect
      $("opts").querySelectorAll(".opt").forEach(function (b) {
        var on = +b.getAttribute("data-o") === pending;
        b.setAttribute("aria-checked", on);
        if (on) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
      });
      drawHint();
    }
    function saveNext() {
      st.saved[st.cur] = pending;
      st.status[st.cur] = pending == null ? "na" : "a";
      goTo(st.cur + 1);
    }
    function markNext() {
      st.saved[st.cur] = pending;
      st.status[st.cur] = pending == null ? "m" : "am";
      goTo(st.cur + 1);
    }
    function clearResp() {
      pending = null; st.saved[st.cur] = null; st.status[st.cur] = "na";
      persist(); drawAll(false);
    }
    function openPalette() { side.classList.add("open"); scrim.classList.add("show"); }
    function closePalette() { side.classList.remove("open"); scrim.classList.remove("show"); }

    function finish(auto) {
      if (finished) return;
      finished = true;
      clearInterval(timerId);
      var res = evaluate(set, st);
      res.qlang = st.qlang;
      S.addAttempt(set.id, res);
      S.clearProgress(set.id);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      if (auto) toast(t("timeUp"), "bad", 4500);
      location.hash = "#/result/" + set.id + "/" + res.id;
    }

    function confirmSubmit() {
      closePalette();
      var rows = set.sections.map(function (s) {
        var c = counts(function (i) { return Q[i].s === s.id; });
        var tot = c.nv + c.na + c.a + c.m + c.am;
        return "<tr><td>" + esc(L(s.name, st.qlang)) + "</td><td>" + tot + "</td><td>" + (c.a + c.am) + "</td><td>" + c.na + "</td><td>" + (c.m + c.am) + "</td><td>" + c.nv + "</td></tr>";
      }).join("");
      var all = counts();
      modal("<h2>" + esc(t("submitTitle")) + '</h2><p class="muted" style="margin:0">' + esc(t("submitSub")) + " · " + esc(t("timeLeft")) + ": <b>" + clock(st.remaining) + "</b></p>" +
        '<div style="overflow-x:auto"><table class="sum-table"><thead><tr><th>' + esc(t("sectionLbl")) + "</th><th>" + esc(t("total")) + "</th><th>" + esc(t("a")) +
        "</th><th>" + esc(t("na")) + "</th><th>" + esc(t("m")) + "</th><th>" + esc(t("nv")) + "</th></tr></thead><tbody>" + rows +
        "</tbody><tfoot><tr><td>" + esc(t("total")) + "</td><td>" + n + "</td><td>" + (all.a + all.am) + "</td><td>" + all.na + "</td><td>" + (all.m + all.am) + "</td><td>" + all.nv + "</td></tr></tfoot></table></div>" +
        '<div class="actions"><button class="btn btn-ghost" data-close data-autofocus>' + esc(t("cancel")) + '</button><button class="btn btn-primary" data-yes>' + esc(t("yesSubmit")) + "</button></div>",
        function (root, close) {
          root.querySelector("[data-close]").addEventListener("click", close);
          root.querySelector("[data-yes]").addEventListener("click", function () { close(); finish(false); });
        });
    }

    function tick() {
      var now = Date.now();
      acc += (now - last) / 1000; last = now;
      if (acc < 1) return;
      var d = Math.floor(acc); acc -= d;
      st.remaining = Math.max(0, st.remaining - d);
      st.times[st.cur] += d;
      if (st.remaining <= 300 && !st.w5 && st.total > 300) { st.w5 = true; toast(t("fiveMin"), "warn"); }
      if (st.remaining <= 60 && !st.w1) { st.w1 = true; toast(t("oneMin"), "bad"); }
      drawTimer(); persist();
      if (st.remaining <= 0) finish(true);
    }

    /* events */
    $("opts").addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (b) choose(+b.getAttribute("data-o"));
    });
    $("pal").addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (b) goTo(+b.getAttribute("data-q"));
    });
    $("secs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-sec]"); if (!b) return;
      var sid = b.getAttribute("data-sec");
      for (var i = 0; i < n; i++) if (Q[i].s === sid) { goTo(i); break; }
    });
    $("bSave").addEventListener("click", saveNext);
    $("bMark").addEventListener("click", markNext);
    $("bClear").addEventListener("click", clearResp);
    $("bPrev").addEventListener("click", function () { goTo(st.cur - 1); });
    $("bSubmit").addEventListener("click", confirmSubmit);
    $("bSubmit2").addEventListener("click", confirmSubmit);
    $("palBtn").addEventListener("click", openPalette);
    scrim.addEventListener("click", closePalette);
    $("fs").addEventListener("click", function () {
      var d = document.documentElement;
      if (document.fullscreenElement) document.exitFullscreen(); else if (d.requestFullscreen) d.requestFullscreen().catch(function () {});
    });
    app.querySelectorAll("[data-ql]").forEach(function (b) {
      b.addEventListener("click", function () {
        st.qlang = b.getAttribute("data-ql");
        app.querySelectorAll("[data-ql]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        persist(); drawAll(false);
      });
    });
    function onKey(e) {
      if (document.querySelector(".modal-back") || e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      var k = e.key.toLowerCase();
      var map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: null, d: 3 };
      if (k >= "1" && k <= "4") { choose(map[k]); e.preventDefault(); }
      else if (k === "a" || k === "b" || k === "d") { choose(map[k]); }
      else if (k === "arrowright" || k === "enter") { if (k === "enter" && tag === "button") return; saveNext(); e.preventDefault(); }
      else if (k === "arrowleft") { goTo(st.cur - 1); e.preventDefault(); }
      else if (k === "m") markNext();
      else if (k === "c") clearResp();
    }
    document.addEventListener("keydown", onKey);
    function onVis() { last = Date.now(); acc = 0; }  // do not run the clock while the tab sleeps
    document.addEventListener("visibilitychange", onVis);

    drawTimer(); drawAll(true); persist();
    timerId = setInterval(tick, 250);

    cleanup = function () {
      clearInterval(timerId);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }

  /* ---------------- RESULT ---------------- */
  function renderResult(set, att, qlangOverride) {
    var ex = examOf(set), Q = set.questions;
    var lang = qlangOverride || att.qlang || prefs.qlang;
    var pct = att.max ? Math.max(0, att.score) / att.max : 0;
    var accu = att.correct + att.wrong ? Math.round(att.correct / (att.correct + att.wrong) * 100) : 0;
    var verdict = pct >= .75 ? ["v1", "var(--ok-soft)", "var(--ok)"] : pct >= .55 ? ["v2", "var(--brand-soft)", "var(--brand)"]
      : pct >= .35 ? ["v3", "var(--accent-soft)", "color-mix(in srgb,var(--accent) 65%,var(--ink))"] : ["v4", "var(--bad-soft)", "var(--bad)"];
    var R = 2 * Math.PI * 70;
    function res(i) { var a = att.saved[i]; return a == null ? "s" : a === Q[i].a ? "c" : "w"; }

    var secBars = set.sections.map(function (s) {
      var c = 0, w = 0, k = 0;
      Q.forEach(function (q, i) { if (q.s !== s.id) return; var r = res(i); if (r === "c") c++; else if (r === "w") w++; else k++; });
      var tot = c + w + k || 1, sc = Math.round((c * ex.pos - w * ex.neg) * 100) / 100;
      return '<div class="sec-bar"><div class="top"><b>' + esc(L(s.name, lang)) + "</b><span>" + num(sc) + " / " + tot * ex.pos + " · " +
        (c + w ? Math.round(c / (c + w) * 100) : 0) + "%</span></div>" +
        '<div class="stack"><i class="c" style="width:' + c / tot * 100 + '%"></i><i class="w" style="width:' + w / tot * 100 + '%"></i><i class="s" style="width:' + k / tot * 100 + '%"></i></div></div>';
    }).join("");

    var maxT = Math.max.apply(null, att.times.concat([1]));
    var tChart = att.times.map(function (s, i) {
      return '<i class="' + res(i) + '" style="height:' + Math.max(3, s / maxT * 100) + '%" title="Q' + (i + 1) + ": " + s + 's"></i>';
    }).join("");
    var answeredTimes = att.times.reduce(function (a, b) { return a + b; }, 0);

    var hist = cleanAtts(set.id).map(function (a, i) {
      var d = new Date(a.ts);
      return "<tr" + (a.id === att.id ? ' style="font-weight:700"' : "") + "><td>" + (cleanAtts(set.id).length - i) + "</td><td>" + d.toLocaleDateString() + " " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + "</td><td>" + num(a.score) + "/" + a.max + "</td><td>" + a.correct + "/" + a.wrong + "/" + a.skipped +
        '</td><td><a href="#/result/' + set.id + "/" + a.id + '">→</a></td></tr>';
    }).join("");

    app.innerHTML = topbar() + '<main class="wrap res">' +
      '<div class="ins-head"><a class="btn btn-ghost btn-sm" href="#/">← ' + esc(t("backHome")) + '</a><span class="badge" style="--c:' + ex.color + '">' + esc(L(ex.name)) + "</span></div>" +
      '<section class="res-hero"><div class="ring"><svg viewBox="0 0 172 172"><circle class="trk" cx="86" cy="86" r="70"/><circle class="bar" id="ringBar" cx="86" cy="86" r="70" stroke-dasharray="' + R.toFixed(1) +
      '" stroke-dashoffset="' + R.toFixed(1) + '"/></svg><div class="mid"><b>' + num(att.score) + "</b><span>/ " + att.max + " " + esc(t("marks")) + "</span></div></div>" +
      "<div><h1>" + esc(L(set.title)) + " — " + esc(t("resTitle")) + '</h1><span class="verdict" style="background:' + verdict[1] + ";color:" + verdict[2] + '">' + esc(t(verdict[0])) + "</span>" +
      '<div class="tiles"><div class="tile ok"><b>' + att.correct + "</b><span>" + esc(t("correct")) + '</span></div><div class="tile bad"><b>' + att.wrong + "</b><span>" + esc(t("wrong")) +
      '</span></div><div class="tile mk"><b>' + att.skipped + "</b><span>" + esc(t("skipped")) + '</span></div><div class="tile"><b>' + accu + "%</b><span>" + esc(t("accuracy")) +
      '</span></div><div class="tile"><b>' + human(att.timeTaken) + "</b><span>" + esc(t("timeTaken")) + '</span></div><div class="tile bad"><b>' + (att.neg ? "−" + num(att.neg) : "0") + "</b><span>" + esc(t("negMarks")) + "</span></div></div>" +
      '<div class="res-actions"><a class="btn btn-primary" href="#/test/' + set.id + '">↻ ' + esc(t("reattempt")) + '</a><a class="btn btn-ghost" href="#sol" id="toSol">' + esc(t("solutions")) +
      ' ↓</a><button class="btn btn-ghost" id="print">' + esc(t("reviewPrint")) + "</button></div></div></section>" +
      '<div class="res-grid"><section class="panel"><h2>' + esc(t("secAnalysis")) + '</h2><div class="sec-bars">' + secBars + "</div>" +
      '<div class="mini-legend"><span><i style="background:var(--ok)"></i>' + esc(t("correct")) + '</span><span><i style="background:var(--bad-2)"></i>' + esc(t("wrong")) +
      '</span><span><i style="background:var(--nv)"></i>' + esc(t("skipped")) + "</span></div></section>" +
      '<section class="panel"><h2>' + esc(t("timeAnalysis")) + '</h2><div class="time-chart">' + tChart + '</div><div class="time-axis"><span>Q1</span><span>' +
      esc(t("avgTime")) + ": " + Math.round(answeredTimes / Q.length) + esc(t("secs")) + "</span><span>Q" + Q.length + "</span></div>" +
      (hist ? '<h2 style="margin-top:20px">' + esc(t("history")) + '</h2><div style="overflow-x:auto"><table class="history"><thead><tr><th>#</th><th>' + esc(t("date")) + "</th><th>" + esc(t("score")) +
        "</th><th>✓/✗/–</th><th></th></tr></thead><tbody>" + hist + "</tbody></table></div>" : "") + "</section></div>" +
      '<div class="sol-head" id="sol"><h2>' + esc(t("solutions")) + '</h2><div class="sol-filters">' + langSwitch(lang, "data-sl") + "</div></div>" +
      '<div class="chips" role="group" style="margin-bottom:10px">' + ["all", "c", "w", "s", "m"].map(function (f) {
        var lbl = { all: "fAll", c: "fC", w: "fW", s: "fS", m: "fM" }[f];
        var cnt = f === "all" ? Q.length : f === "m" ? att.status.filter(function (x) { return x === "m" || x === "am"; }).length
          : Q.filter(function (q, i) { return res(i) === f; }).length;
        return '<button class="chip" data-sf="' + f + '" aria-pressed="' + (f === "all") + '">' + esc(t(lbl)) + ' <span class="n">' + cnt + "</span></button>";
      }).join("") + '</div><div id="sols"></div></main>' + footer();

    function drawSols(filter) {
      var html = Q.map(function (q, i) {
        var r = res(i), marked = att.status[i] === "m" || att.status[i] === "am";
        if (filter === "m" ? !marked : filter !== "all" && r !== filter) return "";
        var opts = (q.o[lang] || q.o.en).map(function (o, k) {
          var cls = k === q.a ? "right" : k === att.saved[i] ? "picked-wrong" : "";
          var tag = k === q.a ? '<span class="tag" style="color:var(--ok)">✓ ' + esc(t("rightAns")) + "</span>" : k === att.saved[i] ? '<span class="tag" style="color:var(--bad)">✗ ' + esc(t("yourAns")) + "</span>" : "";
          return '<div class="sol-opt ' + cls + '"><span class="key">' + KEYS[k] + "</span><span>" + rich(o) + "</span>" + tag + "</div>";
        }).join("");
        var stTag = { c: t("correct"), w: t("wrong"), s: t("notAnswered") }[r];
        return '<article class="sol ' + r + '"><div class="sol-top"><span><b>' + esc(t("question")) + " " + (i + 1) + "</b> · " + esc(L(set.sections.filter(function (s) { return s.id === q.s; })[0].name, lang)) +
          " · ⏱ " + att.times[i] + esc(t("secs")) + (marked ? " · 🔖" : "") + '</span><span class="status-tag ' + r + '">' + esc(stTag) + "</span></div>" +
          '<p class="sol-q">' + rich(L(q.q, lang)) + '</p><div class="sol-opts">' + opts + '</div><div class="explain"><b>' + esc(t("explanation")) + "</b>" + rich(L(q.e, lang)) + "</div></article>";
      }).join("");
      document.getElementById("sols").innerHTML = html || '<div class="empty">' + esc(t("noneHere")) + "</div>";
    }
    var curFilter = "all";
    drawSols(curFilter);
    bindChrome(app);
    app.querySelectorAll("[data-sf]").forEach(function (b) {
      b.addEventListener("click", function () {
        curFilter = b.getAttribute("data-sf");
        app.querySelectorAll("[data-sf]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        drawSols(curFilter);
      });
    });
    app.querySelectorAll("[data-sl]").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = b.getAttribute("data-sl");
        app.querySelectorAll("[data-sl]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        drawSols(curFilter);
      });
    });
    document.getElementById("toSol").addEventListener("click", function (e) { e.preventDefault(); document.getElementById("sol").scrollIntoView({ behavior: "smooth" }); });
    document.getElementById("print").addEventListener("click", function () { window.print(); });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { var b = document.getElementById("ringBar"); if (b) b.style.strokeDashoffset = (R * (1 - pct)).toFixed(1); });
    });
  }

  /* ---------------- ROUTER ---------------- */
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    document.querySelectorAll(".modal-back").forEach(function (m) { m.remove(); });
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    var view = parts[0], id = parts[1];
    if (view === "tests" || view === "patterns") view = "";
    var scrollTop = function () { window.scrollTo(0, 0); };

    if (!view) { renderHome(); return; }
    if (["test", "exam", "result"].indexOf(view) < 0 || !id) { location.hash = "#/"; return; }
    loadingView();
    BEP.loadSet(id).then(function (set) {
      if (view === "test") { document.title = L(set.title) + " · " + t("brand"); renderInstructions(set); }
      else if (view === "exam") { document.title = "⏱ " + L(set.title); renderExam(set); }
      else {
        var att = sanitizeAttempt(S.attempt(id, parts[2]), set.questions.length);
        if (!att) { location.hash = "#/test/" + id; return; }
        document.title = t("resTitle") + " · " + L(set.title);
        renderResult(set, att);
      }
      scrollTop();
    }).catch(errorView);
    if (view !== "exam") return;
  }

  applyTheme();
  window.addEventListener("hashchange", function () {
    if (!location.hash || location.hash === "#/" ) document.title = t("brand") + " — Bihar Exam Mock Tests";
    route();
  });
  if (window.matchMedia) {
    var mq = matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", function () { if (prefs.theme === "auto" && !/#\/exam/.test(location.hash)) route(); });
  }
  route();
})();
