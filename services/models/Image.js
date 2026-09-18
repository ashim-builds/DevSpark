const { query } = require('../db');

class Image {
  static async create({ filename, mime_type, size, data }) {
    const [result] = await query(
      'INSERT INTO images (filename, mime_type, size, data) VALUES (?, ?, ?, ?)',
      [filename, mime_type, size, data]
    );
    return {
      id: result.insertId,
      _id: result.insertId.toString(),
      filename,
      mime_type,
      size,
    };
  }

  static async findById(id) {
    const [rows] = await query(
      'SELECT id, filename, mime_type, size, data, created_at FROM images WHERE id = ?',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      _id: row.id.toString(),
    };
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM images WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Image;
