# ⚡ 快速配置指南

## 🎯 配置環境變數

### 已自動建立 `.env` 文件

**位置**: `soft-voice-mvp/backend/.env`

**內容**:
```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-xxx...

# Cartesia Voice Configuration
CARTESIA_API_KEY=sk-your_cartesia_api_key_here
CARTESIA_VOICE_ID=d3cb9a1f-73d1-48d4-8ee9-53183b40e284
CARTESIA_TTS_MODEL_ID=sonic-3
CARTESIA_LANGUAGE=zh
CARTESIA_SAMPLE_RATE=44100

# Server Configuration
PORT=3000
```

> ⚠️ **注意**：歷史文件提到的測試 Cartesia 金鑰已失效，請務必改用你自己的帳號所產生的 API Key，否則 `/api/tts` 會回傳 401/403。

### ⚠️ 重要：更新 API Key

**需要手動編輯**：
- 將 `OPENAI_API_KEY=sk-xxx...` 替換為你的實際 OpenAI API Key
- 將 `CARTESIA_API_KEY=sk-your_cartesia_api_key_here` 替換為你在 Cartesia 後台申請的金鑰

```bash
cd soft-voice-mvp/backend
# 編輯 .env 文件
notepad .env  # Windows
# 或
nano .env     # Linux/Mac
```

---

## 🚀 快速啟動

### 1. 確認配置

```bash
cd soft-voice-mvp/backend
# 檢查 .env 文件存在
Get-Content .env  # Windows PowerShell
cat .env          # Linux/Mac
```

### 2. 安裝依賴（如果還沒安裝）

```bash
cd soft-voice-mvp/backend
npm install

cd ../frontend
npm install
```

### 3. 啟動服務

**終端 1 - 後端**:
```bash
cd soft-voice-mvp/backend
npm run dev
```

**終端 2 - 前端**:
```bash
cd soft-voice-mvp/frontend
npm run dev
```

### 4. 訪問應用

打開瀏覽器：http://localhost:5173

---

## ✅ 測試檢查

### 後端健康檢查

```bash
curl http://localhost:3000/health
```

應該返回：
```json
{
  "status": "ok",
  "message": "語氣靈後端運行中"
}
```

### 完整功能測試

1. ✅ 訪問 http://localhost:5173
2. ✅ 看到花小軟歡迎訊息
3. ✅ 點擊錄音按鈕
4. ✅ 允許麥克風權限
5. ✅ 說一句話
6. ✅ 等待回應和語音播放

---

## 🔧 故障排查

### 問題 1: 後端無法啟動

**檢查**:
- [ ] `.env` 文件是否存在
- [ ] Cartesia API Key 是否有效
- [ ] OpenAI API Key 是否有效（重要！）

### 問題 2: TTS 失敗

**檢查**:
- [ ] Cartesia API Key 是否正確
- [ ] Voice ID 是否有效
- [ ] 網路連線是否正常

### 問題 3: 前端無法連接

**檢查**:
- [ ] 後端是否運行在 :3000
- [ ] `vite.config.js` 代理配置
- [ ] 瀏覽器控制台錯誤

---

## 📝 配置說明

### Cartesia 配置

| 變數 | 描述 | 預設值 |
|------|------|--------|
| `CARTESIA_API_KEY` | Cartesia API 金鑰 | - |
| `CARTESIA_VOICE_ID` | 花小軟專屬聲音 | d3cb9a1f-... |
| `CARTESIA_TTS_MODEL_ID` | TTS 模型 | sonic-3 |
| `CARTESIA_LANGUAGE` | 語言 | zh |
| `CARTESIA_SAMPLE_RATE` | 採樣率 | 44100 |

### OpenAI 配置

| 變數 | 描述 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 |

### Server 配置

| 變數 | 描述 | 預設值 |
|------|------|--------|
| `PORT` | 後端端口 | 3000 |

---

## 🎉 配置完成！

配置完成後，就可以開始與花小軟對話了！

**🌸 花小軟已準備就緒～** 🎙️

---

*配置指南版本: 1.0*  
*最後更新: 2025年1月*

