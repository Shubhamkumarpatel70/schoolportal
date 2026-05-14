const mongoose = require('mongoose');

const admissionConfigSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: false },
  displayType: { type: String, enum: ['navbar', 'popup'], default: 'navbar' },
  session: { type: String, default: '2024-25' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdmissionConfig', admissionConfigSchema);
