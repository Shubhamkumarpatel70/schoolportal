const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: true,
    index: true
  },
  fathersName: {
    type: String,
    required: true
  },
  mothersName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true,
    index: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentType: {
    type: String,
    enum: ['dayScholar', 'hosteler'],
    default: 'dayScholar'
  },
  busRoute: {
    type: String,
    default: ''
  },
  transportOpted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.index({ class: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);

