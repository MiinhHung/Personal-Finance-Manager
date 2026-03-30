const { GoogleGenerativeAI } = require('@google/generative-ai');
const transactionRepository = require('../repositories/transaction.repository');

async function getAIInsights(userId) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Fetch transactions for the last 30 days
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - 30);

  const { rows: transactions } = await transactionRepository.getTransactions(userId, {
    fromDate: fromDate.toISOString().split('T')[0],
    toDate: toDate.toISOString().split('T')[0],
    page: 1,
    pageSize: 1000,
  });

  if (transactions.length === 0) {
    return {
      summary: 'Bạn chưa có giao dịch nào trong 30 ngày qua để AI phân tích.',
      suggestions: [],
      analysis: 'Cần thêm dữ liệu để thực hiện phân tích chuyên sâu.',
    };
  }

  // Prepare data for AI
  const transactionSummary = transactions.map(t => ({
    type: t.Type === 1 ? 'Thu nhập' : 'Chi tiêu',
    amount: t.Amount,
    category: t.CategoryName,
    date: t.TransactionDate,
    description: t.Description,
  }));

  const prompt = `
    Bạn là một chuyên gia tư vấn tài chính cá nhân thông minh. 
    Dưới đây là danh sách các giao dịch trong 30 ngày qua của người dùng:
    ${JSON.stringify(transactionSummary, null, 2)}

    Hãy thực hiện các yêu cầu sau:
    1. Phân tích thói quen chi tiêu (những hạng mục nào chi nhiều nhất, có bất thường không).
    2. Đưa ra 3-5 lời khuyên cụ thể để tiết kiệm tiền dựa trên dữ liệu này.
    3. Đề xuất một kế hoạch ngân sách đơn giản cho tháng tới.

    Phản hồi bằng tiếng Việt, dưới định dạng JSON như sau:
    {
      "summary": "Tóm tắt ngắn gọn tình hình tài chính (2-3 câu)",
      "analysis": "Phân tích chi tiết thói quen chi tiêu",
      "suggestions": [
        { "title": "Tiêu đề lời khuyên", "content": "Nội dung lời khuyên chi tiết" }
      ],
      "budgetPlan": "Đề xuất ngân sách"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up JSON response if AI wraps it in markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      summary: 'Không thể phân tích dữ liệu lúc này.',
      analysis: text,
      suggestions: [],
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Lỗi khi gọi AI Advisor: ' + error.message);
  }
}

module.exports = {
  getAIInsights,
};
