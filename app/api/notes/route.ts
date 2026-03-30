import { NextResponse } from 'next/server';
const { createNote } = require('@/lib/notes-db');

export async function POST(request: Request) {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables.');
            return NextResponse.json({ success: false, error: 'Database configuration missing' }, { status: 500 });
        }

        const body = await request.json();
        
        if (!body.content || typeof body.content !== 'string') {
            return NextResponse.json({ success: false, error: 'Note content is required' }, { status: 400 });
        }

        if (body.content.length > 10000) {
            return NextResponse.json({ success: false, error: 'Note is too long (max 10,000 chars)' }, { status: 400 });
        }

        console.log('Generating Secure Note link...');
        const id = await createNote(body.content);

        if (!id) {
            console.error('FAILED to create secure note in DB (Returned null)');
            throw new Error('Database validation failed or disconnected.');
        }

        console.log('SUCCESS: Secure note ID generated:', id);
        return NextResponse.json({
            success: true,
            id: id
        });
    } catch (error: any) {
        console.error('Secure Note API Error Detail:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to create secure note' }, { status: 500 });
    }
}
