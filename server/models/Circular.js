const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pdfData: {
    type: String, // Store Base64 for now as requested for simplicity
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Circular', circularSchema);
