const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  client_name: { type: String, required: true },
  company: { type: String },
  message: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  photo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
