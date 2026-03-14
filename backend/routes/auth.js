import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Register user
router.post('/register', validate('register'), register);

// Login user
router.post('/login', validate('login'), login);

// Get current user (protected)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
