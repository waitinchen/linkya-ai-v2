# 🚀 語氣靈 MVP 設定指南

## 📋 前置需求

- Node.js 18 或以上版本
- npm 或 yarn 套件管理器
- OpenAI API Key（用於 GPT-4o + Whisper STT）
- Cartesia API Key（用於語音合成）

## 🔧 安裝步驟

### 1. 安裝依賴

```bash
# 後端
cd backend
npm install

# 前端
cd frontend
npm install
```

或使用安裝腳本：

```bash
chmod +x install.sh
./install.sh
```

### 2. 配置環境變數

在 `backend` 目錄下創建 `.env` 檔案：

```bash
cd backend
cp env.example .env
```

編輯 `.env` 檔案：

```env
# OpenAI API Key（獲取：https://platform.openai.com/api-keys）
OPENAI_API_KEY=sk-your_actual_openai_key_here

# Cartesia TTS API Key（獲取：https://cartesia.ai/）
CARTESIA_API_KEY=your_cartesia_api_key_here

# Voice ID（可選，預設使用sonic）
CARTESIA_VOICE_ID=sonic

# 伺服器端口（預設：3000）
PORT=3000
```

### 3. 獲取 API Key

#### OpenAI API Key
1. 前往 https://platform.openai.com/
2. 登入後到 Settings → API Keys
3. 點擊 "Create new secret key"
4. 複製金鑰並貼到 `.env` 檔案

#### Cartesia API Key
1. 前往 https://cartesia.ai/
2. 註冊帳號並登入
3. 在 Dashboard 找到 API Key
4. 複製並貼到 `.env` 檔案

## ▶️ 啟動應用

### 開發模式

需要兩個終端視窗：

**終端 1 - 後端伺服器：**
```bash
cd backend
npm run dev
```

應該看到：
```
🚀 語氣靈後端運行於 http://localhost:3000
🌸 花小軟已就緒～
```

**終端 2 - 前端開發伺服器：**
```bash
cd frontend
npm run dev
```

應該看到：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 測試

1. 打開瀏覽器訪問 http://localhost:5173
2. 點擊錄音按鈕
3. 允許麥克風權限
4. 說話並等待花小軟回應 🌸

## 🐛 常見問題

### 問題：麥克風權限被拒絕
**解決方案：**
- 確保瀏覽器設定允許麥克風權限
- Chrome: 設定 → 隱私權和安全性 → 網站設定 → 麥克風
- Safari: Safari → 設定 → 網站 → 麥克風

### 問題：API 錯誤
**解決方案：**
- 檢查 `.env` 檔案中的 API Key 是否正確
- 確認 API Key 未過期
- 檢查網路連線

### 問題：前端無法連接到後端
**解決方案：**
- 確認後端服務正在運行（http://localhost:3000）
- 檢查 `frontend/vite.config.js` 中的代理設定
- 確認 `backend/server.js` 中的 CORS 設定

### 問題：Cartesia TTS 失敗
**解決方案：**
- 確認 Cartesia API Key 正確
- 檢查帳號額度是否足夠
- 嘗試更換 `CARTESIA_VOICE_ID`

## 📁 專案結構

```
soft-voice-mvp/
├── backend/
│   ├── routes/
│   │   ├── stt.js      # 語音轉文字
│   │   ├── llm.js      # GPT對話
│   │   └── tts.js      # 語音合成
│   ├── server.js       # Express伺服器
│   └── .env           # 環境變數（需自行創建）
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecorderButton.tsx  # 錄音按鈕
│   │   │   ├── ChatMessage.tsx     # 訊息氣泡
│   │   │   └── VoicePlayer.tsx     # 播放器
│   │   ├── lib/
│   │   │   └── api.ts              # API調用
│   │   └── App.tsx                 # 主應用
│   └── vite.config.js  # Vite配置
│
└── README.md
```

## 🎯 下一步

- 調整花小軟的人格提示詞（修改 `backend/routes/llm.js`）
- 嘗試不同的 Cartesia Voice ID
- 整合更進階的對話記憶系統
- 加入插話檢測和實時對話功能

## 📞 支援

如有問題，請查看：
- OpenAI API 文檔：https://platform.openai.com/docs
- Cartesia 文檔：https://docs.cartesia.ai/
- React 文檔：https://react.dev/

---

🌸 祝開發順利～花小軟期待與你對話！

