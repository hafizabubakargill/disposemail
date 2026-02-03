export default {
    // 1. HANDLER FOR INCOMING EMAILS
    async email(message, env, ctx) {
        const WEBHOOK_URL = "https://disposemail.xyz/x-feed/webhook/email";
        const API_SECRET = "change_me_to_a_secure_secret";

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
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailPayload),
            });

            if (!response.ok && env.EMAILS_KV) {
                await env.EMAILS_KV.put(`msg:${timestamp}:${recipient}`, JSON.stringify(emailPayload), { expirationTtl: 1800 });
            }
        } catch (e) {
            if (env.EMAILS_KV) {
                await env.EMAILS_KV.put(`err:${timestamp}:${recipient}`, JSON.stringify(emailPayload), { expirationTtl: 1800 });
            }
        }
    },

    // 2. HANDLER FOR RESCUE SYNC (Called from Browser)
    async fetch(request, env) {
        const url = new URL(request.url);
        const API_SECRET = "change_me_to_a_secure_secret";

        if (url.pathname === "/sync-safety-net") {
            const secret = url.searchParams.get("secret");
            if (secret !== API_SECRET) return new Response("Unauthorized", { status: 401 });

            if (!env.EMAILS_KV) return new Response("KV not bound", { status: 500 });

            // List all saved emails
            const list = await env.EMAILS_KV.list({ prefix: "msg:" });
            const errors = await env.EMAILS_KV.list({ prefix: "err:" });
            const allKeys = [...list.keys, ...errors.keys];

            const emailsToRescue = [];
            for (const key of allKeys) {
                const val = await env.EMAILS_KV.get(key.name);
                if (val) {
                    emailsToRescue.push(JSON.parse(val));
                    await env.EMAILS_KV.delete(key.name); // Clear after rescuing
                }
            }

            if (emailsToRescue.length === 0) return new Response(JSON.stringify({ count: 0 }), { headers: { "Content-Type": "application/json" } });

            // Forward to Server
            const rescueResponse = await fetch("https://disposemail.xyz/x-feed/rescue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emails: emailsToRescue,
                    secret: API_SECRET
                })
            });

            return rescueResponse;
        }

        // ALLOW EVERYTHING ELSE TO PASS THROUGH TO HOSTINGER
        return fetch(request);
    }
};
