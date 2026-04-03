const express = require("express");
const Holiday = require("../models/Holiday");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get holidays (optionally filter by month/year)
router.get("/", auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};

    if (month && year) {
      const parsedMonth = Number(month);
      const parsedYear = Number(year);
      if (
        Number.isNaN(parsedMonth) ||
        Number.isNaN(parsedYear) ||
        parsedMonth < 1 ||
        parsedMonth > 12
      ) {
        return res.status(400).json({ message: "Invalid month/year" });
      }

      const start = new Date(parsedYear, parsedMonth - 1, 1);
      const end = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const holidays = await Holiday.find(query).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create holiday (Admin only)
router.post("/", auth, authorize("admin"), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const dateKey = new Date(date).toISOString().slice(0, 10);
    const startOfDay = new Date(`${dateKey}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateKey}T23:59:59.999Z`);

    const existing = await Holiday.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Holiday already exists for this date" });
    }

    const holiday = await Holiday.create({
      title,
      date: new Date(dateKey),
      description: description || "",
      createdBy: req.user?._id,
    });
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete holiday (Admin only)
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const deleted = await Holiday.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.json({ message: "Holiday deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
