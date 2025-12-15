const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4 // Reduced to allow enrollment numbers as default password
  },
  isDefaultPassword: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'teacher', 'accountant'],
    default: 'student'
  },
  studentId: {
    type: String,
    sparse: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  qualification: {
    type: String
  },
  experience: {
    type: String
  },
  specialization: {
    type: String
  },
  otherDetails: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

