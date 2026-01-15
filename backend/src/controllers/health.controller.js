const { poolPromise } = require('../config/db');

// Health check controller
// Gọi 1 query đơn giản tới DB để kiểm tra kết nối.
exports.getHealth = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS currentTime');

    return res.status(200).json({
      success: true,
      data: {
        api: 'OK',
        database: 'OK',
        currentTime: result.recordset[0].currentTime,
      },
    });
  } catch (err) {
    err.code = 'HEALTHCHECK_FAILED';
    return next(err);
  }
};