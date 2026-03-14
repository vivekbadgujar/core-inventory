-- CoreInventory Database Schema
-- MySQL Database Schema for Inventory Management System

-- Create database
CREATE DATABASE IF NOT EXISTS core_inventory;
USE core_inventory;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    unit VARCHAR(50) DEFAULT 'pcs',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_category (category)
);

-- Warehouses table
CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_short_code (short_code)
);

-- Locations table
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    warehouse_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    INDEX idx_warehouse (warehouse_id)
);

-- Stock table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    location_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_location (product_id, location_id),
    INDEX idx_product (product_id),
    INDEX idx_location (location_id),
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 0)
);

-- Receipts table
CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(100) NOT NULL UNIQUE,
    supplier VARCHAR(255) NOT NULL,
    scheduled_date DATE,
    status ENUM('draft', 'ready', 'done', 'cancelled') DEFAULT 'draft',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reference (reference),
    INDEX idx_status (status),
    INDEX idx_supplier (supplier)
);

-- Receipt items table
CREATE TABLE receipt_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_receipt (receipt_id),
    INDEX idx_product (product_id),
    CONSTRAINT chk_receipt_quantity_positive CHECK (quantity > 0)
);

-- Deliveries table
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(100) NOT NULL UNIQUE,
    customer VARCHAR(255) NOT NULL,
    scheduled_date DATE,
    status ENUM('draft', 'ready', 'done', 'cancelled') DEFAULT 'draft',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reference (reference),
    INDEX idx_status (status),
    INDEX idx_customer (customer)
);

-- Delivery items table
CREATE TABLE delivery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_delivery (delivery_id),
    INDEX idx_product (product_id),
    CONSTRAINT chk_delivery_quantity_positive CHECK (quantity > 0)
);

-- Stock movements table (for audit trail)
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    location_id INT NOT NULL,
    movement_type ENUM('in', 'out') NOT NULL,
    quantity INT NOT NULL,
    reference_type ENUM('receipt', 'delivery') NOT NULL,
    reference_id INT NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_movement (product_id),
    INDEX idx_location_movement (location_id),
    INDEX idx_reference (reference_type, reference_id),
    INDEX idx_movement_type (movement_type)
);

-- Insert sample data
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@coreinventory.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin'),
('John Manager', 'john@coreinventory.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'manager');

INSERT INTO warehouses (name, short_code, address) VALUES
('Main Warehouse', 'MWH', 'Sector 21, Pune Logistics Park'),
('Secondary Warehouse', 'SWH', 'Sector 45, Mumbai Industrial Area'),
('Distribution Center', 'DWH', 'Sector 12, Delhi Logistics Hub');

INSERT INTO locations (name, warehouse_id) VALUES
('Aisle 01 - Rack A', 1),
('Aisle 01 - Rack B', 1),
('Aisle 02 - Rack A', 1),
('Aisle 02 - Rack B', 1),
('Storage Area A', 2),
('Storage Area B', 2),
('Loading Dock 1', 3),
('Loading Dock 2', 3);

INSERT INTO products (name, sku, category, unit) VALUES
('Laptop Dell XPS 15', 'DELL-XPS-15', 'Electronics', 'pcs'),
('Office Chair Ergonomic', 'CHAIR-ERG-01', 'Furniture', 'pcs'),
('Standing Desk Converter', 'DESK-CONV-01', 'Furniture', 'pcs'),
('Wireless Mouse Logitech', 'MOUSE-LOG-01', 'Electronics', 'pcs'),
('Monitor 27 inch 4K', 'MON-27-4K-01', 'Electronics', 'pcs'),
('Keyboard Mechanical', 'KEYB-MECH-01', 'Electronics', 'pcs'),
('Desk Lamp LED', 'LAMP-LED-01', 'Lighting', 'pcs'),
('File Cabinet 4 Drawer', 'CABINET-4D-01', 'Furniture', 'pcs');

-- Initialize stock for some products
INSERT INTO stock (product_id, location_id, quantity) VALUES
(1, 1, 50), (1, 2, 30), (2, 1, 25), (2, 2, 40),
(3, 3, 15), (3, 4, 20), (4, 1, 100), (4, 2, 80),
(5, 3, 35), (5, 4, 25), (6, 1, 60), (6, 2, 45),
(7, 3, 75), (7, 4, 55), (8, 1, 10), (8, 2, 15);
