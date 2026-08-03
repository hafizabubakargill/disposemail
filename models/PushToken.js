const mongoose = require('mongoose');

const PushTokenSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: true,
  },
  expoPushToken: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Tokens die with the inbox they're registered for (matches Email's TTL)
  },
}, { timestamps: true });

// One token per (address, expoPushToken) pair — re-registering the same device
// for the same address just refreshes updatedAt instead of duplicating rows.
PushTokenSchema.index({ address: 1, expoPushToken: 1 }, { unique: true });

PushTokenSchema.pre('save', function (next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

module.exports = mongoose.models.PushToken || mongoose.model('PushToken', PushTokenSchema);
