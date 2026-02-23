// DisposeMail Popup Script
// Handles communication with the background service worker and manages the popup UI.

'use strict';

// ─── Helpers ────────────────────────────────────────────────────────────────
function sendMsg(action, data = {}) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action, ...data }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

// Render the email address with colored parts
function renderEmail(address, displayEl) {
    if (!address) { displayEl.textContent = 'Generating...'; return; }
    const [user, domain] = address.split('@');
    displayEl.innerHTML = `<span class="email-username">${user}</span><span class="email-domain">@${domain}</span>`;
    displayEl.classList.remove('loading');
}

// Format time ago
function timeAgo(timestamp) {
    if (!timestamp) return '24h window';
    const elapsed = Date.now() - timestamp;
    const hoursLeft = Math.max(0, 24 - Math.floor(elapsed / 3600000));
    const minsLeft = Math.max(0, 60 - Math.floor((elapsed % 3600000) / 60000));
    if (hoursLeft > 0) return `~${hoursLeft}h ${minsLeft}m left`;
    if (minsLeft > 0) return `~${minsLeft}m left`;
    return 'Expiring soon';
}

function timerProgress(timestamp) {
    if (!timestamp) return 100;
    const elapsed = Date.now() - timestamp;
    const total = 24 * 3600 * 1000; // 24 hours
    return Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
}

// Render history items
function renderHistory(history, currentAddress) {
    const listEl = document.getElementById('history-list');
    if (!history || history.length <= 1) {
        listEl.innerHTML = '<div style="font-size:10px;color:#374151;text-align:center;padding:8px;">No other addresses yet</div>';
        return;
    }
    listEl.innerHTML = '';
    // Show all except the current one (which is shown in the card)
    history
        .filter(addr => addr !== currentAddress)
        .slice(0, 4)
        .forEach(addr => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
        <span class="history-email">${addr}</span>
        <button class="use-btn" data-addr="${addr}">Use</button>
      `;
            item.querySelector('.use-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const selected = e.target.dataset.addr;
                await sendMsg('setAddress', { address: selected });
                await loadAndRender();
            });
            item.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(addr);
                    item.style.borderColor = 'rgba(37,99,235,0.5)';
                    item.style.background = 'rgba(37,99,235,0.15)';
                    setTimeout(() => {
                        item.style.borderColor = '';
                        item.style.background = '';
                    }, 1200);
                } catch (e) { /* CSP fallback */ }
            });
            listEl.appendChild(item);
        });
}

// ─── Core Load/Render ────────────────────────────────────────────────────────
let currentAddress = null;

async function loadAndRender() {
    const displayEl = document.getElementById('email-display');
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');

    try {
        const { address, createdAt } = await sendMsg('getAddress');
        currentAddress = address;
        renderEmail(address, displayEl);
        timerText.textContent = timeAgo(createdAt);
        timerFill.style.width = timerProgress(createdAt) + '%';

        const { history } = await sendMsg('getHistory');
        renderHistory(history, address);
    } catch (err) {
        displayEl.textContent = 'Error loading address';
        displayEl.classList.remove('loading');
    }
}

// ─── Event Listeners ─────────────────────────────────────────────────────────
document.getElementById('copy-btn').addEventListener('click', async function () {
    if (!currentAddress) return;
    try {
        await navigator.clipboard.writeText(currentAddress);
        this.textContent = '✓ Copied!';
        this.classList.add('copied');
        setTimeout(() => {
            this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy Address`;
            this.classList.remove('copied');
        }, 2500);
    } catch (err) {
        // Fallback for restricted contexts
        const ta = document.createElement('textarea');
        ta.value = currentAddress;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
});

document.getElementById('refresh-btn').addEventListener('click', async function () {
    const displayEl = document.getElementById('email-display');
    displayEl.classList.add('loading');
    this.disabled = true;
    this.textContent = 'Generating…';

    try {
        const { address } = await sendMsg('generateNew');
        currentAddress = address;
        renderEmail(address, displayEl);
        document.getElementById('timer-text').textContent = '24h window';
        document.getElementById('timer-fill').style.width = '100%';
        const { history } = await sendMsg('getHistory');
        renderHistory(history, address);
    } catch (err) {
        displayEl.textContent = 'Error';
        displayEl.classList.remove('loading');
    } finally {
        this.disabled = false;
        this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>New Address`;
    }
});

// ─── Init ────────────────────────────────────────────────────────────────────
loadAndRender();
