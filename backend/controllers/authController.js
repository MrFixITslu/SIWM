

// backend/controllers/authController.js
const userService = require('../services/userService');
const generateToken = require('../utils/generateToken');
const { body, validationResult } = require('express-validator');

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: minimum 8 chars, at least one uppercase, one lowercase, one number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Enhanced Input Validation
  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Please add all fields: name, email, password'));
  }
  
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400);
    return next(new Error('Name, email, and password must be strings.'));
  }
  
  // Email format validation
  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address.'));
  }
  
  // Password strength validation
  if (!PASSWORD_REGEX.test(password)) {
    res.status(400);
    return next(new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'));
  }
  
  // Name validation (alphanumeric and spaces only, 2-50 chars)
  if (!/^[a-zA-Z0-9\s]{2,50}$/.test(name)) {
    res.status(400);
    return next(new Error('Name must be 2-50 characters long and contain only letters, numbers, and spaces.'));
  }
  
  if (role && typeof role !== 'string') {
     res.status(400);
     return next(new Error('Role must be a string if provided.'));
  }

  try {
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await userService.createUser({ name, email, password, role });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data during registration'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  // Trim and lowercase the email for consistent lookup
  const rawEmail = req.body.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const password = req.body.password;

  // Enhanced Input Validation
  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide email and password'));
  }
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400);
    return next(new Error('Email and password must be strings.'));
  }
  
  // Email format validation
  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address.'));
  }

  try {
    const user = await userService.findUserByEmail(email);
    const passwordProvided = !!password;
    let passwordMatch = false;
    if (user && passwordProvided) {
      passwordMatch = await userService.matchPassword(email, password);
    }

    if (user && passwordMatch) {
      // Log successful login with IP address for security monitoring
      const clientIP = req.clientIP || req.ip || 'unknown';
      console.log(`Successful login: ${email} from IP: ${clientIP}`);
      
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        token: generateToken(user.id),
      });
    } else {
      // Log failed login attempt with IP address
      const clientIP = req.clientIP || req.ip || 'unknown';
      console.log(`Failed login attempt: ${email} from IP: ${clientIP}`);
      
      res.status(401); // Unauthorized
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.user.id); 

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Change password for authenticated user
// @route   POST /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!currentPassword || !newPassword) {
    res.status(400);
    return next(new Error('Please provide both current password and new password'));
  }

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    res.status(400);
    return next(new Error('Passwords must be strings'));
  }

  // Password strength validation for new password
  if (!PASSWORD_REGEX.test(newPassword)) {
    res.status(400);
    return next(new Error('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'));
  }

  // Check if new password is different from current password
  if (currentPassword === newPassword) {
    res.status(400);
    return next(new Error('New password must be different from current password'));
  }

  try {
    // Get user to verify current password
    const user = await userService.findUserById(userId);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Verify current password
    const isCurrentPasswordValid = await userService.matchPassword(user.email, currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(401);
      return next(new Error('Current password is incorrect'));
    }

    // Update password
    await userService.updateUserPassword(userId, newPassword);

    // Log password change for security monitoring
    const clientIP = req.clientIP || req.ip || 'unknown';
    console.log(`Password changed for user: ${user.email} from IP: ${clientIP}`);

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password via email (forgot password)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Input validation
  if (!email) {
    res.status(400);
    return next(new Error('Please provide email address'));
  }

  if (typeof email !== 'string') {
    res.status(400);
    return next(new Error('Email must be a string'));
  }

  // Email format validation
  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address'));
  }

  try {
    const user = await userService.findUserByEmail(email.toLowerCase());
    
    // Always return success to prevent email enumeration
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });

    // Only proceed if user exists
    if (user) {
      // Generate a temporary reset token (in a real app, this would be stored in DB with expiry)
      const resetToken = generateToken(user.id);
      
      // Send email with reset link
      const { sendEmail } = require('../services/emailService');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5176';
      
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Vision79 System',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #dc2626; margin: 0 0 10px 0;">🔐 Password Reset Request</h1>
              <p style="margin: 0; color: #6b7280;">Vision79 Inventory Management System</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
              
              <p>Hello ${user.name},</p>
              
              <p>We received a request to reset your password for your Vision79 account. If you made this request, please click the button below to reset your password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${frontendUrl}/#/reset-password?token=${resetToken}" 
                   style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reset My Password
                </a>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul style="color: #6b7280;">
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you click the link above</li>
              </ul>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                This is an automated message from the Vision79 Shipping, Inventory & Warehouse Management system.<br>
                <strong>Requested at:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `
      });

      // Log password reset request for security monitoring
      const clientIP = req.clientIP || req.ip || 'unknown';
      console.log(`Password reset requested for user: ${user.email} from IP: ${clientIP}`);
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPasswordWithToken = async (req, res, next) => {
  const { token, newPassword } = req.body;

  // Input validation
  if (!token || !newPassword) {
    res.status(400);
    return next(new Error('Please provide reset token and new password'));
  }

  if (typeof token !== 'string' || typeof newPassword !== 'string') {
    res.status(400);
    return next(new Error('Token and password must be strings'));
  }

  // Password strength validation
  if (!PASSWORD_REGEX.test(newPassword)) {
    res.status(400);
    return next(new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'));
  }

  try {
    // Verify token and extract user ID
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Update password
    await userService.updateUserPassword(userId, newPassword);

    // Get user for logging
    const user = await userService.findUserById(userId);
    if (user) {
      const clientIP = req.clientIP || req.ip || 'unknown';
      console.log(`Password reset completed for user: ${user.email} from IP: ${clientIP}`);
    }

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(400);
      return next(new Error('Invalid or expired reset token'));
    }
    next(error);
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  changePassword,
  forgotPassword,
  resetPasswordWithToken,
};
