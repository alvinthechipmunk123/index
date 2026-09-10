/* Seceda offline worker — caches the app shell and every map tile you've seen,
   so the map keeps working in Annatal dead zones. */
const SHELL = 'seceda-shell-v2';
const TILES = 'seceda-tiles-v3';
const TILE_MAX = 3200; // ~ a full day's browsing at three zoom levels

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(['seceda-map.jpg']).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);

  // The app page itself: network first (so updates land), cache as fallback.
  if (req.mode === 'navigate' || u.pathname.endsWith('seceda.html')) {
    e.respondWith(
      fetch(req).then(r => {
        const c = r.clone();
        caches.open(SHELL).then(x => x.put(req, c));
        return r;
      }).catch(() => caches.match(req))
    );
    return;
  }

  const isTile = /arcgisonline|opentopomap|tile\.openstreetmap/.test(u.host);
  const isLib  = /cdnjs\.cloudflare|fonts\.googleapis|fonts\.gstatic/.test(u.host);
  if (!isTile && !isLib) return;

  // Tiles and libraries: cache first, fill cache from network.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') {
        const c = r.clone();
        caches.open(isTile ? TILES : SHELL).then(async x => {
          x.put(req, c);
          if (isTile) {
            const keys = await x.keys();
            if (keys.length > TILE_MAX) x.delete(keys[0]);
          }
        });
      }
      return r;
    }))
  );
});
