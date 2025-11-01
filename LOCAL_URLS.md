# 🌐 本地端測試網址

## 服務地址

### 🎙️ 前端界面（主要入口）

**http://localhost:5173** ← **這裡開始！**

花小軟的聊天界面就在這裡～

### 🔧 後端 API

**http://localhost:3000**

後端 API 服務器

### ✅ 健康檢查

**http://localhost:3000/health**

檢查後端是否正常運行

預期回應：
```json
{
  "status": "ok",
  "message": "語氣靈後端運行中"
}
```

---

## 🔗 完整服務鏈

```
瀏覽器訪問
    ↓
http://localhost:5173 (前端界面)
    ↓
自動代理到
    ↓
http://localhost:3000/api/* (後端 API)
```

---

## 🚀 快速啟動檢查

### 1. 檢查後端

```bash
# 終端 1
cd soft-voice-mvp/backend
npm run dev

# 應該看到：
🚀 語氣靈後端運行於 http://localhost:3000
```

### 2. 檢查前端

```bash
# 終端 2
cd soft-voice-mvp/frontend
npm run dev

# 應該看到：
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. 打開瀏覽器

點擊或複製這個網址：**http://localhost:5173**

---

## 📱 移動端測試

如果需要在手機上測試：

### 查找電腦 IP

**Windows**:
```bash
ipconfig
# 找到 "IPv4 地址"，例如：192.168.1.100
```

**Mac/Linux**:
```bash
ifconfig | grep inet
# 找到內網 IP
```

### 訪問地址

確保手機和電腦在同一個 WiFi 網路

**http://[電腦IP]:5173**

例如：**http://192.168.1.100:5173**

**注意**：需要在 `vite.config.js` 添加 host 配置：
```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // 允許外部訪問
    port: 5173,
  }
})
```

---

## 🎯 測試流程

1. ✅ 後端運行在：http://localhost:3000
2. ✅ 前端運行在：http://localhost:5173
3. ✅ 訪問前端開始測試
4. ✅ 檢查健康檢查端點確認後端正常

---

## 🌸 準備開始！

**立即訪問：http://localhost:5173**

開始與花小軟的甜甜對話吧～ 🎙️

