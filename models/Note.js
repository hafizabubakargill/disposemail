const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 86400 // Hard limit: Auto-delete after 24 hours if not read
  }
}, { timestamps: true });

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);
