import { NextResponse } from 'next/server';
import { createNote } from '@/lib/notes-db';

// Notes are encrypted in the browser (AES-256-GCM, key stays in the URL fragment).
// The server only accepts and stores ciphertext: base64url(iv + ciphertext + tag).
const MAX_PAYLOAD = 60000; // fits 10,000 characters of UTF-8 text plus overhead
const PAYLOAD_RE = /^[A-Za-z0-9_-]+$/;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body?.v !== 2 || typeof body.content !== 'string') {
            return NextResponse.json({ success: false, error: 'Please reload the page and try again.' }, { status: 400 });
        }
        if (body.content.length < 38 || !PAYLOAD_RE.test(body.content)) {
            return NextResponse.json({ success: false, error: 'Invalid encrypted note' }, { status: 400 });
        }
        if (body.content.length > MAX_PAYLOAD) {
            return NextResponse.json({ success: false, error: 'Note is too long (max 10,000 chars)' }, { status: 400 });
        }

        const id = await createNote(body.content);
        if (!id) {
            throw new Error('Database validation failed or disconnected.');
        }

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('Secure Note API Error:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to create secure note' }, { status: 500 });
    }
}
