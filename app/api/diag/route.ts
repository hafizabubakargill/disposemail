import { NextResponse } from 'next/server';
const connectDB = require('@/lib/mongoose');
const redis = require('@/lib/redis');
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    const start = Date.now();
    
    // DB Diagnostics
    let dbStatus = 'unknown';
    let dbPing = 0;
    let dbError = null;

    // Redis Diagnostics
    let redisStatus = 'unknown';
    let redisPing = 0;
    let redisError = null;

    // 1. Check MongoDB
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (db) {
            const admin = db.admin();
            await admin.ping();
            dbStatus = 'connected';
            dbPing = Date.now() - start;
        }
    } catch (err: any) {
        dbStatus = 'error';
        dbError = err.message;
    }

    // 2. Check Redis
    const redisStart = Date.now();
    try {
        if (redis) {
            await redis.ping();
            redisStatus = 'connected';
            redisPing = Date.now() - redisStart;
        } else {
            redisStatus = 'not_configured';
        }
    } catch (err: any) {
        redisStatus = 'error';
        redisError = err.message;
    }

    return NextResponse.json({
        success: dbStatus === 'connected' || redisStatus === 'connected',
        timestamp: new Date().toISOString(),
        mongodb: {
            status: dbStatus,
            ping_ms: dbPing,
            readyState: mongoose.connection.readyState,
            error: dbError
        },
        redis: {
            status: redisStatus,
            ping_ms: redisPing,
            error: redisError
        },
        environment: {
            has_mongo_uri: !!process.env.MONGODB_URI,
            has_redis_url: !!process.env.UPSTASH_REDIS_REST_URL,
            node_env: process.env.NODE_ENV
        }
    });
}
