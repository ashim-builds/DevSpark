const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function exportDockerDB() {
  const connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'devspark_root_secret',
    database: 'devspark',
  };

  console.log(`Connecting to Docker MySQL database at localhost:3306...`);

  let conn;
  try {
    conn = await mysql.createConnection(connectionConfig);
    console.log(`Connected to MySQL successfully.`);
  } catch (err) {
    console.error(`Could not connect to Docker MySQL on localhost:3306: ${err.message}`);
    console.log(`Tip: Make sure Docker Desktop is open and the container 'devspark_mysql' is running.`);
    process.exit(1);
  }

  let sqlOutput = `-- ========================================================\n`;
  sqlOutput += `-- DevSpark Exported Database Dump from Docker MySQL\n`;
  sqlOutput += `-- Date: ${new Date().toISOString()}\n`;
  sqlOutput += `-- Database: ${connectionConfig.database}\n`;
  sqlOutput += `-- ========================================================\n\n`;
  sqlOutput += `SET NAMES utf8mb4;\n`;
  sqlOutput += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  const [tablesResult] = await conn.query(`SHOW TABLES`);
  const tableKey = Object.keys(tablesResult[0] || {})[0];
  const tables = tablesResult.map((r) => r[tableKey]);

  console.log(`Found ${tables.length} tables to export: ${tables.join(', ')}`);

  for (const table of tables) {
    // 1. Table structure
    const [createTableResult] = await conn.query(`SHOW CREATE TABLE \`${table}\``);
    const createTableSql = createTableResult[0]['Create Table'];

    sqlOutput += `-- --------------------------------------------------------\n`;
    sqlOutput += `-- Table structure for table \`${table}\`\n`;
    sqlOutput += `-- --------------------------------------------------------\n`;
    sqlOutput += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    sqlOutput += `${createTableSql};\n\n`;

    // 2. Table data
    const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
    console.log(`Table ${table}: exporting ${rows.length} rows`);

    if (rows.length > 0) {
      sqlOutput += `-- Dumping data for table \`${table}\`\n`;
      const columns = Object.keys(rows[0]).map((c) => `\`${c}\``).join(', ');

      for (const row of rows) {
        const values = Object.values(row).map((val) => {
          if (val === null) return 'NULL';
          if (typeof val === 'number') return val;
          if (typeof val === 'boolean') return val ? 1 : 0;
          if (Buffer.isBuffer(val)) {
            return `0x${val.toString('hex')}`;
          }
          if (typeof val === 'object') {
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            }
            return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
          }
          return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        }).join(', ');

        sqlOutput += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
      }
      sqlOutput += `\n`;
    }
  }

  sqlOutput += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  const destPath = path.join(__dirname, '..', 'deployment', 'devspark_database.sql');
  fs.writeFileSync(destPath, sqlOutput, 'utf8');
  console.log(`\nEXPORT COMPLETE! Saved to: ${destPath}`);

  await conn.end();
}

exportDockerDB().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
