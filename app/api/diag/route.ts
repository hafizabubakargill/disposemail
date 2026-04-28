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
        
        // Use a timeout for the DB check to prevent the diagnostic endpoint from hanging
        const dbCheck = (async () => {
            await connectDB();
            const db = mongoose.connection.db;
            if (db) {
                const admin = db.admin();
                await admin.ping();
                return 'connected';
            }
            return 'disconnected';
        })();

        const timeout = new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Database check timed out')), 5000)
        );

        status = await Promise.race([dbCheck, timeout]);
        ping = Date.now() - start;

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
