/* Tiny localStorage layer. Every access is guarded: private mode or a full
   storage must never break the exam. */
(function () {
  var P = "bep:";
  var mem = {};
  function get(k, d) {
    try {
      var v = localStorage.getItem(P + k);
      return v == null ? (k in mem ? mem[k] : d) : JSON.parse(v);
    } catch (e) { return k in mem ? mem[k] : d; }
  }
  function set(k, v) {
    mem[k] = v;
    try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* memory fallback */ }
  }
  function del(k) {
    delete mem[k];
    try { localStorage.removeItem(P + k); } catch (e) {}
  }

  BEP.store = {
    prefs: function () {
      return Object.assign({ ui: "hi", qlang: "hi", theme: "auto", name: "" }, get("prefs", {}));
    },
    setPref: function (k, v) { var p = this.prefs(); p[k] = v; set("prefs", p); },

    progress: function (id) { return get("progress:" + id, null); },
    saveProgress: function (id, st) { set("progress:" + id, st); },
    clearProgress: function (id) { del("progress:" + id); },
    allProgress: function () {
      var out = [];
      (BEP.catalog || []).forEach(function (c) { var p = get("progress:" + c.id, null); if (p) out.push({ id: c.id, p: p }); });
      return out.sort(function (a, b) { return (b.p.updatedAt || 0) - (a.p.updatedAt || 0); });
    },

    attempts: function (id) { return get("attempts:" + id, []); },
    addAttempt: function (id, a) {
      var list = this.attempts(id);
      list.unshift(a);
      set("attempts:" + id, list.slice(0, 10));
    },
    attempt: function (id, aid) {
      return this.attempts(id).filter(function (a) { return a.id === aid; })[0] || null;
    }
  };
})();
