/* Offline support for the Vizag trip planner (GitHub Pages).
   Keeps the page, its config and fonts/scripts in a cache so it opens with no internet. */
const CACHE = 'vizag-trip-v2';
const CORE = ['./', './index.html', './sync-config.js', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* Never cache Firebase data or login traffic; Firestore handles its own offline queue */
  if (/googleapis\.com$/.test(url.hostname) && !/fonts\.googleapis\.com$/.test(url.hostname)) return;
  if (url.hostname.endsWith('firebaseio.com')) return;
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin) {
    /* Page files: network first so updates show up, cache when offline */
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$|www\.gstatic\.com$|unpkg\.com$/.test(url.hostname)) {
    /* Fonts, icons and Firebase scripts: cache first */
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
  }
});
