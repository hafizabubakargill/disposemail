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
    const SESSION_MS = 60 * 60 * 1000;
    const elapsed = Date.now() - createdAt;
    const remaining = Math.max(0, SESSION_MS - elapsed);
    if (remaining === 0) return 'Expired';
    const totalSecs = Math.floor(remaining / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function timerProgress(createdAt) {
    if (!createdAt) return 100;
    const SESSION_MS = 60 * 60 * 1000;
    const elapsed = Date.now() - createdAt;
    return Math.max(0, Math.min(100, ((SESSION_MS - elapsed) / SESSION_MS) * 100));
}

function renderTools() {
    const section = document.getElementById('history-section');
    if (!section) return;
    section.innerHTML = `
      <div class="tools-grid">
        <a href="https://disposemail.xyz/test-card-generator" target="_blank" class="tool-btn">💳 Card Gen</a>
        <a href="https://disposemail.xyz/password-generator" target="_blank" class="tool-btn">🔑 Password</a>
        <a href="https://disposemail.xyz/uuid-generator" target="_blank" class="tool-btn">⚡ UUID Gen</a>
        <a href="https://disposemail.xyz/hash-generator" target="_blank" class="tool-btn">#️⃣ Hash Gen</a>
        <a href="https://disposemail.xyz/jwt-decoder" target="_blank" class="tool-btn">🔐 JWT Decode</a>
        <a href="https://disposemail.xyz/json-formatter" target="_blank" class="tool-btn">📜 JSON Format</a>
      </div>
      <a href="https://disposemail.xyz/free-tools" target="_blank" class="view-all-btn">
        ✨ View All 10+ Free Developer Tools →
      </a>
    `;
}

function updateInboxLink(address) {
    const link = document.getElementById('inbox-link');
    link.href = 'https://disposemail.xyz';
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

        renderTools();

        // Live countdown
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timerText.textContent = formatTimeLeft(createdAt);
            timerFill.style.width = timerProgress(createdAt) + '%';
        }, 1000);
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
        document.getElementById('timer-text').textContent = '59:59';
        document.getElementById('timer-fill').style.width = '100%';
        updateInboxLink(address);
        document.getElementById('qr-box').classList.remove('active');
        renderTools();
        loadAndRender();
    } catch (err) {
        displayEl.textContent = 'Error'; displayEl.classList.remove('loading');
    } finally {
        this.disabled = false;
        this.innerHTML = orig;
    }
});

// ─── Scan QR Button ───────────────────────────────────────────────────────────
document.getElementById('qr-btn').addEventListener('click', function () {
    if (!currentAddress) return;
    const box = document.getElementById('qr-box');
    const img = document.getElementById('qr-img');
    if (box.classList.contains('active')) {
        box.classList.remove('active');
    } else {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('mailto:' + currentAddress)}`;
        box.classList.add('active');
    }
});

// Theme Switcher
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    if (localStorage.getItem('dm_theme') === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.textContent = '🌙';
    } else {
        themeBtn.textContent = '☀️';
    }
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('dm_theme', isLight ? 'light' : 'dark');
        themeBtn.textContent = isLight ? '🌙' : '☀️';
    });
}

loadAndRender();
