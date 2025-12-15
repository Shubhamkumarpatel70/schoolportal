const express = require('express');
const Class = require('../models/Class');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().sort({ className: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create class (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classData = new Class(req.body);
    await classData.save();
    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

