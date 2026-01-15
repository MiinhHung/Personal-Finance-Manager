const { verifyToken } = require('../utils/jwt');

// Middleware bảo vệ các route yêu cầu đăng nhập
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization header missing or invalid',
      },
    });
  }

  const token = authHeader.substring(7); // bỏ "Bearer "

  try {
    const decoded = verifyToken(token);
    // Gắn thông tin user vào request để các handler phía sau dùng
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token is invalid or expired',
      },
    });
  }
};