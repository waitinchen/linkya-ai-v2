# 🚀 手動啟動指引

## ⚠️ 需要在兩個終端窗口操作

### 方法：打開兩個 PowerShell 終端

---

## 終端 1：啟動後端

### 步驟 1: 打開終端

按 `Win + X`，選擇「Windows PowerShell」或「終端機」

### 步驟 2: 進入後端目錄

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
```

### 步驟 3: 啟動後端

```powershell
npm run dev
```

**應該看到**：
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

**保持這個終端開著！**

---

## 終端 2：啟動前端

### 步驟 1: 打開第二個終端

再按一次 `Win + X`，打開第二個 PowerShell 終端

### 步驟 2: 進入前端目錄

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
```

### 步驟 3: 安裝依賴（第一次需要）

```powershell
npm install
```

等待安裝完成（約 1-2 分鐘）

### 步驟 4: 啟動前端

```powershell
npm run dev
```

**應該看到**：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**保持這個終端開著！**

---

## 🌐 打開瀏覽器

### 訪問網址

**http://localhost:5173**

應該看到花小軟的聊天界面！

---

## ✅ 檢查服務是否啟動

### 1. 檢查後端

打開瀏覽器訪問：
**http://localhost:3000/health**

應該看到：
```json
{
  "status": "ok",
  "message": "語氣靈後端運行中"
}
```

### 2. 檢查前端

**http://localhost:5173**

應該看到粉色系的聊天界面 🌸

---

## 🔥 一行快速啟動腳本

創建 `start.ps1`：

```powershell
# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend; npm run dev"

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend; npm install; npm run dev"

# Open browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
```

保存後執行：
```powershell
.\start.ps1
```

---

## 🎉 成功！

現在應該可以訪問 **http://localhost:5173** 了！

**開始與花小軟對話吧～** 🌸

