chrome.runtime.onInstalled.addListener(({ reason, version }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        authenticate();
    }
});

chrome.action.onClicked.addListener((tab) => {
    authenticate();
});

function authenticate(info, tab) {
    let url = chrome.runtime.getURL("view/authentication.html");
    chrome.tabs.create({ url });
}