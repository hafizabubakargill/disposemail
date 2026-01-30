import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        environment: 'nextjs-app-router',
        msg: 'If you see this but NOT /api/health-check, your server is NOT running server.js'
    });
}
