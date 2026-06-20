const express = require('express');
const Project = require('../models/Project');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const projects = await Project.countDocuments();
    const services = await Service.countDocuments();
    const team = await TeamMember.countDocuments();
    const testimonials = await Testimonial.countDocuments();
    const messages = await ContactMessage.countDocuments();

    res.json({
      projects,
      services,
      team,
      testimonials,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
