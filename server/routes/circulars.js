const express = require('express');
const router = express.Router();
const Circular = require('../models/Circular');
const { auth, authorize } = require('../middleware/auth');

// Get all circulars (Public for logged in users)
router.get('/', auth, async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name');
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching circulars' });
  }
});

// Create circular (Admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { title, pdfData, fileName } = req.body;
    const circular = new Circular({
      title,
      pdfData,
      fileName,
      uploadedBy: req.user.id,
    });
    await circular.save();
    res.status(201).json(circular);
  } catch (error) {
    res.status(400).json({ message: 'Error creating circular' });
  }
});

// Delete circular (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Circular.findByIdAndDelete(req.params.id);
    res.json({ message: 'Circular deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting circular' });
  }
});

module.exports = router;
