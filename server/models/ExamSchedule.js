const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  examName: { type: String, required: true }, // e.g., Unit Test 1, Half Yearly
  className: { type: String, required: true },
  subjects: [{
    subjectName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    maxMarks: { type: Number }
  }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
