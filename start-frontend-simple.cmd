@echo off
title CoreInventory Frontend
color 0A

echo.
echo ========================================
echo    Starting Frontend Server
echo ========================================
echo.

echo Starting Frontend...
cd /d %~dp0\frontend
npm run dev

echo.
echo ========================================
echo    Frontend is starting...
echo    Backend should be running on port 8080
echo    Frontend URL: http://localhost:5173
echo.
echo ========================================
echo.
echo    Press any key to stop this window...
echo ========================================
pause >nul
