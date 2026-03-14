// API service for CoreInventory frontend

import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    console.error('Request details:', { endpoint, url: `${API_BASE_URL}${endpoint}` });
    
    // Provide more specific error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    
    if (error.message.includes('Access token required')) {
      throw new Error('Authentication required. Please login again.');
    }
    
    if (error.message.includes('Invalid token')) {
      throw new Error('Session expired. Please login again.');
    }
    
    if (error.message.includes('Authentication required')) {
      throw new Error('Please login to access this feature.');
    }
    
    // Re-throw the original error if it's already a user-friendly message
    if (error.message.includes('Cannot connect') || 
        error.message.includes('Authentication') || 
        error.message.includes('Session expired')) {
      throw error;
    }
    
    // Generic error for other cases
    throw new Error(error.message || 'An unexpected error occurred. Please try again.');
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return await apiRequest('/products');
  },

  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  create: async (productData) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stock API
export const stockAPI = {
  getAll: async () => {
    return await apiRequest('/stock');
  },

  getByProduct: async (productId) => {
    return await apiRequest(`/stock/product/${productId}`);
  },

  getLowStockAlerts: async (threshold = 10) => {
    return await apiRequest(`/stock/alerts/low-stock?threshold=${threshold}`);
  },

  getMovements: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/stock/movements?${params}`);
  },

  update: async (id, quantity, adjustmentReason) => {
    return await apiRequest(`/stock/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, adjustment_reason: adjustmentReason }),
    });
  },
};

// Receipts API
export const receiptsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/receipts?${params}`);
  },

  getById: async (id) => {
    return await apiRequest(`/receipts/${id}`);
  },

  create: async (receiptData) => {
    return await apiRequest('/receipts', {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/receipts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/receipts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Deliveries API
export const deliveriesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/deliveries?${params}`);
  },

  getById: async (id) => {
    return await apiRequest(`/deliveries/${id}`);
  },

  create: async (deliveryData) => {
    return await apiRequest('/deliveries', {
      method: 'POST',
      body: JSON.stringify(deliveryData),
    });
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/deliveries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/deliveries/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility function for handling API errors
export const handleApiError = (error) => {
  if (error.message.includes('token')) {
    authAPI.logout();
    window.location.href = '/login';
    return 'Session expired. Please login again.';
  }
  
  if (error.message.includes('validation')) {
    return 'Please check your input and try again.';
  }
  
  if (error.message.includes('Unauthorized')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('not found')) {
    return 'The requested resource was not found.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

// React hook for API requests
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default apiRequest;
