# 🚀 How to Run Both Frontend & Backend Servers

## Method 1: Simple Commands (Recommended)

Open **two separate terminal windows** and run:

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## Method 2: Batch File (Windows)

Double-click `start-servers.bat` or run:
```cmd
start-servers.bat
```

## Method 3: PowerShell (Windows)

Run in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File start-servers.ps1
```

## 📍 Server URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

## 🔧 Current Configuration

The system is configured to use:
- **Backend Port**: 5001 (to avoid conflicts)
- **Database**: Mock (ready for MySQL when needed)
- **Authentication**: Mock tokens

## 🛑 How to Stop

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows
- Or use Task Manager to end node.exe processes

## 💡 Tips

1. **First time setup**: Run Method 1 to see any errors
2. **Development**: Keep both terminals visible to see logs
3. **Port conflicts**: If port 5001 is busy, change backend/.env PORT=5002
4. **Database switching**: Use `npm run use-mysql` when ready for real database

## 🎯 Login Credentials

- **Email**: admin@coreinventory.com
- **Password**: admin123

---

**Recommendation**: Use Method 1 (two terminals) for best development experience!
