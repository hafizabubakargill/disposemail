const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ensure the data directory exists
const dbPath = path.join(process.cwd(), 'notes.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

// Initialize database
db.defaults({ notes: [] }).write();

/**
 * Save a new secure note
 */
function createNote(content) {
  db.read();
  
  const id = uuidv4();
  const note = {
    id: id,
    content: content,
    created_at: Date.now()
  };
  
  db.get('notes')
    .push(note)
    .write();
    
  return id;
}

/**
 * Fetch a note and IMMEDIATELY BURN IT
 * This guarantees the note can never be read twice
 */
function burnAndReadNote(id) {
  db.read(); 
  
  // Find the note
  const note = db.get('notes').find({ id: id }).value();
  
  if (!note) {
    return null; // Already burned or never existed
  }
  
  // IMMEDIATELY DELETE IT
  db.get('notes')
    .remove({ id: id })
    .write();
    
  return note.content;
}

module.exports = {
  createNote,
  burnAndReadNote
};
