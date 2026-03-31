import { NextResponse } from 'next/server';
const connectDB = require('@/lib/mongoose');
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    const start = Date.now();
    let status = 'unknown';
    let ping = 0;
    let error = null;

    try {
        console.log('[DIAG] Checking database connectivity...');
        await connectDB();
        
        const db = mongoose.connection.db;
        if (db) {
            const admin = db.admin();
            const pingResult = await admin.ping();
            status = 'connected';
            ping = Date.now() - start;
        } else {
            status = 'disconnected';
        }

    } catch (err: any) {
        status = 'error';
        error = err.message;
        console.error('[DIAG] Database health check failed:', err.message);
    }

    return NextResponse.json({
        success: status === 'connected',
        timestamp: new Date().toISOString(),
        database: {
            status,
            ping_ms: ping,
            readyState: mongoose.connection.readyState,
            error
        },
        environment: {
            has_uri: !!process.env.MONGODB_URI,
            node_env: process.env.NODE_ENV
        }
    });
}
