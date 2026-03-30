require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:", data.models.map(m => m.name));
    } else {
      console.log("NO MODELS FOUND:", data);
    }
  } catch (error) {
    console.error("ERROR:", error);
  }
}
testModels();
