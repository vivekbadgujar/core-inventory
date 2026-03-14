import express from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDeliveryStatus,
  deleteDelivery
} from '../controllers/deliveryController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Get all deliveries
router.get('/', authenticateToken, getAllDeliveries);

// Get delivery by ID
router.get('/:id', authenticateToken, getDeliveryById);

// Create delivery
router.post(
  '/',
  authenticateToken,
  authorize(['admin', 'manager', 'operator']),
  validate('delivery'),
  createDelivery
);

// Update delivery status
router.put(
  '/:id/status',
  authenticateToken,
  authorize(['admin', 'manager']),
  updateDeliveryStatus
);

// Delete delivery (admin/manager only)
router.delete(
  '/:id',
  authenticateToken,
  authorize(['admin', 'manager']),
  deleteDelivery
);

export default router;
