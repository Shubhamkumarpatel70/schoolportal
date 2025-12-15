const express = require('express');
const ClassTeacher = require('../models/ClassTeacher');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all class teachers (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classTeachers = await ClassTeacher.find().populate('teacherId', 'name email');
    res.json(classTeachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get class teacher by teacher ID
router.get('/teacher/:teacherId', auth, async (req, res) => {
  try {
    const classTeacher = await ClassTeacher.findOne({ teacherId: req.params.teacherId });
    if (!classTeacher) {
      return res.status(404).json({ message: 'Class teacher not found' });
    }
    res.json(classTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get class teacher by class
router.get('/class/:className', auth, async (req, res) => {
  try {
    const classTeacher = await ClassTeacher.findOne({ className: req.params.className }).populate('teacherId', 'name email phone');
    if (!classTeacher) {
      return res.status(404).json({ message: 'Class teacher not found' });
    }
    res.json(classTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create class teacher (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { teacherId, className, section } = req.body;
    
    // Check if class teacher already exists for this class-section
    const existing = await ClassTeacher.findOne({ className, section: section || '' });
    if (existing) {
      return res.status(400).json({ message: 'Class teacher already assigned for this class' });
    }
    
    const classTeacher = new ClassTeacher({ teacherId, className, section: section || '' });
    await classTeacher.save();
    const populated = await ClassTeacher.findById(classTeacher._id).populate('teacherId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class teacher (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classTeacher = await ClassTeacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('teacherId', 'name email');
    if (!classTeacher) {
      return res.status(404).json({ message: 'Class teacher not found' });
    }
    res.json(classTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class teacher (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const classTeacher = await ClassTeacher.findByIdAndDelete(req.params.id);
    if (!classTeacher) {
      return res.status(404).json({ message: 'Class teacher not found' });
    }
    res.json({ message: 'Class teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

