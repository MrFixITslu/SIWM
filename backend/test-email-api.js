const express = require('express');
const cors = require('cors');
const { sendNotificationToEnabledUsers } = require('./services/notificationHelper');
const { connectDB } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB().then(() => {
  console.log('✅ Database connected for email test');
}).catch(err => {
  console.error('❌ Database connection failed:', err);
});

// Test email endpoint
app.post('/test-email-admin', async (req, res) => {
  try {
    console.log('🧪 Sending test email to admin users with notifications enabled...');
    
    const emailData = {
      subject: 'Test Email Notification - Vision79 System',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">🧪 Test Email Notification</h1>
            <p style="margin: 0; color: #6b7280;">Vision79 Inventory Management System</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Email Notification System Test</h2>
            
            <p>This is a test email to verify that the email notification preference system is working correctly.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #0369a1;">✅ System Status</h3>
              <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                <li>Email notification preferences are working</li>
                <li>Role-based filtering is active</li>
                <li>Only users with enabled preferences receive emails</li>
                <li>Admin users are receiving this test email</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">📧 Email Notification Features</h3>
              <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                <li>User Management page has email notification checkboxes</li>
                <li>Only checked users receive email notifications</li>
                <li>Notifications can be targeted by user role</li>
                <li>Real-time preference updates</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              This is an automated test email from the Vision79 Shipping, Inventory & Warehouse Management system.<br>
              <strong>Timestamp:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };
    
    // Send only to admin users with email notifications enabled
    await sendNotificationToEnabledUsers(emailData, ['admin']);
    
    console.log('✅ Test email sent successfully to admin users with notifications enabled!');
    
    res.json({
      success: true,
      message: 'Test email sent successfully to admin users with notifications enabled!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🧪 Email test server running on port ${PORT}`);
  console.log(`📧 Send POST request to http://localhost:${PORT}/test-email-admin to test emails`);
});
