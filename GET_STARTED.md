# 🎯 立即開始！

## ⚡ 最快速的方式

### 方法 1：使用啟動腳本（推薦）

在 PowerShell 中執行：

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp
.\start.ps1
```

**會自動**：
- ✅ 啟動後端
- ✅ 啟動前端
- ✅ 打開瀏覽器

---

### 方法 2：手動啟動（2 個終端）

#### 終端 1 - 後端

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
npm run dev
```

#### 終端 2 - 前端

```powershell
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
npm install  # 第一次需要
npm run dev
```

#### 打開瀏覽器

訪問：**http://localhost:5173**

---

## 🌐 測試網址

**主入口**：http://localhost:5173

**後端檢查**：http://localhost:3000/health

---

## ✅ 確認服務運行

### 後端應該看到

```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

### 前端應該看到

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🆘 問題排查

如果無法訪問：

1. **檢查是否啟動**：確認兩個終端都在運行
2. **檢查端口**：確保 3000 和 5173 端口可用
3. **查看詳細指引**：[LOCAL_TESTING_GUIDE.md](./soft-voice-mvp/LOCAL_TESTING_GUIDE.md)

---

**🌸 現在開始啟動！** 🚀

