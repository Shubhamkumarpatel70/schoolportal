const express = require('express');
const router = express.Router();
const BookIssue = require('../models/BookIssue');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');

// Get My Issued Books (Student)
router.get('/my', auth, async (req, res) => {
  try {
    const issues = await BookIssue.find({ user: req.user._id }).populate('book').sort({ issueDate: -1 });
    res.json(issues);
  } catch (error) { res.status(500).json({ message: 'Error fetching my issues' }); }
});

// Issue Book
router.post('/', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) return res.status(400).json({ message: 'Book not available' });

    const issue = new BookIssue({
      book: bookId,
      user: userId,
      dueDate
    });

    await issue.save();
    book.available -= 1;
    await book.save();

    res.status(201).json(issue);
  } catch (error) { res.status(400).json({ message: 'Error issuing book' }); }
});

// Return Book
router.put('/:id/return', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue || issue.status === 'returned') return res.status(400).json({ message: 'Invalid return' });

    issue.status = 'returned';
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(issue.book);
    book.available += 1;
    await book.save();

    res.json(issue);
  } catch (error) { res.status(400).json({ message: 'Error returning book' }); }
});

// Get All Issues
router.get('/', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const issues = await BookIssue.find().populate('book').populate('user', 'name role').sort({ issueDate: -1 });
    res.json(issues);
  } catch (error) { res.status(500).json({ message: 'Error fetching issues' }); }
});

module.exports = router;
