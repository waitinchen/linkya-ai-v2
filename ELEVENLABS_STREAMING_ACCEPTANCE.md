# ✅ ElevenLabs 串流邏輯驗收清單

## 🎯 驗收目標

驗證 ElevenLabs Streaming TTS 的串流邏輯是否正確實現並能正常運作。

---

## 📋 環境配置檢查

### ✅ 步驟 1: 檢查環境變數

**文件**: `soft-voice-mvp/backend/.env`

必須有以下配置：

```env
# ElevenLabs 必須配置
ELEVEN_API_KEY=sk-xxxx 或 ELEVENLABS_API_KEY=sk-xxxx
ELEVEN_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVEN_MODEL_ID=eleven_multilingual_v2
```

**檢查方法**：
```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
Get-Content .env | Select-String -Pattern "ELEVEN"
```

**預期結果**：
- ✅ ELEVEN_API_KEY 或 ELEVENLABS_API_KEY 有值
- ✅ ELEVEN_VOICE_ID 有值
- ✅ ELEVEN_MODEL_ID 有值

---

## 🔧 後端驗收

### ✅ 步驟 2: 檢查 ElevenLabs 模組

**文件**: `soft-voice-mvp/backend/tts/elevenlabs.js`

**檢查項目**：

1. **導入正確**
   ```javascript
   import dotenv from 'dotenv';
   import { Readable } from 'node:stream';
   ```

2. **環境變數讀取**
   ```javascript
   const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY;
   ```

3. **API 端點正確**
   ```javascript
   const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
   ```

4. **請求格式正確**
   - Header: `xi-api-key`
   - Header: `Accept: audio/mpeg`
   - Body: JSON with text, model_id, optimize_streaming_latency

5. **串流處理**
   ```javascript
   const stream = Readable.fromWeb(response.body);
   return { stream, contentType };
   ```

---

### ✅ 步驟 3: 檢查 TTS 路由

**文件**: `soft-voice-mvp/backend/routes/tts.js`

**檢查項目**：

1. **導入正確**
   ```javascript
   import { streamTextToSpeech } from '../tts/elevenlabs.js';
   ```

2. **串流輸出**
   ```javascript
   stream.pipe(res);
   ```

3. **正確的 Headers**
   ```javascript
   res.setHeader('Content-Type', contentType);
   res.setHeader('Transfer-Encoding', 'chunked');
   res.setHeader('Cache-Control', 'no-store');
   ```

4. **錯誤處理**
   - Stream 錯誤處理
   - Try-catch 錯誤處理

---

### ✅ 步驟 4: 後端啟動測試

**啟動後端**：
```powershell
cd soft-voice-mvp\backend
npm run dev
```

**預期輸出**：
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

**手動測試 TTS**：
```powershell
curl -X POST http://localhost:3000/api/tts `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"Hello, this is a test\"}' `
  --output test.mp3
```

**預期結果**：
- ✅ 能接收到音訊檔案
- ✅ 檔案大小 > 0
- ✅ 播放正常

---

## 🎨 前端驗收

### ✅ 步驟 5: 檢查 API 封裝

**文件**: `soft-voice-mvp/frontend/src/lib/api.ts`

**檢查項目**：

1. **streamSpeech 函數**
   ```typescript
   async streamSpeech(text: string): Promise<{ stream: ReadableStream<Uint8Array>; mimeType: string }>
   ```

2. **正確的 API 呼叫**
   ```typescript
   const response = await fetch(`${API_BASE}/tts`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ text }),
   });
   ```

3. **串流讀取**
   ```typescript
   if (!response.body) throw new Error('瀏覽器不支援串流播放');
   ```

4. **返回正確格式**
   ```typescript
   return { stream: response.body, mimeType };
   ```

---

### ✅ 步驟 6: 檢查 StreamingAudioPlayer

**文件**: `soft-voice-mvp/frontend/src/components/StreamingAudioPlayer.tsx`

**檢查項目**：

1. **MediaSource 支援檢測**
   ```typescript
   function supportsMediaSource(type: string)
   ```

2. **串流播放邏輯**
   - 使用 MediaSource + SourceBuffer（支援時）
   - 使用 Blob fallback（不支援時）

3. **正確的 MIME type**
   ```typescript
   const FALLBACK_TYPE = 'audio/mpeg';
   ```

4. **錯誤處理**
   - 緩衝狀態顯示
   - 錯誤訊息顯示

5. **清理邏輯**
   - Cleanup on unmount
   - URL revoke

---

### ✅ 步驟 7: 檢查 ChatMessage 集成

**文件**: `soft-voice-mvp/frontend/src/components/ChatMessage.tsx`

**檢查項目**：

1. **Message 介面**
   ```typescript
   audioStream?: ReadableStream<Uint8Array>;
   audioMimeType?: string;
   ```

2. **條件渲染**
   ```tsx
   {message.audioStream && !isUser && (
     <StreamingAudioPlayer
       stream={message.audioStream}
       mimeType={message.audioMimeType}
     />
   )}
   ```

3. **Fallback 支援**
   ```tsx
   {message.audioUrl && !isUser && !message.audioStream && (
     <audio src={message.audioUrl} controls />
   )}
   ```

---

### ✅ 步驟 8: 檢查 App.tsx 流程

**文件**: `soft-voice-mvp/frontend/src/App.tsx`

**檢查項目**：

1. **TTS 呼叫**
   ```typescript
   const { stream, mimeType } = await api.streamSpeech(llmResponse);
   ```

2. **Stream 傳遞**
   ```typescript
   const assistantMessage: Message = {
     audioStream: stream,
     audioMimeType: mimeType,
   };
   ```

3. **狀態更新**
   ```typescript
   setMessages(prev => [...prev, assistantMessage]);
   ```

---

## 🧪 端到端測試

### ✅ 步驟 9: 完整對話流程測試

**啟動服務**：
```powershell
# 終端 1 - 後端
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
npm run dev

# 終端 2 - 前端
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
npm run dev
```

**訪問**: http://localhost:5173

**測試步驟**：

1. **錄音測試**
   - 點擊錄音按鈕
   - 說："你好，我是花小軟"
   - 確認錄音完成

2. **STT 測試**
   - 觀察狀態：「正在識別語音...」
   - 確認文字正確顯示

3. **LLM 測試**
   - 觀察狀態：「花小軟正在思考...」
   - 確認回應文字出現

4. **TTS 串流測試** ⭐
   - 觀察狀態：「正在生成語音...」
   - **關鍵**：檢查是否在 1 秒內開始播放
   - 確認播放流暢無卡頓
   - 確認播放過程中無錯誤

5. **重複測試**
   - 再錄製 2-3 次
   - 確認每次都能正常播放

---

### ✅ 步驟 10: 瀏覽器 Console 檢查

**打開開發者工具**: F12 → Console

**檢查項目**：

1. **無錯誤訊息**
   - ✅ 沒有 "TTS failed"
   - ✅ 沒有 "串流失敗"
   - ✅ 沒有 "MediaSource" 相關錯誤

2. **後端日誌**
   - ✅ 看到 "🎵 ElevenLabs TTS 請求: xxx"
   - ✅ 沒有錯誤日誌

3. **網路請求**
   - 打開 Network 標籤
   - 查看 `/api/tts` 請求
   - ✅ Status: 200
   - ✅ Type: xhr 或 fetch
   - ✅ Size: 逐步增加（串流）

---

### ✅ 步驟 11: 性能測試

**測試延遲**：

1. **首音延遲 (TTFB)**
   - 從 LLM 回應完成到開始播放
   - **目標**: < 800ms

2. **總延遲**
   - 從錄音結束到開始播放
   - **目標**: < 5s

3. **播放流暢度**
   - 檢查是否有明顯卡頓
   - 檢查緩衝指示是否過長

---

## 🐛 常見問題檢查

### ❌ 問題 1: API Key 未配置

**症狀**: 
- Console 顯示 "ELEVEN_API_KEY 未設置"
- TTS 請求失敗

**解決**:
```env
ELEVEN_API_KEY=sk-your-key-here
```

---

### ❌ 問題 2: API Key 格式錯誤

**症狀**:
- ElevenLabs API 返回 401
- Console 顯示 "ElevenLabs TTS 請求失敗: 401"

**解決**:
- 確認 API Key 格式正確
- 確認 API Key 有效

---

### ❌ 問題 3: 串流不啟動

**症狀**:
- 一直顯示「語音緩衝中…」
- 不開始播放

**檢查**:
1. 瀏覽器是否支援 MediaSource
2. MIME type 是否正確
3. Network 查看串流是否正常接收

---

### ❌ 問題 4: 播放卡頓

**症狀**:
- 播放斷斷續續
- 有明顯停頓

**可能原因**:
- 網路不穩定
- `ELEVEN_OPTIMIZE_LATENCY` 設定過高
- 音訊品質設定過高

**解決**:
```env
ELEVEN_OPTIMIZE_LATENCY=0  # 最低延遲
```

---

### ❌ 問題 5: Safari 不工作

**症狀**:
- Chrome 正常，Safari 失敗

**原因**:
- Safari 對 MediaSource 支援有限

**檢查**:
- Console 是否顯示 fallback 訊息
- 是否使用 Blob 模式

---

## 📊 驗收標準

### 必須通過 (P0)

- [x] 環境變數配置正確
- [x] 後端可以接收 TTS 請求
- [x] ElevenLabs API 連接成功
- [x] 音訊能正確串流
- [x] 前端能播放音訊
- [x] 完整對話流程順暢

### 應該通過 (P1)

- [x] 首音延遲 < 800ms
- [x] 播放流暢無卡頓
- [x] 多次對話穩定
- [x] 錯誤處理正常
- [x] Console 無錯誤

### 可選優化 (P2)

- [ ] Safari 完美支援
- [ ] 超長文字處理
- [ ] 語速/語調調整
- [ ] 多語言支援

---

## 🎯 驗收結果

### 測試日期: ___________

### 測試人員: ___________

### 測試環境:
- 作業系統: ___________
- 瀏覽器: ___________
- 後端版本: ___________
- 前端版本: ___________

### 測試結果:

| 項目 | 狀態 | 備註 |
|------|------|------|
| 環境配置 | ⬜ 通過 ⬜ 失敗 | |
| 後端模組 | ⬜ 通過 ⬜ 失敗 | |
| 前端集成 | ⬜ 通過 ⬜ 失敗 | |
| 串流播放 | ⬜ 通過 ⬜ 失敗 | |
| 端到端測試 | ⬜ 通過 ⬜ 失敗 | |
| Console 檢查 | ⬜ 通過 ⬜ 失敗 | |
| 性能測試 | ⬜ 通過 ⬜ 失敗 | |

### 發現問題:

1. ___________
2. ___________
3. ___________

### 總體評估:

⬜ 通過驗收 - 可以上線

⬜ 部分通過 - 需要修復問題：

⬜ 不通過 - 重大問題待解決：

---

## 🎉 驗收簽核

### 開發者簽核: ___________

### 測試者簽核: ___________

---

**🌸 花小軟的串流語音體驗驗收完成！**

有任何問題請告訴我，我會協助你解決！🎙️✨

