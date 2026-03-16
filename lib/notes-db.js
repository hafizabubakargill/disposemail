const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');

/**
 * Save a new secure note
 */
async function createNote(content) {
  try {
    const id = uuidv4();
    const note = new Note({
      id: id,
      content: content
    });
    
    await note.save();
    return id;
  } catch (err) {
    console.error('Error creating note:', err);
    return null;
  }
}

/**
 * Fetch a note and IMMEDIATELY BURN IT
 * This guarantees the note can never be read twice
 */
async function burnAndReadNote(id) {
  try {
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
