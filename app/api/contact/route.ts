import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. Anti-spam: Honeypot check
        if (data.honeypot) {
            return NextResponse.json({ success: true }, { status: 200 }); // Silent ignore
        }

        // 2. Anti-spam: Basic validation
        if (!data.name || !data.email || !data.message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 3. Rate limiting (Simulated for this simple implementation)
        // In production, use Redis or a similar store to track IPs.

        // 4. Log the message (In production, send an email via SendGrid/AWS SES or save to DB)
        console.log('[Contact Form Submission]:', data);

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
