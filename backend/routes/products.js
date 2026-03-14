import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { validate, checkUniqueSKU } from '../middleware/validation.js';

const router = express.Router();

// Get all products (public for demo, in production add authenticateToken)
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create product (admin/manager only)
router.post(
  '/',
  authenticateToken,
  authorize(['admin', 'manager']),
  validate('product'),
  checkUniqueSKU,
  createProduct
);

// Update product (admin/manager only)
router.put(
  '/:id',
  authenticateToken,
  authorize(['admin', 'manager']),
  validate('product'),
  updateProduct
);

// Delete product (admin only)
router.delete(
  '/:id',
  authenticateToken,
  authorize(['admin']),
  deleteProduct
);

export default router;
