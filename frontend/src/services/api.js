// frontend/src/services/api.js
// API Service for connecting frontend to backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

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
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
  getByCategory: (categoryId) => apiRequest(`/products?category=${categoryId}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`)
};

// Services API
export const servicesAPI = {
  getAll: () => apiRequest('/services'),
  getById: (id) => apiRequest(`/services/${id}`)
};

// Cart API
export const cartAPI = {
  get: (sessionId) => apiRequest(`/cart/${sessionId || 'default'}`),
  addItem: (sessionId, item) => apiRequest(`/cart/${sessionId || 'default'}/add`, {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  updateItem: (sessionId, itemId, updates) => apiRequest(`/cart/${sessionId || 'default'}/update`, {
    method: 'PATCH',
    body: JSON.stringify({ itemId, ...updates })
  }),
  removeItem: (sessionId, itemId) => apiRequest(`/cart/${sessionId || 'default'}/remove`, {
    method: 'DELETE',
    body: JSON.stringify({ itemId })
  }),
  clear: (sessionId) => apiRequest(`/cart/${sessionId || 'default'}/clear`, {
    method: 'DELETE'
  })
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getById: (id) => apiRequest(`/orders/${id}`)
};

// Quotes API
export const quotesAPI = {
  create: (quoteData) => apiRequest('/quotes', {
    method: 'POST',
    body: JSON.stringify(quoteData)
  })
};

export default {
  products: productsAPI,
  categories: categoriesAPI,
  services: servicesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  quotes: quotesAPI
};
