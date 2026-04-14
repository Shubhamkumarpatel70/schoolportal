const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
  logoutAt: {
    type: Date,
    default: null,
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
