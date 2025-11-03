import express from 'express';
import dotenv from 'dotenv';
import { textToSpeech } from '../tts/cartesia.js';

dotenv.config();

const router = express.Router();

const DEFAULT_GREETING = '?雿末嚚??航撠?? 隞予憭拇除?末?ｇ?閬?閬?韏瑕?餉粥韏啣?嚗?;

router.get('/greeting', async (req, res) => {
  try {
    const { text } = req.query;
    const greetingText = text || DEFAULT_GREETING;
    console.log('? [Cartesia Test] ????:', greetingText);
    const audioBuffer = await textToSpeech({ text: greetingText });
    console.log('??[Cartesia Test] ?唾?????, 憭批?:', audioBuffer.length, 'bytes');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Length', audioBuffer.length);
    res.send(audioBuffer);
  } catch (error) {
    console.error('??[Cartesia Test] ?航炊:', error);
    res.status(500).json({ error: '隤??憭望?', details: error.message });
  }
});

export default router;