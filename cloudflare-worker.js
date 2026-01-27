export default {
    async email(message, env, ctx) {
        const WEBHOOK_URL = "https://disposemail.xyz/api/webhook/email"; // CHANGE THIS if domain is different
        const API_SECRET = "change_me_to_a_secure_secret"; // Optional: Add header auth if you want

        try {
            // Get the raw email
            const rawEmail = await new Response(message.raw).arrayBuffer();

            // Forward to your server
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "message/rfc822",
                    "X-Api-Key": API_SECRET
                },
                body: rawEmail,
            });

            if (!response.ok) {
                console.error(`Failed to forward email: ${response.status} ${response.statusText}`);
                // We generally don't want to reject the email at Cloudflare level just because our webhook failed,
                // unless we want to bounce it. For now, we log errors.
                // message.setReject("Internal Server Error"); 
            }
        } catch (e) {
            console.error("Worker Error:", e);
        }
    },
};
