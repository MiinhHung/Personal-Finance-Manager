const express = require('express');
const { query } = require('express-validator');

const reportsController = require('../controllers/reports.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Bảo vệ toàn bộ report routes
router.use(authMiddleware);

// GET /api/reports/summary?month=YYYY-MM
router.get(
  '/summary',
  [
    query('month')
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage('month must be in format YYYY-MM'),
  ],
  validateRequest,
  reportsController.getMonthlySummary
);

// GET /api/reports/by-category?from=YYYY-MM-DD&to=YYYY-MM-DD&type=income|expense
router.get(
  '/by-category',
  [
    query('from').notEmpty().withMessage('from is required').isISO8601().withMessage('from must be a valid date'),
    query('to').notEmpty().withMessage('to is required').isISO8601().withMessage('to must be a valid date'),
    query('type')
      .notEmpty()
      .withMessage('type is required')
      .isIn(['income', 'expense'])
      .withMessage('type must be "income" or "expense"'),
  ],
  validateRequest,
  reportsController.getByCategory
);

module.exports = router;