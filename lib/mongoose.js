const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disposemail';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(MONGODB_URI);
    console.log('🚀 MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️  Server will continue without DB. Retrying in 10 seconds...');
    // Retry after 10 seconds instead of crashing the whole server
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
