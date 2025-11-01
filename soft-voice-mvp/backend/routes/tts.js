import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// TTS語音合成 - 使用Cartesia Sonic API
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: '沒有提供文字內容' });
    }

    console.log('🎵 收到語音合成請求:', text);

    // Cartesia API配置（從環境變數讀取）
    const cartesiaApiKey = process.env.CARTESIA_API_KEY;
    const voiceId = process.env.CARTESIA_VOICE_ID || 'd3cb9a1f-73d1-48d4-8ee9-53183b40e284';
    const modelId = process.env.CARTESIA_TTS_MODEL_ID || 'sonic-3';
    const language = process.env.CARTESIA_LANGUAGE || 'zh';
    const sampleRate = parseInt(process.env.CARTESIA_SAMPLE_RATE) || 44100;

    if (!cartesiaApiKey) {
      return res.status(500).json({ 
        error: 'Cartesia API Key未配置',
        hint: '請在環境變數中設置CARTESIA_API_KEY'
      });
    }

    // 調用Cartesia TTS API
    const response = await axios.post(
      'https://api.cartesia.ai/tts/bytes',
      {
        model_id: modelId,
        transcript: text,
        voice: {
          mode: 'id',
          id: voiceId
        },
        output_format: {
          container: 'wav',
          encoding: 'pcm_f32le',
          sample_rate: sampleRate
        },
        language: language,
        speed: 'normal'
      },
      {
        headers: {
          'X-API-Key': cartesiaApiKey,
          'Cartesia-Version': '2025-04-16',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ 語音合成完成');

    // 回傳音訊檔案
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', response.data.length);
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('❌ TTS錯誤:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '語音合成失敗', 
      details: error.response?.data || error.message 
    });
  }
});

export default router;

