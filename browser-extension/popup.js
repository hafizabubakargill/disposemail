// DisposeMail Popup Script
'use strict';

function sendMsg(action, data = {}) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action, ...data }, (response) => {
            if (chrome.runtime.lastError) { reject(chrome.runtime.lastError); return; }
            resolve(response);
        });
    });
}

function renderEmail(address, el) {
    if (!address) { el.textContent = 'Generating…'; return; }
    const [user, domain] = address.split('@');
    el.innerHTML = `<span class="email-username">${user}</span><span class="email-domain">@${domain}</span>`;
    el.classList.remove('loading');
}

function formatTimeLeft(createdAt) {
    if (!createdAt) return '—';
    const SESSION_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - createdAt;
    const remaining = Math.max(0, SESSION_MS - elapsed);
    if (remaining === 0) return 'Expired';
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    if (h > 0) return `~${h}h ${m}m left`;
    return `~${m}m left`;
}

function timerProgress(createdAt) {
    if (!createdAt) return 100;
    const SESSION_MS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - createdAt;
    return Math.max(0, Math.min(100, ((SESSION_MS - elapsed) / SESSION_MS) * 100));
}

function renderHistory(history, currentAddress, isPremium) {
    const section = document.getElementById('history-section');

    if (!isPremium) {
        section.innerHTML = `
      <div class="premium-gate">
        <div class="premium-gate-icon">🔒</div>
        <div class="premium-gate-title">Premium Feature</div>
        <div class="premium-gate-text">Upgrade to save and reuse up to 10 recent addresses across all your sessions.</div>
        <a href="https://disposemail.xyz/pricing" target="_blank" class="upgrade-btn">
          ★ Upgrade to Premium
        </a>
      </div>`;
        return;
    }

    // Premium: show history
    const others = (history || []).filter(a => a !== currentAddress).slice(0, 4);
    if (others.length === 0) {
        section.innerHTML = `<div style="font-size:10px;color:#374151;text-align:center;padding:8px;">No other addresses yet</div>`;
        return;
    }

    section.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'history-list';
    others.forEach(addr => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<span class="history-email">${addr}</span><button class="use-btn" data-addr="${addr}">Use</button>`;
        item.querySelector('.use-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            await sendMsg('setAddress', { address: e.target.dataset.addr });
            loadAndRender();
        });
        item.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(addr); } catch (e) { }
            item.style.borderColor = 'rgba(37,99,235,0.4)';
            setTimeout(() => { item.style.borderColor = ''; }, 1200);
        });
        list.appendChild(item);
    });
    section.appendChild(list);
}

function updateInboxLink(address) {
    const link = document.getElementById('inbox-link');
    if (address) {
        const encoded = encodeURIComponent(address);
        link.href = `https://disposemail.xyz/?email=${encoded}`;
    } else {
        link.href = 'https://disposemail.xyz';
    }
}

let currentAddress = null;
let timerInterval = null;

async function loadAndRender() {
    const displayEl = document.getElementById('email-display');
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');

    try {
        const { address, createdAt, isPremium } = await sendMsg('getAddress');
        currentAddress = address;
        renderEmail(address, displayEl);
        timerText.textContent = formatTimeLeft(createdAt);
        timerFill.style.width = timerProgress(createdAt) + '%';
        updateInboxLink(address);

        const { history } = await sendMsg('getHistory');
        renderHistory(history, address, isPremium);

        // Live countdown
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timerText.textContent = formatTimeLeft(createdAt);
            timerFill.style.width = timerProgress(createdAt) + '%';
        }, 60000);
    } catch (err) {
        displayEl.textContent = 'Error loading';
        displayEl.classList.remove('loading');
    }
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
document.getElementById('copy-btn').addEventListener('click', async function () {
    if (!currentAddress) return;
    try { await navigator.clipboard.writeText(currentAddress); } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = currentAddress; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
    }
    const orig = this.innerHTML;
    this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    this.classList.add('success');
    setTimeout(() => { this.innerHTML = orig; this.classList.remove('success'); }, 2500);
});

// ─── Refresh Button ───────────────────────────────────────────────────────────
document.getElementById('refresh-btn').addEventListener('click', async function () {
    const displayEl = document.getElementById('email-display');
    displayEl.classList.add('loading');
    this.disabled = true;
    const orig = this.innerHTML;
    this.textContent = 'Generating…';

    try {
        const { address } = await sendMsg('generateNew');
        currentAddress = address;
        renderEmail(address, displayEl);
        document.getElementById('timer-text').textContent = '~24h left';
        document.getElementById('timer-fill').style.width = '100%';
        updateInboxLink(address);
        const { history, isPremium } = await sendMsg('getHistory');
        renderHistory(history, address, isPremium);
    } catch (err) {
        displayEl.textContent = 'Error'; displayEl.classList.remove('loading');
    } finally {
        this.disabled = false;
        this.innerHTML = orig;
    }
});

loadAndRender();
