const CACHE_NAME = 'font-cache-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    chrome.storage.sync.get(['selectedFontUrl', 'excludedUrls'], (data) => {
      const fontUrl = data.selectedFontUrl || 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
      const excludedUrls = data.excludedUrls || [];
      const FONT_URLS = [fontUrl];

      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(FONT_URLS);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  chrome.storage.sync.get(['selectedFontUrl', 'excludedUrls'], (data) => {
    const fontUrl = data.selectedFontUrl;
    const excludedUrls = data.excludedUrls || [];
    const currentUrl = event.request.url;

    if (excludedUrls.some(url => currentUrl.includes(url))) {
      return;
    }

    if (fontUrl && currentUrl === fontUrl) {
      event.respondWith(
        caches.match(event.request).then(response => {
          return response || fetch(event.request)
            .then(networkResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
              return networkResponse;
            })
            .catch(error => {
              console.error('Fetch error:', error);
              return caches.match('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
            });
        })
      );
    }
  });
});
