// backend/add-smtp-columns-warehouse.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const addSmtpColumnsWarehouse = async () => {
  // Try to use environment variables for database connection
  if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.log('[Migration] Database credentials missing or using mock database. Skipping live migration of SMTP columns.');
    return;
  }

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

  try {
    console.log('[Migration] Connecting to database for SMTP column addition...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Read and execute the SQL script
    const sqlPath = path.join(__dirname, 'add-smtp-columns-warehouse.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('[Migration] Adding SMTP columns to warehouses...');
    await pool.query(sql);
    console.log('✅ SMTP columns added successfully to warehouses table');

    // Verify the columns exist
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'warehouses' AND column_name = 'smtp_host'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ SMTP columns verified in table definition');
    } else {
      console.log('❌ SMTP columns not found in table definition');
    }

  } catch (error) {
    console.error('❌ Error during SMTP columns migration:', error.message);
  } finally {
    await pool.end();
  }
};

// Export or run if called directly
if (require.main === module) {
  addSmtpColumnsWarehouse();
}

module.exports = { addSmtpColumnsWarehouse };
