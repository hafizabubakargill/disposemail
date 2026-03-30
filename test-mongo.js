const { createNote, burnAndReadNote } = require('./lib/notes-db.js');
async function run() {
  const id = await createNote('Hello from tests');
  console.log('Created ID:', id);
  if (id) {
    const note = await burnAndReadNote(id);
    console.log('Read Note:', note);
  } else {
    console.error('Failed to create note.');
  }
  process.exit(0);
}
run();
