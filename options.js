document.addEventListener('DOMContentLoaded', function () {
    const fontUrlInput = document.getElementById('fontUrl');
    const excludedUrlInput = document.getElementById('excludedUrl');
    const addUrlButton = document.getElementById('addUrl');
    const excludedUrlsList = document.getElementById('excludedUrlsList');
    const saveButton = document.getElementById('save');
    const saveExcludedUrlsButton = document.getElementById('saveExcludedUrls');
    const messageDiv = document.getElementById('message');
    const excludedUrlsMessageDiv = document.getElementById('excludedUrlsMessage');
    const exportExcludedUrlsButton = document.getElementById('exportExcludedUrls');
    const importExcludedUrlsButton = document.getElementById('importExcludedUrls');

    let excludedUrls = [];

    // 現在のフォントURLを取得して表示
    chrome.storage.sync.get('selectedFontUrl', function (data) {
        if (data.selectedFontUrl) {
            fontUrlInput.value = data.selectedFontUrl;
        }
    });

    // 保存済みの除外URLを読み込む
    chrome.storage.sync.get('excludedUrls', function (data) {
        if (data.excludedUrls) {
            excludedUrls = data.excludedUrls;
            renderExcludedUrls();
        }
    });

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
    addUrlButton.addEventListener('click', function () {
        const url = excludedUrlInput.value.trim();
        if (url && !excludedUrls.includes(url)) {
            excludedUrls.push(url);
            excludedUrlInput.value = '';
            renderExcludedUrls();
            excludedUrlsMessageDiv.textContent = ''; // エラーメッセージをクリア
        }
    });

    // 削除ボタンのクリックイベント
    excludedUrlsList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-url')) {
            const index = parseInt(e.target.dataset.index);
            excludedUrls.splice(index, 1);
            renderExcludedUrls();
        }
    });

    // フォントURL保存ボタンのクリックイベント
    saveButton.addEventListener('click', function () {
        const fontUrl = fontUrlInput.value;
        messageDiv.textContent = '';

        // URL先がフォントかどうかを判定
        fetch(fontUrl)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('font')) {
                    chrome.storage.sync.set({ selectedFontUrl: fontUrl }, function () {
                        messageDiv.textContent = 'フォントURLが保存されました!';
                        messageDiv.classList.remove('error');
                        saveButton.disabled = true;

                        setTimeout(() => {
                            saveButton.disabled = false;
                        }, 2000);
                    });
                } else {
                    messageDiv.textContent = '有効なフォントURLを入力してください。';
                    messageDiv.classList.add('error');
                }
            })
            .catch(error => {
                messageDiv.textContent = 'フォントURLの取得に失敗しました。';
                messageDiv.classList.add('error');
            });
    });

    // 除外URL保存ボタンのクリックイベント
    saveExcludedUrlsButton.addEventListener('click', function () {
        chrome.storage.sync.set({ excludedUrls: excludedUrls }, function () {
            excludedUrlsMessageDiv.textContent = '除外URLが保存されました!';
            excludedUrlsMessageDiv.classList.remove('error');
            saveExcludedUrlsButton.disabled = true;

            setTimeout(() => {
                saveExcludedUrlsButton.disabled = false;
            }, 2000);
        });
    });

    // 除外URLエクスポートボタンのクリックイベント
    exportExcludedUrlsButton.addEventListener('click', function () {
        const excludedUrlsString = JSON.stringify(excludedUrls);
        const blob = new Blob([excludedUrlsString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'excluded_urls.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // 除外URLインポートボタンのクリックイベント
    importExcludedUrlsButton.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const importedUrls = JSON.parse(event.target.result);
                    if (Array.isArray(importedUrls)) {
                        excludedUrls = importedUrls;
                        renderExcludedUrls();
                        chrome.storage.sync.set({ excludedUrls: excludedUrls });
                        excludedUrlsMessageDiv.textContent = '除外URLがインポートされました!';
                        excludedUrlsMessageDiv.classList.remove('error');
                    } else {
                        excludedUrlsMessageDiv.textContent = '無効なJSONファイルです。';
                        excludedUrlsMessageDiv.classList.add('error');
                    }
                } catch (error) {
                    excludedUrlsMessageDiv.textContent = 'JSONファイルの解析に失敗しました。';
                    excludedUrlsMessageDiv.classList.add('error');
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });

    // 除外URLインポートボタンのクリックイベント
    importExcludedUrlsButton.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                const previousExcludedUrls = excludedUrls; // 以前の状態を保存
                try {
                    const importedUrls = JSON.parse(event.target.result);
                    if (Array.isArray(importedUrls)) {
                        excludedUrls = importedUrls;
                        renderExcludedUrls();
                        chrome.storage.sync.set({ excludedUrls: excludedUrls });
                        excludedUrlsMessageDiv.textContent = '除外URLがインポートされました!';
                        excludedUrlsMessageDiv.classList.remove('error');
                    } else {
                        excludedUrls = previousExcludedUrls; // 以前の状態に戻す
                        excludedUrlsMessageDiv.textContent = '無効なJSONファイルです。';
                        excludedUrlsMessageDiv.classList.add('error');
                    }
                } catch (error) {
                    excludedUrls = previousExcludedUrls; // 以前の状態に戻す
                    excludedUrlsMessageDiv.textContent = 'JSONファイルの解析に失敗しました。';
                    excludedUrlsMessageDiv.classList.add('error');
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });
});