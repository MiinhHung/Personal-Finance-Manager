const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Hash mật khẩu trước khi lưu DB
exports.hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};

// So sánh mật khẩu user nhập với hash trong DB
exports.comparePassword = async (plainPassword, passwordHash) => {
  return bcrypt.compare(plainPassword, passwordHash);
};