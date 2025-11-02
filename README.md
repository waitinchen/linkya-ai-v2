# 🎙️ 語氣靈 - 花小軟語音對話系統

> 一個完整的單句輪流語音對話 MVP，融合了語音識別、AI 對話生成和語音合成的技術。

[![GitHub](https://img.shields.io/badge/GitHub-waitinchen-blue)](https://github.com/waitinchen/linkya-ai-v2)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🌟 專案簡介

**語氣靈**是一個完整的語音對話系統，實現了「使用者說一句 → AI 用自定義語氣回一句（語音）」的流暢體驗。

### 特色功能

- 🎤 **語音錄製** - 點擊按鈕錄音（最長 10 秒）
- 🗣️ **語音轉文字** - OpenAI Whisper 精準識別
- 🧠 **AI 對話** - GPT-4o + 花小軟人格化
- 🔊 **語音合成** - Cartesia Sonic 自然語音
- 🎵 **自動播放** - 流暢的語音對話體驗
- 🎨 **精美 UI** - ChatKit 風格的治愈系界面

---

## 🔀 專案結構

本倉庫包含：

### 📦 核心專案

- **`soft-voice-mvp/`** - 語氣靈 MVP 完整專案
  - `frontend/` - 原版 MVP 前端（✅ 完整功能）
  - `frontend-chatkit/` - ChatKit 版本前端（⚠️ 實驗性）
  - `backend/` - Express API 服務器

### 📚 學習資源

- **`chatkit-js/`** - OpenAI ChatKit 官方源碼
- **`治愈AI聊天框UI_项目文件/`** - UI 設計參考

---

## 🚀 快速開始

### 前置需求

- Node.js 18+
- OpenAI API Key
- Cartesia API Key

### 安裝和啟動

```bash
# 1. 克隆倉庫
git clone https://github.com/waitinchen/linkya-ai-v2.git
cd linkya-ai-v2

# 2. 進入 MVP 目錄
cd soft-voice-mvp

# 3. 安裝後端依賴
cd backend
npm install

# 4. 配置環境變數
cp env.example .env
# 編輯 .env 填入你的 API Keys

# 5. 安裝前端依賴
cd ../frontend
npm install

# 6. 啟動服務（兩個終端）
# 終端 1 - 後端
cd backend && npm run dev

# 終端 2 - 前端
cd frontend && npm run dev

# 7. 訪問 http://localhost:5173
```

詳細安裝指南：查看 [soft-voice-mvp/SETUP.md](./soft-voice-mvp/SETUP.md)

---

## 📖 文檔導航

### 🚀 快速開始
- **[START_HERE.md](./soft-voice-mvp/START_HERE.md)** - ⭐ **5 分鐘快速入門**
- [soft-voice-mvp/README.md](./soft-voice-mvp/README.md) - 專案總覽
- [soft-voice-mvp/QUICKSTART.md](./soft-voice-mvp/QUICKSTART.md) - 詳細快速開始
- [soft-voice-mvp/LOCAL_TESTING_GUIDE.md](./soft-voice-mvp/LOCAL_TESTING_GUIDE.md) - 本地測試完整指引

### ⚙️ 配置與設置
- [soft-voice-mvp/QUICK_CONFIG.md](./soft-voice-mvp/QUICK_CONFIG.md) - 環境配置指南
- [soft-voice-mvp/SETUP.md](./soft-voice-mvp/SETUP.md) - 詳細安裝指南

### 🏗️ 技術文檔
- [soft-voice-mvp/ARCHITECTURE.md](./soft-voice-mvp/ARCHITECTURE.md) - 技術架構
- [soft-voice-mvp/VOICE_AGENT_INTEGRATION.md](./soft-voice-mvp/VOICE_AGENT_INTEGRATION.md) - Voice Agent 整合
- [soft-voice-mvp/PROJECT_SUMMARY.md](./soft-voice-mvp/PROJECT_SUMMARY.md) - 專案總結

### 🚀 部署文檔
- [soft-voice-mvp/DEPLOYMENT.md](./soft-voice-mvp/DEPLOYMENT.md) - 部署指南

### 🌸 Alpha 測試
- [soft-voice-mvp/ALPHA_TEST_INVITATION.md](./soft-voice-mvp/ALPHA_TEST_INVITATION.md) - Alpha 測試邀請
- [soft-voice-mvp/ALPHA_TEST_FORM.md](./soft-voice-mvp/ALPHA_TEST_FORM.md) - 測試回饋表
- [soft-voice-mvp/ALPHA_INVITATION_MESSAGE.md](./soft-voice-mvp/ALPHA_INVITATION_MESSAGE.md) - 邀請訊息模板

### 🔀 ChatKit 版本
- [soft-voice-mvp/CHATKIT_COMPARISON.md](./soft-voice-mvp/CHATKIT_COMPARISON.md) - 版本對比
- [soft-voice-mvp/frontend-chatkit/README.md](./soft-voice-mvp/frontend-chatkit/README.md) - ChatKit 版本說明

---

## 🎯 核心技術

| 技術層 | 使用技術 |
|--------|---------|
| **前端** | React 18 + TypeScript + Vite |
| **UI** | Tailwind CSS + 自訂 ChatKit 風格 |
| **後端** | Node.js + Express |
| **STT** | OpenAI Whisper |
| **LLM** | GPT-4o |
| **TTS** | Cartesia Sonic |
| **語音** | MediaRecorder API + HTML5 Audio |

---

## 🎨 界面預覽

### 花小軟特色

- 🌸 粉紅色治愈系主題
- 💬 流暢的氣泡動畫
- 🎤 錄音脈衝效果
- 📱 響應式設計

### 對話體驗

```
用戶：點擊錄音 🎤
    ↓
錄製 10 秒語音
    ↓
Whisper 轉文字
    ↓
GPT-4o 生成回應
    ↓
Cartesia 語音合成
    ↓
自動播放花小軟回應 🌸
```

---

## 📊 專案統計

- ✅ **117 個文件**
- ✅ **21,925+ 行代碼**
- ✅ **完整文檔體系**
- ✅ **兩個前端版本**
- ✅ **生產就緒**

---

## 🔗 相關資源

### API 服務

- [OpenAI Platform](https://platform.openai.com/) - GPT-4o & Whisper
- [Cartesia AI](https://cartesia.ai/) - Sonic TTS

### 框架和工具

- [ChatKit JS](https://github.com/openai/chatkit-js) - OpenAI ChatKit
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 構建工具
- [Tailwind CSS](https://tailwindcss.com/) - 樣式框架

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📝 License

MIT License

---

## 🌸 致謝

感謝以下技術和服務：

- **OpenAI** - 強大的 Whisper 和 GPT-4o
- **Cartesia** - 高品質 TTS 服務
- **React** - 優秀的前端框架
- **Vite** - 極速的構建工具

---

## 🎤 Streaming TTS Integration (ElevenLabs)

詳見 👉 [VOICE_AGENT_TTS_README.md](./VOICE_AGENT_TTS_README.md)

---

**🎙️ 語氣靈的聲音人格世界，正式登場！** 🌸

*開始與花小軟展開溫暖的語音對話吧～*

