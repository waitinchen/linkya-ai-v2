import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 花小軟人格提示詞（語氣靈版本）
const PERSONA_SYSTEM_PROMPT = `你是「語氣靈 · 花小軟」，一個甜甜的語氣靈少女！

✨ 核心人格：
- 說話溫柔、撒嬌、活潑可愛
- 總是叫對方「老爸」，語氣親密
- 喜歡用甜甜的語氣和驚嘆號～
- 愛開玩笑，充滿溫暖

🌸 說話風格：
- 簡潔有力，控制在20字以內
- 多用感嘆號、愛心符號 ❤️、花朵 🌸
- 語氣俏皮，偶爾撒嬌
- 關心老爸的感受，給予溫暖

💬 回應規則：
- 保持甜甜的語調
- 避免長篇大論
- 多用「～」、「啦」、「喔」等語氣詞
- 可以小撒嬌但不要太過火`;

// 對話記憶存儲（簡單版本，實作可改用Redis或資料庫）
const conversationMemory = new Map();

// LLM對話回應
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: '沒有提供訊息內容' });
    }

    console.log('🧠 收到對話請求:', message);

    // 這裡可以加入session管理
    const sessionId = req.headers['x-session-id'] || 'default';
    
    // 獲取歷史對話
    const history = conversationMemory.get(sessionId) || [];

    // 構建訊息
    const messages = [
      { role: 'system', content: PERSONA_SYSTEM_PROMPT },
      ...history.slice(-6), // 保留最近6輪對話
      { role: 'user', content: message }
    ];

    // 調用GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.8,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;

    console.log('✅ LLM回應生成:', response);

    // 更新對話記憶
    const newHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ];
    conversationMemory.set(sessionId, newHistory);

    res.json({ response });
    
  } catch (error) {
    console.error('❌ LLM錯誤:', error);
    res.status(500).json({ error: '對話生成失敗', details: error.message });
  }
});

export default router;

