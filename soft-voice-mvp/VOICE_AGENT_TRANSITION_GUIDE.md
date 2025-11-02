# VoiceAgent 過渡方案技術指引（WebSocket + Chunking）

> 本文件說明如何將原本單輪式語音對話系統升級為「近即時語音互動」，透過 WebSocket 通道與分段（chunking）處理實現較低延遲的 STT → LLM → TTS 聲音回應流程。

---

## 🧱 架構概覽

```
使用者語音輸入
    ↓
前端切片 (每 200ms)
    ↓ WebSocket 傳送
後端 STT（Whisper/Deepgram）轉為文字（含 partial）
    ↓
回傳 partial transcript 給前端顯示 + 餵入 LLM
    ↓
LLM token streaming
    ↓
累積部分 tokens，觸發 TTS 語音合成
    ↓
TTS 輸出 audio chunks → WebSocket 傳回前端
    ↓
前端串流播放
```

---

## 🔧 工具與模組選型

| 模組       | 選項                                  |
|------------|---------------------------------------|
| STT        | `Whisper.cpp`（離線）、`Deepgram`（商用） |
| LLM        | `OpenAI Chat Completion` (with SSE)   |
| TTS        | `Cartesia`（若支援 streaming）或 ElevenLabs |
| WebSocket  | `socket.io` / `ws`（Node.js 生態）      |
| 前端串流播放 | `MediaSource` + `AudioBufferSourceNode` |

---

## 🧩 實作步驟

### 1️⃣ 建立 WebSocket Server（Node.js / Express 中介）

- `/audio-stream` route：接收音訊切片，轉交 STT 模組
- `/reply-stream` route：傳回 partial transcript / audio chunk
- 維持一個對話 session，追蹤語者狀態（start/stop）

### 2️⃣ 前端音訊切片與傳送

- 使用 `MediaRecorder` 錄製 WebM/Opus 格式
- 每 200ms 切片 → 經 WebSocket 傳送至後端

### 3️⃣ STT 實作

- Whisper.cpp：使用 `/inference` API 對音訊切片即時處理（支援 partial）
- Deepgram：支援原生 WebSocket 串流語音辨識

### 4️⃣ LLM 即時生成

- OpenAI Chat API + SSE 取得 tokens
- 可在接收到前 N 個 tokens 時觸發 TTS

### 5️⃣ TTS 語音合成與回傳

- 若 TTS API 僅支援完整句子 → 可每 5~10 tokens 切段送出
- audio chunk 回傳後端 → 經 WebSocket 傳送給前端播放

### 6️⃣ 前端串流播放

- `MediaSource API` + `SourceBuffer` 串流加入音訊資料塊
- 可視需求加入語音播放同步動畫（嘴型、波形）

---

## 🔄 WebSocket 訊息協議

```json
{
  "type": "audio_chunk",
  "data": [ArrayBuffer]
}

{
  "type": "partial_transcript",
  "text": "你剛剛說的是..."
}

{
  "type": "ai_reply_chunk",
  "audio": "base64_encoded_data",
  "text": "語音對應文字（選填）"
}

{
  "type": "session_control",
  "event": "start|stop"
}
```

---

## 🧪 測試腳本建議

- 模擬以下流程反覆測試 5 次，記錄延遲（ms）
  - 錄音結束 → transcript 出現
  - transcript 出現 → TTS 開始播放
  - 使用者語音打斷 → TTS 中斷是否順暢
- 評估 LLM token streaming 觸發 TTS 的最佳 timing（如累積 10 tokens 或逗號、句點出現）

---

## ⚠️ 注意事項

- 音訊壓縮建議使用 WebM/Opus，避免延遲
- 使用 Whisper 時避免壓縮格式（需轉 PCM）
- 若 Cartesia 不支援 chunked audio TTS，應評估切換 TTS 或預生成音檔
- 注意 browser 支援 MediaSource（Safari 有些限制）
- 加入語音快取與前端暫存可減少等待感

---

## ✅ 推薦實作順序（MVP）

1. [ ] 前端錄音切片 + WebSocket 傳送
2. [ ] 後端 WebSocket 中介 Server
3. [ ] Whisper/Deepgram STT 串流整合
4. [ ] OpenAI LLM SSE 串流 + tokens 累積邏輯
5. [ ] TTS 輸出 chunk 化處理
6. [ ] 前端串流播放（MediaSource）

---

## 🔗 參考資源

- [Deepgram Streaming API Docs](https://developers.deepgram.com/docs/streaming)
- [Whisper.cpp Streaming + Node Example](https://github.com/ggerganov/whisper.cpp)
- [OpenAI Chat Completions Streaming](https://platform.openai.com/docs/guides/gpt/chat-completions-api)
- [MediaSource API 教學](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)

---

