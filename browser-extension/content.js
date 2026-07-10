// DisposeMail Content Script — Professional Floating Suggestion
// Displays a password-manager-style dropdown suggestion when an email field is focused.
// Does NOT modify the input field's DOM wrapper.

(function () {
    'use strict';
    if (window.self !== window.top && window.location.hostname !== document.location.hostname) return;

    const INJECTED_ATTR = 'data-dm-attached';
    let currentAddress = null;
    let activeDropdown = null;
    let activeInput = null;

    // Two-way live inbox sync when visiting disposemail.xyz directly
    if (window.location.hostname.includes('disposemail.xyz')) {
        let lastSyncAddr = localStorage.getItem('disposemail_address');
        setInterval(() => {
            try {
                const storedAddr = localStorage.getItem('disposemail_address');
                const storedCreated = parseInt(localStorage.getItem('disposemail_created') || '0');
                
                // If website generated a new address, send to extension
                if (storedAddr && storedAddr !== lastSyncAddr) {
                    lastSyncAddr = storedAddr;
                    chrome.runtime.sendMessage({ action: 'setAddressFromWebsite', address: storedAddr, createdAt: storedCreated });
                } else {
                    // Otherwise check if extension generated a new address
                    chrome.runtime.sendMessage({ action: 'getAddress' }, (res) => {
                        if (res?.address && res.address !== storedAddr) {
                            localStorage.setItem('disposemail_address', res.address);
                            localStorage.setItem('disposemail_created', (res.createdAt || Date.now()).toString());
                            localStorage.removeItem('disposemail_token');
                            lastSyncAddr = res.address;
                            window.dispatchEvent(new Event('disposemail_sync'));
                        }
                    });
                }
            } catch (e) {}
        }, 250);
    }

    // ─── Fetch / cache address ────────────────────────────────────────────────
    function getAddress() {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage({ action: 'getAddress' }, (res) => {
                    if (chrome.runtime.lastError) { resolve(generateFallback()); return; }
                    currentAddress = res?.address;
                    resolve(currentAddress);
                });
            } catch (e) { resolve(generateFallback()); }
        });
    }

    function refreshAddress() {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage({ action: 'generateNew' }, (res) => {
                    if (chrome.runtime.lastError) { resolve(generateFallback()); return; }
                    currentAddress = res?.address;
                    resolve(currentAddress);
                });
            } catch (e) { resolve(generateFallback()); }
        });
    }

    function generateFallback() {
        const parts = ['swift', 'quiet', 'fresh', 'clear'];
        const bases = ['disposemail.space', 'inveromail.info', 'noviqmail.pro', 'nivoramail.pro'];
        const sub = Math.random().toString(36).substring(2, 6);
        return `${parts[Math.floor(Math.random() * parts.length)]}${Math.floor(Math.random() * 999)}@${sub}.${bases[Math.floor(Math.random() * bases.length)]}`;
    }

    // ─── Create the suggestion dropdown ───────────────────────────────────────
    function createDropdown(address) {
        const div = document.createElement('div');
        div.className = 'dm-suggestion';
        div.innerHTML = `
      <div class="dm-suggestion-row">
        <div class="dm-suggestion-left">
          <div class="dm-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="dm-suggestion-text">
            <div class="dm-label">DisposeMail — Protect your inbox</div>
            <div class="dm-address">${address}</div>
          </div>
        </div>
        <div class="dm-suggestion-actions">
          <button class="dm-use-btn" title="Use this address">Use</button>
          <button class="dm-refresh-btn" title="Generate a new address">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
        </div>
      </div>`;

        div.querySelector('.dm-use-btn').addEventListener('mousedown', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            fillInput(activeInput, address);
            hideDropdown();
        });

        div.querySelector('.dm-refresh-btn').addEventListener('mousedown', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const addrEl = div.querySelector('.dm-address');
            addrEl.textContent = 'Generating…';
            const newAddr = await refreshAddress();
            addrEl.textContent = newAddr;
            // update use button
            div.querySelector('.dm-use-btn').addEventListener('mousedown', (e2) => {
                e2.preventDefault(); e2.stopPropagation();
                fillInput(activeInput, newAddr);
                hideDropdown();
            }, { once: true });
        });

        return div;
    }

    function getDropdownPosition(input) {
        const rect = input.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 280),
        };
    }

    function showDropdown(input, address) {
        hideDropdown();
        activeInput = input;
        const pos = getDropdownPosition(input);
        const dropdown = createDropdown(address);
        dropdown.style.position = 'absolute';
        dropdown.style.top = pos.top + 'px';
        dropdown.style.left = pos.left + 'px';
        dropdown.style.width = pos.width + 'px';
        dropdown.style.zIndex = '2147483647';
        document.body.appendChild(dropdown);
        activeDropdown = dropdown;

        // Animate in
        requestAnimationFrame(() => { dropdown.classList.add('dm-visible'); });
    }

    function hideDropdown() {
        if (activeDropdown) {
            activeDropdown.remove();
            activeDropdown = null;
        }
        activeInput = null;
    }

    function fillInput(input, address) {
        if (!input) return;
        input.value = address;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // Show a subtle confirmation
        input.style.outline = '2px solid rgba(37,99,235,0.5)';
        input.style.outlineOffset = '1px';
        setTimeout(() => { input.style.outline = ''; input.style.outlineOffset = ''; }, 2000);
    }

    // ─── Email field selector ──────────────────────────────────────────────────
    const EMAIL_SELECTORS = [
        'input[type="email"]',
        'input[name*="email" i]',
        'input[id*="email" i]',
        'input[placeholder*="email" i]',
        'input[autocomplete="email"]',
        'input[autocomplete="username"]',
    ].join(',');

    function attachToInput(input) {
        if (input.getAttribute(INJECTED_ATTR)) return;
        if (input.type === 'hidden' || input.disabled || input.readOnly) return;
        const rect = input.getBoundingClientRect();
        if (rect.width < 50) return;
        input.setAttribute(INJECTED_ATTR, 'true');

        input.addEventListener('focus', async () => {
            // Only show if input is still empty or already has our address
            if (input.value && !input.value.includes('disposemail.xyz')) return;
            const address = currentAddress || await getAddress();
            showDropdown(input, address);
        });

        input.addEventListener('blur', () => {
            // Small delay so clicks on the dropdown register first
            setTimeout(hideDropdown, 200);
        });

        input.addEventListener('input', () => {
            // Hide if user starts typing their own address
            if (activeDropdown && input.value && !input.value.includes('disposemail.xyz')) {
                hideDropdown();
            }
        });
    }

    function scanAndAttach() {
        try {
            document.querySelectorAll(EMAIL_SELECTORS).forEach(attachToInput);
        } catch (e) { }
    }

    // ─── Observer ──────────────────────────────────────────────────────────────
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if ([...m.addedNodes].some(n => n.nodeType === 1)) { scanAndAttach(); break; }
        }
    });

    // ─── Close on outside click ────────────────────────────────────────────────
    document.addEventListener('mousedown', (e) => {
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            hideDropdown();
        }
    }, true);

    // ─── Reposition on scroll/resize ──────────────────────────────────────────
    window.addEventListener('scroll', () => {
        if (activeDropdown && activeInput) {
            const pos = getDropdownPosition(activeInput);
            activeDropdown.style.top = pos.top + 'px';
            activeDropdown.style.left = pos.left + 'px';
        }
    }, { passive: true });

    // ─── Init ─────────────────────────────────────────────────────────────────
    function init() {
        scanAndAttach();
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
        getAddress(); // pre-warm
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
