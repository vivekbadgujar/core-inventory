import Joi from 'joi';

// Validation schemas
const schemas = {
  // User validation
  register: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 255 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Entered email is invalid',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'manager', 'operator').default('operator')
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Entered email is invalid',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  // Product validation
  product: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters'
    }),
    sku: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'SKU is required',
      'string.min': 'SKU must be at least 2 characters'
    }),
    category: Joi.string().max(100).optional(),
    unit: Joi.string().max(50).default('pcs')
  }),

  // Warehouse validation
  warehouse: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Warehouse name is required',
      'string.min': 'Warehouse name must be at least 2 characters'
    }),
    short_code: Joi.string().min(2).max(20).required().messages({
      'string.empty': 'Short code is required',
      'string.min': 'Short code must be at least 2 characters'
    }),
    address: Joi.string().max(500).optional()
  }),

  // Location validation
  location: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Location name is required',
      'string.min': 'Location name must be at least 2 characters'
    }),
    warehouse_id: Joi.number().integer().positive().required().messages({
      'number.base': 'Warehouse ID must be a number',
      'number.integer': 'Warehouse ID must be an integer',
      'number.positive': 'Warehouse ID must be positive'
    })
  }),

  // Receipt validation
  receipt: Joi.object({
    supplier: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Supplier is required',
      'string.min': 'Supplier must be at least 2 characters'
    }),
    scheduled_date: Joi.date().optional(),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.number().integer().positive().required().messages({
          'number.base': 'Product ID must be a number',
          'number.positive': 'Product ID must be positive'
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number',
          'number.integer': 'Quantity must be an integer',
          'number.min': 'Quantity must be at least 1'
        })
      })
    ).min(1).required().messages({
      'array.min': 'At least one item is required'
    })
  }),

  // Delivery validation
  delivery: Joi.object({
    customer: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Customer is required',
      'string.min': 'Customer must be at least 2 characters'
    }),
    scheduled_date: Joi.date().optional(),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.number().integer().positive().required().messages({
          'number.base': 'Product ID must be a number',
          'number.positive': 'Product ID must be positive'
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number',
          'number.integer': 'Quantity must be an integer',
          'number.min': 'Quantity must be at least 1'
        })
      })
    ).min(1).required().messages({
      'array.min': 'At least one item is required'
    })
  })
};

// Validation middleware
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : 
                 source === 'query' ? req.query : 
                 req.params;

    const { error, value } = schemas[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Replace request data with validated data
    if (source === 'body') req.body = value;
    else if (source === 'query') req.query = value;
    else req.params = value;

    next();
  };
};

// Custom validation for unique fields
export const validateUnique = async (table, field, value, excludeId = null) => {
  const { query } = await import('../config/db.js');
  
  let sql = `SELECT id FROM ${table} WHERE ${field} = ?`;
  let params = [value];

  if (excludeId) {
    sql += ' AND id != ?';
    params.push(excludeId);
  }

  const results = await query(sql, params);
  return results.length === 0;
};

// Middleware to check unique SKU
export const checkUniqueSKU = async (req, res, next) => {
  try {
    const isUnique = await validateUnique('products', 'sku', req.body.sku);
    if (!isUnique) {
      return res.status(400).json({ error: 'SKU must be unique' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check unique warehouse short code
export const checkUniqueShortCode = async (req, res, next) => {
  try {
    const isUnique = await validateUnique('warehouses', 'short_code', req.body.short_code);
    if (!isUnique) {
      return res.status(400).json({ error: 'Short code must be unique' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export default schemas;
