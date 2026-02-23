// DisposeMail Browser Extension – Background Service Worker
// Handles address generation/persistence and message passing from popup/content scripts.

const DOMAINS = ['disposemail.xyz'];

function generateAddress() {
    const adjectives = ['swift', 'silent', 'quiet', 'fast', 'cool', 'fresh', 'safe', 'anon', 'clear', 'smart', 'bright', 'clean'];
    const nouns = ['mail', 'box', 'drop', 'desk', 'port', 'vault', 'safe', 'node', 'hub', 'gate', 'key', 'zone'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9999);
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    return `${adj}${noun}${num}@${domain}`;
}

// On install, generate a first address
chrome.runtime.onInstalled.addListener(() => {
    const address = generateAddress();
    chrome.storage.local.set({
        currentAddress: address,
        addressHistory: [address],
        createdAt: Date.now()
    });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAddress') {
        chrome.storage.local.get(['currentAddress', 'createdAt'], (data) => {
            sendResponse({
                address: data.currentAddress || generateAddress(),
                createdAt: data.createdAt
            });
        });
        return true; // Keep channel open for async response
    }

    if (request.action === 'generateNew') {
        const newAddress = generateAddress();
        chrome.storage.local.get(['addressHistory'], (data) => {
            const history = data.addressHistory || [];
            history.unshift(newAddress);
            if (history.length > 10) history.pop(); // Keep only last 10
            chrome.storage.local.set({
                currentAddress: newAddress,
                addressHistory: history,
                createdAt: Date.now()
            });
            sendResponse({ address: newAddress });
        });
        return true;
    }

    if (request.action === 'getHistory') {
        chrome.storage.local.get(['addressHistory'], (data) => {
            sendResponse({ history: data.addressHistory || [] });
        });
        return true;
    }

    if (request.action === 'setAddress') {
        chrome.storage.local.set({ currentAddress: request.address });
        sendResponse({ success: true });
        return true;
    }
});
