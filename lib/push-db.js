const PushToken = require('../models/PushToken');
const connectDB = require('./mongoose');

/**
 * Register (or refresh) a device's Expo push token against a temp address.
 */
async function registerPushToken(address, expoPushToken) {
  try {
    await connectDB();
    const normalized = address.toLowerCase();
    await PushToken.findOneAndUpdate(
      { address: normalized, expoPushToken },
      { address: normalized, expoPushToken, updatedAt: new Date() },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('❌ Error registering push token:', err.message);
    return false;
  }
}

/**
 * All Expo push tokens currently registered for an address.
 */
async function getPushTokensForAddress(address) {
  try {
    await connectDB();
    const rows = await PushToken.find({ address: address.toLowerCase() });
    return rows.map((r) => r.expoPushToken);
  } catch (err) {
    console.error('❌ Error reading push tokens:', err.message);
    return [];
  }
}

module.exports = {
  registerPushToken,
  getPushTokensForAddress,
};
