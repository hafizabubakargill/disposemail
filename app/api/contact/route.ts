import { NextResponse } from 'next/server';

// Simple in-memory rate limiter for Contact Form
// Keys: IP addresses, Values: { count, timestamp }
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((data, ip) => {
        if (now - data.timestamp > RATE_LIMIT_DURATION) {
            rateLimitMap.delete(ip);
        }
    });
}, RATE_LIMIT_DURATION);

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

        // 3. Rate limiting (In-memory IP tracking)
        // Extract IP (Next.js 13+ headers)
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown_ip';

        if (ip !== 'unknown_ip') {
            const now = Date.now();
            const record = rateLimitMap.get(ip) || { count: 0, timestamp: now };

            if (now - record.timestamp > RATE_LIMIT_DURATION) {
                // Reset if duration passed
                record.count = 1;
                record.timestamp = now;
            } else {
                record.count++;
            }

            rateLimitMap.set(ip, record);

            if (record.count > MAX_REQUESTS) {
                console.warn(`[Contact Form Rate Limit] Blocked IP: ${ip} for too many submissions.`);
                return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
            }
        }

        // 4. Log the message (In production, send an email via SendGrid/AWS SES or save to DB)
        console.log('[Contact Form Submission]:', data);

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
