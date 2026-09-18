const { query } = require('../db');

function formatContactMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}

class ContactMessage {
  static async findAll() {
    const [rows] = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return rows.map(formatContactMessage);
  }

  static async findById(id) {
    const [rows] = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatContactMessage(rows[0]);
  }

  static async create(data) {
    const { name, email, message } = data;
    const [result] = await query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    return this.findById(result.insertId);
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM contact_messages');
    return rows[0].count;
  }

  static async deleteMany() {
    await query('DELETE FROM contact_messages');
  }
}

module.exports = ContactMessage;
