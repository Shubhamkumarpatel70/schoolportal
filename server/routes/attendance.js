const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Holiday = require("../models/Holiday");
const Student = require("../models/Student");
const Class = require("../models/Class");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Mark attendance (teacher or admin)
router.post(
  "/mark",
  auth,
  authorize("teacher", "admin"),
  async (req, res) => {
    try {
      const { classId, date, attendance } = req.body; // attendance: [{ studentId, status }]
      const dateKey = new Date(date).toISOString().slice(0, 10);
      const startOfDay = new Date(`${dateKey}T00:00:00.000Z`);
      const endOfDay = new Date(`${dateKey}T23:59:59.999Z`);
      const holiday = await Holiday.findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
      });
      // "Sunday Attendance Enabled" is an override created by Admin to allow
      // marking attendance on Sundays. The backend must ignore it here.
      if (holiday && holiday.title !== "Sunday Attendance Enabled") {
        return res.status(400).json({
          error: `Cannot mark attendance on holiday: ${holiday.title}`,
        });
      }
      const markedBy = req.user._id;
      const records = await Promise.all(
        attendance.map(async ({ studentId, status }) => {
          return Attendance.findOneAndUpdate(
            { student: studentId, date },
            { student: studentId, class: classId, date, status, markedBy },
            { upsert: true, new: true },
          );
        }),
      );
      res.json({ success: true, records });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Get attendance for class and month (admin/teacher)
router.get(
  "/class/:classId",
  auth,
  authorize("admin", "teacher"),
  async (req, res) => {
    try {
      const { classId } = req.params;
      const { month, year } = req.query;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      const records = await Attendance.find({
        class: classId,
        date: { $gte: start, $lte: end },
      }).populate("student");
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Get attendance for a student (student dashboard)
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month/year" });
    }

    let studentDoc = null;

    // Accept student ObjectId, user ObjectId, enrollment number, or roll number.
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      studentDoc = await Student.findById(studentId).select("_id userId");
      if (!studentDoc) {
        studentDoc = await Student.findOne({ userId: studentId }).select(
          "_id userId",
        );
      }
    } else {
      studentDoc = await Student.findOne({
        $or: [{ enrollmentNumber: studentId }, { rollNumber: studentId }],
      }).select("_id userId");
    }

    if (!studentDoc) {
      return res.status(404).json({ error: "Student not found" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const records = await Attendance.find({
      student: studentDoc._id,
      date: { $gte: start, $lte: end },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
