// Middleware xử lý lỗi tập trung
// Dùng ở cuối chuỗi middleware trong app.js

module.exports = (err, req, res, next) => {
  console.error('Error handler caught:', err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};