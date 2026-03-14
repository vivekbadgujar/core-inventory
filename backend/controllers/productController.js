import { query, transaction } from '../config/db.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*, 
             COALESCE(SUM(s.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
      GROUP BY p.id
      ORDER BY p.name
    `);

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const products = await query(`
      SELECT p.*, 
             COALESCE(SUM(s.quantity), 0) as total_stock
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, unit } = req.body;

    const result = await query(
      'INSERT INTO products (name, sku, category, unit) VALUES (?, ?, ?, ?)',
      [name, sku, category, unit]
    );

    const products = await query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: products[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'SKU must be unique' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, unit } = req.body;

    // Check if product exists
    const existingProducts = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if SKU is unique (excluding current product)
    const existingSKU = await query('SELECT id FROM products WHERE sku = ? AND id != ?', [sku, id]);
    if (existingSKU.length > 0) {
      return res.status(400).json({ error: 'SKU must be unique' });
    }

    await query(
      'UPDATE products SET name = ?, sku = ?, category = ?, unit = ? WHERE id = ?',
      [name, sku, category, unit, id]
    );

    const products = await query('SELECT * FROM products WHERE id = ?', [id]);
    
    res.json({
      message: 'Product updated successfully',
      product: products[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProducts = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product has stock
    const stockRecords = await query('SELECT COUNT(*) as count FROM stock WHERE product_id = ?', [id]);
    if (stockRecords[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete product with existing stock records' });
    }

    await query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
