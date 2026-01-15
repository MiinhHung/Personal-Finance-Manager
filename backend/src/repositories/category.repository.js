const { sql, poolPromise } = require('../config/db');

// Lấy tất cả category (system + của user) cho 1 user
exports.getCategoriesForUser = async (userId, type) => {
  const pool = await poolPromise;
  const request = pool.request().input('UserId', sql.Int, userId);

  let query = `
    SELECT CategoryId, UserId, Name, Type, IsSystem, CreatedAt
    FROM dbo.Categories
    WHERE (UserId IS NULL OR UserId = @UserId)
  `;

  if (type) {
    request.input('Type', sql.TinyInt, type);
    query += ' AND Type = @Type';
  }

  query += ' ORDER BY IsSystem DESC, Name ASC';

  const result = await request.query(query);
  return result.recordset;
};

// Kiểm tra trùng tên category (system hoặc user)
exports.getCategoryByNameForUserOrSystem = async (userId, name, type) => {
  const pool = await poolPromise;
  const request = pool.request()
    .input('Name', sql.NVarChar(100), name);

  let query = `
    SELECT TOP 1 CategoryId, UserId, Name, Type, IsSystem
    FROM dbo.Categories
    WHERE Name = @Name
      AND (UserId IS NULL OR UserId = @UserId)
  `;

  request.input('UserId', sql.Int, userId);

  if (type) {
    request.input('Type', sql.TinyInt, type);
    query += ' AND Type = @Type';
  }

  const result = await request.query(query);
  return result.recordset[0] || null;
};

// Tạo category mới cho user
exports.createUserCategory = async (userId, { name, type }) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('Name', sql.NVarChar(100), name)
    .input('Type', sql.TinyInt, type)
    .query(`
      INSERT INTO dbo.Categories (UserId, Name, Type, IsSystem)
      OUTPUT INSERTED.CategoryId, INSERTED.UserId, INSERTED.Name, INSERTED.Type, INSERTED.IsSystem, INSERTED.CreatedAt
      VALUES (@UserId, @Name, @Type, 0)
    `);

  return result.recordset[0];
};

// Lấy category thuộc về user (không phải system)
exports.getUserCategoryById = async (userId, categoryId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('CategoryId', sql.Int, categoryId)
    .query(`
      SELECT CategoryId, UserId, Name, Type, IsSystem, CreatedAt
      FROM dbo.Categories
      WHERE CategoryId = @CategoryId
        AND UserId = @UserId
        AND IsSystem = 0
    `);

  return result.recordset[0] || null;
};

// Cập nhật category của user
exports.updateUserCategory = async (userId, categoryId, { name, type }) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('CategoryId', sql.Int, categoryId)
    .input('Name', sql.NVarChar(100), name)
    .input('Type', sql.TinyInt, type)
    .query(`
      UPDATE dbo.Categories
      SET Name = @Name,
          Type = @Type
      OUTPUT INSERTED.CategoryId, INSERTED.UserId, INSERTED.Name, INSERTED.Type, INSERTED.IsSystem, INSERTED.CreatedAt
      WHERE CategoryId = @CategoryId
        AND UserId = @UserId
        AND IsSystem = 0
    `);

  return result.recordset[0] || null;
};

// Xoá category của user
exports.deleteUserCategory = async (userId, categoryId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .input('CategoryId', sql.Int, categoryId)
    .query(`
      DELETE FROM dbo.Categories
      WHERE CategoryId = @CategoryId
        AND UserId = @UserId
        AND IsSystem = 0
    `);

  return result.rowsAffected[0] > 0;
};