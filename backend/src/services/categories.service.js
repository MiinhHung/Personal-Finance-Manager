const categoryRepository = require('../repositories/category.repository');
const { TRANSACTION_TYPE, transactionTypeFromString, transactionTypeToString } = require('../utils/transactionType');

class CategoriesService {
  // Lấy danh sách categories cho user
  async getCategories(userId, typeString) {
    let type = null;
    if (typeString) {
      type = transactionTypeFromString(typeString);
      if (!type) {
        const error = new Error('Invalid category type. Must be "income" or "expense".');
        error.statusCode = 400;
        error.code = 'INVALID_CATEGORY_TYPE';
        throw error;
      }
    }

    const rows = await categoryRepository.getCategoriesForUser(userId, type);

    // Map từ DB -> DTO cho API
    return rows.map((row) => ({
      categoryId: row.CategoryId,
      name: row.Name,
      type: transactionTypeToString(row.Type),
      isSystem: row.IsSystem === true || row.IsSystem === 1,
      createdAt: row.CreatedAt,
    }));
  }

  // Tạo category mới cho user
  async createCategory(userId, { name, type }) {
    const dbType = transactionTypeFromString(type);
    if (!dbType) {
      const error = new Error('Invalid category type. Must be "income" or "expense".');
      error.statusCode = 400;
      error.code = 'INVALID_CATEGORY_TYPE';
      throw error;
    }

    // Check trùng tên với category system hoặc category user
    const existing = await categoryRepository.getCategoryByNameForUserOrSystem(userId, name, dbType);
    if (existing) {
      const error = new Error('Category name already exists');
      error.statusCode = 409;
      error.code = 'CATEGORY_NAME_EXISTS';
      throw error;
    }

    const newCat = await categoryRepository.createUserCategory(userId, {
      name,
      type: dbType,
    });

    return {
      categoryId: newCat.CategoryId,
      name: newCat.Name,
      type: transactionTypeToString(newCat.Type),
      isSystem: newCat.IsSystem === true || newCat.IsSystem === 1,
      createdAt: newCat.CreatedAt,
    };
  }

  // Cập nhật category của user
  async updateCategory(userId, categoryId, { name, type }) {
    const dbType = transactionTypeFromString(type);
    if (!dbType) {
      const error = new Error('Invalid category type. Must be "income" or "expense".');
      error.statusCode = 400;
      error.code = 'INVALID_CATEGORY_TYPE';
      throw error;
    }

    // Kiểm tra category có tồn tại & thuộc về user không
    const existingCat = await categoryRepository.getUserCategoryById(userId, categoryId);
    if (!existingCat) {
      const error = new Error('Category not found or not owned by user');
      error.statusCode = 404;
      error.code = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    // Check trùng tên (cho user đó + system)
    const duplicated = await categoryRepository.getCategoryByNameForUserOrSystem(userId, name, dbType);
    if (duplicated && duplicated.CategoryId !== categoryId) {
      const error = new Error('Category name already exists');
      error.statusCode = 409;
      error.code = 'CATEGORY_NAME_EXISTS';
      throw error;
    }

    const updated = await categoryRepository.updateUserCategory(userId, categoryId, {
      name,
      type: dbType,
    });

    if (!updated) {
      const error = new Error('Failed to update category');
      error.statusCode = 500;
      error.code = 'CATEGORY_UPDATE_FAILED';
      throw error;
    }

    return {
      categoryId: updated.CategoryId,
      name: updated.Name,
      type: transactionTypeToString(updated.Type),
      isSystem: updated.IsSystem === true || updated.IsSystem === 1,
      createdAt: updated.CreatedAt,
    };
  }

  // Xoá category của user
  async deleteCategory(userId, categoryId) {
    const existingCat = await categoryRepository.getUserCategoryById(userId, categoryId);
    if (!existingCat) {
      const error = new Error('Category not found or not owned by user');
      error.statusCode = 404;
      error.code = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    const deleted = await categoryRepository.deleteUserCategory(userId, categoryId);
    if (!deleted) {
      const error = new Error('Failed to delete category');
      error.statusCode = 500;
      error.code = 'CATEGORY_DELETE_FAILED';
      throw error;
    }

    return true;
  }
}

module.exports = new CategoriesService();