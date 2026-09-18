const mysql = require('mysql2/promise');

// Parse database connection exclusively from DATABASE_URL
const rawUri = process.env.DATABASE_URL || process.env.DB_URL || process.env.MYSQL_URL || 'mysql://root:devspark_root_secret@localhost:3306/devspark';

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'devspark_root_secret',
  database: 'devspark',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

try {
  const parsed = new URL(rawUri);
  if (parsed.hostname) dbConfig.host = parsed.hostname;
  if (parsed.port) dbConfig.port = parseInt(parsed.port, 10);
  if (parsed.username) dbConfig.user = decodeURIComponent(parsed.username);
  if (parsed.password !== undefined) dbConfig.password = decodeURIComponent(parsed.password);
  if (parsed.pathname && parsed.pathname.length > 1) {
    dbConfig.database = decodeURIComponent(parsed.pathname.slice(1));
  }
} catch (err) {
  console.warn('Warning: Could not parse DATABASE_URL, using default configuration:', err.message);
}

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

async function query(sql, params) {
  const connectionPool = getPool();
  return connectionPool.query(sql, params);
}

async function initDB() {
  // 1. Ensure the database exists by connecting without DB specified first
  try {
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();
  } catch (err) {
    console.warn('Notice: Could not run initial CREATE DATABASE check (may require pre-created DB or permissions):', err.message);
  }

  // 2. Connect pool to the database
  const connectionPool = getPool();

  // 3. Create required tables
  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) DEFAULT 'Admin',
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100) DEFAULT 'Code',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(1024),
      tech_stack JSON,
      live_url VARCHAR(1024),
      github_url VARCHAR(1024),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      bio TEXT,
      photo VARCHAR(1024),
      skills JSON,
      social_links JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      message TEXT NOT NULL,
      rating INT DEFAULT 5,
      photo VARCHAR(1024),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      data LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS performance_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      metric_key VARCHAR(100) NOT NULL UNIQUE,
      label VARCHAR(255) NOT NULL,
      value INT NOT NULL DEFAULT 95,
      color VARCHAR(50) NOT NULL DEFAULT '#f97316',
      display_order INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  const [metricCount] = await connectionPool.query('SELECT COUNT(*) as count FROM performance_metrics');
  if (metricCount[0].count === 0) {
    await connectionPool.query(`
      INSERT INTO performance_metrics (metric_key, label, value, color, display_order) VALUES
      ('project_completion_rate', 'Project Completion Rate', 98, '#f97316', 1),
      ('client_satisfaction', 'Client Satisfaction', 96, '#22c55e', 2),
      ('on_time_delivery', 'On-time Delivery', 94, '#3b82f6', 3),
      ('response_rate', 'Response Rate', 100, '#a855f7', 4);
    `);
  }

  console.log(`Connected to MySQL database [${dbConfig.database}] at ${dbConfig.host}:${dbConfig.port}`);
}

async function initDBWithRetry(retries = 15, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await initDB();
      return;
    } catch (err) {
      console.warn(`[MySQL] Connection attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${delay}ms...`);
      if (attempt === retries) {
        throw new Error(`[MySQL] Failed to connect after ${retries} attempts: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = {
  getPool,
  query,
  initDB,
  initDBWithRetry,
};
