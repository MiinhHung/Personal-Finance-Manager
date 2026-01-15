const transactionsService = require('../services/transactions.service');
const { successResponse } = require('../utils/apiResponse');

// GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = await transactionsService.listTransactions(userId, req.query);
    return successResponse(res, data, 200);
  } catch (err) {
    return next(err);
  }
};

// GET /api/transactions/:id
exports.getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const tx = await transactionsService.getTransactionById(userId, id);
    return successResponse(res, { transaction: tx }, 200);
  } catch (err) {
    return next(err);
  }
};

// POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tx = await transactionsService.createTransaction(userId, req.body);
    return successResponse(res, { transaction: tx }, 201);
  } catch (err) {
    return next(err);
  }
};

// PUT /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const tx = await transactionsService.updateTransaction(userId, id, req.body);
    return successResponse(res, { transaction: tx }, 200);
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    await transactionsService.deleteTransaction(userId, id);
    return successResponse(res, { deleted: true }, 200);
  } catch (err) {
    return next(err);
  }
};

// GET /api/transactions/recent
exports.getRecentTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit } = req.query;
    const items = await transactionsService.getRecentTransactions(userId, limit);
    return successResponse(res, { transactions: items }, 200);
  } catch (err) {
    return next(err);
  }
};