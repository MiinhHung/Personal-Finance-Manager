const express = require('express');
const { body, param, query } = require('express-validator');

const categoriesController = require('../controllers/categories.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Áp dụng auth cho toàn bộ routes bên dưới
router.use(authMiddleware);

// GET /api/categories?type=income|expense
router.get(
  '/',
  [
    query('type')
      .optional()
      .isIn(['income', 'expense'])
      .withMessage('type must be "income" or "expense" if provided'),
  ],
  validateRequest,
  categoriesController.getCategories
);

// POST /api/categories
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be "income" or "expense"'),
  ],
  validateRequest,
  categoriesController.createCategory
);

// PUT /api/categories/:id
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('Category id must be a positive integer'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be "income" or "expense"'),
  ],
  validateRequest,
  categoriesController.updateCategory
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  [param('id').isInt({ gt: 0 }).withMessage('Category id must be a positive integer')],
  validateRequest,
  categoriesController.deleteCategory
);

module.exports = router;