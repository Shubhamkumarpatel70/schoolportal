const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { auth, authorize } = require('../middleware/auth');

// Create Assignment (Teacher only)
router.post('/', auth, authorize('teacher'), async (req, res) => {
  try {
    const assignment = new Assignment({
      teacher: req.user.id,
      ...req.body
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) { res.status(400).json({ message: 'Error creating assignment' }); }
});

// Get Assignments by Class (For Students/Teachers)
router.get('/class/:className', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ className: req.params.className }).populate('teacher', 'name').sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) { res.status(500).json({ message: 'Error fetching assignments' }); }
});

// Delete Assignment
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (error) { res.status(500).json({ message: 'Error deleting assignment' }); }
});

module.exports = router;
