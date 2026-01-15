const categoriesService = require('../services/categories.service');
const { successResponse } = require('../utils/apiResponse');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query; // optional: "income" | "expense"
    const categories = await categoriesService.getCategories(userId, type);

    return successResponse(res, { categories }, 200);
  } catch (err) {
    return next(err);
  }
};

// POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, type } = req.body;

    const category = await categoriesService.createCategory(userId, { name, type });

    return successResponse(res, { category }, 201);
  } catch (err) {
    return next(err);
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const categoryId = parseInt(req.params.id, 10);
    const { name, type } = req.body;

    const category = await categoriesService.updateCategory(userId, categoryId, { name, type });

    return successResponse(res, { category }, 200);
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const categoryId = parseInt(req.params.id, 10);

    await categoriesService.deleteCategory(userId, categoryId);

    return successResponse(res, { deleted: true }, 200);
  } catch (err) {
    return next(err);
  }
};