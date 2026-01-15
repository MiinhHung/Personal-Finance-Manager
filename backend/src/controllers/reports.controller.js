const reportsService = require('../services/reports.service');
const { successResponse } = require('../utils/apiResponse');

// GET /api/reports/summary?month=YYYY-MM
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { month } = req.query;

    const summary = await reportsService.getMonthlySummary(userId, month);

    return successResponse(res, { summary }, 200);
  } catch (err) {
    return next(err);
  }
};

// GET /api/reports/by-category?from=...&to=...&type=expense
exports.getByCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { from, to, type } = req.query;

    const data = await reportsService.getByCategory(userId, { from, to, type });

    return successResponse(res, { items: data }, 200);
  } catch (err) {
    return next(err);
  }
};