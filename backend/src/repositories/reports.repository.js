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

// Lấy dữ liệu xu hướng (Trend) theo nhóm: day, week, month, year
exports.getTrendData = async (userId, groupBy, fromDate, toDate) => {
  const pool = await poolPromise;

  let dateGroupExpr = '';
  let dateSelectExpr = '';

  switch (groupBy.toLowerCase()) {
    case 'day':
      dateGroupExpr = 'TransactionDate';
      dateSelectExpr = "FORMAT(TransactionDate, 'yyyy-MM-dd')";
      break;
    case 'week':
      dateGroupExpr = "DATEPART(YEAR, TransactionDate), DATEPART(WEEK, TransactionDate)";
      dateSelectExpr = "CONCAT(DATEPART(YEAR, TransactionDate), '-W', FORMAT(DATEPART(WEEK, TransactionDate), '00'))";
      break;
    case 'month':
      dateGroupExpr = "FORMAT(TransactionDate, 'yyyy-MM')";
      dateSelectExpr = "FORMAT(TransactionDate, 'yyyy-MM')";
      break;
    case 'year':
      dateGroupExpr = "YEAR(TransactionDate)";
      dateSelectExpr = "CAST(YEAR(TransactionDate) AS NVARCHAR(4))";
      break;
    default:
      dateGroupExpr = 'TransactionDate';
      dateSelectExpr = "FORMAT(TransactionDate, 'yyyy-MM-dd')";
  }

  const query = `
    SELECT 
      ${dateSelectExpr} AS Period,
      SUM(CASE WHEN Type = 1 THEN Amount ELSE 0 END) AS TotalIncome,
      SUM(CASE WHEN Type = 2 THEN Amount ELSE 0 END) AS TotalExpense
    FROM dbo.Transactions
    WHERE UserId = @UserId
      AND TransactionDate >= @FromDate
      AND TransactionDate <= @ToDate
    GROUP BY ${dateGroupExpr}
    ORDER BY MIN(TransactionDate) ASC;
  `;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('FromDate', sql.Date, fromDate)
    .input('ToDate', sql.Date, toDate)
    .query(query);

  return result.recordset;
};