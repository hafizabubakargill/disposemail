# Cloudflare Email Routing Debug Guide

Since you are not seeing emails, we need to trace where the chain is breaking. The flow is:
`Sender -> Cloudflare Email Routing -> Worker Script -> Your VPS (disposemail.xyz/api/webhook/email)`

### Step 1: Verify the Worker is "Catching" Emails
1.  Log in to the **Cloudflare Dashboard**.
2.  Go to **Email** > **Email Routing** > **Routes**.
3.  Ensure you have a **"Catch-All"** rule (or a specific rule) where `Action` is **"Send to Worker"** and the Destination is your worker script (e.g., `disposemail-worker`).
    *   *If this is missing, Cloudflare is just dropping the emails.*

### Step 2: Check Worker Logs (The Smoking Gun)
1.  Go to **Workers & Pages**.
2.  Click on your worker (e.g., `disposemail-worker`).
3.  Click the **"Logs"** tab.
4.  Click **"Begin Log Stream"**.
5.  **Send an email** to your generated `@disposemail.xyz` address from a separate tab (e.g., from your Gmail).
6.  **Watch the Logs**:
    *   **Success**: You should see a green 200 OK status.
    *   **Failure**: You might see a red "Error" or "Exception".
    *   **Common Error 1**: `fetch failed` -> Your VPS is unreachable (Firewall?).
    *   **Common Error 2**: `404 Not Found` -> The Worker is posting to the wrong URL.

### Step 3: Verify the Worker Destination URL
1.  In the Worker editor (click "Edit Code"), look for the `POST_URL` variable.
2.  It MUST exactly match your production webhook:
    `const POST_URL = "https://disposemail.xyz/api/webhook/email";`
    *   *Note: If you are using HTTPS, ensure your SSL certificate is valid.*

### Step 4: Test Your Server Directly
If Cloudflare logs say "Success" but you see nothing, verify your server can actually accept data.
1.  Open your terminal on your computer.
2.  Run the test script I created:
    ```bash
    ./test-webhook.sh
    ```
3.  If this works (you see the email on your site), but real emails don't arrive, the issue is **definitely Step 3** (The Worker is sending to the wrong place).
