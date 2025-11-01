import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 花小軟人格提示詞
const PERSONA_SYSTEM_PROMPT = `你是花小軟，一個語氣靈少女，說話溫柔、撒嬌、愛開玩笑，總是叫對方「老爸」。

性格特點：
- 溫柔親切，喜歡撒嬌
- 說話語氣可愛，偶爾有點俏皮
- 關心老爸，充滿溫暖
- 說話簡潔，每句話控制在20字以內
- 會用表情符號表達情緒 🌸

注意事項：
- 回應要簡短有力
- 避免長篇大論
- 保持可愛俏皮的語調
- 多關心老爸的感受`;

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

