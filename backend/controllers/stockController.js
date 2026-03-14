import { query, transaction } from '../config/db.js';

// Get all stock with product and location details
export const getAllStock = async (req, res) => {
  try {
    const stock = await query(`
      SELECT 
        s.id,
        s.quantity,
        p.id as product_id,
        p.name as product_name,
        p.sku,
        p.category,
        p.unit,
        l.id as location_id,
        l.name as location_name,
        w.id as warehouse_id,
        w.name as warehouse_name,
        w.short_code as warehouse_code
      FROM stock s
      JOIN products p ON s.product_id = p.id
      JOIN locations l ON s.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      ORDER BY w.name, l.name, p.name
    `);

    res.json({ stock });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get stock by product ID
export const getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const stock = await query(`
      SELECT 
        s.id,
        s.quantity,
        p.id as product_id,
        p.name as product_name,
        p.sku,
        p.category,
        p.unit,
        l.id as location_id,
        l.name as location_name,
        w.id as warehouse_id,
        w.name as warehouse_name,
        w.short_code as warehouse_code
      FROM stock s
      JOIN products p ON s.product_id = p.id
      JOIN locations l ON s.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE s.product_id = ?
      ORDER BY w.name, l.name
    `, [productId]);

    res.json({ stock });
  } catch (error) {
    console.error('Get stock by product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStock = await query(`
      SELECT 
        s.id,
        s.quantity,
        p.id as product_id,
        p.name as product_name,
        p.sku,
        l.id as location_id,
        l.name as location_name,
        w.id as warehouse_id,
        w.name as warehouse_name,
        w.short_code as warehouse_code
      FROM stock s
      JOIN products p ON s.product_id = p.id
      JOIN locations l ON s.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE s.quantity <= ?
      ORDER BY s.quantity ASC
    `, [threshold]);

    res.json({ lowStock, count: lowStock.length });
  } catch (error) {
    console.error('Get low stock alerts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update stock quantity (for manual adjustments)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, adjustment_reason } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    await transaction(async (connection) => {
      // Get current stock
      const [currentStock] = await connection.execute(
        'SELECT quantity, product_id, location_id FROM stock WHERE id = ?',
        [id]
      );

      if (currentStock.length === 0) {
        throw new Error('Stock record not found');
      }

      const oldQuantity = currentStock[0].quantity;
      const productId = currentStock[0].product_id;
      const locationId = currentStock[0].location_id;

      // Update stock
      await connection.execute(
        'UPDATE stock SET quantity = ? WHERE id = ?',
        [quantity, id]
      );

      // Create stock movement record
      const movementType = quantity > oldQuantity ? 'in' : 'out';
      const movementQuantity = Math.abs(quantity - oldQuantity);

      await connection.execute(`
        INSERT INTO stock_movements 
        (product_id, location_id, movement_type, quantity, reference_type, reference_id, created_by)
        VALUES (?, ?, ?, ?, 'manual_adjustment', ?, ?)
      `, [productId, locationId, movementType, movementQuantity, 0, req.user.id]);
    });

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Update stock error:', error);
    if (error.message === 'Stock record not found') {
      return res.status(404).json({ error: 'Stock record not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Get stock movements (audit trail)
export const getStockMovements = async (req, res) => {
  try {
    const { productId, locationId, limit = 50 } = req.query;
    
    let sql = `
      SELECT 
        sm.*,
        p.name as product_name,
        p.sku,
        l.name as location_name,
        w.name as warehouse_name,
        u.name as created_by_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      JOIN locations l ON sm.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      LEFT JOIN users u ON sm.created_by = u.id
    `;
    
    const params = [];
    const conditions = [];

    if (productId) {
      conditions.push('sm.product_id = ?');
      params.push(productId);
    }

    if (locationId) {
      conditions.push('sm.location_id = ?');
      params.push(locationId);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY sm.created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const movements = await query(sql, params);

    res.json({ movements });
  } catch (error) {
    console.error('Get stock movements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
