const express = require('express');
const healthController = require('../controllers/health.controller');
const authRoutes = require('./auth.routes');
const categoriesRoutes = require('./categories.routes');
const transactionsRoutes = require('./transactions.routes');
const reportsRoutes = require('./reports.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

// Health check
router.get('/health', healthController.getHealth);

// Auth
router.use('/auth', authRoutes);

// Categories
router.use('/categories', categoriesRoutes);

// Transactions
router.use('/transactions', transactionsRoutes);

router.use('/reports', reportsRoutes);
router.use('/ai', aiRoutes);

module.exports = router;