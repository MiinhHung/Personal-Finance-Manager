const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const result = await authService.register({ fullName, email, password });

    return successResponse(res, result, 201);
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return successResponse(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await authService.getCurrentUser(userId);

    return successResponse(res, { user }, 200);
  } catch (err) {
    return next(err);
  }
};