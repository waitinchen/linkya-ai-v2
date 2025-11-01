# 🔄 重啟服務指南

## 問題
後端仍在用舊的 API Key (`sk-xxx...`)，需要重啟以載入新的 `.env` 配置。

---

## 解決方案

### 方法 1：使用啟動腳本（推薦）

在 PowerShell 執行：

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp
.\start.ps1
```

### 方法 2：手動重啟

#### 步驟 1：停止現有進程

按 `Ctrl + C` 在後端終端停止服務，或：

```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process
```

#### 步驟 2：重新啟動

**終端 1 - 後端**：
```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
npm run dev
```

**終端 2 - 前端**（如果還沒運行的話）：
```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
npm run dev
```

#### 步驟 3：驗證

訪問：http://localhost:3000/health

應該返回：`{"status":"ok","message":"語氣靈後端運行中"}`

---

## 驗證 API Key 已更新

執行測試腳本：

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
node test-api.js
```

應該看到：
```
✅ LLM 測試成功!
✅ TTS 測試成功!
🎉 所有 API 測試通過！
```

---

## 常見問題

### Q: 為什麼需要重啟？
A: Node.js 的 `dotenv` 只在應用啟動時讀取 `.env` 文件。如果應用在我們更新 `.env` 之前就啟動了，它不會自動重新讀取。

### Q: 如何避免這個問題？
A: 在部署時，確保在重啟服務之前先更新環境變數。或在代碼中使用環境變數監聽功能（如 `nodemon` 的 `--watch`）。

---

**請先重啟後端服務，然後再測試錄音功能！**

