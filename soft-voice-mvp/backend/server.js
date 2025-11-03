import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sttRouter from './routes/stt.js';
import llmRouter from './routes/llm.js';
import ttsRouter from './routes/tts.js';
import cartesiaTestRouter from './routes/cartesia-test.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 銝剝?隞?app.use(cors());
app.use(express.json());

// 頝舐
app.use('/api/stt', sttRouter);
app.use('/api/llm', llmRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/cartesia', cartesiaTestRouter);

// ?亙熒瑼Ｘ
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '隤除??蝡舫?銵葉' });
});

// ?航炊??
app.use((err, req, res, next) => {
  console.error('?航炊:', err);
  res.status(500).json({ error: '?折隡箸??券隤? });
});

app.listen(PORT, () => {
  console.log(?? 隤除??蝡舫?銵 http://localhost: + PORT);
  console.log(??STT 頝舐: /api/stt);
  console.log(??LLM 頝舐: /api/llm);
  console.log(??TTS 頝舐: /api/tts);
  console.log(??Cartesia 皜祈岫頝舐: /api/cartesia/greeting);
  console.log(? ?勗?頠歇撠梁?嚚);
});