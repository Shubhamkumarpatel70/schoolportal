const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get images by gallery name
router.get('/gallery/:name', async (req, res) => {
  try {
    const images = await GalleryImage.find({ galleryName: req.params.name }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gallery image (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const image = new GalleryImage(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update gallery image (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete gallery image (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

