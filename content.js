chrome.storage.sync.get('selectedFontUrl', function(data) {
  if (data.selectedFontUrl) {
      const link = document.createElement('link');
      link.href = data.selectedFontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const fontName = new URL(data.selectedFontUrl).searchParams.get('family').split(':')[0].replace(/\+/g, ' ');

      // フォントをページ全体に適用
      const style = document.createElement('style');
      style.textContent = `
          * {
              font-family: '${fontName}', sans-serif !important;
          }
      `;
      document.head.appendChild(style);
  }
});
