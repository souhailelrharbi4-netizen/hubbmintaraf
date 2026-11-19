# 💙 HubbMinTaraf - Start Script
Write-Host "💙 بدا تشغيل الحب من طرف واحد..." -ForegroundColor Magenta

# Start Backend
Write-Host "🚀 تشغيل الباكند..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 تشغيل الفرونتاند..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host "✅ التطبيق كيتشغل على http://localhost:3000" -ForegroundColor Green
Write-Host "💙 الباكند على http://localhost:5000" -ForegroundColor Green
