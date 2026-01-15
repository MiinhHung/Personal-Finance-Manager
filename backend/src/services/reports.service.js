const reportsRepository = require('../repositories/reports.repository');
const { transactionTypeFromString } = require('../utils/transactionType');

class ReportsService {
  // Summary theo tháng
  async getMonthlySummary(userId, monthParam) {
    let monthStr = monthParam;

    // Nếu không truyền month => mặc định tháng hiện tại (YYYY-MM)
    if (!monthStr) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      monthStr = `${y}-${m}`;
    }

    if (!/^\d{4}-\d{2}$/.test(monthStr)) {
      const err = new Error('month must be in format YYYY-MM');
      err.statusCode = 400;
      err.code = 'INVALID_MONTH_FORMAT';
      throw err;
    }

    const [yearStr, monthNumStr] = monthStr.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthNumStr, 10) - 1; // 0-based

    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      const err = new Error('Invalid month');
      err.statusCode = 400;
      err.code = 'INVALID_MONTH';
      throw err;
    }

    const fromDate = new Date(year, monthIndex, 1);
    const toDateExclusive = new Date(year, monthIndex + 1, 1); // đầu tháng sau

    const raw = await reportsRepository.getSummaryForPeriod(userId, fromDate, toDateExclusive);

    const totalIncome = raw.TotalIncome ? Number(raw.TotalIncome) : 0;
    const totalExpense = raw.TotalExpense ? Number(raw.TotalExpense) : 0;

    return {
      month: monthStr,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  // Tổng theo danh mục
  async getByCategory(userId, { type, from, to }) {
    if (!type) {
      const err = new Error('type is required (income or expense)');
      err.statusCode = 400;
      err.code = 'TYPE_REQUIRED';
      throw err;
    }

    const dbType = transactionTypeFromString(type);
    if (!dbType) {
      const err = new Error('type must be "income" or "expense"');
      err.statusCode = 400;
      err.code = 'INVALID_TYPE';
      throw err;
    }

    if (!from || !to) {
      const err = new Error('from and to are required (YYYY-MM-DD)');
      err.statusCode = 400;
      err.code = 'DATE_RANGE_REQUIRED';
      throw err;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      const err = new Error('from/to must be valid dates (YYYY-MM-DD)');
      err.statusCode = 400;
      err.code = 'INVALID_DATE_RANGE';
      throw err;
    }

    const rows = await reportsRepository.getAmountByCategory(userId, dbType, fromDate, toDate);

    return rows.map((row) => ({
      categoryId: row.CategoryId,
      categoryName: row.CategoryName,
      totalAmount: Number(row.TotalAmount),
    }));
  }
}

module.exports = new ReportsService();