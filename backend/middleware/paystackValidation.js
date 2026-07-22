// backend/middleware/paystackValidation.js
const Joi = require('joi');

/**
 * Schema for initializing payment
 * Expected body: { orderId }
 * Amount, email, and callback URL are all derived server-side from the
 * order record - never accepted from the client. This schema used to
 * require the opposite (email/amount/callbackUrl, and explicitly rejected
 * orderId), which meant every real request got rejected before the route's
 * own price-tampering protection ever ran.
 */
const initializePaymentSchema = Joi.object({
  orderId: Joi.number().integer().positive().required()
});

/**
 * Schema for verifying payment (params)
 */
const verifyPaymentSchema = Joi.object({
  reference: Joi.string().required()
});

/**
 * Middleware factory for validation
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @returns {function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || req.params || req.query, { abortEarly: false });
    if (error) {
      const details = error.details.map(detail => detail.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    next();
  };
}

module.exports = {
  validateInitializePayment: validate(initializePaymentSchema),
  validateVerifyPayment: validate(verifyPaymentSchema)
};