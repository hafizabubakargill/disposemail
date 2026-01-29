import { NextRequest, NextResponse } from 'next/server';
import { simpleParser } from 'mailparser';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Note: Next.js App Router body parsing is different. We need to read the stream or text.
export async function POST(request: NextRequest) {
    // 1. Secret Check
    const apiKey = request.headers.get('x-api-key');
    // SECURITY: Ensure you set the WEBHOOK_SECRET in .env and API_SECRET in Cloudflare
    if (WEBHOOK_SECRET && apiKey !== WEBHOOK_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Read Body
        // mailparser simpleParser accepts string, buffer, or stream.
        // request.arrayBuffer() gives us a raw buffer we can covert to Buffer
        const arrayBuffer = await request.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Parse Email
        const parsed = await simpleParser(buffer);

        // 4. Extract To Address
        const toAddressObj = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to;
        // Access address property safely
        const rawAddress = (toAddressObj as any)?.address || (toAddressObj as any)?.text || '';
        const toAddress = rawAddress.toLowerCase().trim();

        if (!toAddress) {
            return new NextResponse('No recipient found', { status: 400 });
        }

        // 5. Save to DB
        const emailData = {
            id: uuidv4(),
            address: toAddress,
            from_address: parsed.from?.text || 'unknown',
            subject: parsed.subject || '(No Subject)',
            text: parsed.text || '',
            html: parsed.html || '',
            received_at: Date.now()
        };

        db.saveEmail(emailData);
        console.log(`[API] Saved email for ${toAddress}`);

        return new NextResponse('OK', { status: 200 });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
