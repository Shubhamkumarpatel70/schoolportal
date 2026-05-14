const express = require('express');
const ExamSchedule = require('../models/ExamSchedule');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all exam schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await ExamSchedule.find().sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an exam schedule (Admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const schedule = new ExamSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an exam schedule (Admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const schedule = await ExamSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an exam schedule (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await ExamSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
