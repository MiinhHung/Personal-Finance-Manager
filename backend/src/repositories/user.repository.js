const { sql, poolPromise } = require('../config/db');

// Tìm user theo email
exports.getUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('Email', sql.NVarChar(255), email)
    .query(`
      SELECT UserId, FullName, Email, PasswordHash, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Users
      WHERE Email = @Email
    `);

  return result.recordset[0] || null;
};

// Tìm user theo Id
exports.getUserById = async (userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .query(`
      SELECT UserId, FullName, Email, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Users
      WHERE UserId = @UserId
    `);

  return result.recordset[0] || null;
};

// Tạo user mới
exports.createUser = async ({ fullName, email, passwordHash }) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('FullName', sql.NVarChar(100), fullName)
    .input('Email', sql.NVarChar(255), email)
    .input('PasswordHash', sql.NVarChar(255), passwordHash)
    .query(`
      INSERT INTO dbo.Users (FullName, Email, PasswordHash)
      OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.IsActive, INSERTED.CreatedAt, INSERTED.UpdatedAt
      VALUES (@FullName, @Email, @PasswordHash)
    `);

  return result.recordset[0];
};