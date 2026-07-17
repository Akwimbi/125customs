// backend/routes/paystack.routes.js
// Paystack payment routes for 125Customs API
const express = require('express');
const router = express.Router();
const paystackService = require('../services/paystack.service');
const { protect } = require('../middleware/auth.middleware');
const { validateInitializePayment, validateVerifyPayment } = require('../middleware/paystackValidation');

// POST /api/paystack/initialize - Initialize payment (protected)
router.post('/initialize', protect, validateInitializePayment, async (req, res) => {
  try {
    const { email, amount, callbackUrl, metadata = {} } = req.body;
    // Ensure email matches authenticated user (optional)
    // if (req.user && req.user.email !== email) {
    //   return res.status(403).json({ success: false, error: 'Unauthorized' });
    // }

    const result = await paystackService.initializePayment({
      email,
      amount,
      callback_url: callbackUrl,
      metadata
    });

    res.json({
      success: true,
      message: 'Payment initialized',
      data: result
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
    const signature = req.headers['x-paystack-signature']; // Paystack uses x-paystack-signature header

    if (!signature) {
      return res.status(400).json({ success: false, error: 'Missing Paystack signature' });
    }

    const result = paystackService.handleWebhook(event, signature);

    // Depending on event type, we may update order status etc.
    // For now, just acknowledge.
    res.json({
      success: true,
      message: 'Webhook processed',
      data: result
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error.message === 'Invalid webhook signature') {
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
