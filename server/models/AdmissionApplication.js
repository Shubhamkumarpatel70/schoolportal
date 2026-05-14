const mongoose = require('mongoose');

const admissionApplicationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  fathersName: { type: String, required: true },
  mothersName: { type: String, required: true },
  previousSchool: { type: String },
  previousClassPercentage: { type: String },
  passportPhoto: { type: String }, // Base64 or URL
  session: { type: String, required: true }, // e.g., 2024-25
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('AdmissionApplication', admissionApplicationSchema);
