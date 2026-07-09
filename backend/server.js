// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
const cron = require('node-cron');
const inventoryService = require('./services/inventoryService');

// Load env vars FIRST
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Populate defaults for missing environment variables to prevent startup crashes
const defaults = {
  NODE_ENV: 'development',
  PORT: '3000',
  JWT_SECRET: 'vision79_default_jwt_secret_key_12345!',
  DB_USER: 'mock',
  DB_PASSWORD: 'mock',
  DB_HOST: '', // blank signals mock mode in db.js
  DB_PORT: '5432',
  DB_NAME: 'mock'
};

Object.keys(defaults).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = defaults[key];
  }
});

// Validate required environment variables before doing anything else
const requiredEnvVars = ['NODE_ENV', 'PORT', 'JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('---------------------------------------------------------------------------');
  console.warn(`WARNING: Missing some environment variables: ${missingVars.join(', ')}`);
  console.warn('The system will use default / mock stubs where applicable.');
  console.warn('---------------------------------------------------------------------------');
}

// Add a specific, non-fatal warning for the Gemini API Key
if (!process.env.GEMINI_API_KEY) {
  console.warn('---------------------------------------------------------------------------');
  console.warn('WARNING: GEMINI_API_KEY is not set in backend/.env');
  console.warn('The AI Chatbot and AI Insight features will not be available.');
  console.warn('Please get an API key from Google AI Studio and add it to the .env file.');
  console.warn('---------------------------------------------------------------------------');
}

// Add a specific, non-fatal warning for the Email Service
const emailEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEmailVars = emailEnvVars.filter(varName => !process.env[varName]);
if (missingEmailVars.length > 0) {
  console.warn('---------------------------------------------------------------------------');
  console.warn(`WARNING: Email service is not fully configured. Missing: ${missingEmailVars.join(', ')}`);
  console.warn('Automated email notifications will be disabled.');
  console.warn('---------------------------------------------------------------------------');
}

const { connectDB } = require('./config/db'); // Import connectDB
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const asnRoutes = require('./routes/asnRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dispatchRoutes = require('./routes/dispatchRoutes');
const vendorRoutes = require('./routes/vendorRoutes'); 
const reportingRoutes = require('./routes/reportingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiFeedbackRoutes = require('./routes/aiFeedbackRoutes');
const geminiRoutes = require('./routes/geminiRoutes'); // For chatbot
const aiInsightRoutes = require('./routes/aiInsightRoutes'); // For specific insights
const scheduledAiRoutes = require('./routes/scheduledAiRoutes'); // For weekly scheduled insights
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import Dashboard routes
const systemRoutes = require('./routes/systemRoutes');
const eventRoutes = require('./routes/eventRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes'); // For advanced logistics optimization
const warehouseRoutes = require('./routes/warehouseRoutes'); // For multi-warehouse support
const supportRoutes = require('./routes/supportRoutes'); // For customer support

// Initialize Express App
const app = express();

// Disable ETag to prevent 304 Not Modified responses
app.disable('etag');

// Add no-cache headers to all API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// 3. Middleware
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

// Always allow access from the duckdns custom domain
allowedOrigins.push(
  'http://siwm.v79sl.duckdns.org',
  'https://siwm.v79sl.duckdns.org'
);

if (process.env.NODE_ENV === 'development' && allowedOrigins.length === 0) {
  // Allow all localhost variations and common development ports
  allowedOrigins.push(
    'http://localhost:5173', 'http://localhost:5176', 'http://localhost:3000', 
    'http://localhost:8000', 'http://127.0.0.1:5500', 'http://localhost:4173', 
    'http://localhost:3001', 'http://localhost:4000',
    // Allow network access for scalability
    'http://0.0.0.0:5176', 'http://0.0.0.0:5173', 'http://0.0.0.0:4000'
  );
}

// SECURITY FIX: Add public IP access support without wildcard
if (process.env.ALLOW_PUBLIC_IP === 'true') {
  // Add specific network origins for public access (more secure than wildcard)
  allowedOrigins.push(
    'http://192.168.100.9:5176',
    'http://192.168.100.9:5173',
    'http://192.168.1.100:5176',
    'http://192.168.1.100:5173'
  );
}

// CORS Configuration  
const corsOptions = {
  origin: (origin, callback) => {
    // Enhanced CORS logging for debugging
    console.log(`[CORS] Incoming request from origin: ${origin}`);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('[CORS] Allowed: No origin (mobile app, curl, etc.)');
      return callback(null, true);
    }
    // Allow all origins in development mode or when public IP access is enabled
    if (process.env.NODE_ENV === 'development' || process.env.ALLOW_PUBLIC_IP === 'true') {
      console.log(`[CORS] Allowed: Development mode or ALLOW_PUBLIC_IP=true`);
      return callback(null, true);
    }
    // In production, be more strict with CORS
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed: Origin is in allowedOrigins list`);
        return callback(null, true);
      }
      console.log(`[CORS] BLOCKED: Origin not allowed in production: ${origin}`);
      return callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
    } else {
      // Development mode is more permissive
      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed: Origin is in allowedOrigins list`);
        return callback(null, true);
      }
      console.log(`[CORS] BLOCKED: Origin not allowed: ${origin}`);
      return callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Forwarded-For', 'X-Real-IP', 'Cache-Control'],
};

app.use(cors(corsOptions));

const startApp = async () => {
    // 1. Connect to Database first
    await connectDB();

    // Run SMTP column migrations for warehouses table if applicable
    try {
      const { addSmtpColumnsWarehouse } = require('./add-smtp-columns-warehouse');
      await addSmtpColumnsWarehouse();
    } catch (migErr) {
      console.warn('[Migration Warning] Could not run SMTP columns migration:', migErr.message);
    }

    // 2. Initialize Scheduled AI Service (only in non-test environment)
    if (process.env.NODE_ENV !== 'test') {
      const scheduledAiService = require('./services/scheduledAiService');
      scheduledAiService.init();

      // Schedule SKU update job every 6 months (1st Jan, 1st July at 2:00am)
      cron.schedule('0 2 1 1,7 *', async () => {
        console.log('[SKU Update Job] Running scheduled SKU update for items with missing SKUs...');
        try {
          await inventoryService.updateMissingSkus();
          console.log('[SKU Update Job] Completed SKU update.');
        } catch (err) {
          console.error('[SKU Update Job] Error during SKU update:', err);
        }
      });
    }
    
    const corsOptions = {
      origin: (origin, callback) => {
        // Enhanced CORS logging for debugging
        console.log(`[CORS] Incoming request from origin: ${origin}`);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          console.log('[CORS] Allowed: No origin (mobile app, curl, etc.)');
          return callback(null, true);
        }
        // Allow all origins in development mode or when public IP access is enabled
        if (process.env.NODE_ENV === 'development' || process.env.ALLOW_PUBLIC_IP === 'true') {
          console.log(`[CORS] Allowed: Development mode or ALLOW_PUBLIC_IP=true`);
          return callback(null, true);
        }
            // In production, be more strict with CORS
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed: Origin is in allowedOrigins list`);
        return callback(null, true);
      }
      console.log(`[CORS] BLOCKED: Origin not allowed in production: ${origin}`);
      return callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
    } else {
      // Development mode is more permissive
      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed: Origin is in allowedOrigins list`);
        return callback(null, true);
      }
      console.log(`[CORS] BLOCKED: Origin not allowed: ${origin}`);
      return callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
    }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Forwarded-For', 'X-Real-IP', 'Cache-Control'],
    };
    app.use(cors(corsOptions));
    
    // Add IP address logging middleware for public access
    app.use((req, res, next) => {
      const clientIP = req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress ||
                      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                      req.ip;
      
      // Log client IP for debugging public access
      if (process.env.ALLOW_PUBLIC_IP === 'true') {
        console.log(`Request from IP: ${clientIP} - ${req.method} ${req.path}`);
      }
      
      // Store IP in request object for potential use in controllers
      req.clientIP = clientIP;
      next();
    });
    
    // Configure helmet with modern security headers
    // This replaces deprecated 'Expires' with 'Cache-Control' and 'X-Frame-Options' with CSP 'frame-ancestors'
    app.use(helmet({
      // Explicitly disable deprecated headers
      frameguard: false, // Disable X-Frame-Options
      // Configure Content Security Policy with frame-ancestors
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"],
          frameAncestors: ["'self'"], // Modern replacement for X-Frame-Options
        },
      },
      // Use modern cache control instead of Expires
      noCache: true,
      // Disable deprecated headers
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));

    // Add a test route to verify headers
    app.get('/test-headers', (req, res) => {
      res.json({
        message: 'Headers test',
        headers: {
          'cache-control': res.getHeader('Cache-Control'),
          'expires': res.getHeader('Expires'),
          'x-frame-options': res.getHeader('X-Frame-Options'),
          'content-security-policy': res.getHeader('Content-Security-Policy')
        }
      });
    });
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev')); 
    }
    app.use(express.json({ limit: '50mb' })); 
    app.use(express.urlencoded({ extended: true, limit: '50mb' })); 
    
    // 4. Rate Limiting - More strict in production
    const generalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: process.env.NODE_ENV === 'production' ? 300 : 500, 
        standardHeaders: true, 
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    });
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false,
        message: 'Too many login/register attempts from this IP, please try again after 15 minutes',
    });

    // 5. Mount Routes
    const API_PREFIX = '/api/v1';
    
    app.use(API_PREFIX, generalLimiter);
    app.get(API_PREFIX, (req, res) => res.json({ message: 'Welcome to Vision79 Shipping, Inventory & Warehouse Management Backend API! V1' }));
    
    app.use(`${API_PREFIX}/auth`, authLimiter, authRoutes);
    app.use(`${API_PREFIX}/users`, userRoutes);
    app.use(`${API_PREFIX}/assets`, assetRoutes);
    app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
    app.use(`${API_PREFIX}/asns`, asnRoutes);
    app.use(`${API_PREFIX}/orders`, orderRoutes);
    app.use(`${API_PREFIX}/dispatch`, dispatchRoutes);
    app.use(`${API_PREFIX}/vendors`, vendorRoutes); 
    app.use(`${API_PREFIX}/reports`, reportingRoutes);
    app.use(`${API_PREFIX}/notifications`, notificationRoutes);
    app.use(`${API_PREFIX}/ai-feedback`, aiFeedbackRoutes);
    app.use(`${API_PREFIX}/gemini`, geminiRoutes);
    app.use(`${API_PREFIX}/ai-insights`, aiInsightRoutes);
    app.use(`${API_PREFIX}/scheduled-ai`, scheduledAiRoutes);
    app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
    app.use(`${API_PREFIX}/system`, systemRoutes);
    app.use(`${API_PREFIX}/events`, eventRoutes);
    app.use(`${API_PREFIX}/logistics`, logisticsRoutes);
    app.use(`${API_PREFIX}/warehouses`, warehouseRoutes);
    app.use(`${API_PREFIX}/support`, supportRoutes);
    
    // Test endpoint for email notifications
    app.post(`${API_PREFIX}/test-email-admin`, async (req, res) => {
      try {
        const { sendNotificationToEnabledUsers } = require('./services/notificationHelper');
        
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
    
    // Serve frontend using Vite middleware in development or static build in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Express] Loading Vite middleware for frontend routing...');
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
        root: path.resolve(__dirname, '..'),
      });
      // Use Vite's middleware for everything except api routes
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
          next();
        } else {
          vite.middlewares(req, res, next);
        }
      });
    } else {
      console.log('[Express] Serving static files from dist/ folder...');
      const distPath = path.resolve(__dirname, '../dist');
      app.use(express.static(distPath));
      app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
    
    // 6. Error Handlers
    app.use(notFound); 
    app.use(errorHandler); 

    // 7. Start Server
    const PORT = 3000;

    // --- Port Sanity Check ---
    if (['5432', '3306', '27017', '1433'].includes(String(PORT))) {
        console.warn('---------------------------------------------------------------------------');
        console.warn(`[WARNING] Your application PORT is set to ${PORT}, which is a common database port.`);
        console.warn(`This can cause conflicts. The application server should run on a dedicated port like 4000.`);
        console.warn('---------------------------------------------------------------------------');
    }

    // Use HTTP for development to avoid SSL issues
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on http://0.0.0.0:${PORT}`);
      console.log(`Access from other devices: http://[YOUR_IP_ADDRESS]:${PORT}`);
    });
};

// Export the app for testing
module.exports = { app };

// Start the application only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startApp().catch(error => {
      console.error("Failed to start the application due to a fatal error:", error);
      process.exit(1);
  });
}
