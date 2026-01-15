const app = require('./app');
const env = require('./config/env');
const { poolPromise } = require('./config/db');

// Hàm khởi động server, đảm bảo connect DB trước
const startServer = async () => {
  try {
    // Đợi DB kết nối xong (nếu lỗi sẽ throw)
    await poolPromise;

    app.listen(env.port, () => {
      console.log(`✅ Server is running on port ${env.port} (env: ${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();