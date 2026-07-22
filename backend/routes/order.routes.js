// backend/routes/order.routes.js
// Order routes for 125Customs API
const express = require('express');
const router = express.Router();
const orderService = require('../services/order.service');
const { protect, admin, optionalAuth } = require('../middleware/auth.middleware');

// GET /api/orders - Get user's orders (protected)
router.get('/', protect, async (req, res) => {
  try {
    // Get orders for the current user
    const orders = await orderService.getOrdersByUser(req.user.id);
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// GET /api/orders/all - Get all orders (admin only)
router.get('/all', protect, admin, async (req, res) => {
  try {
    // Get all orders with pagination
    const { page = 1, limit = 10, status } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    
    const orders = await orderService.getAllOrders({
      ...filters,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      count: orders.length,
      orders,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// POST /api/orders - Create new order (supports guest + logged-in checkout)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, customerInfo, audienceType } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Items are required and must be an array' 
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shipping address is required' 
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment method is required' 
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and email are required'
      });
    }
    
    // Create order using order service. customerInfo comes from the request
    // body (works for both guest and logged-in checkout - the frontend
    // already collects/knows this). If a user is logged in (optionalAuth
    // populated req.user), attach their ID so the order shows up in their
    // account; otherwise it's a genuine guest order with userId: null.
    const order = await orderService.createOrder({
      userId: req.user?.id || null,
      audienceType: audienceType || req.user?.audienceType || 'both',
      customerInfo,
      shippingAddress,
      paymentMethod,
      items
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create order: ' + error.message 
    });
  }
});

// GET /api/orders/:id - Get order by ID (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    // Get order
    const order = await orderService.getOrderById(orderId);
    
    // Check if user owns this order (or is admin)
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to access this order' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order' 
    });
  }
});

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status' 
      });
    }
    
    // Update order status
    const order = await orderService.updateOrderStatus(orderId, status);
    
    res.json({
      success: true,
      message: 'Order status updated',
      orderId,
      status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update order status' 
    });
  }
});

module.exports = router;