Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor White
Write-Host "CoreInventory Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor White
Write-Host ""

Set-Location $PSScriptRoot
cd frontend

Write-Host "Starting npm run dev..." -ForegroundColor Yellow
$process = Start-Process -FilePath "npm" -ArgumentList "run","dev" -PassThru -WindowStyle Hidden

if ($process -ne $null) {
    Write-Host "✅ Frontend started successfully!" -ForegroundColor Green
    Write-Host "Backend should be running on port 8080" -ForegroundColor Yellow
    Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Press any key to stop..." -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to start frontend" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor White
Write-Host "Press any key to exit..." -ForegroundColor Yellow

# Wait for key press
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Clean up
if ($null -ne $null) {
    Write-Host "Stopping frontend..." -ForegroundColor Yellow
    Stop-Process -Id $process.Id -Force
    Write-Host "Frontend stopped." -ForegroundColor Red
}

Write-Host "Exiting..." -ForegroundColor Gray
