const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  isbn: { type: String, unique: true, sparse: true, index: true },
  category: { type: String },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  location: { type: String }, // Shelf/Row
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
