import dotenv from 'dotenv';
import { Readable } from 'node:stream';

dotenv.config();

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID =
  process.env.ELEVEN_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // ElevenLabs Bella (fallback)
const DEFAULT_MODEL_ID = process.env.ELEVEN_MODEL_ID || 'eleven_multilingual_v2';
const DEFAULT_STABILITY = Number(process.env.ELEVEN_STABILITY ?? 0.45);
const DEFAULT_SIMILARITY = Number(process.env.ELEVEN_SIMILARITY ?? 0.75);
const DEFAULT_STYLE = Number(process.env.ELEVEN_STYLE ?? 0.5);
const DEFAULT_OPTIMIZE_LATENCY = Number(
  process.env.ELEVEN_OPTIMIZE_LATENCY ?? 2
); // 0-4, smaller = lower latency

/**
 * 向 ElevenLabs Streaming TTS 發送請求並回傳 Node.js Readable stream。
 * @param {object} options
 * @param {string} options.text - 要合成的文字
 * @param {string} [options.voiceId] - Voice ID
 * @param {string} [options.modelId] - TTS model
 * @returns {Promise<{ stream: import('node:stream').Readable, contentType: string }>}
 */
export async function streamTextToSpeech({
  text,
  voiceId = DEFAULT_VOICE_ID,
  modelId = DEFAULT_MODEL_ID,
} = {}) {
  if (!ELEVEN_API_KEY) {
    throw new Error('ELEVEN_API_KEY 未設置，無法呼叫 ElevenLabs TTS');
  }

  if (!text || !text.trim()) {
    throw new Error('缺少文字內容，無法生成語音');
  }

  const requestBody = {
    text,
    model_id: modelId,
    optimize_streaming_latency: DEFAULT_OPTIMIZE_LATENCY,
    voice_settings: {
      stability: DEFAULT_STABILITY,
      similarity_boost: DEFAULT_SIMILARITY,
      style: DEFAULT_STYLE,
      use_speaker_boost: true,
    },
    output_format: 'mpeg_44100',
  };

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '未知錯誤');
    throw new Error(
      `ElevenLabs TTS 請求失敗: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  if (!response.body) {
    throw new Error('ElevenLabs 回覆未包含串流音訊');
  }

  const stream = Readable.fromWeb(response.body);
  const contentType = response.headers.get('Content-Type') || 'audio/mpeg';

  return { stream, contentType };
}

