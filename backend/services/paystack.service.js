// backend/services/paystack.service.js
// Paystack payment integration (replaces M-Pesa Daraja)
const axios = require('axios');
require('dotenv').config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;
const BASE_URL = 'https://api.paystack.co';

/**
 * Initialize payment (M-Pesa, Card, or Bank Transfer)
 * @param {Object} params - email, amount (KES), callback_url, metadata
 * @returns {Promise<Object>} authorization_url, access_code, reference
 */
async function initializePayment({ email, amount, callback_url, metadata = {} }) {
  try {
    const response = await axios.post(
      `${BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo (KES * 100)
        callback_url,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'Phone Number',
              variable_name: 'phone',
              value: metadata.phone || ''
            }
          ]
        },
        channels: ['mobile_money', 'card', 'bank_transfer'] // Enable M-Pesa + Cards
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference
    };
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    throw new Error(`Payment initialization failed: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Verify payment (webhook or polling)
 * @param {string} reference - Paystack transaction reference
 * @returns {Promise<Object>} payment details
 */
async function verifyPayment(reference) {
  try {
    const response = await axios.get(
      `${BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const data = response.data.data;

    return {
      status: data.status, // 'success' | 'failed' | 'abandoned'
      reference: data.reference,
      amount: data.amount / 100, // Convert back to KES
      currency: data.currency,
      channel: data.channel, // 'mobile_money' | 'card'
      customer: data.customer,
      paid_at: data.paid_at,
      gateway_response: data.gateway_response
    };
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error(`Payment verification failed: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Handle webhook event
 * @param {Object} event - Paystack webhook payload
 * @param {string} signature - X-Paystack-Signature header
 * @returns {Object} processed event info
 */
function handleWebhook(event, signature) {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha512', PAYSTACK_WEBHOOK_SECRET)
    .update(event)
    .digest('hex');

  if (hash !== signature) {
    throw new Error('Invalid webhook signature');
  }

  // Process event
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    // Update order status in database (handled by route/controller)
    return { type: 'payment_success', reference };
  }

  return { type: 'unhandled_event', event: event.event };
}

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  createTransactionIfNotExists
};

// Create Paystack transaction record if it does not exist
async function createTransactionIfNotExists(transactionData) {
  const { orderId, reference, amount, channel, status } = transactionData;
  // Try to find existing transaction by reference
  let transaction = await prisma.paystackTransaction.findUnique({
    where: { reference }
  });
  if (!transaction) {
    transaction = await prisma.paystackTransaction.create({
      data: {
        orderId,
        reference,
        amount: Math.round(amount * 100), // amount in kobo
        channel,
        status
      }
    });
  }
  return transaction;
}
  initializePayment,
  verifyPayment,
  handleWebhook
