const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware chung
app.use(helmet());         // security headers
app.use(cors());           // cho phép CORS
app.use(express.json());   // parse JSON body
app.use(morgan('dev'));    // log request

// Routes chính, prefix /api
app.use('/api', routes);

// 404 handler cho route không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

module.exports = app;