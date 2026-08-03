import { NextResponse } from 'next/server';
const { registerPushToken } = require('@/lib/push-db');

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address, expoPushToken } = body;

        if (!address || typeof address !== 'string') {
            return NextResponse.json({ success: false, error: 'address is required' }, { status: 400 });
        }
        if (!expoPushToken || typeof expoPushToken !== 'string' || !expoPushToken.startsWith('ExponentPushToken')) {
            return NextResponse.json({ success: false, error: 'A valid Expo push token is required' }, { status: 400 });
        }

        const ok = await registerPushToken(address, expoPushToken);
        if (!ok) {
            return NextResponse.json({ success: false, error: 'Failed to register push token' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Push Register] Error:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
