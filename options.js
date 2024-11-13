document.addEventListener('DOMContentLoaded', function() {
    const fontUrlInput = document.getElementById('fontUrl');
    const excludedUrlsInput = document.getElementById('excludedUrls');
    const saveButton = document.getElementById('save');
    const saveExcludedUrlsButton = document.getElementById('saveExcludedUrls');
    const messageDiv = document.getElementById('message');
    const excludedUrlsMessageDiv = document.getElementById('excludedUrlsMessage');

    // 現在のフォントURLを取得して表示
    chrome.storage.sync.get('selectedFontUrl', function(data) {
        if (data.selectedFontUrl) {
            fontUrlInput.value = data.selectedFontUrl;
        }
    });

    // 現在の除外URLを取得して表示
    chrome.storage.sync.get('excludedUrls', function(data) {
        if (data.excludedUrls) {
            excludedUrlsInput.value = data.excludedUrls.join(', ');
        }
    });

    // URLのバリデーション
    function validateUrl(url) {
        const regex = /^https:\/\/fonts\.googleapis\.com\/css2\?family=[\w\+\-\:\&=,]+$/;
        return regex.test(url);
    }

    // 除外URLのバリデーション
    function validateExcludedUrls(urls) {
        const regex = /^https?:\/\/[\w\-\.]+(\.[\w\-\.]+)+[/#?]?.*$/;
        return urls.split(',').every(url => regex.test(url.trim()));
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

    // 除外URL保存ボタンのクリックイベント
    saveExcludedUrlsButton.addEventListener('click', function() {
        const excludedUrls = excludedUrlsInput.value.split(',').map(url => url.trim());
        excludedUrlsMessageDiv.textContent = '';

        if (validateExcludedUrls(excludedUrlsInput.value)) {
            chrome.storage.sync.set({ excludedUrls: excludedUrls }, function() {
                excludedUrlsInput.classList.remove('invalid');
                excludedUrlsMessageDiv.textContent = '除外URLが保存されました!';
                excludedUrlsMessageDiv.classList.remove('error');
                saveExcludedUrlsButton.disabled = true;

                setTimeout(() => {
                    saveExcludedUrlsButton.disabled = false;
                }, 2000);
            });
        } else {
            excludedUrlsInput.classList.add('invalid');
            excludedUrlsMessageDiv.textContent = '有効なURLを入力してください。';
            excludedUrlsMessageDiv.classList.add('error');
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

    // 除外URL入力時にバリデーションを実行
    excludedUrlsInput.addEventListener('input', function() {
        if (validateExcludedUrls(excludedUrlsInput.value)) {
            excludedUrlsInput.classList.remove('invalid');
        } else {
            excludedUrlsInput.classList.add('invalid');
        }
    });
});
