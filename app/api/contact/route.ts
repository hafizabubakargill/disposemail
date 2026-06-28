import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

        // 1.5. Cloudflare Turnstile Validation
        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        if (turnstileSecret && turnstileSecret !== '') {
            if (!data.turnstileToken) {
                console.warn('[Contact] Missing Turnstile token');
                return NextResponse.json({ error: 'Security validation failed' }, { status: 400 });
            }

            const formData = new URLSearchParams();
            formData.append('secret', turnstileSecret);
            formData.append('response', data.turnstileToken);
            
            // Extract IP for Cloudflare (Next.js 13+ headers)
            const forwardedFor = req.headers.get('x-forwarded-for');
            const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '';
            if (ip) formData.append('remoteip', ip);

            const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                body: formData,
            });

            const outcome = await verifyRes.json();
            if (!outcome.success) {
                console.warn('[Contact] Invalid Turnstile token state:', outcome['error-codes']);
                return NextResponse.json({ error: 'Security verification failed' }, { status: 403 });
            }
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

        // 4. Send Email via Hostinger SMTP
        console.log('[Contact Form Submission]:', data);

        const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465');
        const smtpUser = process.env.SMTP_USER || 'ceo@disposemail.xyz';
        const smtpPass = process.env.SMTP_PASSWORD;

        if (smtpPass && smtpPass !== '') {
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465, // true for 465, false for other ports
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });

            // Email 1: Notification to Admin / CEO
            const adminHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
                <h2 style="color: #60a5fa; margin-top: 0;">📬 New Contact Inquiry</h2>
                <p style="color: #94a3b8; font-size: 14px;">Someone submitted the contact form on DisposeMail.xyz:</p>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Name:</strong> ${data.name}</p>
                    <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></p>
                    <p style="margin: 4px 0;"><strong>IP Address:</strong> ${ip}</p>
                </div>
                <h3 style="color: #e2e8f0; margin-bottom: 8px;">Message:</h3>
                <div style="background: #0b0f19; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; white-space: pre-wrap; color: #cbd5e1;">${data.message}</div>
                <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Hit reply to answer directly to ${data.name} (${data.email}).</p>
            </div>`;

            await transporter.sendMail({
                from: `"DisposeMail Support" <${smtpUser}>`,
                replyTo: `${data.name} <${data.email}>`,
                to: smtpUser,
                subject: `[DisposeMail Contact] Inquiry from ${data.name}`,
                html: adminHtml,
            });

            // Email 2: Automated Acknowledgment to Customer
            const customerHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
                <h2 style="color: #60a5fa; margin-top: 0;">Hi ${data.name},</h2>
                <p style="color: #cbd5e1; line-height: 1.6;">Thank you for getting in touch with <strong>DisposeMail Support</strong>! We have received your request and our team is reviewing it.</p>
                <p style="color: #cbd5e1; line-height: 1.6;">We typically respond within <strong>24 hours</strong>. If your inquiry is urgent, please reply directly to this email.</p>
                
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: bold;">Your Original Message:</p>
                    <div style="color: #e2e8f0; white-space: pre-wrap; font-style: italic;">"${data.message}"</div>
                </div>

                <p style="color: #94a3b8; font-size: 14px;">Best regards,<br><strong style="color: #f8fafc;">DisposeMail Team</strong><br><a href="https://disposemail.xyz" style="color: #60a5fa; text-decoration: none;">https://disposemail.xyz</a></p>
            </div>`;

            await transporter.sendMail({
                from: `"DisposeMail Support" <${smtpUser}>`,
                to: data.email,
                subject: `We received your message! — DisposeMail Support`,
                html: customerHtml,
            });

            console.log('[Contact Form] Emails sent successfully via Hostinger SMTP.');
        } else {
            console.warn('[Contact Form] SMTP_PASSWORD environment variable not set. Logged to console only.');
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Contact Form Error]:', err?.message || err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
