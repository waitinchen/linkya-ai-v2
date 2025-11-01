# 🚀 啟動服務步驟

## ⚠️ 重要：需要兩個終端窗口

### 終端 1：啟動後端

```bash
cd soft-voice-mvp/backend
npm run dev
```

**應該看到**：
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

---

### 終端 2：啟動前端

**在新的終端窗口**：

```bash
cd soft-voice-mvp/frontend
npm install  # 如果還沒安裝
npm run dev
```

**應該看到**：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 訪問網址

兩個服務都啟動後，訪問：

**http://localhost:5173**

---

## ✅ 檢查服務狀態

### 檢查後端

打開瀏覽器訪問：**http://localhost:3000/health**

應該看到：
```json
{
  "status": "ok",
  "message": "語氣靈後端運行中"
}
```

### 檢查前端

**http://localhost:5173**

應該看到花小軟的聊天界面！

---

## 🆘 如果還是不行

### 問題排查

1. **檢查端口是否被占用**
   ```bash
   # 檢查 3000 端口
   netstat -ano | findstr :3000
   
   # 檢查 5173 端口
   netstat -ano | findstr :5173
   ```

2. **檢查依賴是否安裝**
   ```bash
   # 後端
   cd soft-voice-mvp/backend
   ls node_modules  # 應該看到很多文件夾
   
   # 前端
   cd soft-voice-mvp/frontend
   ls node_modules  # 應該看到很多文件夾
   ```

3. **重新安裝依賴**
   ```bash
   cd soft-voice-mvp/backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **檢查 .env 文件**
   ```bash
   cd soft-voice-mvp/backend
   cat .env  # 檢查配置是否存在
   ```

---

## 📞 需要幫助？

查看詳細文檔：
- [LOCAL_TESTING_GUIDE.md](./soft-voice-mvp/LOCAL_TESTING_GUIDE.md)
- [QUICK_CONFIG.md](./soft-voice-mvp/QUICK_CONFIG.md)

