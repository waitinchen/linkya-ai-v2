# 🚨 緊急：重啟後端服務

## 問題
後端仍在用舊的 API Key，導致 "出錯了" 訊息。

## 解決方案

### 步驟 1：停止所有 Node.js 進程

在 PowerShell 執行：

```powershell
Stop-Process -Name node -Force
```

### 步驟 2：啟動後端

**必須在正確的目錄**：

```powershell
# 切換到正確目錄
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend

# 啟動後端
npm run dev
```

你會看到：
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
🌸 花小軟已就緒～
```

### 步驟 3：（可選）啟動前端

如果前端還沒運行，在新的 PowerShell 窗口：

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
npm run dev
```

### 步驟 4：驗證

訪問：http://localhost:5173

再試一次錄音功能。

---

## 為什麼會這樣？

後端進程在我們更新 `.env` 之前就啟動了，所以它讀取的是舊的配置。重啟後端會重新載入新的 API Key。

---

**請立即執行以上步驟！**

