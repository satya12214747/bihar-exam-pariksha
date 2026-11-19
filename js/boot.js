/* Runs first, in <head>.
   1) Anti-clickjacking: GitHub Pages can't send X-Frame-Options / frame-ancestors
      headers, so refuse to render inside a frame from another site.
   2) Register the offline service worker. */
(function () {
  if (window.top !== window.self) {
    var foreign = false;
    try { foreign = window.top.location.origin !== window.location.origin; } catch (e) { foreign = true; }
    if (foreign) {
      try { window.top.location.replace(window.location.href); }
      catch (e) { document.documentElement.style.display = "none"; }
    }
  }
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
