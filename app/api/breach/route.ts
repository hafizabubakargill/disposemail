import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }

    try {
        // Fetch from XposedOrNot (Free, No API Key, limits to 1 req/sec but we are acting as a proxy)
        const res = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DisposeMail/1.0; +https://disposemail.xyz)',
                'Accept': 'application/json'
            }
        });

        if (res.status === 404) {
            // XposedOrNot returns 404 if the email is clean (no breaches found)
            return NextResponse.json({
                success: true,
                safe: true,
                breaches: []
            });
        }

        if (!res.ok) {
            // Handle rate limits or provider downtime
            console.error(`XposedOrNot failed with status ${res.status}: ${res.statusText}`);
            throw new Error(`Upstream provider error (${res.status})`);
        }

        const data = await res.json();
        
        let breaches = [];
        if (data && data.breaches && Array.isArray(data.breaches[0])) {
            // XposedOrNot returns an array of arrays representing breach names
            breaches = data.breaches[0];
        }

        return NextResponse.json({
            success: true,
            safe: breaches.length === 0,
            breaches: breaches
        });

    } catch (error: any) {
        console.error('Data Breach Proxy error:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to verify email against breach database. Please try again later.' }, { status: 500 });
    }
}
