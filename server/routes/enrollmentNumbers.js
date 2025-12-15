const express = require('express');
const EnrollmentNumber = require('../models/EnrollmentNumber');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all enrollment numbers (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const enrollmentNumbers = await EnrollmentNumber.find().populate('usedBy', 'name email').sort({ createdAt: -1 });
    res.json(enrollmentNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check enrollment number (for registration)
router.get('/check/:enrollmentNumber', async (req, res) => {
  try {
    const enrollment = await EnrollmentNumber.findOne({ enrollmentNumber: req.params.enrollmentNumber });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment number not found' });
    }
    if (enrollment.isUsed) {
      return res.status(400).json({ message: 'Enrollment number already used' });
    }
    res.json({ valid: true, name: enrollment.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrollment number details (for admin/teacher - returns name even if used)
router.get('/details/:enrollmentNumber', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const enrollment = await EnrollmentNumber.findOne({ enrollmentNumber: req.params.enrollmentNumber })
      .populate('usedBy', 'name email');
    if (!enrollment) {
      return res.json(null);
    }
    res.json({
      enrollmentNumber: enrollment.enrollmentNumber,
      name: enrollment.name,
      isUsed: enrollment.isUsed,
      usedBy: enrollment.usedBy ? {
        id: enrollment.usedBy._id,
        name: enrollment.usedBy.name,
        email: enrollment.usedBy.email
      } : null,
      createdAt: enrollment.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create enrollment number (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { enrollmentNumber, name } = req.body;
    
    // Check if enrollment number already exists
    const existing = await EnrollmentNumber.findOne({ enrollmentNumber });
    if (existing) {
      return res.status(400).json({ message: 'Enrollment number already exists' });
    }
    
    const enrollment = new EnrollmentNumber({ enrollmentNumber, name });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enrollment number (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const enrollment = await EnrollmentNumber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment number not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete enrollment number (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const enrollment = await EnrollmentNumber.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment number not found' });
    }
    res.json({ message: 'Enrollment number deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

