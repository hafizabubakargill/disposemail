// DisposeMail Content Script
// Injects a "Use DisposeMail" button next to email input fields on any webpage.

(function () {
    'use strict';

    // Don't run in iframes that aren't top-level
    if (window.self !== window.top && window.location.hostname !== document.location.hostname) return;

    const INJECTED_ATTR = 'data-dm-injected';

    // ─── SVG Icons ────────────────────────────────────────────────────────────
    const SHIELD_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    const REFRESH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
    const COPY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

    // ─── State ─────────────────────────────────────────────────────────────────
    let currentAddress = null;

    function getAddress() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'getAddress' }, (response) => {
                if (chrome.runtime.lastError) {
                    // Extension context invalid, fail silently
                    resolve(generateFallback());
                    return;
                }
                currentAddress = response?.address;
                resolve(currentAddress);
            });
        });
    }

    function refreshAddress() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'generateNew' }, (response) => {
                if (chrome.runtime.lastError) { resolve(generateFallback()); return; }
                currentAddress = response?.address;
                resolve(currentAddress);
            });
        });
    }

    function generateFallback() {
        const r = Math.random().toString(36).substring(2, 10);
        return `${r}@disposemail.xyz`;
    }

    // ─── Inject Button into a Single Input ────────────────────────────────────
    function injectIntoInput(input) {
        if (input.getAttribute(INJECTED_ATTR)) return;
        input.setAttribute(INJECTED_ATTR, 'true');

        // Wrap input in a relative container only if it's not already positioned
        const parent = input.parentElement;
        const computedStyle = window.getComputedStyle(input);

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'dm-wrapper';

        // Copy key layout styles from parent to avoid layout shifts
        wrapper.style.width = '100%';
        wrapper.style.display = computedStyle.display === 'block' ? 'block' : 'inline-block';

        parent.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        // Create the tooltip container
        const tooltip = document.createElement('div');
        tooltip.className = 'dm-tooltip';

        // Main "Use DisposeMail" button
        const mainBtn = document.createElement('button');
        mainBtn.className = 'dm-btn';
        mainBtn.type = 'button';
        mainBtn.innerHTML = `${SHIELD_ICON}<span>DisposeMail</span>`;
        mainBtn.title = 'Autofill with a temporary disposable email address';

        // Refresh button (generates a new address)
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'dm-btn-icon';
        refreshBtn.type = 'button';
        refreshBtn.innerHTML = REFRESH_ICON;
        refreshBtn.title = 'Generate a new disposable address';

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'dm-btn-icon';
        copyBtn.type = 'button';
        copyBtn.innerHTML = COPY_ICON;
        copyBtn.title = 'Copy current disposable address';

        tooltip.appendChild(mainBtn);
        tooltip.appendChild(refreshBtn);
        tooltip.appendChild(copyBtn);
        wrapper.appendChild(tooltip);

        // ── Event Handlers ────────────────────────────────────
        async function fillInput(address) {
            const addr = address || await getAddress();
            input.value = addr;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.style.backgroundImage = 'none';
            // Show a brief "filled" badge
            showFilledBadge(wrapper, addr.split('@')[0] + '…');
        }

        mainBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            mainBtn.innerHTML = `${SHIELD_ICON}<span>Filling…</span>`;
            await fillInput();
            mainBtn.innerHTML = `${SHIELD_ICON}<span>✓ Filled</span>`;
            setTimeout(() => { mainBtn.innerHTML = `${SHIELD_ICON}<span>DisposeMail</span>`; }, 3000);
        });

        refreshBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            refreshBtn.style.opacity = '0.5';
            const newAddr = await refreshAddress();
            refreshBtn.style.opacity = '1';
            // If the input already has our address, update it too
            if (input.value && input.value.endsWith('@disposemail.xyz')) {
                await fillInput(newAddr);
            }
        });

        copyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const addr = currentAddress || await getAddress();
            try {
                await navigator.clipboard.writeText(addr);
                copyBtn.style.opacity = '0.5';
                setTimeout(() => { copyBtn.style.opacity = '1'; }, 1200);
            } catch (err) {
                // Fallback for sites with strict CSP
                const ta = document.createElement('textarea');
                ta.value = addr; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy');
                document.body.removeChild(ta);
            }
        });
    }

    function showFilledBadge(wrapper, shortAddr) {
        let badge = wrapper.querySelector('.dm-filled-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'dm-filled-badge';
            wrapper.appendChild(badge);
        }
        badge.textContent = '✓ ' + shortAddr;
        badge.style.display = 'block';
    }

    // ─── Selector Logic ───────────────────────────────────────────────────────
    const EMAIL_SELECTORS = [
        'input[type="email"]',
        'input[name*="email" i]',
        'input[id*="email" i]',
        'input[placeholder*="email" i]',
        'input[autocomplete="email"]',
        'input[autocomplete="username"]',
    ].join(',');

    function scanAndInject() {
        try {
            document.querySelectorAll(EMAIL_SELECTORS).forEach((input) => {
                // Skip hidden or disabled inputs
                if (input.type === 'hidden' || input.disabled || input.readOnly) return;
                // Skip tiny inputs (likely hidden or decorative)
                const rect = input.getBoundingClientRect();
                if (rect.width < 50 || rect.height < 10) return;
                injectIntoInput(input);
            });
        } catch (e) { /* Silent fail */ }
    }

    // ─── Observer for Dynamic Content (SPAs, AJAX forms) ─────────────────────
    const observer = new MutationObserver((mutations) => {
        let needsScan = false;
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) { needsScan = true; break; }
            }
            if (needsScan) break;
        }
        if (needsScan) scanAndInject();
    });

    // ─── Init ─────────────────────────────────────────────────────────────────
    function init() {
        scanAndInject();
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });
        // Pre-fetch address so it's ready when user clicks
        getAddress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
