const { getPool } = require('../config/db');

/**
 * Get all users who have email notifications enabled
 * @returns {Promise<Array>} Array of users with email notifications enabled
 */
const getUsersWithEmailNotificationsEnabled = async () => {
  const pool = getPool();
  try {
    const query = `
      SELECT id, name, email, role 
      FROM users 
      WHERE email_notifications_enabled = true 
      AND status = 'active'
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching users with email notifications enabled:', error);
    throw error;
  }
};

/**
 * Get email addresses of users who have email notifications enabled
 * @param {Array} roleFilter - Optional array of roles to filter by
 * @returns {Promise<Array>} Array of email addresses
 */
const getEmailAddressesForNotifications = async (roleFilter = null) => {
  const pool = getPool();
  try {
    let query = `
      SELECT email 
      FROM users 
      WHERE email_notifications_enabled = true 
      AND status = 'active'
    `;
    const params = [];
    
    if (roleFilter && roleFilter.length > 0) {
      query += ` AND role = ANY($1)`;
      params.push(roleFilter);
    }
    
    const result = await pool.query(query, params);
    return result.rows.map(row => row.email);
  } catch (error) {
    console.error('Error fetching email addresses for notifications:', error);
    throw error;
  }
};

/**
 * Send email notification to all users with notifications enabled
 * @param {Object} emailData - Email data object
 * @param {Array} roleFilter - Optional array of roles to filter recipients
 */
const sendNotificationToEnabledUsers = async (emailData, roleFilter = null) => {
  const { sendEmail } = require('./emailService');
  
  try {
    const emailAddresses = await getEmailAddressesForNotifications(roleFilter);
    
    if (emailAddresses.length === 0) {
      console.log('No users have email notifications enabled for the specified criteria');
      return;
    }
    
    // Send email to each user individually
    const emailPromises = emailAddresses.map(email => 
      sendEmail({
        ...emailData,
        to: email
      })
    );
    
    await Promise.all(emailPromises);
    console.log(`Email notification sent to ${emailAddresses.length} users`);
    
  } catch (error) {
    console.error('Error sending notifications to enabled users:', error);
    throw error;
  }
};

module.exports = {
  getUsersWithEmailNotificationsEnabled,
  getEmailAddressesForNotifications,
  sendNotificationToEnabledUsers
};
