const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer with memory storage (up to 15MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Only accept image mime types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Single file upload middleware accepting 'image' or 'file' field
const uploadMiddleware = (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    const file = req.files?.image?.[0] || req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    req.file = file;
    next();
  });
};

// Upload image to MySQL (Admin only)
router.post('/upload', auth, uploadMiddleware, async (req, res) => {
  try {
    const saved = await Image.create({
      filename: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
    });

    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = `${protocol}://${host}/api/images/${saved.id}`;
    const relativeUrl = `/api/images/${saved.id}`;

    res.status(201).json({
      id: saved.id,
      url: fullUrl,
      path: relativeUrl,
      filename: saved.filename,
      size: saved.size,
      mime_type: saved.mime_type,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve image directly from MySQL BLOB (Public)
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set({
      'Content-Type': image.mime_type || 'image/jpeg',
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31536000, immutable',
    });

    res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete image from MySQL (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Image.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
