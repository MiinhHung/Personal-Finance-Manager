// src/utils/transactionType.js

const TRANSACTION_TYPE = {
  INCOME: 1,
  EXPENSE: 2,
};

// Map số trong DB -> string cho API
const transactionTypeToString = (type) => {
  switch (type) {
    case TRANSACTION_TYPE.INCOME:
      return 'income';
    case TRANSACTION_TYPE.EXPENSE:
      return 'expense';
    default:
      return 'unknown';
  }
};

// Map string từ API -> số trong DB
const transactionTypeFromString = (str) => {
  if (!str) return null;
  const value = str.toLowerCase();
  if (value === 'income') return TRANSACTION_TYPE.INCOME;
  if (value === 'expense') return TRANSACTION_TYPE.EXPENSE;
  return null;
};

module.exports = {
  TRANSACTION_TYPE,
  transactionTypeToString,
  transactionTypeFromString,
};