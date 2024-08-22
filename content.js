// Service Workerの登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(error => console.log('Service Worker registration failed:', error));
  }
  
  chrome.storage.sync.get('selectedFontUrl', function(data) {
    if (data.selectedFontUrl) {
        const link = document.createElement('link');
        link.href = data.selectedFontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const fontName = new URL(data.selectedFontUrl).searchParams.get('family').split(':')[0].replace(/\+/g, ' ');

        // アイコンフォントには適用しないスタイル
        const style = document.createElement('style');
        style.textContent = `
            *:not([class*="icon"]) {
                font-family: '${fontName}', sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    }
});

  