const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const ClassTeacher = require('../models/ClassTeacher');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all students (Admin only) or students by class (Teacher)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin' || req.user.role === 'accountant') {
      const students = await Student.find().populate('userId', 'name email');
      res.json(students);
    } else if (req.user.role === 'teacher') {
      // Get teacher's assigned class
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher) {
        return res.status(403).json({ message: 'No class assigned' });
      }
      const students = await Student.find({ class: classTeacher.className }).populate('userId', 'name email');
      res.json(students);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search students (Admin/Accountant only)
router.get('/search', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const students = await Student.find({
      $or: [
        { studentName: { $regex: q, $options: 'i' } },
        { rollNumber: { $regex: q, $options: 'i' } },
        { enrollmentNumber: { $regex: q, $options: 'i' } },
        { mobileNumber: { $regex: q, $options: 'i' } }
      ]
    }).populate('userId', 'name email').limit(20);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id }).populate('userId', 'name email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student (Admin or Teacher for their assigned class)
router.post('/', auth, async (req, res) => {
  try {
    const { studentName, fathersName, mothersName, address, class: className, rollNumber, enrollmentNumber, mobileNumber, studentType, busRoute, email, transportOpted } = req.body;
    
    // Check if teacher is trying to add student
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== className) {
        return res.status(403).json({ message: 'You can only add students to your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [
        { enrollmentNumber },
        { mobileNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this enrollment number or mobile number already exists' });
    }

    // Check if roll number already exists in the same class
    const existingRollNumber = await Student.findOne({ 
      rollNumber,
      class: className
    });

    if (existingRollNumber) {
      return res.status(400).json({ message: `Roll number ${rollNumber} already exists in class ${className}` });
    }

    // Create user account with default password (enrollment number)
    // Use enrollment number directly as password (minlength is 4, so it should work)
    const user = new User({
      name: studentName,
      email: email || `${enrollmentNumber}@school.com`, // Use provided email or default
      password: enrollmentNumber, // Password is enrollment number (exact match)
      role: 'student',
      phone: mobileNumber,
      studentId: enrollmentNumber,
      isDefaultPassword: true // Mark as default password
    });

    await user.save();

    // Create student record
    const student = new Student({
      userId: user._id,
      studentName,
      fathersName,
      mothersName,
      address,
      class: className,
      rollNumber,
      enrollmentNumber,
      mobileNumber,
      studentType: studentType || 'dayScholar',
      busRoute: busRoute || '',
      transportOpted: transportOpted || false
    });

    await student.save();

    res.status(201).json({ student, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student (Admin or Teacher for their assigned class)
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if teacher is trying to update student
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== student.class) {
        return res.status(403).json({ message: 'You can only update students in your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if roll number is being changed and if it conflicts with another student in the same class
    if (req.body.rollNumber && req.body.rollNumber !== student.rollNumber) {
      const targetClass = req.body.class || student.class;
      const existingRollNumber = await Student.findOne({ 
        rollNumber: req.body.rollNumber,
        class: targetClass,
        _id: { $ne: student._id }
      });

      if (existingRollNumber) {
        return res.status(400).json({ message: `Roll number ${req.body.rollNumber} already exists in class ${targetClass}` });
      }
    }
    
    // Update email if provided
    if (req.body.email) {
      await User.findByIdAndUpdate(student.userId, { email: req.body.email });
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student (Admin or Teacher for their assigned class)
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if teacher is trying to delete student
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== student.class) {
        return res.status(403).json({ message: 'You can only delete students in your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete associated user
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
