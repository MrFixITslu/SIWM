const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function addEmailNotificationPreference() {
  try {
    console.log('Adding email_notifications_enabled column to users table...');
    
    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'email_notifications_enabled'
    `;
    
    const checkResult = await pool.query(checkColumnQuery);
    
    if (checkResult.rows.length > 0) {
      console.log('Column email_notifications_enabled already exists.');
      return;
    }
    
    // Add the column with default value true
    const addColumnQuery = `
      ALTER TABLE users 
      ADD COLUMN email_notifications_enabled BOOLEAN DEFAULT TRUE NOT NULL
    `;
    
    await pool.query(addColumnQuery);
    
    // Update existing users to have email notifications enabled by default
    const updateExistingUsersQuery = `
      UPDATE users 
      SET email_notifications_enabled = TRUE 
      WHERE email_notifications_enabled IS NULL
    `;
    
    await pool.query(updateExistingUsersQuery);
    
    console.log('✅ Successfully added email_notifications_enabled column to users table');
    console.log('✅ Set default value to TRUE for all existing users');
    
  } catch (error) {
    console.error('❌ Error adding email notification preference:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
addEmailNotificationPreference()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
