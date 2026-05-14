const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const { auth, authorize } = require('../middleware/auth');

// Apply for Leave
router.post('/apply', auth, async (req, res) => {
  try {
    const leave = new Leave({
      user: req.user.id,
      role: req.user.role,
      ...req.body
    });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) { res.status(400).json({ message: 'Error applying for leave' }); }
});

// Get My Leaves
router.get('/my', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) { res.status(500).json({ message: 'Error fetching leaves' }); }
});

// Admin/Teacher: Get Pending Leaves (Teachers see students, Admin sees everyone)
router.get('/pending', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { status: 'pending' };
    if (req.user.role === 'teacher') query.role = 'student';
    const leaves = await Leave.find(query).populate('user', 'name').sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) { res.status(500).json({ message: 'Error fetching leaves' }); }
});

// Admin only: Get All Leaves
router.get('/all', auth, authorize('admin'), async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ appliedOn: -1 }).populate('user', 'name');
    res.json(leaves);
  } catch (error) { res.status(500).json({ message: 'Error fetching all leaves' }); }
});

// Update Leave Status
router.put('/:id/status', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(leave);
  } catch (error) { res.status(400).json({ message: 'Error updating leave status' }); }
});

module.exports = router;
