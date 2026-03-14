import { query } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

// Check if we're using mock database
const isMockDatabase = async () => {
  try {
    // Try to detect if we're using mock database
    const fs = await import('fs');
    const path = await import('path');
    const dbConfig = fs.readFileSync(path.join(process.cwd(), 'config', 'db.js'), 'utf8');
    return dbConfig.includes('db-mock.js');
  } catch {
    return false;
  }
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // For mock database, just return success
    if (await isMockDatabase()) {
      const user = {
        id: Date.now(),
        name,
        email,
        role: role || 'operator'
      };

      const token = generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
      return;
    }

    // Real MySQL database logic
    const bcrypt = await import('bcryptjs');
    
    // Check if user already exists
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );

    // Get created user
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // For mock database, use mock authentication
    if (await isMockDatabase()) {
      // Import mock authentication
      const { authenticateUser } = await import('../config/db-mock.js');
      const result = await authenticateUser(email, password);

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
      return;
    }

    // Real MySQL database logic
    const bcrypt = await import('bcryptjs');
    
    // Get user
    const users = await query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // For mock database, return default user
    if (await isMockDatabase()) {
      res.json({
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@coreinventory.com',
          role: 'admin'
        }
      });
      return;
    }

    // Real MySQL database logic
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
