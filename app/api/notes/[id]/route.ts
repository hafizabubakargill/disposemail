import { NextResponse } from 'next/server';
const { burnAndReadNote } = require('@/lib/notes-db');

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        
        if (!id) {
            return NextResponse.json({ success: false, error: 'Invalid Note ID' }, { status: 400 });
        }

        // Fetch and BURN instantly
        const content = burnAndReadNote(id);

        if (!content) {
            return NextResponse.json({ 
                success: false, 
                error: 'Note not found. It may have already been read and destroyed.' 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            content: content
        });
        
    } catch (error: any) {
        console.error('Secure Note Read Error:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to retrieve note' }, { status: 500 });
    }
}
