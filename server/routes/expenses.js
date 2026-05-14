const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth, authorize } = require('../middleware/auth');

// Add Expense
router.post('/', auth, authorize('accountant', 'admin'), async (req, res) => {
  try {
    const expense = new Expense({
      addedBy: req.user.id,
      ...req.body
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) { res.status(400).json({ message: 'Error adding expense' }); }
});

// Get All Expenses
router.get('/', auth, authorize('accountant', 'admin'), async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }).populate('addedBy', 'name');
    res.json(expenses);
  } catch (error) { res.status(500).json({ message: 'Error fetching expenses' }); }
});

// Delete Expense
router.delete('/:id', auth, authorize('accountant', 'admin'), async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) { res.status(500).json({ message: 'Error deleting expense' }); }
});

module.exports = router;
