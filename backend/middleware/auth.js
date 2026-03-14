import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Check if we're using mock database
const isMockDatabase = async () => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dbConfig = fs.readFileSync(path.join(process.cwd(), 'config', 'db.js'), 'utf8');
    return dbConfig.includes('db-mock.js');
  } catch {
    return false;
  }
};

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // For mock database, use simple token validation
    if (await isMockDatabase()) {
      if (token.startsWith('mock-jwt-token-')) {
        const parts = token.split('-');
        const userId = parseInt(parts[3]);
        
        // Mock user data
        req.user = {
          id: userId,
          name: 'Admin User',
          email: 'admin@coreinventory.com',
          role: 'admin'
        };
        next();
        return;
      } else {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // Real JWT verification for MySQL
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

// Role-based authorization
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (userId) => {
  // For mock database, generate mock token
  if (typeof userId === 'number' && userId < 100000) {
    return `mock-jwt-token-${userId}-${Date.now()}`;
  }
  
  // Real JWT token for MySQL
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
