const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
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
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
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

module.exports = mongoose.model('Student', studentSchema);

