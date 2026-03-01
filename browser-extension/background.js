// DisposeMail Browser Extension – Background Service Worker

const DOMAINS = [
    'disposemail.xyz',
    'mail.disposemail.xyz',
    'inbox.disposemail.xyz',
    'temp.disposemail.xyz',
    'drop.disposemail.xyz',
    'nivoramail.pro'
];

const ADJECTIVES = ['swift', 'silent', 'quiet', 'fast', 'cool', 'fresh', 'safe', 'bright', 'clear', 'smart', 'clean', 'anon'];
const NOUNS = ['mail', 'box', 'drop', 'desk', 'port', 'vault', 'safe', 'node', 'hub', 'gate', 'key', 'zone'];

function generateAddress() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
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
        createdAt: Date.now(),
        isPremium: false, // default free tier
    });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAddress') {
        chrome.storage.local.get(['currentAddress', 'createdAt', 'isPremium'], (data) => {
            sendResponse({
                address: data.currentAddress || generateAddress(),
                createdAt: data.createdAt,
                isPremium: data.isPremium || false,
            });
        });
        return true;
    }

    if (request.action === 'generateNew') {
        const newAddress = generateAddress();
        chrome.storage.local.get(['addressHistory', 'isPremium'], (data) => {
            const history = data.addressHistory || [];
            history.unshift(newAddress);
            if (history.length > 10) history.pop();
            chrome.storage.local.set({
                currentAddress: newAddress,
                addressHistory: history,
                createdAt: Date.now(),
            });
            sendResponse({ address: newAddress });
        });
        return true;
    }

    if (request.action === 'getHistory') {
        chrome.storage.local.get(['addressHistory', 'isPremium'], (data) => {
            sendResponse({
                history: data.addressHistory || [],
                isPremium: data.isPremium || false,
            });
        });
        return true;
    }

    if (request.action === 'setAddress') {
        chrome.storage.local.set({ currentAddress: request.address });
        sendResponse({ success: true });
        return true;
    }
});
