import { query, transaction } from '../config/db.js';

// Generate delivery reference
const generateReference = async () => {
  const year = new Date().getFullYear();
  const result = await query(`
    SELECT COUNT(*) as count FROM deliveries 
    WHERE YEAR(created_at) = ?
  `, [year]);
  
  const count = result[0].count + 1;
  return `WH/OUT/${String(count).padStart(4, '0')}`;
};

// Get all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        d.*,
        u.name as created_by_name,
        COUNT(di.id) as item_count,
        SUM(di.quantity) as total_quantity
      FROM deliveries d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN delivery_items di ON d.id = di.delivery_id
    `;
    
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('d.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
      GROUP BY d.id
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));

    const deliveries = await query(sql, params);

    res.json({ deliveries });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get delivery by ID with items
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get delivery details
    const deliveries = await query(`
      SELECT 
        d.*,
        u.name as created_by_name
      FROM deliveries d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = ?
    `, [id]);

    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Get delivery items
    const items = await query(`
      SELECT 
        di.*,
        p.name as product_name,
        p.sku,
        p.unit
      FROM delivery_items di
      JOIN products p ON di.product_id = p.id
      WHERE di.delivery_id = ?
    `, [id]);

    res.json({
      delivery: deliveries[0],
      items
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create delivery
export const createDelivery = async (req, res) => {
  try {
    const { customer, scheduled_date, items } = req.body;
    const userId = req.user.id;

    const reference = await generateReference();

    await transaction(async (connection) => {
      // Create delivery
      const [deliveryResult] = await connection.execute(`
        INSERT INTO deliveries (reference, customer, scheduled_date, status, created_by)
        VALUES (?, ?, ?, 'draft', ?)
      `, [reference, customer, scheduled_date, userId]);

      const deliveryId = deliveryResult.insertId;

      // Create delivery items and check stock availability
      for (const item of items) {
        // Check if enough stock is available
        const [stockCheck] = await connection.execute(`
          SELECT COALESCE(SUM(quantity), 0) as available_stock
          FROM stock 
          WHERE product_id = ?
        `, [item.product_id]);

        const availableStock = stockCheck[0].available_stock;

        if (availableStock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.product_id}. Available: ${availableStock}, Required: ${item.quantity}`);
        }

        // Create delivery item
        await connection.execute(`
          INSERT INTO delivery_items (delivery_id, product_id, quantity)
          VALUES (?, ?, ?)
        `, [deliveryId, item.product_id, item.quantity]);
      }

      return deliveryId;
    });

    res.status(201).json({
      message: 'Delivery created successfully',
      reference
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'ready', 'done', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await transaction(async (connection) => {
      // Get current delivery
      const [currentDelivery] = await connection.execute(
        'SELECT status FROM deliveries WHERE id = ?',
        [id]
      );

      if (currentDelivery.length === 0) {
        throw new Error('Delivery not found');
      }

      const currentStatus = currentDelivery[0].status;

      // If validating delivery (status = 'done'), update stock
      if (status === 'done' && currentStatus !== 'done') {
        // Get delivery items
        const [items] = await connection.execute(`
          SELECT product_id, quantity FROM delivery_items WHERE delivery_id = ?
        `, [id]);

        // Update stock for each item (FIFO - First In, First Out)
        for (const item of items) {
          const { product_id, quantity } = item;

          // Get stock records for this product, ordered by creation date (FIFO)
          const [stockRecords] = await connection.execute(`
            SELECT id, quantity FROM stock 
            WHERE product_id = ? AND quantity > 0
            ORDER BY created_at ASC
          `, [product_id]);

          let remainingQuantity = quantity;

          for (const stockRecord of stockRecords) {
            if (remainingQuantity <= 0) break;

            const deductQuantity = Math.min(remainingQuantity, stockRecord.quantity);

            // Update stock
            await connection.execute(`
              UPDATE stock SET quantity = quantity - ? 
              WHERE id = ?
            `, [deductQuantity, stockRecord.id]);

            remainingQuantity -= deductQuantity;

            // Create stock movement record
            await connection.execute(`
              INSERT INTO stock_movements 
              (product_id, location_id, movement_type, quantity, reference_type, reference_id, created_by)
              VALUES (?, (SELECT location_id FROM stock WHERE id = ?), 'out', ?, 'delivery', ?, ?)
            `, [product_id, stockRecord.id, deductQuantity, id, req.user.id]);
          }

          if (remainingQuantity > 0) {
            throw new Error(`Insufficient stock for product ID ${product_id}. Still need ${remainingQuantity} more units.`);
          }
        }
      }

      // Update delivery status
      await connection.execute(
        'UPDATE deliveries SET status = ? WHERE id = ?',
        [status, id]
      );
    });

    res.json({ message: 'Delivery status updated successfully' });
  } catch (error) {
    console.error('Update delivery status error:', error);
    
    if (error.message === 'Delivery not found') {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete delivery (only if status is 'draft')
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if delivery exists and is in draft status
    const deliveries = await query('SELECT status FROM deliveries WHERE id = ?', [id]);
    
    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (deliveries[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete deliveries with draft status' });
    }

    await transaction(async (connection) => {
      // Delete delivery items first (foreign key constraint)
      await connection.execute('DELETE FROM delivery_items WHERE delivery_id = ?', [id]);
      
      // Delete delivery
      await connection.execute('DELETE FROM deliveries WHERE id = ?', [id]);
    });

    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
