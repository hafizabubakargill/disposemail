const { Redis } = require('@upstash/redis');

if (!process.env.UPSTASH_REDIS_REST_URL) {
  // Graceful fallback for local development or missing environment variables
  console.warn('⚠️  UPSTASH_REDIS_REST_URL is not defined. Redis is currently disabled.');
}

/**
 * Singleton Redis client for Upstash.
 * Uses HTTP/REST to avoid TCP connection issues in serverless environments.
 */
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

module.exports = redis;
