// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, changePassword, forgotPassword, resetPasswordWithToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Auth user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', authUser);

// @desc    Forgot password (send reset email)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
router.post('/forgot-password', forgotPassword);

// @desc    Reset password with token
// @route   POST /api/v1/auth/reset-password
// @access  Public
router.post('/reset-password', resetPasswordWithToken);

// @desc    Change password for authenticated user
// @route   POST /api/v1/auth/change-password
// @access  Private
router.post('/change-password', protect, changePassword);

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
router.get('/profile', protect, getUserProfile);

module.exports = router;
