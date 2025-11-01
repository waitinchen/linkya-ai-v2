# 🚀 語氣靈 MVP 部署指南

## 📦 本地開發部署

### 需求檢查清單

- [ ] Node.js 18+ 已安裝
- [ ] npm 或 yarn 已安裝
- [ ] OpenAI API Key 已取得
- [ ] Cartesia API Key 已取得
- [ ] 瀏覽器支援 Web Audio API

### 安裝步驟

#### 1. 克隆專案（如果適用）

```bash
git clone <repository-url>
cd soft-voice-mvp
```

#### 2. 安裝後端依賴

```bash
cd backend
npm install
```

#### 3. 配置環境變數

創建 `backend/.env` 檔案：

```bash
cp backend/env.example backend/.env
```

編輯 `backend/.env`：

```env
OPENAI_API_KEY=sk-your_openai_key_here
CARTESIA_API_KEY=your_cartesia_key_here
CARTESIA_VOICE_ID=sonic
PORT=3000
```

#### 4. 安裝前端依賴

```bash
cd ../frontend
npm install
```

#### 5. 啟動開發服務器

**終端 1 - 後端：**
```bash
cd backend
npm run dev
```

**終端 2 - 前端：**
```bash
cd frontend
npm run dev
```

#### 6. 訪問應用

打開瀏覽器訪問：http://localhost:5173

---

## 🌐 生產環境部署

### 選項 1: Vercel + Railway（推薦）

#### 前端部署（Vercel）

```bash
cd frontend
vercel --prod
```

或通過 Vercel Dashboard：
1. 連接 GitHub Repository
2. 設置 Build Command: `npm run build`
3. 設置 Output Directory: `dist`
4. 設置 Framework Preset: `Vite`

**環境變數：**
- `VITE_API_BASE_URL` - 後端 API URL

#### 後端部署（Railway）

```bash
cd backend
railway login
railway init
railway up
```

**環境變數設置：**
- `OPENAI_API_KEY`
- `CARTESIA_API_KEY`
- `CARTESIA_VOICE_ID`
- `PORT`

### 選項 2: Cloudflare Pages + Render

#### 前端（Cloudflare Pages）

1. 連接 Git Repository
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Framework: `Vite`

#### 後端（Render）

1. 創建 Web Service
2. 連接 Repository
3. Build Command: `npm install`
4. Start Command: `npm start`

### 選項 3: Docker 部署

#### 創建 Dockerfile（後端）

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### 創建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CARTESIA_API_KEY=${CARTESIA_API_KEY}
      - PORT=3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 部署

```bash
docker-compose up -d
```

---

## 🔒 安全建議

### 環境變數保護

- ❌ 不要將 `.env` 提交到 Git
- ✅ 使用 Secrets Management（如 Vercel/Railway）
- ✅ 在不同環境使用不同 API Keys

### API 安全

- ✅ 在生產環境啟用 HTTPS
- ✅ 配置 CORS 白名單
- ✅ 實施 Rate Limiting
- ✅ 添加 API Key 驗證

### 範例：後端添加安全中間件

```javascript
// backend/server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 限制請求數量
});

app.use('/api/', limiter);
```

---

## 📊 監控和日誌

### 建議工具

- **Uptime Monitoring**: UptimeRobot / Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics / Plausible
- **Logs**: Datadog / LogRocket

### 健康檢查端點

已內建：`GET /health`

```
GET http://localhost:3000/health

Response:
{
  "status": "ok",
  "message": "語氣靈後端運行中"
}
```

---

## 🔄 CI/CD 配置

### GitHub Actions 範例

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 故障排除

### 問題：API 連線失敗

**檢查：**
1. 後端服務是否運行
2. CORS 設定是否正確
3. 環境變數是否配置
4. 網路防火牆設定

### 問題：語音辨識失敗

**檢查：**
1. OpenAI API Key 是否有效
2. 音訊格式是否支援
3. API 額度是否足夠

### 問題：語音合成失敗

**檢查：**
1. Cartesia API Key 是否有效
2. Voice ID 是否正確
3. 網路連線是否穩定

---

## 📈 性能優化

### 前端優化

- 啟用 Vite 的生產模式壓縮
- 使用 CDN 加速靜態資源
- 實現代碼分割
- 啟用 Service Worker 緩存

### 後端優化

- 實施 Redis 快取
- 添加資料庫連線池
- 優化 API 響應時間
- 實施 CDN 快取策略

---

## 📞 支援

遇到問題？
- 查看 [SETUP.md](./SETUP.md)
- 查看 [QUICKSTART.md](./QUICKSTART.md)
- 查看專案 Issue 區

---

**🌸 祝部署順利～花小軟期待與全世界的用戶對話！**

