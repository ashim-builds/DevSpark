const { query } = require('../db');

const SiteSettings = {
  async get(key) {
    const [rows] = await query('SELECT value FROM site_settings WHERE `key` = ?', [key]);
    return rows.length ? rows[0].value : null;
  },

  async set(key, value) {
    await query(
      'INSERT INTO site_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = CURRENT_TIMESTAMP',
      [key, value, value]
    );
  },

  async getAll() {
    const [rows] = await query('SELECT `key`, value FROM site_settings');
    const result = {};
    for (const row of rows) result[row.key] = row.value;
    return result;
  },
};

module.exports = SiteSettings;
