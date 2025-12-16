const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const EnrollmentNumber = require('../models/EnrollmentNumber');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Student register (public) - uses enrollment number and creates/updates student user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, enrollmentNumber, phone, address } = req.body;

    // For students, validate enrollment number
    let enrollment = null;
    if (enrollmentNumber) {
      enrollment = await EnrollmentNumber.findOne({ enrollmentNumber });
      if (!enrollment) {
        return res.status(400).json({ message: 'Invalid enrollment number' });
      }
    }

    // Check if a student already exists with this enrollment number (created by admin/teacher)
    const existingStudent = await Student.findOne({ enrollmentNumber });
    let user = null;

    if (existingStudent) {
      // Student record exists - update the existing user
      user = await User.findById(existingStudent.userId);
      
      if (!user) {
        return res.status(400).json({ message: 'Student record exists but user account not found. Please contact administrator.' });
      }

      // Check if email is already used by another user
      const emailUser = await User.findOne({ email });
      if (emailUser && emailUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already registered to another account' });
      }

      // Update existing user with registration details
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      
      // Only update password if provided and different from default
      if (password && password !== enrollmentNumber) {
        user.password = password;
        user.isDefaultPassword = false;
      }
      
      await user.save();

      // Update enrollment number record
      if (enrollment) {
        enrollment.isUsed = true;
        enrollment.name = name;
        enrollment.usedBy = user._id;
        await enrollment.save();
      }
    } else {
      // No existing student - check if enrollment is already used
      if (enrollment && enrollment.isUsed) {
        return res.status(400).json({ message: 'Enrollment number already used' });
      }

      // Check if user exists with this email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        role: 'student',
        studentId: enrollmentNumber,
        phone,
        address
      });

      await user.save();

      // Link enrollment number to user
      if (enrollment && enrollmentNumber) {
        enrollment.isUsed = true;
        enrollment.name = name;
        enrollment.usedBy = user._id;
        await enrollment.save();
      }
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initial admin registration (public, only allowed if no admin exists yet)
router.post('/register-admin-initial', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Allow only if no admin exists yet
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists. Please contact an existing admin.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, mobileNumber, enrollmentNumber, password } = req.body;

    // Find user by email, mobile number, or enrollment number
    let user;
    if (enrollmentNumber) {
      // Find user by enrollment number (studentId field)
      user = await User.findOne({ studentId: enrollmentNumber, role: 'student' });
    } else if (mobileNumber) {
      user = await User.findOne({ phone: mobileNumber });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Email, mobile number, or enrollment number is required' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Password validation
    let isMatch = false;
    
    if (enrollmentNumber) {
      // For enrollment number login
      if (user.isDefaultPassword) {
        // For default password, check if entered password matches the enrollment number
        // The stored password is the enrollment number, so we check if entered password matches enrollment number
        if (password === enrollmentNumber) {
          // Also verify the stored password matches enrollment number
          isMatch = await user.comparePassword(enrollmentNumber);
        } else {
          isMatch = false;
        }
      } else {
        // User has changed password, check against actual password
        isMatch = await user.comparePassword(password);
      }
    } else {
      // For email or mobile login, always check actual password
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDefaultPassword: user.isDefaultPassword,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

