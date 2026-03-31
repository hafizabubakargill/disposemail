const redis = require('./redis');
const { v4: uuidv4 } = require('uuid');

/**
 * Save a new secure note to Redis with 24-hour expiry
 */
async function createNote(content) {
  try {
    if (!redis) {
      console.error('❌ Redis is NOT configured. Cannot create secure note.');
      return null;
    }

    const id = uuidv4();
    const key = `note:${id}`;
    
    console.log('📝 Saving secure note to Redis...');
    await redis.set(key, content, { ex: 86400 }); // Expire in 24 hours
    
    console.log('✅ Secure note saved with ID:', id);
    return id;
  } catch (err) {
    console.error('❌ Redis Error creating note:', err.message);
    return null;
  }
}

/**
 * Fetch a note and IMMEDIATELY BURN IT using atomic GETDEL
 */
async function burnAndReadNote(id) {
  try {
    if (!redis) return null;
    const key = `note:${id}`;
    
    // getdel returns the value and deletes the key in one atomic step
    const content = await redis.getdel(key);
    
    if (!content) {
      return null; // Already burned or never existed
    }
    
    return content;
  } catch (err) {
    console.error('❌ Redis Error burning note:', err.message);
    return null;
  }
}

module.exports = {
  createNote,
  burnAndReadNote
};
