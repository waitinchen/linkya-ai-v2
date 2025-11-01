# 🔧 故障排查指南

## 🎙️ 錄音按鈕沒反應？

### 檢查步驟

#### 1️⃣ 檢查瀏覽器控制台

按 `F12` 打開開發者工具，查看 Console 是否有錯誤

常見錯誤：
- ❌ "麥克風權限被拒絕" → 需要允許麥克風
- ❌ "Failed to fetch" → 後端未啟動
- ❌ "Network error" → API 連線問題

---

#### 2️⃣ 檢查麥克風權限

**Chrome/Edge**:
1. 點擊地址欄左側的 🔒 或 🎙️ 圖標
2. 選擇「允許」麥克風權限
3. 重新載入頁面

**Firefox**:
1. 點擊地址欄左側的 🔒 圖標
2. 選擇「允許」麥克風
3. 重新載入

**Safari**:
1. Safari → 偏好設定 → 網站
2. 找到 localhost:5173
3. 設置麥克風為「允許」

---

#### 3️⃣ 檢查服務運行狀態

**後端**：
訪問：http://localhost:3000/health

應該看到：
```json
{"status":"ok","message":"語氣靈後端運行中"}
```

**前端**：
訪問：http://localhost:5173

應該看到聊天界面

---

#### 4️⃣ 檢查瀏覽器兼容性

**支持本地麥克風的瀏覽器**：
- ✅ Chrome 60+
- ✅ Edge 79+
- ✅ Firefox 55+
- ✅ Safari 11+

**不支持**：
- ❌ IE 11
- ❌ 舊版瀏覽器

---

#### 5️⃣ 重新啟動服務

如果還是不行，重新啟動：

**終端 1 - 停止並重啟後端**：
```powershell
# 停止後端（Ctrl+C）
# 重新啟動
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\backend
npm run dev
```

**終端 2 - 停止並重啟前端**：
```powershell
# 停止前端（Ctrl+C）
# 重新啟動
cd C:\Users\waiti\linkya-ai-v2\soft-voice-mvp\frontend
npm run dev
```

---

#### 6️⃣ 清除瀏覽器緩存

**硬性重新載入**：
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

或按 `F12` → Network → 勾選 "Disable cache"

---

## 🐛 常見錯誤

### 錯誤 1：麥克風權限被拒絕

**解決方法**：
1. 檢查瀏覽器設置中的麥克風權限
2. 在瀏覽器地址欄允許 localhost 使用麥克風
3. 重新載入頁面

---

### 錯誤 2：後端無法連線

**症狀**：點擊錄音無反應，Console 顯示 Network Error

**解決方法**：
```bash
# 檢查後端是否運行
curl http://localhost:3000/health

# 如果不通，重新啟動後端
cd soft-voice-mvp/backend
npm run dev
```

---

### 錯誤 3：API Key 未配置

**症狀**：STT/LLM/TTS 失敗

**解決方法**：
1. 檢查 `backend/.env` 文件
2. 確認 OpenAI API Key 已正確設置
3. 重啟後端服務

---

### 錯誤 4：端口被占用

**症狀**：npm run dev 報錯 port already in use

**解決方法**：
```powershell
# 查找占用 3000 端口的進程
netstat -ano | findstr :3000

# 結束進程
taskkill /PID <進程ID> /F

# 或修改端口號
# 在 backend/.env 中設置 PORT=3001
```

---

## ✅ 正常運行應該看到

### 後端終端
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

### 前端終端
```
VITE ready
➜  Local: http://localhost:5173/
```

### 瀏覽器
- 花小軟歡迎訊息
- 粉色麥克風按鈕
- 點擊後麥克風圖標變化

---

## 📞 還是無法解決？

### 提供信息

請提供以下信息以便診斷：

1. **操作系統**：Windows 10/11？
2. **瀏覽器**：Chrome/Edge/Firefox？
3. **後端終端**：有錯誤訊息嗎？
4. **前端終端**：有錯誤訊息嗎？
5. **瀏覽器 Console**：F12 看到的錯誤
6. **錄音按鈕**：點擊後有任何反應嗎？

---

## 💡 快速測試

### 測試後端

```bash
curl http://localhost:3000/health
```

### 測試前端 API 連接

打開瀏覽器 Console，執行：

```javascript
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(console.log)
```

應該返回 `{status: 'ok', message: '...'}`

---

**希望這些能幫到你！** 🌸

