const express = require('express');
const { body, param, query } = require('express-validator');

const transactionsController = require('../controllers/transactions.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Tất cả routes trong file này cần auth
router.use(authMiddleware);

// GET /api/transactions
router.get(
  '/',
  [
    query('type')
      .optional()
      .isIn(['income', 'expense'])
      .withMessage('type must be "income" or "expense"'),
    query('categoryId')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('categoryId must be a positive integer'),
    query('from')
      .optional()
      .isISO8601()
      .withMessage('from must be a valid date'),
    query('to')
      .optional()
      .isISO8601()
      .withMessage('to must be a valid date'),
    query('page')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('page must be > 0'),
    query('pageSize')
      .optional()
      .isInt({ gt: 0, lt: 101 })
      .withMessage('pageSize must be between 1 and 100'),
  ],
  validateRequest,
  transactionsController.getTransactions
);

// GET /api/transactions/recent
router.get(
  '/recent',
  [
    query('limit')
      .optional()
      .isInt({ gt: 0, lt: 51 })
      .withMessage('limit must be between 1 and 50'),
  ],
  validateRequest,
  transactionsController.getRecentTransactions
);

// GET /api/transactions/:id
router.get(
  '/:id',
  [param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')],
  validateRequest,
  transactionsController.getTransactionById
);

// POST /api/transactions
router.post(
  '/',
  [
    body('amount').notEmpty().withMessage('amount is required'),
    body('type').isIn(['income', 'expense']).withMessage('type must be "income" or "expense"'),
    body('transactionDate')
      .notEmpty()
      .withMessage('transactionDate is required')
      .isISO8601()
      .withMessage('transactionDate must be a valid date'),
    body('categoryId')
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage('categoryId must be a positive integer'),
  ],
  validateRequest,
  transactionsController.createTransaction
);

// PUT /api/transactions/:id
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
    body('amount').notEmpty().withMessage('amount is required'),
    body('type').isIn(['income', 'expense']).withMessage('type must be "income" or "expense"'),
    body('transactionDate')
      .notEmpty()
      .withMessage('transactionDate is required')
      .isISO8601()
      .withMessage('transactionDate must be a valid date'),
    body('categoryId')
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage('categoryId must be a positive integer'),
  ],
  validateRequest,
  transactionsController.updateTransaction
);

// DELETE /api/transactions/:id
router.delete(
  '/:id',
  [param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')],
  validateRequest,
  transactionsController.deleteTransaction
);

module.exports = router;