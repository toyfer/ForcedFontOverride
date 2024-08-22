document.addEventListener('DOMContentLoaded', function() {
  const fontUrlInput = document.getElementById('fontUrl');
  const saveButton = document.getElementById('save');

  // 現在のフォントURLを取得して表示
  chrome.storage.sync.get('selectedFontUrl', function(data) {
      if (data.selectedFontUrl) {
          fontUrlInput.value = data.selectedFontUrl;

          // プレビューを表示
          const link = document.createElement('link');
          link.href = data.selectedFontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);

          const fontName = new URL(data.selectedFontUrl).searchParams.get('family').split(':')[0].replace(/\+/g, ' ');
          document.body.style.fontFamily = fontName;
      }
  });

  // 保存ボタンのクリックイベント
  saveButton.addEventListener('click', function() {
      const fontUrl = fontUrlInput.value;

      // URLが有効かをチェック
      if (fontUrl.startsWith('https://fonts.googleapis.com/')) {
          chrome.storage.sync.set({ selectedFontUrl: fontUrl }, function() {
              alert('フォントURLが保存されました!');

              // フォントをプレビュー
              const link = document.createElement('link');
              link.href = fontUrl;
              link.rel = 'stylesheet';
              document.head.appendChild(link);

              const fontName = new URL(fontUrl).searchParams.get('family').split(':')[0].replace(/\+/g, ' ');
              document.body.style.fontFamily = fontName;
          });
      } else {
          alert('有効なGoogle FontsのURLを入力してください。');
      }
  });
});
