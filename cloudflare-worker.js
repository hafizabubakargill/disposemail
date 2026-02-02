export default {
    async email(message, env, ctx) {
        // --- CONFIG ---
        const WEBHOOK_URL = "https://disposemail.xyz/x-feed/webhook/email";
        const API_SECRET = "change_me_to_a_secure_secret"; // Must match server.js WEBHOOK_SECRET

        const sender = message.from;
        const recipient = message.to;
        const subject = message.headers.get("subject") || "(No Subject)";

        try {
            // Forward to server using Shadow Path
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: recipient,
                    from: sender,
                    subject: subject,
                    text: "Email received. Parsing happens on server.",
                    html: "",
                    secret: API_SECRET
                }),
            });

            if (!response.ok) {
                console.error(`Webhook failed: ${response.status}`);
                // OPTIONAL: If you have a KV namespace bound as 'EMAILS_KV'
                // await env.EMAILS_KV.put(`lost_${Date.now()}`, JSON.stringify({to: recipient, from: sender, subject}));
            }
        } catch (e) {
            console.error("Worker Error:", e);
        }
    },
};
