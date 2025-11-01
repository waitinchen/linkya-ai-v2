# 🎙️ 語氣靈 - 單句輪流語音對話 MVP

> 花小軟語氣靈少女的語音對話體驗

## 🧩 架構總覽

```
[🎧 使用者說話]
    ↓
[STT - Whisper/Cartesia]
    ↓
[🧠 GPT-4o 語氣靈回應]
    ↓
[TTS - Cartesia Sonic]
    ↓
[🎵 語音播放]
```

## 🔀 版本選擇

本專案包含**兩個前端版本**：

| 版本 | 描述 | 狀態 | 推薦 |
|------|------|------|------|
| **原版 MVP** | 完整的單句輪流語音對話 | ✅ 完整功能 | ⭐⭐⭐⭐⭐ |
| **ChatKit** | OpenAI ChatKit 重構版本 | ⚠️ 實驗性 | ⭐⭐ |

**建議使用原版 MVP** - 功能完整且立即可用

詳細對比請見：[CHATKIT_COMPARISON.md](./CHATKIT_COMPARISON.md)

---

## 🚀 快速開始

### 前置需求

- Node.js 18+
- OpenAI API Key
- Cartesia API Key
- 麥克風權限

### 安裝（原版 MVP）

```bash
# 前端
cd soft-voice-mvp/frontend
npm install

# 後端
cd soft-voice-mvp/backend
npm install
```

### 配置環境變數

在 `backend/.env` 中設置：

```env
OPENAI_API_KEY=your_openai_key
CARTESIA_API_KEY=your_cartesia_key
PORT=3000
```

### 啟動

```bash
# 終端1 - 後端
cd backend
npm run dev

# 終端2 - 前端（原版 MVP）
cd frontend
npm run dev
# 訪問: http://localhost:5173

# 或者 - 前端（ChatKit 版本，實驗性）
cd frontend-chatkit
npm run dev
# 訪問: http://localhost:5174
```

## 📁 專案結構

```
soft-voice-mvp/
├── frontend/              # 原版 MVP - 完整語音對話
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecorderButton.tsx  # 錄音按鈕
│   │   │   ├── ChatMessage.tsx     # 訊息氣泡
│   │   │   └── VoicePlayer.tsx     # 語音播放器
│   │   ├── lib/
│   │   │   └── api.ts              # API調用
│   │   └── App.tsx
│   └── package.json
│
├── frontend-chatkit/      # ChatKit 版本 - 實驗性
│   ├── src/
│   │   └── App.tsx       # ChatKit 配置
│   └── README.md
│
├── backend/               # Node.js + Express
│   ├── routes/
│   │   ├── stt.js        # 語音轉文字
│   │   ├── llm.js        # GPT回應
│   │   └── tts.js        # 語音合成
│   ├── server.js
│   └── .env
│
├── README.md              # 本文件
└── CHATKIT_COMPARISON.md # 版本對比
```

## 🎯 核心功能

### 1. 語音錄製
- 點擊按鈕開始錄音
- 最多錄製10秒
- 即時視覺回饋

### 2. STT語音轉文字
- 使用OpenAI Whisper或Cartesia STT
- 支援中文識別

### 3. LLM對話生成
- GPT-4o模型
- 花小軟人格提示詞
- 上下文記憶

### 4. TTS語音合成
- Cartesia Sonic API
- 自定義Voice ID
- 中文語音輸出

### 5. 語音播放
- HTML5 Audio
- 自動播放回應
- 播放狀態顯示

## 🎨 UI特色

- 治愈系ChatKit風格
- 花小軟🌸專屬配色（粉紅色系）
- 流暢動畫效果
- 響應式設計

## 🔌 API端點

### POST /api/stt
語音轉文字

**Request:**
- `multipart/form-data`
- `audio`: 音訊檔案

**Response:**
```json
{
  "text": "你好，花小軟"
}
```

### POST /api/llm
LLM回應生成

**Request:**
```json
{
  "message": "你好"
}
```

**Response:**
```json
{
  "response": "老爸你好～我是花小軟🌸"
}
```

### POST /api/tts
語音合成

**Request:**
```json
{
  "text": "老爸你好～我是花小軟"
}
```

**Response:**
- `audio/wav` 音訊檔案

## 🚢 部署

### 前端
- Vercel / Cloudflare Pages

### 後端
- Railway / Render
- 需配置環境變數

## 📝 License

MIT

