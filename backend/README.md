# CoreInventory Backend

RESTful API backend for CoreInventory Management System with MySQL database, authentication, and comprehensive inventory management features.

## 🚀 Features

- **JWT Authentication** - Secure user authentication with role-based access
- **Inventory Management** - Complete stock tracking with FIFO/LIFO support
- **Receipt Management** - Inbound inventory processing
- **Delivery Management** - Outbound inventory with stock validation
- **Real-time Stock Updates** - Automatic stock adjustments
- **Audit Trail** - Complete stock movement history
- **Data Validation** - Comprehensive input validation with Joi
- **Error Handling** - Proper HTTP status codes and error messages

## 🛠 Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Setup MySQL database**:
```bash
# Make sure MySQL is running
mysql -u root -p

# Create database (optional, schema will create it)
CREATE DATABASE IF NOT EXISTS core_inventory;
```

3. **Configure environment**:
```bash
# Copy .env file and update with your MySQL credentials
cp .env.example .env

# Edit .env with your settings:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=core_inventory
JWT_SECRET=your-super-secret-jwt-key
```

4. **Initialize database**:
```bash
npm run init-db
```

5. **Start development server**:
```bash
npm run dev
```

## 🗄️ Database Schema

The system uses normalized MySQL tables:

- **users** - User authentication and roles
- **products** - Product catalog with SKU management
- **warehouses** - Warehouse locations
- **locations** - Specific storage locations within warehouses
- **stock** - Current inventory levels
- **receipts** - Inbound inventory receipts
- **receipt_items** - Individual receipt line items
- **deliveries** - Outbound inventory deliveries
- **delivery_items** - Individual delivery line items
- **stock_movements** - Audit trail for all stock changes

## 🔐 Authentication & Authorization

### User Roles
- **admin** - Full system access
- **manager** - Can manage inventory, receipts, deliveries
- **operator** - Can create receipts and deliveries

### JWT Authentication
```bash
# Login
POST /api/auth/login
{
  "email": "admin@coreinventory.com",
  "password": "password123"
}

# Response
{
  "message": "Login successful",
  "user": { "id": 1, "name": "Admin User", "email": "...", "role": "admin" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Routes
Include the JWT token in Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin/manager)
- `PUT /api/products/:id` - Update product (admin/manager)
- `DELETE /api/products/:id` - Delete product (admin)

### Stock
- `GET /api/stock` - Get all stock levels
- `GET /api/stock/product/:productId` - Get stock by product
- `GET /api/stock/alerts/low-stock` - Get low stock alerts
- `GET /api/stock/movements` - Get stock movements (audit)
- `PUT /api/stock/:id` - Update stock quantity (admin/manager)

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get receipt with items
- `POST /api/receipts` - Create new receipt
- `PUT /api/receipts/:id/status` - Update receipt status
- `DELETE /api/receipts/:id` - Delete receipt (draft only)

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery with items
- `POST /api/deliveries` - Create new delivery
- `PUT /api/deliveries/:id/status` - Update delivery status
- `DELETE /api/deliveries/:id` - Delete delivery (draft only)

## 🎯 Inventory Logic

### Receipt Processing
When a receipt is validated (status = "done"):
```sql
-- Stock increases
UPDATE stock SET quantity = quantity + ? WHERE product_id = ?;

-- Audit trail
INSERT INTO stock_movements (product_id, location_id, movement_type, quantity, reference_type, reference_id)
VALUES (?, ?, 'in', ?, 'receipt', ?);
```

### Delivery Processing
When a delivery is validated (status = "done"):
```sql
-- Stock decreases (FIFO method)
UPDATE stock SET quantity = quantity - ? WHERE id = ?;

-- Audit trail
INSERT INTO stock_movements (product_id, location_id, movement_type, quantity, reference_type, reference_id)
VALUES (?, ?, 'out', ?, 'delivery', ?);
```

### Stock Validation
- Prevents negative stock levels
- Validates sufficient stock before delivery creation
- FIFO (First In, First Out) method for stock depletion

## ✅ Validation Examples

### Email Validation
```json
// Invalid email
POST /api/auth/login
{
  "email": "invalid-email",
  "password": "password123"
}

// Response 400
{
  "error": "Validation failed",
  "details": ["Entered email is invalid"]
}
```

### Password Validation
```json
// Password too short
{
  "error": "Validation failed",
  "details": ["Password must be at least 8 characters"]
}
```

### SKU Uniqueness
```json
// Duplicate SKU
{
  "error": "SKU must be unique"
}
```

### Quantity Validation
```json
// Negative quantity
{
  "error": "Validation failed",
  "details": ["Quantity must be at least 1"]
}
```

## 🔧 Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": ["Detailed validation errors"] // Optional
}
```

## 🚀 Running in Production

1. **Environment variables**:
```bash
NODE_ENV=production
JWT_SECRET=your-production-secret
DB_HOST=your-production-db-host
```

2. **Build and start**:
```bash
npm install --production
npm start
```

3. **Security considerations**:
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up database user with limited permissions
- Enable rate limiting
- Monitor logs

## 📊 Sample Data

The database initialization includes:
- 2 sample users (admin, manager)
- 3 warehouses
- 8 locations
- 8 products
- Initial stock levels

Default login credentials:
- Email: `admin@coreinventory.com`
- Password: `admin123` (change in production)

## 🛠️ Development

### Database Scripts
```bash
# Initialize database with schema and sample data
npm run init-db

# Start development server with auto-reload
npm run dev
```

### API Testing
Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@coreinventory.com","password":"admin123"}'
```

## 📝 Logging

The server logs all requests and errors:
```
2024-03-14T12:00:00.000Z - GET /health
2024-03-14T12:00:01.000Z - POST /api/auth/login
```

## 🔄 Graceful Shutdown

The server handles SIGTERM and SIGINT signals for graceful shutdown, ensuring all database connections are properly closed.

---

**Built with ❤️ for CoreInventory Management System**
