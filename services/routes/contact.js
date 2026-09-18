const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route for submitting contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const saved = await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await ContactMessage.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await ContactMessage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
