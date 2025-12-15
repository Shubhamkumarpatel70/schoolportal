const mongoose = require('mongoose');

const classTeacherSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one teacher per class-section combination
classTeacherSchema.index({ className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('ClassTeacher', classTeacherSchema);

