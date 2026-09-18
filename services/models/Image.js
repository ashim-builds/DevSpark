const { query } = require('../db');

class Image {
  static async initTable() {
    await query(`
      CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INT DEFAULT 0,
        data LONGBLOB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure size column exists for legacy schemas
    try {
      await query(`
        ALTER TABLE images ADD COLUMN size INT DEFAULT 0;
      `);
    } catch (err) {
      // Column already exists or error can be safely ignored
    }
  }

  static async create({ filename, mime_type, size, data }) {
    await this.initTable();
    const fileSize = size !== undefined ? size : (Buffer.isBuffer(data) ? data.length : 0);

    try {
      const [result] = await query(
        'INSERT INTO images (filename, mime_type, size, data) VALUES (?, ?, ?, ?)',
        [filename, mime_type, fileSize, data]
      );
      return {
        id: result.insertId,
        _id: result.insertId.toString(),
        filename,
        mime_type,
        size: fileSize,
      };
    } catch (err) {
      // Fallback in case table has no size column
      const [result] = await query(
        'INSERT INTO images (filename, mime_type, data) VALUES (?, ?, ?)',
        [filename, mime_type, data]
      );
      return {
        id: result.insertId,
        _id: result.insertId.toString(),
        filename,
        mime_type,
        size: fileSize,
      };
    }
  }

  static async findById(id) {
    await this.initTable();
    const [rows] = await query(
      'SELECT id, filename, mime_type, data, created_at FROM images WHERE id = ?',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    const dataBuffer = row.data;
    return {
      ...row,
      size: dataBuffer ? dataBuffer.length : 0,
      _id: row.id.toString(),
    };
  }

  static async delete(id) {
    await this.initTable();
    const [result] = await query('DELETE FROM images WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Image;
