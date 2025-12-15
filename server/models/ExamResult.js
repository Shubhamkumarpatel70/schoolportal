const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  className: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  examPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  examType: {
    type: String,
    default: 'regular' // regular, mid-term, final, etc.
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to prevent duplicate results for same student and exam
examResultSchema.index({ studentId: 1, examType: 1, examDate: 1 }, { unique: false });

module.exports = mongoose.model('ExamResult', examResultSchema);

