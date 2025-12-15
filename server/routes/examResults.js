const express = require('express');
const ExamResult = require('../models/ExamResult');
const Student = require('../models/Student');
const ClassTeacher = require('../models/ClassTeacher');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get exam results by class (Public or Teacher/Admin)
router.get('/class/:className', async (req, res) => {
  try {
    const { className } = req.params;
    const results = await ExamResult.find({ className })
      .populate('studentId', 'studentName rollNumber enrollmentNumber')
      .populate('addedBy', 'name')
      .sort({ rollNumber: 1, createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam results for a student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const results = await ExamResult.find({ studentId: req.params.studentId })
      .populate('addedBy', 'name')
      .sort({ examDate: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam results (Teacher for their class or Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { results, className, examType, examDate, remarks } = req.body;
    
    // Check if teacher is trying to add results
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== className) {
        return res.status(403).json({ message: 'You can only add results for your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate results array
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: 'Results array is required' });
    }

    // Create exam results
    const examResults = [];
    for (const result of results) {
      const { studentId, rollNumber, studentName, examPercent } = result;
      
      if (!studentId || !rollNumber || !studentName || examPercent === undefined) {
        continue; // Skip invalid entries
      }

      // Get student to get userId
      const student = await Student.findById(studentId);
      if (!student) {
        continue; // Skip if student not found
      }

      const examResult = new ExamResult({
        studentId,
        userId: student.userId, // Get userId from student
        className,
        rollNumber,
        studentName,
        examPercent: parseFloat(examPercent),
        examType: examType || 'regular',
        examDate: examDate ? new Date(examDate) : new Date(),
        addedBy: req.user._id,
        remarks: remarks || ''
      });

      await examResult.save();
      examResults.push(examResult);
    }

    res.status(201).json({ message: 'Exam results added successfully', results: examResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update exam result (Teacher for their class or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const examResult = await ExamResult.findById(req.params.id);
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    // Check if teacher is trying to update result
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== examResult.className) {
        return res.status(403).json({ message: 'You can only update results for your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedResult = await ExamResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete exam result (Teacher for their class or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const examResult = await ExamResult.findById(req.params.id);
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    // Check if teacher is trying to delete result
    if (req.user.role === 'teacher') {
      const classTeacher = await ClassTeacher.findOne({ teacherId: req.user._id });
      if (!classTeacher || classTeacher.className !== examResult.className) {
        return res.status(403).json({ message: 'You can only delete results for your assigned class' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ExamResult.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam result deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

