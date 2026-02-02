export default {
    async email(message, env, ctx) {
        // --- CONFIG ---
        const WEBHOOK_URL = "https://disposemail.xyz/x-feed/webhook/email";
        const API_SECRET = "change_me_to_a_secure_secret"; // Must match server.js WEBHOOK_SECRET

        const sender = message.from;
        const recipient = message.to;
        const subject = message.headers.get("subject") || "(No Subject)";
        const timestamp = Date.now();

        const emailPayload = {
            to: recipient,
            from: sender,
            subject: subject,
            text: "Processing email...",
            html: "",
            secret: API_SECRET,
            timestamp: timestamp
        };

        try {
            // 1. Primary Attempt: Send to Server
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailPayload),
            });

            if (!response.ok) {
                console.error(`Webhook failed: ${response.status}`);
                // 2. Fallback Attempt: Save to KV if Server is down/404
                if (env.EMAILS_KV) {
                    const kvKey = `msg:${timestamp}:${recipient}`;
                    await env.EMAILS_KV.put(kvKey, JSON.stringify(emailPayload), { expirationTtl: 86400 }); // Expire in 24h
                    console.log(`Email saved to KV fallback: ${kvKey}`);
                }
            }
        } catch (e) {
            console.error("Worker Error:", e);
            // 3. Disaster Fallback: Save to KV if Fetch fails entirely
            if (env.EMAILS_KV) {
                const kvKey = `err:${timestamp}:${recipient}`;
                await env.EMAILS_KV.put(kvKey, JSON.stringify(emailPayload), { expirationTtl: 86400 });
            }
        }
    },
};
