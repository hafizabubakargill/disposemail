// DisposeMail Browser Extension – Background Service Worker

const BASE_DOMAINS = [
    'dropinbox.space',
    'disposemail.space',
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com',
    'nivoramail.pro',
    'avelixmail.pro',
    'oryvomail.pro',
    'noviqmail.pro',
    'noemi.co.com'
];

function generateAddress() {
    const base = BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];
    const sub = Math.random().toString(36).substring(2, 6);
    const userPart = Math.random().toString(36).substring(2, 10);
    return `${userPart}@${sub}.${base}`;
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

    if (request.action === 'setAddressFromWebsite') {
        chrome.storage.local.get(['currentAddress', 'addressHistory'], (data) => {
            if (data.currentAddress !== request.address) {
                const history = data.addressHistory || [];
                history.unshift(request.address);
                if (history.length > 10) history.pop();
                chrome.storage.local.set({
                    currentAddress: request.address,
                    addressHistory: history,
                    createdAt: request.createdAt || Date.now(),
                });
            }
            sendResponse({ success: true });
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
