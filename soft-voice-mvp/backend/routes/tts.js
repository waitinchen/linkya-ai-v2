import express from 'express';
import dotenv from 'dotenv';
import { streamTextToSpeech } from '../tts/elevenlabs.js';

dotenv.config();

const router = express.Router();

// TTS語音合成 - ElevenLabs Streaming
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: '沒有提供文字內容' });
    }

    console.log('🎵 ElevenLabs TTS 請求:', text);

    const { stream, contentType } = await streamTextToSpeech({ text });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-store');

    stream.on('error', (error) => {
      console.error('ElevenLabs 串流發生錯誤:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: '語音串流失敗' });
      } else {
        res.end();
      }
    });

    stream.pipe(res);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : '無法完成語音合成';

    console.error('❌ TTS錯誤:', message);
    res.status(500).json({
      error: '語音合成失敗',
      details: message,
    });
  }
});

export default router;
