Write-Host "🚀 Starting CoreInventory Development Environment..." -ForegroundColor Cyan

Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
$backend = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "backend" -PassThru
if ($backend -ne $null) {
    Write-Host "✅ Backend started successfully!" -ForegroundColor Green
}

Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Magenta
$frontend = Start-Process -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory "." -PassThru
if ($frontend -ne $null) {
    Write-Host "✅ Frontend started successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Both servers are running!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host "🔧 Backend:  http://localhost:5001/api" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Press Ctrl+C to stop both servers" -ForegroundColor Yellow

# Keep script running
try {
    Wait-Process -Name $backend.Id, $frontend.Id -ErrorAction Stop
} catch {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Process -Id $backend.Id -Force
    Stop-Process -Id $frontend.Id -Force
    Write-Host "Servers stopped." -ForegroundColor Red
}
