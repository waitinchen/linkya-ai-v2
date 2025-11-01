# 🐛 除錯指南

## 檢查步驟

### 1️⃣ 檢查 .env 文件

確認 `soft-voice-mvp/backend/.env` 已正確配置：

```env
OPENAI_API_KEY=你的實際APIKey  ← 重要！
CARTESIA_API_KEY=sk_car_swxgArAzEefrT5gm3FX1Xf
CARTESIA_VOICE_ID=d3cb9a1f-73d1-48d4-8ee9-53183b40e284
PORT=3000
```

### 2️⃣ 檢查後端終端日誌

觀察**後端終端**的輸出，應該看到：

**成功流程**：
```
🎤 收到語音轉文字請求
✅ 語音識別完成: [識別的文字]

🧠 收到對話請求: [識別的文字]
✅ LLM回應生成: [回應內容]

🎵 收到語音合成請求: [回應內容]
✅ 語音合成完成
```

**如果有錯誤**：
```
❌ STT錯誤: ...
❌ LLM錯誤: ...
❌ TTS錯誤: ...
```

### 3️⃣ 檢查瀏覽器控制台

按 `F12` 打開開發者工具，查看 Console 錯誤

### 4️⃣ 測試 API 健康

訪問：http://localhost:3000/health

應該返回：`{"status":"ok"}`

---

## 常見錯誤

### OpenAI API Key 未設置

**症狀**：LLM 或 STT 失敗

**解決**：檢查 `.env` 文件中的 `OPENAI_API_KEY`

### Cartesia API Key 錯誤

**症狀**：TTS 失敗

**解決**：檢查 `.env` 文件中的 `CARTESIA_API_KEY`

### 麥克風權限

**症狀**：點擊按鈕無反應

**解決**：允許瀏覽器使用麥克風

---

**請查看後端終端的錯誤訊息，告訴我具體是什麼錯誤！**

