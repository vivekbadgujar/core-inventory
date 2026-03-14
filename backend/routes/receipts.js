import express from 'express';
import {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  updateReceiptStatus,
  deleteReceipt
} from '../controllers/receiptController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Get all receipts
router.get('/', authenticateToken, getAllReceipts);

// Get receipt by ID
router.get('/:id', authenticateToken, getReceiptById);

// Create receipt
router.post(
  '/',
  authenticateToken,
  authorize(['admin', 'manager', 'operator']),
  validate('receipt'),
  createReceipt
);

// Update receipt status
router.put(
  '/:id/status',
  authenticateToken,
  authorize(['admin', 'manager']),
  updateReceiptStatus
);

// Delete receipt (admin/manager only)
router.delete(
  '/:id',
  authenticateToken,
  authorize(['admin', 'manager']),
  deleteReceipt
);

export default router;
