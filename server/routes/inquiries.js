const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { auth, authorize } = require('../middleware/auth');

// Add Inquiry
router.post('/', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) { res.status(400).json({ message: 'Error adding inquiry' }); }
});

// Get All Inquiries
router.get('/', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) { res.status(500).json({ message: 'Error fetching inquiries' }); }
});

// Update Inquiry Status
router.put('/:id', auth, authorize('receptionist', 'admin'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inquiry);
  } catch (error) { res.status(400).json({ message: 'Error updating inquiry' }); }
});

module.exports = router;
