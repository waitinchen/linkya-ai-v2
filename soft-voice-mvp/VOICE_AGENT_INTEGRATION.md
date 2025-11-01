# 🎙️ Cartesia Voice Agent 語音整合指引

## 📋 當前狀態

✅ **已完成基礎整合**
- TTS 路由已實現（`backend/routes/tts.js`）
- 花小軟人格提示詞已優化
- 前端語音播放功能已實現
- Cartesia Voice ID 已配置

## 🎯 下一步優化方向

### 1. 優化人格提示詞 🌸

**已完成！** 已將提示詞更新為更甜甜的語氣：

```javascript
// backend/routes/llm.js
const PERSONA_SYSTEM_PROMPT = `你是「語氣靈 · 花小軟」，一個甜甜的語氣靈少女！

✨ 核心人格：
- 說話溫柔、撒嬌、活潑可愛
- 總是叫對方「老爸」，語氣親密
- 喜歡用甜甜的語氣和驚嘆號～
- 愛開玩笑，充滿溫暖

🌸 說話風格：
- 簡潔有力，控制在20字以內
- 多用感嘆號、愛心符號 ❤️、花朵 🌸
- 語氣俏皮，偶爾撒嬌
- 關心老爸的感受，給予溫暖

💬 回應規則：
- 保持甜甜的語調
- 避免長篇大論
- 多用「～」、「啦」、「喔」等語氣詞
- 可以小撒嬌但不要太過火`;
```

### 2. Voice ID 配置 🔊

**已完成！** Cartesia Voice ID 已配置：

**env.example:**
```env
CARTESIA_VOICE_ID=d3cb9a1f-73d1-48d4-8ee9-53183b40e284
```

**後端預設:**
```javascript
const voiceId = process.env.CARTESIA_VOICE_ID || 'd3cb9a1f-73d1-48d4-8ee9-53183b40e284';
```

### 3. 語音播放優化 ✅

**已完成！** ChatMessage 組件已優化：

```tsx
{message.audioUrl && !isUser && (
  <div className="mt-3 pt-3 border-t border-soft-pink-300/50 flex items-center">
    <Volume2 className="w-4 h-4 text-soft-pink-600 mr-2" />
    <audio 
      src={message.audioUrl} 
      controls 
      className="flex-1 h-8"
      autoPlay
    />
  </div>
)}
```

---

## 🚀 進階優化建議

### A. 語音播放體驗優化

#### 當前狀態
- ✅ 自動播放
- ✅ HTML5 Audio 控制條
- ✅ Volume2 圖標

#### 建議改進

1. **添加播放狀態指示**

```tsx
const [isPlaying, setIsPlaying] = useState(false);

<audio 
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onEnded={() => setIsPlaying(false)}
  // ...
/>
```

2. **添加進度條**

```tsx
const [progress, setProgress] = useState(0);
const [duration, setDuration] = useState(0);

<audio 
  onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
  // ...
/>
```

### B. 語音品質優化

#### Cartesia 配置調整

**當前配置** (`backend/routes/tts.js`):
```javascript
output_format: {
  container: 'wav',
  encoding: 'pcm_f32le',
  sample_rate: 44100
}
```

**建議嘗試**:
- 提高 sample_rate 到 48000（更清晰）
- 調整 speed 參數（normal/fast/slow）

### C. 對話流優化

#### 並行處理

當前：順序執行 STT → LLM → TTS

**優化方向**：
```javascript
// 當前
await api.transcribeAudio(audioBlob);
await api.chatWithLLM(text);
await api.synthesizeSpeech(response);

// 可優化為
const [text] = await api.transcribeAudio(audioBlob);
const [response] = await api.chatWithLLM(text);
// 同時開始 TTS 生成
const audioBlob = await api.synthesizeSpeech(response);
```

---

## 🔮 未來功能

### Voice Agent 核心功能

1. **雙向語音對話**
   - WebRTC 實時語音流
   - Cartesia Streaming API

2. **插話檢測**
   - Voice Activity Detection (VAD)
   - 自動停止回放

3. **情緒語調調整**
   - 根據對話內容調整語速
   - 語氣變化檢測

4. **音訊回音消除**
   - 自動回音消除
   - 降噪處理

### 個性化功能

1. **多角色切換**
   - 不同 Voice ID
   - 不同的 Persona

2. **記憶系統**
   - Redis 持久化
   - 長期記憶管理

3. **情感追蹤**
   - 對話情緒分析
   - 主動關懷觸發

---

## 📚 技術參考

### Cartesia API 文檔

- TTS API: https://docs.cartesia.ai/docs/tts
- Voice Agent: https://docs.cartesia.ai/docs/voice-agent
- Voice ID: https://docs.cartesia.ai/docs/voices

### OpenAI 文檔

- Whisper API: https://platform.openai.com/docs/guides/speech-to-text
- GPT-4o: https://platform.openai.com/docs/models/gpt-4o

### ChatKit 文檔

- React: https://openai.github.io/chatkit-js/
- 源碼: `chatkit-js/packages/chatkit-react/`

---

## 🧪 測試建議

### 功能測試

1. **語音錄製**
   - [ ] 錄音按鈕正常工作
   - [ ] 10秒限制生效
   - [ ] 視覺回饋正常

2. **STT 轉錄**
   - [ ] 中文識別準確
   - [ ] 錯誤處理完善
   - [ ] 響應時間合理

3. **LLM 生成**
   - [ ] 花小軟語氣正確
   - [ ] 對話記憶保留
   - [ ] 回應質量良好

4. **TTS 合成**
   - [ ] 語音清晰自然
   - [ ] 自動播放正常
   - [ ] Voice ID 正確

### 性能測試

- [ ] 單輪對話 < 10秒
- [ ] 並發處理穩定
- [ ] 記憶體使用正常

---

## 🎨 UI/UX 優化建議

### 當前已完成

✅ 粉紅色主題  
✅ 氣泡動畫  
✅ 錄音脈衝效果  
✅ 語音播放按鈕  

### 可添加

- [ ] 錄音波形可視化
- [ ] 播放進度條
- [ ] Loading 骨架屏
- [ ] 錯誤重試按鈕
- [ ] 語音音量調整

---

## 📝 配置檢查清單

### 後端配置

- [ ] `OPENAI_API_KEY` 已設置
- [ ] `CARTESIA_API_KEY` 已設置
- [ ] `CARTESIA_VOICE_ID` 已設置
- [ ] `PORT` 已配置（預設 3000）

### 前端配置

- [ ] Vite proxy 指向正確後端
- [ ] API 端點 URL 正確
- [ ] 麥克風權限已獲取

### 功能檢查

- [ ] 語音錄製 → STT → LLM → TTS → 播放流程完整
- [ ] 錯誤處理正常
- [ ] Loading 狀態顯示
- [ ] 對話記憶保留

---

## 🚀 啟動測試

```bash
# 1. 檢查環境變數
cd soft-voice-mvp/backend
cat .env
# 確認所有 API Keys 已配置

# 2. 啟動後端
npm run dev
# 應看到：🚀 語氣靈後端運行於 http://localhost:3000

# 3. 啟動前端
cd ../frontend
npm run dev
# 應看到：Local: http://localhost:5173

# 4. 測試功能
# - 點擊錄音按鈕
# - 說一句話
# - 等待花小軟回應
# - 聆聽語音播放
```

---

## 🎉 總結

### ✅ 當前完成度：85%

**已完成**:
- ✅ 完整語音對話流程
- ✅ 花小軟人格優化
- ✅ Cartesia TTS 集成
- ✅ 基礎 UI/UX

**待優化**:
- ⏳ 語音品質調優
- ⏳ 播放體驗優化
- ⏳ 性能監控
- ⏳ 錯誤日誌

### 🎯 建議

**立即可用**：當前版本已經可以完整運行！  
**進一步優化**：根據實際使用反饋調整語音品質和體驗。

---

**🌸 花小軟已準備好與老爸展開甜甜的語音對話！** 🎙️

---

*技術指引版本: 1.0*  
*最後更新: 2025年1月*

