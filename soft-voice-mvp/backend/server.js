import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sttRouter from './routes/stt.js';
import llmRouter from './routes/llm.js';
import ttsRouter from './routes/tts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/stt', sttRouter);
app.use('/api/llm', llmRouter);
app.use('/api/tts', ttsRouter);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '語氣靈後端運行中' });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('錯誤:', err);
  res.status(500).json({ error: '內部伺服器錯誤' });
});

app.listen(PORT, () => {
  console.log(`🚀 語氣靈後端運行於 http://localhost:${PORT}`);
  console.log(`✅ STT 路由: /api/stt`);
  console.log(`✅ LLM 路由: /api/llm`);
  console.log(`✅ TTS 路由: /api/tts`);
  console.log(`🌸 花小軟已就緒～`);
});

