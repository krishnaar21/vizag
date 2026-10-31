/* Offline + low-network support for the Vizag trip planner (GitHub Pages).
   Page files open instantly from the phone's cache and refresh in the background;
   fonts and login scripts are cached after first use. */
const CACHE = 'vizag-trip-v18';
const CORE = ['./', './index.html', './sync-config.js', './manifest.webmanifest', './vizag-trip-planner.pdf'];
const EXTERNAL = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    /* Warm the heavy scripts in the background; failures are fine */
    EXTERNAL.forEach(u => fetch(u, { mode: 'cors' }).then(r => r.ok && c.put(u, r)).catch(() => {}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function notifyUpdate() {
  const all = await self.clients.matchAll({ type: 'window' });
  all.forEach(c => c.postMessage('updated'));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* Never cache login or database traffic; Firestore keeps its own offline queue */
  if (/googleapis\.com$/.test(url.hostname) && !/fonts\.googleapis\.com$/.test(url.hostname)) return;
  if (url.hostname.endsWith('firebaseio.com')) return;

  if (url.origin === self.location.origin) {
    /* Stale-while-revalidate: answer from cache at once, update quietly */
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const isPage = req.mode === 'navigate' && (url.pathname.endsWith('/') || url.pathname.endsWith('.html'));
      const key = isPage ? './index.html' : req;
      const cached = await c.match(key, { ignoreSearch: true });
      const network = fetch(req).then(async res => {
        if (res && res.ok) {
          if (cached && isPage) {
            const [a, b] = await Promise.all([cached.clone().text(), res.clone().text()]);
            if (a !== b) notifyUpdate();
          }
          await c.put(key, res.clone());
        }
        return res;
      }).catch(() => null);
      if (cached) { e.waitUntil(network); return cached; }
      const res = await network;
      return res || (isPage ? await c.match('./index.html') : null) || new Response('Not available offline yet', { status: 503 });
    })());
  } else if (/fonts\.(googleapis|gstatic)\.com$|www\.gstatic\.com$|unpkg\.com$/.test(url.hostname)) {
    /* Fonts, icons and login scripts: cache first */
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
  }
});
