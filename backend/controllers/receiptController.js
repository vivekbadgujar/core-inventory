import { query, transaction } from '../config/db.js';

// Generate receipt reference
const generateReference = async () => {
  const year = new Date().getFullYear();
  const result = await query(`
    SELECT COUNT(*) as count FROM receipts 
    WHERE YEAR(created_at) = ?
  `, [year]);
  
  const count = result[0].count + 1;
  return `WH/IN/${String(count).padStart(4, '0')}`;
};

// Get all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        r.*,
        u.name as created_by_name,
        COUNT(ri.id) as item_count,
        SUM(ri.quantity) as total_quantity
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
    `;
    
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('r.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));

    const receipts = await query(sql, params);

    res.json({ receipts });
  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get receipt by ID with items
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get receipt details
    const receipts = await query(`
      SELECT 
        r.*,
        u.name as created_by_name
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `, [id]);

    if (receipts.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    // Get receipt items
    const items = await query(`
      SELECT 
        ri.*,
        p.name as product_name,
        p.sku,
        p.unit
      FROM receipt_items ri
      JOIN products p ON ri.product_id = p.id
      WHERE ri.receipt_id = ?
    `, [id]);

    res.json({
      receipt: receipts[0],
      items
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create receipt
export const createReceipt = async (req, res) => {
  try {
    const { supplier, scheduled_date, items } = req.body;
    const userId = req.user.id;

    const reference = await generateReference();

    await transaction(async (connection) => {
      // Create receipt
      const [receiptResult] = await connection.execute(`
        INSERT INTO receipts (reference, supplier, scheduled_date, status, created_by)
        VALUES (?, ?, ?, 'draft', ?)
      `, [reference, supplier, scheduled_date, userId]);

      const receiptId = receiptResult.insertId;

      // Create receipt items
      for (const item of items) {
        await connection.execute(`
          INSERT INTO receipt_items (receipt_id, product_id, quantity)
          VALUES (?, ?, ?)
        `, [receiptId, item.product_id, item.quantity]);
      }

      return receiptId;
    });

    res.status(201).json({
      message: 'Receipt created successfully',
      reference
    });
  } catch (error) {
    console.error('Create receipt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update receipt status
export const updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'ready', 'done', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await transaction(async (connection) => {
      // Get current receipt
      const [currentReceipt] = await connection.execute(
        'SELECT status FROM receipts WHERE id = ?',
        [id]
      );

      if (currentReceipt.length === 0) {
        throw new Error('Receipt not found');
      }

      const currentStatus = currentReceipt[0].status;

      // If validating receipt (status = 'done'), update stock
      if (status === 'done' && currentStatus !== 'done') {
        // Get receipt items
        const [items] = await connection.execute(`
          SELECT product_id, quantity FROM receipt_items WHERE receipt_id = ?
        `, [id]);

        // Update stock for each item
        for (const item of items) {
          const { product_id, quantity } = item;

          // Check if stock record exists for this product/location
          const [existingStock] = await connection.execute(`
            SELECT id, quantity FROM stock 
            WHERE product_id = ? AND location_id = 1
          `, [product_id]);

          if (existingStock.length > 0) {
            // Update existing stock
            await connection.execute(`
              UPDATE stock SET quantity = quantity + ? 
              WHERE id = ?
            `, [quantity, existingStock[0].id]);
          } else {
            // Create new stock record (default to location 1)
            await connection.execute(`
              INSERT INTO stock (product_id, location_id, quantity)
              VALUES (?, 1, ?)
            `, [product_id, quantity]);
          }

          // Create stock movement record
          await connection.execute(`
            INSERT INTO stock_movements 
            (product_id, location_id, movement_type, quantity, reference_type, reference_id, created_by)
            VALUES (?, 1, 'in', ?, 'receipt', ?, ?)
          `, [product_id, quantity, id, req.user.id]);
        }
      }

      // Update receipt status
      await connection.execute(
        'UPDATE receipts SET status = ? WHERE id = ?',
        [status, id]
      );
    });

    res.json({ message: 'Receipt status updated successfully' });
  } catch (error) {
    console.error('Update receipt status error:', error);
    if (error.message === 'Receipt not found') {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete receipt (only if status is 'draft')
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if receipt exists and is in draft status
    const receipts = await query('SELECT status FROM receipts WHERE id = ?', [id]);
    
    if (receipts.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    if (receipts[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete receipts with draft status' });
    }

    await transaction(async (connection) => {
      // Delete receipt items first (foreign key constraint)
      await connection.execute('DELETE FROM receipt_items WHERE receipt_id = ?', [id]);
      
      // Delete receipt
      await connection.execute('DELETE FROM receipts WHERE id = ?', [id]);
    });

    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Delete receipt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
