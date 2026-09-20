const { query } = require('../db');

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  const match = url.match(/\/api\/images\/\d+/);
  if (match) return match[0];
  return url;
}

function formatTestimonial(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    client_name: row.client_name,
    company: row.company || '',
    message: row.message || '',
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : 5,
    photo: normalizeImageUrl(row.photo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class Testimonial {
  static async findAll() {
    const [rows] = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
    return rows.map(formatTestimonial);
  }

  static async findById(id) {
    const [rows] = await query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return formatTestimonial(rows[0]);
  }

  static async create(data) {
    const {
      client_name,
      company = '',
      message = '',
      rating = 5,
      photo = '',
    } = data;

    const [result] = await query(
      `INSERT INTO testimonials (client_name, company, message, rating, photo)
       VALUES (?, ?, ?, ?, ?)`,
      [client_name, company, message, rating, photo]
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const client_name = data.client_name !== undefined ? data.client_name : existing.client_name;
    const company = data.company !== undefined ? data.company : existing.company;
    const message = data.message !== undefined ? data.message : existing.message;
    const rating = data.rating !== undefined ? data.rating : existing.rating;
    const photo = data.photo !== undefined ? data.photo : existing.photo;

    await query(
      `UPDATE testimonials
       SET client_name = ?, company = ?, message = ?, rating = ?, photo = ?
       WHERE id = ?`,
      [client_name, company, message, rating, photo, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await query('DELETE FROM testimonials WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await query('SELECT COUNT(*) as count FROM testimonials');
    return rows[0].count;
  }

  static async deleteMany() {
    await query('DELETE FROM testimonials');
  }
}

module.exports = Testimonial;
