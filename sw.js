/* Keeps the game usable offline. The network is asked first, and the server is
   always asked whether its copy has changed, so a new version shows up as soon
   as it is published; the saved copy is only for when there is no connection.
   Fonts never change, so they are served from the copy. */
const CACHE = 'pixel-paws-v3';
const CORE = ['./', './index.html', './style.css', './game.js', './manifest.json', './icon-192.png', './icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function keep(request, response) {
  if (response.ok || response.type === 'opaque') {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(res => keep(request, res))));
    return;
  }
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request.url, { cache: 'no-cache' }) // never the browser's own ten-minute-old copy
      .then(res => keep(request, res))
      .catch(() => caches.match(request, { ignoreSearch: true })
        .then(hit => hit || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
