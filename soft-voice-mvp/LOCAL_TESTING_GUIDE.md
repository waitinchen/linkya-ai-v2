# ✅ C謀本地端測試全流程指引

## 📦 一、專案下載與環境安裝

### 1️⃣ 下載並進入專案資料夾

```bash
git clone https://github.com/waitinchen/linkya-ai-v2.git
cd linkya-ai-v2/soft-voice-mvp
```

### 2️⃣ 安裝前後端依賴

```bash
# 安裝後端套件
cd backend
npm install

# 安裝前端套件
cd ../frontend
npm install
```

---

## 🗝️ 二、設定 `.env` 檔案（環境變數）

### 1️⃣ 建立 `.env` 檔（如果還沒建立）

```bash
cd ../backend

# 複製範例檔案
cp env.example .env
```

### 2️⃣ 編輯 `.env`，補上 OpenAI 金鑰

**⚠️ 重要**：OpenAI 與 Cartesia 兩組金鑰都需要自行填入

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your_actual_openai_key_here  ← 請換成你的 OpenAI Key

# Cartesia Voice Configuration
CARTESIA_API_KEY=sk-your_cartesia_api_key_here  ← 請換成你的 Cartesia Key
CARTESIA_VOICE_ID=d3cb9a1f-73d1-48d4-8ee9-53183b40e284  ← 建議 Voice ID，可自行更換
CARTESIA_TTS_MODEL_ID=sonic-3
CARTESIA_LANGUAGE=zh
CARTESIA_SAMPLE_RATE=44100

# Server Configuration
PORT=3000
```

> 💡 **提醒**：倉庫內的舊測試金鑰已被停用，如出現 401/403 錯誤，請登入 Cartesia 後台重新生成新的 API Key。

**編輯方式**：
```bash
# Windows
notepad .env

# Linux/Mac
nano .env
# 或
vim .env
```

---

## 🚀 三、啟動服務

### 啟動後端（終端 1）

```bash
cd backend
npm run dev
```

**預期輸出**：
```
🚀 語氣靈後端運行於 http://localhost:3000
✅ STT 路由: /api/stt
✅ LLM 路由: /api/llm
✅ TTS 路由: /api/tts
```

### 啟動前端（終端 2）

```bash
cd frontend
npm run dev
```

**預期輸出**：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 開啟瀏覽器

訪問：**http://localhost:5173**

開啟後即可看到 ChatKit 風格的聊天視窗，開始與花小軟對話！

---

## 🎧 四、功能測試項目

| 功能項目 | 操作說明 | 預期結果 |
|---------|---------|---------|
| 🎙️ **錄音** | 按下麥克風圖示開始錄音 | 按鈕變成錄音中狀態（10秒限制） |
| 🧠 **語義辨識** | 說出自然語言問題 | 對話框顯示識別後的文字 |
| 💬 **花小軟回應** | 等待 LLM 生成回應 | 花小軟用甜甜語氣+20字內撒嬌語調回應 |
| 🔊 **自動播放** | 系統自動播放語音 | 無需點擊，自動播出花小軟的聲音 🌸 |
| 🎨 **視覺效果** | 觀察界面動畫 | 氣泡動畫、錄音脈衝、播放圖標 |

### 測試範例對話

**試試這些問題**：
1. "你好" → 期待花小軟打招呼
2. "今天天氣如何？" → 期待甜甜的回應
3. "你是誰？" → 期待花小軟自我介紹
4. "唱首歌給我聽" → 期待撒嬌的回應

---

## 🆘 五、遇到問題怎麼辦？

### 常見問題排查

#### ❌ 問題 1: 後端啟動失敗

**症狀**：`npm run dev` 報錯

**檢查**：
- [ ] Node.js 版本是否 >= 18
- [ ] 是否已執行 `npm install`
- [ ] `.env` 文件是否存在
- [ ] OpenAI API Key 是否正確

**解決**：
```bash
# 檢查 Node 版本
node -v

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

#### ❌ 問題 2: TTS 語音合成失敗

**症狀**：前端報錯 "語音合成失敗"

**檢查**：
- [ ] Cartesia API Key 是否有效（403/401 代表金鑰失效或權限不足）
- [ ] 網路連線是否正常
- [ ] 瀏覽器控制台錯誤信息

**解決**：
```bash
# 測試 Cartesia API（請替換成你自己的 API Key）
curl -X POST https://api.cartesia.ai/tts/bytes \
  -H "X-API-Key: sk-your_cartesia_api_key_here" \
  -H "Content-Type: application/json" \
  -H "Cartesia-Version: 2025-04-16" \
  -d '{"model_id":"sonic-3","transcript":"測試","voice":{"mode":"id","id":"d3cb9a1f-73d1-48d4-8ee9-53183b40e284"}}'
```

#### ❌ 問題 3: 麥克風無法錄音

**症狀**：點擊錄音按鈕無反應

**檢查**：
- [ ] 瀏覽器是否允許麥克風權限
- [ ] 是否使用 HTTPS 或 localhost
- [ ] 瀏覽器控制台是否有權限錯誤

**解決**：
1. 點擊瀏覽器地址欄左側的鎖圖標
2. 允許麥克風權限
3. 重新載入頁面

#### ❌ 問題 4: 前端無法連接到後端

**症狀**：API 請求失敗

**檢查**：
- [ ] 後端是否運行在 :3000
- [ ] `vite.config.js` 代理配置是否正確
- [ ] 瀏覽器控制台錯誤信息

**解決**：
```bash
# 檢查後端健康狀態
curl http://localhost:3000/health

# 應該返回
{"status":"ok","message":"語氣靈後端運行中"}
```

### 📚 參考文檔

- **`QUICK_CONFIG.md`** - 常見錯誤與排除方法
- **`VOICE_AGENT_INTEGRATION.md`** - 整合架構說明
- **`SETUP.md`** - 詳細安裝指南
- **`ARCHITECTURE.md`** - 技術架構文檔

---

## 🔜 六、下一步優化建議（可選）

### 🎨 UI/UX 優化

- [ ] 加入播放進度條與暫停控制
- [ ] 錄音波形可視化
- [ ] Loading 骨架屏
- [ ] 錯誤重試按鈕

### 🎭 個性化功能

- [ ] 設定角色語氣參數（溫柔/調皮）
- [ ] 多種 Voice ID 切換
- [ ] 情感狀態追蹤

### 💾 數據管理

- [ ] 儲存每一次對話記錄
- [ ] Redis 持久化記憶
- [ ] 對話歷史查詢

### 🚀 性能優化

- [ ] 並行處理 STT + LLM + TTS
- [ ] Stream TTS 響應
- [ ] 音訊緩存機制

---

## 🎉 測試成功檢查清單

測試完成後，確認以下功能：

- [x] ✅ 錄音按鈕正常工作
- [x] ✅ STT 語音轉文字準確
- [x] ✅ LLM 生成花小軟甜甜回應
- [x] ✅ TTS 語音清晰自然
- [x] ✅ 自動播放功能正常
- [x] ✅ 對話記錄保留
- [x] ✅ UI 動畫流暢
- [x] ✅ 錯誤處理友好

---

## 📞 支援與反饋

### 遇到問題？

1. 查看本文檔的「問題排查」部分
2. 檢查瀏覽器控制台錯誤
3. 查看 `QUICK_CONFIG.md` 疑難排解
4. 提交 Issue 到 GitHub

### 測試回饋

測試完成後，歡迎提供：
- ✅ 哪些功能正常
- ❌ 哪些功能有問題
- 💡 改進建議
- 🎉 使用心得

---

## 🌸 開始測試！

準備好了嗎？讓我們開始與花小軟的甜甜對話之旅吧～

**🎙️ 語氣靈的聲音人格世界，等你來探索！** 🌸

---

*測試指引版本: 1.0*  
*最後更新: 2025年1月*  
*專案倉庫: https://github.com/waitinchen/linkya-ai-v2*

