document.addEventListener('DOMContentLoaded', function() {
    const fontUrlInput = document.getElementById('fontUrl');
    const excludedUrlInput = document.getElementById('excludedUrl');
    const addUrlButton = document.getElementById('addUrl');
    const excludedUrlsList = document.getElementById('excludedUrlsList');
    const saveButton = document.getElementById('save');
    const saveExcludedUrlsButton = document.getElementById('saveExcludedUrls');
    const messageDiv = document.getElementById('message');
    const excludedUrlsMessageDiv = document.getElementById('excludedUrlsMessage');

    let excludedUrls = [];

    // 現在のフォントURLを取得して表示
    chrome.storage.sync.get('selectedFontUrl', function(data) {
        if (data.selectedFontUrl) {
            fontUrlInput.value = data.selectedFontUrl;
        }
    });

    // 保存済みの除外URLを読み込む
    chrome.storage.sync.get('excludedUrls', function(data) {
        if (data.excludedUrls) {
            excludedUrls = data.excludedUrls;
            renderExcludedUrls();
        }
    });

    // URLのバリデーション
    function validateUrl(url) {
        const regex = /^https:\/\/fonts\.googleapis\.com\/css2\?family=[\w\+\-\:\&=,]+$/;
        return regex.test(url);
    }

    // 除外URLのバリデーション
    function validateExcludedUrl(url) {
        const regex = /^https?:\/\/[\w\-\.]+(\.[\w\-\.]+)+[/#?]?.*$/;
        return regex.test(url);
    }

    // 除外URLの表示を更新
    function renderExcludedUrls() {
        excludedUrlsList.innerHTML = '';
        excludedUrls.forEach((url, index) => {
            const urlItem = document.createElement('div');
            urlItem.className = 'url-item';
            urlItem.innerHTML = `
                <span>${url}</span>
                <button class="delete-url" data-index="${index}">削除</button>
            `;
            excludedUrlsList.appendChild(urlItem);
        });
    }

    // 追加ボタンのクリックイベント
    addUrlButton.addEventListener('click', function() {
        const url = excludedUrlInput.value.trim();
        if (url && validateExcludedUrl(url)) {
            if (!excludedUrls.includes(url)) {
                excludedUrls.push(url);
                excludedUrlInput.value = '';
                renderExcludedUrls();
                excludedUrlInput.classList.remove('invalid');
            }
        } else {
            excludedUrlInput.classList.add('invalid');
        }
    });

    // 削除ボタンのクリックイベント
    excludedUrlsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-url')) {
            const index = parseInt(e.target.dataset.index);
            excludedUrls.splice(index, 1);
            renderExcludedUrls();
        }
    });

    // フォントURL保存ボタンのクリックイベント
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
        chrome.storage.sync.set({ excludedUrls: excludedUrls }, function() {
            excludedUrlsMessageDiv.textContent = '除外URLが保存されました!';
            excludedUrlsMessageDiv.classList.remove('error');
            saveExcludedUrlsButton.disabled = true;

            setTimeout(() => {
                saveExcludedUrlsButton.disabled = false;
            }, 2000);
        });
    });

    // フォントURL入力時のバリデーション
    fontUrlInput.addEventListener('input', function() {
        if (validateUrl(fontUrlInput.value)) {
            fontUrlInput.classList.remove('invalid');
        } else {
            fontUrlInput.classList.add('invalid');
        }
    });

    // 除外URL入力時のバリデーション
    excludedUrlInput.addEventListener('input', function() {
        if (validateExcludedUrl(excludedUrlInput.value.trim())) {
            excludedUrlInput.classList.remove('invalid');
        } else {
            excludedUrlInput.classList.add('invalid');
        }
    });
});