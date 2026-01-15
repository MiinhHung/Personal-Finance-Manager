const { sql, poolPromise } = require('../config/db');

// Tạo giao dịch mới
async function createTransaction(userId, { categoryId, type, amount, description, transactionDate }) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('CategoryId', sql.Int, categoryId || null)
    .input('Type', sql.TinyInt, type)
    .input('Amount', sql.Decimal(18, 2), amount)
    .input('Description', sql.NVarChar(255), description || null)
    .input('TransactionDate', sql.Date, transactionDate)
    .query(`
      INSERT INTO dbo.Transactions (UserId, CategoryId, Type, Amount, Description, TransactionDate)
      OUTPUT INSERTED.TransactionId
      VALUES (@UserId, @CategoryId, @Type, @Amount, @Description, @TransactionDate);
    `);

  return result.recordset[0].TransactionId;
}

// Lấy 1 giao dịch theo id, đảm bảo thuộc về user
async function getTransactionById(userId, transactionId) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('TransactionId', sql.BigInt, transactionId)
    .query(`
      SELECT 
        t.TransactionId,
        t.UserId,
        t.CategoryId,
        t.Type,
        t.Amount,
        t.Description,
        t.TransactionDate,
        t.CreatedAt,
        t.UpdatedAt,
        c.Name AS CategoryName,
        c.Type AS CategoryType
      FROM dbo.Transactions t
      LEFT JOIN dbo.Categories c ON t.CategoryId = c.CategoryId
      WHERE t.TransactionId = @TransactionId
        AND t.UserId = @UserId;
    `);

  return result.recordset[0] || null;
}

// Cập nhật giao dịch
async function updateTransaction(userId, transactionId, { categoryId, type, amount, description, transactionDate }) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('TransactionId', sql.BigInt, transactionId)
    .input('CategoryId', sql.Int, categoryId || null)
    .input('Type', sql.TinyInt, type)
    .input('Amount', sql.Decimal(18, 2), amount)
    .input('Description', sql.NVarChar(255), description || null)
    .input('TransactionDate', sql.Date, transactionDate)
    .query(`
      UPDATE dbo.Transactions
      SET CategoryId = @CategoryId,
          Type = @Type,
          Amount = @Amount,
          Description = @Description,
          TransactionDate = @TransactionDate,
          UpdatedAt = SYSDATETIME()
      WHERE TransactionId = @TransactionId
        AND UserId = @UserId;
    `);

  return result.rowsAffected[0] > 0;
}

// Xoá giao dịch
async function deleteTransaction(userId, transactionId) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('TransactionId', sql.BigInt, transactionId)
    .query(`
      DELETE FROM dbo.Transactions
      WHERE TransactionId = @TransactionId
        AND UserId = @UserId;
    `);

  return result.rowsAffected[0] > 0;
}

// Lấy danh sách giao dịch có phân trang & filter
async function getTransactions(userId, { type, categoryId, fromDate, toDate, page, pageSize }) {
  const whereClauses = ['t.UserId = @UserId'];

  if (type) whereClauses.push('t.Type = @Type');
  if (categoryId) whereClauses.push('t.CategoryId = @CategoryId');
  if (fromDate) whereClauses.push('t.TransactionDate >= @FromDate');
  if (toDate) whereClauses.push('t.TransactionDate <= @ToDate');

  const whereSql = `WHERE ${whereClauses.join(' AND ')}`;
  const offset = (page - 1) * pageSize;

  const pool = await poolPromise;

  // Đếm tổng số bản ghi
  const countRequest = pool.request().input('UserId', sql.Int, userId);
  if (type) countRequest.input('Type', sql.TinyInt, type);
  if (categoryId) countRequest.input('CategoryId', sql.Int, categoryId);
  if (fromDate) countRequest.input('FromDate', sql.Date, fromDate);
  if (toDate) countRequest.input('ToDate', sql.Date, toDate);

  const countResult = await countRequest.query(`
    SELECT COUNT(*) AS TotalCount
    FROM dbo.Transactions t
    ${whereSql};
  `);

  const totalCount = countResult.recordset[0].TotalCount;

  // Lấy dữ liệu phân trang
  const dataRequest = pool.request().input('UserId', sql.Int, userId);
  if (type) dataRequest.input('Type', sql.TinyInt, type);
  if (categoryId) dataRequest.input('CategoryId', sql.Int, categoryId);
  if (fromDate) dataRequest.input('FromDate', sql.Date, fromDate);
  if (toDate) dataRequest.input('ToDate', sql.Date, toDate);
  dataRequest.input('Offset', sql.Int, offset);
  dataRequest.input('PageSize', sql.Int, pageSize);

  const dataResult = await dataRequest.query(`
    SELECT 
      t.TransactionId,
      t.UserId,
      t.CategoryId,
      t.Type,
      t.Amount,
      t.Description,
      t.TransactionDate,
      t.CreatedAt,
      t.UpdatedAt,
      c.Name AS CategoryName,
      c.Type AS CategoryType
    FROM dbo.Transactions t
    LEFT JOIN dbo.Categories c ON t.CategoryId = c.CategoryId
    ${whereSql}
    ORDER BY t.TransactionDate DESC, t.TransactionId DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
  `);

  return {
    totalCount,
    rows: dataResult.recordset,
  };
}

// Giao dịch gần nhất cho dashboard
async function getRecentTransactions(userId, limit) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('Limit', sql.Int, limit)
    .query(`
      SELECT TOP (@Limit)
        t.TransactionId,
        t.UserId,
        t.CategoryId,
        t.Type,
        t.Amount,
        t.Description,
        t.TransactionDate,
        t.CreatedAt,
        t.UpdatedAt,
        c.Name AS CategoryName,
        c.Type AS CategoryType
      FROM dbo.Transactions t
      LEFT JOIN dbo.Categories c ON t.CategoryId = c.CategoryId
      WHERE t.UserId = @UserId
      ORDER BY t.TransactionDate DESC, t.TransactionId DESC;
    `);

  return result.recordset;
}

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getRecentTransactions,
};