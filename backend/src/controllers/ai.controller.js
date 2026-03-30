const aiService = require('../services/ai.service');

async function getInsights(req, res, next) {
  try {
    const userId = req.user.userId;
    const insights = await aiService.getAIInsights(userId);
    
    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInsights,
};
