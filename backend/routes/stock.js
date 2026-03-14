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

// Update stock quantity (temporarily public for demo - should be protected in production)
router.put(
  '/:id',
  validate('stockUpdate'),
  updateStock
);

export default router;
