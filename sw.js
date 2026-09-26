// v2: network-first for pages and product data (so design/price updates reach
// returning visitors), cache-first for static assets. Relative paths so it works
// under a GitHub Pages sub-path (e.g. /miru-store/).
const CACHE_NAME = 'miru-v2';
const ASSETS = ['./', 'index.html', 'css/miru.css', 'js/miru-ui.js', 'data/products.json', 'manifest.json',
  'assets/img/hero-skincare-dark.jpg', 'assets/img/mood-clean.jpg', 'assets/img/mood-routine.jpg', 'assets/img/lifestyle-model.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || req.url.endsWith('.html') || req.url.includes('products.json');
  if (fresh) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
