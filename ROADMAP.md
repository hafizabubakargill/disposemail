# Project Roadmap & Multi-Domain Guide

## 🚀 Feature Suggestions

### 1. 🌐 Multi-Domain Support (High Value)
**Why?** If one domain gets blacklisted by services, users can switch to another. it looks more professional.
**How?** Add a dropdown in the UI to let users select `@disposemail.xyz` or `@other-domain.com`.

### 2. 📎 File Attachments
**Why?** Users often need to receive PDFs or verification images.
**How?** Update the Cloudflare Worker to parse attachments. Store files in **Cloudflare R2** (AWS S3 compatible, cheaper) and save the download link in your `lowdb` database.

### 3. ✍️ Custom Aliases & Plus Addressing
**Why?** Users prefer `john.doe@...` or specific tags like `john+netflix@...`.
**How?**
*   **Custom Name:** Add an input field on the homepage.
*   **Plus Addressing (`user+tag@...`)**: This **works automatically** with your current "Catch-All" setup. `john+test@disposemail.xyz` is treated as a unique inbox. No extra setup needed!

### 4. 🎲 Random Subdomains (e.g. `user@x9z.disposemail.xyz`)
**Why?** Harder to block by services that ban the main domain.
**Cloudflare Setup:**
1.  Add an **MX Record** for `*` (Wildcard) pointing to Cloudflare's mail servers.
2.  In Email Routing, ensure the Catch-All covers subdomains (or add the subdomain as a verified domain if Cloudflare requires explicit verification).
**Note:** This is an advanced setup; Cloudflare often requires adding specific subdomains (e.g. `mail.disposemail.xyz`) rather than infinite wildcards on free plans.

### 5. 📲 Progressive Web App (PWA)
**Why?** Allows users to "install" the website on their phone home screen.
**How?** Add a `manifest.json` and service worker. Next.js has standard plugins for this.

### 5. 🖨️ Print & PDF Export
**Why?** Users might want to save a receipt or ticket received in the email.
**How?** Add a "Print" or "Download PDF" button in the email view.

---

## 🌍 How to Add More Domains

The beauty of your setup (Cloudflare Worker + Central Server) is that **one server can handle infinite domains**.

### Phase 1: Cloudflare Setup (For EACH new domain)
1.  **Buy/Add Domain**: Add your new domain (e.g., `tempmail.pro`) to your existing Cloudflare account.
2.  **DNS Records**:
    *   Go to **DNS**. Add the standard MX records required for Email Routing (Cloudflare will prompt you to "Enable Email Routing" and do this automatically).
3.  **Email Routing**:
    *   Go to **Email** > **Email Routing** > **Routes**.
    *   Create a **Catch-All** rule.
    *   **Action**: "Send to a Worker".
    *   **Destination**: Select your **EXISTING** worker (`disposemail-worker` or whatever you named it).
    *   *Note: You do NOT need a new worker script. The same script works because it just forwards the payload.*

### Phase 2: App Configuration
You need to tell your frontend about the new domains so users can select them.

1.  **Update Environment**:
    Add a list of domains to your code (or `.env` if you want it dynamic).
    ```typescript
    // constants/domains.ts
    export const DOMAINS = ['disposemail.xyz', 'tempmail.pro', 'privacy.net'];
    ```

2.  **Frontend Update (`app/page.tsx`)**:
    *   Replace the hardcoded `@disposemail.xyz` with a **Dropdown `<select>`**.
    *   When the user generates a random string, combine it with the *selected* domain.
    ```typescript
    const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
    // ...
    const newEmail = `${userPart}@${selectedDomain}`;
    ```

### Phase 3: The Backend
**Good news:** You don't need to change `route.ts`.
Your database already saves the *full email address* (`user@domain.com`).
*   The Worker sends the full "To" address.
*   The API saves the full "To" address.
*   The Inbox queries by full "To" address.
It will "just work" as long as the Cloudflare Worker is triggered.
