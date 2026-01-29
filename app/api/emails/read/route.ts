import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const success = db.markEmailAsRead(id);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error marking email read:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
