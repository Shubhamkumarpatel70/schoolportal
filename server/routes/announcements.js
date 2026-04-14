const express = require('express');
const Announcement = require('../models/Announcement');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all active announcements (public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all announcements for admin
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create announcement (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const announcement = new Announcement({
      ...req.body,
      createdBy: req.user._id,
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update announcement (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete announcement (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
