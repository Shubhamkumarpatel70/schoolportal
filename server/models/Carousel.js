const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Carousel', carouselSchema);

