const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  bio: { type: String },
  photo: { type: String },
  skills: [{ type: String }],
  social_links: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    dribbble: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
