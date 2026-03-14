# CoreInventory – Complete Setup Guide

## 🎯 Project Overview

CoreInventory is a full-stack inventory management system with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MySQL
- **Features**: Real-time inventory tracking, receipts, deliveries, authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- Git installed

### 1. Clone and Setup Frontend
```bash
# Clone repository
git clone <repository-url>
cd core-inventory

# Setup frontend
cd frontend
npm install
npm run dev
# Frontend runs on: http://localhost:5173
```

### 2. Setup Backend
```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
npm install

# Configure database
cp .env .env.example
# Edit .env with your MySQL credentials

# Initialize database
npm run init-db

# Start backend server
npm run dev
# Backend runs on: http://localhost:5000
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔧 Detailed Setup

### Database Setup

1. **Install MySQL** (if not already installed):
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (using Homebrew)
brew install mysql

# Windows
# Download from https://dev.mysql.com/downloads/mysql/
```

2. **Start MySQL Service**:
```bash
# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql

# Windows
# Start from Services or run: net start mysql
```

3. **Create Database User** (optional):
```bash
mysql -u root -p

CREATE USER 'coreuser'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON core_inventory.* TO 'coreuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Backend Configuration

1. **Environment Variables**:
```bash
# backend/.env
DB_HOST=localhost
DB_USER=coreuser          # or 'root'
DB_PASSWORD=strongpassword
DB_NAME=core_inventory
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

2. **Initialize Database**:
```bash
cd backend
npm run init-db
```

This will:
- Create the `core_inventory` database
- Create all required tables
- Insert sample data
- Create default users

### Frontend Configuration

1. **Environment Variables** (optional):
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Default Login Credentials

After database initialization, you can login with:

**Admin User:**
- Email: `admin@coreinventory.com`
- Password: `admin123`

**Manager User:**
- Email: `john@coreinventory.com`
- Password: `manager123`

## 📊 Sample Data

The system includes sample data for testing:

- **Users**: 2 users (admin, manager)
- **Warehouses**: 3 warehouses
- **Locations**: 8 storage locations
- **Products**: 8 products with different categories
- **Stock**: Initial inventory levels across locations

## 🔍 Testing the System

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@coreinventory.com","password":"admin123"}'
```

### 2. Test Frontend
1. Open http://localhost:5173 in browser
2. Login with default credentials
3. Navigate through different sections:
   - Dashboard
   - Stock Management
   - Receipts
   - Deliveries

### 3. Test Inventory Operations
1. **Create Receipt**:
   - Go to Receipts → Create New Receipt
   - Add products and quantities
   - Validate receipt (stock will increase)

2. **Create Delivery**:
   - Go to Deliveries → Create New Delivery
   - Add products (system checks available stock)
   - Validate delivery (stock will decrease)

3. **Check Stock Levels**:
   - Go to Stock Management
   - View real-time inventory levels
   - Check low stock alerts

## 🛠️ Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
npm run init-db      # Reinitialize database
```

### Database Management
```bash
# Connect to MySQL
mysql -u root -p core_inventory

# View tables
SHOW TABLES;

# View sample data
SELECT * FROM products;
SELECT * FROM stock;
SELECT * FROM users;
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**:
```bash
# Check MySQL status
sudo systemctl status mysql

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Reset database
cd backend && npm run init-db
```

2. **Port Already in Use**:
```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>

# Or use different ports
PORT=5001 npm run dev  # Backend
```

3. **CORS Issues**:
```bash
# Check frontend URL in backend/.env
FRONTEND_URL=http://localhost:5173

# Restart backend after changing .env
```

4. **Authentication Issues**:
```bash
# Clear browser localStorage
# Or login again with correct credentials

# Check JWT secret in backend/.env
JWT_SECRET=your-super-secret-jwt-key
```

### Logs and Debugging

1. **Backend Logs**:
```bash
cd backend
npm run dev  # Shows request logs in console
```

2. **Frontend Logs**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API requests

3. **Database Logs**:
```bash
# Enable MySQL general log (for debugging)
mysql -u root -p -e "
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/mysql.log';
"
```

## 🚀 Production Deployment

### Backend Production Setup

1. **Environment Setup**:
```bash
NODE_ENV=production
JWT_SECRET=your-production-secret
DB_HOST=your-production-db-host
PORT=5000
```

2. **Process Manager** (PM2):
```bash
npm install -g pm2
pm2 start server.js --name core-inventory-api
pm2 startup
pm2 save
```

3. **Reverse Proxy** (Nginx):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Frontend Production Build

```bash
cd frontend
npm run build

# Serve static files with nginx or any web server
# The build output is in 'dist/' folder
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Products Endpoints
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock Endpoints
- `GET /api/stock` - Get all stock levels
- `GET /api/stock/alerts/low-stock` - Get low stock alerts
- `PUT /api/stock/:id` - Update stock quantity

### Receipts Endpoints
- `GET /api/receipts` - List receipts
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id/status` - Update receipt status

### Deliveries Endpoints
- `GET /api/deliveries` - List deliveries
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/:id/status` - Update delivery status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
1. Check this setup guide
2. Review the README files in frontend/ and backend/ folders
3. Check the API documentation
4. Create an issue in the repository

---

**Happy Inventory Managing! 🎉**
