const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  purpose: { type: String, required: true },
  whomToMeet: { type: String }, // Person or Department
  inTime: { type: String, required: true },
  outTime: { type: String },
  date: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Visitor', visitorSchema);
