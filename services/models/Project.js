const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  tech_stack: [{ type: String }],
  live_url: { type: String },
  github_url: { type: String },
  category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
