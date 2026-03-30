import { NextResponse } from 'next/server';
const { createNote } = require('@/lib/notes-db');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.content || typeof body.content !== 'string') {
            return NextResponse.json({ success: false, error: 'Note content is required' }, { status: 400 });
        }

        if (body.content.length > 10000) {
            return NextResponse.json({ success: false, error: 'Note is too long (max 10,000 chars)' }, { status: 400 });
        }

        const id = await createNote(body.content);

        if (!id) {
            throw new Error('Database validation failed or disconnected.');
        }

        return NextResponse.json({
            success: true,
            id: id
        });
    } catch (error: any) {
        console.error('Secure Note Creation Error:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to create secure note' }, { status: 500 });
    }
}
