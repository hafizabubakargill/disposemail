# DisposeMail Browser Extension

A Chrome/Brave/Edge browser extension that detects email input fields on any website and injects a "DisposeMail" button to instantly autofill a temporary, disposable address.

## Features

- 🛡️ **Instant Autofill** — Detects email fields and inserts a one-click "DisposeMail" button
- 🔄 **History** — Keeps the 10 most recent addresses so you can reuse them
- ⏱️ **Session Timer** — Shows an estimated 24h window for the generated address
- 📋 **One-click Copy** — Copy to clipboard from the popup or inline button
- 🌐 **SPA Support** — Works on dynamic, JavaScript-heavy sites via `MutationObserver`
- 🌙 **Premium Dark UI** — Modern gradient popup with live glow effects
- 🔒 **No external requests** — All address generation happens locally

## Installation (Developer Mode)

Since this extension is not published on the Chrome Web Store yet, install it in developer mode:

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `browser-extension/` folder from this project
5. The DisposeMail icon will appear in your toolbar

> For Brave: go to `brave://extensions`  
> For Edge: go to `edge://extensions`

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension configuration (MV3) |
| `background.js` | Service worker — address generation, storage, message bus |
| `content.js` | Injected into every page — detects email fields, adds button |
| `content.css` | Scoped styles for the injected tooltip button |
| `popup.html` | Extension popup UI (dark-mode) |
| `popup.js` | Popup logic — communicates with background service worker |

## How It Works

1. When a page loads, `content.js` scans for `<input type="email">` and email-like fields
2. For each found field, a styled `DisposeMail` button is injected to the right of the field
3. Clicking the button asks the **background service worker** for the current address
4. The address is autofilled into the input field and dispatched as an `input/change` event for SPA frameworks
5. The popup gives full access to copy, refresh, or browse history

## Publishing

When ready to publish:

1. Zip the `browser-extension/` folder
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the `.zip` file
4. Set store listing, screenshots, and privacy policy
