import express from 'express';
import {
  getAllStock,
  getStockByProduct,
  getLowStockAlerts,
  updateStock,
  getStockMovements
} from '../controllers/stockController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Get all stock (public for demo)
router.get('/', getAllStock);

// Get stock by product ID
router.get('/product/:productId', getStockByProduct);

// Get low stock alerts
router.get('/alerts/low-stock', getLowStockAlerts);

// Get stock movements (audit trail)
router.get('/movements', getStockMovements);

// Update stock quantity (admin/manager only)
router.put(
  '/:id',
  authenticateToken,
  authorize(['admin', 'manager']),
  validate('product'), // Reuse product validation for quantity
  updateStock
);

export default router;
