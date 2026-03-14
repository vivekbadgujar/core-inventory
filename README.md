# CoreInventory – Inventory Management System

A modern, ERP-style inventory management system built with React, Vite, and TailwindCSS. Designed for hackathon projects with a professional dashboard interface.

## 🚀 Features

- **Dashboard Overview** - Real-time analytics and inventory status
- **Stock Management** - Monitor and manage inventory levels
- **Warehouse Management** - Manage multiple warehouse facilities
- **Location Management** - Define storage locations within warehouses
- **Receipt Management** - Handle inbound inventory receipts
- **Delivery Management** - Manage outgoing shipments and deliveries
- **Settings** - User preferences and system configuration

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with custom dark theme
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Pages & Features

### 1. Dashboard
- Overview cards for receipts and deliveries
- Today's movement statistics
- Quick notes and activity feed
- Navigation to all major sections

### 2. Stock Management
- Inventory table with product details
- Stock levels and locations
- Search and filter capabilities
- Low stock alerts

### 3. Warehouse Management
- Warehouse listing with capacity utilization
- Status indicators (Active, Full, Maintenance)
- Manager assignments
- Add/Edit warehouse functionality

### 4. Location Management
- Storage location definitions
- Warehouse associations
- Location codes and naming

### 5. Receipt Management
- Inbound receipt tracking
- Status management (Draft, Ready, Done)
- Create new receipts with detailed forms
- Product and quantity management

### 6. Delivery Management
- Outgoing delivery tracking
- Partner and contact management
- Create new deliveries with multi-item support
- Location-based inventory allocation

### 7. Settings
- Profile management
- Notification preferences
- Security settings
- Data export/import
- Appearance customization

## 🎨 Design Features

- **Dark Theme**: Professional ERP-style interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Components**: Cards, panels, and interactive elements
- **Smooth Transitions**: Hover effects and animations
- **Accessibility**: Semantic HTML and keyboard navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── Card.jsx          # Reusable card component
│   ├── Navbar.jsx        # Top navigation bar
│   ├── Sidebar.jsx       # Side navigation menu
│   └── Table.jsx         # Data table component
├── pages/
│   ├── Dashboard.jsx     # Main dashboard
│   ├── Stock.jsx         # Inventory management
│   ├── Warehouse.jsx     # Warehouse settings
│   ├── Location.jsx      # Location settings
│   ├── Receipts.jsx      # Receipt list
│   ├── NewReceipt.jsx    # Create new receipt
│   ├── Delivery.jsx      # Delivery list
│   ├── NewDelivery.jsx   # Create new delivery
│   ├── Login.jsx         # Authentication
│   └── Settings.jsx      # System settings
├── App.jsx               # Main app component with routing
├── main.jsx              # App entry point
└── index.css             # Global styles and Tailwind
```

## 🚀 Build & Deploy

1. Build for production:
```bash
npm run build
```

2. Preview production build:
```bash
npm run preview
```

---

**Built with ❤️ for hackathon innovation**
