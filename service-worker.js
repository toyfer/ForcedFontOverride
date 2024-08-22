const CACHE_NAME = 'font-cache-v1';
const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap',
  // 他の必要なフォントURLも追加できる
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FONT_URLS);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('https://fonts.googleapis.com/') ||
      event.request.url.startsWith('https://fonts.gstatic.com/')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
