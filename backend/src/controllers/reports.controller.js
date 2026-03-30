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

// GET /api/reports/trend?from=...&to=...&groupBy=day|week|month|year
exports.getTrend = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { from, to, groupBy } = req.query;

    const data = await reportsService.getTrendData(userId, { from, to, groupBy });

    return successResponse(res, { trend: data }, 200);
  } catch (err) {
    return next(err);
  }
};