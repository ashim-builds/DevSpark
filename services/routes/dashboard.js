const express = require('express');
const Project = require('../models/Project');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const PerformanceMetric = require('../models/PerformanceMetric');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /public-stats (Unauthenticated - for homepage, about, and landing stats)
router.get('/public-stats', async (req, res) => {
  try {
    const [projects, services, team, testimonials, performanceMetrics] = await Promise.all([
      Project.count(),
      Service.count(),
      TeamMember.count(),
      Testimonial.count(),
      PerformanceMetric.getAll(),
    ]);

    const metricsMap = {};
    for (const m of performanceMetrics) {
      metricsMap[m.key] = m.value;
    }

    const calculated = await PerformanceMetric.getCalculatedFromDB();

    res.json({
      projects: Number(projects),
      services: Number(services),
      team: Number(team),
      testimonials: Number(testimonials),
      satisfactionRate: Number(testimonials) > 0 ? calculated.client_satisfaction : 0,
      completionRate: Number(projects) > 0 ? calculated.project_completion_rate : 0,
      onTimeDelivery: Number(projects) > 0 ? calculated.on_time_delivery : 0,
      responseRate: calculated.response_rate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const [projects, services, team, testimonials, messages, performance] = await Promise.all([
      Project.count(),
      Service.count(),
      TeamMember.count(),
      Testimonial.count(),
      ContactMessage.count(),
      PerformanceMetric.getAll(),
    ]);

    res.json({
      projects: Number(projects),
      services: Number(services),
      team: Number(team),
      testimonials: Number(testimonials),
      messages: Number(messages),
      performance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET performance metrics and auto-calculated recommendations from DB
router.get('/performance', auth, async (req, res) => {
  try {
    const [metrics, autoCalculated] = await Promise.all([
      PerformanceMetric.getAll(),
      PerformanceMetric.getCalculatedFromDB(),
    ]);
    res.json({ metrics, autoCalculated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update performance metrics (Admin only)
router.put('/performance', auth, async (req, res) => {
  try {
    const { metrics } = req.body;
    if (!metrics) {
      return res.status(400).json({ message: 'Metrics payload is required' });
    }
    const updated = await PerformanceMetric.updateMetrics(metrics);
    res.json({ message: 'Performance metrics updated successfully', metrics: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
