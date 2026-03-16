const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  address: { 
    type: String, 
    required: true, 
    index: true 
  },
  from_address: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    default: '(No Subject)' 
  },
  text: { 
    type: String, 
    default: '' 
  },
  html: { 
    type: String, 
    default: '' 
  },
  raw: { 
    type: String, 
    default: '' 
  },
  attachments: { 
    type: Array, 
    default: [] 
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
  received_at: { 
    type: Date, 
    default: Date.now,
    expires: 3600 // Auto-delete after 1 hour (TTL index)
  }
}, { timestamps: true });

// Ensure address is lowercase for searching
EmailSchema.pre('save', function(next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

module.exports = mongoose.models.Email || mongoose.model('Email', EmailSchema);
