// Mock database for development without MySQL
// This provides sample data to test the frontend

// Mock data
const mockData = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@coreinventory.com', role: 'admin', password: 'admin123' },
    { id: 2, name: 'John Manager', email: 'john@coreinventory.com', role: 'manager', password: 'manager123' }
  ],
  
  products: [
    { id: 1, name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-15', category: 'Electronics', unit: 'pcs', total_stock: 80 },
    { id: 2, name: 'Office Chair Ergonomic', sku: 'CHAIR-ERG-01', category: 'Furniture', unit: 'pcs', total_stock: 65 },
    { id: 3, name: 'Standing Desk Converter', sku: 'DESK-CONV-01', category: 'Furniture', unit: 'pcs', total_stock: 35 },
    { id: 4, name: 'Wireless Mouse Logitech', sku: 'MOUSE-LOG-01', category: 'Electronics', unit: 'pcs', total_stock: 180 },
    { id: 5, name: 'Monitor 27 inch 4K', sku: 'MON-27-4K-01', category: 'Electronics', unit: 'pcs', total_stock: 60 },
    { id: 6, name: 'Keyboard Mechanical', sku: 'KEYB-MECH-01', category: 'Electronics', unit: 'pcs', total_stock: 105 },
    { id: 7, name: 'Desk Lamp LED', sku: 'LAMP-LED-01', category: 'Lighting', unit: 'pcs', total_stock: 130 },
    { id: 8, name: 'File Cabinet 4 Drawer', sku: 'CABINET-4D-01', category: 'Furniture', unit: 'pcs', total_stock: 25 }
  ],
  
  stock: [
    { id: 1, product_id: 1, product_name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-15', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack A', quantity: 50 },
    { id: 2, product_id: 1, product_name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-15', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack B', quantity: 30 },
    { id: 3, product_id: 2, product_name: 'Office Chair Ergonomic', sku: 'CHAIR-ERG-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack A', quantity: 25 },
    { id: 4, product_id: 2, product_name: 'Office Chair Ergonomic', sku: 'CHAIR-ERG-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack B', quantity: 40 },
    { id: 5, product_id: 3, product_name: 'Standing Desk Converter', sku: 'DESK-CONV-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack A', quantity: 15 },
    { id: 6, product_id: 3, product_name: 'Standing Desk Converter', sku: 'DESK-CONV-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack B', quantity: 20 },
    { id: 7, product_id: 4, product_name: 'Wireless Mouse Logitech', sku: 'MOUSE-LOG-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack A', quantity: 100 },
    { id: 8, product_id: 4, product_name: 'Wireless Mouse Logitech', sku: 'MOUSE-LOG-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack B', quantity: 80 },
    { id: 9, product_id: 5, product_name: 'Monitor 27 inch 4K', sku: 'MON-27-4K-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack A', quantity: 35 },
    { id: 10, product_id: 5, product_name: 'Monitor 27 inch 4K', sku: 'MON-27-4K-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack B', quantity: 25 },
    { id: 11, product_id: 6, product_name: 'Keyboard Mechanical', sku: 'KEYB-MECH-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack A', quantity: 60 },
    { id: 12, product_id: 6, product_name: 'Keyboard Mechanical', sku: 'KEYB-MECH-01', category: 'Electronics', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack B', quantity: 45 },
    { id: 13, product_id: 7, product_name: 'Desk Lamp LED', sku: 'LAMP-LED-01', category: 'Lighting', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack A', quantity: 75 },
    { id: 14, product_id: 7, product_name: 'Desk Lamp LED', sku: 'LAMP-LED-01', category: 'Lighting', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 02 - Rack B', quantity: 55 },
    { id: 15, product_id: 8, product_name: 'File Cabinet 4 Drawer', sku: 'CABINET-4D-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack A', quantity: 10 },
    { id: 16, product_id: 8, product_name: 'File Cabinet 4 Drawer', sku: 'CABINET-4D-01', category: 'Furniture', unit: 'pcs', warehouse_name: 'Main Warehouse', warehouse_code: 'MWH', location_name: 'Aisle 01 - Rack B', quantity: 15 }
  ],
  
  receipts: [
    { id: 1, reference: 'WH/IN/0001', supplier: 'Tech Supplies Inc.', scheduled_date: '2026-03-20', status: 'draft', created_at: new Date().toISOString(), item_count: 2, total_quantity: 25 },
    { id: 2, reference: 'WH/IN/0002', supplier: 'Office Furniture Co.', scheduled_date: '2026-03-21', status: 'ready', created_at: new Date().toISOString(), item_count: 1, total_quantity: 15 },
    { id: 3, reference: 'WH/IN/0003', supplier: 'Electronics Depot', scheduled_date: '2026-03-22', status: 'done', created_at: new Date().toISOString(), item_count: 3, total_quantity: 40 }
  ],
  deliveries: [
    { id: 1, reference: 'WH/OUT/0001', customer: 'ABC Corporation', scheduled_date: '2026-03-20', status: 'draft', created_at: new Date().toISOString(), item_count: 1, total_quantity: 10 },
    { id: 2, reference: 'WH/OUT/0002', customer: 'XYZ Solutions', scheduled_date: '2026-03-21', status: 'ready', created_at: new Date().toISOString(), item_count: 2, total_quantity: 20 },
    { id: 3, reference: 'WH/OUT/0003', customer: 'Tech Startup LLC', scheduled_date: '2026-03-22', status: 'done', created_at: new Date().toISOString(), item_count: 1, total_quantity: 5 }
  ],
  delivery_items: [
    { id: 1, delivery_id: 1, product_id: 1, quantity: 10 },
    { id: 2, delivery_id: 2, product_id: 2, quantity: 15 },
    { id: 3, delivery_id: 2, product_id: 3, quantity: 5 },
    { id: 4, delivery_id: 3, product_id: 1, quantity: 5 }
  ],
  movements: []
};

let nextId = {
  receipt: 4,
  delivery: 4,
  receiptItem: 1,
  deliveryItem: 5
};

// Mock JWT token generation
const generateToken = (user) => {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

// Mock database functions
const query = async (sql, params = []) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simple SQL parsing for mock operations
  if (sql.includes('SELECT')) {
    if (sql.includes('products')) {
      if (sql.includes('WHERE id =')) {
        const id = parseInt(params[0]);
        const product = mockData.products.find(p => p.id === id);
        return product ? [product] : [];
      }
      return mockData.products;
    }
    
    if (sql.includes('deliveries')) {
      // Handle complex delivery queries with JOINs
      if (sql.includes('LEFT JOIN')) {
        return mockData.deliveries.map(d => ({
          ...d,
          created_by_name: 'Admin User', // Mock user name
          item_count: d.item_count || 1,
          total_quantity: d.total_quantity || 10
        }));
      }
      
      if (sql.includes('WHERE id =')) {
        const id = parseInt(params[0]);
        const delivery = mockData.deliveries.find(d => d.id === id);
        return delivery ? [delivery] : [];
      }
      
      if (sql.includes('status FROM deliveries WHERE id =')) {
        const id = parseInt(params[0]);
        const delivery = mockData.deliveries.find(d => d.id === id);
        return delivery ? [{ status: delivery.status }] : [];
      }
      
      return mockData.deliveries;
    }
    
    if (sql.includes('delivery_items')) {
      // Mock delivery items
      if (sql.includes('SELECT product_id, quantity FROM delivery_items WHERE delivery_id =')) {
        const deliveryId = parseInt(params[0]);
        const items = mockData.delivery_items.filter(di => di.delivery_id === deliveryId);
        return items;
      }
      return mockData.delivery_items;
    }
    
    if (sql.includes('stock')) {
      // Handle complex stock queries with JOINs
      if (sql.includes('JOIN')) {
        // This is the complex query from stockController
        return mockData.stock.map(s => ({
          id: s.id,
          quantity: s.quantity,
          product_id: s.product_id,
          product_name: s.product_name,
          sku: s.sku,
          category: s.category,
          unit: s.unit,
          location_id: 1, // Mock location ID
          location_name: s.location_name,
          warehouse_id: 1, // Mock warehouse ID
          warehouse_name: s.warehouse_name,
          warehouse_code: s.warehouse_code
        }));
      }
      
      if (sql.includes('COUNT(*) as count')) {
        const lowStock = mockData.stock.filter(s => s.quantity <= 10);
        return [{ count: lowStock.length }];
      }
      
      return mockData.stock;
    }
    
    if (sql.includes('receipts')) {
      return mockData.receipts;
    }
    
    if (sql.includes('users')) {
      if (sql.includes('WHERE email =')) {
        const email = params[0];
        const user = mockData.users.find(u => u.email === email);
        return user ? [{ id: user.id, name: user.name, email: user.email, role: user.role, password_hash: 'mock-hash' }] : [];
      }
      if (sql.includes('WHERE id =')) {
        const id = parseInt(params[0]);
        const user = mockData.users.find(u => u.id === id);
        return user ? [{ id: user.id, name: user.name, email: user.email, role: user.role }] : [];
      }
      return [];
    }
  }
  
  if (sql.includes('INSERT')) {
    if (sql.includes('receipts')) {
      const receipt = {
        id: nextId.receipt++,
        reference: `WH/IN/${String(nextId.receipt).padStart(4, '0')}`,
        supplier: params[0],
        scheduled_date: params[1],
        status: 'draft',
        created_at: new Date().toISOString(),
        item_count: 0,
        total_quantity: 0
      };
      mockData.receipts.push(receipt);
      return [{ insertId: receipt.id }];
    }
    
    if (sql.includes('deliveries')) {
      const delivery = {
        id: nextId.delivery++,
        reference: `WH/OUT/${String(nextId.delivery).padStart(4, '0')}`,
        customer: params[0],
        scheduled_date: params[1],
        status: 'draft',
        created_at: new Date().toISOString(),
        item_count: 0,
        total_quantity: 0
      };
      mockData.deliveries.push(delivery);
      return [{ insertId: delivery.id }];
    }
  }
  
  if (sql.includes('UPDATE')) {
    if (sql.includes('receipts') && sql.includes('status')) {
      const id = parseInt(params[1]);
      const status = params[0];
      const receipt = mockData.receipts.find(r => r.id === id);
      if (receipt) {
        receipt.status = status;
        
        // If status is 'done', update stock (increase)
        if (status === 'done') {
          // This would normally update stock based on receipt items
          // For now, we'll just simulate it
        }
      }
      return [];
    }
    
    if (sql.includes('deliveries') && sql.includes('status')) {
      const id = parseInt(params[1]);
      const status = params[0];
      const delivery = mockData.deliveries.find(d => d.id === id);
      if (delivery) {
        delivery.status = status;
        
        // If status is 'done', update stock (decrease)
        if (status === 'done') {
          // This would normally update stock based on delivery items
          // For now, we'll just simulate it
        }
      }
      return [];
    }
    
    if (sql.includes('stock') && sql.includes('quantity')) {
      const id = parseInt(params[1]);
      const quantity = parseInt(params[0]);
      const stock = mockData.stock.find(s => s.id === id);
      if (stock) {
        stock.quantity = quantity;
      }
      return [];
    }
  }
  
  return [];
};

// Mock transaction function for complex operations
const transaction = async (callback) => {
  // Simulate transaction
  return await callback({ 
    execute: async (sql, params) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Handle transaction-specific queries
      if (sql.includes('INSERT INTO deliveries')) {
        const delivery = {
          id: nextId.delivery++,
          reference: `WH/OUT/${String(nextId.delivery).padStart(4, '0')}`,
          customer: params[0],
          scheduled_date: params[1],
          status: 'draft',
          created_at: new Date().toISOString(),
          item_count: 0,
          total_quantity: 0
        };
        mockData.deliveries.push(delivery);
        return [{ insertId: delivery.id }];
      }
      
      if (sql.includes('UPDATE deliveries SET status')) {
        const id = parseInt(params[1]);
        const status = params[0];
        const delivery = mockData.deliveries.find(d => d.id === id);
        if (delivery) {
          delivery.status = status;
        }
        return [];
      }
      
      return [];
    }
  });
};

const testConnection = async () => {
  console.log('✅ Mock database connected successfully');
};

// Mock authentication functions
export const authenticateUser = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
  
  const user = mockData.users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user)
  };
};

export { query, transaction, testConnection };
