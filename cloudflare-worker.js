export default {
    // 1. HANDLER FOR INCOMING EMAILS
    async email(message, env, ctx) {
        const WEBHOOK_URL = "https://inveromail.info/x-feed/webhook/email"; // Keep this line
        // const API_SECRET = "change_me_to_a_secure_secret"; // This line is removed

        const recipient = message.to;
        const sender = message.from;
        const subject = message.headers.get("subject") || "(No Subject)";
        const timestamp = Date.now();
        const id = crypto.randomUUID();

        // READ FULL RAW MESSAGE (MIME)
        const rawResponse = new Response(message.raw);
        const rawContent = await rawResponse.text();

        const emailPayload = {
            id,
            to: recipient,
            from: sender,
            subject: subject,
            raw: rawContent,
            timestamp: timestamp,
            secret: env.WEBHOOK_SECRET || "change_me_to_a_secure_secret"
        };

        // 1. SAVE TO KV (MANDATORY BACKUP)
        if (env.EMAILS_KV) {
            await env.EMAILS_KV.put(`msg:${timestamp}:${recipient}`, JSON.stringify(emailPayload), { expirationTtl: 1800 });
        }

        try {
            // 2. ATTEMPT WEBHOOK DELIVERY
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailPayload),
            });

            // 3. LOG RESULT TO KV FOR DIAGNOSTICS
            if (env.EMAILS_KV) {
                const logData = {
                    time: new Date().toISOString(),
                    status: response.status,
                    ok: response.ok,
                    id: id,
                    to: recipient
                };
                await env.EMAILS_KV.put(`log:${timestamp}:${id}`, JSON.stringify(logData), { expirationTtl: 3600 });
            }

            // 4. DELETE ORIGINAL MSG ONLY IF SERVER SAYS OK
            if (response.ok && env.EMAILS_KV) {
                await env.EMAILS_KV.delete(`msg:${timestamp}:${recipient}`);
            }
        } catch (e) {
            // WEBHOOK CRASHED
            if (env.EMAILS_KV) {
                await env.EMAILS_KV.put(`err:${timestamp}:${id}`, JSON.stringify({ error: e.message, id, to: recipient }), { expirationTtl: 3600 });
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
            const rescueResponse = await fetch("https://inveromail.info/x-feed/rescue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emails: emailsToRescue,
                    secret: API_SECRET
                })
            });

            const finalResponse = new Response(rescueResponse.body, rescueResponse);
            finalResponse.headers.set("Access-Control-Allow-Origin", "*");
            finalResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            finalResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return finalResponse;
        }

        // ALLOW EVERYTHING ELSE TO PASS THROUGH TO HOSTINGER
        return fetch(request);
    }
};
