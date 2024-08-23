document.addEventListener('DOMContentLoaded', function() {
    const fontUrlInput = document.getElementById('fontUrl');
    const saveButton = document.getElementById('save');
    const messageDiv = document.getElementById('message');

    // 現在のフォントURLを取得して表示
    chrome.storage.sync.get('selectedFontUrl', function(data) {
        if (data.selectedFontUrl) {
            fontUrlInput.value = data.selectedFontUrl;
        }
    });

    // URLのバリデーション
    function validateUrl(url) {
        const regex = /^https:\/\/fonts\.googleapis\.com\/css2\?family=[\w\+\-\:\&=,]+$/;
        return regex.test(url);
    }

    // 保存ボタンのクリックイベント
    saveButton.addEventListener('click', function() {
        const fontUrl = fontUrlInput.value;
        messageDiv.textContent = '';

        if (validateUrl(fontUrl)) {
            chrome.storage.sync.set({ selectedFontUrl: fontUrl }, function() {
                fontUrlInput.classList.remove('invalid');
                messageDiv.textContent = 'フォントURLが保存されました!';
                messageDiv.classList.remove('error');
                saveButton.disabled = true;

                setTimeout(() => {
                    saveButton.disabled = false;
                }, 2000);
            });
        } else {
            fontUrlInput.classList.add('invalid');
            messageDiv.textContent = '有効なGoogle FontsのURLを入力してください。';
            messageDiv.classList.add('error');
        }
    });

    // フォームの入力時にバリデーションを実行
    fontUrlInput.addEventListener('input', function() {
        if (validateUrl(fontUrlInput.value)) {
            fontUrlInput.classList.remove('invalid');
        } else {
            fontUrlInput.classList.add('invalid');
        }
    });
});
