import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer配置
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// STT語音轉文字 - 使用OpenAI Whisper
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有上傳音訊檔案' });
    }

    console.log('🎤 收到語音轉文字請求');

    // 使用OpenAI Whisper API
    // OpenAI SDK 支援 Buffer 作為 file 參數
    const transcription = await openai.audio.transcriptions.create({
      file: req.file.buffer,
      model: 'whisper-1',
      language: 'zh', // 指定中文
    });

    console.log('✅ 語音識別完成:', transcription.text);

    res.json({ text: transcription.text });
    
  } catch (error) {
    console.error('❌ STT錯誤:', error);
    res.status(500).json({ error: '語音轉文字失敗', details: error.message });
  }
});

export default router;

