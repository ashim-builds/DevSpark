const { query } = require('../db');

function formatContactMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    name: row.name,
    email: row.email,
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

class ContactMessage {
  static async initTable() {
    await query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  static async findAll() {
    await this.initTable();
    const [rows] = await query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows.map(formatContactMessage);
  }

  static async findById(id) {
    await this.initTable();
    const [rows] = await query('SELECT * FROM contacts WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatContactMessage(rows[0]);
  }

  static async create(data) {
    await this.initTable();
    const { name, email, message } = data;
    const [result] = await query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    return this.findById(result.insertId);
  }

  static async delete(id) {
    await this.initTable();
    const [result] = await query('DELETE FROM contacts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    await this.initTable();
    const [rows] = await query('SELECT COUNT(*) as count FROM contacts');
    return rows[0].count;
  }

  static async deleteMany() {
    await this.initTable();
    await query('DELETE FROM contacts');
  }
}

module.exports = ContactMessage;
