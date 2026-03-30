const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả các route AI đều yêu cầu đăng nhập
router.use(authMiddleware);

router.get('/insights', aiController.getInsights);

module.exports = router;
