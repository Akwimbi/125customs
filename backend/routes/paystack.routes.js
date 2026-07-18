// backend/routes/paystack.routes.js
// Paystack payment routes for 125Customs API
const express = require('express');
const router = express.Router();
const paystackService = require('../services/paystack.service');
const orderService = require('../services/order.service');
const { protect } = require('../middleware/auth.middleware');
const { validateInitializePayment, validateVerifyPayment } = require('../middleware/paystackValidation');

// POST /api/paystack/initialize - Initialize payment (protected)
router.post('/initialize', validateInitializePayment, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    // Get the order
    let order;
    try {
      order = await orderService.getOrderById(orderId);
    } catch (err) {
      if (err.message === 'Order not found') {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      throw err;
    }

    // Authorization: if order belongs to a user, ensure it matches the authenticated user
    if (order.userId && req.user && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    // Ensure order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Order is not pending payment' });
    }

    // Initialize payment with Paystack
    const paymentResult = await paystackService.initializePayment({
      email: order.customerEmail,
      amount: order.totalAmount,
      callback_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payment/callback`,
      metadata: { orderId: order.id }
    });

    // Save the payment reference to the order
    await orderService.updateOrderPaymentReference(order.id, paymentResult.reference);

    res.json({
      success: true,
      message: 'Payment initialized',
      data: paymentResult
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/paystack/verify/:reference - Verify payment (protected)
router.get('/verify/:reference', protect, validateVerifyPayment, async (req, res) => {
  try {
    const { reference } = req.params;

    const result = await paystackService.verifyPayment(reference);

    res.json({
      success: true,
      message: 'Payment verified',
      data: result
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/paystack/webhook - Handle Paystack webhook (public)
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    const signature = req.headers['x-paystack-signature'];

    if (!signature) {
      return res.status(400).json({ success: false, error: 'Missing Paystack signature' });
    }

    const result = paystackService.handleWebhook(event, signature);

    if (result.type === 'payment_success') {
      const reference = result.reference;
      // Verify the payment with Paystack
      const verification = await paystackService.verifyPayment(reference);
      if (verification.status === 'success') {
        // Find order by paymentReference (we saved it during initialization)
        const order = await orderService.getOrderByPaymentReference(reference);
        if (!order) {
          console.error(`Order not found for payment reference: ${reference}`);
          return res.status(404).json({ success: false, error: 'Order not found' });
        }
        // Update order status to paid
        await orderService.updateOrderStatus(order.id, 'paid');
        // Create Paystack transaction record
        await paystackService.createTransactionIfNotExists({
          orderId: order.id,
          reference,
          amount: verification.amount / 100, // conversion from kobo to KES
          channel: verification.channel,
          status: verification.status
        });
      } else {
        console.warn(`Payment verification failed for reference: ${reference}`);
      }
    }

    res.json({ success: true, message: 'Webhook processed', data: result });
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error.message === 'Invalid webhook signature') {
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
