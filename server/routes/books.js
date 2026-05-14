const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');

// Add Book
router.post('/', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) { res.status(400).json({ message: 'Error adding book' }); }
});

// Get All Books
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.json(books);
  } catch (error) { res.status(500).json({ message: 'Error fetching books' }); }
});

// Update Book
router.put('/:id', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (error) { res.status(400).json({ message: 'Error updating book' }); }
});

// Delete Book
router.delete('/:id', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (error) { res.status(500).json({ message: 'Error deleting book' }); }
});

module.exports = router;
