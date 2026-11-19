/* Offline support: app shell is pre-cached; every file is fetched
   network-first and cached for offline use. Bump VERSION on deploy. */
var VERSION = "bep-v8";
var SHELL = [
  "./", "index.html", "css/styles.css?v=8", "js/exams.js?v=8", "js/i18n.js?v=8", "js/store.js?v=8",
  "js/app.js?v=8", "data/index.js?v=8", "js/about.js?v=8", "js/boot.js?v=8", "js/guides.js?v=8", "icon.svg", "manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  // Only this site and Google Fonts. Never touch GitHub API calls from the admin page.
  var u = new URL(e.request.url);
  if (u.origin !== self.location.origin && !/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return;
  if (/\/admin\.html$|\/js\/admin\.js|\/css\/admin\.css/.test(u.pathname)) return;
  // Network-first: always fresh when online, cached copy when offline.
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return fetch(e.request).then(function (res) {
      if (res && (res.ok || res.type === "opaque")) cache.put(e.request, res.clone());
      return res;
    }).catch(function () {
      return cache.match(e.request, { ignoreSearch: true });
    });
  }));
});
