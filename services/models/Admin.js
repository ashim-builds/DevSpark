const bcrypt = require('bcryptjs');
const { query } = require('../db');

class Admin {
  static async findByEmail(email) {
    const [rows] = await query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows || rows.length === 0) return null;
    const admin = rows[0];
    return {
      id: admin.id,
      _id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      comparePassword: async function (candidatePassword) {
        return bcrypt.compare(candidatePassword, admin.password);
      },
    };
  }

  static async findById(id) {
    const [rows] = await query('SELECT id, name, email, created_at, updated_at FROM admins WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    const admin = rows[0];
    return {
      id: admin.id,
      _id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      createdAt: admin.created_at,
      updatedAt: admin.updated_at,
    };
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name || 'Admin', email, hashedPassword]
    );
    return {
      id: result.insertId,
      _id: result.insertId.toString(),
      name: name || 'Admin',
      email,
    };
  }

  static async deleteMany() {
    await query('DELETE FROM admins');
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM admins');
    return rows[0].count;
  }
}

module.exports = Admin;
