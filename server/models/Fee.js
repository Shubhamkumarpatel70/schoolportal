const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  feesType: {
    type: String,
    enum: ['monthly', 'installment', 'annual'],
    default: 'monthly'
  },
  feeCategory: {
    type: String,
    enum: ['regular', 'transport', 'fine'],
    default: 'regular'
  },
  month: {
    type: String
  },
  installmentNumber: {
    type: Number
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  transactionId: {
    type: String
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fee', feeSchema);

