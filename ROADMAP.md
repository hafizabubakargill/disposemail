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

### 9. ✨ Visual & Interactive Excellence
*   **Live Countdown**: Show a real-time countdown timer (e.g., `59:22 remaining`) next to the email address.
*   **Inbox Progress Bar**: A visual bar that depletes as the hour passes.
*   **Desktop Notifications**: Alert the user when a new email arrives, even if the tab is in the background.
*   **Lottie Animations**: Add subtle, high-quality animations for "Copying," "Refreshing," and "New Email Arrived."
*   **QR Code**: Generate a QR code for the temporary email so users can quickly scan it on their phones to share/open.
*   **Dark/Light Mode Sync**: Automatically match the user's OS theme with a beautiful toggle.

### 10. 📎 Advanced Utility
*   **Email Forwarding**: Allow users to forward a specific email to their real address for one-time saving.
*   **Auto-Reply**: Set a simple "Out of office" or "Thank you" reply for any incoming mail.
*   **Email Verification API**: A public endpoint for developers to check if an email is "real" or "disposable" (you can charge for this!).

### 7. 💰 Passive Income Features
*   **"Keep Inbox Active" Button**: Users can extend an inbox beyond 1 hour by viewing a 30-second rewarded ad.
*   **Premium Custom Names**: Allow users to reserve a name (e.g., `ceo@...`) if they support the site.
*   **VPN Recommendations**: Use affiliate links for privacy tools (like NordVPN/ExpressVPN) in the FAQ/About pages.

### 8. 🔍 SEO & Content
*   **Blog/Guides**: Write articles like "How to avoid spam" or "Why you need a disposable email." This drives organic traffic from Google for AdSense.
*   **FAQ Expansion**: Deep technical FAQs help rank for specific long-tail keywords.

---

## 📈 Monetization: Google AdSense Setup

To turn this into a passive income stream, follow these steps to integrate AdSense:

### 1. Account Approval
*   **Content is King**: AdSense often rejects "empty" tools. Ensure your **FAQ**, **About**, and **API Docs** pages are filled with high-quality text.
*   **Privacy Policy**: Add a mandatory Privacy Policy page explaining data deletion.

### 2. Integration
1.  **Site Verification**: Add the AdSense script to `app/layout.tsx`.
2.  **Auto Ads**: Enable "Auto Ads" in your AdSense dashboard—it will automatically find the best spots (header/footer).
3.  **Manual Placement**:
    *   **Sidebars**: Place ads on the left/right of the Inbox for desktop users.
    *   **Between Emails**: Insert a dummy "ad row" every 5 emails in the inbox list.

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

1.  **Update `lib/domains.ts`**:
    *   This is the **ONLY** file you need to change in the code.
    *   Just add your new domain to the list:
    ```typescript
    // lib/domains.ts
    export const DOMAINS = [
        'disposemail.xyz',
        'groundtips.com',
        'new-domain.com' // <-- Just add this!
    ];
    ```
    *   **Deploy**, and the dropdown on the homepage will update automatically.

### Phase 3: The Backend
**Good news:** You don't need to change `route.ts`.
Your database already saves the *full email address* (`user@domain.com`).
*   The Worker sends the full "To" address.
*   The API saves the full "To" address.
*   The Inbox queries by full "To" address.
It will "just work" as long as the Cloudflare Worker is triggered.
