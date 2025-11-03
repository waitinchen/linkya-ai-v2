import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
const CARTESIA_VOICE_ID = process.env.CARTESIA_VOICE_ID || 'd3cb9a1f-73d1-48d4-8ee9-53183b40e284';
const CARTESIA_MODEL_ID = process.env.CARTESIA_TTS_MODEL_ID || 'sonic-3';
const CARTESIA_LANGUAGE = process.env.CARTESIA_LANGUAGE || 'zh';
const CARTESIA_SAMPLE_RATE = process.env.CARTESIA_SAMPLE_RATE || '44100';

export async function textToSpeech({ text } = {}) {
  if (!CARTESIA_API_KEY) {
    throw new Error('CARTESIA_API_KEY ?芾身蝵?);
  }
  if (!text || !text.trim()) {
    throw new Error('蝻箏???');
  }
  const endpoint = 'https://api.cartesia.ai/tts/bytes';
  try {
    const response = await axios.post(
      endpoint,
      {
        model_id: CARTESIA_MODEL_ID,
        transcript: text,
        voice: { mode: 'id', id: CARTESIA_VOICE_ID },
        output_format: {
          container: 'mp3',
          bitrate: '128k',
          sample_rate: parseInt(CARTESIA_SAMPLE_RATE),
        },
        speed: 'normal',
        generation_config: { speed: 0.7, volume: 1.1, emotion: 'excited' },
      },
      {
        headers: {
          'Cartesia-Version': '2024-06-10',
          'X-API-Key': CARTESIA_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    return Buffer.from(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data 
        ? String.fromCharCode(...new Uint8Array(error.response.data))
        : error.message;
      throw new Error(Cartesia 憭望?:  - );
    }
    throw error;
  }
}