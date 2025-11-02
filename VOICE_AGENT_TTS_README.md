# 🎙️ VoiceAgent ElevenLabs Streaming TTS 指南

本文件說明語氣靈 Voice Agent 如何在「單句輪流播放」情境下串接 ElevenLabs Streaming Text-to-Speech (TTS)，並敘述後端/前端調整與測試方式。

---

## ✅ 功能摘要

- 透過 ElevenLabs Streaming API 取得低延遲語音回覆（`POST /api/tts`）
- 後端直接串流將音訊 chunk 推送給前端，無需等待完整音檔
- 前端使用 `MediaSource` 與客製 `StreamingAudioPlayer` 元件邊收邊播
- 維持原有對話流程（錄音 → STT → LLM → TTS 播放）

---

## 🛠 環境設定

更新 `soft-voice-mvp/backend/.env`：

```env
# ElevenLabs
ELEVEN_API_KEY=sk-xxxx
# 選填：換聲線與模型
ELEVEN_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVEN_MODEL_ID=eleven_multilingual_v2
ELEVEN_STABILITY=0.45
ELEVEN_SIMILARITY=0.75
ELEVEN_STYLE=0.5
ELEVEN_OPTIMIZE_LATENCY=2
```

> **備註**  
> 若環境限制無法安裝官方 SDK，可維持目前的 HTTP Streaming 實作；待開發環境支援後再補上 `@elevenlabs/elevenlabs-js` 以獲得更完整功能。

---

## 🧱 後端調整

1. **模組**：`backend/tts/elevenlabs.js`  
   - 透過 `fetch` 呼叫 `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}/stream`  
   - 以 `Readable.fromWeb` 轉成 Node.js readable stream
   - 回傳 MIME 為 `audio/mpeg`

2. **路由**：`backend/routes/tts.js`  
   - 重新改為串流輸出：`stream.pipe(res)`  
   - 自動設定 `Transfer-Encoding: chunked` 與 `Cache-Control: no-store`

> 📌 其他路由（STT / LLM）無須修改。

---

## 🎨 前端整合

1. **API**：`frontend/src/lib/api.ts`  
   - 新增 `streamSpeech()` 回傳 `{ stream, mimeType }`  
   - 使用 `ReadableStream` 以保持串流狀態

2. **播放元件**：`frontend/src/components/StreamingAudioPlayer.tsx`  
   - 判斷瀏覽器是否支援 `MediaSource`  
   - 支援串流播放與 fallback（累積成 Blob 再播放）  
   - 自動播放並顯示緩衝/錯誤訊息

3. **UI**：`frontend/src/components/ChatMessage.tsx`  
   - 當訊息含 `audioStream` 時使用 `StreamingAudioPlayer`

4. **流程**：`frontend/src/App.tsx`  
   - TTS 步驟改呼叫 `api.streamSpeech()`，把 stream 直接塞進訊息狀態

---

## 🧪 測試流程

1. 啟動後端 / 前端開發伺服器
2. 與花小軟說：「哈囉，我是花小軟」  
   - 確認錄音後 ~1 秒內開始播放  
   - 確認播放過程順暢無明顯卡頓
3. 在 Console 觀察是否有串流錯誤或 CORS 問題
4. 交替輸入多句確認每次都能啟動播放

> 建議收集延遲：從 LLM 回覆完成到首個音訊 chunk 播放時間，期望 < 800ms。

---

## ⚠️ 注意事項

- 若 ElevenLabs API 回傳錯誤會直接以 JSON 中止串流；前端會顯示播放失敗訊息
- Safari 對 `MediaSource` 的支援有限，會自動使用 fallback（需等待完整音檔）
- `ELEVEN_OPTIMIZE_LATENCY` 下調（0~4）可提升首音速度，但可能降低語音品質
- 多語系回覆時請選擇支援多語的 model（例如 `eleven_multilingual_v2`）

---

## 📌 後續可擴充方向

- 導入官方 ElevenLabs SDK，串接語音事件（情緒標記、唇形同步等）
- 將 TTS 串流抽象為服務層，支援 Cartesia / ElevenLabs 動態切換
- 與雙向語音 WebSocket 架構整合，達成全串流語音對話

---

🌸 **花小軟現已能即時開口！** 若需進一步優化（例如語速調整、語氣人設等）歡迎繼續迭代。  

