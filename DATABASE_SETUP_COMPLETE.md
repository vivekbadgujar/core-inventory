# MySQL Database Setup - CoreInventory

## 🎯 Current Status

✅ **Backend is running with Mock Database**  
✅ **Frontend is running on http://localhost:5173**  
✅ **All features working with sample data**

## 🔄 How to Switch to MySQL

### Step 1: Install MySQL

Choose one of these options:

#### Option A: XAMPP (Recommended for Windows)
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Start XAMPP Control Panel
4. Click "Start" next to MySQL
5. Default credentials: root / (no password)

#### Option B: MySQL Installer (Windows)
1. Download from https://dev.mysql.com/downloads/installer/
2. Install "MySQL Server"
3. Set root password during installation
4. Configure to start automatically

#### Option C: Homebrew (macOS)
```bash
brew install mysql
brew services start mysql
```

#### Option D: Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Step 2: Update Configuration

Edit `backend/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # Leave empty if no password
DB_NAME=core_inventory
```

### Step 3: Initialize Database

```bash
cd backend
npm run init-db
```

This will:
- Create the database
- Create all tables
- Insert default admin user
- **Login**: admin@coreinventory.com / admin123

### Step 4: Switch to MySQL

```bash
npm run use-mysql
npm start
```

## 🛠️ Database Management Commands

```bash
# Check current database type
npm run db-status

# Switch to Mock Database
npm run use-mysql

# Switch to MySQL Database
npm run use-mysql

# Initialize MySQL Database
npm run init-db
```

## 📊 What Changes When Switching to MySQL

### Mock Database (Current)
- ✅ Sample data pre-loaded
- ✅ No installation required
- ✅ Perfect for development
- ❌ Data resets on server restart

### MySQL Database
- ✅ Persistent data storage
- ✅ Real database operations
- ✅ Production-ready
- ✅ Multiple users support
- ❌ Requires MySQL installation

## 🔧 Troubleshooting

### "Can't connect to MySQL server"
```bash
# Check if MySQL is running
# Windows: Check XAMPP Control Panel
# macOS/Linux: brew services list | grep mysql
# or: sudo systemctl status mysql
```

### "Access denied for user"
```bash
# Update .env with correct credentials
# Reset MySQL root password if needed
```

### "Database doesn't exist"
```bash
# Run initialization
npm run init-db
```

### Want to go back to Mock?
```bash
npm run use-mock
npm start
```

## 🎉 Quick Start Summary

**Right Now**: Everything works with Mock Database  
**To Use MySQL**: Install MySQL → Run `npm run init-db` → Run `npm run use-mysql`

Both options give you full functionality. Choose based on your needs!
