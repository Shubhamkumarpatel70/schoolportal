const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['issued', 'returned', 'lost'], default: 'issued', index: true },
  fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('BookIssue', bookIssueSchema);
