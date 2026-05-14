const express = require('express');
const router = express.Router();
const AdmissionApplication = require('../models/AdmissionApplication');
const AdmissionConfig = require('../models/AdmissionConfig');
const { auth, authorize } = require('../middleware/auth');

// PUBLIC: Get Admission Config
router.get('/config', async (req, res) => {
  try {
    let config = await AdmissionConfig.findOne();
    if (!config) {
      config = await AdmissionConfig.create({});
    }
    res.json(config);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// PUBLIC: Submit Application
router.post('/apply', async (req, res) => {
  try {
    const config = await AdmissionConfig.findOne();
    if (!config || !config.isOpen) {
      return res.status(400).json({ message: 'Admissions are currently closed' });
    }
    const application = new AdmissionApplication({
        ...req.body,
        session: config.session
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// ADMIN/RECEPTIONIST: Get all applications
router.get('/applications', auth, authorize('admin', 'receptionist'), async (req, res) => {
  try {
    const apps = await AdmissionApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// ADMIN: Update Config
router.put('/config', auth, authorize('admin'), async (req, res) => {
  try {
    let config = await AdmissionConfig.findOne();
    if (!config) {
      config = new AdmissionConfig(req.body);
    } else {
      Object.assign(config, req.body);
      config.updatedAt = Date.now();
    }
    await config.save();
    res.json(config);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// ADMIN/RECEPTIONIST: Update Application Status
router.put('/applications/:id/status', auth, authorize('admin', 'receptionist'), async (req, res) => {
    try {
      const { status } = req.body;
      const app = await AdmissionApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.json(app);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
