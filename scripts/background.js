browser.runtime.onInstalled.addListener((details) => {
    if (details.reason == 'install') {
        authenticate();
    }
});

browser.action.onClicked.addListener((tab) => {
    authenticate();
});

function authenticate(info, tab) {
    let url = browser.runtime.getURL("view/authentication.html");
    browser.tabs.create({ url });
}