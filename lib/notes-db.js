const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./mongoose');

/**
 * Save a new secure note
 */
async function createNote(content) {
  try {
    console.log('🔗 Connecting to DB...');
    await connectDB();
    
    const id = uuidv4();
    const note = new Note({
      id: id,
      content: content
    });
    
    console.log('📝 Attempting to save secure note to MongoDB...');
    await note.save();
    console.log('✅ Secure note saved with ID:', id);
    return id;
  } catch (err) {
    console.error('❌ CRITICAL: Error creating note in DB:', err.message);
    return null;
  }
}

/**
 * Fetch a note and IMMEDIATELY BURN IT
 * This guarantees the note can never be read twice
 */
async function burnAndReadNote(id) {
  try {
    await connectDB();
    // Find the note
    const note = await Note.findOne({ id: id });
    
    if (!note) {
      return null; // Already burned or never existed
    }
    
    // IMMEDIATELY DELETE IT
    await Note.deleteOne({ id: id });
    
    return note.content;
  } catch (err) {
    console.error('Error burning note:', err);
    return null;
  }
}

module.exports = {
  createNote,
  burnAndReadNote
};
