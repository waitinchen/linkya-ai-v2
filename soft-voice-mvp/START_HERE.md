# 🚀 START HERE - 5 分鐘快速開始

> 第一次使用語氣靈？從這裡開始！

---

## ⚡ 超快速開始

### 1️⃣ 克隆專案

```bash
git clone https://github.com/waitinchen/linkya-ai-v2.git
cd linkya-ai-v2/soft-voice-mvp
```

### 2️⃣ 安裝依賴

```bash
# 後端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 3️⃣ 配置環境

**編輯 `backend/.env`**：
```env
OPENAI_API_KEY=你的_OpenAI_Key  # ← 改成你的！
CARTESIA_API_KEY=sk-your_cartesia_api_key_here  # ← 必須換成你自己的金鑰
CARTESIA_VOICE_ID=d3cb9a1f-73d1-48d4-8ee9-53183b40e284
PORT=3000
```

> ⚠️ **提醒**：倉庫原本提供的測試 Cartesia 金鑰已失效，請前往 Cartesia 後台申請新的 API Key 後再啟動。

### 4️⃣ 啟動服務

**終端 1**：
```bash
cd backend
npm run dev
```

**終端 2**：
```bash
cd frontend
npm run dev
```

### 5️⃣ 開始對話

訪問 **http://localhost:5173** 🎉

---

## 📚 遇到問題？

- **詳細指引**：[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)
- **配置問題**：[QUICK_CONFIG.md](./QUICK_CONFIG.md)
- **架構說明**：[ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🎉 開始你的花小軟之旅！

**🌸 語氣靈的聲音人格世界，等你探索～** 🎙️

