const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');
const { generateLateFines } = require('../utils/autoFineGenerator');

const router = express.Router();

// Get all fees (Admin/Accountant only)
router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check for overdue fees and generate late fines
    await generateLateFines();
    
    const fees = await Fee.find().populate('studentId userId').sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get fees for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if user is the student or admin/accountant
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check for overdue fees and generate late fines
    await generateLateFines();

    const fees = await Fee.find({ studentId: student._id }).populate('studentId').sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get students by class
router.get('/class/:className', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const students = await Student.find({ class: req.params.className }).populate('userId', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create fee (Admin/Accountant only)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId, studentId, amount, feesType, month, installmentNumber, dueDate, remarks } = req.body;
    
    let student;
    if (studentId) {
      student = await Student.findById(studentId);
    } else if (userId) {
      student = await Student.findOne({ userId });
    }
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const fee = new Fee({
      studentId: student._id,
      userId: student.userId,
      amount,
      feesType: feesType || 'monthly',
      month,
      installmentNumber,
      dueDate,
      remarks,
      feeCategory: req.body.feeCategory || 'regular'
    });

    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update fee payment (Student/Admin/Accountant)
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    // Check if user is the student or admin/accountant
    if (req.user.role === 'student' && fee.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMethod = req.body.paymentMethod || 'Online';
    fee.transactionId = req.body.transactionId;

    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update fee (Admin/Accountant only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete fee (Admin/Accountant only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.json({ message: 'Fee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

