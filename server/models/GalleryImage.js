const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  galleryName: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

