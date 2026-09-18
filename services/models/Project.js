const { query } = require('../db');

function formatProject(row) {
  if (!row) return null;
  let techStack = row.tech_stack;
  if (typeof techStack === 'string') {
    try {
      techStack = JSON.parse(techStack);
    } catch {
      techStack = [];
    }
  } else if (!Array.isArray(techStack)) {
    techStack = techStack ? [techStack] : [];
  }

  return {
    id: row.id,
    _id: row.id.toString(),
    title: row.title,
    description: row.description || '',
    image: row.image || '',
    tech_stack: techStack,
    live_url: row.live_url || '',
    github_url: row.github_url || '',
    category: row.category || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class Project {
  static async findAll() {
    const [rows] = await query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows.map(formatProject);
  }

  static async findById(id) {
    const [rows] = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatProject(rows[0]);
  }

  static async create(data) {
    const {
      title,
      description = '',
      image = '',
      tech_stack = [],
      live_url = '',
      github_url = '',
      category = '',
    } = data;

    const techStackJson = JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []);

    const [result] = await query(
      `INSERT INTO projects (title, description, image, tech_stack, live_url, github_url, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, image, techStackJson, live_url, github_url, category]
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const title = data.title !== undefined ? data.title : existing.title;
    const description = data.description !== undefined ? data.description : existing.description;
    const image = data.image !== undefined ? data.image : existing.image;
    const tech_stack = data.tech_stack !== undefined ? data.tech_stack : existing.tech_stack;
    const live_url = data.live_url !== undefined ? data.live_url : existing.live_url;
    const github_url = data.github_url !== undefined ? data.github_url : existing.github_url;
    const category = data.category !== undefined ? data.category : existing.category;

    const techStackJson = JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []);

    await query(
      `UPDATE projects
       SET title = ?, description = ?, image = ?, tech_stack = ?, live_url = ?, github_url = ?, category = ?
       WHERE id = ?`,
      [title, description, image, techStackJson, live_url, github_url, category, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM projects');
    return rows[0].count;
  }

  static async deleteMany() {
    await query('DELETE FROM projects');
  }
}

module.exports = Project;
