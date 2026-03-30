require('dotenv').config({ path: '.env' });
const { createNote, readNote } = require('./lib/notes-db.js');
async function run() {
  const id = await createNote('Hello from tests');
  console.log('Created ID:', id);
  if (id) {
    const note = await readNote(id);
    console.log('Read Note:', note);
  }
  process.exit(0);
}
run();
