@echo off
echo Starting CoreInventory Development Environment...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0\backend && npm start"

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001/api
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in this window to stop both servers
pause
