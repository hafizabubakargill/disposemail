const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./mongoose');

/**
 * Save a new secure note
 */
async function createNote(content) {
  try {
    await connectDB();
    
    const id = uuidv4();
    const note = new Note({
      id: id,
      content: content
    });
    
    await note.save();
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
    // Atomic find-and-delete: if two requests race, only one gets the note.
    const note = await Note.findOneAndDelete({ id: id });
    return note ? note.content : null; // null = already burned or never existed
  } catch (err) {
    console.error('Error burning note:', err);
    return null;
  }
}

module.exports = {
  createNote,
  burnAndReadNote
};
