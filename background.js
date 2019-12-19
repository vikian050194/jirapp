chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message === 'fullscreen') {
        chrome.windows.getCurrent((window) => {
            chrome.windows.update(window.id, {
                state: "fullscreen"
            });
        });
    }

    if (message === 'zoom') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            const { id } = tabs[0];
            chrome.tabs.setZoom(id, 0.9);
        });
    }
});