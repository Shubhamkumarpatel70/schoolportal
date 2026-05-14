const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String },
  grade: { type: String, required: true, index: true },
  contact: { type: String, required: true },
  email: { type: String },
  source: { type: String }, // Advertisement, Referral, etc.
  status: { type: String, enum: ['new', 'following', 'admitted', 'closed'], default: 'new', index: true },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
