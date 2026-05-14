const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { auth, authorize } = require('../middleware/auth');

// Add Visitor Log
router.post('/', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    res.status(201).json(visitor);
  } catch (error) { res.status(400).json({ message: 'Error adding visitor' }); }
});

// Get Visitor Logs
router.get('/', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ date: -1 });
    res.json(visitors);
  } catch (error) { res.status(500).json({ message: 'Error fetching visitors' }); }
});

// Mark Exit
router.put('/:id/exit', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { outTime: req.body.outTime }, { new: true });
    res.json(visitor);
  } catch (error) { res.status(400).json({ message: 'Error updating exit time' }); }
});

module.exports = router;
