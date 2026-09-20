const { query } = require('../db');

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  const match = url.match(/\/api\/images\/\d+/);
  if (match) return match[0];
  return url;
}

function formatTeamMember(row) {
  if (!row) return null;

  let skills = row.skills;
  if (typeof skills === 'string') {
    try {
      skills = JSON.parse(skills);
    } catch {
      skills = [];
    }
  } else if (!Array.isArray(skills)) {
    skills = skills ? [skills] : [];
  }

  let socialLinks = row.social_links;
  if (typeof socialLinks === 'string') {
    try {
      socialLinks = JSON.parse(socialLinks);
    } catch {
      socialLinks = {};
    }
  } else if (!socialLinks || typeof socialLinks !== 'object') {
    socialLinks = {};
  }

  return {
    id: row.id,
    _id: row.id.toString(),
    name: row.name,
    role: row.role || '',
    bio: row.bio || '',
    photo: normalizeImageUrl(row.photo),
    skills,
    social_links: socialLinks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class TeamMember {
  static async findAll() {
    const [rows] = await query('SELECT * FROM team_members ORDER BY created_at DESC');
    return rows.map(formatTeamMember);
  }

  static async findById(id) {
    const [rows] = await query('SELECT * FROM team_members WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatTeamMember(rows[0]);
  }

  static async create(data) {
    const {
      name,
      role = '',
      bio = '',
      photo = '',
      skills = [],
      social_links = {},
    } = data;

    const skillsJson = JSON.stringify(Array.isArray(skills) ? skills : []);
    const socialLinksJson = JSON.stringify(social_links && typeof social_links === 'object' ? social_links : {});

    const [result] = await query(
      `INSERT INTO team_members (name, role, bio, photo, skills, social_links)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, role, bio, photo, skillsJson, socialLinksJson]
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const name = data.name !== undefined ? data.name : existing.name;
    const role = data.role !== undefined ? data.role : existing.role;
    const bio = data.bio !== undefined ? data.bio : existing.bio;
    const photo = data.photo !== undefined ? data.photo : existing.photo;
    const skills = data.skills !== undefined ? data.skills : existing.skills;
    const social_links = data.social_links !== undefined ? data.social_links : existing.social_links;

    const skillsJson = JSON.stringify(Array.isArray(skills) ? skills : []);
    const socialLinksJson = JSON.stringify(social_links && typeof social_links === 'object' ? social_links : {});

    await query(
      `UPDATE team_members
       SET name = ?, role = ?, bio = ?, photo = ?, skills = ?, social_links = ?
       WHERE id = ?`,
      [name, role, bio, photo, skillsJson, socialLinksJson, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM team_members WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM team_members');
    return rows[0].count;
  }

  static async deleteMany() {
    await query('DELETE FROM team_members');
  }
}

module.exports = TeamMember;
