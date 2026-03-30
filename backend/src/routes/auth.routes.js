const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: { error: { message: 'Too many auth requests from this IP, please try again after 15 minutes' } },
});

// Đăng ký
router.post(
  '/register',
  authLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must contain at least one letter and one number'),
  ],
  validateRequest,
  authController.register
);

// Đăng nhập
router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;