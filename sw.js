// Solo guarda la página inicial para abrirla sin conexión. El catálogo (/?s=...) nunca se intercepta.
const CACHE = 'inicio-v1';
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.add('/index.html')).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.mode !== 'navigate' || u.origin !== location.origin) return;
  if (!(u.pathname === '/' || u.pathname === '/index.html') || u.searchParams.has('s')) return;
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put('/index.html', c)); return r; }).catch(() => caches.match('/index.html')));
});
