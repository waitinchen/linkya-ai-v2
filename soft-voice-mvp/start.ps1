# 語氣靈快速啟動腳本

Write-Host "🚀 啟動語氣靈後端和前端..." -ForegroundColor Cyan

# 啟動後端（新窗口）
Write-Host "📦 啟動後端服務..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '後端啟動中...' -ForegroundColor Green; npm run dev"

# 等待 2 秒讓後端啟動
Start-Sleep -Seconds 2

# 啟動前端（新窗口）
Write-Host "📦 啟動前端服務..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '前端啟動中...' -ForegroundColor Green; npm install; npm run dev"

# 等待 5 秒讓服務啟動
Write-Host "⏳ 等待服務啟動..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# 打開瀏覽器
Write-Host "🌐 打開瀏覽器..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ 啟動完成！" -ForegroundColor Green
Write-Host "🌸 花小軟等著你～" -ForegroundColor Magenta
Write-Host ""
Write-Host "訪問地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

