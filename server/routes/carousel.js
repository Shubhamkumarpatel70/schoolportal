const express = require('express');
const Carousel = require('../models/Carousel');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all active carousel images
router.get('/', async (req, res) => {
  try {
    const carousels = await Carousel.find({ isActive: true }).sort({ order: 1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all carousel images (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const carousels = await Carousel.find().sort({ order: 1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create carousel image (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const carousel = new Carousel(req.body);
    await carousel.save();
    res.status(201).json(carousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update carousel (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const carousel = await Carousel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }
    res.json(carousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete carousel (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const carousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }
    res.json({ message: 'Carousel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

