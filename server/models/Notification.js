const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'academic', 'event', 'fee'],
    default: 'general'
  },
  targetRole: {
    type: String,
    enum: ['all', 'admin', 'student', 'teacher', 'accountant']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

