# 🎙️ 語氣靈 - ChatKit 版本前端

> 使用 OpenAI ChatKit 重新構建的語氣靈前端界面

## 📋 概述

這是使用 [OpenAI ChatKit](https://github.com/openai/chatkit-js) 框架重新構建的前端版本。

### 與原版的差異

| 特性 | 原版 MVP | ChatKit 版本 |
|------|----------|--------------|
| **框架** | 自訂 React 組件 | OpenAI ChatKit |
| **UI 構建** | 手動實現氣泡 | 開箱即用 |
| **後端整合** | 直接 STT/LLM/TTS | 需要 ChatKit 後端 API |
| **功能完整度** | ✅ 完整語音對話 | ⚠️ 需要自訂後端 |
| **開發速度** | 中等 | 快速（有後端時） |
| **客製化** | 高度客製化 | 主題配置為主 |

## 🏗️ 架構

```plaintext
ChatKit 官方 Web Component
    ↓
@openai/chatkit-react 綁定
    ↓
自訂 API 配置（指向本地後端）
    ↓
後端需要實現 ChatKit API 規格
```

## ⚠️ 重要說明

### ChatKit 主要設計用途

ChatKit 主要設計用於：
1. **OpenAI 托管後端** - 使用 `getClientSecret` 模式
2. **Python SDK** - 使用 ChatKit Python SDK 建立後端
3. **自訂後端** - 需要實現完整的 ChatKit API 規格

### 當前狀態

本 ChatKit 版本目前**尚未完全功能**，因為：

1. ✅ UI 已完成 - ChatKit 界面已配置
2. ✅ 主題已配置 - 花小軟粉紅色主題
3. ⚠️ 後端整合進行中 - 需要實現 ChatKit API
4. ⏳ 語音功能待開發 - 需要額外整合

## 🚀 啟動

```bash
cd frontend-chatkit
npm install
npm run dev
```

訪問 http://localhost:5174

## 📝 配置說明

### API 配置

目前使用自訂後端配置：

```typescript
api: {
  url: 'http://localhost:3000/api/chatkit',
  domainKey: 'development-key',
}
```

**注意**：這需要後端實現 ChatKit API 規範。

### 主題配置

```typescript
theme: {
  colorScheme: 'light',
  color: {
    accent: { primary: '#ff6b95', level: 2 }
  },
  radius: 'round',
  density: 'normal',
}
```

## 🔧 開發建議

### 選項 1: 保留原版

如果你需要完整的語音對話功能，**建議繼續使用原版 MVP**：
- 功能完整
- 沒有外部依賴
- 完全控制

### 選項 2: 完善 ChatKit 後端

如果要使用 ChatKit 版本，需要：

1. 實現 ChatKit Python SDK 後端
2. 或者手動實現 ChatKit API 規格
3. 整合 STT/TTS 功能

### 選項 3: 混合方案

- 使用 ChatKit UI
- 保留原版的 STT/LLM/TTS API
- 手動橋接兩者

## 📚 參考資源

- [ChatKit JS 文檔](https://openai.github.io/chatkit-js/)
- [ChatKit 倉庫](https://github.com/openai/chatkit-js)
- [ChatKit Python SDK](https://github.com/openai/chatkit-python-sdk)
- [範例專案](https://github.com/openai/openai-chatkit-starter-app)

## 🎯 下一步

1. 決定是否繼續開發 ChatKit 版本
2. 如果要繼續，需要實現 ChatKit 後端
3. 或者切換回原版 MVP 繼續優化

---

**🌸 ChatKit 版本 - 實驗性構建**

