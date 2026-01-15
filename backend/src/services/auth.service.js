const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class AuthService {
  // Đăng ký
  async register({ fullName, email, password }) {
    // Check email tồn tại chưa
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await hashPassword(password);

    const newUser = await userRepository.createUser({
      fullName,
      email,
      passwordHash,
    });

    const token = generateToken({
      userId: newUser.UserId,
      email: newUser.Email,
    });

    return {
      user: {
        userId: newUser.UserId,
        fullName: newUser.FullName,
        email: newUser.Email,
        isActive: newUser.IsActive,
        createdAt: newUser.CreatedAt,
      },
      token,
    };
  }

  // Đăng nhập
  async login({ email, password }) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    if (!user.IsActive) {
      const error = new Error('User account is inactive');
      error.statusCode = 403;
      error.code = 'USER_INACTIVE';
      throw error;
    }

    const isMatch = await comparePassword(password, user.PasswordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = generateToken({
      userId: user.UserId,
      email: user.Email,
    });

    return {
      user: {
        userId: user.UserId,
        fullName: user.FullName,
        email: user.Email,
        isActive: user.IsActive,
        createdAt: user.CreatedAt,
      },
      token,
    };
  }

  // Lấy thông tin user hiện tại từ JWT (userId trong req.user)
  async getCurrentUser(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return {
      userId: user.UserId,
      fullName: user.FullName,
      email: user.Email,
      isActive: user.IsActive,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }
}

module.exports = new AuthService();