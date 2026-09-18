const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/settings/available-for-hire  (public — navbar reads this)
router.get('/available-for-hire', async (req, res) => {
  try {
    const val = await SiteSettings.get('available_for_hire');
    // default to true if not set yet
    res.json({ available: val === null ? true : val === 'true' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings/available-for-hire  (admin only)
router.put('/available-for-hire', auth, async (req, res) => {
  try {
    const { available } = req.body;
    if (typeof available !== 'boolean') {
      return res.status(400).json({ message: '`available` must be a boolean' });
    }
    await SiteSettings.set('available_for_hire', String(available));
    res.json({ available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
