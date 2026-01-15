const transactionRepository = require('../repositories/transaction.repository');
const { TRANSACTION_TYPE, transactionTypeFromString, transactionTypeToString } = require('../utils/transactionType');

// map row DB -> DTO cho API
const mapRowToTransaction = (row) => ({
  transactionId: row.TransactionId,
  type: transactionTypeToString(row.Type),
  amount: Number(row.Amount),
  description: row.Description,
  transactionDate: row.TransactionDate,
  category: row.CategoryId
    ? {
        categoryId: row.CategoryId,
        name: row.CategoryName || null,
      }
    : null,
  createdAt: row.CreatedAt,
  updatedAt: row.UpdatedAt,
});

class TransactionsService {
  validateAndParsePayload(payload) {
    const { amount, type, categoryId, description, transactionDate } = payload;

    const dbType = transactionTypeFromString(type);
    if (!dbType) {
      const err = new Error('Invalid type. Must be "income" or "expense".');
      err.statusCode = 400;
      err.code = 'INVALID_TRANSACTION_TYPE';
      throw err;
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      const err = new Error('Amount must be a positive number');
      err.statusCode = 400;
      err.code = 'INVALID_AMOUNT';
      throw err;
    }

    if (!transactionDate) {
      const err = new Error('transactionDate is required (YYYY-MM-DD)');
      err.statusCode = 400;
      err.code = 'INVALID_DATE';
      throw err;
    }

    const dateObj = new Date(transactionDate);
    if (Number.isNaN(dateObj.getTime())) {
      const err = new Error('transactionDate must be a valid date (YYYY-MM-DD)');
      err.statusCode = 400;
      err.code = 'INVALID_DATE';
      throw err;
    }

    let catId = null;
    if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
      const parsed = parseInt(categoryId, 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        const err = new Error('categoryId must be a positive integer');
        err.statusCode = 400;
        err.code = 'INVALID_CATEGORY_ID';
        throw err;
      }
      catId = parsed;
    }

    return {
      dbType,
      amount: numAmount,
      categoryId: catId,
      description: description || null,
      dateObj,
    };
  }

  // Tạo giao dịch
  async createTransaction(userId, payload) {
    const { dbType, amount, categoryId, description, dateObj } = this.validateAndParsePayload(payload);

    const transactionId = await transactionRepository.createTransaction(userId, {
      categoryId,
      type: dbType,
      amount,
      description,
      transactionDate: dateObj,
    });

    const row = await transactionRepository.getTransactionById(userId, transactionId);
    if (!row) {
      const err = new Error('Failed to load created transaction');
      err.statusCode = 500;
      err.code = 'TRANSACTION_CREATE_LOAD_FAILED';
      throw err;
    }

    return mapRowToTransaction(row);
  }

  // Lấy 1 transaction
  async getTransactionById(userId, transactionId) {
    const id = parseInt(transactionId, 10);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error('Invalid transaction id');
      err.statusCode = 400;
      err.code = 'INVALID_TRANSACTION_ID';
      throw err;
    }

    const row = await transactionRepository.getTransactionById(userId, id);
    if (!row) {
      const err = new Error('Transaction not found');
      err.statusCode = 404;
      err.code = 'TRANSACTION_NOT_FOUND';
      throw err;
    }

    return mapRowToTransaction(row);
  }

  // Cập nhật
  async updateTransaction(userId, transactionId, payload) {
    const id = parseInt(transactionId, 10);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error('Invalid transaction id');
      err.statusCode = 400;
      err.code = 'INVALID_TRANSACTION_ID';
      throw err;
    }

    const { dbType, amount, categoryId, description, dateObj } = this.validateAndParsePayload(payload);

    const updated = await transactionRepository.updateTransaction(userId, id, {
      categoryId,
      type: dbType,
      amount,
      description,
      transactionDate: dateObj,
    });

    if (!updated) {
      const err = new Error('Transaction not found or not owned by user');
      err.statusCode = 404;
      err.code = 'TRANSACTION_NOT_FOUND';
      throw err;
    }

    const row = await transactionRepository.getTransactionById(userId, id);
    return mapRowToTransaction(row);
  }

  // Xoá
  async deleteTransaction(userId, transactionId) {
    const id = parseInt(transactionId, 10);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error('Invalid transaction id');
      err.statusCode = 400;
      err.code = 'INVALID_TRANSACTION_ID';
      throw err;
    }

    const deleted = await transactionRepository.deleteTransaction(userId, id);
    if (!deleted) {
      const err = new Error('Transaction not found or not owned by user');
      err.statusCode = 404;
      err.code = 'TRANSACTION_NOT_FOUND';
      throw err;
    }

    return true;
  }

  // Danh sách có phân trang + filter
  async listTransactions(userId, query) {
    const page = parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const pageSize = parseInt(query.pageSize, 10) > 0 ? parseInt(query.pageSize, 10) : 10;

    let dbType = null;
    if (query.type) {
      dbType = transactionTypeFromString(query.type);
      if (!dbType) {
        const err = new Error('type must be "income" or "expense"');
        err.statusCode = 400;
        err.code = 'INVALID_TRANSACTION_TYPE';
        throw err;
      }
    }

    let categoryId = null;
    if (query.categoryId) {
      const parsed = parseInt(query.categoryId, 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        const err = new Error('categoryId must be a positive integer');
        err.statusCode = 400;
        err.code = 'INVALID_CATEGORY_ID';
        throw err;
      }
      categoryId = parsed;
    }

    let fromDate = null;
    if (query.from) {
      const d = new Date(query.from);
      if (Number.isNaN(d.getTime())) {
        const err = new Error('from must be a valid date (YYYY-MM-DD)');
        err.statusCode = 400;
        err.code = 'INVALID_FROM_DATE';
        throw err;
      }
      fromDate = d;
    }

    let toDate = null;
    if (query.to) {
      const d = new Date(query.to);
      if (Number.isNaN(d.getTime())) {
        const err = new Error('to must be a valid date (YYYY-MM-DD)');
        err.statusCode = 400;
        err.code = 'INVALID_TO_DATE';
        throw err;
      }
      toDate = d;
    }

    const { totalCount, rows } = await transactionRepository.getTransactions(userId, {
      type: dbType,
      categoryId,
      fromDate,
      toDate,
      page,
      pageSize,
    });

    return {
      page,
      pageSize,
      totalCount,
      items: rows.map(mapRowToTransaction),
    };
  }

  // Giao dịch gần nhất cho dashboard
  async getRecentTransactions(userId, limitParam) {
    const limit = parseInt(limitParam, 10) > 0 ? parseInt(limitParam, 10) : 5;

    const rows = await transactionRepository.getRecentTransactions(userId, limit);
    return rows.map(mapRowToTransaction);
  }
}

module.exports = new TransactionsService();