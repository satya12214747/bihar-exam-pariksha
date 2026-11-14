/* Offline support: app shell is pre-cached; every file is fetched
   network-first and cached for offline use. Bump VERSION on deploy. */
var VERSION = "bep-v1";
var SHELL = [
  "./", "index.html", "css/styles.css", "js/exams.js", "js/i18n.js", "js/store.js",
  "js/app.js", "data/index.js", "icon.svg", "manifest.webmanifest"
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
