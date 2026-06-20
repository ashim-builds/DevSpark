const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route for submitting contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contactMessage = new ContactMessage({ name, email, message });
    const saved = await contactMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
