const { query } = require('../db');

function formatService(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    title: row.title,
    description: row.description || '',
    icon: row.icon || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class Service {
  static async findAll() {
    const [rows] = await query('SELECT * FROM services ORDER BY created_at DESC');
    return rows.map(formatService);
  }

  static async findById(id) {
    const [rows] = await query('SELECT * FROM services WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatService(rows[0]);
  }

  static async create(data) {
    const { title, description = '', icon = '' } = data;
    const [result] = await query(
      'INSERT INTO services (title, description, icon) VALUES (?, ?, ?)',
      [title, description, icon]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const title = data.title !== undefined ? data.title : existing.title;
    const description = data.description !== undefined ? data.description : existing.description;
    const icon = data.icon !== undefined ? data.icon : existing.icon;

    await query(
      'UPDATE services SET title = ?, description = ?, icon = ? WHERE id = ?',
      [title, description, icon, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM services WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM services');
    return rows[0].count;
  }

  static async deleteMany() {
    await query('DELETE FROM services');
  }
}

module.exports = Service;
