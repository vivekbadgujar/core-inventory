@echo off
title CoreInventory Development Servers
color 0A

echo.
echo ========================================
echo    CoreInventory Quick Start
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0\backend && npm start"

timeout /t 3 >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo    Servers are starting...
echo    Backend: http://localhost:5003/api
echo    Frontend: http://localhost:5173
echo.
echo ========================================
echo.
echo    Press any key to stop this window...
echo ========================================
pause >nul
