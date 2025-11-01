#!/bin/bash

echo "🌸 語氣靈 MVP 安裝腳本"
echo "========================"

# 安裝後端依賴
echo "📦 安裝後端依賴..."
cd backend
npm install
cd ..

# 安裝前端依賴
echo "📦 安裝前端依賴..."
cd frontend
npm install
cd ..

echo "✅ 安裝完成！"
echo ""
echo "📝 下一步："
echo "1. 在 backend/ 目錄創建 .env 文件並配置API金鑰"
echo "2. 執行 'npm run dev' 分別啟動前端和後端"
echo ""
echo "🌸 花小軟已準備就緒～"

