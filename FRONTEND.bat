@echo off
title CoreInventory Frontend
color 0A

echo.
echo ========================================
echo    Starting Frontend Server
echo ========================================
echo.

echo Starting Frontend...
echo Backend should be running on port 8080
echo Frontend URL: http://localhost:5173
echo.

echo ========================================
echo    Press any key to stop this window...
echo ========================================
pause >nul

echo.
echo Opening browser in 5 seconds...
timeout /t 5 start http://localhost:5173
