// frontend/src/services/api.js
// API Service for connecting frontend to backend

import { getAuthToken, getSessionId, setSessionId } from '../utils/storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token and session id
  const token = getAuthToken();
  const sessionId = getSessionId();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(sessionId ? { 'X-Session-Id': sessionId } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle 401 Unauthorized - redirect to login?
    if (response.status === 401) {
      // Optionally redirect to login page
      // window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Products API
const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
  getByCategory: (categoryId) => apiRequest(`/products?category=${categoryId}`)
};

// Categories API
const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`)
};

// Services API
const servicesAPI = {
  getAll: () => apiRequest('/services'),
  getById: (id) => apiRequest(`/services/${id}`)
};

// Cart API
const cartAPI = {
  // Get cart for session/user
  get: () => apiRequest('/cart'),
  // Create or replace cart (sync)
  sync: (items) => apiRequest('/cart', { method: 'POST', body: JSON.stringify({ items }) }),
  // Add item to cart
  addItem: (item) => apiRequest('/cart/items', { method: 'POST', body: JSON.stringify(item) }),
  // Update item quantity
  updateItem: (itemId, updates) => apiRequest(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ itemId, ...updates }) }),
  // Remove item from cart
  removeItem: (itemId) => apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' }),
  // Clear cart
  clear: () => apiRequest('/cart/clear', { method: 'POST' }),
  // Get cart summary (item count, subtotal)
  getSummary: () => apiRequest('/cart/summary')
};

// Orders API
const ordersAPI = {
  create: (orderData) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getById: (id) => apiRequest(`/orders/${id}`),
  getByUser: () => apiRequest('/orders'),
  // For admin: get all orders
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/orders/all${query ? `?${query}` : ''}`);
  }
};

// Quotes API
const quotesAPI = {
  create: (quoteData) => apiRequest('/quotes', { method: 'POST', body: JSON.stringify(quoteData) }),
  getById: (id) => apiRequest(`/quotes/${id}`),
  getByUser: () => apiRequest('/quotes')
};

export default {
// Paystack API
const paystackAPI = {
  initialize: (orderId) => apiRequest('/paystack/initialize', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verify: (reference) => apiRequest(`/paystack/verify/${reference}`)
};
  products: productsAPI,
  categories: categoriesAPI,
  services: servicesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  quotes: quotesAPI
};
module.exports = {productsAPI, categoriesAPI, servicesAPI, cartAPI, ordersAPI, quotesAPI, paystackAPI};
