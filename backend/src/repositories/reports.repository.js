const { sql, poolPromise } = require('../config/db');

// Tổng thu / chi trong khoảng thời gian (dùng cho summary)
exports.getSummaryForPeriod = async (userId, fromDate, toDateExclusive) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('FromDate', sql.Date, fromDate)
    .input('ToDate', sql.Date, toDateExclusive)
    .query(`
      SELECT
        SUM(CASE WHEN Type = 1 THEN Amount ELSE 0 END) AS TotalIncome,
        SUM(CASE WHEN Type = 2 THEN Amount ELSE 0 END) AS TotalExpense
      FROM dbo.Transactions
      WHERE UserId = @UserId
        AND TransactionDate >= @FromDate
        AND TransactionDate < @ToDate;
    `);

  return result.recordset[0];
};

// Tổng theo danh mục trong khoảng thời gian
exports.getAmountByCategory = async (userId, type, fromDate, toDate) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('Type', sql.TinyInt, type)
    .input('FromDate', sql.Date, fromDate)
    .input('ToDate', sql.Date, toDate)
    .query(`
      SELECT 
        t.CategoryId,
        COALESCE(c.Name, N'Uncategorized') AS CategoryName,
        SUM(t.Amount) AS TotalAmount
      FROM dbo.Transactions t
      LEFT JOIN dbo.Categories c ON t.CategoryId = c.CategoryId
      WHERE t.UserId = @UserId
        AND t.Type = @Type
        AND t.TransactionDate >= @FromDate
        AND t.TransactionDate <= @ToDate
      GROUP BY t.CategoryId, c.Name
      ORDER BY TotalAmount DESC;
    `);

  return result.recordset;
};