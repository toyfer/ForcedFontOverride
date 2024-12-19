// キャッシュの名前（バージョン番号を含む）
const CACHE_NAME = 'font-cache-v2';

// service worker のインストール時に実行
self.addEventListener('install', event => {
  event.waitUntil(
    // chrome.storage からフォント URL を取得
    chrome.storage.sync.get(['selectedFontUrl'], (data) => {
      const fontUrl = data.selectedFontUrl || 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap'; // デフォルトのフォント URL
      const FONT_URLS = [fontUrl];

      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(FONT_URLS);
      });
    })
  );
});

// リクエストをインターセプト
self.addEventListener('fetch', event => {
  // chrome.storage からフォント URL を取得
  chrome.storage.sync.get(['selectedFontUrl'], (data) => {
    const fontUrl = data.selectedFontUrl;
      if (fontUrl && event.request.url === fontUrl) {
          // キャッシュされたレスポンスがあれば返す
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
                      // エラー時のフォールバック処理（例：デフォルトフォントを返す）
                      return caches.match('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
                  });
              })
          );
      }
  });
});
