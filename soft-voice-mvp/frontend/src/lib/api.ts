const API_BASE = '/api';

export interface STTResponse {
  text: string;
}

export interface LLMResponse {
  response: string;
}

export const api = {
  // 語音轉文字
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await fetch(`${API_BASE}/stt`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('STT failed');
    }
    
    const data: STTResponse = await response.json();
    return data.text;
  },

  // LLM對話
  async chatWithLLM(message: string): Promise<string> {
    const response = await fetch(`${API_BASE}/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('LLM failed');
    }
    
    const data: LLMResponse = await response.json();
    return data.response;
  },

  // TTS語音合成（串流）
  async streamSpeech(text: string): Promise<{ stream: ReadableStream<Uint8Array>; mimeType: string }> {
    const response = await fetch(`${API_BASE}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error('TTS failed');
    }

    if (!response.body) {
      throw new Error('瀏覽器不支援串流播放');
    }

    const mimeType = response.headers.get('Content-Type') || 'audio/mpeg';
    return {
      stream: response.body,
      mimeType,
    };
  },
};
