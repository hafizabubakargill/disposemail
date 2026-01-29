import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    try {
        const emails = db.getEmailsForAddress(address.toLowerCase());
        return NextResponse.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
