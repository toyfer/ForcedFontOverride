if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}

chrome.storage.sync.get(['selectedFontUrl', 'excludedUrls'], function (data) {
    if (data.selectedFontUrl) {
        const currentUrl = window.location.href;
        const excludedUrls = data.excludedUrls || [];

        if (excludedUrls.some(url => currentUrl.includes(url))) {
            console.log('Font overwriting is disabled for this URL:', currentUrl);
            return;
        }

        const link = document.createElement('link');
        link.href = data.selectedFontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const fontFamily = new URL(data.selectedFontUrl).searchParams.get('family');
        if (fontFamily) {
            const fontName = fontFamily.split(':')[0].replace(/\+/g, ' ');

            const style = document.createElement('style');
            style.textContent = `
                *:not([class*="icon"]) {
                    font-family: '${fontName}', sans-serif !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            console.error('Error: Font family parameter is missing in the URL');
        }
    }
});
