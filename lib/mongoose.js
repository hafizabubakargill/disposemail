const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable is missing!');
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️ Server will start but database features will be disabled.');
  }
}


const finalUri = MONGODB_URI || 'mongodb://localhost:27017/disposemail';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless function invocations in production.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast if DB down
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4
    };

    console.log('🔗 Establishing NEW MongoDB connection...');
    cached.promise = mongoose.connect(finalUri, opts).then((mongoose) => {
      console.log('🚀 MongoDB Connected Successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e.message);
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
