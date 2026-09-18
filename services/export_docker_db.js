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

  console.log('Connecting to Docker MySQL database at localhost:3306...');

  let conn;
  try {
    conn = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL successfully.');
  } catch (err) {
    console.error('Could not connect to Docker MySQL on localhost:3306:', err.message);
    process.exit(1);
  }

  const [tablesResult] = await conn.query('SHOW TABLES');
  const tableKey = Object.keys(tablesResult[0] || {})[0];
  const tables = tablesResult.map((r) => r[tableKey]);

  console.log(`Found ${tables.length} tables to export: ${tables.join(', ')}`);

  let fullSql = `-- ========================================================\n`;
  fullSql += `-- DevSpark Full Database Dump (Schema + Data)\n`;
  fullSql += `-- Exported from Docker MySQL: ${new Date().toISOString()}\n`;
  fullSql += `-- ========================================================\n\n`;
  fullSql += `SET NAMES utf8mb4;\n`;
  fullSql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  fullSql += `USE \`rjflower_devspark\`;\n\n`;

  let dataOnlySql = `-- ========================================================\n`;
  dataOnlySql += `-- DevSpark Database - DATA ONLY (From Docker MySQL)\n`;
  dataOnlySql += `-- Exported from Docker MySQL: ${new Date().toISOString()}\n`;
  dataOnlySql += `-- ========================================================\n\n`;
  dataOnlySql += `SET NAMES utf8mb4;\n`;
  dataOnlySql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  dataOnlySql += `USE \`rjflower_devspark\`;\n\n`;

  for (const table of tables) {
    // 1. Table structure (for full dump)
    const [createTableResult] = await conn.query(`SHOW CREATE TABLE \`${table}\``);
    const createTableSql = createTableResult[0]['Create Table'];

    fullSql += `-- --------------------------------------------------------\n`;
    fullSql += `-- Table structure for table \`${table}\`\n`;
    fullSql += `-- --------------------------------------------------------\n`;
    fullSql += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    fullSql += `${createTableSql};\n\n`;

    // 2. Table data
    const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
    console.log(`Table ${table}: exporting ${rows.length} rows`);

    if (rows.length > 0) {
      const columns = Object.keys(rows[0]).map((c) => `\`${c}\``).join(', ');

      fullSql += `-- Dumping data for table \`${table}\`\n`;
      dataOnlySql += `-- Data for table \`${table}\` (${rows.length} rows)\n`;

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

        const insertStmt = `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
        fullSql += insertStmt;
        dataOnlySql += insertStmt;
      }
      fullSql += `\n`;
      dataOnlySql += `\n`;
    }
  }

  fullSql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  dataOnlySql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  const fullPath = path.join(__dirname, '..', 'deployment', 'devspark_database.sql');
  const dataPath = path.join(__dirname, '..', 'deployment', 'devspark_data_only.sql');

  fs.writeFileSync(fullPath, fullSql, 'utf8');
  fs.writeFileSync(dataPath, dataOnlySql, 'utf8');

  console.log(`\nEXPORT SUCCESSFUL!`);
  console.log(`1. Full Dump (Schema + Data): ${fullPath}`);
  console.log(`2. Data Only Dump:            ${dataPath}`);

  await conn.end();
}

exportDockerDB().catch((err) => {
  console.error('Export error:', err);
  process.exit(1);
});
