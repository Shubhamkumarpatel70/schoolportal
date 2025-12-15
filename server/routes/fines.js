const express = require('express');
const Fine = require('../models/Fine');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all fines (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const fines = await Fine.find().populate('studentId', 'studentName class rollNumber').sort({ createdAt: -1 });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get fines by student ID
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check access: student can only see their own fines, admin/accountant can see all
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const fines = await Fine.find({ studentId: student._id }).populate('studentId').sort({ createdAt: -1 });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create fine (Admin or Accountant only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'accountant') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { studentId, amount, reason, dueDate, remarks, fineType } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const fine = new Fine({
      studentId,
      userId: student.userId,
      amount,
      reason,
      fineType: fineType || 'other',
      dueDate,
      remarks
    });
    
    await fine.save();
    const populated = await Fine.findById(fine._id).populate('studentId', 'studentName class rollNumber');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update fine (Admin or Accountant only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'accountant') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const fine = await Fine.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('studentId', 'studentName class rollNumber');
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    res.json(fine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pay fine
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const fine = await Fine.findByIdAndUpdate(
      req.params.id,
      {
        status: 'paid',
        paidDate: new Date(),
        paymentMethod,
        transactionId
      },
      { new: true }
    ).populate('studentId', 'studentName class rollNumber');
    
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    res.json(fine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete fine (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const fine = await Fine.findByIdAndDelete(req.params.id);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    res.json({ message: 'Fine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

