# MySQL Setup Guide for CoreInventory

## Prerequisites

Before connecting MySQL, make sure you have MySQL installed and running on your system.

## Windows Setup

### Option 1: Install MySQL via MySQL Installer
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer and select "Server only" or "Developer Default"
3. During installation, set a root password (remember it!)
4. Configure the server to start automatically

### Option 2: Install via XAMPP/WAMP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP and start MySQL from the control panel
3. Default credentials: root / (no password)

### Option 3: Install via Chocolatey
```bash
choco install mysql
```

## macOS Setup

### Option 1: Homebrew
```bash
brew install mysql
brew services start mysql
```

### Option 2: MySQL Installer
1. Download from https://dev.mysql.com/downloads/mysql/
2. Install the DMG package
3. Follow the setup instructions

## Linux Setup

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### CentOS/RHEL
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

## Configuration

### 1. Update .env file
Edit `backend/.env` and set your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=core_inventory
```

### 2. Initialize Database
Run the database initialization script:

```bash
cd backend
npm run init-db
```

This will:
- Create the `core_inventory` database
- Create all necessary tables
- Insert a default admin user

### 3. Start Backend
```bash
npm start
```

## Default Login Credentials

After initialization, you can login with:
- **Email**: admin@coreinventory.com
- **Password**: admin123

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Reset MySQL root password or create a new user
- Update .env with correct credentials

### "Can't connect to MySQL server"
- Make sure MySQL is running
- Check if MySQL is on the correct port (default: 3306)
- Verify firewall settings

### "Database doesn't exist"
- Run `npm run init-db` to create the database
- Check if the database user has CREATE privileges

### "Module not found: mysql2"
- Install dependencies: `npm install`
- Make sure you're in the backend directory

## Testing Connection

To test if MySQL is working:

```bash
# Test MySQL connection
mysql -u root -p

# Should show MySQL prompt:
mysql>
```

Then run:
```sql
SHOW DATABASES;
```

You should see `core_inventory` listed after running the init script.

## Migration from Mock to MySQL

The system will automatically switch from mock data to MySQL when you:
1. Install and configure MySQL
2. Run `npm run init-db`
3. Restart the backend server

All your existing mock data will be replaced with the real MySQL database.
